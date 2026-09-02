import Admin from "../Models/Admin.js";
import { Student } from "../Models/Student.js";

export const validateAdmin = async (req, res, selectFields = "") => {
    let user = req.user;
    if (!user) {
        res.json({ success: false, message: "Please login first" });
        return { isValid: false };
    }

    let query = Admin.findById(user.id);
    if (selectFields) {
        query = query.select(selectFields);
    }
    let admin = await query;

    if (!admin) {
        res.json({ success: false, message: "Admin not Found." });
        return { isValid: false };
    }

    if (!admin.approved) {
        res.json({ success: false, message: "Application not approved." });
        return { isValid: false };
    }

    if (admin.disabled) {
        res.json({ success: false, message: "Your account has been disabled." });
        return { isValid: false };
    }

    if (admin.role !== "admin") {
        res.json({ success: false, message: "Authorized person can access." });
        return { isValid: false };
    }

    return { isValid: true, admin };
};

export const validateStudent = async (req, res) => {
    if (!req.user) {
        res.json({ success: false, message: "Please login first" });
        return { isValid: false };
    }

    let student = await Student.findById(req.user.id);
    if (!student) {
        res.json({ success: false, message: "Student not found" });
        return { isValid: false };
    }

    if (student.status === "SUSPENDED") {
        res.json({ success: false, message: "Your account has been suspended. Contact Administrator." });
        return { isValid: false };
    }

    return { isValid: true, student };
};

export const validateSuperAdmin = async (req, res) => {
    let user = req.user;
    if (!user) {
        res.json({ success: false, message: "Please login first." });
        return { isValid: false };
    }

    let superadmin = await Admin.findById(user.id);

    if (!superadmin) {
        res.json({ success: false, message: "Not Registered." });
        return { isValid: false };
    }

    if (superadmin.role !== "superadmin") {
        res.json({ success: false, message: "Only authorized personal can access." });
        return { isValid: false };
    }

    return { isValid: true, superadmin };
};
