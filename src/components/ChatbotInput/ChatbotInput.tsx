import React, { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './ChatbotInput.module.css';

interface ChatbotInputProps {
  onSendMessage: (text: string) => Promise<void>;
  placeholder?: string;
  maxLength?: number;
  enableVoice?: boolean;
  isLoading?: boolean;
}

const ChatbotInput: React.FC<ChatbotInputProps> = ({
  onSendMessage,
  placeholder = 'Type your message...',
  maxLength = 500,
  enableVoice = false,
  isLoading = false,
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      const trimmedMessage = message.trim();
      setMessage('');
      await onSendMessage(trimmedMessage);
      
      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    // Placeholder for voice input functionality
    alert('Voice input feature is not implemented yet.');
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
          disabled={isLoading}
        />
        {maxLength && message.length > 0 && (
          <div className={styles.charCount}>
            {message.length}/{maxLength}
          </div>
        )}
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          aria-label="Send message"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      
      {enableVoice && (
        <button
          className={styles.voiceButton}
          onClick={handleVoiceInput}
          aria-label="Voice input"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM17.3 11C17.3 14 14.76 16.1 12 16.1C9.24 16.1 6.7 14 6.7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C16.28 17.23 19 14.41 19 11H17.3Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatbotInput; 