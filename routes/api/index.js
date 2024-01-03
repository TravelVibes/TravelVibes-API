import express from 'express';
import attractionRoutes from '../Attraction.js';
import authRoutes from '../Auth.js';
import reviewRoutes from '../Review.js';
import postRoutes from '../Post.js';
import userRoutes from '../User.js';
import adminRoutes from '../Admin.js';
import chatRoutes from '../Chat.js';

const apiRoutes = express.Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/attractions', attractionRoutes);
apiRoutes.use('/posts', postRoutes);

apiRoutes.use('/users', userRoutes);
apiRoutes.use('/reviews', reviewRoutes);
apiRoutes.use('/chats', chatRoutes);
apiRoutes.use('/admin', adminRoutes);

export default apiRoutes;
