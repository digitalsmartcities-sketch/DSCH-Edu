import express from "express";
import { upload } from "../Config/multure.js";
import { UserMW } from "../Middleware/userMW.js";
import * as PUBLIC_CONT from "../Controller/public_cont.js"
const PUBLIC_ROUTER = express.Router();

PUBLIC_ROUTER.get('/', PUBLIC_CONT.HomeCont);
PUBLIC_ROUTER.get('/institutes', PUBLIC_CONT.GetPublishedInstitutesCont);
PUBLIC_ROUTER.get('/institutes/:id', PUBLIC_CONT.GetPublishedInstituteByIdCont);
PUBLIC_ROUTER.post("/verify/email", PUBLIC_CONT.verifyEmail);
PUBLIC_ROUTER.post('/reg/admin', upload.fields([
    { name: 'ownerCnicFront', maxCount: 1 },
    { name: 'ownerCnicBack', maxCount: 1 },
    { name: 'instituteRegistration', maxCount: 1 },
    { name: 'instituteOwnership', maxCount: 1 },
    { name: 'ownerPhoto', maxCount: 1 },
    { name: 'paymentProof', maxCount: 1 }
]), PUBLIC_CONT.AdminRegisterCont);
PUBLIC_ROUTER.post("/login", PUBLIC_CONT.loginCont);
PUBLIC_ROUTER.get("/user/loginState", UserMW, PUBLIC_CONT.IsUserLoogedIn);
PUBLIC_ROUTER.get("/logout", UserMW, PUBLIC_CONT.logOutCont);
PUBLIC_ROUTER.post("/submit/admission", upload.fields([
    { name: "studentPhoto", maxCount: 1 },
    { name: "cnicBForm", maxCount: 1 },
    { name: "previousSchoolCertificate", maxCount: 1 }
]), PUBLIC_CONT.AdmissionSubmissionCont);
PUBLIC_ROUTER.get("/hero/page/institutes", PUBLIC_CONT.GetHeroPageInstitutesCont);
PUBLIC_ROUTER.post("/reset_password/verify_email", PUBLIC_CONT.VerifyEmailToResetPassCont);
PUBLIC_ROUTER.post("/reset_password/verify_otp", PUBLIC_CONT.VerifyOTPToResetPassCont);
PUBLIC_ROUTER.post("/reset_password", PUBLIC_CONT.ResetPasswordCont);
// Change Password : Password already known to user
// It is dashboard related router but it is placed here b/c it is used in more than one dashboard.
PUBLIC_ROUTER.post("/change_password", UserMW, PUBLIC_CONT.ChangePasswordCont);
PUBLIC_ROUTER.post("/handle/review", UserMW, PUBLIC_CONT.HandleReviewSubmissionCont);
PUBLIC_ROUTER.post("/get/reviews", PUBLIC_CONT.GetReviewsCont);
PUBLIC_ROUTER.post("/submit/contact-form", PUBLIC_CONT.SubmitContactFormCont);
PUBLIC_ROUTER.get("/get/all/courses", PUBLIC_CONT.GetAllCoursesCont);
PUBLIC_ROUTER.get("/get/course/:id", PUBLIC_CONT.GetCourseByIdCont);
PUBLIC_ROUTER.post("/submit/course/enrollment", upload.single("paymentProof"), PUBLIC_CONT.SubmitCourseEnrollmentCont);
export default PUBLIC_ROUTER;
