import React from 'react';
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

  if (!isOpen) {
    return <ChatbotButton onClick={toggleChat} />;
  }

  // Handler for quick reply selections
  const handleQuickReplySelected = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className={styles.container}>
      <ChatbotHeader 
        title="Nova" 
        subtitle="How can I help you today?"
        onClose={toggleChat}
      />
      
      <ChatbotMessages 
        messages={messages}
        isLoading={isLoading}
        error={error}
        onRetry={retryMessage}
      />
      
      <QuickReplies
        replies={[
          { id: '1', text: 'What products do you have?' },
          { id: '2', text: 'How can I order?' },
          { id: '3', text: 'What is your return policy?' },
          { id: '4', text: 'Where is my order?' },
          { id: '5', text: 'Contact customer service' }
        ]}
        onReplySelected={handleQuickReplySelected}
      />
      
      <ChatbotInput 
        onSendMessage={sendMessage}
        isLoading={isLoading}
        placeholder="Ask me anything..."
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