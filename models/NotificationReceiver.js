import mongoose from 'mongoose';

// Notification schema for receiving users
const notificationReceiverSchema = new mongoose.Schema({
  // foreign key linking to notification object table
  notificationObjectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NotificationObject',
  },
  // list of users receiving the notifications
  notifierIDs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  status: {
    type: String,
    require: false,
  },
});

notificationReceiverSchema.set('timestamps', true);

export default mongoose.model(
  'NotificationReceiver',
  notificationReceiverSchema,
);
