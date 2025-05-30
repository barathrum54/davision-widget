import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { Message, ChatState } from "../types/chat.types";
import type { WidgetConfig } from "../types/config.types";
import { generateId } from "../utils/helpers";
import { messageStorage } from "../services/storage/messageStorage";
import { ChatService } from "../services/api/chatService";
import { analyticsService } from "../services/analytics/analyticsService";

export const useChat = (config: WidgetConfig = {}) => {
  const { persistMessages = false } = config;

  const [state, setState] = useState<ChatState>({
    messages: [],
    isOpen: false,
    isLoading: false,
    error: null,
    isOffline: false,
  });

  const checkIntervalRef = useRef<number | null>(null);

  const chatService = useMemo(
    () =>
      new ChatService({
        apiEndpoint: config.apiEndpoint,
        apiKey: config.apiKey,
        headers: config.headers,
        analyticsEndpoint: config.analyticsEndpoint,
      }),
    [
      config.apiEndpoint,
      config.apiKey,
      config.headers,
      config.analyticsEndpoint,
    ]
  );

  const checkNetworkConnectivity = useCallback(() => {
    const isOnline = navigator.onLine;

    setState((prev) => {
      if (prev.isOffline !== !isOnline) {
        return { ...prev, isOffline: !isOnline };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    // Initial check
    checkNetworkConnectivity();

    // Set up event listeners for online/offline events
    window.addEventListener("online", checkNetworkConnectivity);
    window.addEventListener("offline", checkNetworkConnectivity);

    // Set up interval to check connectivity every second
    checkIntervalRef.current = window.setInterval(
      checkNetworkConnectivity,
      1000
    );

    return () => {
      window.removeEventListener("online", checkNetworkConnectivity);
      window.removeEventListener("offline", checkNetworkConnectivity);

      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [checkNetworkConnectivity]);

  useEffect(() => {
    if (persistMessages) {
      const savedMessages = messageStorage.getMessages();
      if (savedMessages.length > 0) {
        setState((prev) => ({ ...prev, messages: savedMessages }));
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
        status: "sent",
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, welcomeMessage],
      }));
    }
  }, [state.isOpen, state.messages.length, config.welcomeMessage]);

  const sendMessage = useCallback(
    async (text: string, buttonLabel?: string): Promise<void> => {
      if (!text.trim()) return;

      // Don't send if offline
      if (state.isOffline) {
        setState((prev) => ({
          ...prev,
          error:
            "You're offline. Please check your internet connection and try again.",
        }));
        return;
      }

      // Button label tracking:
      // - 'quick_reply': User clicked a quick reply button
      // - 'voice_button': User used voice input (regardless of how it was sent)
      // - 'keyboard_enter': User typed and pressed Enter
      // - 'ui_submit': User typed and clicked the send button
      // - 'retry_message': User clicked retry on a failed message
      // - undefined/null: Manual text input or other cases

      const userMessage: Message = {
        id: generateId(),
        text,
        timestamp: new Date(),
        isUser: true,
        status: "sending",
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        const response = await chatService.sendMessage(text, buttonLabel);

        const botMessage: Message = {
          id: generateId(),
          text: response.text,
          timestamp: new Date(),
          isUser: false,
          status: "sent",
          products: response.products,
        };

        setState((prev) => {
          const updatedMessages = prev.messages.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, status: "sent" as const }
              : msg
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
              status: "sent",
            };

            setState((prev) => ({
              ...prev,
              messages: [...prev.messages, followUpMessage],
            }));
          }, 1000);
        }
      } catch {
        // Mark the user's message as failed instead of showing bot error message
        setState((prev) => {
          const updatedMessages = prev.messages.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, status: "error" as const }
              : msg
          );
          return {
            ...prev,
            messages: updatedMessages,
            isLoading: false,
            error: null, // Clear any previous errors
          };
        });
      }
    },
    [chatService, state.isOffline]
  );

  const toggleChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));

    if (!state.isOpen) {
      analyticsService.trackEvent({
        eventType: "open_chat",
      });
    } else {
      analyticsService.trackEvent({
        eventType: "close_chat",
      });
    }
  }, [state.isOpen]);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, messages: [] }));
    if (persistMessages) {
      messageStorage.clearMessages();
    }
  }, [persistMessages]);

  const retryMessage = useCallback(
    (messageId: string) => {
      const message = state.messages.find((msg) => msg.id === messageId);
      if (message && message.isUser) {
        setState((prev) => ({
          ...prev,
          messages: prev.messages.filter((msg) => msg.id !== messageId),
          error: null,
        }));

        sendMessage(message.text, "retry_message"); // Mark as retry attempt
      }
    },
    [state.messages, sendMessage]
  );

  return {
    ...state,
    sendMessage,
    toggleChat,
    clearMessages,
    retryMessage,
  };
};
