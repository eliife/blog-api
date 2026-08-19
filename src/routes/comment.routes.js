const express = require("express");

const {
    createComment,
    getCommentsByPost,
    deleteComment,
    replyToComment
} = require("../controllers/comment.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


router.post(
    "/:postId",
    authMiddleware,
    createComment
);



router.get(
    "/:postId",
    getCommentsByPost
);



router.delete(
    "/:id",
    authMiddleware,
    deleteComment
);



router.post(
    "/:commentId/reply",
    authMiddleware,
    replyToComment
);


module.exports = router;