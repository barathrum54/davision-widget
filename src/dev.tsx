/** @jsx React.createElement */
import React from "react";
import { createRoot } from "react-dom/client";
import ChatbotWidget from "./components/ChatbotWidget/ChatbotWidget";
import type { WidgetConfig } from "./types/config.types";

/**
 * Development entry point for the chatbot widget
 * This file is designed to be imported directly in development mode
 */

// Default config
const defaultConfig: Partial<WidgetConfig> = {
  welcomeMessage: "Hello! How can I help you today?",
  quickReplies: [
    { id: "1", text: "What products do you have?" },
    { id: "2", text: "How can I order?" },
    { id: "3", text: "What is your return policy?" },
    { id: "4", text: "Where is my order?" },
    { id: "5", text: "Contact customer service" },
  ],
  persistMessages: true,
};

// Widget instance management
let widgetRoot: ReturnType<typeof createRoot> | null = null;
let widgetContainer: HTMLElement | null = null;

/**
 * Initialize the widget for development
 */
export const initDev = (config?: Partial<WidgetConfig>) => {
  // Clean up any existing instance
  destroyDev();

  // Create container for widget
  widgetContainer = document.createElement("div");
  widgetContainer.id = "chatbot-dev-container";
  document.body.appendChild(widgetContainer);

  // Render the widget
  widgetRoot = createRoot(widgetContainer);
  widgetRoot.render(<ChatbotWidget config={{ ...defaultConfig, ...config }} />);

  return {
    container: widgetContainer,
    root: widgetRoot,
  };
};

/**
 * Destroy the widget instance
 */
export const destroyDev = () => {
  if (widgetRoot) {
    widgetRoot.unmount();
    widgetRoot = null;
  }

  if (widgetContainer) {
    widgetContainer.remove();
    widgetContainer = null;
  }
};

// Export the development API
const DevAPI = {
  init: initDev,
  destroy: destroyDev,
};

export default DevAPI;
