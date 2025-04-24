const PoojaBook = require("../models/poojaBooks.model");
const Pandit = require("../models/pandit.model");
const User = require("../models/user.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports.createBooking = async (req, res) => {
    try {
        const { name, phoneNo, poojaType, date, time, address } = req.body.formData;
        const { panditId, userId } = req.body;

        // Validate required fields
        if (!name || !phoneNo || !poojaType || !date || !time || !address ) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Check for existing booking
        const existingBooking = await PoojaBook.findOne({ phoneNo, date }, { _id: 1 }).maxTimeMS(2000);
        if (existingBooking) {
            return res.status(400).json({ 
                success: false,
                message: "Booking with this phone number already exists for this date" 
            });
        }

        // Create new booking
        const newBooking = new PoojaBook({
            name, 
            phoneNo, 
            poojaType, 
            date, 
            time, 
            address, 
            panditId,
            userId,
           
        });

        await newBooking.save();
       
        
        

        // Update pandit and user with booking reference
        await Pandit.findByIdAndUpdate(panditId, {
            $push: { BookingId: newBooking._id }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { BookingId: newBooking._id }
        });

        const [user, pandit] = await Promise.all([
            User.findById(userId),
            Pandit.findById(panditId)
        ]);

        if (user?.email) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Pooja Booking Confirmation",
                text: `Hello ${user.username},\n\nYour booking for ${poojaType} on ${date} at ${time} has been confirmed.\n\nPandit: ${pandit.username}\nLocation: ${address}\n\nThank you for choosing PanditBook! 🙏`
            });
        }
        if (pandit?.email) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: pandit.email,
                subject: "New Booking Alert",
                text: `Hello ${pandit.username},\n\nYou have a new pooja booking for ${poojaType} on ${date} at ${time}.\n\nClient: ${user.username}\nPhone: ${phoneNo}\nLocation: ${address}\n\nPlease check your dashboard for more details.`
            });
        }
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: newBooking
        });
        
    }
    catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
}
       