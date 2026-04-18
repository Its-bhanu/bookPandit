const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, message, isHtml = false) => {
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
            to,
            subject,
            [isHtml ? 'html' : 'text']: message,
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: `Email sent: ${info.response}` };
    } catch (error) {
        console.log('Email Error:', error);
        return { success: false, error: error.message };
    }
};

const sendBookingNotificationEmail = async (panditEmail, booking, acceptLink, rejectLink) => {
    try {
        const htmlContent = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">New Booking Request 🎉</h1>
                    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">A new client has requested your services!</p>
                </div>

                <!-- Content -->
                <div style="background: #f8f9fa; padding: 30px; border-bottom: 1px solid #e0e0e0;">
                    <h2 style="color: #333; margin-top: 0;">Booking Details</h2>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 12px 0; color: #666; font-weight: 600; width: 40%;">Client Name:</td>
                                <td style="padding: 12px 0; color: #333;">${booking.name}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 12px 0; color: #666; font-weight: 600;">Phone:</td>
                                <td style="padding: 12px 0; color: #333;">${booking.phoneNo}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 12px 0; color: #666; font-weight: 600;">Pooja Type:</td>
                                <td style="padding: 12px 0; color: #333;">${booking.poojaType}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 12px 0; color: #666; font-weight: 600;">Date:</td>
                                <td style="padding: 12px 0; color: #333;">${booking.date}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 12px 0; color: #666; font-weight: 600;">Time:</td>
                                <td style="padding: 12px 0; color: #333;">${booking.time}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #666; font-weight: 600;">Address:</td>
                                <td style="padding: 12px 0; color: #333;">${booking.address}</td>
                            </tr>
                        </table>
                    </div>

                    <p style="color: #666; font-size: 14px; margin: 20px 0;">Please respond to this booking request by accepting or declining. The client will be notified of your decision immediately.</p>
                </div>

                <!-- Action Buttons -->
                <div style="background: white; padding: 30px; text-align: center;">
                    <p style="color: #666; font-weight: 600; margin-bottom: 20px;">Respond to this booking:</p>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        // <a href="${acceptLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; transition: transform 0.2s; cursor: pointer;">
                        //     ✅ Accept Booking
                        // </a>
                        // <a href="${rejectLink}" style="background: #e74c3c; color: white; padding: 14px 40px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; transition: transform 0.2s; cursor: pointer;">
                        //     ❌ Decline Booking
                        // </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #e0e0e0;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                        © 2024 BookPandit. All rights reserved.<br>
                        <a href="https://book-pandit.vercel.app/" style="color: #667eea; text-decoration: none;">Visit our website</a>
                    </p>
                </div>
            </div>
        `;

        return await sendEmail(panditEmail, `New Booking Request - ${booking.poojaType}`, htmlContent, true);
    } catch (error) {
        console.log('Booking email error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail, sendBookingNotificationEmail };