import express from 'express';
import { adminRoute, protectedRoute } from '../middlewares/authMiddleware.js';
import BookingController from '../controllers/bookingController.js';

export const BookingRouter= express.Router()

// => Crearte an instance of BookingController
const bookingController = new BookingController()


BookingRouter.post('/send-otp',
     protectedRoute,
    (req,res,next)=> bookingController.sendBookingOTP(req,res,next)
);
BookingRouter.post('/', 
    protectedRoute, 
    (req,res,next)=> bookingController.bookEvent(req,res,next)
);
BookingRouter.put('/:id/confirm',
    protectedRoute,
    adminRoute,
    (req,res,next)=> bookingController.confirmBooking(req,res,next)
);
BookingRouter.get('/my',
    protectedRoute,
    (req,res,next)=> bookingController.getMyBookings(req,res,next)
);
BookingRouter.delete('/:id',
    protectedRoute,
    (req,res,next)=> bookingController.cancelBooking(req,res,next)
);