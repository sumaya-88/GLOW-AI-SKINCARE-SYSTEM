const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../services/emailService");
const User = require("../models/User");

// REGISTER → SEND OTP
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, phone, skinDiseases, medications, profilePicture } = req.body;

    if (User.users.find(u => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Map skinDiseases to skinIssues for consistency with Profile model
    // Store all extra fields in userData
    User.tempUsers[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      userData: {
        name,
        email,
        password: hashedPassword,
        age,
        phone,
        skinIssues: skinDiseases, // Mapping here
        medications,
        profilePicture
      },
    };

    await sendOTP(email, otp);

    // Log OTP for testing (remove in production)
    console.log(`\n📧 OTP sent to ${email}: ${otp}\n`);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// VERIFY OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const record = User.tempUsers[email];

  if (!record) return res.status(400).json({ message: "No OTP found" });
  if (Date.now() > record.expires) return res.status(400).json({ message: "OTP expired" });
  if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  User.users.push({ id: Date.now().toString(), ...record.userData });
  delete User.tempUsers[email];
  User.saveUsers(); // Persist changes

  res.json({ message: "Email verified. You can login." });
};

// RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const record = User.tempUsers[email];

    if (!record) {
      return res.status(400).json({ message: "No registration found. Please register again." });
    }

    // Generate new OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Update the OTP and expiry time
    User.tempUsers[email] = {
      ...record,
      otp,
      expires: Date.now() + 10 * 60 * 1000,
    };

    await sendOTP(email, otp);

    // Log OTP for testing (remove in production)
    console.log(`\n🔄 OTP resent to ${email}: ${otp}\n`);

    res.json({ message: "OTP resent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = User.users.find(u => u.email === email);

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  // Streak Logic
  const today = new Date().toISOString().split('T')[0];
  const lastLogin = user.lastLoginDate;

  // Initialize if missing
  if (user.streak === undefined) user.streak = 0;

  if (user.streak > 0) {
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLogin === yesterdayStr) {
        user.streak += 1; // Consecutive day
      } else {
        user.streak = 1; // Broken streak, reset to 1
      }
      user.lastLoginDate = today;
      User.saveUsers();
    }
  } else {
    // If streak is 0, we don't auto-start it on login. 
    // User must explicitly "Start Routine" or we can treat 1st login as start?
    // User requested "show 0 as I didn't start". So we keep it 0.
    // But we update lastLoginDate to today just to track activity?
    // No, if we update lastLoginDate, the "yesterday" check might fail later 
    // if they start tomorrow. Ideally, lastLoginDate tracks *streak* activity.
    // Let's leave lastLoginDate null/old until they start.
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "1h" }
  );

  const { password: _, ...safeUser } = user;
  res.json({
    message: "Login successful",
    token,
    user: safeUser,
  });
};

// GET PROFILE
exports.getProfile = (req, res) => {
  const user = User.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { password, ...safeUser } = user;
  res.json(safeUser);
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userIndex = User.users.findIndex(u => u.id === req.userId);
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    const { name, age, phone, skinType, currentlyUsing, skinIssues, medications, profilePicture, remindersEnabled } = req.body;

    console.log("Updating profile for user:", req.userId);
    console.log("Received data:", req.body);

    const { sendWellnessReminder } = require("../services/emailService");

    // Check if reminders are being enabled for the first time or re-enabled
    // REMOVED WELCOME EMAIL: Requirements state emails should ONLY be sent at scheduled times.
    /*
    if (remindersEnabled === true && User.users[userIndex].remindersEnabled !== true) {
      try {
        await sendWellnessReminder(User.users[userIndex].email, "welcome");
        console.log(`Sent welcome reminder to ${User.users[userIndex].email}`);
      } catch (emailError) {
        console.log("Failed to send welcome email:", emailError);
      }
    }
    */

    // Update fields if provided in the request body (even if empty string)
    if (name !== undefined) User.users[userIndex].name = name;
    if (age !== undefined) User.users[userIndex].age = age;
    if (phone !== undefined) User.users[userIndex].phone = phone;
    if (skinType !== undefined) User.users[userIndex].skinType = skinType;
    if (currentlyUsing !== undefined) User.users[userIndex].currentlyUsing = currentlyUsing;
    if (skinIssues !== undefined) User.users[userIndex].skinIssues = skinIssues;
    if (medications !== undefined) User.users[userIndex].medications = medications;
    if (profilePicture !== undefined) User.users[userIndex].profilePicture = profilePicture;
    if (remindersEnabled !== undefined) User.users[userIndex].remindersEnabled = remindersEnabled;

    User.saveUsers(); // Persist changes

    // Debug log
    const fs = require('fs');
    const path = require('path');
    fs.appendFileSync(path.join(__dirname, '../debug.log'), `[${new Date().toISOString()}] Updated profile for ${req.userId}. New Age: ${User.users[userIndex].age}. Saved: true\n`);

    const { password, ...safeUser } = User.users[userIndex];
    res.json({ message: "Profile updated successfully", user: safeUser });
  } catch (err) {
    console.error(err);
    const fs = require('fs');
    const path = require('path');
    fs.appendFileSync(path.join(__dirname, '../debug.log'), `[${new Date().toISOString()}] Update ERROR: ${err.message}\n`);
    res.status(500).json({ message: "Update failed" });
  }
};

// Start Streak (Set to 1)
exports.startRoutine = async (req, res) => {
  try {
    const userIndex = User.users.findIndex(u => u.id === req.userId);
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    User.users[userIndex].streak = 1;
    User.users[userIndex].lastLoginDate = new Date().toISOString().split('T')[0];

    User.saveUsers();

    res.json({ message: "Routine started!", streak: 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to start routine" });
  }
};
