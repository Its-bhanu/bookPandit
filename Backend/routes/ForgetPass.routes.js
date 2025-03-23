const express = require('express');
const router = express.Router();
const forgetPassController = require("../controllers/ForgetPass.controller");

// Route for both sending OTP & resetting password
router.post('/forget-password', forgetPassController.forgetpassword);
router.post('/reset-password', forgetPassController.verifyOTPAndResetPassword);
router.post('/pandit/forget-password', forgetPassController.forgetpasswordpandit);
router.post('/pandit/reset-password', forgetPassController.verifyOTPAndResetPasswordpandit);
module.exports = router;
