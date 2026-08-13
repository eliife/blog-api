const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB bağlantısı başarılı.");
    } catch (error) {
        console.log("MongoDB bağlantı hatası:", error.message);
        process.exit(1);
    }
};

module.exports = dbConnection;