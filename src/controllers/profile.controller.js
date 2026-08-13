const User = require("../models/user");


// Profil bilgilerini getir
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "Kullanıcı bulunamadı.",
            });
        }

        return res.status(200).json({
            message: "Profil bilgileri başarıyla getirildi.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Sunucu hatası.",
            error: error.message,
        });
    }
};


// Profil bilgilerini ve profil resmini güncelle
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı.",
            });
        }

        // İsim ve bio güncelleme
        if (req.body.name) {
            user.name = req.body.name;
        }

        if (req.body.bio) {
            user.bio = req.body.bio;
        }

        // Profil resmi yüklendiyse avatar alanını güncelle
        if (req.file) {
            user.avatar = req.file.filename;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profil başarıyla güncellendi.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
            },
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
    getProfile,
    updateProfile,
};