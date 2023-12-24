import mongoose from 'mongoose';
import CONST from '../constraints/CONST';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, max: 255, min: 6 },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
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
    // should have a default avatar
  },
  cover_image: {
    type: String,
    // should have a default cover image
  },
  // avatar: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Document',
  // },
  // cover_image: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Document',
  // },
  blocked_diary: {
    type: Array,
    required: false,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  fans: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

userSchema.set('timestamps', true);
export default mongoose.model('User', userSchema);
