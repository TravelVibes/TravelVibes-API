import mongoose from 'mongoose';
import CONST from '../constraints/CONST.js';

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, max: 255, min: 1 },
  phoneNumber: {
    type: String,
  },
  gender: {
    type: String,
    enum: [CONST.GENDER.MALE, CONST.GENDER.FEMALE, CONST.GENDER.SECRET],
    required: false,
    default: CONST.GENDER.SECRET,
  },
  birthday: {
    type: Date,
    required: false,
  },
  description: {
    // like a bio
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    default: CONST.DEFAULT_AVATAR,
  },
});

adminSchema.set('timestamps', true);
export default mongoose.model('Admin', adminSchema);
