import express from "express";
import { upload, uploadDocuments } from "../Config/multer.js";
import { UserMW } from "../Middleware/userMW.js";
import * as PUBLIC_CONT from "../Controller/public_cont.js"
import { loginRateLimit, rateLimit, emailIdentifier } from "../Utils/rateLimiter.js";
const PUBLIC_ROUTER = express.Router();

// ===========================================
// RATE LIMITS
// ===========================================
// Authentication and OTP endpoints are the ones that are worth attacking,
// therefore they get a much tighter budget than the regular public pages.
const LOGIN_LIMIT = loginRateLimit({
    limit: 10,
    windowMs: 15 * 60 * 1000,
    keyPrefix: "login",
    identifier: emailIdentifier,
    message: "Too many failed login attempts. Please try again in a few minutes.",
});

const OTP_LIMIT = rateLimit({
    limit: 6,
    windowMs: 15 * 60 * 1000,
    keyPrefix: "otp",
    identifier: emailIdentifier,
    message: "Too many verification requests. Please try again later.",
});

const RESET_LIMIT = rateLimit({
    limit: 6,
    windowMs: 15 * 60 * 1000,
    keyPrefix: "reset",
    identifier: emailIdentifier,
    message: "Too many password reset attempts. Please try again later.",
});

const REGISTER_LIMIT = rateLimit({
    limit: 5,
    windowMs: 60 * 60 * 1000,
    keyPrefix: "register",
    message: "Too many registration attempts. Please try again later.",
});

const FORM_LIMIT = rateLimit({
    limit: 10,
    windowMs: 60 * 60 * 1000,
    keyPrefix: "form",
    message: "Too many submissions. Please try again later.",
});

// Admission and enrollment forms are used by a whole campus at once, so they
// get a bigger budget than the contact form.
const APPLICATION_LIMIT = rateLimit({
    limit: 40,
    windowMs: 60 * 60 * 1000,
    keyPrefix: "application",
    message: "Too many submissions. Please try again later.",
});

PUBLIC_ROUTER.get('/', PUBLIC_CONT.HomeCont);
PUBLIC_ROUTER.get('/institutes', PUBLIC_CONT.GetPublishedInstitutesCont);
PUBLIC_ROUTER.get('/institutes/:id', PUBLIC_CONT.GetPublishedInstituteByIdCont);
const REGISTRATION_UPLOADS = uploadDocuments.fields([
    { name: 'ownerCnicFront', maxCount: 1 },
    { name: 'ownerCnicBack', maxCount: 1 },
    { name: 'instituteRegistration', maxCount: 1 },
    { name: 'instituteOwnership', maxCount: 1 },
    { name: 'ownerPhoto', maxCount: 1 },
    { name: 'paymentProof', maxCount: 1 }
]);

PUBLIC_ROUTER.post("/verify/email", OTP_LIMIT, REGISTRATION_UPLOADS, PUBLIC_CONT.verifyEmail);
PUBLIC_ROUTER.post('/reg/admin', REGISTER_LIMIT, REGISTRATION_UPLOADS, PUBLIC_CONT.AdminRegisterCont);
PUBLIC_ROUTER.post("/login", LOGIN_LIMIT, PUBLIC_CONT.loginCont);
PUBLIC_ROUTER.get("/user/loginState", UserMW, PUBLIC_CONT.IsUserLoogedIn);
// Logging out must work even when the token already expired, otherwise the
// stale cookie stays in the browser.
PUBLIC_ROUTER.get("/logout", PUBLIC_CONT.logOutCont);
PUBLIC_ROUTER.post("/submit/admission", APPLICATION_LIMIT, upload.fields([
    { name: "studentPhoto", maxCount: 1 },
    { name: "cnicBForm", maxCount: 1 },
    { name: "previousSchoolCertificate", maxCount: 1 }
]), PUBLIC_CONT.AdmissionSubmissionCont);
PUBLIC_ROUTER.get("/hero/page/institutes", PUBLIC_CONT.GetHeroPageInstitutesCont);
PUBLIC_ROUTER.post("/reset_password/verify_email", RESET_LIMIT, PUBLIC_CONT.VerifyEmailToResetPassCont);
PUBLIC_ROUTER.post("/reset_password/verify_otp", RESET_LIMIT, PUBLIC_CONT.VerifyOTPToResetPassCont);
PUBLIC_ROUTER.post("/reset_password", RESET_LIMIT, PUBLIC_CONT.ResetPasswordCont);
// Change Password : Password already known to user
// It is dashboard related router but it is placed here b/c it is used in more than one dashboard.
PUBLIC_ROUTER.post("/change_password", UserMW, rateLimit({
    limit: 10,
    windowMs: 60 * 60 * 1000,
    keyPrefix: "change-password",
    message: "Too many password change attempts. Please try again later.",
}), PUBLIC_CONT.ChangePasswordCont);
PUBLIC_ROUTER.post("/handle/review", UserMW, rateLimit({
    limit: 20,
    windowMs: 60 * 60 * 1000,
    keyPrefix: "review",
    message: "You have submitted too many reviews. Please try again later.",
}), PUBLIC_CONT.HandleReviewSubmissionCont);
PUBLIC_ROUTER.post("/get/reviews", PUBLIC_CONT.GetReviewsCont);
PUBLIC_ROUTER.post("/submit/contact-form", FORM_LIMIT, PUBLIC_CONT.SubmitContactFormCont);
PUBLIC_ROUTER.get("/get/all/courses", PUBLIC_CONT.GetAllCoursesCont);
PUBLIC_ROUTER.get("/get/course/:id", PUBLIC_CONT.GetCourseByIdCont);
PUBLIC_ROUTER.post("/submit/course/enrollment", APPLICATION_LIMIT, uploadDocuments.single("paymentProof"), PUBLIC_CONT.SubmitCourseEnrollmentCont);
export default PUBLIC_ROUTER;
