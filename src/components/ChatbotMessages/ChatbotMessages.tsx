import React, { useRef, useEffect, useState } from 'react';
import type { Message } from '../../types/chat.types';
import ChatbotMessageItem from '../ChatbotMessageItem/ChatbotMessageItem';
import styles from './ChatbotMessages.module.css';

interface ChatbotMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  error: string | null;
  onRetry: (messageId: string) => void;
}

const ChatbotMessages: React.FC<ChatbotMessagesProps> = ({
  messages,
  isLoading = false,
  error,
  onRetry,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle scroll event to show/hide scrollbar
  const handleScroll = () => {
    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set new timeout to hide scrollbar after scrolling stops
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
      scrollTimeoutRef.current = null;
    }, 1000);
  };

  return (
    <div 
      className={`${styles.messagesContainer} ${isScrolling ? styles.scrolling : ''}`}
      onScroll={handleScroll}
      ref={messagesContainerRef}
    >
      <div className={styles.messages}>
        {messages.map((message) => (
          <ChatbotMessageItem
            key={message.id}
            message={message}
            onRetry={onRetry}
          />
        ))}
        
        {isLoading && (
          <div className={styles.typingIndicator}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        )}
        
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorMessage}>{error}</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatbotMessages; 