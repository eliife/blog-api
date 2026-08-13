const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Kullanıcı adı zorunludur'],
      unique: true,
      trim: true,
      minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'],
    },
    email: {
      type: String,
      required: [true, 'E-posta adresi zorunludur'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
      select: false, // Sorgularda varsayılan olarak şifre dönmesin (güvenlik)
    },
    avatar: {
      type: String,
      default: 'default-avatar.png',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [250, 'Biyografi en fazla 250 karakter olabilir'],
    }

    }, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
