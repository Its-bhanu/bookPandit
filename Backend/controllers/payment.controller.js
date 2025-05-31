const razorpay = require('../config/razorpay.config');
const Payment = require('../models/payment.model');
const crypto = require('crypto');

module.exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const amount = 2100 * 100; // Convert to paise
    
    if (!bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: "Booking ID is required" 
      });
    }

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_order_${bookingId}`,
      payment_capture: 1 // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);

    const newPayment = new Payment({
      orderId: order.id,
      amount: amount / 100,
      bookingId: bookingId,
      status: 'pending',
    });

    await newPayment.save();

    res.json({ 
      success: true, 
      order,
      payment: newPayment
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message || "Failed to create order" 
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

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
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

    // Update payment status
    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        verifiedAt: new Date(),
        status: isSignatureValid ? 'completed' : 'failed'
      },
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

    res.json({ 
      success: true, 
      message: "Payment verified successfully",
      payment: updatedPayment
    });

  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Payment verification failed" 
    });
  }
};