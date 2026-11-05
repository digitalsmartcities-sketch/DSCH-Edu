// ===========================================
// Shared input validation helpers
// ===========================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;
const CNIC_REGEX = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
const PHONE_COUNTRIES = ["92", "93", "91", "44", "1", "971", "966", "974"];

export const isValidEmail = (value) =>
    typeof value === "string" && EMAIL_REGEX.test(value.trim()) && value.trim().length <= 254;

export const isValidPhone = (value) =>
    typeof value === "string" && PHONE_REGEX.test(value.trim());

export const isValidCnic = (value) =>
    typeof value === "string" && CNIC_REGEX.test(value.trim());

export const isValidPassword = (value) =>
    typeof value === "string" &&
    value.length >= 8 &&
    value.length <= 100 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[0-9]/.test(value);

/**
 * Normalises a phone number to a comparable form (digits only, country code
 * without the leading zero).
 */
export const normalizePhone = (value) => {
    if (typeof value !== "string") return "";
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("0")) {
        digits = digits.slice(1);
    }
    return digits;
};

/**
 * Loose phone comparison that treats "+92 3001234567", "0300-1234567" and
 * "923001234567" as the same number.
 */
export const isSamePhone = (a, b) => {
    const left = normalizePhone(a);
    const right = normalizePhone(b);
    if (!left || !right) return false;
    if (left === right) return true;
    return PHONE_COUNTRIES.some(
        (code) => left.startsWith(code) && right.startsWith(code) && left.slice(code.length) === right.slice(code.length)
    );
};

/**
 * Validates a monetary amount coming from a form.
 */
export const isValidAmount = (value) => {
    const amount = Number(value);
    return Number.isFinite(amount) && amount >= 0 && amount <= 100000000;
};

/**
 * Validates the marks of an admission application.
 */
export const areValidMarks = (obtained, total) => {
    const obtainedMarks = Number(obtained);
    const totalMarks = Number(total);

    if (!Number.isFinite(obtainedMarks) || !Number.isFinite(totalMarks)) return false;
    if (totalMarks <= 0 || obtainedMarks < 0) return false;
    if (obtainedMarks > totalMarks) return false;

    return true;
};

/**
 * Escapes a string before it is embedded into an HTML email template.
 */
export const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

/**
 * Collects the missing keys of an object.
 */
export const findMissingFields = (source, requiredFields) =>
    requiredFields.filter((field) => {
        const value = source?.[field];
        return value === undefined || value === null || value === "";
    });
