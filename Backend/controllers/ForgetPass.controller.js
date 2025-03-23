const express = require('express');

const userModel=require('../models/user.model');
const panditModel=require("../models/pandit.model");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

require('dotenv').config(); // Load environment variables

// Function to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


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
</html>

    `;
};
const logoUrl = "https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png";
module.exports.forgetpassword = async (req, res) => {
    const { email } = req.body; // Ensure email is extracted from request body

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP and set expiration time (5 minutes)
        const otp = generateOTP();
        console.log(otp);
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save();

        // Configure mail transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset OTP',
            html: generateOTPEmailTemplate(otp, logoUrl)
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error in forget password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Verify OTP and Reset Password
module.exports.verifyOTPAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP is correct and not expired
        if (user.resetPasswordOTP !== otp) {
            console.log("Incorrect OTP provided.");
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (Date.now() > user.resetPasswordExpires) {
            console.log("OTP expired.");
            return res.status(400).json({ message: 'Expired OTP' });
        }
        // Hash new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOTP = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in verifying OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
module.exports.forgetpasswordpandit = async (req, res) => {
    const { email } = req.body; // Ensure email is extracted from request body

    try {
        const user = await panditModel.findOne({ email });
        if (!user) {
            console.log('pandit not found:', email);
            return res.status(404).json({ message: 'pandit not found' });
        }

        // Generate OTP and set expiration time (5 minutes)
        const otp = generateOTP();
        console.log(otp);
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save();

        // Configure mail transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset OTP',
            html: generateOTPEmailTemplate(otp, logoUrl),
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error in forget password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
module.exports.verifyOTPAndResetPasswordpandit = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await panditModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'pandit not found' });
        }

        // Check if OTP is correct and not expired
        if (user.resetPasswordOTP !== otp) {
            console.log("Incorrect OTP provided.");
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (Date.now() > user.resetPasswordExpires) {
            console.log("OTP expired.");
            return res.status(400).json({ message: 'Expired OTP' });
        }
        // Hash new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOTP = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in verifying OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};