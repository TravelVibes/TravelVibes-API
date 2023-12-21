import express from 'express';
import userRoutes from '../User';
import destinationRoutes from '../Destination';

const apiRoutes = express.Router();

apiRoutes.use('/user', userRoutes);
apiRoutes.use('/destination', destinationRoutes);

export default apiRoutes;
