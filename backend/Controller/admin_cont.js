import { Institute } from "../Models/Institute.js";
import { deleteFiles, generatePassword, sendEmail, uploadFiles } from "../Utils/helperFun.js";
import { validateAdmin } from "../Utils/validation_check.js";
import argon2 from "argon2";
import { randomUUID } from "crypto";
import Admission from "../Models/Admission.js";
import { Student } from "../Models/Student.js";
import { studentAdmissionApprovedEmail } from "../Template/admissionApplicationApproved.js";
import { studentAdmissionRejectedEmail } from "../Template/admissionApplicationRejected.js";
import { studentAdmissionPaymentApprovedEmail } from "../Template/admissionPaymentApproved.js";
import { Fee } from "../Models/Fee.js";
import { studentPaymentRejectedEmail } from "../Template/studentPaymentRejectionMail.js";


// ===========================================
// Admin (Service Owner/Provider) Controllers
// ===========================================

export const checkAdminAccessCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

export const getInstituteData = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res, "instituteAddress instituteEmail instituteName institutePhone instituteType instituteId role approved");
        if (!isValid) return;

        let responseData;

        if (admin?.instituteId) {
            let institute = await Institute.findById(admin.instituteId);
            responseData = institute;
        } else {
            responseData = admin;
        }

        return res.json({ success: true, data: responseData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong." })
    }
}

