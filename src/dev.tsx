/** @jsx React.createElement */
import React from "react";
import { createRoot } from "react-dom/client";
import ChatbotWidget from "./components/ChatbotWidget/ChatbotWidget";
import type { WidgetConfig } from "./types/config.types";
import {
  WRAPPER_STYLES,
  WRAPPER_CSS,
  createResizeHandler,
} from "./styles/wrapper.styles";

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
let widgetWrapper: HTMLElement | null = null;

// Global function for development mode to handle chat state changes
(
  window as unknown as { handleChatbotResize: (isOpen: boolean) => void }
).handleChatbotResize = createResizeHandler(() => widgetWrapper);

/**
 * Initialize the widget for development
 */
export const initDev = (config?: Partial<WidgetConfig>) => {
  // Clean up any existing instance
  destroyDev();

  // Create wrapper element with the same structure as production
  const wrapper = document.createElement("div");
  wrapper.id = "chatbot-widget-wrapper";

  // Apply centralized styles
  Object.assign(wrapper.style, WRAPPER_STYLES);

  // Add media query for responsive sizing
  const style = document.createElement("style");
  style.textContent = WRAPPER_CSS;
  document.head.appendChild(style);

  // Create container for widget inside wrapper
  widgetContainer = document.createElement("div");
  widgetContainer.id = "chatbot-dev-container";
  widgetContainer.style.width = "100%";
  widgetContainer.style.height = "100%";

  wrapper.appendChild(widgetContainer);
  document.body.appendChild(wrapper);

  widgetWrapper = wrapper;

  // Add message listener for dynamic resizing (for iframe compatibility)
  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === "CHATBOT_RESIZE") {
      const isOpen = event.data.isOpen;
      if (isOpen) {
        wrapper.classList.add("chat-open");
      } else {
        wrapper.classList.remove("chat-open");
      }
    }
  };

  window.addEventListener("message", handleMessage);

  // Store the handler for cleanup
  (
    wrapper as HTMLElement & { _messageHandler?: (event: MessageEvent) => void }
  )._messageHandler = handleMessage;

  // Render the widget
  widgetRoot = createRoot(widgetContainer);
  widgetRoot.render(<ChatbotWidget config={{ ...defaultConfig, ...config }} />);

  return {
    container: widgetContainer,
    wrapper: widgetWrapper,
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

  if (widgetWrapper) {
    // Remove message listener
    const handler = (
      widgetWrapper as HTMLElement & {
        _messageHandler?: (event: MessageEvent) => void;
      }
    )._messageHandler;
    if (handler) {
      window.removeEventListener("message", handler);
    }

    widgetWrapper.remove();
    widgetWrapper = null;
  }

  if (widgetContainer) {
    widgetContainer = null;
  }
};

// Export the development API
const DevAPI = {
  init: initDev,
  destroy: destroyDev,
};

export default DevAPI;
