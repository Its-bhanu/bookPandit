const express=require("express");
const router=express.Router();
const poojaBooksController=require("../controllers/poojaBooks.controller");
const {getPanditStats} = require('../controllers/stats.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/poojaBooks', authMiddleware.authUser, poojaBooksController.createBooking);
router.get('/pandit/requests', authMiddleware.authpandit, poojaBooksController.getPanditBookings);
router.get('/user', authMiddleware.authUser, poojaBooksController.getUserBookings);
router.put('/:id/status', authMiddleware.authpandit, poojaBooksController.updateBookingStatus);
router.post('/:bookingId/feedback', authMiddleware.authUser, poojaBooksController.submitFeedback);
router.get('/most-booked-pandits', getPanditStats);
// Email decision endpoints (no auth needed - token is in URL)
router.get('/:bookingId/decision/:decision', poojaBooksController.handleBookingDecisionFromEmail);

module.exports=router;