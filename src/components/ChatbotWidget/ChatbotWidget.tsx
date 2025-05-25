import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useChat } from '../../hooks/useChat';
import { WidgetConfig } from '../../types';
import { createTheme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import ChatbotButton from '../ChatbotButton';
import ChatbotHeader from '../ChatbotHeader';
import ChatbotMessages from '../ChatbotMessages';
import ChatbotInput from '../ChatbotInput';
import ChatbotFooter from '../ChatbotFooter';
import { WidgetContainer, ChatContainer } from './ChatbotWidget.styles';

interface ChatbotWidgetProps {
  config?: WidgetConfig;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ config = {} }) => {
  const theme = createTheme(config.theme);
  const chat = useChat(config.persistMessages);

  // Send welcome message on first open
  useEffect(() => {
    if (chat.isOpen && chat.messages.length === 0 && config.welcomeMessage) {
      setTimeout(() => {
        chat.sendMessage('__WELCOME__'); // Special flag for welcome message
      }, 500);
    }
  }, [chat.isOpen]);

  return (
    <ThemeProvider theme={theme}>
      <WidgetContainer position={config.position || 'bottom-right'}>
        <style>{globalStyles}</style>
        
        {!chat.isOpen ? (
          <ChatbotButton onClick={chat.toggleChat} />
        ) : (
          <ChatContainer>
            <ChatbotHeader 
              title={config.title || 'Chat Assistant'}
              onClose={chat.toggleChat}
            />
            
            <ChatbotMessages 
              messages={chat.messages}
              isLoading={chat.isLoading}
              error={chat.error}
              onRetry={chat.retryMessage}
            />
            
            <ChatbotInput
              placeholder={config.placeholder || 'Type your message...'}
              onSendMessage={chat.sendMessage}
              maxLength={config.maxMessageLength}
              enableVoice={config.enableVoice}
            />
            
            <ChatbotFooter />
          </ChatContainer>
        )}
      </WidgetContainer>
    </ThemeProvider>
  );
};

export default ChatbotWidget; 