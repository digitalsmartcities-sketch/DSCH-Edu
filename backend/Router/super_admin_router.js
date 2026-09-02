import express from "express";
import { UserMW } from "../Middleware/userMW.js";
import * as SP_CONT from "../Controller/super_admin_cont.js"
import { upload } from "../Config/multure.js";
const SUPER_ADMIN_ROUTER = express.Router();



// ===================================
// Super Admin Routes:
// ===================================
SUPER_ADMIN_ROUTER.get("/verify/superadmin", UserMW, SP_CONT.checkSuperAdminAccessCont);
SUPER_ADMIN_ROUTER.get("/get/applications", UserMW, SP_CONT.getAdminApplicationsCont);
SUPER_ADMIN_ROUTER.post("/get/admin/ById", UserMW, SP_CONT.getAdminByIdCont);
SUPER_ADMIN_ROUTER.post("/approve/admin", UserMW, SP_CONT.approveAdminCont);
SUPER_ADMIN_ROUTER.post("/disable/admin", UserMW, SP_CONT.disableAdminCont);
SUPER_ADMIN_ROUTER.post("/enable/admin", UserMW, SP_CONT.enableAdminCont);
SUPER_ADMIN_ROUTER.post("/rejectAdminApplication", UserMW, SP_CONT.rejectAdminCont);
SUPER_ADMIN_ROUTER.post("/update/admin/aplication", UserMW, upload.array("editedDoc"), SP_CONT.UpdateRejectedAdminApplicationCont);

SUPER_ADMIN_ROUTER.post("/create/course", UserMW, SP_CONT.createCourseCont);
SUPER_ADMIN_ROUTER.get("/get/all/courses/enrollments", UserMW, SP_CONT.getAllCoursesEnrollmentsCont);
SUPER_ADMIN_ROUTER.get("/get/enrollment/:id", UserMW, SP_CONT.getEnrollmentByIdCont);
SUPER_ADMIN_ROUTER.get("/approve/course/enrollment/:id", UserMW, SP_CONT.ApproveCourseEnrollmentCont);
SUPER_ADMIN_ROUTER.post("/reject/course/enrollment/:id", UserMW, SP_CONT.RejectCourseEnrollmentCont);
SUPER_ADMIN_ROUTER.post("/resubmit/course/enrollment/payment/:id", UserMW, upload.single("paymentProof"), SP_CONT.resubmitCourseEnrollmentPaymentCont);
SUPER_ADMIN_ROUTER.get("/get/certificate/:id", UserMW, SP_CONT.getCertificateDataByIdCont);
export default SUPER_ADMIN_ROUTER;