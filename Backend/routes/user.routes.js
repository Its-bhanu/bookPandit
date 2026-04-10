
const express=require('express');
const router=express.Router();
const {body}=require('express-validator');
const authMiddleware=require('../middlewares/auth.middleware')
const userController=require('../controllers/user.controller');



router.post('/register',[    
    body('username').isLength({min:3}).withMessage('Name should be atleast 3 characters long'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:5}).withMessage('Password should be atleast 6 characters long')
],userController.registerUser);
router.post("/verify-otp", userController.verifyUserOtp);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password should be atleast 6 characters long')
],userController.loginUser);


router.get('/profile',authMiddleware.authUser,userController.getUserProfile);
router.get('/logout',authMiddleware.authUser,userController.logoutUser);
module.exports=router;