import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: false,
  },
  // images: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Document',
  //   },
  // ],
  // videos: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Document',
  //   },
  // ],
  images: [
    {
      type: String,
      required: false,
    },
  ],
  videos: [
    {
      type: String,
      required: false,
    },
  ],
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
  isLiked: {
    type: Boolean,
    required: false,
    default: false,
  },
  attractionID: {
    type: Schema.Types.ObjectId,
    ref: 'Attractions',
  },
});

postSchema.set('timestamps', true);

export default mongoose.model('Post', postSchema);
