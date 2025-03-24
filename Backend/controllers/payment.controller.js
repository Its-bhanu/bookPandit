const razorpay=require('../config/razorpay.config');
const Payment=require('../models/payment.model');
const crypto=require('crypto');
module.exports.createOrder = async (req, res) => {
  try {
      const {  bookingId } = req.body;
      const amount = 5000;

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
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

        console.log("Generated Signature:", generatedSignature);
        console.log("Received Signature:", razorpay_signature);
        console.log("payment id:",razorpay_payment_id);
  
        const isAuthentic = expectedSignature === razorpay_signature;
        if(isAuthentic){
          const payment=await Payment.findOneAndUpdate(
            { orderId: razorpay_order_id },
            { status: "paid", paymentId: razorpay_payment_id }
          );
          console.log("Payment successfully verified and updated:", payment);
          console.log("Payment verified successfully for order:", razorpay_order_id);
          res.status(200).json({ success: true, message: "Payment verified successfully" });

        }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };