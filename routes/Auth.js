import express from 'express';
import multer from 'multer';
import { login, register } from '../controllers/Auth.js';

const authRoutes = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

authRoutes.post('/register', upload.array('images'), register);
authRoutes.post('/login', login);

export default authRoutes;
