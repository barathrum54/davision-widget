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

  const handleClick = () => {
    console.log("ChatbotButton handleClick");
    setIsClicked(true);

    // Handle resize for both iframe and development contexts
    if (window.parent !== window) {
      // We're in an iframe, use postMessage to parent
      console.log("Button: In iframe, sending postMessage");
      window.parent.postMessage({ type: "CHATBOT_RESIZE", isOpen: true }, "*");
    } else {
      // We're in direct rendering (development), use global function
      console.log("Button: In direct rendering, using global function");
      if ((window as any).handleChatbotResize) {
        console.log("Button: Global function exists, calling with: true");
        (window as any).handleChatbotResize(true);
      } else {
        console.log("Button: Global function does not exist!");
      }
    }

    // Trigger the onClick after a short delay to let the animation start
    setTimeout(() => {
      onClick();
    }, 100);
  };

  // Combine inline styles with CSS modules
  const buttonStyle = {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    position: "fixed" as "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "1000",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
