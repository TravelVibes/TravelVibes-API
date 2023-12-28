import express from 'express';
import attractionRoutes from '../Attraction.js';
import authRoutes from '../Auth.js';
import reviewRoutes from '../Review.js';
import postRoutes from '../Post.js';
import userRoutes from '../User.js';

const apiRoutes = express.Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/attractions', attractionRoutes);
apiRoutes.use('/posts', postRoutes);

apiRoutes.use('/users', userRoutes);
apiRoutes.use('/reviews', reviewRoutes);

export default apiRoutes;
