import React, { useState } from 'react';
import type { WidgetConfig } from '../../types/config.types';
import { createConfig } from '../../config/default.config';
import { ChatProvider, useGlobalChat } from '../../context/ChatContext';
import styles from './ChatbotWidget.module.css';

// Components
import ChatbotButton from '../ChatbotButton/ChatbotButton';
import ChatbotHeader from '../ChatbotHeader/ChatbotHeader';
import ChatbotMessages from '../ChatbotMessages/ChatbotMessages';
import ChatbotInput from '../ChatbotInput/ChatbotInput';
import ChatbotFooter from '../ChatbotFooter/ChatbotFooter';
import QuickReplies from '../QuickReplies/QuickReplies';

interface ChatbotWidgetProps {
  config?: Partial<WidgetConfig>;
}

const ChatbotWidgetInner: React.FC = () => {
  const {
    messages,
    isOpen,
    isLoading,
    error,
    sendMessage,
    toggleChat,
    retryMessage,
  } = useGlobalChat();
  const [isInputFocused, setIsInputFocused] = useState(false);

  if (!isOpen) {
    return <ChatbotButton onClick={toggleChat} />;
  }

  const handleQuickReplySelected = (text: string) => {
    sendMessage(text);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <div className={styles.container}>
      <ChatbotHeader 
        title="Nova" 
        subtitle=""
        avatarSrc='/public/fab-icon.png'
        onClose={toggleChat}
      />
      
      <ChatbotMessages 
        messages={messages}
        isLoading={isLoading}
        error={error}
        onRetry={retryMessage}
      />
      
      <QuickReplies 
        onReplySelected={handleQuickReplySelected}
        replies={[
          { id: '1', text: 'New Collection' },
          { id: '2', text: 'Dresses' },
          { id: '3', text: 'Spring' },
          { id: '4', text: 'Bridal' },
          { id: '5', text: 'Resort \'24' },
        ]}
        isVisible={isInputFocused}
      />
      
      <ChatbotInput 
        onSendMessage={sendMessage}
        isLoading={isLoading}
        placeholder="Mesajınızı yazın..."
        enableVoice={true}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      
      <ChatbotFooter companyName="Davision" />
    </div>
  );
};

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ config = {} }) => {
  const mergedConfig = createConfig(config);

  return (
    <div className={styles.widget}>
      <ChatProvider config={mergedConfig}>
        <ChatbotWidgetInner />
      </ChatProvider>
    </div>
  );
};

export default ChatbotWidget; 