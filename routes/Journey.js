import express from 'express';
import {
  createJourney,
  deleteJourney,
  fetchAllJourneys,
  fetchSingleJourney,
  updateJourney,
} from '../controllers/Journey';

const journeyRoutes = express.Router();

journeyRoutes.get('/', fetchAllJourneys);
journeyRoutes.get('/:id', fetchSingleJourney);
journeyRoutes.post('/', createJourney);
journeyRoutes.put('/:id', updateJourney);
journeyRoutes.delete('/:id', deleteJourney);

export default journeyRoutes;
