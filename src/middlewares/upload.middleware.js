console.log("UPLOAD MIDDLEWARE YÜKLENDİ");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../../uploads/profiles");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    console.log("Dosya:", file.originalname);
    console.log("MIME:", file.mimetype);
    console.log("Uzantı:", extension);

    if (!allowedExtensions.includes(extension)) {
        return cb(
            new Error(
                "Bu resim tipi desteklenmemektedir. JPG, JPEG, PNG, GIF veya WEBP kullanınız."
            ),
            false
        );
    }

    cb(null, true);
};

const uploadProfileImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = uploadProfileImage;