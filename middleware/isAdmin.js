import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { httpStatus } from '../utils/httpStatus.js';
import Admin from '../models/Admin.js';
dotenv.config();

const isAdmin = async (req, res, next) => {
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
    const adminID = decoded.id;
    let admin;
    try {
      admin = await Admin.findById(adminID);
      if (admin == null) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: 'UNAUTHORIZED',
        });
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }

    req.adminID = adminID;
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

export { isAdmin };
