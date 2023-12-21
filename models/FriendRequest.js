import mongoose from 'mongoose';
import CONST from '../constraints/CONST';

const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    required: true,
    enum: [
      CONST.STATUS.UNKNOWN,
      CONST.STATUS.PENDING,
      CONST.STATUS.REMOVE,
      CONST.STATUS.ACCEPT,
      CONST.STATUS.DECLINE,
    ],
    default: CONST.STATUS.UNKNOWN,
  },
});
friendRequestSchema.set('timestamps', true);
export default mongoose.model('FriendRequest', friendRequestSchema);
