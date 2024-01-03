import { Server } from 'socket.io';
import CONST from '../constraints/CONST.js';
import Message from '../models/Message.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: CONST.FE_URL,
    },
  });

  io.on('connection', async (socket) => {
    socket.removeAllListeners();

    socket.on('join_room', (chatId) => {
      socket.join(chatId);
    });

    socket.on(
      'send_message',
      async ({ chatID, senderID, content, receiverID }) => {
        if (senderID === receiverID || !content.trim()) {
          return;
        }

        const newMessage = new Message({
          chat: chatID,
          user: senderID,
          content,
        });

        const populatedMessage = await (
          await newMessage.save()
        ).populate('user', 'firstName lastName avatar');
        if (populatedMessage) {
          io.to(chatID).emit('receive_message', populatedMessage);
        } else {
          console.log('Error when sending message');
        }
      },
    );
    socket.on('disconnect', () => {
      console.log('user disconnect');
    });
  });

  return io;
};
