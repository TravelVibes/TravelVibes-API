import mongoose from 'mongoose';
import CONST from '../constraints/CONST.js';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: [
    {
      fileName: {
        type: String,
        required: true,
      },
    },
  ],
  attraction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction',
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
    enum: [
      CONST.EVENT_STATUS.PENDING,
      CONST.EVENT_STATUS.APPROVE,
      CONST.EVENT_STATUS.REJECT,
      CONST.EVENT_STATUS.OVERDUE,
    ],
    required: true,
    default: CONST.EVENT_STATUS.PENDING,
  },
});

eventSchema.set('timestamps', true);
export default mongoose.model('Event', eventSchema);
