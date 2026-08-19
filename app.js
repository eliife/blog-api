const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dbConnection = require("./src/db/dbConnection");
const authRoutes = require("./src/routes/auth.routes");
const profileRoutes = require("./src/routes/profile.routes");
const postRoutes = require("./src/routes/post.routes");
const commentRoutes = require("./src/routes/comment.routes");
const likeRoutes = require("./src/routes/like.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Blog API çalışıyor."
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await dbConnection();

    app.listen(PORT, () => {
        console.log(`Server ${PORT} portunda çalışıyor.`);
    });
};

startServer();