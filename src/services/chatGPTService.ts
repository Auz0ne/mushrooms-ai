import { ChatMessage, Product, CartItem } from '../types';

export interface ChatContext {
  cartItems: CartItem[];
  currentProduct?: Product;
  userPreferences?: string[];
}

export class ChatGPTService {
  private static async callChatAPI(messages: ChatMessage[], context: ChatContext) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          cartItems: context.cartItems,
          currentProduct: context.currentProduct,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('ChatGPT API error:', error);
      throw error;
    }
  }

  public static async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    context: ChatContext
  ): Promise<string> {
    try {
      // Add user message to conversation
      const updatedMessages = [
        ...conversationHistory,
        {
          id: Date.now().toString(),
          content: userMessage,
          sender: 'user' as const,
          timestamp: new Date(),
        }
      ];

      // Get response from ChatGPT
      const response = await this.callChatAPI(updatedMessages, context);
      
      return response;
    } catch (error) {
      console.error('Error generating ChatGPT response:', error);
      
      // Fallback response
      return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or feel free to browse our mushroom collection directly! 🍄";
    }
  }

  public static async generateStreamingResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    context: ChatContext,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const updatedMessages = [
        ...conversationHistory,
        {
          id: Date.now().toString(),
          content: userMessage,
          sender: 'user' as const,
          timestamp: new Date(),
        }
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          cartItems: context.cartItems,
          currentProduct: context.currentProduct,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const fullResponse = data.message;
      
      // Simulate streaming by sending chunks
      const words = fullResponse.split(' ');
      let currentChunk = '';
      
      for (const word of words) {
        currentChunk += word + ' ';
        onChunk(currentChunk.trim());
        await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay between words
      }
      
      onComplete(fullResponse);
    } catch (error) {
      console.error('Error generating streaming response:', error);
      onError("I'm sorry, I'm having trouble connecting right now. Please try again in a moment! 🍄");
    }
  }
} 