import express from 'express';
import { adminRoute, protectedRoute } from '../middlewares/authMiddleware.js';
import EventController from '../controllers/eventController.js';

export const EventRouter = express.Router();
const eventController = new EventController();

// get all events
EventRouter.get('/', eventController.getEvents);
// get event by id
EventRouter.get('/:id', eventController.getEventById);

// create event (Admin only)
EventRouter.post('/', protectedRoute, adminRoute, eventController.createEvent);
// update event (Admin only)
EventRouter.put('/:id', protectedRoute, adminRoute, eventController.updateEvent);
// delete event (Admin only)
EventRouter.delete('/:id', protectedRoute, adminRoute, eventController.deleteEvent); 