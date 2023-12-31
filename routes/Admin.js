import express from 'express';
import { login, register } from '../controllers/Admin.js';
const adminRoutes = express.Router();

adminRoutes.post('/register', register);
adminRoutes.post('/login', login);

export default adminRoutes;
