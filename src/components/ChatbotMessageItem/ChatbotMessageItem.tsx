import React from 'react';
import type { Message } from '../../types/chat.types';
import { formatTimestamp } from '../../utils/helpers';
import styles from './ChatbotMessageItem.module.css';
import ProductCarousel from '../ProductCarousel/ProductCarousel';

interface ChatbotMessageItemProps {
  message: Message;
  onRetry?: (messageId: string) => void;
}

const ChatbotMessageItem: React.FC<ChatbotMessageItemProps> = ({ message, onRetry }) => {
  const { text, isUser, status, timestamp, products } = message;
  
  const hasProducts = !isUser && products && products.length > 0;
  const showText = text.trim() !== '';
  
  const messageClasses = [
    styles.message,
    isUser ? styles.userMessage : styles.botMessage,
    status === 'error' ? styles.errorMessage : '',
    hasProducts ? styles.hasProducts : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={messageClasses}>
      {showText && (
        <div className={styles.messageContent}>
          <div className={styles.messageText}>{text}</div>
          {status === 'error' && onRetry && (
            <button 
              className={styles.retryButton} 
              onClick={() => onRetry(message.id)}
              aria-label="Retry sending message"
            >
              <svg 
                viewBox="0 0 24 24" 
                width="16" 
                height="16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" 
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
          {/* <div className={styles.messageTime}>{formatTimestamp(timestamp)}</div> */}
        </div>
      )}
      
      {hasProducts && (
        <div className={styles.productsContainer}>
          <ProductCarousel products={products} />
        </div>
      )}
    </div>
  );
};

export default ChatbotMessageItem; 