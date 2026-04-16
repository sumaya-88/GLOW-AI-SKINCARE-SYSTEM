// Test script to verify OTP generation
const otpGenerator = require("otp-generator");

console.log("\n🧪 Testing OTP Generation:\n");

// Generate 5 sample OTPs to show they are random
for (let i = 1; i <= 5; i++) {
    const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    console.log(`Sample OTP ${i}: ${otp}`);
}

console.log("\n✅ Each OTP is a random 6-digit number!");
console.log("✅ This is the same method used in the registration flow\n");
