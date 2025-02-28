import Cookies from 'js-cookie';

const CHAT_HISTORY_KEY = 'chatHistory';
const MAX_MESSAGES = 50; // Limit the number of messages to store

export const saveChatHistory = (messages) => {
  try {
    // Only store the last MAX_MESSAGES messages
    const limitedMessages = messages.slice(-MAX_MESSAGES);
    Cookies.set(CHAT_HISTORY_KEY, JSON.stringify(limitedMessages), { expires: 7 }); // Expires in 7 days
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

export const loadChatHistory = () => {
  try {
    const history = Cookies.get(CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

export const clearChatHistory = () => {
  try {
    Cookies.remove(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};
