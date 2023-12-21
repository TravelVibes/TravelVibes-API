import mongoose from 'mongoose';

// Schema for Notification Actor
const notificationActorSchema = new mongoose.Schema({
  // foreign key linking to notification object table
  notificationObjectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NotificationObject',
  },
  actorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
  },
});

notificationActorSchema.set('timestamps', true);

export default mongoose.model('NotificationActor', notificationActorSchema);
