// Description: All pandit related functions are implemented here
const blacklistTokenModel = require('../models/blacklistToken.model');
const panditModel = require('../models/pandit.model');
const panditService = require('../services/pandit.service');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");

const PanditModel = require('../models/pandit.model');
const PoojaBook = require('../models/poojaBooks.model');
require("dotenv").config();

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

const generateOTPEmailTemplate = (otp, logoUrl) => {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center;">
          <img src="${logoUrl}" alt="Company Logo" style="width: 150px; margin-bottom: 20px;">
          <h1 style="color: #333;">Welcome to Our Platform!</h1>
          <p style="font-size: 16px; color: #555;">
            Thank you for registering as a Pandit. Please use the OTP below to verify your account:
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
// Function to Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

module.exports.registerPandit = async (req, res) => {
    console.log(req.body);

    // Validate Request Body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors found:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, experience, age, password, mobile, address,expertise } = req.body;
    if (!fullname || !email || !experience || !age || !password || !mobile || !address ||!expertise) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    console.log("Checking if email is already registered...");
    const isAlreadyRegistered = await panditModel.findOne({ email });
    if (isAlreadyRegistered) {
        return res.status(400).json({ message: 'Email is already registered' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    const logoUrl="https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png";
    try {
        // Send OTP via Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Use correct environment variable
            to: email,
            subject: "Your OTP Code for Pandit Signup",
            html: generateOTPEmailTemplate(otp, logoUrl), 
        });
        console.log("✅ OTP sent successfully to", email);
    } catch (error) {
        console.error("❌ Error sending OTP email:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
    }

    try {
        // Hash Password before saving
        const hashPassword = await panditModel.hashPassword(password);

        // Create Pandit Record
        const pandit = await panditModel.create({
            fullname,
            email,
            experience,
            age,
            password: hashPassword,
            mobile,
            address,
            otp,
            otpExpires,
            expertise,
            isVerified: false,
        });

        // Generate Token
        const token = pandit.generateAuthToken();

        // Send Response
        res.status(201).json({ message: "OTP sent successfully. Please verify OTP.", token, pandit });

        console.log("✅ Pandit registered:", pandit);
    } catch (error) {
        console.error("❌ Error registering pandit:", error);
        console.log(res.body);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ OTP Verification for Pandit
module.exports.verifyPanditOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const pandit = await panditModel.findOne({ otp });

        if (!pandit) return res.status(400).json({ message: "Pandit not found" });

        if (Date.now() > pandit.otpExpires) {
            return res.status(400).json({ message: "Expired OTP" });
        }

        // Mark as Verified
        pandit.isVerified = true;
        // pandit.otp = null;
        pandit.otpExpires = null;
        await pandit.save();

        res.status(200).json({ message: "OTP verified successfully", pandit });
    } catch (error) {
        console.error("❌ Error verifying OTP:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Login Pandit
module.exports.loginPandit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const pandit = await panditModel.findOne({ email }).select('+password');
    if (!pandit) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!pandit.isVerified) {
        return res.status(403).json({ message: "OTP verification pending. Please verify OTP first." });
    }

    const isMatch = await pandit.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = pandit.generateAuthToken();

    res.status(200).json({ message: "Login successful", token, pandit });
};

// ✅ Get Pandit Profile
module.exports.getPanditProfile = async (req, res) => {
    res.status(200).json(req.pandit);
};

// ✅ Logout Pandit
module.exports.logoutPandit = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    await blacklistTokenModel.create({ token });
    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports.getAllPandits = async (req, res) => {
    try {
        console.log("Fetching all pandits..."); 
        const pandits = await PanditModel.find();
        // console.log("Retrieved Pandits:", pandits); 
        res.status(200).json(pandits);
    } catch (error) {
        console.error("Error retrieving Pandit profiles:", error.message); // Log the actual error
        res.status(500).json({ message: "Error retrieving Pandit profiles", error: error.message });
    }
};
module.exports.getBookingByUser=async(req,res)=>{
    try{
        console.log("fetching user bookings:");
        const { token } = req.query;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("djks")
        console.log(decodedToken);
        const userId = decodedToken._id;
        
        const pandit = await panditModel.findById(userId).populate('BookingId').exec();
        console.log(pandit)
        res.status(200).json({
            data: pandit.BookingId
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Error fetching user bookings", error });
    }
}
// 
module.exports.deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        // Find and update the Pandit document to remove the bookingId from BookingId array
        const pandit = await PanditModel.findOneAndUpdate(
            { BookingId: bookingId }, 
            { $pull: { BookingId: bookingId } }, 
            { new: true } 
        );

        if (!pandit) {
            return res.status(404).json({ message: "Booking not found in any Pandit's records" });
        }

        res.status(200).json({ message: 'Booking deleted successfully', pandit });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
};
module.exports.acceptBooking = async (req, res) => {
    try {
        // const bookingId = req.params;
         const bookingId = req.params;
         const panditId = req.pandit._id;
        // if(!mongoose.Types.ObjectId.isValid(bookingId)){
        //     return res.status(404).json('No booking with that id');
        // }

        // Find and update the Booking document to change the status to 'accepted'
        const booking = await PoojaBook.findById(
            bookingId);
        console.log(booking);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const pandit = await PanditModel.findById
        (panditId);
        console.log(pandit);
        if (!pandit) {  
            return res.status(404).json({ message: "Pandit not found" });
        }
        booking.status = 'accepted';
        booking.panditId = panditId;
        await booking.save();

        pandit.BookingId.push(booking._id);
        await pandit.save();

        const AcceptBooking = (logoUrl) => {
            return `
              <html>
                <body style="font-family: Arial, sans-serif; text-align: center;">
                  <img src="${logoUrl}" alt="Company Logo" style="width: 150px; margin-bottom: 20px;">
                  <h1 style="color: #333;">Booking Accepted</h1>
                  <p style="font-size: 16px; color: #555;">
                    Your booking for ${booking.poojaType} on ${booking.date} at ${booking.time} has been accepted by the Pandit.
                  </p>
                  <p style="font-size: 14px; color: #777; margin-top: 20px;">
                    Thank you for choosing our service!
                  </p>
                </body>
              </html>
            `;
          };
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,  
                pass: process.env.EMAIL_PASS,
            },
        });
        const logoUrl="https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png";
        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: booking.email, 
            subject: "Booking Confirmation - Pandit Accepted",
            html:AcceptBooking(logoUrl),
            // text: `Dear ${booking.name},\n\nYour booking for ${booking.poojaType} on ${booking.date} at ${booking.time} has been accepted by the Pandit.\n\nAddress: ${booking.address}\n\nThank you for choosing our service!\n\nBest Regards,\nPandit Booking Team`,
        };

        transporter.sendMail(mailOptions,  function(error, info) {
            if (error) {
                console.log("Error sending email:", error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
            

        res.status(200).json({ message: 'Booking accepted successfully', booking });
    }
    catch (error) {
        console.error("Error accepting booking:", error);
        res.status(500).json({ message: 'Error accepting booking', error: error.message });
    }
}
module.exports.declineBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await PoojaBook.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = 'declined';
        await booking.save();

        if (!booking.email) {
            return res.status(400).json({ message: "User email not found for this booking" });
        }

        
        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,  
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email Template
        const DeclineBooking = (logoUrl) => {
            return `
              <html>
                <body style="font-family: Arial, sans-serif; text-align: center;">
                  <img src="${logoUrl}" alt="Company Logo" style="width: 150px; margin-bottom: 20px;">
                  <h1 style="color: #333;">Booking Declined</h1>
                  <p style="font-size: 16px; color: #555;">
                    Your booking for <strong>${booking.poojaType}</strong> on <strong>${booking.date}</strong> at <strong>${booking.time}</strong> has been declined by the Pandit.
                  </p>
                  <p style="font-size: 14px; color: #777; margin-top: 20px;">
                    We apologize for any inconvenience. Please try booking with another Pandit. <br>
                    Thank you for choosing our service!
                  </p>
                </body>
              </html>
            `;
        };

        const logoUrl = "https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png";

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.email,
            subject: "Booking Declined - Pandit Unavailable",
            html: DeclineBooking(logoUrl),
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Failed to send email", error: error.message });
            }
            console.log("Email sent:", info.response);
            res.status(200).json({ message: 'Booking declined successfully, email sent.', booking });
        });

    } catch (error) {
        console.error("Error declining booking:", error);
        res.status(500).json({ message: 'Error declining booking', error: error.message });
    }
};