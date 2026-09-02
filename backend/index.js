import express from "express";
import cors from "cors";
import { connectDb } from "./Config/db.js";
import cookieParser from "cookie-parser";
import SUPER_ADMIN_ROUTER from "./Router/super_admin_router.js";
import PUBLIC_ROUTER from "./Router/public_router.js";
import STUDENT_ROUTER from "./Router/student_router.js";
import ADMIN_ROUTER from "./Router/admin_router.js";

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
connectDb();

const port = process.env.PORT || 5000;

app.use(SUPER_ADMIN_ROUTER);
app.use(ADMIN_ROUTER);
app.use(STUDENT_ROUTER);
app.use(PUBLIC_ROUTER);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});