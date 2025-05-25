import React from 'react';
import styles from './ChatbotFooter.module.css';
import { COMPANY_LOGO } from '../../assets/base64Images';

interface ChatbotFooterProps {
  logoSrc?: string;
  companyName?: string;
}

const ChatbotFooter: React.FC<ChatbotFooterProps> = ({
  logoSrc = COMPANY_LOGO,
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