import type { Message } from "../../types";

const STORAGE_KEY = "chatbot_messages";

export const messageStorage = {
  saveMessages: (messages: Message[]): void => {
    try {
      if (!window.localStorage) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Silent fail
    }
  },

  getMessages: (): Message[] => {
    try {
      if (!window.localStorage) return [];

      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];

      const messages = JSON.parse(saved);

      return messages.map((msg: Record<string, unknown>) => ({
        ...msg,
        timestamp: new Date(msg.timestamp as string),
        id: (msg.id as string) || `legacy-${Date.now()}`,
        text: (msg.text as string) || "",
        isUser: typeof msg.isUser === "boolean" ? msg.isUser : false,
        status: (msg.status as string) || "sent",
      }));
    } catch {
      return [];
    }
  },

  clearMessages: (): void => {
    try {
      if (!window.localStorage) return;
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silent fail
    }
  },
};
