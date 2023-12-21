import mongoose from 'mongoose';
import CONST from '../constraints/CONST';

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  member: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  type: {
    type: String,
    enum: [CONST.CHAT.PRIVATE, CONST.CHAT.GROUP],
    required: false,
    default: CONST.CHAT.PRIVATE_CHAT,
  },
});

chatSchema.set('timestamps', true);
export default mongoose.model('Chat', chatSchema);
