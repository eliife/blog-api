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
        const {
            search,
            author,
            tag,
            sort,
            startDate,
            endDate,
        } = req.query;

        
        const filter = {};

        
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    content: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        
        if (author) {
            filter.author = author;
        }

        
        if (tag) {
            filter.tags = {
                $in: [tag],
            };
        }

        
        if (startDate || endDate) {
            filter.createdAt = {};

            if (startDate) {
                const start = new Date(startDate);

                if (isNaN(start.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Geçersiz başlangıç tarihi.",
                    });
                }

                filter.createdAt.$gte = start;
            }

            if (endDate) {
                const end = new Date(endDate);

                if (isNaN(end.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Geçersiz bitiş tarihi.",
                    });
                }

                end.setHours(23, 59, 59, 999);

                filter.createdAt.$lte = end;
            }
        }

        
        const posts = await Post.find(filter)
            .populate("author", "name email avatar")
            .lean();

        
        const likeCounts = await Like.aggregate([
            {
                $group: {
                    _id: "$post",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        
        const likeCountMap = {};

        likeCounts.forEach((item) => {
            likeCountMap[item._id.toString()] = item.count;
        });


        const postsWithLikes = posts.map((post) => ({
            ...post,
            likeCount:
                likeCountMap[post._id.toString()] || 0,
        }));

        
        if (sort === "popular") {
            postsWithLikes.sort(
                (a, b) => b.likeCount - a.likeCount
            );
        } else {
            
            postsWithLikes.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );
        }

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