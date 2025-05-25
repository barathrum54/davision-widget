import type { Message, Product } from '../../types/chat.types';
import { analyticsService } from '../analytics/analyticsService';

interface ApiResponse {
  response_type: 0 | 1;
  text?: string;
  products?: Product[];
}

interface ChatResponse {
  text: string;
  products?: Product[];
  response_type: 0 | 1;
}

export interface ChatServiceConfig {
  apiEndpoint?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  analyticsEndpoint?: string;
}

export class ChatService {
  private config: ChatServiceConfig;

  constructor(config: ChatServiceConfig = {}) {
    this.config = config;
    
    // Set analytics endpoint if provided
    if (config.analyticsEndpoint) {
      analyticsService.setApiEndpoint(config.analyticsEndpoint);
    }
  }

  async sendMessage(text: string): Promise<ChatResponse> {
    // Track message send event
    analyticsService.trackEvent({
      eventType: 'send_message',
      eventData: { message: text }
    });

    // If no API endpoint is provided, return a mock response
    if (!this.config.apiEndpoint) {
      return this.getMockResponse(text);
    }

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
          ...this.config.headers,
        },
        body: JSON.stringify({
          user_text: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      
      // Process API response based on response_type
      return this.processApiResponse(apiResponse, text);
    } catch (error) {
      console.error('Error sending message to API:', error);
      throw error;
    }
  }

  private processApiResponse(apiResponse: ApiResponse, originalText: string): ChatResponse {
    // Handle response based on response_type
    if (apiResponse.response_type === 1) {
      // Response with product carousel
      return {
        response_type: 1,
        text: apiResponse.text || 'Here are some products you might like:',
        products: apiResponse.products || this.getDefaultProducts(),
      };
    } else {
      // Simple text response
      return {
        response_type: 0,
        text: apiResponse.text || 'Hello',
      };
    }
  }

  // Mock response for demo purposes or when API endpoint is not provided
  private getMockResponse(text: string): Promise<ChatResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different response types based on the message content
        if (text.toLowerCase().includes('product') || text.toLowerCase().includes('dress')) {
          resolve({
            response_type: 1,
            text: 'Here are some products you might like:',
            products: this.getDefaultProducts(),
          });
        } else {
          resolve({
            response_type: 0,
            text: `Hello`,
          });
        }
      }, 1000);
    });
  }

  private getDefaultProducts(): Product[] {
    return [
      {
        id: '1',
        title: 'Printed Top With Zipper Front',
        price: '46,250.00 ₺',
        image: '/davision-logo.svg',
        link: '#product1',
      },
      {
        id: '2',
        title: 'Halter Neck Ruffled Maxi Dress',
        price: '98,050.00 TL',
        image: '/davision-logo.svg',
        link: '#product2',
      },
      {
        id: '3',
        title: 'Elegant Evening Gown',
        price: '125,750.00 TL',
        image: '/davision-logo.svg',
        link: '#product3',
      },
    ];
  }
} 