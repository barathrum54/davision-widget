import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbotWidget from './components/ChatbotWidget/ChatbotWidget';
import type { WidgetConfig } from './types/config.types';
// Import CSS as text
import chatbotStyles from './components/ChatbotWidget/style.css';

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

/**
 * Initialize the chatbot widget
 */
const init = (config?: Partial<WidgetConfig>) => {
  try {
    // Clean up any existing instance
    destroy();
    
    // Create container with Shadow DOM for style isolation
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'chatbot-widget-root';
    document.body.appendChild(widgetContainer);
    
    const shadow = widgetContainer.attachShadow({ mode: 'open' });
    
    // Create root element inside Shadow DOM
    const rootElement = document.createElement('div');
    shadow.appendChild(rootElement);
    
    // Create style element to inject all CSS
    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      :host {
        --chatbot-z-index: 9999;
        --chatbot-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      
      /* Inject component styles */
      ${chatbotStyles}
    `;
    shadow.appendChild(style);
    
    // Render widget
    widgetRoot = createRoot(rootElement);
    widgetRoot.render(<ChatbotWidget config={config} />);
    
    console.info('Davision ChatbotWidget initialized');
  } catch (error) {
    console.error('Failed to initialize ChatbotWidget:', error);
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
      widgetContainer.remove();
      widgetContainer = null;
    }
  } catch (error) {
    console.error('Failed to destroy ChatbotWidget:', error);
  }
};

/**
 * Toggle the chatbot widget open/closed state
 */
const toggle = () => {
  try {
    // This functionality is handled by the ChatContext
    // This method is just a placeholder for future implementation
    console.info('Toggle method not implemented yet');
  } catch (error) {
    console.error('Failed to toggle ChatbotWidget:', error);
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

// Auto-init if data attribute is present
document.addEventListener('DOMContentLoaded', () => {
  const script = Array.from(document.getElementsByTagName('script')).find(
    (s) => s.src.includes('chatbot-widget') && s.hasAttribute('data-auto-init')
  );
  
  if (script) {
    const configStr = script.getAttribute('data-config');
    const config = configStr ? JSON.parse(configStr) : undefined;
    init(config);
  }
});

export default ChatbotAPI;
