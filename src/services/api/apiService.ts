import { analyticsService } from '../analytics/analyticsService';
import type { Product as ChatProduct } from '../../types/chat.types';

export interface ChatResponse {
  response_type: 0 | 1;  // 0 for text, 1 for product carousel
  text: string;
  products?: ChatProduct[];
}

// Convert API product to chat product
export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  image_url: string;
  description?: string;
  url?: string;
}

class ApiService {
  private apiUrl: string = 'https://yztksvq2kbbnkrlkroeapqneim0mvaco.lambda-url.us-west-2.on.aws/process_text';
  private headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = {
      ...this.headers,
      ...headers
    };
  }

  async sendMessage(text: string): Promise<ChatResponse> {
    try {
      // Track sending message
      analyticsService.trackEvent({
        eventType: 'send_message',
        eventData: { message: text }
      });

      // Create the payload
      const payload = {
        user_text: text
      };

      // Send the request with CORS mode
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
        mode: 'cors', // Add CORS mode to handle cross-origin requests
        credentials: 'omit' // Don't send cookies
      });

      if (!response.ok) {
        console.error('API Error:', response.status, await response.text());
        throw new Error(`API Error: ${response.status}`);
      }

      // Parse the response
      const data = await response.json();
      
      // Track successful response
      analyticsService.trackEvent({
        eventType: 'page_view',
        eventData: { responseType: data.response_type }
      });
      
      // Convert API products to chat products if present
      if (data.products && Array.isArray(data.products)) {
        data.products = data.products.map(this.convertApiProductToChatProduct);
      }
      
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Return a fallback response
      return {
        response_type: 0,
        text: "I'm sorry, I couldn't process your request. Please try again later."
      };
    }
  }
  
  // Convert API product format to chat product format
  private convertApiProductToChatProduct(apiProduct: ApiProduct): ChatProduct {
    return {
      id: apiProduct.id,
      title: apiProduct.name,
      price: `${apiProduct.price} ${apiProduct.currency}`,
      image: apiProduct.image_url,
      link: apiProduct.url || '#',
    };
  }

  // Helper method for database connection params (if needed)
  getDatabaseConfig() {
    return {
      host: 'database-2.cb80kkgiclig.us-west-2.rds.amazonaws.com',
      user: 'taha',
      password: '*re6rOz8StOh+6IXoha#',
      database: 'tahaDatabase'
    };
  }
}

// Export singleton instance
export const apiService = new ApiService(); 