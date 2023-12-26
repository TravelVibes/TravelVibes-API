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
      fileName: {
        type: String,
        required: true,
      },
    },
  ],
});

reviewSchema.set('timestamps', true);
export default mongoose.model('Review', reviewSchema);
