import express from 'express';
import {
  fetchSingleAttraction,
  searchAttractions,
} from '../controllers/Attraction';

const destinationRoutes = express.Router();

destinationRoutes.get('/', searchAttractions);
destinationRoutes.get('/:id', fetchSingleAttraction);

export default destinationRoutes;
