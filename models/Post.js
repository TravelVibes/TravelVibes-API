import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  caption: {
    type: String,
    required: false,
  },
  upvote: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  countComments: {
    type: Number,
    required: false,
    default: 0,
  },
  isUpvote: {
    type: Boolean,
    required: false,
    default: false,
  },
  attractions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Attraction',
    },
  ],
});

postSchema.set('timestamps', true);

export default mongoose.model('Post', postSchema);
