import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbotWidget from './components/ChatbotWidget/ChatbotWidget';
import type { WidgetConfig } from './types/config.types';
// Import CSS - it will be automatically bundled with the JS
import './components/ChatbotWidget/style.css';

// Import other component CSS files to ensure they're bundled
import './components/ChatbotInput/ChatbotInput.module.css';
import './components/ChatbotMessages/ChatbotMessages.module.css';
import './components/QuickReplies/QuickReplies.module.css';
import './components/ChatbotWidget/ChatbotWidget.module.css';
import './components/ChatbotButton/ChatbotButton.module.css';

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

/**
 * Initialize the chatbot widget
 */
const init = (config?: Partial<WidgetConfig>) => {
  try {
    // Clean up any existing instance
    destroy();
    
    // Create a static iframe directly in the DOM
    const iframe = document.createElement('iframe');
    iframe.id = 'chatbot-widget-iframe';
    iframe.setAttribute('chatbot-widget-iframe', '');
    iframe.style.border = 'none';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '360px';
    iframe.style.height = '600px';
    iframe.style.backgroundColor = 'transparent';
    iframe.style.zIndex = '9999';
    iframe.style.overflow = 'hidden';
    
    // Append iframe to body
    document.body.appendChild(iframe);
    widgetIframe = iframe;
    
    // Access the CSS content that was bundled with the JS
    // @ts-ignore - CSS_CONTENT is defined in the bundled file
    const cssContent = typeof CSS_CONTENT !== 'undefined' ? CSS_CONTENT : '';
    
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
            
            /* Additional critical styles */
            .ChatbotButton__button___KHlxL {
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              border: none;
              padding: 0;
              color: white;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              animation: pulse 2s infinite;
              position: fixed;
              bottom: 20px !important;
              right: 20px !important;
            }
            
            .ChatbotButton__buttonIcon___KHlxL {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
            }
            
            /* Quick replies styles */
            .QuickReplies__container___KHlxL {
              background-color: #8B4513;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 10px;
            }
            
            .QuickReplies__button___KHlxL {
              background-color: #8B4513;
              color: white;
              border: 1px solid white;
              border-radius: 16px;
              padding: 8px 16px;
              margin: 4px;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.2s;
            }
            
            .QuickReplies__button___KHlxL:hover {
              background-color: #A0522D;
            }
            
            /* Messages scrollbar */
            .ChatbotMessages__messagesContainer___KHlxL {
              scrollbar-width: none;
            }
            
            .ChatbotMessages__messagesContainer___KHlxL::-webkit-scrollbar {
              display: none;
            }
            
            @keyframes pulse {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
              100% {
                transform: scale(1);
              }
            }
          </style>
        </head>
        <body>
          <div id="chatbot-widget-root"></div>
        </body>
      </html>
    `);
    iframe.contentDocument?.close();
    
    // Wait for iframe to be fully loaded
    setTimeout(() => {
      if (!widgetIframe || !widgetIframe.contentDocument) return;
      
      const iframeDocument = widgetIframe.contentDocument;
      widgetContainer = iframeDocument.getElementById('chatbot-widget-root');
      
      if (widgetContainer) {
        widgetRoot = createRoot(widgetContainer);
        widgetRoot.render(<ChatbotWidget config={config} />);
        console.info('Davision ChatbotWidget initialized in iframe');
      }
    }, 100);
    
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
      widgetContainer = null;
    }
    
    if (widgetIframe) {
      widgetIframe.remove();
      widgetIframe = null;
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

// Auto-init when script loads (plug-and-play)
// Use setTimeout to ensure the script is fully loaded
setTimeout(() => {
  try {
    // Auto-initialize the widget
    init();
    console.info('ChatbotWidget auto-initialized');
  } catch (error) {
    console.error('Failed to auto-initialize ChatbotWidget:', error);
  }
}, 0);

// Also auto-init if data attribute is present for backward compatibility
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
