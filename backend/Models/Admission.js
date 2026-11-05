import "./plugins.js";
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    title: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    public_id: { type: String, default: "" }
}, { _id: false });

const admissionSchema = new mongoose.Schema({
    // =========================================
    // INSTITUTE / APPLICATION INFORMATION
    // =========================================
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    instituteName: { type: String, required: true },
    instituteType: { type: String, required: true },
    applyingFor: { type: String, required: true, trim: true },
    admissionFee: { type: Number, required: true, min: 0 },
    monthlyFee: { type: Number, required: true, min: 0 },
    agreement: { type: Boolean, default: false },
    isAdmissionCompleted: { type: Boolean, default: false },

    // =========================================
    // STUDENT INFORMATION
    // =========================================
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
    dateOfBirth: { type: String, required: true },

    // =========================================
    // ACADEMIC INFORMATION
    // =========================================
    previousSchool: { type: String, required: true, trim: true },
    lastQualification: { type: String, required: true, trim: true },
    obtainedMarks: { type: Number, required: true, min: 0 },
    totalMarks: { type: Number, required: true, min: 0 },
    passingYear: { type: String, required: true, trim: true },

    // =========================================
    // GUARDIAN INFORMATION
    // =========================================
    guardianName: { type: String, required: true, trim: true },
    guardianPhone: { type: String, required: true, trim: true },
    guardianCnic: { type: String, required: true, trim: true },
    guardianRelation: { type: String, required: true, trim: true },

    // =========================================
    // STUDENT DOCUMENTS
    // =========================================
    documents: { type: Array, default: [], required: true },

    // =========================================
    // INSTITUTE REVIEW WORKFLOW
    // =========================================
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" }, // Application Tracking field
    reviewedAt: { type: Date, default: null },
    admissionReceipt: { type: String, enum: ["NOT_GENERATED", "GENERATED"], default: "NOT_GENERATED" }, // Receipt tracking field
    admissionReceiptData: {
        instName: { type: String, default: "" },
        instAddress: { type: String, default: "" },
        instPhone: { type: String, default: "" },
        receiptNo: { type: String, default: "" },
        date: { type: Date, default: null },
        studentName: { type: String, default: "" },
        studentId: { type: String, default: "" },
        class: { type: String, default: "" },
        guardianName: { type: String, default: "" },
        guardianPhone: { type: String, default: "" },
        admissionFee: { type: Number, default: 0 },
        monthlyFee: { type: Number, default: 0 },
    },
    // =========================================
    // ADMISSION FEE WORKFLOW
    // =========================================
    paymentStatus: { type: String, enum: ["PENDING", "NOT_SUBMITTED", "SUBMITTED", "PAID", "REJECTED"], default: "PENDING" }, // payment tracking field
    paymentReviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" }, // store rejection of both the application rejection & payment rejection.
    paymentMethod: { type: String, default: "" },
    paymentSubmittedAt: {type : Date, default : null},
    transactionId: { type: String, default: "" },
    paymentProof: { type: documentSchema, default: () => ({}) },
    // =========================================
    // STUDENT DASHBOARD ACCESS
    // =========================================
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
}, { timestamps: true });

const Admission = mongoose.model("Admission", admissionSchema, "applications");

export default Admission;
