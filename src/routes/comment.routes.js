const express = require("express");

const {
    createComment,
    getCommentsByPost,
    deleteComment,
    replyToComment
} = require("../controllers/comment.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


// Yorum oluştur
router.post(
    "/:postId",
    authMiddleware,
    createComment
);


// Blogun yorumlarını getir
router.get(
    "/:postId",
    getCommentsByPost
);


// Yorumu sil
router.delete(
    "/:id",
    authMiddleware,
    deleteComment
);


// Yoruma cevap ver
router.post(
    "/:commentId/reply",
    authMiddleware,
    replyToComment
);


module.exports = router;