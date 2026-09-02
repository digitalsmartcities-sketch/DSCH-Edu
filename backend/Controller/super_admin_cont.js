import Admin from "../Models/Admin.js";
import { Institute } from "../Models/Institute.js";
import { adminApprovalEmail } from "../Template/adminApprovedEmail.js";
import { adminRejectedEmail } from "../Template/adminRejectedEmail.js";
import { deleteFiles, sendEmail, uploadFiles } from "../Utils/helperFun.js";
import { validateSuperAdmin } from "../Utils/validation_check.js";
import Course from "../Models/Course.js";
import CourseEnrollment from "../Models/CourseEnrollment.js";
import { courseEnrollmentApprovedEmail } from "../Template/courseEnrollmentApprovedEmail.js";
import { courseEnrollmentRejectedEmail } from "../Template/courseEnrollmentRejectedEmail.js";
// =================================
// Super Admin Controllers
// =================================

export const checkSuperAdminAccessCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

export const getAdminApplicationsCont = async (req, res) => {
    try {
        const { status } = req.query;
        if (status === "PENDING") {
            const pendingApplications = await Admin.find({ status: "PENDING", role: "admin" });
            return res.json({ success: true, applications: pendingApplications });
        }

        if (status === "APPROVED") {
            const approvedApplications = await Admin.find({ status: "APPROVED", role: "admin" });
            return res.json({ success: true, applications: approvedApplications });
        }

        if (status === "REJECTED") {
            const rejectedApplications = await Admin.find({ status: "REJECTED", role: "admin" });
            return res.json({ success: true, applications: rejectedApplications });
        }

        const allApplications = await Admin.find({ role: "admin" });
        return res.json({ success: true, applications: allApplications });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getAdminByIdCont = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Admin ID is required" });
        }

        const admin = await Admin.findById(id);

        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }

        return res.json({ success: true, admin });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const approveAdminCont = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Admin ID is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }
        admin.approved = true;
        await sendEmail(admin.email, "Application Approved", adminApprovalEmail(admin.ownerName, admin.instituteName, admin.email, `${process.env.FRONTEND_URL}/auth/login`));
        await admin.save();
        return res.json({ success: true, message: "Application approved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const rejectAdminCont = async (req, res) => {
    try {
        const { id, reason } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Admin ID is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }
        admin.rejected = true;
        await sendEmail(admin.email, "Application Rejected", adminRejectedEmail(admin.ownerName, admin.instituteName, reason,));
        await admin.save();
        return res.json({ success: true, message: "Application rejected successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const UpdateRejectedAdminApplicationCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const editedFields = JSON.parse(req.body.editedFields);
        const editedDocTitles = req.body.editedDocTitles;

        const { id } = editedFields;
        if (!id) {
            return res.json({ success: false, message: "Admin ID is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }

        if (admin.approved) {
            return res.json({ success: false, message: "Application is already approved" });
        }

        if (editedDocTitles && req.files?.length) {
            const titles = Array.isArray(editedDocTitles)
                ? editedDocTitles
                : [editedDocTitles];
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const title = titles[i];
                if (!file || !title) continue;
                const doc = admin.images.find(
                    (item) => item.title === title
                );
                if (!doc) {
                    continue;
                }
                const result = await uploadFiles(file, "admin_docs");
                if (doc.publicId) {
                    await deleteFiles(doc.publicId);
                }
                doc.imageUrl = result.secure_url;
                doc.publicId = result.public_id;
            }
            // IMPORTANT because images is type: Array
            admin.markModified("images");
            await admin.save();
        }

        for (const key in editedFields) {
            if (key === "id") {
                continue;
            }
            admin[key] = editedFields[key];
        }
        admin.rejected = false;
        await admin.save();
        return res.json({ success: true, message: "Application updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const disableAdminCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Admin ID is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }

        let institutes = await Institute.find({ adminId: id });
        if (institutes.length > 0) {
            institutes.map(async (institute) => {
                institute.adminApproved = false;
                institute.isPublished = false;
                await institute.save();
            })
        }
        admin.disabled = true;
        await admin.save();
        return res.json({ success: true, message: "Admin disabled successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const enableAdminCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Admin ID is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }
        let institutes = await Institute.find({ adminId: id });
        if (institutes.length > 0) {
            institutes.map(async (institute) => {
                institute.adminApproved = true;
                institute.isPublished = true;
                await institute.save();
            })
        }
        admin.disabled = false;
        await admin.save();
        return res.json({ success: true, message: "Admin enabled successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const createCourseCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        for (const key in req.body) {
            if (Array.isArray(req.body[key])) {
                if (req.body[key].length === 0) {
                    return res.json({ success: false, message: `${key} All fields are required` });
                }
            }
            if (req.body[key] === "" || req.body[key] === undefined) {
                return res.json({ success: false, message: `${key} All fields are required` });
            }
        }

        const courseExists = await Course.findOne({ courseCode: req.body.courseCode, title: req.body.title });
        if (courseExists) {
            return res.json({ success: false, message: "Course already exists" });
        }

        await Course.create({
            title: req.body.title,
            courseCode: req.body.courseCode,
            category: req.body.category,
            shortDescription: req.body.shortDescription,
            description: req.body.description,
            level: req.body.level,
            mode: req.body.mode,
            duration: req.body.duration,
            whatsappGroupLink: req.body.whatsappGroupLink,
            learningOutcomes: req.body.learningOutcomes,
            requirements: req.body.requirements,
            targetAudience: req.body.targetAudience,
            certificateAvailable: req.body.certificateAvailable,
            modules: req.body.modules,
            thumbnail: req.body.thumbnail,
            offeredByInstitute: req.body.offeredByInstitute,
            offeredByInstituteLogoUrl: req.body.offeredByInstituteLogoUrl,
            enrollmentOpen: req.body.enrollmentOpen,
            maxStudents: req.body.maxStudents,
            enrollmentStart: req.body.enrollmentStart || Date.now(),
            enrollmentEnd: req.body.enrollmentEnd || null,
            price: req.body.price || 1000,
            certificateAvailable: req.body.certificateAvailable,
            language: req.body.language || "English",
            status: "PUBLISHED",
        });

        return res.json({ success: true, message: "Course created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getAllCoursesEnrollmentsCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;
        const enrollments = await CourseEnrollment.find().select("fullName email phone courseId courseTitle courseCode courseProvider payment status createdAt");
        return res.json({ success: true, enrollments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getEnrollmentByIdCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;
        const { id } = req.params;
        const enrollment = await CourseEnrollment.findById(id);
        if (!enrollment) {
            return res.json({ success: false, message: "Enrollment not found" });
        }
        return res.json({ success: true, enrollment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const ApproveCourseEnrollmentCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;
        const { id } = req.params;
        const enrollment = await CourseEnrollment.findById(id);
        if (!enrollment) {
            return res.json({ success: false, message: "Enrollment not found" });
        }
        enrollment.status = "APPROVED";
        enrollment.payment.status = "PAID";
        enrollment.payment.reviewedAt = Date.now();
        let course = await Course.findById(enrollment.courseId);
        if (!course) {
            return res.json({ success: false, message: "Course not found" });
        }
        course.studentEnrolled += 1;
        await sendEmail(
            enrollment.email,
            "Enrollment Approved",
            courseEnrollmentApprovedEmail({
                studentName: enrollment.fullName,
                courseTitle: enrollment.courseTitle,
                courseCode: enrollment.courseCode,
                instituteName: course.offeredByInstitute,
                whatsappGroupLink: course.whatsappGroupLink,
            })
        )

        await course.save();
        await enrollment.save();
        return res.json({ success: true, message: "Enrollment approved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const RejectCourseEnrollmentCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;
        const { id } = req.params;
        const { reason } = req.body;
        const enrollment = await CourseEnrollment.findById(id);
        if (!enrollment) {
            return res.json({ success: false, message: "Enrollment not found" });
        }
        if (!reason) {
            return res.json({ success: false, message: "Reason is required" });
        }

        enrollment.status = "REJECTED";
        enrollment.payment.status = "REJECTED";
        enrollment.payment.reviewedAt = Date.now();
        let course = await Course.findById(enrollment.courseId);
        if (!course) {
            return res.json({ success: false, message: "Course not found" });
        }
        course.studentEnrolled -= 1;
        await sendEmail(
            enrollment.email,
            "Enrollment Rejected",
            courseEnrollmentRejectedEmail({
                studentName: enrollment.fullName,
                courseTitle: enrollment.courseTitle,
                reason: reason
            })
        )

        await course.save();
        await enrollment.save();
        return res.json({ success: true, message: "Enrollment rejected successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const resubmitCourseEnrollmentPaymentCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return res.json({ success: false, message: "Unauthorized" });

        const { id } = req.params;
        const enrollment = await CourseEnrollment.findById(id);
        if (!enrollment) {
            return res.json({ success: false, message: "Enrollment not found" });
        }
        let { editedFields } = req.body;
        editedFields = JSON.parse(editedFields);
        let paymentImg = req.file || "";
        if (paymentImg) {
            let oldPaymentProof = enrollment.payment.paymentProof.publicId;
            await deleteFiles(oldPaymentProof);
            let uploaded = await uploadFiles(paymentImg, "courseEnrollmentPayment");
            enrollment.payment.paymentProof = {
                title: enrollment.payment.paymentProof.title,
                imageUrl: uploaded.secure_url,
                publicId: uploaded.public_id
            };
        }
        for (const key in enrollment) {
            if (key == "payment") {
                if (editedFields?.payment?.transactionId) {
                    enrollment.payment.transactionId = editedFields.payment.transactionId;
                }
                continue;
            }
            if (editedFields[key]) {
                enrollment[key] = editedFields[key]
            }
        }
        enrollment.status = "PENDING";
        enrollment.payment.status = "PENDING";
        enrollment.payment.reviewedAt = null;
        let course = await Course.findById(enrollment.courseId);
        if (!course) {
            return res.json({ success: false, message: "Course not found" });
        }
        await course.save();
        await enrollment.save();
        return res.json({ success: true, message: "Enrollment payment resubmitted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getCertificateDataByIdCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return res.json({ success: false, message: "Unauthorized" });

        const { id } = req.params;
        const enrollment = await CourseEnrollment.findById(id);
        if (!enrollment) {
            return res.json({ success: false, message: "Enrollment not found" });
        }
        const course = await Course.findById(enrollment.courseId);
        if (!course) {
            return res.json({ success: false, message: "Course not found" });
        }
        let responseData = {
            student: {
                fullName: enrollment.fullName,
            },
            course: {
                title: course.title,
                courseCode: course.courseCode,
                offeredByInstitute: course.offeredByInstitute,
                offeredByInstituteLogoUrl: course.offeredByInstituteLogoUrl,
                certificateIssuedAt: Date.now()
            }
        };
        enrollment.certificateIssued = true;
        await enrollment.save();
        return res.json({ success: true, responseData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}