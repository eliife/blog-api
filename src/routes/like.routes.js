const express = require("express");

const {
    toggleLike
} = require("../controllers/like.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


// Blog yazısını beğen / beğeniyi geri çek
router.post(
    "/:postId",
    authMiddleware,
    toggleLike
);

module.exports = router;