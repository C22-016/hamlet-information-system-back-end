import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/Events.js';
import { verifyUser, adminAndStafOnly } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/events', getEvents);
router.get('/events/:id', verifyUser, getEventById);
router.post('/events', verifyUser, adminAndStafOnly, createEvent);
router.patch('/events/:id', verifyUser, adminAndStafOnly, updateEvent);
router.delete('/events/:id', verifyUser, adminAndStafOnly, deleteEvent);

export default router;
