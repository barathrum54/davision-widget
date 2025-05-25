import type { Message, Product } from '../../types/chat.types';

interface ChatResponse {
  text: string;
  products?: Product[];
}

export interface ChatServiceConfig {
  apiEndpoint?: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

export class ChatService {
  private config: ChatServiceConfig;

  constructor(config: ChatServiceConfig = {}) {
    this.config = config;
  }

  async sendMessage(text: string): Promise<ChatResponse> {
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
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message to API:', error);
      throw error;
    }
  }

  // Mock response for demo purposes or when API endpoint is not provided
  private getMockResponse(text: string): Promise<ChatResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (text.toLowerCase().includes('dress')) {
          resolve({
            text: 'Here are some dress options you might like:',
            products: [
              {
                id: '1',
                title: 'Printed Top With Zipper Front And Gold Sequin',
                price: '46,250.00 ₺',
                image: '/public/fab-icon.png',
              },
              {
                id: '2',
                title: 'Halter Neck Ruffled Maxi Dress With Gold Accessory',
                price: '98,050.00 TL',
                image: '/public/fab-icon.png',
              },
            ],
          });
        } else {
          resolve({
            text: `This is a demo response for "${text}". In production, this would come from your API.`,
          });
        }
      }, 1000);
    });
  }
} 