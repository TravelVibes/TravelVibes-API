import express from 'express';
import apiRoutes from './api';
import { uploadRoutes } from '../utils/uploadFile';
// const path = require("path");

const mainRouter = express.Router();

mainRouter.use('/api', apiRoutes);
mainRouter.use('/upload', uploadRoutes);

export default mainRouter;
