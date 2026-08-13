const Like = require("../models/like.model");
const Post = require("../models/post");

// Blog yazısını beğen / beğeniyi geri çek
const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        // Blog yazısı var mı?
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı.",
            });
        }

        // Kullanıcı bu yazıyı daha önce beğenmiş mi?
        const existingLike = await Like.findOne({
            user: userId,
            post: postId,
        });

        // Daha önce beğenmişse like'ı kaldır
        if (existingLike) {
            await existingLike.deleteOne();

            const likeCount = await Like.countDocuments({
                post: postId,
            });

            return res.status(200).json({
                success: true,
                message: "Beğeni geri çekildi.",
                likeCount,
            });
        }

        // Daha önce beğenmemişse yeni Like oluştur
        await Like.create({
            user: userId,
            post: postId,
        });

        const likeCount = await Like.countDocuments({
            post: postId,
        });

        return res.status(200).json({
            success: true,
            message: "Blog yazısı beğenildi.",
            likeCount,
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
    toggleLike,
};