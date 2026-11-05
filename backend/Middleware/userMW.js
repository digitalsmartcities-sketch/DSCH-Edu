import jwt from "jsonwebtoken";

/**
 * Verifies the JWT stored in the `token` cookie and attaches the decoded
 * payload to `req.user`.
 *
 * Responds with `401 Unauthorized` when the token is missing, expired or
 * invalid.
 */
export const UserMW = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized, Please Login First",
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("UserMW: JWT_SECRET is not configured.");
        return res.status(500).json({
            success: false,
            message: "Authentication is not configured.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        // Expired or tampered token -> drop the stale cookie.
        res.clearCookie("token");
        return res.status(401).json({
            success: false,
            message: error?.name === "TokenExpiredError"
                ? "Your session has expired. Please login again."
                : "Unauthorized",
        });
    }
};
