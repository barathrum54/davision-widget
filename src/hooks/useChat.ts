import { useState, useCallback, useEffect } from 'react';
import { Message, ChatState } from '../types';
import { generateId } from '../utils/helpers';
import { messageStorage } from '../services/storage/messageStorage';

export const useChat = (persistMessages: boolean = true) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isOpen: false,
    isLoading: false,
    error: null,
  });

  // Load persisted messages on mount
  useEffect(() => {
    if (persistMessages) {
      const savedMessages = messageStorage.getMessages();
      if (savedMessages.length > 0) {
        setState(prev => ({ ...prev, messages: savedMessages }));
      }
    }
  }, [persistMessages]);

  // Save messages when they change
  useEffect(() => {
    if (persistMessages) {
      messageStorage.saveMessages(state.messages);
    }
  }, [state.messages, persistMessages]);

  const sendMessage = useCallback(async (text: string) => {
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
      // TODO: Implement actual API call
      // const response = await chatService.sendMessage(text);
      
      // Simulate API response
      setTimeout(() => {
        const botMessage: Message = {
          id: generateId(),
          text: 'This is a demo response. In production, this would come from your API.',
          timestamp: new Date(),
          isUser: false,
          status: 'sent',
        };

        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
          ).concat(botMessage),
          isLoading: false,
        }));
      }, 1000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
        ),
        isLoading: false,
        error: 'Failed to send message. Please try again.',
      }));
    }
  }, []);

  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
    if (persistMessages) {
      messageStorage.clearMessages();
    }
  }, [persistMessages]);

  const retryMessage = useCallback((messageId: string) => {
    const message = state.messages.find(msg => msg.id === messageId);
    if (message && message.isUser) {
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