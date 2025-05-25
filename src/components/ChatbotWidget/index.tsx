import React, { useState } from "react";
import "./style.css";

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="chatbot-widget">
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
              <div key={index} className="chatbot-message">
                {msg}
              </div>
            ))}
          </div>
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              className="chatbot-input"
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesaj yaz..."
            />
            <button className="chatbot-send-button" onClick={handleSend}>
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
