import React from 'react';
import styles from './ChatbotFooter.module.css';

interface ChatbotFooterProps {
  logoSrc?: string;
  companyName?: string;
}

const ChatbotFooter: React.FC<ChatbotFooterProps> = ({
  logoSrc,
  companyName = 'Davision',
}) => {
  return (
    <div className={styles.footer}>
      <span className={styles.poweredBy}>Powered by</span>
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={`${companyName} logo`}
          className={styles.logo}
        />
      ) : (
        <span className={styles.companyName}>{companyName}</span>
      )}
    </div>
  );
};

export default ChatbotFooter; 