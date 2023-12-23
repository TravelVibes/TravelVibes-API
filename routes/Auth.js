import express from 'express';
import { login, register } from '../controllers/Auth';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);

export default authRoutes;
