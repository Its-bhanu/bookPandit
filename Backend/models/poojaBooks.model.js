const mongoose = require('mongoose');
const PanditModel = require('./pandit.model');
const userModel = require('./user.model');

const poojaBookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: false,
    },
    poojaType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    panditId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pandit',
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
<<<<<<< HEAD
        default: 'Pending',
        enum: [
            'Pending',
            'Accepted',
            'Rejected',
            'Expired',
            'pending',
            'accepted',
            'declined',
            'confirmed',
            'cancelled'
        ],
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Completed', 'Failed', 'pending', 'completed', 'failed'],
    },
}, { timestamps: true });
=======
        default: 'pending',
         enum: ['pending', 'confirmed', 'cancelled'],
    },
    paymentStatus: {
        type: String,
        default: 'pending',
         enum: ['pending', 'completed', 'failed'],
    },
});
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f

const PoojaBook = mongoose.model('PoojaBook', poojaBookSchema);

module.exports = PoojaBook;