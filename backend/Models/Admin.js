import "./plugins.js";
import mongoose from "mongoose"

const AdminSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    fatherName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
    instituteName: { type: String, required: true, default: "" },
    instituteType: { type: String, required: true, default: "" },
    registrationNumber: { type: String, required: true, default: "" },
    establishedYear: { type: String, required: true, default: "" },
    instituteAddress: { type: String, required: true, default: "" },
    instituteCity: { type: String, required: true, default: "" },
    instituteProvince: { type: String, required: true, default: "" },
    institutePhone: { type: String, required: true, default: "" },
    instituteEmail: { type: String, required: true, default: "" },
    website: { type: String, default: "" },
    // The hash is never returned by default so it can not leak through an
    // API response. It has to be requested explicitly with `+password`.
    password: { type: String, required: true, select: false },
    instituteId: { type: String, default: "" },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    images: { type: Array, default: [], required: true },
    emailVerified: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false }
}, { timestamps: true });

const Admin = mongoose.model("Admin", AdminSchema)

export default Admin