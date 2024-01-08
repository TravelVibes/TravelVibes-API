import express from 'express';
import { login, register } from '../controllers/Admin.js';
import { getAllEvents, verifyEvent } from '../controllers/Event.js';
const adminRoutes = express.Router();

adminRoutes.post('/register', register);
adminRoutes.post('/login', login);

adminRoutes.post('/verifyEvent', verifyEvent);

adminRoutes.get('/events', getAllEvents);

export default adminRoutes;
