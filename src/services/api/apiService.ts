import { analyticsService } from '../analytics/analyticsService';
import type { Product as ChatProduct } from '../../types/chat.types';
import axios from 'axios';

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

// Schema for chat interaction payload based on DB schema
interface ChatInteractionPayload {
  EventType: string;
  ButtonLabel?: string;
  UserAgent?: string;
  ScreenResolution?: string;
  OperatingSystem?: string;
  DeviceType?: string;
  user_text?: string; // The original message from user
}

class ApiService {
  private apiUrl: string = '';
  private corsProxyUrl: string = 'https://cors-anywhere.herokuapp.com/';
  private headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Required by cors-anywhere
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

  // Get the full URL with CORS proxy
  private getProxiedUrl(): string {
    return `${this.corsProxyUrl}${this.apiUrl}`;
  }

  // Debug method to show the exact request that will be made
  debugRequest(text: string): void {
    const payload = this.createPayload(text);
    const proxiedUrl = this.getProxiedUrl();
    
    console.log('Debug request info:');
    console.log('Original URL:', this.apiUrl);
    console.log('Proxied URL:', proxiedUrl);
    console.log('Method: POST');
    console.log('Headers:', this.headers);
    console.log('Body:', JSON.stringify(payload));
    
    // Generate code that can be pasted in the console for testing
    const axiosCode = `
axios.post('${proxiedUrl}', ${JSON.stringify(payload)}, {
  headers: ${JSON.stringify(this.headers)}
})
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Error:', error);
  if (error.response) {
    console.log('Response data:', error.response.data);
    console.log('Response status:', error.response.status);
  }
});
`;
    
    console.log('Copy and paste this code into your browser console to test:');
    console.log(axiosCode);
  }

  private createPayload(text: string): ChatInteractionPayload {
    // Get browser information
    const userAgent = navigator.userAgent;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    
    // Determine OS
    let operatingSystem = "Unknown";
    if (userAgent.indexOf("Win") !== -1) operatingSystem = "Windows";
    else if (userAgent.indexOf("Mac") !== -1) operatingSystem = "MacOS";
    else if (userAgent.indexOf("Linux") !== -1) operatingSystem = "Linux";
    else if (userAgent.indexOf("Android") !== -1) operatingSystem = "Android";
    else if (userAgent.indexOf("iOS") !== -1) operatingSystem = "iOS";
    
    // Determine device type
    let deviceType = "Desktop";
    if (/Mobi|Android/i.test(userAgent)) deviceType = "Mobile";
    else if (/iPad|Tablet/i.test(userAgent)) deviceType = "Tablet";
    
    return {
      EventType: "user_message",
      ButtonLabel: undefined,
      UserAgent: userAgent,
      ScreenResolution: screenResolution,
      OperatingSystem: operatingSystem,
      DeviceType: deviceType,
      user_text: text
    };
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

      // Create the payload matching the database schema
      const payload = this.createPayload(text);
      const proxiedUrl = this.getProxiedUrl();

      console.log('Sending request to:', proxiedUrl);
      console.log('With payload:', payload);

      // Use axios with CORS proxy
      const response = await axios({
        method: 'post',
        url: proxiedUrl,
        data: payload,
        headers: this.headers
      });
      
      const rawData = response.data;
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
      // If we have response data in the error, try to extract it
      if (axios.isAxiosError(error) && error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
      }
      
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