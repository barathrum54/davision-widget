import type { Product } from "../../types/chat.types";

// Sample static products for product carousel (fallback only)
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

/**
 * Comprehensive request logger for debugging API calls
 */
class RequestLogger {
  private static logRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: unknown
  ) {
    console.group(`🚀 API REQUEST - ${method.toUpperCase()}`);
    console.log(`📍 URL: ${url}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

    console.group("📋 Headers");
    Object.entries(headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    console.groupEnd();

    if (body) {
      console.group("📦 Request Body");
      console.log("Raw Body:", body);
      try {
        if (typeof body === "string") {
          const parsed = JSON.parse(body);
          console.log("Parsed JSON:", parsed);
          console.log("Formatted JSON:", JSON.stringify(parsed, null, 2));
        } else {
          console.log("Body Object:", body);
          console.log("Formatted JSON:", JSON.stringify(body, null, 2));
        }
      } catch {
        console.log("Body (not JSON):", body);
      }
      console.groupEnd();
    }

    console.groupEnd();
  }

  private static logResponse(
    url: string,
    status: number,
    statusText: string,
    headers: Headers,
    responseData: unknown,
    duration: number
  ) {
    const isSuccess = status >= 200 && status < 300;
    const emoji = isSuccess ? "✅" : "❌";

    console.group(`${emoji} API RESPONSE - ${status} ${statusText}`);
    console.log(`📍 URL: ${url}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`📊 Status: ${status} ${statusText}`);

    console.group("📋 Response Headers");
    headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    console.groupEnd();

    console.group("📦 Response Data");
    console.log("Raw Response:", responseData);
    try {
      if (typeof responseData === "string") {
        const parsed = JSON.parse(responseData);
        console.log("Parsed JSON:", parsed);
        console.log("Formatted JSON:", JSON.stringify(parsed, null, 2));
      } else {
        console.log("Response Object:", responseData);
        console.log("Formatted JSON:", JSON.stringify(responseData, null, 2));
      }
    } catch {
      console.log("Response (not JSON):", responseData);
    }
    console.groupEnd();

    console.groupEnd();
  }

  private static logError(url: string, error: Error, duration: number) {
    console.group("💥 API ERROR");
    console.log(`📍 URL: ${url}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`❌ Error:`, error);
    console.log(`📋 Error Details:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    console.groupEnd();
  }

  static async loggedFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const startTime = performance.now();
    const method = options.method || "GET";
    const headers = (options.headers as Record<string, string>) || {};

    // Log the request
    this.logRequest(method, url, headers, options.body);

    try {
      const response = await fetch(url, options);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      // Clone response to read body without consuming it
      const responseClone = response.clone();
      let responseData;

      try {
        responseData = await responseClone.text();
      } catch {
        responseData = "Unable to read response body";
      }

      // Log the response
      this.logResponse(
        url,
        response.status,
        response.statusText,
        response.headers,
        responseData,
        duration
      );

      return response;
    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      // Log the error
      this.logError(url, error as Error, duration);

      throw error;
    }
  }
}

class ApiService {
  private apiUrl: string = "";
  private corsProxyUrl: string = "https://cors-anywhere-tbdr.vercel.app/?url=";
  private headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  private useProxy: boolean = false;

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = {
      ...this.headers,
      ...headers,
    };
  }

  setCorsProxy(proxyUrl: string): void {
    this.corsProxyUrl = proxyUrl;
  }

  setUseProxy(useProxy: boolean): void {
    this.useProxy = useProxy;
  }

  private getRequestUrl(url: string): string {
    if (this.useProxy && this.corsProxyUrl) {
      // For the custom proxy, encode the URL as a query parameter
      return `${this.corsProxyUrl}${encodeURIComponent(url)}`;
    }
    return url;
  }

  private getOperatingSystem(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iOS")) return "iOS";
    return "Unknown";
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return "Tablet";
    if (
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent
      )
    )
      return "Mobile";
    return "Desktop";
  }

  async sendMessage(text: string, buttonLabel?: string): Promise<ChatResponse> {
    // If we have a real API URL, make the actual request
    if (this.apiUrl && this.apiUrl !== "") {
      // Prepare analytics payload for ChatInteractions table
      const requestBody = {
        EventType: "send_message",
        ButtonLabel: buttonLabel || null,
        UserAgent: navigator.userAgent,
        ScreenResolution: `${window.screen.width}x${window.screen.height}`,
        OperatingSystem: this.getOperatingSystem(),
        DeviceType: this.getDeviceType(),
        user_text: text,
        RawPayload: {
          timestamp: new Date().toISOString(),
          sessionId: `session_${Date.now()}`,
          message: text,
        },
      };

      // Get the final URL (with or without proxy)
      const finalUrl = this.getRequestUrl(this.apiUrl);

      console.log(
        `🔗 Using ${
          this.useProxy ? "CORS proxy" : "direct"
        } request to: ${finalUrl}`
      );

      // Prepare headers with dynamic Origin
      const requestHeaders = {
        ...this.headers,
        ...(this.useProxy && { Origin: window.location.origin }),
      };

      const response = await RequestLogger.loggedFetch(finalUrl, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} ${response.statusText}`
        );
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Failed to parse response JSON: ${parseError}`);
      }

      // Handle minimal response format - API only returns response_type: 0
      const responseType = data.response_type || 0;

      return {
        response_type: responseType,
        text:
          responseType === 1
            ? "Here are some products you might like:"
            : "Thank you for your message. How else can I help you?",
        products: responseType === 1 ? SAMPLE_PRODUCTS : undefined,
      };
    }

    // Fallback to mock response if no API URL is set
    console.warn("No API URL configured, using mock response");

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

    return response;
  }
}

// Export singleton instance
export const apiService = new ApiService();
