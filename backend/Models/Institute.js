import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema({
    // =========================================
    // BASIC INFORMATION
    // =========================================
    instituteAddress: { type: String, required: true },
    instituteEmail: { type: String, required: true },
    instituteName: { type: String, required: true },
    institutePhone: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    instituteType: { type: String, required: true },
    instituteCity: { type: String, default: "" },
    instituteProvince: { type: String, default: "" },
    adminApproved: { type: Boolean, required: true },
    isPublished: { type: Boolean, default: false },
    website: { type: String, default: "" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true, unique: true },
    // =========================================
    // BRANDING & TIMETABLE IMAGES
    // =========================================
    instituteLogo: {
        imageUrl: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },
    timeTableImage: {
        imageUrl: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },
    // =========================================
    // HERO IMAGES
    // =========================================
    heroImages: [{
        name: { type: String, required: true, enum: ["image1", "image2", "image3", "image4", "image5"] },
        imageUrl: { type: String, default: "" },
        public_id: { type: String, default: "" }
    }],
    // =========================================
    // QUICK INFORMATION
    // =========================================
    quickInfo: {
        admissionStatus: { type: String, enum: ["OPEN", "CLOSE"], default: "CLOSE" },
        board: { type: String, trim: true, default: "" },
        classes: { type: String, trim: true, default: "" },
        medium: { type: String, trim: true, default: "" },
        gender: { type: String, trim: true, default: "" }
    },
    // =========================================
    // ABOUT / OVERVIEW
    // =========================================
    aboutInfo: {
        about: { type: String, default: "" },
        establishedYear: { type: String, default: "" },
        totalStudents: { type: String, default: "" },
        teachers: { type: String, default: "" },
        campusArea: { type: String, default: "" }
    },
    // =========================================
    // ACADEMIC PROGRAMS
    // =========================================
    academicPrograms: [{
        id: { type: Number, required: true },
        class: { type: mongoose.Schema.Types.Mixed, required: true },
        duration: { type: String, required: true, trim: true },
        admissionFee: { type: Number, required: true, min: 0 },
        monthlyFee: { type: Number, required: true, min: 0 },
        admissionStatus: { type: String, enum: ["OPEN", "CLOSE"], default: "OPEN" }
    }, { default: [] }],
    // =========================================
    // CAMPUS FACILITIES
    // =========================================
    facilities: [{
        id: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" }
    }, { default: [] }],
    // =========================================
    // CAMPUS GALLERY
    // =========================================
    gallery: [{
        id: { type: String, required: true },
        imageUrl: { type: String, default: "" },
        public_id: { type: String, default: "" }
    }, { default: [] }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }, { default: [] }],
    // =========================================
    // FAQs
    // =========================================
    faqs: [{
        id: { type: String, required: true },
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true }
    }, { default: [] }],
}, {
    timestamps: true
}
);


export const Institute = mongoose.model("Institute", instituteSchema);
