import express from 'express';
import {
  createJourney,
  deleteJourney,
  fetchAllJourneys,
  fetchSingleJourney,
  updateJourney,
} from '../controllers/Journey.js';
import { isAuth } from '../middleware/isAuth.js';

const journeyRoutes = express.Router();

journeyRoutes.get('/', isAuth, fetchAllJourneys);
journeyRoutes.get('/:id', isAuth, fetchSingleJourney);
journeyRoutes.post('/', isAuth, createJourney);
journeyRoutes.put('/:id', isAuth, updateJourney);
journeyRoutes.delete('/:id', isAuth, deleteJourney);

export default journeyRoutes;
