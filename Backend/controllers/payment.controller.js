const razorpay = require('../config/razorpay.config');
const Payment = require('../models/payment.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Booking = require('../models/poojaBooks.model');
const User = require('../models/user.model');
const Pandit = require('../models/pandit.model');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

module.exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const amount = 2100 * 100; // Amount in paise (Razorpay expects amount in paise)

    if (!bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: "Booking ID is required" 
      });
    }

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_order_${bookingId}`
    };

    const order = await razorpay.orders.create(options);

    const newPayment = new Payment({
      orderId: order.id,
      amount: amount / 100,
      bookingId: bookingId,
      status: 'pending',
    });

    await newPayment.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing payment verification details" 
      });
    }

    // Generate expected signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    const updateData = {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      verifiedAt: new Date(),
      status: isSignatureValid ? 'completed' : 'failed'
    };

    // Update payment status
    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      updateData,
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ 
        success: false, 
        message: "Payment record not found" 
      });
    }

    if (!isSignatureValid) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature",
        payment: updatedPayment
      });
    }

    // Update booking status to confirmed
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed', paymentStatus: 'paid' },
      { new: true }
    ).populate('userId panditId');

    if (!updatedBooking) {
      console.error("Booking not found:", bookingId);
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    // Send email notifications
    await sendPaymentConfirmationEmails(updatedBooking, updatedPayment);

    res.json({ 
      success: true, 
      message: "Payment verified successfully",
      payment: updatedPayment,
      booking: updatedBooking
    });

  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Payment verification failed" 
    });
  }
};

// Helper function to send confirmation emails
async function sendPaymentConfirmationEmails(booking, payment) {
  try {
    // Get user and pandit details
    const user = await User.findById(booking.userId);
    const pandit = await Pandit.findById(booking.panditId);

    if (!user || !pandit) {
      throw new Error('User or Pandit not found');
    }

    // Email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Pooja Booking Payment Confirmation',
      html: `
        <h2>Payment Successful!</h2>
        <p>Dear ${user.username},</p>
        <p>Your payment of ₹${payment.amount} for booking Pandit ${pandit.fullname} has been successfully processed.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Pandit: ${pandit.fullname}</li>
          <li>Booking Date: ${booking.date}</li>
          <li>Pooja Type: ${booking.poojaType}</li>
          <li>Transaction ID: ${payment.paymentId}</li>
        </ul>
        <p>Pandit ${pandit.fullname} will contact you shortly to confirm the details.</p>
        <p>Thank you for using our service!</p>
      `
    };

    // Email to pandit
    const panditMailOptions = {
      from: process.env.EMAIL_USER,
      to: pandit.email,
      subject: 'New Booking Confirmation',
      html: `
        <h2>New Booking Received!</h2>
        <p>Dear ${pandit.fullname},</p>
        <p>You have received a new booking from ${user.username}.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>User: ${user.username}</li>
          <li>Booking Date: ${booking.date}</li>
          <li>Pooja Type: ${booking.poojaType}</li>
          <li>User Contact: ${user.mobile || 'Not provided'}</li>
          <li>User Address: ${booking.address}</li>
        </ul>
        <p>Please contact the user to confirm the booking details.</p>
        <p>Thank you for being part of our platform!</p>
      `
    };

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(panditMailOptions)
    ]);

    console.log('Confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending confirmation emails:', error);
    // Don't throw error as we don't want to fail the payment verification
  }
}