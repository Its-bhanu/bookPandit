const express=require('express');
const router=express.Router();
const {createOrder,verifyPayment}=require('../controllers/payment.controller');
<<<<<<< HEAD
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/createOrder', authMiddleware.authUser, createOrder);
router.post('/verifyPayment', authMiddleware.authUser, verifyPayment);
=======

router.post('/createOrder',createOrder);
router.post('/verifyPayment',verifyPayment);
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f

module.exports=router;

