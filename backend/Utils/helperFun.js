import cloudinary from "../Config/cloudinary.js";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";
import { transporter } from "../Config/nodemailer.js";

// ===========================================
// Cloudinary URL helpers
// ===========================================

/**
 * Cloudinary returns an `http://` URL in `url` and an `https://` one in
 * `secure_url`. Serving the http variant on an https page is blocked by the
 * browser (mixed content), so every URL that leaves the backend is forced to
 * https.
 */
const toHttps = (url) => {
    if (typeof url !== "string") return url;
    if (url.startsWith("http://")) {
        return "https://" + url.slice("http://".length);
    }
    return url;
};

/**
 * Normalises a Cloudinary upload result so that both `url` and `secure_url`
 * point to the https variant. Keeps every existing call site working while
 * guaranteeing the browser never receives an insecure image link.
 */
export const normalizeUploadResult = (result) => {
    if (!result || typeof result !== "object") return result;

    const secureUrl = toHttps(result.secure_url || result.url || "");

    return {
        ...result,
        url: secureUrl,
        secure_url: secureUrl,
    };
};

export const uploadFiles = (file, folder) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.buffer) {
            return reject(new Error("No file provided for upload."));
        }

        const stream = cloudinary.uploader.upload_stream({
            folder: folder,
            resource_type: "image",
        },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(normalizeUploadResult(result));
                }
            }
        );
        streamifier
            .createReadStream(file.buffer)
            .pipe(stream);
    });
}

// ===========================================
// Token helpers
// ===========================================

export const generateToken = (payload, options = {}) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error("GenerateToken Error: JWT_SECRET is not configured.");
            return false;
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: options.expiresIn || "1h",
            ...options,
        });
        return token;
    } catch (error) {
        console.error("GenerateToken Error:", error);
        return false;
    }
}

export const verifyToken = (token) => {
    if (!token) {
        return false;
    }
    try {
        let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (error) {
        // Expired or tampered tokens are an expected condition (expired
        // sessions, logout, wrong OTP) and must not spam the logs.
        if (error?.name !== "TokenExpiredError") {
            console.error("VerifyToken Error:", error.message);
        }
        return false;
    }
}

// ===========================================
// Cookie helpers
// ===========================================

const isProduction = () => process.env.NODE_ENV === "production";

/**
 * Central place for the cookie options so that every authentication cookie
 * uses the same, production aware settings.
 */
export const authCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction(),
    // "lax" keeps the cookie working for every same-site request (including
    // the ones triggered by a link inside an email) while still blocking it
    // for cross-site requests, which is what protects the state changing
    // endpoints against CSRF.
    sameSite: "lax",
    maxAge,
    path: "/",
});

// ===========================================
// Dashboard routing
// ===========================================

/**
 * The dashboard that belongs to a role. The frontend uses it to send a signed
 * in user back to the right place after a page reload.
 */
export const DASHBOARD_BY_ROLE = {
    superadmin: "/superadmin/dashboard",
    admin: "/inst/dashboard",
    student: "/std/dashboard",
};

export const getDashboardUrl = (role) => DASHBOARD_BY_ROLE[role] || "/";

/**
 * FRONTEND_URL may contain a comma separated list of allowed origins for CORS.
 * Links inside emails and public institute profiles must point to one concrete
 * origin, so the first entry is used and any trailing slash is removed.
 */
export const getFrontendUrl = () => {
    const origins = String(process.env.FRONTEND_URL || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return (origins[0] || "").replace(/\/+$/, "");
};

// ===========================================
// Email helper
// ===========================================

/**
 * Sends an email and never throws. Notifications are a side effect of a
 * business action, so a failing SMTP server must never roll back (or hide)
 * an already persisted change.
 */
export const sendEmail = async (to, subj, html) => {
    if (!to) {
        console.error("sendEmail Error: recipient is missing.");
        return false;
    }

    try {
        await transporter.sendMail({
            from: `'DSCH' <${process.env.SMTP_USER}>`,
            to,
            subject: subj,
            html
        });
        return true;
    } catch (error) {
        console.error(`sendEmail Error (to: ${to}, subject: ${subj}):`, error?.message || error);
        return false;
    }
}

// ===========================================
// Cloudinary delete helper
// ===========================================

export const deleteFiles = (publicId) => {
    return new Promise((resolve, reject) => {
        if (!publicId) {
            return resolve({ result: "skipped" });
        }
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * Deletes a list of Cloudinary files and keeps going if one of them fails.
 * A failed media cleanup must not stop the related database record from being
 * removed.
 */
export const deleteFilesSafely = async (publicIds = []) => {
    const uniqueIds = [...new Set(publicIds.filter(Boolean))];

    for (const publicId of uniqueIds) {
        try {
            await deleteFiles(publicId);
        } catch (error) {
            console.error(`Failed to delete Cloudinary file "${publicId}":`, error);
        }
    }
}

// ===========================================
// Password generator
// ===========================================

const CAPITAL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SMALL_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*";

/**
 * Generates a cryptographically random password that always contains at least
 * one lower case letter, one upper case letter, one digit and one symbol.
 */
export const generatePassword = (length = 10) => {
    const pools = [CAPITAL_LETTERS, SMALL_LETTERS, NUMBERS, SYMBOLS];

    let characters = pools.map((pool) => pool[randomInt(0, pool.length)]);

    const allPools = pools.join("");
    while (characters.length < length) {
        characters.push(allPools[randomInt(0, allPools.length)]);
    }

    // Fisher-Yates shuffle so the guaranteed characters are not always first.
    for (let i = characters.length - 1; i > 0; i--) {
        const j = randomInt(0, i + 1);
        [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    return characters.join("");
}
