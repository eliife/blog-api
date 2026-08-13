const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            message: "Bu e-posta adresi zaten kayıtlı."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return res.status(201).json({
        message: "Kullanıcı başarıyla oluşturuldu.",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
};


// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({
            message: "E-posta veya şifre hatalı."
        });
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "E-posta veya şifre hatalı."
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return res.status(200).json({
        message: "Giriş başarılı.",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
};
module.exports = {
    register,
    login
};