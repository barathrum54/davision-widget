import type { Message } from '../../types';

const STORAGE_KEY = 'chatbot_messages';

export const messageStorage = {
  saveMessages: (messages: Message[]): void => {
    try {
      if (!window.localStorage) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  },

  getMessages: (): Message[] => {
    try {
      if (!window.localStorage) return [];
      
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      
      const messages = JSON.parse(saved);
      
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        // Ensure all required fields exist
        id: msg.id || `legacy-${Date.now()}`,
        text: msg.text || '',
        isUser: typeof msg.isUser === 'boolean' ? msg.isUser : false,
        status: msg.status || 'sent',
      }));
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  },

  clearMessages: (): void => {
    try {
      if (!window.localStorage) return;
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
  },
}; 