import React, { useState } from 'react';
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
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
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
  
  // Limit to 5 quick replies
  const displayReplies = replies.slice(0, 5);
  
  return (
    <div className={`${styles.quickRepliesContainer} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.quickRepliesHeader} onClick={toggleCollapsed}>
        <span>Quick Questions</span>
        <div className={styles.caretIcon}>
          <img src="/caret-down.png" alt="Quick Questions" />
        </div>
      </div>
      <div className={styles.quickRepliesList}>
        {displayReplies.map((reply) => (
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