const express=require('express');
const router=express.Router();
const {createOrder,verifyPayment}=require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/createOrder', authMiddleware.authUser, createOrder);
router.post('/verifyPayment', authMiddleware.authUser, verifyPayment);

module.exports=router;

