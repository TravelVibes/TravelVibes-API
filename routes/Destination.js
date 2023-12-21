import express from 'express';
import {
  getAllDestinations,
  searchDestinations,
} from '../controllers/Destination';

const destinationRoutes = express.Router();

destinationRoutes.get('/', getAllDestinations);
destinationRoutes.post('/search', searchDestinations);

export default destinationRoutes;
