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
import iframeStyles from './components/ChatbotWidget/ChatbotIframe.module.css';
import './components/OfflineOverlay/OfflineOverlay.module.css';

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

/**
 * Initialize the chatbot widget
 */
const init = (config?: Partial<WidgetConfig>) => {
  try {
    // Clean up any existing instance
    destroy();
    
    // Create a wrapper element that we can style
    const wrapper = document.createElement('div');
    wrapper.id = 'chatbot-widget-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '0';
    wrapper.style.right = '0';
    wrapper.style.width = '100vw';
    wrapper.style.height = '100vh';
    wrapper.style.zIndex = '9999';
    wrapper.style.overflow = 'hidden';
    wrapper.style.border = 'none';
    wrapper.style.backgroundColor = 'transparent';
    
    // Add media query for responsiveness
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 480px) {
        #chatbot-widget-wrapper {
          width: 100% !important;
          height: 100vh !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Create iframe inside the wrapper
    const iframe = document.createElement('iframe');
    iframe.id = 'chatbot-widget-iframe';
    iframe.setAttribute('chatbot-widget-iframe', '');
    
    // Reset iframe default styles
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.overflow = 'hidden';
    iframe.style.backgroundColor = 'transparent';
    
    // Append elements to DOM
    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
    
    widgetWrapper = wrapper;
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
              bottom: 20px;
              right: 20px;
            }
            
            .ChatbotButton__buttonIcon___KHlxL {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
            }
            
            .ChatbotButton__buttonIcon___KHlxL img {
              width: 30px;
              height: 30px;
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
            
            /* Responsive styles for iframe content */
            @media (max-width: 480px) {
              .ChatbotWidget_widget__KHlxL {
                bottom: 0 !important;
                right: 0 !important;
                width: 100% !important;
                height: 100% !important;
              }
              
              .ChatbotWidget_container__KHlxL {
                width: 100% !important;
                height: 100% !important;
                border-radius: 0 !important;
                box-shadow: none !important;
              }
            }
            
            /* Offline overlay styles */
            .OfflineOverlay__overlay___KHlxL {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
            }
            
            .OfflineOverlay__content___KHlxL {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
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
    if (!iframe.contentDocument) return;
    
    widgetContainer = iframe.contentDocument.getElementById('chatbot-widget-root');
    
    if (widgetContainer) {
      widgetRoot = createRoot(widgetContainer);
      widgetRoot.render(<ChatbotWidget config={config} />);
    }
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
      widgetIframe = null;
    }
    
    if (widgetWrapper) {
      widgetWrapper.remove();
      widgetWrapper = null;
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
