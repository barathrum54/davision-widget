import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ChatContextType } from '../types/chat.types';
import type { WidgetConfig } from '../types/config.types';
import { useChat } from '../hooks/useChat';

// Create context with default empty values
const ChatContext = createContext<ChatContextType>({
  messages: [],
  isOpen: false,
  isLoading: false,
  error: null,
  sendMessage: async () => {},
  toggleChat: () => {},
  clearMessages: () => {},
  retryMessage: () => {},
});

interface ChatProviderProps {
  children: ReactNode;
  config: WidgetConfig;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, config }) => {
  const chat = useChat(config);

  return (
    <ChatContext.Provider value={chat}>
      {children}
    </ChatContext.Provider>
  );
};

export const useGlobalChat = () => useContext(ChatContext);

export default ChatContext; 