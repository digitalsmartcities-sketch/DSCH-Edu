import Admin from "../Models/Admin.js";
import { Institute } from "../Models/Institute.js";
import { adminApprovalEmail } from "../Template/adminApprovedEmail.js";
import { adminRejectedEmail } from "../Template/adminRejectedEmail.js";
import { deleteFiles, deleteFilesSafely, getFrontendUrl, sendEmail, uploadFiles } from "../Utils/helperFun.js";
import { validateSuperAdmin } from "../Utils/validation_check.js";
import Course from "../Models/Course.js";
import CourseEnrollment from "../Models/CourseEnrollment.js";
import { courseEnrollmentApprovedEmail } from "../Template/courseEnrollmentApprovedEmail.js";
import { courseEnrollmentRejectedEmail } from "../Template/courseEnrollmentRejectedEmail.js";
import { isValidAmount } from "../Utils/inputValidation.js";
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
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

export const getAdminApplicationsCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { status } = req.query;
        if (status === "PENDING") {
            const pendingApplications = await Admin.find({ role: "admin", approved: false, rejected: false }).select("-password");
            return res.json({ success: true, applications: pendingApplications });
        }

        if (status === "APPROVED") {
            const approvedApplications = await Admin.find({ role: "admin", approved: true }).select("-password");
            return res.json({ success: true, applications: approvedApplications });
        }

        if (status === "REJECTED") {
            const rejectedApplications = await Admin.find({ role: "admin", rejected: true }).select("-password");
            return res.json({ success: true, applications: rejectedApplications });
        }

        const allApplications = await Admin.find({ role: "admin" }).select("-password");
        return res.json({ success: true, applications: allApplications });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getAdminByIdCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Admin ID is required" });
        }

        const admin = await Admin.findById(id).select("-password");

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.json({ success: true, admin });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const approveAdminCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Admin ID is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        if (admin.approved && !admin.rejected) {
            return res.status(409).json({ success: false, message: "Application is already approved" });
        }

        // The state is persisted first. The notification is a side effect and
        // must never decide whether the approval happened.
        admin.approved = true;
        admin.rejected = false;
        await admin.save();

        await sendEmail(
            admin.email,
            "Application Approved",
            adminApprovalEmail(
                admin.ownerName,
                admin.instituteName,
                admin.email,
                `${getFrontendUrl()}/auth/login`
            )
        );

        return res.json({ success: true, message: "Application approved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const rejectAdminCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id, reason } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Admin ID is required" });
        }
        if (!reason || !String(reason).trim()) {
            return res.status(400).json({ success: false, message: "A rejection reason is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const hasInstitute = await Institute.exists({ adminId: admin._id });
        if (admin.approved || admin.instituteId || hasInstitute) {
            return res.status(409).json({
                success: false,
                message: "This admin is already approved or has an institute and cannot be rejected. Please disable the account instead.",
            });
        }

        if (admin.rejected) {
            return res.status(409).json({ success: false, message: "Application already rejected" });
        }

        const email = admin.email;
        const ownerName = admin.ownerName;
        const instituteName = admin.instituteName;

        // Remove all documents uploaded with the application before deleting it.
        const publicIds = (admin.images || []).map(
            (document) => document?.publicId || document?.public_id
        );
        await deleteFilesSafely(publicIds);

        await Admin.findByIdAndDelete(admin._id);

        const emailSent = await sendEmail(
            email,
            "Institute Registration Application Rejected",
            adminRejectedEmail(ownerName, instituteName, reason, process.env.SUPPORT_EMAIL)
        );

        return res.json({
            success: true,
            message: emailSent
                ? "Application rejected and removed. The applicant has been notified."
                : "Application rejected and removed, but the notification email could not be sent.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const DeleteAdminApplicationCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Application ID is required" });
        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin application not found" });
        }

        if (admin.role === "superadmin") {
            return res.status(403).json({ success: false, message: "A super admin account cannot be deleted." });
        }

        const hasInstitute = await Institute.exists({ adminId: admin._id });
        if (admin.approved || admin.instituteId || hasInstitute) {
            return res.status(409).json({
                success: false,
                message: "Approved admins or admins with an institute cannot be deleted. Please disable the account instead.",
            });
        }

        // Remove all documents uploaded with the application before deleting it.
        const publicIds = (admin.images || []).map(
            (document) => document?.publicId || document?.public_id
        );
        await deleteFilesSafely(publicIds);

        await Admin.findByIdAndDelete(admin._id);
        return res.json({ success: true, message: "Admin application and associated files deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const UpdateRejectedAdminApplicationCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        let editedFields = {};
        try {
            editedFields = JSON.parse(req.body.editedFields || "{}");
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid edited fields payload" });
        }
        const editedDocTitles = req.body.editedDocTitles;

        const { id } = editedFields;
        if (!id) {
            return res.status(400).json({ success: false, message: "Admin ID is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        if (admin.approved) {
            return res.status(409).json({ success: false, message: "Application is already approved" });
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
        }

        // Only the fields listed here may be changed through this endpoint.
        // Without the whitelist a crafted request could set `role`,
        // `approved`, `disabled` or `password` and escalate privileges.
        const EDITABLE_FIELDS = [
            "ownerName",
            "fatherName",
            "email",
            "phone",
            "cnic",
            "dateOfBirth",
            "gender",
            "address",
            "city",
            "province",
            "instituteName",
            "instituteType",
            "registrationNumber",
            "establishedYear",
            "instituteAddress",
            "instituteCity",
            "instituteProvince",
            "institutePhone",
            "instituteEmail",
            "website",
            "paymentMethod",
            "transactionId",
        ];

        for (const key of EDITABLE_FIELDS) {
            if (editedFields[key] !== undefined) {
                admin[key] = editedFields[key];
            }
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
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Admin ID is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        if (admin.role === "superadmin") {
            return res.status(403).json({ success: false, message: "A super admin cannot be disabled." });
        }

        // updateMany applies the change to every institute of that admin in
        // one atomic operation instead of racing several unawaited saves.
        await Institute.updateMany(
            { adminId: id },
            { $set: { adminApproved: false, isPublished: false } }
        );

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
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Admin ID is required" });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        // Re-enabling an admin makes the institute eligible again, but it does
        // not publish it. The admin must review the data and publish it
        // explicitly so an incomplete institute is never exposed publicly.
        await Institute.updateMany(
            { adminId: id },
            { $set: { adminApproved: true } }
        );

        admin.disabled = false;
        await admin.save();

        return res.json({ success: true, message: "Admin enabled successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const COURSE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const COURSE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const COURSE_MODES = ["ONLINE", "ONSITE", "BLENDED"];

const toBoolean = (value, defaultValue) => {
    if (value === undefined || value === null || value === "") return defaultValue;
    return value === true || value === "true" || value === 1 || value === "1";
};

const parseOptionalDate = (value) => {
    if (value === undefined || value === null || value === "") return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeCourseFields = (body, options = {}) => {
    const maxStudentsValue = body.maxStudents;

    return {
        title: String(body.title || "").trim(),
        courseCode: String(body.courseCode || "").trim().toUpperCase(),
        category: String(body.category || "").trim(),
        shortDescription: String(body.shortDescription || "").trim(),
        description: String(body.description || "").trim(),
        level: body.level,
        mode: body.mode,
        duration: String(body.duration || "").trim(),
        whatsappGroupLink: String(body.whatsappGroupLink || "").trim(),
        learningOutcomes: Array.isArray(body.learningOutcomes) ? body.learningOutcomes : [],
        requirements: Array.isArray(body.requirements) ? body.requirements : [],
        targetAudience: Array.isArray(body.targetAudience) ? body.targetAudience : [],
        modules: Array.isArray(body.modules) ? body.modules : [],
        certificateAvailable: toBoolean(body.certificateAvailable, true),
        enrollmentOpen: toBoolean(body.enrollmentOpen, true),
        enrollmentStart: parseOptionalDate(body.enrollmentStart),
        enrollmentEnd: parseOptionalDate(body.enrollmentEnd),
        maxStudents: maxStudentsValue === undefined || maxStudentsValue === null || maxStudentsValue === ""
            ? null
            : Number(maxStudentsValue),
        price: Number(body.price),
        language: String(body.language || "English").trim(),
        thumbnail: String(body.thumbnail || "").trim(),
        offeredByInstitute: String(body.offeredByInstitute || "").trim(),
        offeredByInstituteLogoUrl: String(body.offeredByInstituteLogoUrl || "").trim(),
        status: COURSE_STATUSES.includes(body.status) ? body.status : (options.defaultStatus || "PUBLISHED"),
    };
};

const getCourseValidationError = (fields) => {
    const requiredFields = {
        title: "Course title",
        courseCode: "Course code",
        language: "Language",
        category: "Category",
        shortDescription: "Short description",
        description: "Description",
        offeredByInstitute: "Course provider",
        level: "Level",
        mode: "Mode",
        duration: "Duration",
    };

    const missingFields = Object.entries(requiredFields)
        .filter(([field]) => !String(fields[field] ?? "").trim())
        .map(([, label]) => label);

    if (missingFields.length > 0) {
        return `Please provide: ${missingFields.join(", ")}.`;
    }

    if (!COURSE_LEVELS.includes(fields.level)) {
        return "Course level is invalid.";
    }

    if (!COURSE_MODES.includes(fields.mode)) {
        return "Course mode is invalid.";
    }

    if (!isValidAmount(fields.price)) {
        return "Course price must be a valid number.";
    }

    if (fields.maxStudents !== null && (!Number.isInteger(fields.maxStudents) || fields.maxStudents < 1)) {
        return "Maximum students must be a positive whole number.";
    }

    if (fields.enrollmentStart && fields.enrollmentEnd && fields.enrollmentStart > fields.enrollmentEnd) {
        return "Enrollment end date must be after the start date.";
    }

    return null;
};

export const createCourseCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const fields = normalizeCourseFields(req.body || {});
        const validationError = getCourseValidationError(fields);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const courseExists = await Course.findOne({ courseCode: fields.courseCode });
        if (courseExists) {
            return res.status(409).json({ success: false, message: "A course with this code already exists" });
        }

        await Course.create({
            ...fields,
            enrollmentStart: fields.enrollmentStart || Date.now(),
        });

        return res.status(201).json({ success: true, message: "Course created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getAllCoursesForSuperAdminCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const courses = await Course.find().sort({ createdAt: -1 });
        return res.json({ success: true, courses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateCourseCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const fields = normalizeCourseFields(req.body || {}, { defaultStatus: course.status });
        const validationError = getCourseValidationError(fields);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const duplicateCourse = await Course.findOne({
            _id: { $ne: course._id },
            courseCode: fields.courseCode,
        });
        if (duplicateCourse) {
            return res.status(409).json({ success: false, message: "A course with this code already exists" });
        }

        Object.assign(course, fields);
        await course.save();

        return res.json({ success: true, message: "Course updated successfully", course });
    } catch (error) {
        if (error?.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error?.code === 11000) {
            return res.status(409).json({ success: false, message: "A course with this code already exists" });
        }
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
            return res.status(404).json({ success: false, message: "Enrollment not found" });
        }
        return res.json({ success: true, enrollment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const ApproveCourseEnrollmentCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;
        const { id } = req.params;
        const enrollment = await CourseEnrollment.findById(id);
        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" });
        }
        if (enrollment.status === "APPROVED") {
            return res.status(409).json({ success: false, message: "Enrollment already approved" });
        }
        let course = await Course.findById(enrollment.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Persist the decision first, notify afterwards.
        enrollment.status = "APPROVED";
        if (!enrollment.payment) {
            enrollment.payment = {};
        }
        enrollment.payment.status = "PAID";
        enrollment.payment.reviewedAt = Date.now();
        await enrollment.save();

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
        );

        return res.json({ success: true, message: "Enrollment approved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const RejectCourseEnrollmentCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;
        const { id } = req.params;
        const { reason } = req.body;
        const enrollment = await CourseEnrollment.findById(id);
        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" });
        }
        if (!reason || !String(reason).trim()) {
            return res.status(400).json({ success: false, message: "Reason is required" });
        }
        if (enrollment.status === "REJECTED") {
            return res.status(409).json({ success: false, message: "Enrollment already rejected" });
        }

        let course = await Course.findById(enrollment.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        enrollment.status = "REJECTED";
        if (!enrollment.payment) {
            enrollment.payment = {};
        }
        enrollment.payment.status = "REJECTED";
        enrollment.payment.reviewedAt = Date.now();
        await enrollment.save();

        // Only courses with a seat limit keep a counter, so only those must
        // give the seat back.
        if (Number(course.maxStudents) > 0 && course.studentEnrolled > 0) {
            course.studentEnrolled -= 1;
            await course.save();
        }

        await sendEmail(
            enrollment.email,
            "Enrollment Rejected",
            courseEnrollmentRejectedEmail({
                studentName: enrollment.fullName,
                courseTitle: enrollment.courseTitle,
                reason: reason
            })
        );

        return res.json({ success: true, message: "Enrollment rejected successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const resubmitCourseEnrollmentPaymentCont = async (req, res) => {
    try {
        const { isValid } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id } = req.params;
        const enrollment = await CourseEnrollment.findById(id);
        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" });
        }

        let editedFields = {};
        try {
            editedFields = JSON.parse(req.body.editedFields || "{}");
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid edited fields payload" });
        }

        const wasRejected = enrollment.status === "REJECTED";

        let paymentImg = req.file || "";
        if (paymentImg) {
            const oldPaymentProof = enrollment.payment?.paymentProof?.publicId;
            if (oldPaymentProof) {
                await deleteFiles(oldPaymentProof);
            }
            const uploaded = await uploadFiles(paymentImg, "courseEnrollmentPayment");
            if (!enrollment.payment) {
                enrollment.payment = {};
            }
            enrollment.payment.paymentProof = {
                title: enrollment.payment?.paymentProof?.title || "Course Enrollment Payment Proof",
                imageUrl: uploaded.secure_url,
                publicId: uploaded.public_id
            };
        }

        // Only the payment details may be corrected by the applicant. Status,
        // course and identity fields are decided by the platform.
        const EDITABLE_FIELDS = ["fullName", "email", "phone", "gender", "dateOfBirth", "qualification", "institution", "motivation"];

        for (const key of EDITABLE_FIELDS) {
            if (editedFields[key] !== undefined) {
                enrollment[key] = editedFields[key];
            }
        }

        if (editedFields?.payment?.transactionId) {
            if (!enrollment.payment) {
                enrollment.payment = {};
            }
            enrollment.payment.transactionId = editedFields.payment.transactionId;
        }

        enrollment.status = "PENDING";
        if (!enrollment.payment) {
            enrollment.payment = {};
        }
        enrollment.payment.status = "PENDING";
        enrollment.payment.reviewedAt = null;

        let course = await Course.findById(enrollment.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        await enrollment.save();

        if (wasRejected && Number(course.maxStudents) > 0) {
            course.studentEnrolled += 1;
            await course.save();
        }

        return res.json({ success: true, message: "Enrollment payment resubmitted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getCertificateDataByIdCont = async (req, res) => {
    try {
        const { isValid, superadmin } = await validateSuperAdmin(req, res);
        if (!isValid) return;

        const { id } = req.params;
        const enrollment = await CourseEnrollment.findById(id);
        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" });
        }
        const course = await Course.findById(enrollment.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
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