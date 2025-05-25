import React, { useState, useEffect } from "react";
import "./style.css";

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; isClient: boolean }[]
  >([]);
  const [input, setInput] = useState("");

  // Toggle chat and send initial message after 1s when opening
  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          { text: "Hello! How can I assist you today?", isClient: false },
        ]);
      }, 1000);
    }
  };

  // Handle sending messages (both via button and Enter key)
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isClient: true }]);
      setInput("");
    }
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Handle microphone button click
  const handleMicClick = () => {
    alert("Work in progress");
  };

  return (
    <div className={`chatbot-widget ${isOpen ? "chatbot-widget-active" : ""}`}>
      {!isOpen ? (
        <button className="chatbot-button" onClick={toggleChat}>
          <img
            className="chatbot-button-image"
            src="/fab-icon.png"
            alt="Chat icon"
          />
        </button>
      ) : (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <img
                className="chatbot-header-avatar"
                src="/fab-icon.png"
                alt="Avatar"
              />
              <span className="chatbot-header-title">Nova</span>
            </div>
            <button className="chatbot-close-button" onClick={toggleChat}>
              <img
                className="chatbot-close-button-caret"
                src="/caret-down.png"
                alt="Close"
              />
            </button>
          </div>
          <div className="chatbot-message-area">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  msg.isClient ? "chatbot-message-client" : ""
                }`}
              >
                {msg.text}
              </div>
            ))}
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
              />
              <button className="chatbot-send-button" onClick={handleSend}>
                <img src="/public/send.png" alt="Send" />
              </button>
            </div>
            <button
              className="chatbot-input-area-mic-button"
              onClick={handleMicClick}
            >
              <img src="/public/microphone.png" alt="Microphone" />
            </button>
          </div>
          <div className="chatbot-footer-area">
            Powered By
            <img src="/public/davision-logo.svg" alt="Davision Logo" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
