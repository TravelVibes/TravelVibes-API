import express from 'express';
import attractionRoutes from '../Attraction.js';
import authRoutes from '../Auth.js';
// import journeyRoutes from '../Journey.js';
import reviewRoutes from '../Review.js';
import postRoutes from '../Post.js';

const apiRoutes = express.Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/attractions', attractionRoutes);
apiRoutes.use('/posts', postRoutes);

// apiRoutes.use('/journeys', journeyRoutes);
apiRoutes.use('/reviews', reviewRoutes);

export default apiRoutes;
