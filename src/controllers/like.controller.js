const Like = require("../models/like.model");
const Post = require("../models/post");


const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı.",
            });
        }

      
        const existingLike = await Like.findOne({
            user: userId,
            post: postId,
        });

     
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