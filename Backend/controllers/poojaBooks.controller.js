const PoojaBook = require("../models/poojaBooks.model");
const Pandit = require("../models/pandit.model");
const User = require("../models/user.model");
const nodemailer = require("nodemailer");

// Email function for pandit
const sendPanditEmail = async (panditEmail, panditName, userName, poojaType, date, time, address) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: panditEmail,
            subject: 'New Pooja Booking Assigned',
            text: `Dear ${panditName},\n\nYou have a new pooja booking:\n\nBooked By: ${userName}\nPooja Type: ${poojaType}\nDate: ${date}\nTime: ${time}\nAddress: ${address}\n\nPlease be prepared.\n\nThank you.`
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent to pandit:", panditEmail);
    } catch (error) {
        console.error("❌ Error sending email to pandit:", error);
    }
};

module.exports.createBooking = async (req, res) => {
    try {
        const { name, phoneNo, poojaType, date, time, address } = req.body.formData;
        const { panditId, userId } = req.body;

        // Validate input
        if (!name || !phoneNo || !poojaType || !date || !time || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if already booked
        const existingBooking = await PoojaBook.findOne({ phoneNo, date }, { _id: 1 }).maxTimeMS(2000);
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
            panditId,
            userId,
            status: "confirmed" // Assuming confirmed status on creation
        });

        await newBooking.save();

        // Update references
        await Pandit.findByIdAndUpdate(panditId, {
            $push: { BookingId: newBooking._id }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { BookingId: newBooking._id }
        });

        // Fetch Pandit Email
        const pandit = await Pandit.findById(panditId);
        if (pandit && pandit.email) {
            await sendPanditEmail(pandit.email, pandit.name, name, poojaType, date, time, address);
        }

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: newBooking
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};
