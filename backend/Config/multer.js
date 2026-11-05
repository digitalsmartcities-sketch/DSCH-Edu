import multer from "multer";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB
const MAX_FILES = 10;

const storage = multer.memoryStorage();

// Only images are accepted. Every upload of this platform is a photo of a
// document, a payment receipt or a branding asset.
const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif",
]);

export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"];

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        return cb(null, true);
    }

    const extension = (file.originalname || "").toLowerCase();
    const hasAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.some((ext) => extension.endsWith(ext));

    if (hasAllowedExtension) {
        return cb(null, true);
    }

    const error = new Error(
        `Unsupported file type for "${file.originalname}". Only JPG, PNG, WEBP and GIF images are allowed.`
    );
    error.code = "INVALID_FILE_TYPE";
    return cb(error);
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_FILES,
    },
    fileFilter: fileFilter,
});
