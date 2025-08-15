const express = require("express");
const { getMessages } = require("../controllers/chat.controller");

const router = express.Router();

router.get("/messages/:userId/:panditId", getMessages);

module.exports = router; 
