import express from 'express';
import multer from 'multer';
import {
  getAllMyPosts,
  getAllMyReviews,
  getProfile,
  updateProfile,
} from '../controllers/User.js';
import { isAuth } from '../middleware/isAuth.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userRoutes = express.Router();

userRoutes.get('/profile/:id', isAuth, getProfile);
userRoutes.put('/profile', isAuth, upload.single('avatar'), updateProfile);

userRoutes.get('/posts', isAuth, getAllMyPosts);
userRoutes.get('/reviews', isAuth, getAllMyReviews);

export default userRoutes;
