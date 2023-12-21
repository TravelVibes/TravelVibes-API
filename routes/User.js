import express from 'express';
import { testUser } from '../controllers/User';

const userRoutes = express.Router();

userRoutes.get('/test-user', testUser);

export default userRoutes;
