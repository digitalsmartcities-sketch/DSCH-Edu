import "./plugins.js";
import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
    class: { type: String, default: "" },
    feeType: { type: String, enum: ["MONTHLY"], default: "MONTHLY" },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["NOT_PAID", "PENDING", "PAID", "REJECTED"], default: "NOT_PAID" },
    paymentMethod: { type: String, default: "" },
    transactionId: { type: String, default: "" },
    submittedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" },
    paymentProof: {
        title: { type: String, default: "" },
        imageUrl: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },
    // FEE DATES
    paidAt: { type: Date, default: null },
    // GENERATION INFORMATION
    generatedAt: { type: Date, default: Date.now },
    // SPECIAL CASE
    includedWithAdmission: { type: Boolean, default: false }
}, {
    timestamps: true
});

export const Fee = mongoose.model("Fee", FeeSchema);