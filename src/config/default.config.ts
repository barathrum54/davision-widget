import { WidgetConfig, ThemeConfig } from '../types';

export const defaultTheme: ThemeConfig = {
  primaryColor: '#007bff',
  secondaryColor: '#735a3c',
  backgroundColor: '#f1ece9',
  textColor: '#333333',
  borderRadius: '25px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: {
    small: '12px',
    medium: '14px',
    large: '16px',
  },
};

export const defaultConfig: WidgetConfig = {
  title: 'Chat Assistant',
  subtitle: 'How can I help you today?',
  placeholder: 'Type your message...',
  welcomeMessage: 'Hello! How can I assist you today?2',
  position: 'bottom-right',
  theme: defaultTheme,
  enableVoice: false,
  enableFileUpload: false,
  maxMessageLength: 500,
  persistMessages: true,
}; 