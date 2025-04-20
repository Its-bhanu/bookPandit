const PoojaBook = require("../models/poojaBooks.model");
const Pandit = require("../models/pandit.model");
const User = require("../models/user.model");

module.exports.createBooking = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        
        // Destructure the request body
        const { formData, panditId, userId } = req.body;
        const { name, phoneNo, poojaType, date, time, address } = formData || {};

        // Validate required fields
        if (!name || !phoneNo || !poojaType || !date || !time || !address || !panditId || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for existing booking with the same phone number AND date
        const existingBooking = await PoojaBook.findOne({ 
            phoneNo,
            date,
            status: { $ne: "cancelled" } // Exclude cancelled bookings
        });

        if (existingBooking) {
            return res.status(400).json({ 
                message: "You already have a booking with this phone number for the selected date",
                existingBooking
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
            status: "confirmed"
        });

        // Save booking and update related documents
        await newBooking.save();

        // Update Pandit's bookings
        await Pandit.findByIdAndUpdate(panditId, {
            $push: { BookingId: newBooking._id }
        }, { new: true });

        // Update User's bookings
        await User.findByIdAndUpdate(userId, {
            $push: { BookingId: newBooking._id }
        }, { new: true });

        console.log("Booking created successfully:", newBooking);
        
        res.status(201).json({ 
            success: true,
            message: 'Booking created successfully', 
            booking: newBooking 
        });

    } catch (error) {
        console.error("Error in createBooking:", error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating booking', 
            error: error.message 
        });
    }
};