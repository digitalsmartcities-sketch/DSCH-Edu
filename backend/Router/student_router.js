import express from "express";
import { UserMW } from "../Middleware/userMW.js";
import { uploadDocuments } from "../Config/multer.js";
import * as STD_CONT from "../Controller/student_cont.js";
const STUDENT_ROUTER = express.Router();

// =====================================
// Student Routes
// =====================================
STUDENT_ROUTER.get("/check/student/access", UserMW, STD_CONT.CheckStudentAccessCont);
STUDENT_ROUTER.get("/get/my/application", UserMW, STD_CONT.GetMyApplication);
STUDENT_ROUTER.post("/get/bill/ById", UserMW, STD_CONT.GetBillByIdCont);
STUDENT_ROUTER.post("/submit/bill", UserMW, uploadDocuments.single("paymentProof"), STD_CONT.SubmitBill);
STUDENT_ROUTER.get("/get/student/profile", UserMW, STD_CONT.GetStudentProfileCont);
STUDENT_ROUTER.get("/get/student/fees", UserMW, STD_CONT.GetStudentFeesCont);
STUDENT_ROUTER.post("/update/student/profile", UserMW, STD_CONT.UpdateStudentProfileCont);

export default STUDENT_ROUTER;