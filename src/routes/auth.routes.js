const express = require("express");

const {
    register,
    login,
    verifyEmail,
} = require("../controllers/auth.controller");


const router = express.Router();


router.post("/register", register);

router.post("/login", login);

router.get("/verify-email/:token", verifyEmail);


console.log("AUTH ROUTES YÜKLENDİ");
console.log("LOGIN ROUTE YÜKLENDİ");


module.exports = router;