import mongoose from 'mongoose';

const postCommentSchema = new mongoose.Schema({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: false,
  },
  commentAnswered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostComment',
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
});
postCommentSchema.set('timestamps', true);
export default mongoose.model('PostComment', postCommentSchema);
