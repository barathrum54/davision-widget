import { analyticsService } from "../analytics/analyticsService";
import type { Product } from "../../types/chat.types";

// Sample static products for product carousel
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Printed Top With Zipper Front And Gold Sequin",
    price: "46,250.00 ₺",
    image: "https://placehold.co/400x500/white/333?text=Product+1",
    link: "#product1",
  },
  {
    id: "2",
    title: "Printed Top With Zipper Front And Gold Sequin",
    price: "46,250.00 ₺",
    image: "https://placehold.co/400x500/green/white?text=Product+2",
    link: "#product2",
  },
  {
    id: "3",
    title: "Evening Gown With Embellishments",
    price: "75,000.00 ₺",
    image: "https://placehold.co/400x500/navy/white?text=Product+3",
    link: "#product3",
  },
  {
    id: "4",
    title: "Casual Summer Dress",
    price: "35,500.00 ₺",
    image: "https://placehold.co/400x500/pink/333?text=Product+4",
    link: "#product4",
  },
  {
    id: "5",
    title: "Elegant Cocktail Dress",
    price: "52,750.00 ₺",
    image: "https://placehold.co/400x500/black/white?text=Product+5",
    link: "#product5",
  },
];

export interface ChatResponse {
  response_type: 0 | 1; // 0 for text, 1 for product carousel
  text: string;
  products?: Product[];
}

class ApiService {
  private apiUrl: string = "";
  private corsProxyUrl: string = "https://cors-anywhere.herokuapp.com/";
  private headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = {
      ...this.headers,
      ...headers,
    };
  }

  async sendMessage(text: string): Promise<ChatResponse> {
    try {
      // Track sending message
      analyticsService.trackEvent({
        eventType: "send_message",
        eventData: { message: text },
      });

      // Simulate API response with 50% chance of product or text response
      const useProducts = Math.random() < 0.5;

      // Create response object
      const response: ChatResponse = {
        response_type: useProducts ? 1 : 0,
        text: useProducts
          ? "Here are some products you might like:"
          : "Hello, how can I help you today?",
      };

      // Add products if it's a product response
      if (useProducts) {
        response.products = SAMPLE_PRODUCTS;
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Track successful response
      analyticsService.trackEvent({
        eventType: "page_view",
        eventData: { responseType: response.response_type },
      });

      return response;
    } catch (error) {
      console.error("Request failed:", error);

      return {
        response_type: 0,
        text: "I'm sorry, I couldn't process your request. Please try again later.",
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
