import express from 'express';
import {
  createReview,
  deleteReview,
  fetchReviews,
} from '../controllers/Review';

const reviewRoutes = express.Router();

reviewRoutes.get('/:attractionID', fetchReviews);
reviewRoutes.post('/:attractionID', createReview);
reviewRoutes.put('/:attractionID/:reviewID', createReview);
reviewRoutes.put('/:attractionID/:reviewID', deleteReview);

export default reviewRoutes;
