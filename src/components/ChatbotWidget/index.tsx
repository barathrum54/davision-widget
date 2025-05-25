import React, { useState, useEffect } from "react";
import "./style.css";
import { useChat } from "../../hooks/useChat";
import QuickReplies from "../QuickReplies/QuickReplies";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import { analyticsService } from "../../services/analytics/analyticsService";
import type { Message } from "../../types/chat.types";
import { CARET_DOWN_ICON, CHAT_BUTTON_ICON, MICROPHONE_ICON, SEND_ICON } from "../../assets/base64Images";

interface ChatbotWidgetProps {
  apiEndpoint?: string;
  apiKey?: string;
  analyticsEndpoint?: string;
  customConfig?: any;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  apiEndpoint,
  apiKey,
  analyticsEndpoint,
  customConfig,
}) => {
  const [input, setInput] = useState("");
  
  const {
    messages,
    isOpen,
    isLoading,
    sendMessage,
    toggleChat,
    clearMessages,
    retryMessage,
  } = useChat({
    apiEndpoint,
    apiKey,
    analyticsEndpoint,
    headers: customConfig?.headers,
    persistMessages: true,
    welcomeMessage: "Hello! How can I assist you today?",
  });

  // Track page view when component mounts
  useEffect(() => {
    analyticsService.trackEvent({
      eventType: 'page_view',
    });
  }, []);

  // Track chat open/close
  useEffect(() => {
    if (isOpen) {
      analyticsService.trackEvent({
        eventType: 'open_chat',
      });
    }
  }, [isOpen]);

  // Handle sending messages
  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Handle quick reply selection
  const handleQuickReplySelected = (text: string) => {
    sendMessage(text);
  };

  // Handle microphone button click
  const handleMicClick = () => {
    analyticsService.trackEvent({
      eventType: 'click_quick_reply',
      eventData: { feature: 'voice_input' }
    });
    alert("Voice input feature is coming soon!");
  };

  // Render message based on type
  const renderMessage = (message: Message) => {
    const messageClassName = `chatbot-message ${
      message.isUser ? "chatbot-message-client" : ""
    }`;

    return (
      <div key={message.id} className={messageClassName}>
        <div className="chatbot-message-content">
          {message.text}
        </div>
        
        {message.products && message.products.length > 0 && (
          <div className="chatbot-message-carousel">
            <ProductCarousel products={message.products} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`chatbot-widget ${isOpen ? "chatbot-widget-active" : ""}`}>
      {!isOpen ? (
        <button className="chatbot-button" onClick={toggleChat}>
          <img
            className="chatbot-button-image"
            src={CHAT_BUTTON_ICON}
            alt="Chat icon"
          />
        </button>
      ) : (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <img
                className="chatbot-header-avatar"
                src={CHAT_BUTTON_ICON}
                alt="Avatar"
              />
              <span className="chatbot-header-title">Nova</span>
            </div>
            <button className="chatbot-close-button" onClick={toggleChat}>
              <img
                className="chatbot-close-button-caret"
                src={CARET_DOWN_ICON}
                alt="Close"
              />
            </button>
          </div>
          
          <div className="chatbot-message-area">
            {messages.map((message) => renderMessage(message))}
            {isLoading && (
              <div className="chatbot-message">
                <div className="chatbot-loading-indicator">
                  <div></div><div></div><div></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="chatbot-input-area">
            <div className="chatbot-input-wrapper">
              <input
                type="text"
                value={input}
                className="chatbot-input"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
              <button 
                className="chatbot-send-button" 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                <img src={SEND_ICON} alt="Send" />
              </button>
            </div>
            <button
              className="chatbot-input-area-mic-button"
              onClick={handleMicClick}
              disabled={isLoading}
            >
              <img src={MICROPHONE_ICON} alt="Microphone" />
            </button>
          </div>
          
          <QuickReplies onReplySelected={handleQuickReplySelected} replies={customConfig?.quickReplies} />
          
          <div className="chatbot-footer-area">
            Powered By
            <img src="/davision-logo.svg" alt="Davision Logo" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
