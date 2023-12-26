import express from 'express';
import {
  fetchSingleAttraction,
  searchAttractions,
} from '../controllers/Attraction.js';
import { isAuth } from '../middleware/isAuth.js';

const destinationRoutes = express.Router();

destinationRoutes.get('/', isAuth, searchAttractions);
destinationRoutes.get('/:id', isAuth, fetchSingleAttraction);

export default destinationRoutes;
