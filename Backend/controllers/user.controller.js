const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');
const nodemailer = require("nodemailer");
require("dotenv").config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Email Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Your email (from .env)
        pass: process.env.EMAIL_PASS,  // Your email password or app password
    },
});

const generateOTPEmailTemplate = (otp, logoUrl) => {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center;">
          <img src="${logoUrl}" alt="Company Logo" style="width: 150px; margin-bottom: 20px;">
          <h1 style="color: #333;">Welcome to Our Platform!</h1>
          <p style="font-size: 16px; color: #555;">
            Thank you for registering as a User. Please use the OTP below to verify your account:
          </p>
          <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block;">
            <h2 style="margin: 0; color: #333;">${otp}</h2>
          </div>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.
          </p>
        </body>
      </html>
    `;
};

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        console.log("Checking if user already exists...");
        const isUserAlready = await userModel.findOne({ email: email });

        if (isUserAlready) {
            console.log("User already exists:", isUserAlready);
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log("Generating OTP...");
        const otp = generateOTP();
        console.log(otp);
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        console.log("Sending OTP email...");
        const logoUrl = "https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png";
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Registration",
            html: generateOTPEmailTemplate(otp, logoUrl),
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully");

        console.log("Hashing password...");
        const hashedPassword = await userModel.hashPassword(password);

        console.log("Creating user...");
        // console
        const user = await userService.createUser({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires: otpExpires
        });

        console.log("User created successfully:", user);
        res.status(200).json({ message: "OTP sent to email", user });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.verifyUserOtp = async (req, res) => {
    const { otp , email} = req.body;
    console.log("insice verify otp")
    try {
        const user = await userModel.findOne({ email });
        console.log(user)
        if (!user) return res.status(400).json({ message: "user not found" });

        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ message: "Expired OTP" });
        }
        if(user.otp !== otp){
            return res.status(402).json({
                success: false,
                message: "Wrong Otp"
            })
        }
        // Mark as Verified
        user.otp=null;
        user.isVerified = true;
        // pandit.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully", user });
    } catch (error) {
        console.error("❌ Error verifying OTP:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'User not verified. Please verify your email.' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, user });
    } catch (error) {
        console.error("❌ Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    try {
        await blackListTokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out' });
    } catch (error) {
        console.error("❌ Error logging out:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};