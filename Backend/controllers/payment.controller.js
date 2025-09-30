const razorpay = require('../config/razorpay.config');
const Payment = require('../models/payment.model');
const Booking = require('../models/poojaBooks.model');
const crypto = require('crypto');
const pandit = require('../models/pandit.model');
const nodemailer = require("nodemailer");

const logoUrl = "https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png";

// ✅ Function to send confirmation email to Pandit
const sendPanditEmail = async (panditEmail, fullname, userName, poojaType, date, time, address, phoneNo, status) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,   // your Gmail
        pass: process.env.EMAIL_PASS    // App Password, NOT Gmail password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: panditEmail,
      subject: 'Pooja Booking Payment Verified ✅',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
            <div style="max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:8px;">
              <div style="text-align:center; border-bottom:1px solid #eee; padding-bottom:15px;">
                <img src="${logoUrl}" alt="Panditbook Logo" width="120"/>
                <h2>Pooja Booking Confirmation</h2>
              </div>
              <p>Dear <strong>${fullname}</strong>,</p>
              <p>The payment for a pooja booking has been verified. Here are the details:</p>
              <p><b>Booked By:</b> ${userName}</p>
              <p><b>Pooja Type:</b> ${poojaType}</p>
              <p><b>Date:</b> ${date}</p>
              <p><b>Time:</b> ${time}</p>
              <p><b>Address:</b> ${address}</p>
              <p><b>Phone:</b> ${phoneNo}</p>
              <p><b>Status:</b> ${status}</p>
              <p style="margin-top:20px;">Please be prepared and reach the venue on time 🙏</p>
               <p>This is an auto-generated email; please do not reply or attempt to modify the booking via this message.</p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Thank you 🙏</p>
            </div>
          </body>
        </html>`
    };

    await transporter.sendMail(mailOptions);
   
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// ==================== CREATE RAZORPAY ORDER ====================
module.exports.createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: "Booking ID and amount are required" });
    }

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_order_${bookingId}`,
      notes: { bookingId }
    };

    const order = await razorpay.orders.create(options);

    const newPayment = new Payment({
      orderId: order.id,
      amount: order.amount / 100,
      bookingId,
      status: 'pending',
    });

    await newPayment.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("Error creating order:", {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create order",
      details: err.code === 11000 ? "Duplicate payment detected" : undefined
    });
  }
};

// ==================== VERIFY PAYMENT ====================
module.exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ success: false, message: "Missing payment verification details" });
    }

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    const updateData = {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      verifiedAt: new Date(),
      status: isSignatureValid ? 'completed' : 'failed'
    };

    // Update payment
    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      updateData,
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    if (!isSignatureValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature", payment: updatedPayment });
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed', paymentStatus: 'completed' },
      { new: true }
    )
     
    

    // ✅ Send email to Pandit
    const panditDetails = await pandit.findById(updatedBooking.panditId);

    if (panditDetails && panditDetails.email && updatedBooking) {
     
      await sendPanditEmail(
        panditDetails.email,
        panditDetails.fullname,
        updatedBooking.name,
        updatedBooking.poojaType,
        updatedBooking.date,
        updatedBooking.time,
        updatedBooking.address,
        updatedBooking.phoneNo,
        'confirmed'
      );
      console.log("✅ Pandit email sent successfully.");
    } 
    else {
      console.error("❌ Pandit email or user details missing. Cannot send email.");
    }

    res.json({ success: true, message: "Payment verified & email sent", payment: updatedPayment });

  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ success: false, error: error.message || "Payment verification failed" });
  }
};
