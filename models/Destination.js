import mongoose from 'mongoose';
// import CONST from '../constraints/CONST';

const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  longitude: {
    type: String,
  },
  latitude: {
    type: String,
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
});

destinationSchema.set('timestamps', true);
export default mongoose.model('Destination', destinationSchema);
