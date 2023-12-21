import mongoose from 'mongoose';
// import CONST from '../constraints/CONST';

const Schema = mongoose.Schema;

const journeySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  destinations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
    },
  ],
});

journeySchema.set('timestamps', true);
export default mongoose.model('Journey', journeySchema);
