import { analyticsService } from '../analytics/analyticsService';
import type { Product as ChatProduct } from '../../types/chat.types';

export interface ChatResponse {
  response_type: 0 | 1;  // 0 for text, 1 for product carousel
  text?: string;
  message?: string;  // Alternative field name from Lambda
  response?: string; // Another alternative field name
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
  private apiUrl: string = '';
  private headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  setApiUrl(url: string): void {
    this.apiUrl = url;
    console.log('API URL set to:', url);
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = {
      ...this.headers,
      ...headers
    };
    console.log('Headers set to:', this.headers);
  }

  // Debug method to show the exact request that will be made
  debugRequest(text: string): void {
    const payload = { user_text: text };
    
    console.log('Debug request info:');
    console.log('URL:', this.apiUrl);
    console.log('Method: POST');
    console.log('Headers:', {
      'content-type': 'application/json',
      'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    });
    console.log('Body:', JSON.stringify(payload));
    console.log('Mode: cors');
    console.log('Credentials: omit');
    
    // Generate code that can be pasted in the console
    const fetchCode = `
fetch("${this.apiUrl}", {
  headers: {
    "content-type": "application/json",
    "sec-ch-ua": '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"'
  },
  referrerPolicy: "strict-origin-when-cross-origin",
  body: '${JSON.stringify(payload)}',
  method: "POST",
  mode: "cors",
  credentials: "omit"
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
`;
    
    console.log('Copy and paste this code into your browser console to test:');
    console.log(fetchCode);
  }

  async sendMessage(text: string): Promise<ChatResponse> {
    // Debug the request first
    this.debugRequest(text);
    
    try {
      // Track sending message
      analyticsService.trackEvent({
        eventType: 'send_message',
        eventData: { message: text }
      });

      // Create the payload exactly as in the Python example
      const payload = {
        user_text: text
      };

      console.log('Sending request to:', this.apiUrl);
      console.log('With payload:', payload);

      // Send the request with CORS mode - exactly matching the working pattern
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"'
        },
        body: JSON.stringify(payload),
        referrerPolicy: 'strict-origin-when-cross-origin',
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`API Error: ${response.status}`);
      }

      // Parse the response
      const rawData = await response.json();
      console.log('Received raw response:', rawData);
      
      // Normalize the response format - the Lambda may return a different structure
      const data: ChatResponse = {
        response_type: 0,  // Default to text response
        text: '',          // Default empty text
        products: []       // Default empty products
      };
      
      // If the response has a text field, use it
      if (typeof rawData.text === 'string') {
        data.text = rawData.text;
      } 
      // Otherwise check for message or response fields
      else if (typeof rawData.message === 'string') {
        data.text = rawData.message;
      }
      else if (typeof rawData.response === 'string') {
        data.text = rawData.response;
      }
      // If we have no text field, convert the whole response to string
      else {
        data.text = JSON.stringify(rawData);
      }
      
      // If there's a response_type field, use it
      if (typeof rawData.response_type === 'number') {
        data.response_type = rawData.response_type;
      }
      
      // If there are products, use them
      if (Array.isArray(rawData.products)) {
        data.products = rawData.products.map(this.convertApiProductToChatProduct);
      }
      
      console.log('Normalized response:', data);
      
      // Track successful response
      analyticsService.trackEvent({
        eventType: 'page_view',
        eventData: { responseType: data.response_type }
      });
      
      return data;
    } catch (error) {
      console.error('Request failed:', error);
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
}

// Export singleton instance
export const apiService = new ApiService(); 