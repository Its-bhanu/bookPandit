const PoojaBook = require("../models/poojaBooks.model");
const Pandit = require("../models/pandit.model");
const User = require("../models/user.model");




module.exports.createBooking = async (req, res) => {
    try {
        const { name, phoneNo, poojaType, date, time, address } = req.body.formData;
        const { panditId, userId } = req.body;

        const status = "pending";
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
             status, 
        });

        await newBooking.save();

        // Update references
        await Pandit.findByIdAndUpdate(panditId, {
            $push: { BookingId: newBooking._id }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { BookingId: newBooking._id }
        });

       

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
