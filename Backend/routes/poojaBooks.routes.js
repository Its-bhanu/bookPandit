const express=require("express");
const router=express.Router();
const poojaBooksController=require("../controllers/poojaBooks.controller");
const {getPanditStats} = require('../controllers/stats.controller');

router.post('/poojaBooks',poojaBooksController.createBooking);
router.get('/most-booked-pandits', getPanditStats);

module.exports=router;