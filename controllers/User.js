import bcrypt from 'bcrypt';
import { httpStatus } from '../utils/httpStatus.js';
import { s3Upload } from '../utils/uploadFile.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Review from '../models/Review.js';

export const getProfile = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const user = await User.findById(userID);
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userID = req.userID;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    }
    const updatedData = {};
    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'gender',
      'description',
      'address',
      'city',
      'country',
    ]; // Update if new fields added

    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        // Check if the field is allowed
        updatedData[field] = req.body[field];
      }
    });

    // update avatar
    let s3FileSaved = [];
    if (req.file) {
      s3FileSaved = await s3Upload([req.file]);
      updatedData.avatar = s3FileSaved[0].fileName;
    }

    // update password
    const { password } = req.body;
    if (password) {
      //Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData['password'] = hashedPassword;
    }

    const updatedProfile = await User.findByIdAndUpdate(
      userID,
      {
        $set: updatedData,
      },
      {
        new: true,
      },
    ).select('-password');

    res.status(httpStatus.OK).json(updatedProfile);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getAllMyPosts = async (req, res) => {
  try {
    const userID = req.userID;
    const allMyPosts = await Post.find({ author: userID }).populate([
      {
        path: 'author',
        select: 'firstName lastName avatar',
      },
      { path: 'attractions', select: 'name coordinates address' },
    ]);

    res.status(httpStatus.OK).json(allMyPosts);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getAllMyReviews = async (req, res) => {
  try {
    const userID = req.userID;
    const allMyReviews = await Review.find({ user: userID }).populate([
      {
        path: 'user',
        select: 'firstName lastName avatar',
      },
      { path: 'attraction', select: 'name coordinates address' },
    ]);

    res.status(httpStatus.OK).json(allMyReviews);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
