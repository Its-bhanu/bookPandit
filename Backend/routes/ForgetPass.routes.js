const express = require("express");
const router = express.Router();
const {
  forgetPasswordUser,
  verifyOtpUser,
  resetPasswordUser,
  forgetPasswordPandit,
  verifyOtpPandit,
  resetPasswordPandit,
} = require("../controllers/ForgetPass.controller");

// ----------- USER -----------
router.post("/user/forget-password", forgetPasswordUser);
router.post("/user/verify-otp", verifyOtpUser);
router.post("/user/reset-password", resetPasswordUser);

// ----------- PANDIT -----------
router.post("/pandit/forget-password", forgetPasswordPandit);
router.post("/pandit/verify-otp", verifyOtpPandit);
router.post("/pandit/reset-password", resetPasswordPandit);

module.exports = router;
