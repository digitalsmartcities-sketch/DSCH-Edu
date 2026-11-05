import multer from "multer";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB
const MAX_FILES = 10;

const storage = multer.memoryStorage();

const IMAGE_MIME_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif",
]);

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"];

const DOCUMENT_MIME_TYPES = new Set([...IMAGE_MIME_TYPES, "application/pdf"]);
const DOCUMENT_EXTENSIONS = [...IMAGE_EXTENSIONS, ".pdf"];

const fileFilter = (allowedMimeTypes, allowedExtensions, allowedText) => {
    return (req, file, cb) => {
        const extension = (file.originalname || "").toLowerCase();
        const isAllowed =
            allowedMimeTypes.has(file.mimetype) ||
            allowedExtensions.some((ext) => extension.endsWith(ext));

        if (isAllowed) {
            return cb(null, true);
        }

        const error = new Error(
            `Unsupported file type for "${file.originalname}". Only ${allowedText} are allowed.`
        );
        error.code = "INVALID_FILE_TYPE";
        return cb(error);
    };
};

const uploadOptions = (filter) => ({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_FILES,
    },
    fileFilter: filter,
});

// Branding assets, photos and payment receipts.
export const upload = multer(
    uploadOptions(fileFilter(IMAGE_MIME_TYPES, IMAGE_EXTENSIONS, "JPG, PNG, WEBP and GIF images"))
);

// Admin registration documents may also be PDFs (registration papers,
// ownership certificates, payment receipts).
export const uploadDocuments = multer(
    uploadOptions(fileFilter(DOCUMENT_MIME_TYPES, DOCUMENT_EXTENSIONS, "JPG, PNG, WEBP, GIF and PDF files"))
);
