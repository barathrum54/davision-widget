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
  };

  return (
    <button 
      style={buttonStyle}
      onClick={onClick}
      aria-label="Open chat"
    >
      <div style={iconStyle}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.55 3.35 17L2 22L7 20.65C8.45 21.5 10.15 22 12 22C17.52 22 22 17.52 22 12S17.52 2 12 2ZM12 20C10.35 20 8.85 19.5 7.55 18.7L7.2 18.5L4.5 19.5L5.5 16.8L5.3 16.45C4.5 15.15 4 13.65 4 12C4 7.59 7.59 4 12 4S20 7.59 20 12S16.41 20 12 20Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </button>
  );
};

export default ChatbotButton; 