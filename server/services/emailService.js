const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTP(email, otp) {
  return transporter.sendMail({
    from: `"GlowAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your GlowAI OTP Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes.</p>
    `,
  });
}

async function sendWellnessReminder(email, type) {
  const subject = type === "welcome"
    ? "✨ You're all set! GlowAI Reminders Enabled"
    : type === "morning"
      ? "☀️ Good Morning! Time for your GlowAI Routine"
      : "🌙 Good Night! Time to unwind with GlowAI";

  const message = type === "welcome"
    ? "Great choice! We will now remind you at 7 AM and 10 PM daily to keep your skin glowing."
    : type === "morning"
      ? "Rise and shine! A consistent morning routine sets the tone for a glowing day. don't forget your SPF!"
      : "Sleep is when your skin repairs itself. Cleanse away the day and prep your skin for overnight magic.";

  return transporter.sendMail({
    from: `"GlowAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
            <div style="font-family: Arial, sans-serif; color: #402F26;">
                <h2 style="color: #DE7983;">${type === "welcome" ? "Welcome to GlowAI Reminders" : type === "morning" ? "Morning Glow Routine" : "Nighttime Ritual"}</h2>
                <p style="font-size: 16px;">${message}</p>
                <div style="margin-top: 20px; padding: 15px; background-color: #FAEEEA; border-radius: 10px;">
                    <strong>Tip:</strong> Consistency is key to seeing results!
                </div>
                <p style="margin-top: 30px; font-size: 12px; color: #888;">You are receiving this because you enabled reminders in your GlowAI profile.</p>
            </div>
        `
  });
}

module.exports = { sendOTP, sendWellnessReminder };
