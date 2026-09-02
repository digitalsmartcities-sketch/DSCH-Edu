import jwt from "jsonwebtoken";

export const UserMW = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.json({ success: false, message: "Unauthorized, Please Login First" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Unauthorized" });
    }

}