const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/email");


// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Bu e-posta adresi zaten kayıtlı.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // E-posta doğrulama tokenı oluştur
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // Token 15 dakika geçerli
        const verificationTokenExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken,
            verificationTokenExpires,
        });

        // Doğrulama e-postasını gönder
        await sendVerificationEmail(
            user.email,
            verificationToken
        );

        return res.status(201).json({
            message:
                "Kullanıcı başarıyla oluşturuldu. E-posta adresinizi doğrulamanız gerekiyor.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Kullanıcı oluşturulurken bir hata oluştu.",
            error: error.message,
        });
    }
};
// EMAIL VERIFICATION
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Doğrulama bağlantısı geçersiz veya süresi dolmuş.",
            });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "E-posta adresiniz başarıyla doğrulandı.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "E-posta doğrulama sırasında bir hata oluştu.",
            error: error.message,
        });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "E-posta veya şifre hatalı.",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "E-posta veya şifre hatalı.",
            });
        }

        // E-posta doğrulaması yapılmamışsa girişe izin verme
        if (!user.isVerified) {
            return res.status(403).json({
                message:
                    "Lütfen giriş yapmadan önce e-posta adresinizi doğrulayın.",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            message: "Giriş başarılı.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Giriş sırasında bir hata oluştu.",
            error: error.message,
        });
    }
};


module.exports = {
    register,
    login,
    verifyEmail,
};