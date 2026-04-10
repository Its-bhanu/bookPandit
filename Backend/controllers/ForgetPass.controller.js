const express = require("express");
const userModel = require("../models/user.model");
const panditModel = require("../models/pandit.model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Function to generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateOTPEmailTemplate = (otp, logoUrl) => {
  return `
      <html>
  <body style="font-family: Arial, sans-serif; text-align: center;">
    <img src="${logoUrl}" alt="Company Logo" style="width: 150px; margin-bottom: 20px;">
    <h1 style="color: #333;">Reset Your Password</h1>
    <p style="font-size: 16px; color: #555;">
      We received a request to reset your password. Use the OTP below to proceed:
    </p>
    <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block;">
      <h2 style="margin: 0; color: #333;">${otp}</h2>
    </div>
    <p style="font-size: 14px; color: #777; margin-top: 20px;">
      This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
    </p>
  </body>
</html>`;
};
const logoUrl =
  "https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png";

// 🔹 Common Function
async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset OTP",
    html: generateOTPEmailTemplate(otp, logoUrl),
  };

  await transporter.sendMail(mailOptions);
}

// -------------------- USER --------------------

// Step 1: Forget password (Send OTP)
module.exports.forgetPasswordUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await sendOtpEmail(user.email, otp);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Step 2: Verify OTP
module.exports.verifyOtpUser = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetPasswordOTP !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.resetPasswordExpires)
      return res.status(400).json({ message: "OTP expired" });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Step 3: Reset Password
module.exports.resetPasswordUser = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetPasswordOTP !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.resetPasswordExpires)
      return res.status(400).json({ message: "OTP expired" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- PANDIT --------------------

// Step 1: Forget password (Send OTP)
module.exports.forgetPasswordPandit = async (req, res) => {
  const { email } = req.body;
  try {
    const pandit = await panditModel.findOne({ email });
    if (!pandit) return res.status(404).json({ message: "Pandit not found" });

    const otp = generateOTP();
    pandit.resetPasswordOTP = otp;
    pandit.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await pandit.save();

    await sendOtpEmail(pandit.email, otp);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Step 2: Verify OTP
module.exports.verifyOtpPandit = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const pandit = await panditModel.findOne({ email });
    if (!pandit) return res.status(404).json({ message: "Pandit not found" });

    if (pandit.resetPasswordOTP !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > pandit.resetPasswordExpires)
      return res.status(400).json({ message: "OTP expired" });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Step 3: Reset Password
module.exports.resetPasswordPandit = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const pandit = await panditModel.findOne({ email });
    if (!pandit) return res.status(404).json({ message: "Pandit not found" });

    if (pandit.resetPasswordOTP !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > pandit.resetPasswordExpires)
      return res.status(400).json({ message: "OTP expired" });

    const hashed = await bcrypt.hash(newPassword, 10);
    pandit.password = hashed;
    pandit.resetPasswordOTP = null;
    pandit.resetPasswordExpires = null;
    await pandit.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
