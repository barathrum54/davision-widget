export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
  };
  messageColors: {
    user: string;
    bot: string;
  };
}

export interface WidgetConfig {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  welcomeMessage?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: Partial<ThemeConfig>;
  apiEndpoint?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  enableVoice?: boolean;
  enableFileUpload?: boolean;
  maxMessageLength?: number;
  persistMessages?: boolean;
  customStyles?: Record<string, any>;
  productCarouselEnabled?: boolean;
  quickReplies?: QuickReply[];
  avatarSrc?: string;
  logoSrc?: string;
}

export interface QuickReply {
  id: string;
  text: string;
} 