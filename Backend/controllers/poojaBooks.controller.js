const PoojaBook = require("../models/poojaBooks.model");
const Pandit = require("../models/pandit.model");
const User = require("../models/user.model");
const { sendEmail } = require('../services/email.service');

const EXPIRY_MS = 3 * 60 * 1000;

const normalizeStatus = (status) => {
    if (!status) return status;
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'Pending';
    if (lower === 'accepted') return 'Accepted';
    if (lower === 'rejected' || lower === 'declined') return 'Rejected';
    if (lower === 'expired') return 'Expired';
    if (lower === 'confirmed') return 'Accepted';
    return status;
};

const markExpiredIfNeeded = async (booking) => {
    if (!booking) return booking;
    const status = normalizeStatus(booking.status);
    if (status !== 'Pending') return booking;

    const createdAt = booking.createdAt ? new Date(booking.createdAt) : null;
    if (!createdAt) return booking;

    if (Date.now() - createdAt.getTime() > EXPIRY_MS) {
        booking.status = 'Expired';
        await booking.save();
    }

    return booking;
};

module.exports.createBooking = async (req, res) => {
    try {
        const { name, phoneNo, poojaType, date, time, address, message } = req.body.formData || {};
        const { panditId } = req.body;
        const userId = req.user?._id || req.body.userId;

        const status = "Pending";
        // Validate input
        if (!name || !phoneNo || !poojaType || !date || !time || !address || !panditId || !userId) {
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

        const pandit = await Pandit.findById(panditId);
        if (!pandit) {
            return res.status(404).json({ success: false, message: "Pandit not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Create new booking
        const newBooking = new PoojaBook({
            name,
            phoneNo,
            poojaType,
            date,
            time,
            address,
            message,
            panditId,
            userId,
            status,
            paymentStatus: 'Pending'
        });

        await newBooking.save();

        // Update references
        await Pandit.findByIdAndUpdate(panditId, {
            $push: { BookingId: newBooking._id }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { BookingId: newBooking._id }
        });

        if (pandit.email) {
            try {
                await sendEmail(
                    pandit.email,
                    'A user wants to book your pooja service. Please accept or decline.',
                    `Booking request from ${user.username || name}. Pooja: ${poojaType}. Date: ${date}. Time: ${time}.`
                );
            } catch (mailError) {
                console.error('Failed to send booking request email to pandit:', mailError);
            }
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

module.exports.getPanditBookings = async (req, res) => {
    try {
        const panditId = req.pandit?._id;
        if (!panditId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const bookings = await PoojaBook.find({ panditId }).sort({ createdAt: -1 });
        const updated = [];
        for (const booking of bookings) {
            updated.push(await markExpiredIfNeeded(booking));
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Error fetching pandit bookings:", error);
        res.status(500).json({ success: false, message: "Error fetching pandit bookings" });
    }
};

module.exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const bookings = await PoojaBook.find({ userId }).sort({ createdAt: -1 });
        const updated = [];
        for (const booking of bookings) {
            updated.push(await markExpiredIfNeeded(booking));
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ success: false, message: "Error fetching user bookings" });
    }
};

module.exports.updateBookingStatus = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { status } = req.body;
        const normalized = normalizeStatus(status);

        if (!['Accepted', 'Rejected'].includes(normalized)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const booking = await PoojaBook.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (String(booking.panditId) !== String(req.pandit?._id)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await markExpiredIfNeeded(booking);
        if (booking.status === 'Expired' || booking.status === 'Rejected') {
            return res.status(400).json({ message: "Booking can no longer be updated" });
        }

        booking.status = normalized;
        await booking.save();

        res.status(200).json({ success: true, booking });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ success: false, message: "Error updating booking status" });
    }
};
