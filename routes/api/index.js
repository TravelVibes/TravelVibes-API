import express from 'express';
import attractionRoutes from '../Attraction.js';
import authRoutes from '../Auth.js';
import journeyRoutes from '../Journey.js';
import reviewRoutes from '../Review.js';

const apiRoutes = express.Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/attractions', attractionRoutes);
apiRoutes.use('/journeys', journeyRoutes);
apiRoutes.use('/reviews', reviewRoutes);

export default apiRoutes;
