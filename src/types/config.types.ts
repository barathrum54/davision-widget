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
}

export interface WidgetConfig {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  welcomeMessage?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: Partial<ThemeConfig>;
  apiEndpoint?: string;
  enableVoice?: boolean;
  enableFileUpload?: boolean;
  maxMessageLength?: number;
  persistMessages?: boolean;
  customStyles?: Record<string, any>;
} 