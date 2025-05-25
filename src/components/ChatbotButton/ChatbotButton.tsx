import React from 'react';
import styles from './ChatbotButton.module.css';
import { CHAT_BUTTON_ICON } from '../../assets/base64Images';

interface ChatbotButtonProps {
  onClick: () => void;
  color?: string;
  size?: number;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ 
  onClick, 
  color = '#0084FF',
  size = 60 
}) => {
  // Combine inline styles with CSS modules
  const buttonStyle = {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '1000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
  };

  return (
    <button 
      className={styles.button}
      style={buttonStyle}
      onClick={onClick}
      aria-label="Open chat"
    >
      <div className={styles.buttonIcon}>
        <img src={CHAT_BUTTON_ICON} alt="" />
      </div>
    </button>
  );
};

export default ChatbotButton; 