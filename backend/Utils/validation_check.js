import Admin from "../Models/Admin.js";
import { Student } from "../Models/Student.js";

/**
 * Shared validation helpers.
 *
 * Every helper answers the request itself when the caller is not allowed to
 * continue, therefore the controllers must always bail out with
 * `if (!isValid) return;`.
 */

// ===========================================
// INSTITUTE ADMIN
// ===========================================
export const validateAdmin = async (req, res, selectFields = "") => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ success: false, message: "Please login first" });
        return { isValid: false };
    }

    let query = Admin.findById(user.id);
    if (selectFields) {
        query = query.select(selectFields);
    }
    const admin = await query;

    if (!admin) {
        res.status(404).json({ success: false, message: "Admin not Found." });
        return { isValid: false };
    }

    if (admin.role !== "admin") {
        res.status(403).json({ success: false, message: "Authorized person can access." });
        return { isValid: false };
    }

    if (admin.disabled) {
        res.status(403).json({ success: false, message: "Your account has been disabled." });
        return { isValid: false };
    }

    if (admin.rejected) {
        res.status(403).json({ success: false, message: "Your application has been rejected." });
        return { isValid: false };
    }

    if (!admin.approved) {
        res.status(403).json({ success: false, message: "Application not approved." });
        return { isValid: false };
    }

    return { isValid: true, admin };
};

// ===========================================
// STUDENT
// ===========================================
export const validateStudent = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Please login first" });
        return { isValid: false };
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
        res.status(404).json({ success: false, message: "Student not found" });
        return { isValid: false };
    }

    if (student.status === "SUSPENDED") {
        res.status(403).json({
            success: false,
            message: "Your account has been suspended. Contact Administrator.",
        });
        return { isValid: false };
    }

    return { isValid: true, student };
};

// ===========================================
// PLATFORM SUPER ADMIN
// ===========================================
export const validateSuperAdmin = async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ success: false, message: "Please login first." });
        return { isValid: false };
    }

    const superadmin = await Admin.findById(user.id);

    if (!superadmin) {
        res.status(404).json({ success: false, message: "Not Registered." });
        return { isValid: false };
    }

    if (superadmin.role !== "superadmin") {
        res.status(403).json({ success: false, message: "Only authorized personal can access." });
        return { isValid: false };
    }

    if (superadmin.disabled) {
        res.status(403).json({ success: false, message: "Your account has been disabled." });
        return { isValid: false };
    }

    return { isValid: true, superadmin };
};
