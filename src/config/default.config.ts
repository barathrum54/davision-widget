import type { ThemeConfig, WidgetConfig } from "../types/config.types";
import { ChatService } from "../services/api/chatService";

export const defaultTheme: ThemeConfig = {
  primaryColor: "#007bff",
  secondaryColor: "#735a3c",
  backgroundColor: "#f1ece9",
  textColor: "#333333",
  borderRadius: "25px",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: {
    small: "12px",
    medium: "14px",
    large: "16px",
  },
  messageColors: {
    user: "#735a3c",
    bot: "#ffffff",
  },
};

export const defaultConfig: WidgetConfig = {
  title: "Nova",
  subtitle: "How can I assist you today?",
  placeholder: "Ask me anything...",
  welcomeMessage: "Welcome I am Eve, how can I assist you?",
  position: "bottom-right",
  theme: defaultTheme,
  useProxy: true,
  enableVoice: false,
  enableFileUpload: false,
  maxMessageLength: 500,
  persistMessages: false,
  productCarouselEnabled: true,
  quickReplies: [],
  avatarSrc: "",
  logoSrc: "",
};

let chatService: ChatService;

export const createConfig = (
  userConfig: Partial<WidgetConfig> = {}
): WidgetConfig => {
  const config = { ...defaultConfig, ...userConfig };

  // Initialize chat service with API configuration including proxy options
  chatService = new ChatService({
    apiEndpoint: config.apiEndpoint,
    apiKey: config.apiKey,
    headers: config.headers,
    analyticsEndpoint: config.analyticsEndpoint,
    corsProxy: config.corsProxy,
    useProxy: config.useProxy,
  });

  return {
    ...config,
    theme: {
      ...defaultTheme,
      ...config.theme,
    },
  };
};
