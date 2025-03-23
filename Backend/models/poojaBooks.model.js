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
        unique: true
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
        default: 'pending'
    },
});

const PoojaBook = mongoose.model('PoojaBook', poojaBookSchema);

module.exports = PoojaBook;