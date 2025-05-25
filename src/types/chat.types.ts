export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatActions {
  sendMessage: (text: string) => void;
  toggleChat: () => void;
  clearMessages: () => void;
  retryMessage: (messageId: string) => void;
} 