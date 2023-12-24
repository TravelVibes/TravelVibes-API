import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  attraction: {
    type: Schema.Types.ObjectId,
    ref: 'Attraction',
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
});

reviewSchema.set('timestamps', true);
export default mongoose.model('Review', reviewSchema);
