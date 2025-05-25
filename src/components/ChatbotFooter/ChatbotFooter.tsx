import React from 'react';
import styles from './ChatbotFooter.module.css';

interface ChatbotFooterProps {
  logoSrc?: string;
  companyName?: string;
}

const ChatbotFooter: React.FC<ChatbotFooterProps> = ({
  logoSrc = '/davision-logo.svg',
  companyName = 'Davision',
}) => {
  return (
    <div className={styles.footer}>
      <span className={styles.poweredBy}>Powered by</span>
      <img
        src={logoSrc}
        alt={`${companyName} logo`}
        className={styles.logo}
      />
    </div>
  );
};

export default ChatbotFooter; 