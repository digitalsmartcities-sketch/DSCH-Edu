import "./plugins.js";
import mongoose from "mongoose";
/* =========================================================
   MODULE
========================================================= */
const moduleSchema = new mongoose.Schema({
   title: { type: String, required: true, trim: true },
   description: { type: String, default: "", trim: true },
   lessons: { type: Array, default: [] }
}, { _id: true });
/* =========================================================
   COURSE
========================================================= */
const courseSchema = new mongoose.Schema({
   /* =====================================================
      BASIC INFORMATION
   ===================================================== */
   title: { type: String, required: true, trim: true },
   courseCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
   language: { type: String, required: true, trim: true },
   price: { type: Number, default: 0 },
   category: { type: String, required: true, trim: true },
   shortDescription: { type: String, required: true, trim: true, maxlength: 400 },
   description: { type: String, required: true, trim: true },
   whatsappGroupLink: { type: String, default: "" },
   /* =====================================================
      COURSE MEDIA
   ===================================================== */
   thumbnail: { type: String, default: "" },
   thumbnailPublicId: { type: String, default: "" },
   /* =====================================================
      COURSE PROVIDER
   ===================================================== */
   offeredByInstituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", default: null },
   offeredByInstitute: { type: String, required: true, trim: true },
   offeredByInstituteLogoUrl: { type: String, default: "" },
   /* =====================================================
      COURSE DETAILS
   ===================================================== */
   level: { type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], default: "BEGINNER" },
   mode: { type: String, enum: ["ONLINE", "ONSITE", "BLENDED"], default: "ONLINE" },
   duration: { type: String, required: true, trim: true },
   /* =====================================================
      LEARNING INFORMATION
   ===================================================== */
   learningOutcomes: { type: [String], default: [] },
   requirements: { type: [String], default: [] },
   targetAudience: { type: [String], default: [] },
   /* =====================================================
      CURRICULUM
   ===================================================== */
   modules: { type: [moduleSchema], default: [] },
   /* =====================================================
      ENROLLMENT
   ===================================================== */
   enrollmentOpen: { type: Boolean, default: true },
   maxStudents: { type: Number, default: null, min: 1 },
   enrollmentStart: { type: Date, default: null },
   enrollmentEnd: { type: Date, default: null },
   /* =====================================================
      CERTIFICATE
   ===================================================== */
   certificateAvailable: { type: Boolean, default: true },
   /* =====================================================
      PUBLICATION
   ===================================================== */
   status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT" },
   // featured: { type: Boolean, default: false },
   rating: { type: Number, default: 0 },
   reviewCount: { type: Number, default: 0 },
   studentEnrolled: { type: Number, default: 0 }
}, {
   timestamps: true
});
/* =========================================================
   MODEL
========================================================= */

const Course = mongoose.model("Course", courseSchema, "courses");

export default Course;