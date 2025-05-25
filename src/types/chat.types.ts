export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
  status?: 'sending' | 'sent' | 'error';
  products?: Product[];
}

export interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  link?: string;
}

export interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatActions {
  sendMessage: (text: string) => Promise<void>;
  toggleChat: () => void;
  clearMessages: () => void;
  retryMessage: (messageId: string) => void;
}

export interface ChatContextType extends ChatState, ChatActions {}

export interface ChatResponse {
  text: string;
  products?: Product[];
  response_type: 0 | 1;
  shouldSendFollowUp?: boolean;
} 