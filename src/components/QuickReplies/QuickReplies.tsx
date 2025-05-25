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
}

const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  { id: '1', text: 'What products do you have?' },
  { id: '2', text: 'How can I order?' },
  { id: '3', text: 'What is your return policy?' },
  { id: '4', text: 'Where is my order?' },
  { id: '5', text: 'Contact customer service' },
];

const QuickReplies: React.FC<QuickRepliesProps> = ({ 
  replies = DEFAULT_QUICK_REPLIES,
  onReplySelected 
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
  
  return (
    <div className={styles.quickRepliesContainer}>
      <div className={styles.quickRepliesHeader}>
        <span>Quick Questions</span>
        <div className={styles.caretIcon}>
          <img src="/caret-down.png" alt="Quick Questions" />
        </div>
      </div>
      <div className={styles.quickRepliesList}>
        {replies.slice(0, 5).map((reply) => (
          <button
            key={reply.id}
            className={styles.quickReplyButton}
            onClick={() => handleReplyClick(reply)}
          >
            {reply.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies; 