import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import mainRoute from './routes';

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

// set cors
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
