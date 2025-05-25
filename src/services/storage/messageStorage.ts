import type { Message } from '../../types';

const STORAGE_KEY = 'chatbot_messages';

export const messageStorage = {
  saveMessages: (messages: Message[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  },

  getMessages: (): Message[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      
      const messages = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  },

  clearMessages: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
  },
}; 