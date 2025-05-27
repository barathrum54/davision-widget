/**
 * Centralized wrapper styles for both development and production builds
 */

export const WRAPPER_STYLES = {
  // Base wrapper styles
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "100px", // Updated FAB size
  height: "100px", // Updated FAB size
  zIndex: "9999",
  overflow: "visible",
  border: "none",
  backgroundColor: "transparent",
  transition: "all 0.3s ease", // Only for desktop
} as const;

export const WRAPPER_CSS = `
  /* Large screens and bigger */
  @media (min-width: 1024px) {
    #chatbot-widget-wrapper {
      width: 100px !important;
      height: 100px !important;
      transition: all 0.3s ease !important;
    }
    
    #chatbot-widget-wrapper.chat-open {
      width: 380px !important;
      height: 600px !important;
    }
    
    /* On desktop, keep normal FAB behavior - no instant hiding */
  }
  
  /* Mobile and mid tablet (smaller than large) */
  @media (max-width: 1023px) {
    #chatbot-widget-wrapper {
      width: 100px !important;
      height: 100px !important;
      transition: none !important; /* Instant resize on mobile */
    }
    
    #chatbot-widget-wrapper.chat-open {
      width: 100vw !important;
      height: 100vh !important;
      bottom: 0 !important;
      right: 0 !important;
      top: 0 !important;
      left: 0 !important;
      transition: none !important; /* Instant resize on mobile */
    }
    
    /* Hide FAB instantly when chat opens ONLY on responsive to prevent teleporting */
    #chatbot-widget-wrapper.chat-open button[aria-label="Open chat"] {
      display: none !important;
      transition: none !important;
    }
    
    /* Remove ALL transitions on responsive for instant behavior */
    #chatbot-widget-wrapper button {
      transition: none !important;
    }
    
    #chatbot-widget-wrapper.chat-open button {
      transition: none !important;
    }
    
    /* Remove all transitions from iframe and container on mobile */
    #chatbot-widget-wrapper iframe,
    #chatbot-widget-wrapper > div {
      transition: none !important;
    }
  }
`;

/**
 * Global function factory for handling chat state changes
 */
export const createResizeHandler = (getWrapper: () => HTMLElement | null) => {
  return (isOpen: boolean) => {
    console.log("handleChatbotResize called with isOpen:", isOpen);
    const wrapper = getWrapper();
    console.log("wrapper exists:", !!wrapper);
    if (wrapper) {
      console.log("Current wrapper classes before:", wrapper.className);
      if (isOpen) {
        wrapper.classList.add("chat-open");
        console.log("Added chat-open class");
      } else {
        wrapper.classList.remove("chat-open");
        console.log("Removed chat-open class");
      }
      console.log("Current wrapper classes after:", wrapper.className);
    }
  };
};
