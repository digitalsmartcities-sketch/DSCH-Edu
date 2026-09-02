import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
    {
        // =========================================
        // INSTITUTE RELATION
        // =========================================
        instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
        // =========================================
        // STUDENT PERSONAL INFORMATION
        // =========================================
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true }, 
        phone: { type: String, required: true, trim: true },
        gender: { type: String, required: true, trim: true },
        dateOfBirth: { type: String, required: true },
        role: { type: String, default: "student" },
        // =========================================
        // ACADEMIC INFORMATION
        // =========================================
        previousSchool: { type: String, default: "" },
        lastQualification: { type: String, default: "" },
        obtainedMarks: { type: Number, default: 0 },
        totalMarks: { type: Number, default: 0 },
        passingYear: { type: String, default: "" },
        class: { type: String, required: true },
        // =========================================
        // FEE INFORMATION
        // =========================================
        admissionFee: { type: Number, required: true, min: 0 },
        monthlyFee: { type: Number, required: true, min: 0 },
        feeRecord: {
            type: [{
                _id: false,
                month: { type: String },
                year: { type: Number },
                feeDocId: { type: mongoose.Schema.Types.ObjectId, ref: "Fee" }
            }], default: null
        },
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
        documents: [
            {
                title: { type: String, required: true },
                imageUrl: { type: String, required: true },
                publicId: { type: String, default: "" }
            }
        ],
        // =========================================
        // STUDENT ACCOUNT
        // =========================================
        password: { type: String, required: true },
        // =========================================
        // STUDENT ACCOUNT / ACTIVATION STATUS
        // =========================================
        approved: { type: Boolean, default: false },
        status: { type: String, enum: ["ACTIVE", "INACTIVE", "SUSPENDED"], default: "INACTIVE" },
        // =========================================
        // ADMISSION APPLICATION
        // =========================================
        admissionApplication: { type: String, enum: ["APPROVED", "REJECTED"], default: "REJECTED" },
        admissionApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Admission", required: true },
    },
    {
        timestamps: true
    }
);


export const Student = mongoose.model(
    "Student",
    StudentSchema
);