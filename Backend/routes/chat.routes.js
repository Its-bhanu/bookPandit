const express = require("express");
const { getMessages } = require("../controllers/chat.controller");
<<<<<<< HEAD
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get("/messages/:userId/:panditId", authMiddleware.authUser, getMessages);
router.get("/pandit/messages/:userId/:panditId", authMiddleware.authpandit, getMessages);
=======

const router = express.Router();

router.get("/messages/:userId/:panditId", getMessages);
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f

module.exports = router; 
