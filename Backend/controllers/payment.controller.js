const razorpay=require('../config/razorpay.config');
const Payment=require('../models/payment.model');
const Booking = require('../models/poojaBooks.model');
const crypto=require('crypto');

module.exports.createOrder = async (req, res) => {
  try {
      const {bookingId ,amount} = req.body;
    
     if (!bookingId || !amount) {
      return res.status(400).json({ 
        error: "Booking ID and amount are required" 
      });
    }
     
      console.log( bookingId);

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
          notes:{
            bookingId: bookingId
          }
      };

      // console.log("Creating Razorpay order with options:", options);

      const order = await razorpay.orders.create(options);
       

      const newPayment = new Payment({
          orderId: order.id,
          amount: order.amount/100,
          bookingId: bookingId,
          status: 'pending',
      });

      await newPayment.save();
      // console.log("Payment entry saved:", newPayment);

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
      details: err.code === 11000 
        ? "Duplicate payment detected (database constraint)" 
        : undefined
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
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing payment verification details" 
      });
    }

   
    const expectedSignature  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

       const isSignatureValid = expectedSignature  == razorpay_signature;

    console.log("Generated signature:", expectedSignature);

    

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
      console.error("Payment record not found for order:", razorpay_order_id);
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
     if (bookingId) {
      await Booking.findByIdAndUpdate(
        bookingId, 
        { status: 'confirmed', paymentStatus: 'completed' },
        { new: true }
      );
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