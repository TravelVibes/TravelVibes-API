import mongoose from 'mongoose';

// Schema for Notification Object
const notificationObjectSchema = new mongoose.Schema({
  // reference to and entity id: link to post_id: 123 or comment_id: 988
  entityID: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'entityType',
  },
  entityType: {
    type: String,
    required: true,
    enum: ['Post', 'PostComment', 'PostLike', 'FriendRequest'],
  },
  // Enum type for action related to an entity: ADD a new COMMENT
  entityActionID: {
    type: String,
  },
  status: {
    type: String,
  },
});

notificationObjectSchema.set('timestamps', true);

export default mongoose.model('NotificationObject', notificationObjectSchema);
