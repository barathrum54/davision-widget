import type { Product } from "../../types/chat.types";
import { analyticsService } from "../analytics/analyticsService";
import { apiService } from "./apiService";

interface ChatResponse {
  text: string;
  products?: Product[];
  response_type: 0 | 1;
  shouldSendFollowUp?: boolean;
}

export interface ChatServiceConfig {
  apiEndpoint?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  analyticsEndpoint?: string;
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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.headers) {
      Object.assign(headers, config.headers);
    }

    apiService.setHeaders(headers);
  }

  async sendMessage(text: string): Promise<ChatResponse> {
    try {
      // Get response from API service
      const response = await apiService.sendMessage(text);

      // Add shouldSendFollowUp flag for potential future use
      const chatResponse: ChatResponse = {
        ...response,
        text: response.text || "Hello",
        shouldSendFollowUp: false,
      };

      // Log for debugging

      return chatResponse;
    } catch (error) {
      console.error("Error in chatService.sendMessage:", error);

      // Return default error response
      return {
        response_type: 0,
        text: "I'm sorry, I couldn't process your request. Please try again later.",
      };
    }
  }
}
