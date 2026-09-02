import cloudinary from "../Config/cloudinary.js";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";
import { transporter } from "../Config/nodemailer.js";

export const uploadFiles = (file, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: folder,
            resource_type: "image",
        },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        streamifier
            .createReadStream(file.buffer)
            .pipe(stream);
    });
}

export const generateToken = (payload) => {
    try {
        let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        return token;
    } catch (error) {
        console.error("GenerateToken Error:", error);
        return false;
    }
}

export const verifyToken = (token) => {
    try {
        let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (error) {
        console.error("VerifyToken Error:", error);
        return false;
    }
}

export const sendEmail = async (to, subj, html) => {
    await transporter.sendMail({
        from: `'DSCH' < ${process.env.EMAIL_USER} >`,
        to,
        subject: subj,
        html
    });
}

export const deleteFiles = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

export const generatePassword = () => {
    let capitalLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let smallLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let symbols = ['!', '@', '#', '$', '%', '^', '&', '*']
    let content = [...capitalLetters, ...smallLetters, ...numbers, ...symbols]
    let password = '';
    for (let i = 0; i < 8; i++) {
        const randomNumber = Math.floor(Math.random() * 70) + 1;
        password += content[randomNumber];
    }
    return password;
}
