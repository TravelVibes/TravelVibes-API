import express from 'express';
import {
  createReview,
  deleteReview,
  editReview,
  fetchReviews,
} from '../controllers/Review';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const reviewRoutes = express.Router();

reviewRoutes.get('/:attractionID', fetchReviews);
reviewRoutes.post('/:attractionID', upload.array('images'), createReview);
reviewRoutes.put(
  '/:attractionID/:reviewID',
  upload.array('images'),
  editReview,
);
reviewRoutes.delete('/:attractionID/:reviewID', deleteReview);

export default reviewRoutes;
