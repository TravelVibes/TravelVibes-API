import express from 'express';
import { login, register } from '../controllers/Admin.js';
import { getAllEvents, manageEventApproval } from '../controllers/Event.js';
const adminRoutes = express.Router();

adminRoutes.post('/register', register);
adminRoutes.post('/login', login);

adminRoutes.post('/verifyEvent', manageEventApproval);

adminRoutes.get('/events', getAllEvents);

export default adminRoutes;
