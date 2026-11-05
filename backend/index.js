import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import { connectDb } from "./Config/db.js";
import SUPER_ADMIN_ROUTER from "./Router/super_admin_router.js";
import PUBLIC_ROUTER from "./Router/public_router.js";
import STUDENT_ROUTER from "./Router/student_router.js";
import ADMIN_ROUTER from "./Router/admin_router.js";

const app = express();
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 5000;

// ===========================================
// PROXY / TRUST
// ===========================================
// The app is served behind Nginx/Caddy in production. Without this, Express
// cannot read `X-Forwarded-*` headers which breaks `secure` cookies and the
// client IP in the logs.
if (IS_PRODUCTION) {
    app.set("trust proxy", 1);
}

// ===========================================
// SECURITY HEADERS
// ===========================================
app.disable("x-powered-by");

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    next();
});

// ===========================================
// CORS
// ===========================================
// FRONTEND_URL may hold a comma separated list of allowed origins so that
// staging and production can be whitelisted at the same time.
const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

if (allowedOrigins.length === 0) {
    console.warn(
        "[CORS] FRONTEND_URL is not configured - every origin is accepted. " +
        "Set FRONTEND_URL in the environment before going live."
    );
}

const corsOptions = {
    origin(origin, callback) {
        // Same-origin / server-to-server calls do not send an Origin header.
        if (!origin) return callback(null, true);

        if (allowedOrigins.length === 0) return callback(null, true);
        if (allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
            return callback(null, true);
        }

        return callback(new Error(`Origin "${origin}" is not allowed by CORS.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    maxAge: 86400,
};

app.use(cors(corsOptions));

// ===========================================
// BODY PARSERS
// ===========================================
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

// ===========================================
// HEALTH CHECK
// ===========================================
app.get("/health", (req, res) => {
    const dbState = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
    const states = ["disconnected", "connected", "connecting", "disconnecting"];

    res.status(dbState === 1 ? 200 : 503).json({
        success: dbState === 1,
        status: "ok",
        database: states[dbState] || "unknown",
        uptime: Math.round(process.uptime()),
    });
});

// ===========================================
// ROUTES
// ===========================================
app.use(SUPER_ADMIN_ROUTER);
app.use(ADMIN_ROUTER);
app.use(STUDENT_ROUTER);
app.use(PUBLIC_ROUTER);

// ===========================================
// 404 - UNKNOWN ROUTE
// ===========================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
});

// ===========================================
// GLOBAL ERROR HANDLER
// ===========================================
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    // CORS rejections are raised before any route runs.
    if (error?.message?.includes("is not allowed by CORS")) {
        return res.status(403).json({
            success: false,
            message: "This origin is not allowed to access the API.",
        });
    }

    // Multer upload errors.
    if (error?.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
            success: false,
            message: "The uploaded file is too large. Maximum size is 5 MB.",
        });
    }
    if (error?.code === "LIMIT_UNEXPECTED_FILE" || error?.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
            success: false,
            message: "Unexpected or too many files were uploaded.",
        });
    }
    if (error?.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    // Mongoose validation / duplicate key errors.
    if (error?.name === "ValidationError" && error?.errors) {
        const message = Object.values(error.errors)
            .map((err) => err.message)
            .join(", ");
        return res.status(400).json({ success: false, message });
    }
    if (error?.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A record with these details already exists.",
        });
    }
    if (error?.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid identifier provided.",
        });
    }

    // Malformed JSON body.
    if (error?.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Malformed request body.",
        });
    }

    console.error(`[Unhandled Error] ${req.method} ${req.originalUrl}:`, error);

    res.status(500).json({
        success: false,
        message: IS_PRODUCTION
            ? "Internal server error."
            : error?.message || "Internal server error.",
    });
});

// ===========================================
// BOOTSTRAP
// ===========================================
const startServer = async () => {
    const dbConnected = await connectDb();

    if (!dbConnected && IS_PRODUCTION) {
        console.error("Database connection failed - aborting start in production.");
        process.exit(1);
    }

    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (${IS_PRODUCTION ? "production" : "development"})`);
    });

    server.on("error", (error) => {
        if (error?.code === "EADDRINUSE") {
            console.error(`Port ${PORT} is already in use.`);
        } else {
            console.error("Server error:", error);
        }
        process.exit(1);
    });

    // ===========================================
    // GRACEFUL SHUTDOWN
    // ===========================================
    const shutdown = (signal) => {
        console.log(`\n${signal} received - shutting down gracefully...`);
        server.close(async () => {
            try {
                await mongoose.connection.close();
            } catch (error) {
                console.error("Error while closing the database connection:", error);
            }
            process.exit(0);
        });

        // Do not hang forever if a connection stays open.
        setTimeout(() => {
            console.error("Forced shutdown after timeout.");
            process.exit(1);
        }, 10000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("unhandledRejection", (reason) => {
        console.error("Unhandled promise rejection:", reason);
    });
    process.on("uncaughtException", (error) => {
        console.error("Uncaught exception:", error);
        shutdown("uncaughtException");
    });
};

startServer();

export default app;