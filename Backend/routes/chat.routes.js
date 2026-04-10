const express = require("express");
const { getMessages } = require("../controllers/chat.controller");
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get("/messages/:userId/:panditId", authMiddleware.authUser, getMessages);
router.get("/pandit/messages/:userId/:panditId", authMiddleware.authpandit, getMessages);

module.exports = router; 
