const express=require("express");
const router=express.Router();
const poojaBooksController=require("../controllers/poojaBooks.controller");

router.post('/poojaBooks',poojaBooksController.createBooking);


module.exports=router;