import React from "react";
import { createRoot } from "react-dom/client";
import ChatbotWidget from "./components/ChatbotWidget/ChatbotWidget";
import type { WidgetConfig } from "./types/config.types";
import {
  WRAPPER_STYLES,
  WRAPPER_CSS,
  createResizeHandler,
} from "./styles/wrapper.styles";
// Import CSS - it will be automatically bundled with the JS
import "./components/ChatbotWidget/style.css";

// Import other component CSS files to ensure they're bundled
import "./components/ChatbotInput/ChatbotInput.module.css";
import "./components/ChatbotMessages/ChatbotMessages.module.css";
import "./components/QuickReplies/QuickReplies.module.css";
import "./components/ChatbotWidget/ChatbotWidget.module.css";
import "./components/ChatbotButton/ChatbotButton.module.css";
import "./components/OfflineOverlay/OfflineOverlay.module.css";

declare global {
  interface Window {
    ChatbotWidget: {
      init: (config?: Partial<WidgetConfig>) => void;
      destroy: () => void;
      toggle: () => void;
    };
  }
}

let widgetRoot: ReturnType<typeof createRoot> | null = null;
let widgetContainer: HTMLElement | null = null;
let widgetIframe: HTMLIFrameElement | null = null;
let widgetWrapper: HTMLElement | null = null;

// Global function for handling chat state changes (works in both dev and production)
(
  window as unknown as { handleChatbotResize: (isOpen: boolean) => void }
).handleChatbotResize = createResizeHandler(() => widgetWrapper);

/**
 * Initialize the chatbot widget
 */
const init = (config?: Partial<WidgetConfig>) => {
  try {
    // Clean up any existing instance
    destroy();

    // Create a wrapper element that we can style
    const wrapper = document.createElement("div");
    wrapper.id = "chatbot-widget-wrapper";

    // Apply centralized styles
    Object.assign(wrapper.style, WRAPPER_STYLES);

    // Add media query for responsive sizing
    const style = document.createElement("style");
    style.textContent = WRAPPER_CSS;
    document.head.appendChild(style);

    // Create iframe inside the wrapper
    const iframe = document.createElement("iframe");
    iframe.id = "chatbot-widget-iframe";
    iframe.setAttribute("chatbot-widget-iframe", "");

    // Reset iframe default styles
    iframe.style.border = "none";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.overflow = "hidden";
    iframe.style.backgroundColor = "transparent";

    // Append elements to DOM
    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);

    widgetWrapper = wrapper;
    widgetIframe = iframe;

    // Access the CSS content that was bundled with the JS
    // @ts-expect-error - CSS_CONTENT is defined in the bundled file
    const cssContent = typeof CSS_CONTENT !== "undefined" ? CSS_CONTENT : "";

    // Write content directly to iframe to avoid CORS issues
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            * {
              box-sizing: border-box;
            }
            
            /* Include bundled CSS */
            ${cssContent}
          </style>
        </head>
        <body>
          <div id="chatbot-widget-root"></div>
        </body>
      </html>
    `);
    iframe.contentDocument?.close();

    // Wait for iframe to be fully loaded
    if (!iframe.contentDocument) return;

    widgetContainer = iframe.contentDocument.getElementById(
      "chatbot-widget-root"
    );

    if (widgetContainer) {
      widgetRoot = createRoot(widgetContainer);
      widgetRoot.render(<ChatbotWidget config={config} />);
    }

    // Add message listener for dynamic resizing
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
      wrapper as HTMLElement & {
        _messageHandler?: (event: MessageEvent) => void;
      }
    )._messageHandler = handleMessage;
  } catch (error) {
    console.error("Failed to initialize ChatbotWidget:", error);
  }
};

/**
 * Destroy the chatbot widget
 */
const destroy = () => {
  try {
    if (widgetRoot) {
      widgetRoot.unmount();
      widgetRoot = null;
    }

    if (widgetContainer) {
      widgetContainer = null;
    }

    if (widgetIframe) {
      widgetIframe = null;
    }

    if (widgetWrapper) {
      widgetWrapper.remove();
      widgetWrapper = null;
    }
  } catch (error) {
    console.error("Failed to destroy ChatbotWidget:", error);
  }
};

/**
 * Toggle the chatbot widget open/closed state
 */
const toggle = () => {
  try {
    // This functionality is handled by the ChatContext
    // This method is just a placeholder for future implementation
  } catch (error) {
    console.error("Failed to toggle ChatbotWidget:", error);
  }
};

// Export the API methods
const ChatbotAPI = {
  init,
  destroy,
  toggle,
};

// Expose to window
window.ChatbotWidget = ChatbotAPI;

// Auto-init when script loads (plug-and-play)
// Use setTimeout to ensure the script is fully loaded
setTimeout(() => {
  try {
    // Auto-initialize the widget
    init({
      persistMessages: true,
    });
  } catch (error) {
    console.error("Failed to auto-initialize ChatbotWidget:", error);
  }
}, 0);

// Also auto-init if data attribute is present for backward compatibility
document.addEventListener("DOMContentLoaded", () => {
  const script = Array.from(document.getElementsByTagName("script")).find(
    (s) => s.src.includes("chatbot-widget") && s.hasAttribute("data-auto-init")
  );

  if (script) {
    const configStr = script.getAttribute("data-config");
    const config = configStr ? JSON.parse(configStr) : undefined;
    init(config);
  }
});

export default ChatbotAPI;
