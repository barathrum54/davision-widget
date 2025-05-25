import React from 'react';
import styles from './ChatbotHeader.module.css';

interface ChatbotHeaderProps {
  title: string;
  subtitle?: string;
  avatarSrc?: string;
  onClose: () => void;
}

const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({
  title,
  subtitle,
  avatarSrc,
  onClose,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {avatarSrc ? (
          <img
            className={styles.avatar}
            src={avatarSrc}
            alt={`${title} avatar`}
          />
        ) : (
          <div className={styles.avatarFallback}>
            {title.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={styles.headerText}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      <button 
        className={styles.closeButton} 
        onClick={onClose}
        aria-label="Close chat"
      >
       <img src="/public/caret-down.png" alt="" />
      </button>
    </div>
  );
};

export default ChatbotHeader; 