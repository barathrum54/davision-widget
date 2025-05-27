import { analyticsService } from "../analytics/analyticsService";
import { apiService, type ChatResponse as ApiChatResponse } from "./apiService";

interface ChatResponse extends ApiChatResponse {
  shouldSendFollowUp?: boolean;
}

export interface ChatServiceConfig {
  apiEndpoint?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  analyticsEndpoint?: string;
  corsProxy?: string;
  useProxy?: boolean;
}

const DEFAULT_API_ENDPOINT =
  "https://yztksvq2kbbnkrlkroeapqneim0mvaco.lambda-url.us-west-2.on.aws/process_text";

export class ChatService {
  private config: ChatServiceConfig;

  constructor(config: ChatServiceConfig = {}) {
    this.config = config;

    if (config.analyticsEndpoint) {
      analyticsService.setApiEndpoint(config.analyticsEndpoint);
    }

    if (config.apiEndpoint) {
      apiService.setApiUrl(config.apiEndpoint);
    } else {
      apiService.setApiUrl(DEFAULT_API_ENDPOINT);
    }

    // Configure CORS proxy if provided
    if (config.corsProxy) {
      apiService.setCorsProxy(config.corsProxy);
    }

    if (config.useProxy !== undefined) {
      apiService.setUseProxy(config.useProxy);
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.headers) {
      Object.assign(headers, config.headers);
    }

    apiService.setHeaders(headers);
  }

  async sendMessage(text: string, buttonLabel?: string): Promise<ChatResponse> {
    // Track sending message
    analyticsService.trackEvent({
      eventType: "send_message",
      eventData: { message: text, buttonLabel },
    });

    try {
      // Get response from API service
      const response = await apiService.sendMessage(text, buttonLabel);

      // Track successful response
      analyticsService.trackEvent({
        eventType: "send_message",
        eventData: { responseType: response.response_type || 0, success: true },
      });

      // Add shouldSendFollowUp flag for potential future use
      const chatResponse: ChatResponse = {
        ...response,
        text: response.text || "Hello",
        shouldSendFollowUp: false,
      };

      return chatResponse;
    } catch (error) {
      // Track failed response
      analyticsService.trackEvent({
        eventType: "send_message",
        eventData: {
          buttonLabel,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });

      // Re-throw error to be handled by useChat hook
      throw error;
    }
  }
}
