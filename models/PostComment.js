import mongoose from 'mongoose';

const postCommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: false,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
});
postCommentSchema.set('timestamps', true);
export default mongoose.model('PostComment', postCommentSchema);
