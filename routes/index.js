import express from 'express';
import apiRoutes from './api';
// const path = require("path");

const mainRouter = express.Router();

mainRouter.use('/api', apiRoutes);
// mainRouter.use("/files/", express.static(path.join(__dirname, "../files")));

export default mainRouter;
