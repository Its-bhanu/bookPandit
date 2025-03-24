const PoojaBook=require("../models/poojaBooks.model");
const Pandit = require("../models/pandit.model")
const User = require("../models/user.model")
module.exports.createBooking = async (req, res) => {
    try {
        console.log("AHDF", req.body)
        let {name, phoneNo, poojaType, date, time, address} = req.body.formData;
        const {panditId} = req.body;
        const {userId} = req.body; 
        const existingBooking = await PoojaBook.findOne({ phoneNo, date });
        if (existingBooking) {
            return res.status(400).json({ message: "Booking with this phone number already exists for this date" });
        }
        const newBooking = new PoojaBook({name, phoneNo, poojaType, date, time, address, panditId,userId}); 

        await newBooking.save();
        console.log("newBooking", newBooking);
        await Pandit.findByIdAndUpdate(panditId, {
            $push : {BookingId: newBooking._id}
        });
        await User.findByIdAndUpdate(userId, {
            $push : {BookingId: newBooking._id}
        });
        console.log(newBooking);
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

