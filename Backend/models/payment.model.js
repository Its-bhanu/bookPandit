const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        
    },
    orderId: {
        type: String,
        required: true
    },
   
    status: {
        type: String,
        required: true,
        enum: ["pending", "paid", "failed"],
        default: 'pending',
    },
    currency: {
        type: String,
        required: true,
        default: 'INR'
    },
    amount: {
        type: Number,
        required: true
    },
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    signature: {
        type: String
      },
      method: {
        type: String,
        enum: ['card', 'netbanking', 'wallet', 'upi', 'emi', null]
      },
       verifiedAt: { type: Date },

}, { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;