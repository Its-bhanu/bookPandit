const PoojaBook = require("../models/poojaBooks.model");
const Pandit = require("../models/pandit.model");
const User = require("../models/user.model");
const { sendEmail, sendBookingNotificationEmail } = require('../services/email.service');
const crypto = require('crypto');

const EXPIRY_MS = 3 * 60 * 1000;

const generateDecisionToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

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
        const io = req.app.get('io');

        const status = "Pending";
        // Validate input
        if (!name || !phoneNo || !poojaType || !date || !time || !address || !panditId || !userId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate phone number format
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneNo.toString())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit phone number"
            });
        }

        // Check if user already has a pending/accepted booking for the same date and pandit
        const bookingDate = new Date(date);
        const startOfDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
        const endOfDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate() + 1);

        const existingBooking = await PoojaBook.findOne({
            userId: userId,
            panditId: panditId,
            date: { $gte: startOfDay, $lt: endOfDay },
            status: { $in: ['Pending', 'Accepted', 'pending', 'accepted'] }
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending or accepted booking with this pandit for this date. Please wait for the response or contact support."
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

        // Generate decision token for email links (valid for 24 hours)
        const decisionToken = generateDecisionToken();
        const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        newBooking.decisionToken = decisionToken;
        newBooking.tokenExpiresAt = tokenExpiresAt;

        await newBooking.save();

        // Update references
        await Pandit.findByIdAndUpdate(panditId, {
            $push: { BookingId: newBooking._id }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { BookingId: newBooking._id }
        });

        // 🔔 Emit real-time notification to pandit
        if (io) {
            io.to(`pandit_${panditId}`).emit("new_booking_notification", {
                _id: newBooking._id,
                name: newBooking.name,
                phoneNo: newBooking.phoneNo,
                poojaType: newBooking.poojaType,
                date: newBooking.date,
                time: newBooking.time,
                address: newBooking.address,
                message: newBooking.message,
                userId: newBooking.userId,
                panditId: newBooking.panditId,
                status: newBooking.status,
                createdAt: newBooking.createdAt
            });
            console.log(`📢 Booking notification sent to pandit: ${panditId}`);
        }

        if (pandit.email) {
            try {
                const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                const acceptLink = `${baseUrl}/api/bookings/${newBooking._id}/decision/accept?token=${decisionToken}`;
                const rejectLink = `${baseUrl}/api/bookings/${newBooking._id}/decision/reject?token=${decisionToken}`;
                
                await sendBookingNotificationEmail(
                    pandit.email,
                    {
                        name: newBooking.name,
                        phoneNo: newBooking.phoneNo,
                        poojaType: newBooking.poojaType,
                        date: newBooking.date,
                        time: newBooking.time,
                        address: newBooking.address
                    },
                    acceptLink,
                    rejectLink
                );
                console.log(`📧 Booking notification email sent to pandit: ${pandit.email}`);
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
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `A booking with this ${field} already exists. Please use a different ${field} or contact support.`
            });
        }

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
        const io = req.app.get('io');

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

        // 🔔 Emit real-time notification to user
        if (io) {
            if (normalized === 'Accepted') {
                io.to(`user_${booking.userId}`).emit("booking_accepted_notification", {
                    bookingId: booking._id,
                    panditId: booking.panditId,
                    message: "Your booking has been accepted! Proceed to payment."
                });
                console.log(`✅ Booking accepted notification sent to user: ${booking.userId}`);
            } else if (normalized === 'Rejected') {
                io.to(`user_${booking.userId}`).emit("booking_rejected_notification", {
                    bookingId: booking._id,
                    panditId: booking.panditId,
                    message: "Your booking has been declined."
                });
                console.log(`❌ Booking rejected notification sent to user: ${booking.userId}`);
            }
        }

        res.status(200).json({ success: true, booking });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ success: false, message: "Error updating booking status" });
    }
};

module.exports.submitFeedback = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { rating, feedback } = req.body;
        const userId = req.user?._id;

        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        // Find booking
        const booking = await PoojaBook.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Verify user owns this booking
        if (String(booking.userId) !== String(userId)) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // Verify payment is completed
        if (booking.paymentStatus.toLowerCase() !== 'completed') {
            return res.status(400).json({ success: false, message: "Can only rate completed bookings with payment" });
        }

        // Update booking with feedback
        booking.rating = rating;
        booking.feedback = feedback || null;
        booking.reviewSubmittedAt = new Date();
        await booking.save();

        console.log(`⭐ Feedback submitted for booking ${bookingId}: Rating ${rating}, User: ${userId}`);

        res.status(200).json({
            success: true,
            message: "Thank you for your feedback!",
            booking
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ success: false, message: "Error submitting feedback" });
    }
};

module.exports.handleBookingDecisionFromEmail = async (req, res) => {
    try {
        const { bookingId, decision } = req.params;
        const { token } = req.query;
        const io = req.app.get('io');

        if (!['accept', 'reject'].includes(decision)) {
            return res.status(400).json({ success: false, message: "Invalid decision" });
        }

        // Find booking
        const booking = await PoojaBook.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Verify token
        if (!booking.decisionToken || booking.decisionToken !== token) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }

        // Check token expiration
        if (booking.tokenExpiresAt && new Date() > booking.tokenExpiresAt) {
            return res.status(401).json({ success: false, message: "Token has expired" });
        }

        // Check booking status (must be pending)
        const currentStatus = normalizeStatus(booking.status);
        if (currentStatus !== 'Pending') {
            return res.status(400).json({ 
                success: false, 
                message: `Booking is already ${currentStatus}. Cannot change status.` 
            });
        }

        // Update booking status
        const newStatus = decision === 'accept' ? 'Accepted' : 'Rejected';
        booking.status = newStatus;
        booking.decisionToken = null; // Invalidate token after use
        booking.tokenExpiresAt = null;
        await booking.save();

        // 🔔 Emit real-time notification to user
        if (io) {
            if (newStatus === 'Accepted') {
                io.to(`user_${booking.userId}`).emit("booking_accepted_notification", {
                    bookingId: booking._id,
                    panditId: booking.panditId,
                    message: "Your booking has been accepted! Proceed to payment."
                });
                console.log(`✅ Booking accepted notification sent to user: ${booking.userId}`);
            } else if (newStatus === 'Rejected') {
                io.to(`user_${booking.userId}`).emit("booking_rejected_notification", {
                    bookingId: booking._id,
                    panditId: booking.panditId,
                    message: "Your booking has been declined."
                });
                console.log(`❌ Booking rejected notification sent to user: ${booking.userId}`);
            }
        }

        // Return an HTML response for email click
        const htmlResponse = `
            <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
                        .container { background: white; border-radius: 10px; padding: 40px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; }
                        .success { color: #27ae60; }
                        .error { color: #e74c3c; }
                        h1 { margin: 0 0 20px 0; font-size: 32px; }
                        p { color: #666; margin: 10px 0; font-size: 16px; }
                        .emoji { font-size: 48px; margin: 20px 0; }
                        a { display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        ${newStatus === 'Accepted' ? `
                            <div class="emoji">✅</div>
                            <h1 class="success">Booking Accepted!</h1>
                            <p>You have successfully accepted the booking request.</p>
                            <p><strong>Client:</strong> ${booking.name}</p>
                            <p><strong>Pooja:</strong> ${booking.poojaType}</p>
                            <p><strong>Date:</strong> ${booking.date}</p>
                            <p style="color: #27ae60; margin-top: 30px; font-weight: bold;">The client will receive a notification and can proceed with payment.</p>
                        ` : `
                            <div class="emoji">❌</div>
                            <h1 class="error">Booking Declined</h1>
                            <p>You have successfully declined the booking request.</p>
                            <p><strong>Client:</strong> ${booking.name}</p>
                            <p><strong>Pooja:</strong> ${booking.poojaType}</p>
                            <p style="color: #e74c3c; margin-top: 30px; font-weight: bold;">The client will be notified about your decision.</p>
                        `}
                        <a href="https://bookpandit.com">Back to BookPandit</a>
                    </div>
                </body>
            </html>
        `;

        res.status(200).send(htmlResponse);

    } catch (error) {
        console.error("Error handling booking decision from email:", error);
        res.status(500).send(`
            <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
                        .container { background: white; border-radius: 10px; padding: 40px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; }
                        h1 { margin: 0 0 20px 0; font-size: 32px; color: #e74c3c; }
                        p { color: #666; margin: 10px 0; font-size: 16px; }
                        .emoji { font-size: 48px; margin: 20px 0; }
                        a { display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="emoji">⚠️</div>
                        <h1>Error Processing Request</h1>
                        <p>There was an error processing your decision. The link may have expired.</p>
                        <p style="color: #e74c3c; font-weight: bold;">Please try again or contact support.</p>
                        <a href="https://bookpandit.com">Back to BookPandit</a>
                    </div>
                </body>
            </html>
        `);
    }
};
