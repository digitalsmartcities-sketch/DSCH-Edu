import Admin from "../Models/Admin.js";
import { Institute } from "../Models/Institute.js";
import { generateToken, sendEmail, uploadFiles, verifyToken, authCookieOptions, getDashboardUrl } from "../Utils/helperFun.js";
import argon2 from "argon2";
import { emailVerificationTemp } from "../Template/emailVerificationTemp.js";
import Admission from "../Models/Admission.js";
import { Student } from "../Models/Student.js";
import { passwordResetVerificationEmail } from "../Template/passwordResetVerificationEmail.js";
import { validateAdmin, validateStudent } from "../Utils/validation_check.js";
import { Review } from "../Models/Reviews.js";
import { contactQuerySubmissionTemplate } from "../Template/contactUsEmail.js";
import Course from "../Models/Course.js";
import CourseEnrollment from "../Models/CourseEnrollment.js";
import {
    areValidMarks,
    escapeHtml,
    findMissingFields,
    isValidCnic,
    isValidEmail,
    isValidPassword,
    isValidPhone,
} from "../Utils/inputValidation.js";

// =================================
// Public Controllers
// =================================

export const HomeCont = (req, res) => {
    res.json({
        success: true,
        message: "DSCH-Edu API is running.",
        version: "1.0.0",
    });
}

