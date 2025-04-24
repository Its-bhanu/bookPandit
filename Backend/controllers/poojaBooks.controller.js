const PoojaBook = require("../models/poojaBooks.model");
const Pandit = require("../models/pandit.model");
const User = require("../models/user.model");
const nodemailer = require('nodemailer');
const { format } = require('date-fns');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports.createBooking = async (req, res) => {
    try {
        const { name, phoneNo, poojaType, date, time, address } = req.body.formData;
        const { panditId, userId } = req.body;

        // Validate required fields
        if (!name || !phoneNo || !poojaType || !date || !time || !address ) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Check for existing booking
        const existingBooking = await PoojaBook.findOne({ phoneNo, date });
        if (existingBooking) {
            return res.status(400).json({ 
                success: false,
                message: "Booking with this phone number already exists for this date" 
            });
        }

        // Create new booking
        const newBooking = new PoojaBook({
            name, 
            phoneNo, 
            poojaType, 
            date, 
            time, 
            address, 
            // panditId,
            // userId,
            status: 'confirmed'
        });

        await newBooking.save();

        // Update pandit and user with booking reference
        await Pandit.findByIdAndUpdate(panditId, {
            $push: { BookingId: newBooking._id }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { BookingId: newBooking._id }
        });

        // Fetch user and pandit details for email
        const [user, pandit] = await Promise.all([
            User.findById(userId),
            Pandit.findById(panditId)
        ]);
 
        // Format date and time
        const formattedDate = format(new Date(date), 'PPPP');
        const formattedTime = format(new Date(`1970-01-01T${time}`), 'hh:mm a');

        // Email content for user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Your ${poojaType} Booking Confirmation`,
            html: `
                <h2>Booking Confirmation</h2>
                <p>Dear ${name},</p>
                <p>Your ${poojaType} has been successfully booked with Pandit ${pandit.fullname}.</p>
                <h3>Booking Details:</h3>
                <ul>
                    <li><strong>Date:</strong> ${formattedDate}</li>
                    <li><strong>Time:</strong> ${formattedTime}</li>
                    <li><strong>Address:</strong> ${address}</li>
                    <li><strong>Pandit Contact:</strong> ${pandit.mobile}</li>
                </ul>
                <p>Thank you for using our service!</p>
                <p><strong>Customer Support:</strong> support@bookpandit.com | +91 9876543210</p>
            `
        };

        // Email content for pandit
        const panditMailOptions = {
            from: process.env.EMAIL_USER,
            to: pandit.email,
            subject: `New ${poojaType} Booking Assignment`,
            html: `
                <h2>New Booking Assignment</h2>
                <p>Dear ${pandit.fullname},</p>
                <p>You have been assigned a new ${poojaType} booking.</p>
                <h3>Booking Details:</h3>
                <ul>
                    <li><strong>Client Name:</strong> ${name}</li>
                    <li><strong>Date:</strong> ${formattedDate}</li>
                    <li><strong>Time:</strong> ${formattedTime}</li>
                    <li><strong>Address:</strong> ${address}</li>
                    <li><strong>Client Contact:</strong> ${phoneNo}</li>
                </ul>
                <p>Please contact the client to confirm the booking details.</p>
                <p><strong>Support Team</strong><br>BookPandit Services</p>
            `
        };

        // Send emails (fire and forget)
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Error sending user email:', error);
            } else {
                console.log('User email sent:', info.response);
            }
        });

        transporter.sendMail(panditMailOptions, (error, info) => {
            if (error) {
                console.error('Error sending pandit email:', error);
            } else {
                console.log('Pandit email sent:', info.response);
            }
        });

        res.status(201).json({ 
            success: true,
            message: 'Booking created successfully', 
            booking: newBooking 
        });

    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating booking', 
            error: error.message 
        });
    }
};