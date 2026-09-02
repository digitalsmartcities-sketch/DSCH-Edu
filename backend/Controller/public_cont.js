import Admin from "../Models/Admin.js";
import { Institute } from "../Models/Institute.js";
import { generateToken, sendEmail, uploadFiles, verifyToken } from "../Utils/helperFun.js";
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

// =================================
// Public Controllers
// =================================

export const HomeCont = (req, res) => {
    res.json({ message: "Home route" });
}

export const GetPublishedInstitutesCont = async (req, res) => {
    try {
        const { type } = req.query;
        const query = { adminApproved: true, isPublished: true };

        if (type) {
            query.instituteType = type;
        }

        const institutes = await Institute.find(query)
            .select("instituteName instituteType instituteAddress instituteCity heroImages quickInfo academicPrograms createdAt")
            .sort({ createdAt: -1 });

        return res.json({ success: true, institutes });
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
        let minFee = Infinity;
        institutes.map((inst) => {
            minFee = Math.min(minFee, inst.academicPrograms.map((program) => {
                return program.monthlyFee
            }));
            responseData.push({
                id: inst._id,
                name: inst.instituteName,
                image: inst?.heroImages[0]?.imageUrl,
                location: inst.instituteAddress,
                fee: `From PKR ${minFee} / Month`,
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

export const verifyEmail = async (req, res) => {
    try {
        let { email, ownerName } = req.body;
        if (!email || !ownerName) {
            return res.json({ success: false, message: "Email & Name is required." });
        }
        let otp = Math.floor(100000 + Math.random() * 999999);
        await sendEmail(email, "Email Verification", emailVerificationTemp(ownerName, otp));
        res.cookie("otp", otp, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 10 * 60 * 1000,
        })
        res.json({ success: true, message: "OTP sent to your email." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong." })
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

    for (const key in req.body) {
        if (!req.body[key]) {
            return res.json({ success: false, message: `${key} is required` })
        }
    }

    for (const key in req.files) {
        if (!req.files[key]) {
            return res.json({ success: false, message: `${key} is required` })
        }
    }

    if (password !== confirmPassword) {
        return res.json({ success: false, message: "confirm password must match with password" });
    }

    // =====================
    // Admin already exixst
    // =====================

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        return res.json({ success: false, message: "Admin already exists" });
    }

    // =========================
    // OTP sent
    // =========================

    if (!req.cookies.otp) {
        return res.json({ success: false, message: "OTP is expired or not sent." });
    }

    // ==================
    // Upload File
    // ===================

    const fileArray = [
        { title: "Owner CNIC Front", file: ownerCnicFront },
        { title: "Owner CNIC Back", file: ownerCnicBack },
        { title: "Institute Ownership", file: instituteOwnership },
        { title: "Institute Registration", file: instituteRegistration },
        { title: "Owner Photo", file: ownerPhoto },
        { title: "Payment Proof", file: paymentProof }
    ];

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
        console.error(error);

        return res.json({
            success: false,
            message: "Images upload failed",
        });
    }


    // =============================
    // save Data to DB
    // =============================

    let hashPassword = await argon2.hash(password);

    const admin = new Admin({
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
        password: hashPassword,
        paymentMethod,
        transactionId,
        images: imgArray,
        emailVerified: true,
    });

    await admin.save();

    res.json({ success: true, message: "Application submitted successfuly & will be informed via provided email." });
}

export const loginCont = async (req, res) => {
    try {
        let { email, password, role } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Email & Password is required." });
        }

        let user = await Admin.findOne({ email, role });

        if (!user) {
            user = await Student.findOne({ email, role });
        }

        if (!user && !role) {
            user = await Admin.findOne({ email, role: "superadmin" });
        }

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        const validPassword = await argon2.verify(user.password, password);

        if (!validPassword) {
            return res.json({ success: false, message: "Invalid Password" });
        }

        const token = generateToken({
            id: user._id,
            role: user.role,
            name: user.ownerName || user.firstName + " " + user.lastName,
            email: user.email,
            cnic: user.cnic || "N/A",
            phone: user.phone
        });

        if (!token) {
            return res.json({ success: false, message: "Something went wrong. try again" });
        }

        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 60 * 60 * 1000,
        });

        let dashboardUrl;
        if (user.role === "superadmin") {
            dashboardUrl = `/superadmin/dashboard`;
        } else if (user.role === "admin") {
            dashboardUrl = `/inst/dashboard`;
        } else {
            dashboardUrl = `/std/dashboard`;
        }

        res.json({ success: true, message: "Login successful", redirectUrl: dashboardUrl });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, try again" });
    }
}

export const IsUserLoogedIn = (req, res) => {
    try {
        if (req.user) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.json({ success: false });
    }
}

export const logOutCont = (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.json({ success: false, message: "Something went wrong" });
    }
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
            return res.json({ success: false, message: "Institute not found" });
        }

        let admissionExsist = await Admission.findOne({ email, firstName, lastName, guardianCnic, dateOfBirth });

        if (admissionExsist) {
            return res.json({ success: false, message: "Admission already exists" });
        }

        let studentExsist = await Student.findOne({ email });

        if (studentExsist) {
            return res.json({ success: false, message: "Provided Email is already registered, please use different email or login." });
        }

        for (const key in req.body) {
            if (key === "agreement") {
                if (!req.body[key]) {
                    return res.json({ success: false, message: `Agreement is required` });
                }
                continue;
            }
            if (req.body[key] === undefined || req.body[key] === "") {
                return res.json({ success: false, message: ` ${key} is required` });
            }
        }

        const studentPhoto = req.files?.studentPhoto?.[0];
        const cnicBForm = req.files?.cnicBForm?.[0];
        const previousSchoolCertificate = req.files?.previousSchoolCertificate?.[0];

        if (!studentPhoto || !cnicBForm || !previousSchoolCertificate) {
            return res.json({
                success: false,
                message: "All documents are required"
            });
        }

        const fileArray = [
            { title: "Student Photo", file: studentPhoto },
            { title: "Cnic B Form", file: cnicBForm },
            { title: "Previous School Certificate", file: previousSchoolCertificate }
        ];

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
            documents: imgArray,
            adminId,
            instituteId,
            instituteName,
            instituteType,
            admissionFee,
            monthlyFee
        });

        await admission.save();

        res.json({ success: true, message: "Application submitted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

// Reset Password : Password is not known to user
export const VerifyEmailToResetPassCont = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }
        let userExists = await Admin.findOne({ email });
        if (!userExists) {
            userExists = await Student.findOne({ email });
        }
        if (!userExists) {
            return res.json({ success: false, message: "User not found" });
        }
        if (!userExists.approved) {
            return res.json({ success: false, message: "User is not approved" });
        }
        const otp = Math.floor(100000 + Math.random() * 9000);
        sendEmail(userExists.email,
            "Verify your password reset request",
            passwordResetVerificationEmail(
                userExists.ownerName || userExists.firstName + " " + userExists.lastName,
                otp
            )
        );
        let otpToken = generateToken({ otp });
        res.cookie("passwordResetOtp", otpToken, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 10 * 60 * 1000,
        });
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const VerifyOTPToResetPassCont = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res.json({ success: false, message: "OTP is required" });
        }
        let otpToken = req.cookies.passwordResetOtp;
        if (!otpToken) {
            return res.json({ success: false, message: "OTP is expired" });
        }
        let decodedToken = await verifyToken(otpToken);
        if (!decodedToken) {
            return res.json({ success: false, message: "OTP is expired" });
        }
        if (Number(decodedToken.otp) !== Number(otp)) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const ResetPasswordCont = async (req, res) => {
    try {
        const { password, confirmPassword, email } = req.body;
        if (!password || !confirmPassword || !email) {
            return res.json({ success: false, message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.json({ success: false, message: "Passwords do not match" });
        }
        let otpToken = req.cookies.passwordResetOtp;
        if (!otpToken) {
            return res.json({ success: false, message: "OTP is expired" });
        }
        let decodedToken = await verifyToken(otpToken);
        if (!decodedToken) {
            return res.json({ success: false, message: "OTP is expired" });
        }
        let userExists = await Admin.findOne({ email });
        if (!userExists) {
            userExists = await Student.findOne({ email });
        }
        if (!userExists) {
            return res.json({ success: false, message: "User not found" });
        }
        userExists.password = await argon2.hash(password);
        await userExists.save();
        res.clearCookie("passwordResetOtp");
        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

// Change Password : Password already known to user
// It is dashboard related cont but it is placed here b/c it is used in more than one dashboard.
export const ChangePasswordCont = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        let isValid;
        if (req.user.role === "admin") {
            let result = await validateAdmin(req, res);
            isValid = result.isValid;
            if (result.success === false) {
                return res.json({ success: false, message: result.message });
            }
        } else if (req.user.role === "student") {
            let result = await validateStudent(req, res);
            isValid = result.isValid;
            if (result.success === false) {
                return res.json({ success: false, message: result.message });
            }
        }

        if (!isValid) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.json({ success: false, message: "All fields are required" });
        }
        if (newPassword !== confirmPassword) {
            return res.json({ success: false, message: "Passwords do not match" });
        }
        let userExists;
        if (req.user.role === "admin") {
            userExists = await Admin.findById(req.user.id);
        } else if (req.user.role === "student") {
            userExists = await Student.findById(req.user.id);
        }
        if (!userExists) {
            return res.json({ success: false, message: "User not found" });
        }
        const isPasswordCorrect = await argon2.verify(userExists.password, currentPassword);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid current password" });
        }
        userExists.password = await argon2.hash(newPassword);
        await userExists.save();
        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const HandleReviewSubmissionCont = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        let user;
        if (req.user.role === "admin") {
            let { isValid, admin } = await validateAdmin(req, res);
            if (!isValid) {
                return res.json({ success: false, message: "Unauthorized" });
            }
            user = admin;
        } else if (req.user.role === "student") {
            let { isValid, student } = await validateStudent(req, res);
            if (!isValid) {
                return res.json({ success: false, message: "Unauthorized" });
            }
            user = student;
        }

        const { rating, review, instituteId } = req.body;

        if (!rating || !review || !instituteId) {
            return res.json({ success: false, message: "All fields are required" });
        }

        let reviewExists = await Review.findOne({ userId: req.user.id, instituteId: instituteId });
        if (reviewExists) {
            return res.json({ success: false, message: "You have already submitted a review for this institute." });
        }

        let institute = await Institute.findById(instituteId).select("instituteName");
        if (!institute) {
            return res.json({ success: false, message: "Institute not found" });
        }

        let newReview = new Review({
            rating,
            review,
            userId: req.user.id,
            userName: user.role === "admin" ? user.ownerName : `${user.firstName + " " + user.lastName}`,
            userRole: req.user.role,
            instituteId: instituteId,
            instituteName: institute.instituteName,
            isVerified: true
        });
        await newReview.save();

        let newRating;
        if (!institute.rating) {
            newRating = rating;
        } else {
            newRating = (institute.rating + rating) / (institute.reviews.length + 1);
        }

        await Institute.findByIdAndUpdate(instituteId, {
            $push: { reviews: newReview._id },
            $set: { rating: newRating }
        });

        let responseData = {
            rating,
            review,
            instituteName: institute.instituteName,
            isVerified: true,
            userRole: req.user.role === "admin" ? "Admin" : "Student",
            userName: user.role === "admin" ? user.ownerName : `${user.firstName + " " + user.lastName}`,
            date: new Date()
        }

        res.json({ success: true, message: "Review submitted successfully", newReview: responseData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const GetReviewsCont = async (req, res) => {
    try {
        const { instituteId } = req.body;
        if (!instituteId) {
            return res.json({ success: false, message: "Institute ID is required" });
        }
        let reviews = await Review
            .find({ instituteId: instituteId })
            .sort({ createdAt: -1 })
            .populate("instituteId", "instituteName rating");
        if (!reviews) {
            return res.json({ success: false, message: "No reviews found" });
        }

        const responseData = await Promise.all(
            reviews?.map(async (review) => {
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
                    instituteName: review.instituteId.instituteName,
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
        reviews?.length ? responseData.totalReviews = reviews?.length : null;
        reviews[0] ? responseData.totalRating = reviews[0]?.instituteId?.rating : null;
        res.json({ success: true, reviews: responseData[0] ? responseData : null });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const SubmitContactFormCont = async (req, res) => {
    try {
        const formData = req.body;
        if (!formData) {
            return res.json({ success: false, message: "Form data is required" });
        }
        await sendEmail(
            process.env.SUPPORT_EMAIL,
            `Contact Edu Portal Form Submission: ${formData.subject}`,
            contactQuerySubmissionTemplate(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.phone,
                formData.subject,
                formData.message
            ));
        res.json({ success: true, message: "Contact Form submitted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const GetAllCoursesCont = async (req, res) => {
    try {
        const courses = await Course.find({ status: "PUBLISHED" })
            .select("thumbnail title category courseCode shortDescription level duration offeredByInstituteLogoUrl offeredByInstitute rating mode studentEnrolled");
        if (!courses) {
            return res.json({ success: false, message: "No courses found" });
        }
        res.json({ success: true, courses: courses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const GetCourseByIdCont = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.json({ success: false, message: "Course not found" });
        }
        if (course.status !== "PUBLISHED") {
            return res.json({ success: false, message: "Course is not published" });
        }
        res.json({ success: true, course: course });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const SubmitCourseEnrollmentCont = async (req, res) => {
    try {
        for (const key in req.body) {
            if (!req.body[key]) {
                return res.json({ success: false, message: `${key} is required` })
            }
        }
        let course = await Course.findById(req.body.id);
        if (!course) {
            return res.json({ success: false, message: "Course not found" });
        }

        if (course.maxStudents !== 0 && course.studentEnrolled + 1 > course.maxStudents) {
            return res.json({ success: false, message: "Course seats are full" });
        }

        let paymentImg = req.file || "";

        if (!paymentImg) {
            return res.json({ success: false, message: "Payment proof is required" });
        }

        let paymentProof;
        if (paymentImg) {
            let result = await uploadFiles(paymentImg, "course_enrollment_payments")
            paymentProof = {
                title: "Course Enrollment Payment Proof",
                imageUrl: result.url,
                publicId: result.public_id
            }
        }
        await CourseEnrollment.create({
            courseId: course._id,
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            qualification: req.body.qualification,
            institution: req.body.institution,
            courseTitle: course.title,
            courseCode: course.courseCode,
            courseProvider: course.offeredByInstitute,
            motivation: req.body.motivation,
            agreement: req.body.agreement,
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

        if (course.maxStudents !== 0) {
            await Course.findByIdAndUpdate(course._id, {
                $set: { studentEnrolled: course.studentEnrolled + 1 }
            });
        }

        res.json({ success: true, message: "Course enrollment submitted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong, please try again." });
    }
}