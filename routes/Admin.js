import express from 'express';
import { login, register } from '../controllers/Admin.js';
import {
  getAllEvents,
  manageEventApproval,
  getEventDetailAdmin,
} from '../controllers/Event.js';
import { isAdmin } from '../middleware/isAdmin.js';
const adminRoutes = express.Router();

adminRoutes.post('/register', register);
adminRoutes.post('/login', login);

adminRoutes.get('/events', isAdmin, getAllEvents);
adminRoutes.get('/events/:id', isAdmin, getEventDetailAdmin);
adminRoutes.put('/events/:id/verify', isAdmin, manageEventApproval);

export default adminRoutes;
