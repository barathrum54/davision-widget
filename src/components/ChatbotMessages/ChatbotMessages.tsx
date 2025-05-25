import React, { useRef, useEffect } from 'react';
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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={styles.messagesContainer}>
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