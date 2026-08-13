const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Başlık zorunludur"],
            trim: true,
            minlength: [3, "Başlık en az 3 karakter olmalıdır"],
        },

        content: {
            type: String,
            required: [true, "İçerik zorunludur"],
            trim: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
 
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", postSchema);