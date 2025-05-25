import React, { useState } from "react";

// Inline CSS styles
const widgetStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: 1000,
};

const buttonStyle: React.CSSProperties = {
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "60px",
  height: "60px",
  fontSize: "24px",
  cursor: "pointer",
  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
};

const chatContainerStyle: React.CSSProperties = {
  width: "300px",
  height: "400px",
  background: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  background: "#007bff",
  color: "white",
  padding: "10px",
  borderRadius: "8px 8px 0 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
};

const messageAreaStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  overflowY: "auto",
  background: "#f9f9f9",
};

const messageStyle: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "8px",
  borderRadius: "5px",
  marginBottom: "5px",
};

const inputAreaStyle: React.CSSProperties = {
  display: "flex",
  padding: "10px",
  borderTop: "1px solid #ddd",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  marginRight: "5px",
};

const sendButtonStyle: React.CSSProperties = {
  background: "#007bff",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

// Chatbot component
const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
      // Add backend logic here (e.g., API/WebSocket)
    }
  };

  return (
    <div style={widgetStyle}>
      {!isOpen ? (
        <button style={buttonStyle} onClick={toggleChat}>
          💬 Chat
        </button>
      ) : (
        <div style={chatContainerStyle}>
          <div style={headerStyle}>
            <span>Chatbot</span>
            <button style={closeButtonStyle} onClick={toggleChat}>
              ✖
            </button>
          </div>
          <div style={messageAreaStyle}>
            {messages.map((msg, index) => (
              <div key={index} style={messageStyle}>
                {msg}
              </div>
            ))}
          </div>
          <div style={inputAreaStyle}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={inputStyle}
              placeholder="Mesaj yaz..."
            />
            <button style={sendButtonStyle} onClick={handleSend}>
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
