import mongoose from 'mongoose';

const postVoteSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  extraData: {
    type: JSON,
    required: false,
  },
});
postVoteSchema.set('timestamps', true);
export default mongoose.model('PostUpvote', postVoteSchema);
