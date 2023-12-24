import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import mainRoute from './routes';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

// set cors
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.options('*', cors());
app.use(cors());

// for test purpose only
// eslint-disable-next-line no-unused-vars
app.get('/', (req, res, next) => {
  res.json({ message: 'Welcome to server' });
});

// handle req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// connect route
app.use('/', mainRoute);

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
