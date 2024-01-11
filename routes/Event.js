import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import {
  createEvent,
  deleteEvent,
  getAllApprovedEvents,
  getEventDetail,
  getMyEvents,
  updateEvent,
} from '../controllers/Event.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const eventRoutes = express.Router();

eventRoutes.get('/me', isAuth, getMyEvents);
eventRoutes.get('/:id', isAuth, getEventDetail);
eventRoutes.get('/', isAuth, getAllApprovedEvents);

eventRoutes.post('/', isAuth, upload.array('images'), createEvent);
eventRoutes.put('/:id', isAuth, upload.array('images'), updateEvent);
eventRoutes.delete('/:id', isAuth, deleteEvent);

export default eventRoutes;
