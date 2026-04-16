const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const nodemailer = require("nodemailer");

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists? =", !!process.env.EMAIL_PASS);

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // must be 16-char app password, no spaces
      },
    });

    await transporter.sendMail({
      from: `"GlowAI" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // sends to yourself for testing
      subject: "GlowAI Test Email ✅",
      text: "Email service is working perfectly 🚀",
    });

    console.log("✅ Email sent successfully!");
  } catch (err) {
    console.error("❌ Email failed:", err.message || err);
  }
}

sendTestEmail();
