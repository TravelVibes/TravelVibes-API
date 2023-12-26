import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import User from '../models/User';
import { httpStatus } from '../utils/httpStatus';
dotenv.config();

const isAuth = async (req, res, next) => {
  // check if token is valid
  if (!req.get('authorization')) {
    return res.status(400).json({
      message: 'Bad Request',
    });
  }
  try {
    // attract token from request
    let decodedToken = req.get('authorization').split(' ')[1];
    let decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
    const userId = decoded.id;
    let user;
    try {
      user = await User.findById(userId);
      if (user == null) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: 'UNAUTHORIZED',
        });
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }

    req.userID = userId;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: 'Invalid token',
      });
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export { isAuth };