export const SaveInstHeroImageCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        // -----------------------------------------
        // Upload new hero images
        // -----------------------------------------

        const imageTasks = [];

        for (let i = 1; i <= 5; i++) {
            const file = req.files?.[`heroImages${i}`]?.[0];

            if (file) {
                if (!file.mimetype.startsWith("image/")) {
                    return res.json({ success: false, message: "Hero images must be image files." });
                }
                imageTasks.push(
                    uploadFiles(file, "heroImages").then((result) => ({
                        name: `image${i}`,
                        imageUrl: result.url,
                        public_id: result.public_id
                    }))
                );
            }
        }

        const heroImages = await Promise.all(imageTasks);

        if ((!admin.instituteId || admin.instituteId == "") && heroImages.length === 0) {
            return res.json({ success: false, message: "Please upload at least one hero image." });
        }

        // -----------------------------------------
        // Create Institute
        // -----------------------------------------

        if (!admin.instituteId || admin.instituteId == "") {
            const institute = await Institute.create({
                adminId: admin._id,
                instituteName: admin.instituteName,
                instituteAddress: admin.instituteAddress,
                instituteEmail: admin.instituteEmail,
                institutePhone: admin.institutePhone,
                instituteType: admin.instituteType,
                instituteCity: admin.instituteCity,
                instituteProvince: admin.instituteProvince,
                adminApproved: admin.approved,
                registrationNumber: admin.registrationNumber,
                heroImages: heroImages,
            });

            institute.website =
                `${process.env.FRONTEND_URL}/${admin.instituteType}/${institute._id}`;

            await institute.save();
            admin.instituteId = institute._id;

        } else {
            // -----------------------------------------
            // Update existing Institute
            // -----------------------------------------

            const inst = await Institute.findById(admin.instituteId);

            if (!inst) {
                return res.json({
                    success: false,
                    message: "Institute not found."
                });
            }

            // Make sure existing images are an array
            const existingImages = Array.isArray(inst.heroImages)
                ? [...inst.heroImages]
                : [];

            // -----------------------------------------
            // Replace or add images
            // -----------------------------------------

            for (const newImage of heroImages) {
                const existingIndex = existingImages.findIndex(
                    (image) => image.name === newImage.name
                );

                if (existingIndex !== -1) {
                    // Delete old Cloudinary image
                    const oldImage = existingImages[existingIndex];

                    if (oldImage.public_id) {
                        await deleteFiles(oldImage.public_id);
                    }

                    // Replace old image
                    existingImages[existingIndex] = newImage;

                } else {
                    // Add new image
                    existingImages.push(newImage);
                }
            }

            // Save complete array
            inst.heroImages = existingImages;
            inst.website = `${process.env.FRONTEND_URL}/${inst.instituteType}/${inst._id}`;

            await inst.save();
        }

        await admin.save();

        return res.json({
            success: true,
            message: "Hero images saved successfully"
        });

    } catch (error) {
        console.error("SaveInstHeroImageCont Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const SaveBrandingImagesCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin?.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please save hero images first to initialize the institute profile." });
        }

        const institute = await Institute.findById(admin.instituteId);
        if (!institute) {
            return res.json({ success: false, message: "Institute not found." });
        }

        let brandingUpdated = false;

        // Process instituteLogo
        const logoFile = req.files?.["instituteLogo"]?.[0];
        if (logoFile) {
            if (!logoFile.mimetype.startsWith("image/")) {
                return res.json({ success: false, message: "Institute logo must be an image." });
            }
            if (institute.instituteLogo?.public_id) {
                await deleteFile(institute.instituteLogo.public_id);
            }
            const logoUpload = await uploadFiles(logoFile, "branding");
            institute.instituteLogo = {
                imageUrl: logoUpload.url,
                public_id: logoUpload.public_id
            };
            brandingUpdated = true;
        }

        // Process timeTableImage
        const timeTableFile = req.files?.["timeTableImage"]?.[0];
        if (timeTableFile) {
            if (!timeTableFile.mimetype.startsWith("image/")) {
                return res.json({ success: false, message: "Time table must be an image." });
            }
            if (institute.timeTableImage?.public_id) {
                await deleteFile(institute.timeTableImage.public_id);
            }
            const timeTableUpload = await uploadFiles(timeTableFile, "branding");
            institute.timeTableImage = {
                imageUrl: timeTableUpload.url,
                public_id: timeTableUpload.public_id
            };
            brandingUpdated = true;
        }

        if (brandingUpdated) {
            await institute.save();
            return res.json({ success: true, message: "Branding images saved successfully." });
        } else {
            return res.json({ success: false, message: "No images provided to upload." });
        }

    } catch (error) {
        console.error("SaveBrandingImagesCont Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const SaveQuickInfoCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin?.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please save hero images first." });
        }

        const {
            admissionStatus,
            board,
            classes,
            medium,
            gender
        } = req.body;

        if (!admissionStatus || !board || !classes || !medium || !gender) {
            return res.json({ success: false, message: "Please provide all quick info fields." });
        }

        let inst = await Institute.findById(admin.instituteId);

        if (!inst) {
            return res.json({ success: false, message: "Institute not found." });
        }

        inst.quickInfo = req.body;
        await inst.save();

        return res.json({ success: true, message: "Quick info saved successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const SaveAboutInfoCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin?.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please save hero images first." });
        }

        const {
            about,
            establishedYear,
            totalStudents,
            teachers,
            campusArea
        } = req.body;

        if (!about || !establishedYear || !totalStudents || !teachers || !campusArea) {
            return res.json({ success: false, message: "Please provide all about info fields." });
        }

        const aboutInfo = { about, establishedYear, totalStudents, teachers, campusArea };
        let inst = await Institute.findById(admin.instituteId);
        if (!inst) {
            return res.json({ success: false, message: "Institute not found." });
        }

        inst.aboutInfo = aboutInfo;
        await inst.save();

        return res.json({ success: true, message: "About info saved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const SaveAcademicProgramsCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin?.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please save hero images first." });
        }

        const academicPrograms = req.body;

        if (!academicPrograms || !Array.isArray(academicPrograms) || academicPrograms.length === 0) {
            return res.json({ success: false, message: "Please provide at least one academic program." });
        }

        const validPrograms = academicPrograms.every((program) => (
            program.id !== undefined &&
            program.class !== undefined && program.class !== "" &&
            program.duration &&
            Number.isFinite(Number(program.admissionFee)) && Number(program.admissionFee) >= 0 &&
            Number.isFinite(Number(program.monthlyFee)) && Number(program.monthlyFee) >= 0 &&
            ["OPEN", "CLOSE"].includes(program.admissionStatus)
        ));

        const uniqueProgramIds = new Set(academicPrograms.map((program) => String(program.id))).size === academicPrograms.length;

        if (!validPrograms || !uniqueProgramIds) {
            return res.json({ success: false, message: "Please provide valid academic programs with unique IDs." });
        }

        let inst = await Institute.findById(admin.instituteId);
        if (!inst) {
            return res.json({ success: false, message: "Institute not found." });
        }

        inst.academicPrograms = academicPrograms;
        await inst.save();

        return res.json({ success: true, message: "Academic programs saved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const SaveFacilitiesCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin?.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please save hero images first." });
        }

        const facilities = req.body;

        if (!facilities || !Array.isArray(facilities) || facilities.length === 0) {
            return res.json({ success: false, message: "Please provide at least one facility." });
        }

        const validFacilities = facilities.every((facility) => facility.id && facility.name?.trim());
        const uniqueFacilityIds = new Set(facilities.map((facility) => String(facility.id))).size === facilities.length;

        if (!validFacilities || !uniqueFacilityIds) {
            return res.json({ success: false, message: "Please provide valid facilities with unique IDs." });
        }

        let inst = await Institute.findById(admin.instituteId);
        if (!inst) {
            return res.json({ success: false, message: "Institute not found." });
        }

        inst.facilities = facilities;
        await inst.save();

        return res.json({ success: true, message: "Facilities saved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const SaveGalleryCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please save hero images first."
            });
        }

        const inst = await Institute.findById(admin.instituteId);

        if (!inst) {
            return res.json({
                success: false,
                message: "Institute not found."
            });
        }

        let keptGalleryIds = [];

        try {
            keptGalleryIds = JSON.parse(req.body.keptGalleryIds || "[]");
        } catch (error) {
            return res.json({ success: false, message: "Invalid gallery data." });
        }

        if (!Array.isArray(keptGalleryIds)) {
            return res.json({ success: false, message: "Invalid gallery data." });
        }

        const existingGallery = Array.isArray(inst.gallery) ? inst.gallery : [];
        const keptGallery = existingGallery.filter((image) => keptGalleryIds.includes(image.id));
        const removedGallery = existingGallery.filter((image) => !keptGalleryIds.includes(image.id));

        await Promise.all(removedGallery.map((image) => image.public_id ? deleteFiles(image.public_id) : Promise.resolve()));

        const uploadedFiles = Array.isArray(req.files) ? req.files : [];

        if (keptGallery.length + uploadedFiles.length === 0) {
            return res.json({ success: false, message: "Please keep or upload at least one gallery image." });
        }

        if (keptGallery.length + uploadedFiles.length > 10) {
            return res.json({ success: false, message: "You can save a maximum of 10 gallery images." });
        }

        if (uploadedFiles.some((file) => !file.mimetype.startsWith("image/"))) {
            return res.json({ success: false, message: "Gallery images must be image files." });
        }

        // Upload new gallery images
        const galleryImages = await Promise.all(
            uploadedFiles.map(async (file) => {
                const result = await uploadFiles(file, "gallery");

                return {
                    imageUrl: result.url,
                    public_id: result.public_id,
                    id: randomUUID()
                };
            })
        );

        inst.gallery = [...keptGallery, ...galleryImages];

        await inst.save();

        return res.json({
            success: true,
            message: "Gallery saved successfully"
        });

    } catch (error) {
        console.error("SaveGalleryCont Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const SaveFaqsCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin?.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please save hero images first." });
        }

        const faqs = req.body;

        if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
            return res.json({ success: false, message: "Please provide at least one FAQ." });
        }

        const validFaqs = faqs.every((faq) => faq.id && faq.question?.trim() && faq.answer?.trim());
        const uniqueFaqIds = new Set(faqs.map((faq) => String(faq.id))).size === faqs.length;

        if (!validFaqs || !uniqueFaqIds) {
            return res.json({ success: false, message: "Please provide valid FAQs with unique IDs." });
        }

        let inst = await Institute.findById(admin.instituteId);
        if (!inst) {
            return res.json({ success: false, message: "Institute not found." });
        }

        inst.faqs = faqs;
        await inst.save();

        return res.json({ success: true, message: "FAQs saved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const PublishInstituteCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please complete your institute profile first." });
        }

        const institute = await Institute.findById(admin.instituteId);

        if (!institute) {
            return res.json({ success: false, message: "Institute not found." });
        }

        institute.isPublished = true;
        await institute.save();

        return res.json({ success: true, message: "Institute published successfully." });
    } catch (error) {
        console.error("PublishInstituteCont Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const GetAdmissionApplicationsCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please complete your institute profile first." });
        }

        const applications = await Admission.find({ instituteId: admin.instituteId });
        return res.json({ success: true, applications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const GetApplicationByIdCont = async (req, res) => {
    try {
        const { id } = req.body;

        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please complete your institute profile first." });
        }

        const admission = await Admission.findById(id);
        if (!admission) {
            return res.json({ success: false, message: "Admission Application not found" });
        }

        return res.json({ success: true, application: admission });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const ApproveAdmissionCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please complete your institute profile first." });
        }

        const { id, addmonthlyFee } = req.body;
        const admission = await Admission.findById(id);
        if (!admission) {
            return res.json({ success: false, message: "Admission Application not found" });
        }

        if (admission.status === "APPROVED") {
            return res.json({ success: false, message: "Admission Application already approved" });
        }

        let institute = await Institute.findById(admin.instituteId);
        if (!institute) {
            return res.json({ success: false, message: "Institute not found" });
        }

        let monthlyFee = 0;

        if (addmonthlyFee) {
            institute?.academicPrograms?.filter((p, i) => {
                if (p.class === admission.applyingFor) {
                    monthlyFee = p.monthlyFee;
                }
            })
        }

        let stdPassword = generatePassword();
        let stdPasswordHash = await argon2.hash(stdPassword);
        let student = new Student({
            instituteId: institute._id,
            firstName: admission.firstName,
            lastName: admission.lastName,
            email: admission.email,
            phone: admission.phone,
            gender: admission.gender,
            dateOfBirth: admission.dateOfBirth,
            previousSchool: admission.previousSchool,
            lastQualification: admission.lastQualification,
            obtainedMarks: admission.obtainedMarks,
            totalMarks: admission.totalMarks,
            passingYear: admission.passingYear,
            class: admission.applyingFor,
            admissionFee: admission.admissionFee,
            monthlyFee: monthlyFee,
            guardianName: admission.guardianName,
            guardianPhone: admission.phone,
            guardianCnic: admission.guardianCnic,
            guardianRelation: admission.guardianRelation,
            documents: admission.documents,
            password: stdPasswordHash,
            approved: false, // track the whole application procee and will true when the Admission Payment is approved.
            status: "INACTIVE", // track account activationn and admin can change it anytime if the student not ay monthly and admission fee.
            admissionApplication: "APPROVED", // track the admission application.
            admissionApplicationId: admission._id,
        });

        let admissionReceiptData = {
            instName: institute.instituteName,
            instAddress: institute.instituteAddress,
            instPhone: institute.institutePhone,
            receiptNo: `AF-${Date.now()}`,
            date: new Date(),
            studentName: admission.firstName + " " + admission.lastName,
            studentId: student._id,
            class: admission.applyingFor,
            guardianName: admission.guardianName,
            guardianPhone: admission.phone,
            admissionFee: admission.admissionFee,
            monthlyFee: monthlyFee,
        }

        admission.status = "APPROVED";
        admission.paymentStatus = "NOT_SUBMITTED";
        admission.reviewedAt = Date.now();
        admission.studentId = student._id;
        admission.admissionReceipt = "GENERATED";
        admission.admissionReceiptData = admissionReceiptData;


        // Send email
        await sendEmail(admission.email, "Admission Application Approved.", studentAdmissionApprovedEmail({
            studentName: admission.firstName,
            instituteName: institute.instituteName,
            applyingFor: admission.applyingFor,
            email: admission.email,
            password: stdPassword,
            loginUrl: `${process.env.FRONTEND_URL}/auth/login`
        }));

        await student.save();
        await admission.save();

        return res.json({ success: true, message: "Admission approved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const DeleteAdmissionApplicationCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({ success: false, message: "Please complete your institute profile first." });
        }

        const { id } = req.body;
        const admission = await Admission.findById(id);
        if (!admission) {
            return res.json({ success: false, message: "Admission Application not found" });
        }

        let images = admission.documents;
        await Promise.all(images.map(async (img) => {
            if (img.publicId) {
                await deleteFiles(img.publicId);
            }
        }));

        if (admission?.studentId) {
            await Student.findByIdAndDelete(admission.studentId);
        }

        await Admission.findByIdAndDelete(id);
        return res.json({ success: true, message: "Admission application deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const RejectAdmissionCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        const { applicationId, rejectionReason } = req.body;
        const admission = await Admission.findById(applicationId);
        if (!admission) {
            return res.json({ success: false, message: "Admission Application not found" });
        }

        let student = await Student.findById(admission.studentId);
        if (student) {
            return res.json({ success: false, message: "Student already approved" });
        }

        admission.status = "REJECTED";
        if (admission.paymentStatus === "NOT_SUBMITTED") {
            admission.paymentStatus = "REJECTED";
        }
        admission.rejectionReason = rejectionReason;
        await admission.save();

        await sendEmail(admission.email, "Admission Application Rejected.", studentAdmissionRejectedEmail({
            studentName: admission.firstName + " " + admission.lastName,
            instituteName: admission.instituteName,
            rejectedFor: admission.applyingFor,
            reason: rejectionReason,
            supportContact: process.env.SUPPORT_EMAIL
        }));
        return res.json({ success: true, message: "Admission application rejected successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const GetStudentPaymentByIdCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        const { id } = req.body;
        const admission = await Admission.findById(id);
        return res.json({ success: true, student: admission });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal Server Error." })
    }
}

export const ApproveStudentPaymentCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        const { admissionId } = req.body;
        if (!admissionId) {
            return res.json({
                success: false,
                message: "Admission Application ID is required"
            });
        }
        const admission = await Admission.findById(admissionId);
        if (!admission) {
            return res.json({
                success: false,
                message: "Admission application not found"
            });
        }
        const studentId = admission.studentId;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        if (
            admission.adminId &&
            admission.adminId.toString() !== admin._id.toString()
        ) {
            return res.json({
                success: false,
                message: "You are not authorized to approve this payment"
            });
        }
        if (admission.isAdmissionCompleted) {
            return res.json({
                success: false,
                message: "Admission application has already been completed."
            });
        }
        if (admission.paymentStatus !== "SUBMITTED") {
            return res.json({
                success: false,
                message: `Payment cannot be approved because its current status is ${admission.paymentStatus}`
            });
        }
        if (student.approved && student.status === "ACTIVE") {
            return res.json({
                success: false,
                message: "Student is already active"
            });
        }

        admission.paymentReviewedAt = new Date();
        admission.rejectionReason = "";
        admission.isAdmissionCompleted = true;
        admission.paymentStatus = "PAID";
        student.approved = true;
        student.status = "ACTIVE";


        let firstMonthFee = null;
        const monthlyFee = Number(
            admission.admissionReceiptData?.monthlyFee || 0
        );
        const admissionFee = Number(
            admission.admissionReceiptData?.admissionFee || 0
        );

        student.feeRecord = [];

        if (monthlyFee > 0) {
            const now = new Date();
            const month = now.toLocaleString("en-US", {
                month: "long"
            });
            const year = now.getFullYear();
            firstMonthFee = await Fee.create({
                studentId: student._id,
                instituteId: student.instituteId,
                feeType: "MONTHLY",
                month,
                year,
                amount: monthlyFee,
                status: "PAID",
                paymentMethod: admission.paymentMethod || "",
                transactionId: admission.transactionId || "",
                submittedAt: admission.paymentSubmittedAt || now,
                reviewedAt: now,
                rejectionReason: "",
                paymentProof: {
                    title: `${month} monthly fee`,
                    imageUrl: admission.paymentProof?.imageUrl || "",
                    public_id: admission.paymentProof?.public_id || ""
                },
                paidAt: now,
                generatedAt: admission.admissionReceiptData.date,
                includedWithAdmission: true
            });

            if (!Array.isArray(student.feeRecord)) {
                student.feeRecord = [];
            }
            student.feeRecord.push({
                month,
                year,
                feeDocId: firstMonthFee._id
            });
        }

        await sendEmail(
            student.email,
            "Admission Completed Successfully",
            studentAdmissionPaymentApprovedEmail({
                studentName:
                    `${student.firstName} ${student.lastName}`,
                instituteName:
                    admission.instituteName,
                paymentAmount:
                    admissionFee +
                    (monthlyFee ? monthlyFee : 0),
                transactionId:
                    admission.transactionId,
                className:
                    admission.applyingFor,
                loginUrl:
                    `${process.env.FRONTEND_URL}/auth/login`
            })
        );
        await admission.save();
        await student.save();
        return res.json({
            success: true,
            message: "Payment approved successfully",
        });
    } catch (error) {
        console.error(
            "ApproveStudentPaymentCont:",
            error
        );
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

export const GetInstituteStudentsCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }

        const students = await Student.find({
            instituteId: admin.instituteId,
            admissionApplication: "APPROVED"
        });

        return res.json({
            success: true,
            students
        });
    } catch (error) {
        console.error("GetInstituteStudentsCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const GetStudentByIdCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }
        const { id } = req.body;
        if (!id) {
            return res.json({
                success: false,
                message: "Please provide student id"
            });
        }
        const student = await Student.findById(id);
        if (!student) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        if (student.instituteId != admin.instituteId) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        if (student.admissionApplication != "APPROVED") {
            return res.json({
                success: false,
                message: "Student not approved"
            });
        }
        const admission_application = await Admission.findById(student.admissionApplicationId);
        if (!admission_application) {
            return res.json({
                success: false,
                message: "Admission application not found"
            });
        }
        return res.json({
            success: true,
            student,
            admissionData: admission_application
        });
    } catch (error) {
        console.error("GetStudentByIdCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const SuspendTheStudentCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }
        const { id } = req.params;
        if (!id) {
            return res.json({
                success: false,
                message: "Student id is not available"
            });
        }
        const student = await Student.findById(id);
        if (!student) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        if (student.instituteId != admin.instituteId) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        if (student.admissionApplication != "APPROVED") {
            return res.json({
                success: false,
                message: "Student not approved"
            });
        }
        const admission_application = await Admission.findById(student.admissionApplicationId);
        if (!admission_application) {
            return res.json({
                success: false,
                message: "Admission application not found"
            });
        }

        student.status = "SUSPENDED";
        await student.save();

        return res.json({
            success: true,
            message: "Student suspended successfully"
        });
    } catch (error) {
        console.error("SuspendTheStudentCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const UnsuspendTheStudentCont = async (req,res)=>{
    try {
        const {isValid, admin} = await validateAdmin(req,res);
        if(!isValid) return;
        if(!admin.instituteId || admin.instituteId == ""){
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }
        const {id} = req.params;
        if(!id){
            return res.json({
                success: false,
                message: "Student id is not available"
            });
        }
        const student = await Student.findById(id);
        if(!student){
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        if(student.instituteId != admin.instituteId){
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        if(student.admissionApplication != "APPROVED"){
            return res.json({
                success: false,
                message: "Student not approved"
            });
        }
        const admission_application = await Admission.findById(student.admissionApplicationId);
        if(!admission_application){
            return res.json({
                success: false,
                message: "Admission application not found"
            });
        }

        student.status = "ACTIVE";
        await student.save();

        return res.json({
            success: true,
            message: "Student unsuspended successfully"
        });
    } catch (error) {
        console.error("UnsuspendTheStudentCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const GetInstFeesRecordCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }

        const fees = await Fee.find({
            instituteId: admin.instituteId
        }).populate("studentId", "_id firstName lastName class email phone")
            .populate("instituteId", "_id instituteName instituteAddress institutePhone instituteType academicPrograms");

        return res.json({
            success: true,
            fees
        });
    } catch (error) {
        console.error("GetInstFeesRecordCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const GenerateMonthlyFeeCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }
        const { feeOfClass, month, year } = req.body;
        if (!feeOfClass) {
            return res.json({
                success: false,
                message: "Please provide class"
            });
        }
        const students = await Student.find({
            instituteId: admin.instituteId,
            admissionApplication: "APPROVED",
            class: feeOfClass
        });

        if (!students) {
            return res.json({
                success: false,
                message: "No students found"
            });
        }

        let institutePrograms = await Institute.findById(admin.instituteId).select("academicPrograms");

        if (!institutePrograms) {
            return res.json({
                success: false,
                message: "Institute not found"
            });
        }

        // Fee Alraedy Generated?
        for (const student of students) {
            let feeExsist = student?.feeRecord?.filter((fee) => String(fee.month).toLowerCase() === String(month).toLowerCase() && String(fee.year).toLowerCase() === String(year).toLowerCase())[0];
            if (feeExsist) {
                return res.json({
                    success: false,
                    message: ` ${month} ${year} fee already generated for all students of ${student.class} class.`
                });
            }
        }

        for (const student of students) {
            let fee = institutePrograms.academicPrograms.filter((program) => String(program.class).toLowerCase() === String(feeOfClass).toLowerCase())[0].monthlyFee;
            if (!fee) {
                return res.json({
                    success: false,
                    message: "Program not found"
                });
            }
            let feeDoc = await Fee.create({
                studentId: student._id,
                instituteId: admin.instituteId,
                class: student.class,
                month,
                year,
                amount: fee,
                status: "NOT_PAID",
                generatedAt: new Date()
            });
            student.feeRecord.push({
                month,
                year,
                feeDocId: feeDoc._id
            });
            await student.save();
        }
        return res.json({
            success: true
        });
    } catch (error) {
        console.log("GenerateMonthlyFeeCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const GenerateFeeForStudentCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }
        const { id, month, year } = req.body;
        if (!id) {
            return res.json({
                success: false,
                message: "Please provide student id"
            });
        }
        const student = await Student.findById(id);
        if (!student) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        if (student.instituteId != admin.instituteId) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        if (student.admissionApplication != "APPROVED") {
            return res.json({
                success: false,
                message: "Student not approved"
            });
        }

        let institutePrograms = await Institute.findById(admin.instituteId).select("academicPrograms");

        if (!institutePrograms) {
            return res.json({
                success: false,
                message: "Institute not found"
            });
        }

        let fee = institutePrograms.academicPrograms.filter((program) => String(program.class).toLowerCase() === String(student.class).toLowerCase())[0].monthlyFee;
        if (!fee) {
            return res.json({
                success: false,
                message: "Program not found"
            });
        }

        // Check Fee Exsist?
        let feeExsist = student?.feeRecord?.filter((fee) => String(fee.month).toLowerCase() === String(month).toLowerCase() && String(fee.year).toLowerCase() === String(year).toLowerCase())[0];
        if (feeExsist) {
            return res.json({
                success: false,
                message: ` ${month} ${year} fee already generated for ${student.firstName + " " + student.lastName}.`
            });
        }

        let feeDoc = await Fee.create({
            studentId: student._id,
            instituteId: admin.instituteId,
            class: student.class,
            month,
            year,
            amount: fee,
            status: "NOT_PAID",
            generatedAt: new Date()
        });
        student.feeRecord.push({
            month,
            year,
            feeDocId: feeDoc._id
        });
        await student.save();

        return res.json({
            success: true,
            message: `${month} ${year} fee generated successfully for ${student.firstName + " " + student.lastName}.`
        });
    } catch (error) {
        console.error("GetStudentByIdCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const RejectFeePaymentCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }

        let { id } = req.params;

        let { reason } = req.body;

        let feeDoc = await Fee.findById(id);

        if (!feeDoc) {
            return res.json({
                success: false,
                message: "Fee Data not found"
            });
        }

        if (feeDoc.status == "PAID") {
            return res.json({
                success: false,
                message: "Payment already approved"
            });
        }

        if (feeDoc.status == "REJECTED") {
            return res.json({
                success: false,
                message: "Payment already rejected"
            });
        }

        feeDoc.rejectionReason = reason;
        feeDoc.status = "REJECTED";
        await feeDoc.save();

        return res.json({
            success: true, 
            message: "Payment rejected successfully."
        });
    } catch (error) {
        console.error("RejectFeePaymentCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const ApproveMonthlyFeePaymentCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }

        let { id } = req.body;

        let feeDoc = await Fee.findById(id);

        if (!feeDoc) {
            return res.json({
                success: false,
                message: "Fee Data not found"
            });
        }

        feeDoc.status = "PAID";
        feeDoc.reviewedAt = Date.now();

        feeDoc.save();
        return res.json({
            success: true,
            message: "Fee Approved Successfully."
        });

    } catch (error) {
        console.log("ApproveMonthlyFeeCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const GetStudentDataForCertificateCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        if (!admin.instituteId || admin.instituteId == "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }
        let { id } = req.body;
        let student = await Student.findById(id).select("_id firstName lastName class email phone guardianName");
        if (!student) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }
        let institute = await Institute.findById(admin.instituteId).select("_id instituteName instituteAddress institutePhone instituteType");
        if (!institute) {
            return res.json({
                success: false,
                message: "Institute not found"
            });
        }
        return res.json({
            success: true,
            data: {
                student,
                institute
            }
        });
    } catch (error) {
        console.log("GetStudentDataForCertificateCont:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export const UpdateRejectedStudentApplicationCont = async (req, res) => {
    try {
        // =========================================
        // ADMIN VALIDATION
        // =========================================
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;
        if (!admin.instituteId || admin.instituteId === "") {
            return res.json({
                success: false,
                message: "Please complete your institute profile first."
            });
        }
        // ========================================
        // GET FORM DATA
        // =========================================
        const editedFields = JSON.parse(
            req.body.editedFields || "{}"
        );
        const editedDocTitles = req.body.editedDocTitles;
        const { id } = editedFields;
        if (!id) {
            return res.json({
                success: false,
                message: "Application ID is required."
            });
        }
        // =========================================
        // FIND APPLICATION
        // =========================================
        const admission = await Admission.findById(id);
        if (!admission) {
            return res.json({
                success: false,
                message: "Application not found."
            });
        }
        // =========================================
        // CHECK WHAT IS REJECTED
        // =========================================
        const applicationRejected =
            admission.status === "REJECTED";
        const paymentRejected =
            admission.paymentStatus === "REJECTED";
        if (!applicationRejected && !paymentRejected) {
            return res.json({
                success: false,
                message: "This application cannot be edited."
            });
        }
        // =====================================================
        // 1. APPLICATION CORRECTION
        // =====================================================
        if (applicationRejected) {
            admission.firstName =
                editedFields.firstName;
            admission.lastName =
                editedFields.lastName;
            admission.email =
                editedFields.email;
            admission.phone =
                editedFields.phone;
            admission.gender =
                editedFields.gender;
            admission.dateOfBirth =
                editedFields.dateOfBirth;
            // =========================================
            // ACADEMIC INFORMATION
            // =========================================
            admission.previousSchool =
                editedFields.previousSchool;
            admission.lastQualification =
                editedFields.lastQualification;
            admission.obtainedMarks =
                editedFields.obtainedMarks;
            admission.totalMarks =
                editedFields.totalMarks;
            admission.passingYear =
                editedFields.passingYear;
            admission.applyingFor =
                editedFields.applyingFor;
            // =========================================
            // GUARDIAN INFORMATION
            // =========================================
            admission.guardianName =
                editedFields.guardianName;
            admission.guardianPhone =
                editedFields.guardianPhone;
            admission.guardianCnic =
                editedFields.guardianCnic;
            admission.guardianRelation =
                editedFields.guardianRelation;
            // =========================================
            // REPLACED STUDENT DOCUMENTS
            // =========================================
            if (
                editedDocTitles &&
                req.files?.length
            ) {
                const titles = Array.isArray(editedDocTitles)
                    ? editedDocTitles
                    : [editedDocTitles];
                // Only take files coming from "editedDoc"
                const documentFiles = req.files.filter(
                    (file) =>
                        file.fieldname === "editedDoc"
                );
                for (
                    let i = 0;
                    i < documentFiles.length;
                    i++
                ) {
                    const file = documentFiles[i];
                    const title = titles[i];
                    if (!file || !title) {
                        continue;
                    }
                    // Find the existing document
                    const document =
                        admission.documents.find(
                            (item) =>
                                item.title === title
                        );
                    if (!document) {
                        continue;
                    }
                    // Upload new document
                    const result =
                        await uploadFiles(
                            file,
                            "student_docs"
                        );
                    // Delete old Cloudinary file
                    if (document.publicId) {
                        await deleteFiles(
                            document.publicId
                        );
                    }
                    // Update document
                    document.imageUrl =
                        result.secure_url;
                    document.publicId =
                        result.public_id;
                }
                admission.markModified(
                    "documents"
                );
            }
            // =========================================
            // APPLICATION GOES BACK FOR REVIEW
            // =========================================
            admission.status = "PENDING";
            admission.reviewedAt = null;
        }
        // =====================================================
        // 2. PAYMENT CORRECTION
        // =====================================================
        if (paymentRejected) {
            admission.paymentMethod =
                editedFields.paymentMethod || "";
            admission.transactionId =
                editedFields.transactionId || "";
            admission.paymentSubmittedAt =
                editedFields.paymentSubmittedAt || null;
            // =========================================
            // NEW PAYMENT PROOF
            // =========================================
            const paymentFile =
                req.files?.find(
                    (file) =>
                        file.fieldname === "paymentProof"
                );
            if (paymentFile) {
                const result =
                    await uploadFiles(
                        paymentFile,
                        "paymentProof"
                    );
                // Delete old payment proof
                if (
                    admission.paymentProof &&
                    admission.paymentProof.public_id
                ) {
                    await deleteFiles(
                        admission.paymentProof.public_id
                    );
                }
                // Save new payment proof
                admission.paymentProof = {
                    title: "Admission fee",
                    imageUrl: result.secure_url,
                    public_id: result.public_id
                };
            }
            // =========================================
            // PAYMENT GOES BACK FOR REVIEW
            // =========================================
            admission.paymentStatus = "SUBMITTED";
            admission.paymentReviewedAt = null;
        }
        // =====================================================
        // CLEAR OLD REJECTION REASON
        // =====================================================
        admission.rejectionReason = "";
        // =====================================================
        // SAVE
        // =====================================================
        await admission.save();
        // =====================================================
        // RESPONSE
        // =====================================================
        return res.json({
            success: true,
            message: "Corrections submitted successfully."
        });
    } catch (error) {
        console.log(
            "UpdateRejectedStudentApplicationCont Error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

export const GetAdminProfileCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        return res.json({ success: true, admin });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const RejectStudentPaymentCont = async (req, res) => {
    try {
        const { isValid, admin } = await validateAdmin(req, res);
        if (!isValid) return;

        let { id, reason } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Payment ID is required" });
        }

        let feeTransaction = await Admission.findById(id);
        let paymentType = "Admission";
        let studentId = feeTransaction.studentId;
        if (!feeTransaction) {
            feeTransaction = await Fee.findById(id);
            paymentType = "Fee";
            studentId = feeTransaction.studentId;
        }

        if (!feeTransaction) {
            return res.json({ success: false, message: "Transaction not found" });
        }

        let student = await Student.findById(studentId).populate("instituteId", "instituteName");
        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        if (!reason || reason == "") {
            return res.json({ success: false, message: "Rejection reason is required" });
        }

        if (paymentType == "Fee") {
            feeTransaction.status = "REJECTED";
            feeTransaction.reviewedAt = Date.now();
            feeTransaction.rejectionReason = reason;
        } else {
            feeTransaction.paymentStatus = "REJECTED";
            feeTransaction.rejectionReason = reason;
            feeTransaction.reviewedAt = Date.now();
        }

        await sendEmail(
            student.email,
            `Payment Rejection - ${student?.instituteId?.instituteName}`,
            studentPaymentRejectedEmail(
                student.firstName + " " + student.lastName,
                student?.instituteId?.instituteName,
                paymentType,
                reason,
                `${process.env.FRONTEND_URL}/auth/login`)
        );

        await feeTransaction.save();
        return res.json({ success: true, message: "Payment rejected successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}