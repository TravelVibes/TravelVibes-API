import dotenv from 'dotenv';
dotenv.config();

// User Model
// gender
const CONST = {
  GENDER: {
    MALE: 'male',
    FEMALE: 'female',
    SECRET: 'secret',
  },

  DOCUMENT_TYPE: {
    VIDEO: 'video',
    IMAGE: 'image',
    OTHER: 'other',
  },

  CHAT: {
    PRIVATE: 'PRIVATE_CHAT',
    GROUP: 'GROUP_CHAT',
  },

  // status for friend request
  STATUS: {
    UNKNOWN: 'UNKNOWN',
    PENDING: 'PENDING',
    ACCEPT: 'ACCEPT',
    //* sender removes request
    REMOVE: 'REMOVE',
    //* receiver decline request
    DECLINE: 'DECLINE',
  },

  EVENT_STATUS: {
    PENDING: 'PENDING',
    APPROVE: 'APPROVED',
    REJECT: 'REJECTED',
    OVERDUE: 'OVERDUE',
  },

  DEFAULT_AVATAR: 'uploads/default-avatar.webp',
  FE_URL: process.env.FE_URL,

  // image size
  avatar: 30,
};

export default CONST;
