import React from 'react';
import styles from './QuickReplies.module.css';
import { analyticsService } from '../../services/analytics/analyticsService';

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
  { id: '1', text: 'New Collection' },
  { id: '2', text: 'Dresses' },
  { id: '3', text: 'Spring' },
  { id: '4', text: 'Bridal' },
  { id: '5', text: 'Resort \'24' },
];

const QuickReplies: React.FC<QuickRepliesProps> = ({ 
  replies = DEFAULT_QUICK_REPLIES,
  onReplySelected,
  isVisible = true
}) => {
  const handleReplyClick = (reply: QuickReply) => {
    // Track quick reply click
    analyticsService.trackEvent({
      eventType: 'click_quick_reply',
      eventData: { 
        replyId: reply.id,
        replyText: reply.text
      }
    });
    
    // Send the reply text to the chat
    onReplySelected(reply.text);
  };
  
  // First row: buttons 0, 1 (if available)
  const firstRowButtons = replies.slice(0, 2);
  // Second row: buttons 2, 3, 4 (if available)
  const secondRowButtons = replies.slice(2, 5);
  
  return (
    <div className={`${styles.quickRepliesContainer} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.quickRepliesRow}>
        {firstRowButtons.map((reply) => (
          <button
            key={reply.id}
            className={styles.quickReplyButton}
            onClick={() => handleReplyClick(reply)}
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
              onClick={() => handleReplyClick(reply)}
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