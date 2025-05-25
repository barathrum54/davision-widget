import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbotWidget from './components/ChatbotWidget';
import { WidgetConfig } from './types';

declare global {
  interface Window {
    ChatbotWidget: {
      init: (config?: WidgetConfig) => void;
      destroy: () => void;
    };
  }
}

let widgetRoot: ReturnType<typeof createRoot> | null = null;

const init = (config?: WidgetConfig) => {
  try {
    // Create container
    const container = document.createElement('div');
    container.id = 'chatbot-widget-root';
    document.body.appendChild(container);

    // Create shadow DOM for style isolation
    const shadowRoot = container.attachShadow({ mode: 'open' });
    
    // Create root element inside shadow DOM
    const rootElement = document.createElement('div');
    shadowRoot.appendChild(rootElement);

    // Render widget
    widgetRoot = createRoot(rootElement);
    widgetRoot.render(<ChatbotWidget config={config} />);
  } catch (error) {
    console.error('Failed to initialize ChatbotWidget:', error);
  }
};

const destroy = () => {
  try {
    if (widgetRoot) {
      widgetRoot.unmount();
      widgetRoot = null;
    }
    
    const container = document.getElementById('chatbot-widget-root');
    if (container) {
      container.remove();
    }
  } catch (error) {
    console.error('Failed to destroy ChatbotWidget:', error);
  }
};

// Expose to window
window.ChatbotWidget = { init, destroy };

// Auto-init if data attribute is present
document.addEventListener('DOMContentLoaded', () => {
  const script = document.currentScript;
  if (script?.hasAttribute('data-auto-init')) {
    const configStr = script.getAttribute('data-config');
    const config = configStr ? JSON.parse(configStr) : undefined;
    init(config);
  }
});
