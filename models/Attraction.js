import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const attractionSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  coordinates: {
    type: [Number], // Array of [longitude, latitude]
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  searchText: {
    type: String,
  },
  address: {
    type: String,
  },
  rating: {
    type: Number,
  },
  noRatings: {
    type: Number,
    default: 0,
  },
});

attractionSchema.set('timestamps', true);
export default mongoose.model('Attraction', attractionSchema);
