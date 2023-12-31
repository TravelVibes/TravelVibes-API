import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { httpStatus } from '../utils/httpStatus.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (!admin)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'User does not exist. ' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials. ' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    // delete admin.password;
    res.status(200).json({ token, admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    let admin = await Admin.findOne({
      email: email,
    });

    if (admin) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Email already exists',
      });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();
    delete savedAdmin.password;

    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
