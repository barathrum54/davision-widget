import type { Message, Product } from '../../types/chat.types';
import { analyticsService } from '../analytics/analyticsService';
import { apiService } from './apiService';
import { COMPANY_LOGO } from '../../assets/base64Images';

interface ApiResponse {
  response_type: 0 | 1;
  text?: string;
  products?: Product[];
}

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

const DEFAULT_API_ENDPOINT = 'https://yztksvq2kbbnkrlkroeapqneim0mvaco.lambda-url.us-west-2.on.aws/process_text';

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
      'Content-Type': 'application/json',
    };
    
    
    if (config.headers) {
      Object.assign(headers, config.headers);
    }
    
    apiService.setHeaders(headers);
  }

  async sendMessage(text: string): Promise<ChatResponse> {
    try {
      const lowerText = text.trim().toLowerCase();
      if (lowerText === 'products' || lowerText.includes('dress')) {
        return this.getProductsResponse();
      }
      
      const response = await apiService.sendMessage(text);
      
      // The apiService now normalizes the response, so we just need to add shouldSendFollowUp if needed
      const chatResponse: ChatResponse = {
        ...response,
        text: response.text || 'Hello',
        shouldSendFollowUp: false
      };
      
      // Log for debugging
      console.log("Final chat response:", chatResponse);
      
      return chatResponse;
    } catch (error) {
      console.error("Error in chatService.sendMessage:", error);
      return this.getMockResponse(text);
    }
  }

  private getProductsResponse(): ChatResponse {
    return {
      response_type: 1,
      text: '',
      products: this.getRealProductsWithImages(),
      shouldSendFollowUp: true,
    };
  }

  private getMockResponse(text: string): Promise<ChatResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
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

  private getRealProductsWithImages(): Product[] {
    return [
      {
        id: '1',
        title: 'Printed Top With Zipper Front And Gold Sequin',
        price: '46,250.00 ₺',
        image: 'https://placehold.co/400x500/white/333?text=Product+1',
        link: '#product1',
      },
      {
        id: '2',
        title: 'Printed Top With Zipper Front And Gold Sequin',
        price: '46,250.00 ₺',
        image: 'https://placehold.co/400x500/green/white?text=Product+2',
        link: '#product2',
      },
      {
        id: '3',
        title: 'Evening Gown With Embellishments',
        price: '75,000.00 ₺',
        image: 'https://placehold.co/400x500/navy/white?text=Product+3',
        link: '#product3',
      },
      {
        id: '4',
        title: 'Casual Summer Dress',
        price: '35,500.00 ₺',
        image: 'https://placehold.co/400x500/pink/333?text=Product+4',
        link: '#product4',
      },
      {
        id: '5',
        title: 'Elegant Cocktail Dress',
        price: '52,750.00 ₺',
        image: 'https://placehold.co/400x500/black/white?text=Product+5',
        link: '#product5',
      },
    ];
  }

  private getDefaultProducts(): Product[] {
    return [
      {
        id: '1',
        title: 'Printed Top With Zipper Front',
        price: '46,250.00 ₺',
        image: COMPANY_LOGO,
        link: '#product1',
      },
      {
        id: '2',
        title: 'Halter Neck Ruffled Maxi Dress',
        price: '98,050.00 TL',
        image: COMPANY_LOGO,
        link: '#product2',
      },
      {
        id: '3',
        title: 'Elegant Evening Gown',
        price: '125,750.00 TL',
        image: COMPANY_LOGO,
        link: '#product3',
      },
    ];
  }
} 