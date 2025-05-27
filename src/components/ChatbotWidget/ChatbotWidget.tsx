import React, { useState, useRef, useEffect } from "react";
import type { WidgetConfig } from "../../types/config.types";
import { createConfig } from "../../config/default.config";
import { ChatProvider, useGlobalChat } from "../../context/ChatContext";
import styles from "./ChatbotWidget.module.css";

// Components
import ChatbotButton from "../ChatbotButton/ChatbotButton";
import ChatbotHeader from "../ChatbotHeader/ChatbotHeader";
import ChatbotMessages from "../ChatbotMessages/ChatbotMessages";
import ChatbotInput from "../ChatbotInput/ChatbotInput";
import ChatbotFooter from "../ChatbotFooter/ChatbotFooter";
import QuickReplies from "../QuickReplies/QuickReplies";
import OfflineOverlay from "../OfflineOverlay/OfflineOverlay";

// Import styles from ChatbotMessages to access the class name
import messagesStyles from "../ChatbotMessages/ChatbotMessages.module.css";
import { CHAT_BUTTON_ICON, COMPANY_LOGO } from "../../assets/base64Images";

interface ChatbotWidgetProps {
  config?: Partial<WidgetConfig>;
}

const ChatbotWidgetInner: React.FC = () => {
  const {
    messages,
    isOpen,
    isLoading,
    error,
    isOffline,
    sendMessage,
    toggleChat,
    retryMessage,
  } = useGlobalChat();

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContainer, setShowContainer] = useState(false);
  // Flag to prevent immediate close of quick replies
  const preventCloseRef = useRef(false);

  // Handle opening animation
  useEffect(() => {
    if (isOpen && !showContainer) {
      setShowContainer(true);
      setIsAnimating(true);
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 400); // Match animation duration
      return () => clearTimeout(timer);
    } else if (!isOpen && showContainer) {
      setIsAnimating(true);
      // Hide container after closing animation
      const timer = setTimeout(() => {
        setShowContainer(false);
        setIsAnimating(false);
      }, 300); // Slightly shorter for closing
      return () => clearTimeout(timer);
    }
  }, [isOpen, showContainer]);

  // Use effect to adjust the messages container when quick replies visibility changes
  useEffect(() => {
    const messagesContainer = document.querySelector(
      `.${messagesStyles.messagesContainer}`
    );
    if (messagesContainer) {
      // Add a delay to let the drawer open before scrolling
      setTimeout(() => {
        // Scroll to bottom after the height adjustment
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 100); // 100ms delay to match faster animation
    }
  }, [isInputFocused]);

  if (!showContainer) {
    return <ChatbotButton onClick={toggleChat} />;
  }

  // This handler will be called BEFORE blur events due to using mousedown
  const handleReplyClick = (text: string) => {
    preventCloseRef.current = true;
    sendMessage(text);

    setTimeout(() => {
      setIsInputFocused(false);
      setTimeout(() => {
        preventCloseRef.current = false;
      }, 100);
    }, 200);
  };

  const handleSendMessage = async (text: string) => {
    // Close the quick replies drawer when sending a message
    setIsInputFocused(false);

    // Send the message
    await sendMessage(text);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);

    // Scroll messages to the bottom after the drawer opens
    setTimeout(() => {
      const messagesContainer = document.querySelector(
        `.${messagesStyles.messagesContainer}`
      );
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100); // 100ms delay to match faster animation
  };

  const handleInputBlur = () => {
    // Don't close if we're preventing close (from a quick reply click)
    if (!preventCloseRef.current) {
      setTimeout(() => {
        setIsInputFocused(false);
      }, 10);
    }
  };

  // Quick reply data
  const quickReplies = [
    { id: "1", text: "New Collection" },
    { id: "2", text: "Dresses" },
    { id: "3", text: "Spring" },
    { id: "4", text: "Bridal" },
    { id: "5", text: "Resort '24" },
  ];

  return (
    <div
      className={`${styles.container} ${
        isAnimating ? (isOpen ? styles.opening : styles.closing) : ""
      }`}
    >
      <ChatbotHeader
        title="Nova"
        subtitle=""
        avatarSrc={CHAT_BUTTON_ICON}
        onClose={toggleChat}
      />

      <div
        className={`${styles.contentWrapper} ${
          isInputFocused ? styles.withQuickReplies : ""
        }`}
      >
        <ChatbotMessages
          messages={messages}
          isLoading={isLoading}
          error={error}
          onRetry={retryMessage}
        />

        <QuickReplies
          onReplySelected={handleReplyClick}
          replies={quickReplies}
          isVisible={isInputFocused}
        />
      </div>

      <ChatbotInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Mesajınızı yazın..."
        enableVoice={true}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={isOffline}
      />

      <ChatbotFooter logoSrc={COMPANY_LOGO} companyName="Davision" />

      {/* Position the overlay as the last child to cover the entire widget */}
      {isOffline && (
        <div className={styles.overlayContainer}>
          <OfflineOverlay isVisible={true} />
        </div>
      )}
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
