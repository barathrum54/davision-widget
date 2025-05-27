import React from "react";
import styles from "./QuickReplies.module.css";
import { analyticsService } from "../../services/analytics/analyticsService";

export interface QuickReply {
  id: string;
  text: string;
}

interface QuickRepliesProps {
  replies: QuickReply[];
  onReplySelected: (text: string) => void;
  isVisible?: boolean;
}

const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  { id: "1", text: "New Collection" },
  { id: "2", text: "Dresses" },
  { id: "3", text: "Spring" },
  { id: "4", text: "Bridal" },
  { id: "5", text: "Resort '24" },
];

const QuickReplies: React.FC<QuickRepliesProps> = ({
  replies = DEFAULT_QUICK_REPLIES,
  onReplySelected,
  isVisible = true,
}) => {
  // First row: buttons 0, 1 (if available)
  const firstRowButtons = replies.slice(0, 2);
  // Second row: buttons 2, 3, 4 (if available)
  const secondRowButtons = replies.slice(2, 5);

  // Function to handle button clicks
  // Using mousedown instead of click to happen BEFORE any blur events
  function handleButtonMouseDown(
    e: React.MouseEvent,
    text: string,
    id: string
  ) {
    // Prevent default to avoid focus changes
    e.preventDefault();

    // Track the click
    analyticsService.trackEvent({
      eventType: "click_quick_reply",
      eventData: {
        replyId: id,
        replyText: text,
      },
    });

    // Immediately call the callback - this happens before blur events
    onReplySelected(text);

    // Return false to prevent any other events
    return false;
  }

  return (
    <div
      className={`${styles.quickRepliesContainer} ${
        isVisible ? styles.visible : ""
      }`}
    >
      <div className={styles.quickRepliesRow}>
        {firstRowButtons.map((reply) => (
          <button
            key={reply.id}
            className={styles.quickReplyButton}
            type="button"
            onMouseDown={(e) => handleButtonMouseDown(e, reply.text, reply.id)}
            // Disable click to avoid race conditions
            onClick={(e) => e.preventDefault()}
          >
            {reply.text}
          </button>
        ))}
      </div>

      {secondRowButtons.length > 0 && (
        <div className={styles.quickRepliesRow}>
          {secondRowButtons.map((reply) => (
            <button
              key={reply.id}
              className={styles.quickReplyButton}
              type="button"
              onMouseDown={(e) =>
                handleButtonMouseDown(e, reply.text, reply.id)
              }
              // Disable click to avoid race conditions
              onClick={(e) => e.preventDefault()}
            >
              {reply.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickReplies;
