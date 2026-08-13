const express = require("express");

const {
    getProfile,
    updateProfile,
} = require("../controllers/profile.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const uploadProfileImage = require("../middlewares/upload.middleware");

const router = express.Router();


// Profil bilgilerini getir
router.get(
    "/",
    authMiddleware,
    getProfile
);


// Profil bilgilerini ve profil resmini güncelle
router.put(
    "/",
    authMiddleware,
    uploadProfileImage.single("avatar"),
    updateProfile
);


module.exports = router;