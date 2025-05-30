import React, { useState } from "react";
import styles from "./ChatbotButton.module.css";
import { CHAT_BUTTON_ICON } from "../../assets/base64Images";

interface ChatbotButtonProps {
  onClick: () => void;
  color?: string;
  size?: number;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({
  onClick,
  color = "#0084FF",
  size = 60,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setIsHidden(true); // Hide immediately to prevent visual glitch

    // Handle resize for both iframe and development contexts
    if (window.parent !== window) {
      // We're in an iframe, use postMessage to parent
      window.parent.postMessage({ type: "CHATBOT_RESIZE", isOpen: true }, "*");
    } else {
      // We're in direct rendering (development), use global function
      const globalWindow = window as unknown as {
        handleChatbotResize?: (isOpen: boolean) => void;
      };
      if (globalWindow.handleChatbotResize) {
        globalWindow.handleChatbotResize(true);
      }
    }

    onClick();
  };

  // Combine inline styles with CSS modules
  const buttonStyle = {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    display: isHidden ? "none" : "flex", // Hide when clicked
  };

  return (
    <button
      className={`${styles.button} ${isClicked ? styles.buttonClicked : ""}`}
      style={buttonStyle}
      onClick={handleClick}
      aria-label="Open chat"
    >
      <div className={styles.buttonIcon}>
        <img src={CHAT_BUTTON_ICON} alt="" />
      </div>
    </button>
  );
};

export default ChatbotButton;
