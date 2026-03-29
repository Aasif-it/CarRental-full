import express from "express";
import { cancelUserBooking, changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import { isAdmin, protect } from "../middleware/auth.js";
import { bookingValidation } from "../middleware/validationMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar)
bookingRouter.post('/create', protect, bookingValidation, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, isAdmin, getOwnerBookings)
bookingRouter.post('/change-status', protect, isAdmin, changeBookingStatus)
bookingRouter.post('/cancel', protect, cancelUserBooking)

export default bookingRouter;