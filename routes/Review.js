import express from 'express';
import {
  createReview,
  deleteReview,
  editReview,
  fetchReviews,
} from '../controllers/Review.js';
import multer from 'multer';
import { isAuth } from '../middleware/isAuth.js';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const reviewRoutes = express.Router();

reviewRoutes.get('/:attractionID', isAuth, fetchReviews);
reviewRoutes.post(
  '/:attractionID',
  isAuth,
  upload.array('images'),
  createReview,
);
reviewRoutes.put(
  '/:attractionID/:reviewID',
  isAuth,
  upload.array('images'),
  editReview,
);
reviewRoutes.delete('/:attractionID/:reviewID', isAuth, deleteReview);

export default reviewRoutes;
