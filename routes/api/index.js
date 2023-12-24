import express from 'express';
import attractionRoutes from '../Attraction';
import authRoutes from '../Auth';
import journeyRoutes from '../Journey';
import reviewRoutes from '../Review';

const apiRoutes = express.Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/attractions', attractionRoutes);
apiRoutes.use('/journeys', journeyRoutes);
apiRoutes.use('/reviews', reviewRoutes);

export default apiRoutes;
