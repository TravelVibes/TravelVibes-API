import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { compareDateFunc } from '../utils/compareDate.js';
import { httpStatus } from '../utils/httpStatus.js';

export const getAllChats = async (req, res) => {
  try {
    const userID = req.userID;

    // last message
    const allChats = await Chat.find({
      member: {
        $in: [userID],
      },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'member',
        select: 'firstName lastName avatar',
      })
      .lean();
    // Fetch the last message for each chat
    const LHNChats = [];
    for (const chat of allChats) {
      const [receiverID] = chat.member.filter(
        (user) => user._id.toString() !== userID,
      );
      const receiverUser = await User.findById(receiverID).select(
        'firstName lastName avatar',
      );

      const lastMessage = await Message.findOne({ chat: chat._id })
        .sort({ createdAt: -1 })
        .populate({
          path: 'user',
          select: 'firstName lastName avatar',
        });

      if (lastMessage) {
        chat.lastMessage = lastMessage.content;
        LHNChats.push({
          ...chat,
          receiverUser,
          lastMessage: {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
          },
        });
      } else {
        LHNChats.push({
          ...chat,
          receiverUser,
          lastMessage: {
            content: '',
            createdAt: '',
          },
        });
      }
    }
    const sortedLHNChats = LHNChats.sort(compareDateFunc);

    res.status(httpStatus.OK).json(sortedLHNChats);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getChatDetail = async (req, res) => {
  try {
    const { chatID } = req.params;
    const userID = req.userID;

    const chat = await Chat.findById(chatID);
    if (!chat) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Cannot find chat' });
    }
    const [receiverID] = chat.member.filter(
      (user) => user._id.toString() !== userID,
    );
    const receiverUser = await User.findById(receiverID).select(
      'firstName lastName avatar',
    );

    res.status(httpStatus.OK).json({ chat, receiverUser });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const userID = req.userID;
    const { participantID, message } = req.body;
    // get socket instance
    const socket = req.app.get('socket');
    if (userID === participantID) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ error: 'Cannot perform this action' });
    }
    const participantUser = await User.findById(participantID);
    if (!participantUser) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Cannot find user' });
    }
    const membersToCheck = [participantID, userID];
    // Check if chat room exits

    const chatExists = await Chat.findOne({
      member: {
        $all: membersToCheck,
        $size: membersToCheck.length,
      },
    });

    if (chatExists) {
      // The chat room exists
      const messages = await Message.find({ chat: chatExists._id }).populate({
        path: 'user',
        select: 'avatar firstName lastName',
      });
      return res
        .status(httpStatus.CREATED)
        .json({ chat: chatExists, messages });
    }

    const newChat = await new Chat({
      member: [userID, participantID],
    }).save();

    const newMessage = new Message({
      chat: newChat._id,
      user: userID,
      content: message,
    });

    const populatedMessage = await (
      await newMessage.save()
    ).populate('user', 'firstName lastName avatar');
    if (populatedMessage) {
      socket.to(newChat._id).emit('receive_message', populatedMessage);
    } else {
      console.log('Error when sending message');
    }

    res
      .status(httpStatus.CREATED)
      .json({ chat: newChat, message: populatedMessage });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
export const getAllMessageFromChat = async (req, res) => {
  try {
    const { chatID } = req.params;
    const allMessages = await Message.find({ chat: chatID }).populate(
      'user',
      'firstName lastName avatar',
    );
    res.status(httpStatus.OK).json(allMessages);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
export const createMessage = async (req, res) => {
  try {
    const userID = req.userID;
    const { chatID } = req.params;
    const { content, receiverID } = req.body;
    if (userID === receiverID) {
      return res
        .status(httpStatus.METHOD_NOT_ALLOWED)
        .json({ error: 'Cannot perform this action' });
    }
    if (!content.trim()) {
      return res
        .status(httpStatus.NOT_ACCEPTABLE)
        .json({ error: 'Cannot send message with empty content' });
    }

    const newMessage = new Message({
      chat: chatID,
      user: userID,
      content,
    });

    const populatedMessage = await (
      await newMessage.save()
    ).populate('user', 'firstName lastName avatar');

    res.status(httpStatus.CREATED).json(populatedMessage);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const { id: messageID } = req.params;
    // eslint-disable-next-line no-unused-vars
    const message = await Message.findByIdAndDelete(messageID);
    res.status(httpStatus.OK).json({ message: 'Delete message done' });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
