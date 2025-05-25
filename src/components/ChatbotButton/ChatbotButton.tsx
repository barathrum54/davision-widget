import React from 'react';
import { ButtonContainer, ButtonIcon } from './ChatbotButton.styles';
import { ChatIcon } from '../../assets/icons';

interface ChatbotButtonProps {
  onClick: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => {
  return (
    <ButtonContainer
      onClick={onClick}
      aria-label="Open chat"
      role="button"
      tabIndex={0}
    >
      <ButtonIcon>
        <ChatIcon />
      </ButtonIcon>
    </ButtonContainer>
  );
};

export default ChatbotButton; 