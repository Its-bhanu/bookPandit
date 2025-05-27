const razorpay=require('../config/razorpay.config');
const Payment=require('../models/payment.model');
const crypto=require('crypto');

module.exports.createOrder = async (req, res) => {
  try {
      const {  bookingId } = req.body;
      const amount = 21 * 100; // Amount in paise (Razorpay expects amount in paise)`;

      // Debugging logs
     
      console.log( bookingId);

      if ( !bookingId) {
          return res.status(400).json({ success: false, message: " Booking ID are required" });
      }

      const options = {
          amount:amount,
          currency: 'INR',
          receipt: `receipt_order_${bookingId}`
      };

      // console.log("Creating Razorpay order with options:", options);

      const order = await razorpay.orders.create(options);

      // console.log("Razorpay order created successfully:", order);

      const newPayment = new Payment({
          orderId: order.id,
          amount: amount/100,
          bookingId: bookingId,
          status: 'pending',
      });

      await newPayment.save();
      // console.log("Payment entry saved:", newPayment);

      res.json({ success: true, order });
  } catch (err) {
      console.error("Error creating Razorpay order:", err);
      res.status(500).json({ success: false, error: err.message });
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

    // console.log("Verifying payment for order:", razorpay_order_id);
    // console.log("Payment ID:", razorpay_payment_id);
    // console.log("Received signature:", razorpay_signature);

    // Generate expected signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

       const isSignatureValid = expectedSignature === razorpay_signature;

    console.log("Generated signature:", expectedSignature);

    // Verify signature
    // if (expectedSignature !== razorpay_signature) {
    //   console.error("Signature mismatch - possible tampering detected");
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: "Invalid payment signature" 
    //   });
    // }

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
    console.log("Payment verified and updated:", updatedPayment._id);

    // Here you would typically update your booking status as well
    // await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });

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