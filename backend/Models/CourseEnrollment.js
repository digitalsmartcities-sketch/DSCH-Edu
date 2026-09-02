import mongoose from "mongoose";

const paymentProofSchema = new mongoose.Schema({
   title: { type: String, default: "" },
   imageUrl: { type: String, default: "" },
   publicId: { type: String, default: "" }
}, { _id: false });

const courseEnrollmentSchema = new mongoose.Schema({
   /* =====================================================
      COURSE
   ===================================================== */
   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
   /* =====================================================
      APPLICANT INFORMATION
   ===================================================== */
   fullName: { type: String, required: true, trim: true },
   email: { type: String, required: true, trim: true, lowercase: true },
   phone: { type: String, required: true, trim: true },
   gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
   dateOfBirth: { type: String, default: "" },
   /* =====================================================
      EDUCATIONAL INFORMATION
   ===================================================== */
   qualification: { type: String, default: "", trim: true },
   institution: { type: String, default: "", trim: true },
   /* =====================================================
      COURSE SNAPSHOT
   ===================================================== */
   courseTitle: { type: String, required: true, trim: true },
   courseCode: { type: String, required: true, trim: true, uppercase: true },
   courseProvider: { type: String, required: true, trim: true },
   /* =====================================================
      ADDITIONAL INFORMATION
   ===================================================== */
   motivation: { type: String, default: "", trim: true },
   /* =====================================================
      ENROLLMENT STATUS
   ===================================================== */
   status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
   rejectionReason: { type: String, default: "" },
   reviewedAt: { type: Date, default: null },
   agreement: { type: Boolean, default: false },
   /* =====================================================
      PAYMENT
   ===================================================== */
   payment: {
      status: { type: String, enum: ["PENDING", "SUBMITTED", "PAID", "REJECTED"], default: "PENDING" },
      amount: { type: Number, default: 0, min: 0 },
      paymentMethod: { type: String, enum: ["", "EASYPAISA", "JAZZCASH", "BANK_TRANSFER", "OTHER"], default: "" },
      transactionId: { type: String, default: "", trim: true },
      paymentDate: { type: Date, default: null },
      paymentProof: { type: paymentProofSchema, default: () => ({}) },
      submittedAt: { type: Date, default: null },
      reviewedAt: { type: Date, default: null },
      rejectionReason: { type: String, default: "" }
   },
   /* =====================================================
      CERTIFICATE
   ===================================================== */
   certificateIssued: { type: Boolean, default: false }
}, {
   timestamps: true
});

const CourseEnrollment = mongoose.model(
   "CourseEnrollment",
   courseEnrollmentSchema,
   "course_enrollments"
);

export default CourseEnrollment;