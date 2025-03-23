const razorpay=require('../config/razorpay.config');
const Payment=require('../models/payment.model');

module.exports.createOrder = async (req, res) => {
  try {
      const { amount, bookingId } = req.body;

      // Debugging logs
      console.log( amount);
      console.log( bookingId);

      if (!amount || !bookingId) {
          return res.status(400).json({ success: false, message: "Amount and Booking ID are required" });
      }

      const options = {
          amount: amount * 100,
          currency: 'INR',
          receipt: `receipt_order_${bookingId}`
      };

      console.log("Creating Razorpay order with options:", options);

      const order = await razorpay.orders.create(options);

      console.log("Razorpay order created successfully:", order);

      const newPayment = new Payment({
          orderId: order.id,
          amount: amount,
          bookingId: bookingId,
          status: 'pending',
      });

      await newPayment.save();
      console.log("Payment entry saved:", newPayment);

      res.json({ success: true, order });
  } catch (err) {
      console.error("Error creating Razorpay order:", err);
      res.status(500).json({ success: false, error: err.message });
  }
};

module.exports.verifyPayment = async (req, res) => {
    try {
      const { orderId, paymentId} = req.body;
  
      const payment = await Payment.findOne({ orderId: orderId });
      console.log(payment, orderId);
      if (!payment) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
  
     payment.paymentId = paymentId;
      payment.status = "Paid";
      await payment.save();
  
      res.json({ success: true, message: "Payment verified successfully", payment });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };