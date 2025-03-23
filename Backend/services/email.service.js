const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to,subject,message) => {
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
            text: message,
            
        };

        const info = await transporter.sendMail(mailOptions);
    return { success: true, message: `Email sent: ${info.response}` };
    } catch (error) {
        console.log(error);
        return error;
    }
};
module.exports = { sendEmail };