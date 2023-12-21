import mongoose from 'mongoose';

const postLikeSchema = new mongoose.Schema({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  extraData: {
    type: JSON,
    required: false,
  },
});
postLikeSchema.set('timestamps', true);
export default mongoose.model('PostLike', postLikeSchema);
