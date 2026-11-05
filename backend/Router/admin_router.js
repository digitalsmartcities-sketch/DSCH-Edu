import express from "express";
import { UserMW } from "../Middleware/userMW.js";
import { upload, uploadDocuments } from "../Config/multer.js";
import * as ADMIN_CONT from "../Controller/admin_cont.js"
const ADMIN_ROUTER = express.Router();


// =======================================
// Admin (Service Owner/Provider) Routes:
// =======================================
ADMIN_ROUTER.get("/verify/admin", UserMW, ADMIN_CONT.checkAdminAccessCont);
ADMIN_ROUTER.get("/get/instData", UserMW, ADMIN_CONT.getInstituteData);
// Institute Data Management 
ADMIN_ROUTER.post("/save/instData/heroImages", UserMW, upload.fields([
    { name: "heroImages1", maxCount: 1 },
    { name: "heroImages2", maxCount: 1 },
    { name: "heroImages3", maxCount: 1 },
    { name: "heroImages4", maxCount: 1 },
    { name: "heroImages5", maxCount: 1 }
]), ADMIN_CONT.SaveInstHeroImageCont);
ADMIN_ROUTER.post("/save/instData/brandingImages", UserMW, upload.fields([
    { name: "instituteLogo", maxCount: 1 },
    { name: "timeTableImage", maxCount: 1 }
]), ADMIN_CONT.SaveBrandingImagesCont);
ADMIN_ROUTER.post("/save/instData/quickInfo", UserMW, ADMIN_CONT.SaveQuickInfoCont);
ADMIN_ROUTER.post("/save/instData/aboutInfo", UserMW, ADMIN_CONT.SaveAboutInfoCont);
ADMIN_ROUTER.post("/save/instData/academicPrograms", UserMW, ADMIN_CONT.SaveAcademicProgramsCont);
ADMIN_ROUTER.post("/save/instData/facilities", UserMW, ADMIN_CONT.SaveFacilitiesCont);
ADMIN_ROUTER.post("/save/instData/gallery", UserMW, upload.array("galleryImages", 10), ADMIN_CONT.SaveGalleryCont);
ADMIN_ROUTER.post("/save/instData/faqs", UserMW, ADMIN_CONT.SaveFaqsCont);
ADMIN_ROUTER.post("/publish/instData", UserMW, ADMIN_CONT.PublishInstituteCont);
ADMIN_ROUTER.post("/get/admission/applications", UserMW, ADMIN_CONT.GetAdmissionApplicationsCont);
ADMIN_ROUTER.post("/get/application/ById", UserMW, ADMIN_CONT.GetApplicationByIdCont);
ADMIN_ROUTER.post("/approve/admission", UserMW, ADMIN_CONT.ApproveAdmissionCont);
ADMIN_ROUTER.post("/delete/admission/application", UserMW, ADMIN_CONT.DeleteAdmissionApplicationCont);
ADMIN_ROUTER.post("/reject/admission", UserMW, ADMIN_CONT.RejectAdmissionCont);
ADMIN_ROUTER.post("/get/student/payment/ById", UserMW, ADMIN_CONT.GetStudentPaymentByIdCont);
ADMIN_ROUTER.post("/approve/student/payment", UserMW, ADMIN_CONT.ApproveStudentPaymentCont);
ADMIN_ROUTER.get("/get/institute/students", UserMW, ADMIN_CONT.GetInstituteStudentsCont);
ADMIN_ROUTER.post("/get/student/ById", UserMW, ADMIN_CONT.GetStudentByIdCont);
ADMIN_ROUTER.get("/get/inst/fees", UserMW, ADMIN_CONT.GetInstFeesRecordCont);
ADMIN_ROUTER.post("/generate/monthly/fee", UserMW, ADMIN_CONT.GenerateMonthlyFeeCont);
ADMIN_ROUTER.post("/approve/payment/fee", UserMW, ADMIN_CONT.ApproveMonthlyFeePaymentCont)
ADMIN_ROUTER.post("/certificate/studentData", UserMW, ADMIN_CONT.GetStudentDataForCertificateCont);
ADMIN_ROUTER.post("/update/student/aplication", UserMW, uploadDocuments.any(), ADMIN_CONT.UpdateRejectedStudentApplicationCont);
ADMIN_ROUTER.get("/admin/profile", UserMW, ADMIN_CONT.GetAdminProfileCont);
ADMIN_ROUTER.post("/reject/student/payment", UserMW, ADMIN_CONT.RejectStudentPaymentCont);
ADMIN_ROUTER.post("/generate/fee/for/student", UserMW, ADMIN_CONT.GenerateFeeForStudentCont);
ADMIN_ROUTER.post("/reject/fee/payment/:id", UserMW, ADMIN_CONT.RejectFeePaymentCont);
ADMIN_ROUTER.post("/suspend/student/:id", UserMW, ADMIN_CONT.SuspendTheStudentCont);
ADMIN_ROUTER.post("/unsuspend/student/:id", UserMW, ADMIN_CONT.UnsuspendTheStudentCont);


export default ADMIN_ROUTER;