export const GetPublishedInstitutesCont = async (req, res) => {
    try {
        const { type, page = 1, limit = 50 } = req.query;
        const query = { adminApproved: true, isPublished: true };

        if (type) {
            // Case insensitive so institutes registered with a different casing
            // are still listed.
            const safeType = String(type).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query.instituteType = new RegExp(`^${safeType}$`, "i");
        }

        const pageNumber = Math.max(1, Number(page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(limit) || 50));

        const institutes = await Institute.find(query)
            .select("instituteName instituteType instituteAddress instituteCity heroImages quickInfo academicPrograms createdAt")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        const total = await Institute.countDocuments(query);

        return res.json({
            success: true,
            institutes,
            pagination: {
                page: pageNumber,
                limit: pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error("GetPublishedInstitutesCont Error:", error);
        return res.status(500).json({ success: false, message: "Unable to load institutes." });
    }
};

export const GetPublishedInstituteByIdCont = async (req, res) => {
    try {
        const institute = await Institute.findOne({
            _id: req.params.id,
            adminApproved: true,
            isPublished: true
        });

        if (!institute) {
            return res.status(404).json({ success: false, message: "Institute not found." });
        }

        return res.json({ success: true, institute });
    } catch (error) {
        console.error("GetPublishedInstituteByIdCont Error:", error);
        return res.status(400).json({ success: false, message: "Invalid institute ID." });
    }
};

export const GetHeroPageInstitutesCont = async (req, res) => {
    try {
        const institutes = await Institute.find({
            adminApproved: true,
            isPublished: true
        }).select("instituteName instituteType instituteAddress instituteCity heroImages quickInfo academicPrograms createdAt")
            .sort({ createdAt: -1 })
            .limit(3);
        let responseData = [];
        institutes.map((inst) => {
            const fees = (inst.academicPrograms || []).map((program) => program.monthlyFee);
            const minFee = fees.length ? Math.min(...fees) : null;
            responseData.push({
                id: inst._id,
                name: inst.instituteName,
                image: inst?.heroImages[0]?.imageUrl,
                location: inst.instituteAddress,
                fee: minFee !== null ? `From PKR ${minFee} / Month` : "Fee not listed",
                verified: true,
                instituteType: inst.instituteType
            })
        });
        return res.json({ success: true, institutes: responseData });
    } catch (error) {
        console.error("GetHeroPageInstitutesCont Error:", error);
        return res.status(500).json({ success: false, message: "Unable to load institutes." });
    }
};

const ADMIN_REGISTRATION_FIELDS = [
    "ownerName",
    "fatherName",
    "email",
    "phone",
    "cnic",
    "dateOfBirth",
    "gender",
    "address",
    "city",
    "instituteName",
    "instituteType",
    "registrationNumber",
    "establishedYear",
    "instituteAddress",
    "instituteCity",
    "instituteProvince",
    "institutePhone",
    "instituteEmail",
    "password",
    "confirmPassword",
    "paymentMethod",
    "transactionId",
];

const ADMIN_REGISTRATION_FILES = [
    "ownerCnicFront",
    "ownerCnicBack",
    "instituteRegistration",
    "ownerPhoto",
    "paymentProof",
];

/**
 * Validates a complete admin registration payload (body + uploaded files).
 * Shared by the OTP request endpoint and the final registration endpoint so
 * that invalid data is rejected before an OTP is sent.
 */
const validateAdminRegistration = async (req) => {
    const {
        email,
        instituteEmail,
        phone,
        institutePhone,
        cnic,
        password,
        confirmPassword,
        instituteType,
    } = req.body;

    const missingFields = findMissingFields(req.body, ADMIN_REGISTRATION_FIELDS);
    if (missingFields.length > 0) {
        return {
            success: false,
            status: 400,
            message: `${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required.`,
        };
    }

    if (!isValidEmail(email) || !isValidEmail(instituteEmail)) {
        return { success: false, status: 400, message: "Please provide valid email addresses." };
    }

    if (!isValidPhone(phone) || !isValidPhone(institutePhone)) {
        return { success: false, status: 400, message: "Please provide valid phone numbers." };
    }

    if (!isValidCnic(cnic)) {
        return { success: false, status: 400, message: "Please provide a valid CNIC (e.g. 12345-6789012-3)." };
    }

    if (!isValidPassword(password)) {
        return {
            success: false,
            status: 400,
            message: "Password must be at least 8 characters and contain an upper case letter, a lower case letter and a number.",
        };
    }

    if (!["school", "college"].includes(String(instituteType).toLowerCase())) {
        return { success: false, status: 400, message: "Please select a valid institute type." };
    }

    const missingFiles = ADMIN_REGISTRATION_FILES.filter((key) => !req.files?.[key]?.[0]);
    if (missingFiles.length > 0) {
        return {
            success: false,
            status: 400,
            message: `${missingFiles.join(", ")} ${missingFiles.length > 1 ? "are" : "is"} required.`,
        };
    }

    if (password !== confirmPassword) {
        return { success: false, status: 400, message: "Confirm password must match with password" };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminExists = await Admin.findOne({ email: normalizedEmail });
    if (adminExists) {
        return { success: false, status: 409, message: "An account with this email already exists." };
    }

    const cnicExists = await Admin.findOne({ cnic: cnic.trim() });
    if (cnicExists) {
        return { success: false, status: 409, message: "An account with this CNIC already exists." };
    }

    return { success: true, normalizedEmail };
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, ownerName } = req.body;

        if (!email || !ownerName) {
            return res.status(400).json({ success: false, message: "Email & Name is required." });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }

        // When the request carries the full registration payload, validate it
        // before issuing an OTP so the user never verifies an email only to be
        // rejected afterwards during the final registration call.
        if (req.body.password !== undefined) {
            const validation = await validateAdminRegistration(req);
            if (!validation.success) {
                return res.status(validation.status).json({ success: false, message: validation.message });
            }
        }

        const normalizedEmail = email.trim().toLowerCase();

        const otp = Math.floor(100000 + Math.random() * 900000);

        // The OTP is bound to the email address it was requested for. Without
        // that binding an attacker could request a code for their own mailbox
        // and use it to verify somebody else's registration.
        const otpToken = generateToken({ otp, email: normalizedEmail, purpose: "email_verification" });
        if (!otpToken) {
            return res.status(500).json({ success: false, message: "Could not create the verification code." });
        }

        await sendEmail(normalizedEmail, "Email Verification", emailVerificationTemp(ownerName, otp));

        res.cookie("otp", otpToken, authCookieOptions(10 * 60 * 1000));

        return res.json({ success: true, message: "OTP sent to your email." });
    } catch (error) {
        console.error("verifyEmail Error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong." });
    }
}

export const AdminRegisterCont = async (req, res) => {
    const {
        ownerName,
        fatherName,
        email,
        phone,
        cnic,
        dateOfBirth,
        gender,
        address,
        city,
        instituteName,
        instituteType,
        registrationNumber,
        establishedYear,
        instituteAddress,
        instituteCity,
        instituteProvince,
        institutePhone,
        instituteEmail,
        password,
        confirmPassword,
        paymentMethod,
        transactionId,
        otp,
    } = req.body;

    const ownerCnicFront = req.files?.ownerCnicFront?.[0];
    const ownerCnicBack = req.files?.ownerCnicBack?.[0];
    const instituteRegistration = req.files?.instituteRegistration?.[0];
    const instituteOwnership = req.files?.instituteOwnership?.[0];
    const ownerPhoto = req.files?.ownerPhoto?.[0];
    const paymentProof = req.files?.paymentProof?.[0];

    // ==================
    // Validation
    // ==================

    const validation = await validateAdminRegistration(req);
    if (!validation.success) {
        return res.status(validation.status).json({ success: false, message: validation.message });
    }

    const normalizedEmail = validation.normalizedEmail;

    // =========================
    // OTP sent
    // =========================

    const otpToken = req.cookies?.otp;
    if (!otpToken) {
        return res.status(400).json({ success: false, message: "OTP is expired or not sent." });
    }

    const decodedOtp = verifyToken(otpToken);
    if (!decodedOtp || decodedOtp.purpose !== "email_verification") {
        res.clearCookie("otp");
        return res.status(400).json({ success: false, message: "OTP is expired. Please request a new one." });
    }

    // The code must have been issued for the very same email address.
    if (String(decodedOtp.email || "").toLowerCase() !== normalizedEmail) {
        return res.status(400).json({
            success: false,
            message: "The verification code was sent to a different email address.",
        });
    }

    if (!otp || Number(otp) !== Number(decodedOtp.otp)) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ==================
    // Upload File
    // ===================

    // The ownership document is optional, so only upload the files that were
    // actually provided. Required files have already been validated above.
    const fileArray = [
        { title: "Owner CNIC Front", file: ownerCnicFront },
        { title: "Owner CNIC Back", file: ownerCnicBack },
        { title: "Institute Ownership", file: instituteOwnership },
        { title: "Institute Registration", file: instituteRegistration },
        { title: "Owner Photo", file: ownerPhoto },
        { title: "Payment Proof", file: paymentProof }
    ].filter(({ file }) => file);

    let imgArray = [];

    try {
        imgArray = await Promise.all(
            fileArray.map(async ({ title, file }) => {
                const result = await uploadFiles(file, "admin_docs");

                return {
                    title,
                    imageUrl: result.secure_url,
                    publicId: result.public_id
                };
            })
        );
    } catch (error) {
        console.error("AdminRegisterCont upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Images upload failed",
        });
    }


    // =============================
    // save Data to DB
    // =============================

    const hashPassword = await argon2.hash(password);

    const admin = new Admin({
        ownerName,
        fatherName,
        email: normalizedEmail,
        phone,
        cnic,
        dateOfBirth,
        gender,
        address,
        city,
        instituteName,
        instituteType: String(instituteType).toLowerCase(),
        registrationNumber,
        establishedYear,
        instituteAddress,
        instituteCity,
        instituteProvince,
        institutePhone,
        instituteEmail,
        password: hashPassword,
        paymentMethod,
        transactionId,
        images: imgArray,
        emailVerified: true,
    });

    await admin.save();

    res.clearCookie("otp", { path: "/" });

    return res.status(201).json({ success: true, message: "Application submitted successfully & will be informed via the provided email." });
}

