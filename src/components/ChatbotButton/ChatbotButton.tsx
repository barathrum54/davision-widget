import React from 'react';

interface ChatbotButtonProps {
  onClick: () => void;
  color?: string;
  size?: number;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ 
  onClick, 
  color = '#007bff',
  size = 60 
}) => {
  const buttonStyle = {
    borderRadius: '50%',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    padding: 0,
    color: 'white',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
  };

  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    borderRadius: '50%',
  };

  return (
    <button 
      style={buttonStyle}
      onClick={onClick}
      aria-label="Open chat"
    >
      <div style={iconStyle}>
        <img 
          src="/fab-icon.png" 
          alt="Chat" 
          style={imageStyle}
        />
      </div>
    </button>
  );
};

export default ChatbotButton; 