import express from 'express';
import attractionRoutes from '../Attraction';
import authRoutes from '../Auth';
import journeyRoutes from '../Journey';

const apiRoutes = express.Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/attractions', attractionRoutes);
apiRoutes.use('/journeys', journeyRoutes);

export default apiRoutes;
