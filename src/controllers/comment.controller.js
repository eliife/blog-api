const Comment = require("../models/comment.model");
const Post = require("../models/post");


const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { postId } = req.params;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Yorum alanı zorunludur.",
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı.",
            });
        }

        const comment = await Comment.create({
            content,
            author: req.user.id,
            post: postId,
        });

        return res.status(201).json({
            success: true,
            message: "Yorum başarıyla oluşturuldu.",
            data: comment,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası.",
            error: error.message,
        });
    }
};



const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı.",
            });
        }

        const comments = await Comment.find({ post: postId })
            .populate("author", "name email avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası.",
            error: error.message,
        });
    }
};


const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Yorum bulunamadı.",
            });
        }

        
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Bu yorumu silme yetkiniz yok.",
            });
        }

        await comment.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Yorum başarıyla silindi.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası.",
            error: error.message,
        });
    }
};

const replyToComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { commentId } = req.params;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Cevap alanı zorunludur.",
            });
        }

      
        const parentComment = await Comment.findById(commentId);

        if (!parentComment) {
            return res.status(404).json({
                success: false,
                message: "Cevap verilecek yorum bulunamadı.",
            });
        }

       
        const reply = await Comment.create({
            content,
            author: req.user.id,
            post: parentComment.post,
            parentComment: commentId,
        });

        return res.status(201).json({
            success: true,
            message: "Yoruma cevap başarıyla oluşturuldu.",
            data: reply,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası.",
            error: error.message,
        });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    deleteComment,
    replyToComment,
};