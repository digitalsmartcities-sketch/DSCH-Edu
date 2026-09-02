import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String, required: true, trim: true, maxlength: 1000 },
        userName: { type: String, required: true, trim: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
        userRole: { type: String, required: true, enum: ["student", "admin"] },
        instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
        instituteName: { type: String, required: true, trim: true },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);