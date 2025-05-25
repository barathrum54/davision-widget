import type { Message } from '../../types';

const STORAGE_KEY = 'chatbot_messages';

export const messageStorage = {
  saveMessages: (messages: Message[]): void => {
    try {
      if (!window.localStorage) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      // Silent fail
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
        id: msg.id || `legacy-${Date.now()}`,
        text: msg.text || '',
        isUser: typeof msg.isUser === 'boolean' ? msg.isUser : false,
        status: msg.status || 'sent',
      }));
    } catch (error) {
      return [];
    }
  },

  clearMessages: (): void => {
    try {
      if (!window.localStorage) return;
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Silent fail
    }
  },
}; 