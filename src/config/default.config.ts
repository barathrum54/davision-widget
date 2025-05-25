import type { ThemeConfig, WidgetConfig } from '../types/config.types';

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
  messageColors: {
    user: '#735a3c',
    bot: '#ffffff',
  }
};

export const defaultConfig: WidgetConfig = {
  title: 'Nova',
  subtitle: 'How can I assist you today?',
  placeholder: 'Ask me anything...',
  welcomeMessage: 'Welcome I am Eve, how can I assist you?',
  position: 'bottom-right',
  theme: defaultTheme,
  enableVoice: false,
  enableFileUpload: false,
  maxMessageLength: 500,
  persistMessages: false,
  productCarouselEnabled: true,
  quickReplies: [],
  avatarSrc: '',
  logoSrc: '',
};

export const createConfig = (userConfig?: Partial<WidgetConfig>): WidgetConfig => {
  return {
    ...defaultConfig,
    ...userConfig,
    theme: {
      ...defaultTheme,
      ...userConfig?.theme,
    },
  };
}; 