export const loginCont = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email & Password is required." });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }

        const normalizedEmail = email.trim().toLowerCase();
        console.log("Normalized Email:", normalizedEmail, "Role:", role);

        let user = null;

        if (role) {
            // An explicit role is always honoured.
            if (role === "student") {
                user = await Student.findOne({ email: normalizedEmail }).select("+password");
            } else {
                user = await Admin.findOne({ email: normalizedEmail, role }).select("+password");
            }
        } else {
            user = await Admin.findOne({ email: normalizedEmail }).select("+password");
            console.log("Admin = ", user);
            if (!user) {
                user = await Student.findOne({ email: normalizedEmail }).select("+password");
            }
        }

        // Constant-ish response for unknown accounts and wrong passwords so
        // that the endpoint cannot be used to enumerate registered emails.
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const validPassword = await argon2.verify(user.password, password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        if (user.role === "admin") {
            if (user.disabled === true) {
                return res.status(403).json({ success: false, message: "Your account has been disabled. Please contact support." });
            }

            if (user.rejected === true) {
                return res.status(403).json({
                    success: false,
                    message: "Your registration was rejected. Please check the email we sent you or contact support.",
                });
            }

            if (user.approved !== true) {
                return res.status(403).json({
                    success: false,
                    message: "Your registration is still under review. You can sign in after it is approved.",
                });
            }
        }

        const token = generateToken({
            id: user._id,
            role: user.role,
            name: user.ownerName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email: user.email,
            cnic: user.cnic || "N/A",
            phone: user.phone
        });

        if (!token) {
            return res.status(500).json({ success: false, message: "Something went wrong. try again" });
        }

        res.cookie("token", token, authCookieOptions(60 * 60 * 1000));

        const dashboardUrl = getDashboardUrl(user.role);

        return res.json({
            success: true,
            message: "Login successful",
            redirectUrl: dashboardUrl,
            user: {
                id: user._id,
                role: user.role,
                name: user.ownerName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                email: user.email,
                dashboardUrl,
            },
        });

    } catch (error) {
        console.error("loginCont Error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong, try again" });
    }
}

