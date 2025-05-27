import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import styles from "./ChatbotInput.module.css";
import { SEND_ICON, MICROPHONE_ICON } from "../../assets/base64Images";

// Add SpeechRecognition type definitions
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

interface ChatbotInputProps {
  onSendMessage: (text: string, buttonLabel?: string) => Promise<void>;
  placeholder?: string;
  maxLength?: number;
  enableVoice?: boolean;
  isLoading?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}

const ChatbotInput: React.FC<ChatbotInputProps> = ({
  onSendMessage,
  placeholder = "Ask me anything...",
  maxLength = 500,
  enableVoice = false,
  isLoading = false,
  onFocus,
  onBlur,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [inputMethod, setInputMethod] = useState<"keyboard" | "voice" | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (enableVoice) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "tr-TR";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessage((prevMessage) => {
            // Append to existing message if there's already text
            return prevMessage ? `${prevMessage} ${transcript}` : transcript;
          });
          setInputMethod("voice"); // Mark as voice input
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [enableVoice]);

  const handleSend = async (
    sendMethod: "ui_submit" | "keyboard_enter" = "ui_submit"
  ) => {
    if (message.trim() && !isLoading) {
      const trimmedMessage = message.trim();

      // Determine button label based on input method and send method
      let buttonLabel: string;
      if (inputMethod === "voice") {
        buttonLabel = "voice_button";
      } else if (sendMethod === "keyboard_enter") {
        buttonLabel = "keyboard_enter";
      } else {
        buttonLabel = "ui_submit";
      }

      console.log("ChatbotInput handleSend:", {
        trimmedMessage,
        buttonLabel,
        inputMethod,
        sendMethod,
      });

      setMessage("");
      setInputMethod(null); // Reset input method

      // Explicitly blur the input to remove focus
      if (inputRef.current) {
        inputRef.current.blur();
      }

      await onSendMessage(trimmedMessage, buttonLabel);

      // Don't re-focus after sending
      /*
      if (inputRef.current) {
        inputRef.current.focus();
      }
      */
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend("keyboard_enter");

      // Ensure focus is removed when sending via Enter key
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, maxLength);
    setMessage(newValue);

    // If user is typing and it's not from voice, mark as keyboard input
    if (newValue && inputMethod !== "voice") {
      setInputMethod("keyboard");
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "tr-TR";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessage((prevMessage) => {
            return prevMessage ? `${prevMessage} ${transcript}` : transcript;
          });
          setInputMethod("voice"); // Mark as voice input
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        alert("Speech recognition is not supported in your browser.");
        return;
      }
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition error:", error);
      }
    }
  };

  const handleInputFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleInputBlur = () => {
    if (onBlur) {
      onBlur();
    }
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
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          aria-label="Message input"
          disabled={isLoading || disabled}
        />
        {maxLength && message.length > 0 && (
          <div className={styles.charCount}>
            {message.length}/{maxLength}
          </div>
        )}
        <button
          className={styles.sendButton}
          onClick={() => handleSend()}
          disabled={!message.trim() || isLoading || disabled}
          aria-label="Send message"
        >
          <img src={SEND_ICON} alt="Send" width="20" height="20" />
        </button>
      </div>

      {enableVoice && (
        <button
          className={`${styles.voiceButton} ${
            isListening ? styles.listening : ""
          }`}
          onClick={handleVoiceInput}
          aria-label="Voice input"
        >
          <img src={MICROPHONE_ICON} alt="Microphone" width="16" height="16" />
        </button>
      )}
    </div>
  );
};

export default ChatbotInput;
