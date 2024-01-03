import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import mainRoute from './routes/index.js';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'node:http';
import { initSocket } from './utils/socketIO.js';

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));

// set cors
app.options('*', cors());
app.use(cors());

const io = initSocket(server);

server.listen(3000, () => {
  console.log('Socket on ', 3000);
});

app.use(
  '/',
  (req, res, next) => {
    req.app.set('socket', io);
    next();
  },
  mainRoute,
);

// error handlers
// eslint-disable-next-line no-unused-vars
app.use((errors, req, res, next) => {
  let { statusCode, message } = errors;
  if (!statusCode) {
    statusCode = 500;
  }
  const data = errors.data;
  res.status(statusCode).json({ message, data });
});

// connect to DB
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('Connect to DB successfully');
  })
  .catch((errors) => {
    console.error('Fail to connect to DB ', errors);
  });

app.listen(PORT, () => {
  console.log('App running on port ', PORT);
});
