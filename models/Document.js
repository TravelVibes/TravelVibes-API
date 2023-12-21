import mongoose from 'mongoose';
import CONST from '../constraints/CONST';

const documentSchema = new mongoose.Schema({
  documentSrc: {
    type: String,
    require: true,
  },
  documentName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      CONST.DOCUMENT_TYPE.VIDEO,
      CONST.DOCUMENT_TYPE.IMAGE,
      CONST.DOCUMENT_TYPE.OTHER,
    ],
    required: false,
    default: CONST.DOCUMENT_TYPE.OTHER,
  },
});

documentSchema.set('timestamps', true);
export default mongoose.model('Document', documentSchema);
