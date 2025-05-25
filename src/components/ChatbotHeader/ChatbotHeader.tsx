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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatbotHeader; 