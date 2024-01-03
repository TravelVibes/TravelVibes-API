import moment from 'moment';

export const compareDateFunc = (chatA, chatB) => {
  const dateA = moment(chatA.lastMessage.createdAt) ?? Date.now();
  const dateB = moment(chatB.lastMessage.createdAt) ?? Date.now();
  return dateB - dateA;
};