export const IsUserLoogedIn = (req, res) => {
    // The session cookie carries everything the navbar needs to show the
    // signed in user and to send them back to the right dashboard after a
    // page reload.
    return res.json({
        success: true,
        user: {
            id: req.user.id,
            role: req.user.role,
            name: req.user.name || "",
            email: req.user.email || "",
            dashboardUrl: getDashboardUrl(req.user.role),
        },
    });
}

export const logOutCont = (req, res) => {
    res.clearCookie("token", { path: "/" });
    res.clearCookie("otp", { path: "/" });
    res.clearCookie("passwordResetOtp", { path: "/" });
    return res.json({ success: true, message: "Logged out successfully" });
}

export const AdmissionSubmissionCont = async (req, res) => {
    try {
        const { firstName,
            lastName,
            email,
            phone,
            gender,
            dateOfBirth,
            previousSchool,
            lastQualification,
            obtainedMarks,
            totalMarks,
            passingYear,
            applyingFor,
            guardianName,
            guardianPhone,
            guardianCnic,
            guardianRelation,
            agreement,
            instituteId,
            instituteName,
            instituteType,
            adminId,
            admissionFee,
            monthlyFee
        } = req.body;

        let institute = await Institute.findById(instituteId);

        if (!institute) {
            return res.status(404).json({ success: false, message: "Institute not found" });
        }

        if (institute.adminApproved !== true || institute.isPublished !== true) {
            return res.status(403).json({ success: false, message: "This institute is not accepting admissions right now." });
        }

        if (institute.quickInfo?.admissionStatus !== "OPEN") {
            return res.status(403).json({ success: false, message: "Admissions are currently closed for this institute." });
        }

        // ==================
        // Validation
        // ==================

        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "phone",
            "gender",
            "dateOfBirth",
            "previousSchool",
            "lastQualification",
            "obtainedMarks",
            "totalMarks",
            "passingYear",
            "applyingFor",
            "guardianName",
            "guardianPhone",
            "guardianCnic",
            "guardianRelation",
        ];

        const missingFields = findMissingFields(req.body, requiredFields);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required.`,
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }

        if (!isValidPhone(phone) || !isValidPhone(guardianPhone)) {
            return res.status(400).json({ success: false, message: "Please provide valid phone numbers." });
        }

        if (!isValidCnic(guardianCnic)) {
            return res.status(400).json({ success: false, message: "Please provide a valid guardian CNIC (e.g. 12345-6789012-3)." });
        }

        if (!areValidMarks(obtainedMarks, totalMarks)) {
            return res.status(400).json({ success: false, message: "Please provide valid obtained and total marks." });
        }

        const agreed = req.body.agreement === true || req.body.agreement === "true";
        if (!agreed) {
            return res.status(400).json({ success: false, message: "Agreement is required" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        let studentExsist = await Student.findOne({ email: normalizedEmail });

        if (studentExsist) {
            return res.status(409).json({
                success: false,
                message: "A student account with this email already exists. Please log in instead.",
            });
        }

        // A student account is unique by email, so two active applications with
        // the same email can never both be approved. Reject the duplicate early.
        const activeAdmission = await Admission.findOne({
            email: normalizedEmail,
            status: { $ne: "REJECTED" },
        });

        if (activeAdmission) {
            return res.status(409).json({
                success: false,
                message: "An application with this email is already in progress. Please sign in or use a different email.",
            });
        }

        const program = (institute.academicPrograms || []).find(
            (p) => String(p.class) === String(applyingFor)
        );
        if (!program) {
            return res.status(400).json({ success: false, message: "Selected class is not offered by this institute" });
        }

        if (program.admissionStatus !== "OPEN") {
            return res.status(403).json({ success: false, message: "Selected class is not accepting admissions right now." });
        }

        const studentPhoto = req.files?.studentPhoto?.[0];
        const cnicBForm = req.files?.cnicBForm?.[0];
        const previousSchoolCertificate = req.files?.previousSchoolCertificate?.[0];
        const needsCertificate = previousSchool !== "N/A" && lastQualification !== "N/A";

        if (!studentPhoto || !cnicBForm || (needsCertificate && !previousSchoolCertificate)) {
            return res.status(400).json({
                success: false,
                message: "All documents are required"
            });
        }

        const fileArray = [
            { title: "Student Photo", file: studentPhoto },
            { title: "Cnic B Form", file: cnicBForm }
        ];
        if (needsCertificate) {
            fileArray.push({ title: "Previous School Certificate", file: previousSchoolCertificate });
        }

        let imgArray = [];

        try {
            imgArray = await Promise.all(
                fileArray.map(async ({ title, file }) => {
                    const result = await uploadFiles(file, "student_docs");

                    return {
                        title,
                        imageUrl: result.secure_url,
                        publicId: result.public_id
                    };
                })
            );
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Images upload failed",
            });
        }

        let admission = await Admission.create({
            firstName,
            lastName,
            email: normalizedEmail,
            phone,
            gender,
            dateOfBirth,
            previousSchool,
            lastQualification,
            obtainedMarks,
            totalMarks,
            passingYear,
            applyingFor,
            guardianName,
            guardianPhone,
            guardianCnic,
            guardianRelation,
            agreement: true,
            documents: imgArray,
            adminId: institute.adminId,
            instituteId: institute._id,
            instituteName: institute.instituteName,
            instituteType: institute.instituteType,
            admissionFee: program.admissionFee,
            monthlyFee: program.monthlyFee
        });

        await admission.save();

        res.status(201).json({ success: true, message: "Application submitted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, please try again." });
    }
}

// Reset Password : Password is not known to user
export const VerifyEmailToResetPassCont = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }

        const normalizedEmail = email.trim().toLowerCase();

        let userExists = await Admin.findOne({ email: normalizedEmail });
        if (!userExists) {
            userExists = await Student.findOne({ email: normalizedEmail });
        }
        if (!userExists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!userExists.approved) {
            return res.status(403).json({ success: false, message: "User is not approved" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        // The reset code is bound to the account it was issued for so that it
        // cannot be replayed against a different user.
        const otpToken = generateToken({ otp, email: normalizedEmail, purpose: "password_reset" });
        if (!otpToken) {
            return res.status(500).json({ success: false, message: "Something went wrong, please try again." });
        }

        await sendEmail(
            userExists.email,
            "Verify your password reset request",
            passwordResetVerificationEmail(
                userExists.ownerName || `${userExists.firstName || ""} ${userExists.lastName || ""}`.trim(),
                otp
            )
        );

        res.cookie("passwordResetOtp", otpToken, authCookieOptions(10 * 60 * 1000));
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const VerifyOTPToResetPassCont = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ success: false, message: "OTP is required" });
        }
        let otpToken = req.cookies.passwordResetOtp;
        if (!otpToken) {
            return res.status(400).json({ success: false, message: "OTP is expired" });
        }
        let decodedToken = verifyToken(otpToken);
        if (!decodedToken || decodedToken.purpose !== "password_reset") {
            res.clearCookie("passwordResetOtp", { path: "/" });
            return res.status(400).json({ success: false, message: "OTP is expired" });
        }
        if (Number(decodedToken.otp) !== Number(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        let verifiedOtpToken = generateToken({
            otp: decodedToken.otp,
            email: decodedToken.email,
            purpose: "password_reset",
            verified: true,
        });
        res.cookie("passwordResetOtp", verifiedOtpToken, authCookieOptions(10 * 60 * 1000));
        res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, try again." });
    }
}

export const ResetPasswordCont = async (req, res) => {
    try {
        const { password, confirmPassword, email } = req.body;
        if (!password || !confirmPassword || !email) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and contain an upper case letter, a lower case letter and a number.",
            });
        }
        let otpToken = req.cookies.passwordResetOtp;
        if (!otpToken) {
            return res.status(400).json({ success: false, message: "OTP is expired" });
        }
        let decodedToken = verifyToken(otpToken);
        if (!decodedToken || decodedToken.verified !== true) {
            res.clearCookie("passwordResetOtp", { path: "/" });
            return res.status(400).json({ success: false, message: "OTP is expired" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // The verified code must belong to the account whose password is
        // being reset.
        if (String(decodedToken.email || "").toLowerCase() !== normalizedEmail) {
            return res.status(400).json({
                success: false,
                message: "The verification code was issued for a different account.",
            });
        }

        let userExists = await Admin.findOne({ email: normalizedEmail }).select("+password");
        if (!userExists) {
            userExists = await Student.findOne({ email: normalizedEmail }).select("+password");
        }
        if (!userExists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        userExists.password = await argon2.hash(password);
        await userExists.save();
        res.clearCookie("passwordResetOtp", { path: "/" });
        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, try again." });
    }
}

// Change Password : Password already known to user
// It is dashboard related cont but it is placed here b/c it is used in more than one dashboard.
export const ChangePasswordCont = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (req.user.role === "admin") {
            const { isValid } = await validateAdmin(req, res);
            if (!isValid) return;
        } else if (req.user.role === "student") {
            const { isValid } = await validateStudent(req, res);
            if (!isValid) return;
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        if (!isValidPassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and contain an upper case letter, a lower case letter and a number.",
            });
        }
        let userExists;
        if (req.user.role === "admin") {
            userExists = await Admin.findById(req.user.id).select("+password");
        } else if (req.user.role === "student") {
            userExists = await Student.findById(req.user.id).select("+password");
        }
        if (!userExists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isPasswordCorrect = await argon2.verify(userExists.password, currentPassword);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid current password" });
        }
        userExists.password = await argon2.hash(newPassword);
        await userExists.save();
        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, try again." });
    }
}

export const HandleReviewSubmissionCont = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        let user;
        if (req.user.role === "admin") {
            let { isValid, admin } = await validateAdmin(req, res);
            if (!isValid) return;
            user = admin;
        } else if (req.user.role === "student") {
            let { isValid, student } = await validateStudent(req, res);
            if (!isValid) return;
            user = student;
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { rating, review, instituteId } = req.body;

        if (!rating || !review || !instituteId) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const numericRating = Number(rating);
        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be a whole number between 1 and 5." });
        }

        if (String(review).trim().length < 10) {
            return res.status(400).json({ success: false, message: "Please write a review of at least 10 characters." });
        }

        if (String(review).length > 2000) {
            return res.status(400).json({ success: false, message: "Review is too long (2000 characters max)." });
        }

        let reviewExists = await Review.findOne({ userId: req.user.id, instituteId: instituteId });
        if (reviewExists) {
            return res.status(409).json({ success: false, message: "You have already submitted a review for this institute." });
        }

        let institute = await Institute.findById(instituteId).select("instituteName");
        if (!institute) {
            return res.status(404).json({ success: false, message: "Institute not found" });
        }

        const previousReviewCount = await Review.countDocuments({ instituteId });

        const displayName =
            user.role === "admin"
                ? user.ownerName
                : `${user.firstName || ""} ${user.lastName || ""}`.trim();

        let newReview = new Review({
            rating: numericRating,
            review: String(review).trim(),
            userId: req.user.id,
            userName: displayName,
            userRole: req.user.role,
            instituteId: instituteId,
            instituteName: institute.instituteName,
            isVerified: true
        });
        await newReview.save();

        let newRating;
        if (!institute.rating || previousReviewCount === 0) {
            newRating = numericRating;
        } else {
            newRating = ((institute.rating * previousReviewCount) + numericRating) / (previousReviewCount + 1);
        }

        await Institute.findByIdAndUpdate(instituteId, {
            $push: { reviews: newReview._id },
            $set: { rating: newRating }
        });

        let responseData = {
            rating: numericRating,
            review: String(review).trim(),
            instituteName: institute.instituteName,
            isVerified: true,
            userRole: req.user.role === "admin" ? "Admin" : "Student",
            userName: displayName,
            date: new Date()
        }

        res.status(201).json({ success: true, message: "Review submitted successfully", newReview: responseData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const GetReviewsCont = async (req, res) => {
    try {
        const { instituteId } = req.body;
        if (!instituteId) {
            return res.status(400).json({ success: false, message: "Institute ID is required" });
        }

        let reviews = await Review
            .find({ instituteId: instituteId })
            .sort({ createdAt: -1 })
            .populate("instituteId", "instituteName rating");

        if (!reviews || reviews.length === 0) {
            return res.json({ success: true, reviews: [], totalReviews: 0, totalRating: null });
        }

        const responseData = await Promise.all(
            reviews.map(async (review) => {
                let userName = "";
                if (review.userRole === "admin") {
                    const user = await Admin
                        .findById(review.userId)
                        .select("ownerName");
                    userName = user?.ownerName || "Unknown";
                } else if (review.userRole === "student") {
                    const user = await Student
                        .findById(review.userId)
                        .select("firstName lastName");
                    userName = user ? `${user.firstName + " " + user.lastName}` : "Unknown";
                }
                return {
                    rating: review.rating,
                    review: review.review,
                    instituteName: review.instituteId?.instituteName,
                    isVerified: review.isVerified,
                    userRole:
                        review.userRole === "admin"
                            ? "Admin"
                            : "Student",
                    userName,
                    date: review.createdAt.toISOString()
                };
            })
        );

        responseData.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.json({
            success: true,
            reviews: responseData,
            totalReviews: responseData.length,
            totalRating: reviews[0]?.instituteId?.rating ?? null,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const SubmitContactFormCont = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        const missingFields = findMissingFields(
            req.body,
            ["firstName", "lastName", "email", "phone", "subject", "message"]
        );
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required.`,
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }

        if (!isValidPhone(phone)) {
            return res.status(400).json({ success: false, message: "Please provide a valid phone number." });
        }

        if (String(message).length > 2000) {
            return res.status(400).json({ success: false, message: "Message is too long (2000 characters max)." });
        }

        const sent = await sendEmail(
            process.env.SUPPORT_EMAIL,
            `Contact Edu Portal Form Submission: ${subject}`,
            contactQuerySubmissionTemplate(
                escapeHtml(firstName),
                escapeHtml(lastName),
                escapeHtml(email),
                escapeHtml(phone),
                escapeHtml(subject),
                escapeHtml(message)
            )
        );

        if (!sent) {
            return res.status(502).json({
                success: false,
                message: "We could not deliver your message right now. Please try again later.",
            });
        }

        res.json({ success: true, message: "Contact Form submitted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const GetAllCoursesCont = async (req, res) => {
    try {
        const { category, search } = req.query;
        const query = { status: "PUBLISHED" };

        if (category) {
            const safeCategory = String(category).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query.category = new RegExp(`^${safeCategory}$`, "i");
        }

        if (search) {
            const safeSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query.$or = [
                { title: new RegExp(safeSearch, "i") },
                { shortDescription: new RegExp(safeSearch, "i") },
            ];
        }

        const courses = await Course.find(query)
            .select("thumbnail title category courseCode shortDescription level duration offeredByInstituteLogoUrl offeredByInstitute rating mode studentEnrolled");

        res.json({ success: true, courses: courses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const GetCourseByIdCont = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        if (course.status !== "PUBLISHED") {
            return res.status(404).json({ success: false, message: "Course is not published" });
        }
        res.json({ success: true, course: course });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const SubmitCourseEnrollmentCont = async (req, res) => {
    try {
        const requiredFields = ["fullName", "email", "phone", "gender", "paymentMethod", "transactionId"];
        const missingFields = findMissingFields(req.body, requiredFields);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required.`,
            });
        }

        if (!isValidEmail(req.body.email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }

        if (!isValidPhone(req.body.phone)) {
            return res.status(400).json({ success: false, message: "Please provide a valid phone number." });
        }

        const agreed = req.body.agreement === true || req.body.agreement === "true";
        if (!agreed) {
            return res.status(400).json({ success: false, message: "You must accept the terms and conditions" });
        }

        let course = await Course.findById(req.body.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (course.status !== "PUBLISHED") {
            return res.status(400).json({ success: false, message: "Course is not open for enrollment" });
        }

        const maxStudents = course.maxStudents;
        const hasSeatLimit = Number(maxStudents) > 0;
        if (hasSeatLimit && course.studentEnrolled + 1 > maxStudents) {
            return res.status(409).json({ success: false, message: "Course seats are full" });
        }

        // A learner must not be able to book the same course twice.
        const alreadyEnrolled = await CourseEnrollment.findOne({
            courseId: course._id,
            email: String(req.body.email).trim().toLowerCase(),
            "payment.status": { $ne: "REJECTED" },
        });
        if (alreadyEnrolled) {
            return res.status(409).json({
                success: false,
                message: "You have already enrolled in this course.",
            });
        }

        let paymentImg = req.file || "";

        if (!paymentImg) {
            return res.status(400).json({ success: false, message: "Payment proof is required" });
        }

        let paymentProof;
        try {
            const result = await uploadFiles(paymentImg, "course_enrollment_payments");
            paymentProof = {
                title: "Course Enrollment Payment Proof",
                imageUrl: result.secure_url,
                publicId: result.public_id,
            };
        } catch (uploadError) {
            console.error(uploadError);
            return res.status(500).json({ success: false, message: "Payment proof upload failed" });
        }

        await CourseEnrollment.create({
            courseId: course._id,
            fullName: req.body.fullName,
            email: String(req.body.email).trim().toLowerCase(),
            phone: req.body.phone,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            qualification: req.body.qualification,
            institution: req.body.institution,
            courseTitle: course.title,
            courseCode: course.courseCode,
            courseProvider: course.offeredByInstitute,
            motivation: req.body.motivation,
            agreement: agreed,
            payment: {
                amount: course.price,
                status: "PENDING",
                paymentMethod: req.body.paymentMethod,
                transactionId: req.body.transactionId,
                paymentDate: new Date(),
                paymentProof: paymentProof,
                submittedAt: new Date(),
            }
        });

        if (hasSeatLimit) {
            await Course.findByIdAndUpdate(course._id, {
                $inc: { studentEnrolled: 1 }
            });
        }

        res.status(201).json({ success: true, message: "Course enrollment submitted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong, please try again." });
    }
}