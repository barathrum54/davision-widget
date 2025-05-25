import { useState, useCallback, useEffect } from 'react';
import type { Message, ChatState } from '../types/chat.types';
import type { WidgetConfig } from '../types/config.types';
import { generateId } from '../utils/helpers';
import { messageStorage } from '../services/storage/messageStorage';
import { ChatService } from '../services/api/chatService';
import { analyticsService } from '../services/analytics/analyticsService';

export const useChat = (config: WidgetConfig = {}) => {
  const { persistMessages = true } = config;
  
  const [state, setState] = useState<ChatState>({
    messages: [],
    isOpen: false,
    isLoading: false,
    error: null,
  });

  const chatService = new ChatService({
    apiEndpoint: config.apiEndpoint,
    apiKey: config.apiKey,
    headers: config.headers,
    analyticsEndpoint: config.analyticsEndpoint,
  });

  useEffect(() => {
    if (persistMessages) {
      const savedMessages = messageStorage.getMessages();
      if (savedMessages.length > 0) {
        setState(prev => ({ ...prev, messages: savedMessages }));
      }
    }
  }, [persistMessages]);

  useEffect(() => {
    if (persistMessages && state.messages.length > 0) {
      messageStorage.saveMessages(state.messages);
    }
  }, [state.messages, persistMessages]);

  useEffect(() => {
    if (state.isOpen && state.messages.length === 0 && config.welcomeMessage) {
      const welcomeMessage: Message = {
        id: generateId(),
        text: config.welcomeMessage,
        timestamp: new Date(),
        isUser: false,
        status: 'sent',
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, welcomeMessage],
      }));
    }
  }, [state.isOpen, state.messages.length, config.welcomeMessage]);

  const sendMessage = useCallback(async (text: string): Promise<void> => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: generateId(),
      text,
      timestamp: new Date(),
      isUser: true,
      status: 'sending',
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await chatService.sendMessage(text);
      
      const botMessage: Message = {
        id: generateId(),
        text: response.text,
        timestamp: new Date(),
        isUser: false,
        status: 'sent',
        products: response.products,
      };

      setState(prev => {
        const updatedMessages = prev.messages.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        );
        return {
          ...prev,
          messages: [...updatedMessages, botMessage],
          isLoading: false,
        };
      });

      if (response.shouldSendFollowUp) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: generateId(),
            text: "Is there anything else I can help you with?",
            timestamp: new Date(),
            isUser: false,
            status: 'sent',
          };

          setState(prev => ({
            ...prev,
            messages: [...prev.messages, followUpMessage],
          }));
        }, 1000);
      }
    } catch (error) {
      setState(prev => {
        const updatedMessages = prev.messages.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg
        );
        return {
          ...prev,
          messages: updatedMessages,
          isLoading: false,
          error: 'Failed to send message. Please try again.',
        };
      });
    }
  }, [chatService]);

  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    
    if (!state.isOpen) {
      analyticsService.trackEvent({
        eventType: 'open_chat',
      });
    } else {
      analyticsService.trackEvent({
        eventType: 'close_chat',
      });
    }
  }, [state.isOpen]);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
    if (persistMessages) {
      messageStorage.clearMessages();
    }
  }, [persistMessages]);

  const retryMessage = useCallback((messageId: string) => {
    const message = state.messages.find(msg => msg.id === messageId);
    if (message && message.isUser) {
      setState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== messageId),
        error: null,
      }));
      
      sendMessage(message.text);
    }
  }, [state.messages, sendMessage]);

  return {
    ...state,
    sendMessage,
    toggleChat,
    clearMessages,
    retryMessage,
  };
}; 