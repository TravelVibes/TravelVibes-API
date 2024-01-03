import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import {
  createChat,
  createMessage,
  deleteMessage,
  getAllChats,
  getAllMessageFromChat,
  getChatDetail,
} from '../controllers/Chat.js';
const chatRoutes = express.Router();

chatRoutes.get('/', isAuth, getAllChats);
chatRoutes.get('/:chatID', isAuth, getChatDetail);
chatRoutes.post('/', isAuth, createChat);
chatRoutes.get('/messages/:chatID', isAuth, getAllMessageFromChat);
chatRoutes.post('/messages/:chatID', isAuth, createMessage);
chatRoutes.delete('/messages/:id', isAuth, deleteMessage);

export default chatRoutes;
