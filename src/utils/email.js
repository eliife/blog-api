const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
    console.log("SEND VERIFICATION EMAIL ÇALIŞTI");
    console.log("Gönderilecek mail:", email);

    // Test amaçlı Ethereal hesabı oluştur
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const verificationUrl =
        `http://localhost:5000/api/auth/verify-email/${token}`;

    const mailOptions = {
        from: '"Blog API" <no-reply@blog-api.com>',
        to: email,
        subject: "E-posta Doğrulama",
        html: `
            <h2>E-posta adresinizi doğrulayın</h2>

            <p>Blog API hesabınızı aktifleştirmek için aşağıdaki bağlantıya tıklayın:</p>

            <a href="${verificationUrl}">
                E-posta Adresimi Doğrula
            </a>

            <p>Bu bağlantı 15 dakika geçerlidir.</p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("MAIL BAŞARIYLA GÖNDERİLDİ");
    console.log("Message ID:", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log("MAIL ÖNİZLEME LİNKİ:");
    console.log(previewUrl);
};

module.exports = sendVerificationEmail;