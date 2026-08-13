const Post = require("../models/post");
const Like = require("../models/like.model");


const createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Başlık ve içerik alanları zorunludur.",
            });
        }

        const post = await Post.create({
            title,
            content,
            tags: tags || [],
            author: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Blog yazısı başarıyla oluşturuldu.",
            data: post,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası.",
            error: error.message,
        });
    }
};


const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email avatar")
            .sort({ createdAt: -1 })
            .lean();

        const postsWithLikes = await Promise.all(
            posts.map(async (post) => {
                const likeCount = await Like.countDocuments({
                    post: post._id,
                });

                return {
                    ...post,
                    likeCount,
                };
            })
        );

        return res.status(200).json({
            success: true,
            count: postsWithLikes.length,
            data: postsWithLikes,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası.",
            error: error.message,
        });
    }
};


const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email avatar");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı.",
            });
        }

        const likeCount = await Like.countDocuments({
            post: post._id,
        });

        return res.status(200).json({
            success: true,
            data: {
                ...post.toObject(),
                likeCount,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Geçersiz yazı ID'si veya sunucu hatası.",
        });
    }
};

const updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı.",
            });
        }

        // Sadece yazının sahibi güncelleyebilir
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Bu işlem için yetkiniz yok.",
            });
        }

        post = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Blog yazısı başarıyla güncellendi.",
            data: post,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası.",
            error: error.message,
        });
    }
};


const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı.",
            });
        }

        
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Bu işlem için yetkiniz yok.",
            });
        }

        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Blog yazısı başarıyla silindi.",
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
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
};