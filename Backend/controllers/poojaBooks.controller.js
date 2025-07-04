const PoojaBook = require("../models/poojaBooks.model");
const Pandit = require("../models/pandit.model");
const User = require("../models/user.model");
const nodemailer = require("nodemailer");

 const logoUrl="https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png";
const sendPanditEmail = async (panditEmail, 
fullname, userName, poojaType, date, time, address) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: panditEmail,
            subject: 'New Pooja Booking Assigned',
            html: ` <html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        padding: 20px;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        padding: 30px;
      }
      .header {
        text-align: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 20px;
      }
      .logo {
        max-width: 120px;
        margin-bottom: 10px;
      }
      .content {
        padding: 20px 0;
      }
      .detail {
        margin-bottom: 10px;
        font-size: 16px;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #888;
        margin-top: 30px;
        border-top: 1px solid #eee;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${logoUrl}" alt="Panditbook Logo" class="logo" />
        <h2>Pooja Booking Confirmation</h2>
      </div>

      <div class="content">
        <p>Dear <strong>${fullname}</strong>,</p>
        <p>You have a new pooja booking. Please find the details below:</p>

        <div class="detail"><strong>Booked By:</strong> ${userName}</div>
        <div class="detail"><strong>Pooja Type:</strong> ${poojaType}</div>
        <div class="detail"><strong>Date:</strong> ${date}</div>
        <div class="detail"><strong>Time:</strong> ${time}</div>
        <div class="detail"><strong>Address:</strong> ${address}</div>

        <p style="margin-top: 20px;">Please be prepared and reach the venue on time.</p>
        <p>Thank you 🙏</p>
      </div></div>
  </body>
  </html>`
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent to pandit:", panditEmail);
    } catch (error) {
        console.error("❌ Error sending email to pandit:", error);
    }
};

module.exports.createBooking = async (req, res) => {
    try {
        const { name, phoneNo, poojaType, date, time, address } = req.body.formData;
        const { panditId, userId } = req.body;

        // Validate input
        if (!name || !phoneNo || !poojaType || !date || !time || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if already booked
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
            status: "confirmed" // Assuming confirmed status on creation
        });

        await newBooking.save();

        // Update references
        await Pandit.findByIdAndUpdate(panditId, {
            $push: { BookingId: newBooking._id }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { BookingId: newBooking._id }
        });

        // Fetch Pandit Email
        const pandit = await Pandit.findById(panditId);
        if (pandit && pandit.email) {
            await sendPanditEmail(pandit.email, pandit.name, name, poojaType, date, time, address);
        }

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: newBooking
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};
