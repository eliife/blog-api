const express = require("express");

const {
    getProfile,
    updateProfile,
} = require("../controllers/profile.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const uploadProfileImage = require("../middlewares/upload.middleware");

const router = express.Router();


router.get(
    "/",
    authMiddleware,
    getProfile
);


router.put(
    "/",
    authMiddleware,
    uploadProfileImage.single("avatar"),
    updateProfile
);


module.exports = router;