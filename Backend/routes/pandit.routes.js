const express = require('express');
const router = express.Router();
const panditController = require('../controllers/pandit.controller');
const {body} = require('express-validator');

const authMiddleware = require('../middlewares/auth.middleware');
router.post('/register',[
    body('fullname').isLength({min:3}).withMessage('fullname must be atleast 3 charectors long'),
    body('email').isEmail().withMessage('email is not valid'),
    body('experience').isNumeric().withMessage('experience must be a number'),
    body('age').isNumeric().withMessage('age must be a number'),
    body('password').isLength({min:6}).withMessage('password must be atleast 6 charectors long'),
    body('mobile').isNumeric().withMessage('mobile must be a number'),
    body('address').isLength({min:3}).withMessage('address must be atleast 3 charectors long'),
    
    //  body('imageUrl').isURL().withMessage('Invalid URL')
],panditController.registerPandit);
router.post("/verify-otp",panditController.verifyPanditOtp);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password should be atleast 6 characters long')
],panditController.loginPandit);

router.get('/profile',
    [
        body('token').not().isEmpty().withMessage('Token is required')
    ]
    ,
    panditController.getPanditProfile,authMiddleware.authpandit);
router.get('/logout',panditController.logoutPandit,authMiddleware.authpandit);
router.get('/AllProfiles',panditController.getAllPandits);
router.get("/user/token",panditController.getBookingByUser)
router.delete('/poojaBooks/:id',panditController.deleteBooking);
// router.post('/poojaBooks/accept/:bookingid',panditController.acceptBooking,authMiddleware.authpandit);
// router.put('/decline/:id',panditController.declineBooking);
module.exports = router;