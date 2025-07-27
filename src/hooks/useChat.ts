import { useState, useCallback } from 'react';
import { ChatMessage, Mushroom, Product, CartItem } from '../types';
import { ChatGPTService, ChatContext } from '../services/chatGPTService';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi there! 👋 I'm your AI mushroom supplement advisor. I can help you find the perfect supplements for your wellness goals. What would you like to improve today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback((
    content: string, 
    context: ChatContext = { cartItems: [] },
    onMushroomSuggestion?: (mushroom: Mushroom) => void
  ) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Add a temporary bot message for streaming
    const tempBotMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, tempBotMessage]);
    setIsStreaming(true);

    // Use ChatGPT service
    ChatGPTService.generateStreamingResponse(
      content,
      messages,
      context,
      (chunk: string) => {
        // Update the temporary message with streaming content
        setMessages(prev => prev.map(msg => 
          msg.id === tempBotMessage.id 
            ? { ...msg, content: chunk }
            : msg
        ));
      },
      (fullResponse: string) => {
        // Finalize the message
        setMessages(prev => prev.map(msg => 
          msg.id === tempBotMessage.id 
            ? { ...msg, content: fullResponse }
            : msg
        ));
        setIsTyping(false);
        setIsStreaming(false);
      },
      (error: string) => {
        // Handle error
        setMessages(prev => prev.map(msg => 
          msg.id === tempBotMessage.id 
            ? { ...msg, content: error }
            : msg
        ));
        setIsTyping(false);
        setIsStreaming(false);
      }
    );
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: '1',
      content: "Hi there! 👋 I'm your AI mushroom supplement advisor. I can help you find the perfect supplements for your wellness goals. What would you like to improve today?",
      sender: 'bot',
      timestamp: new Date(),
    }]);
  }, []);

  return {
    messages,
    isTyping,
    isStreaming,
    sendMessage,
    clearChat,
  };
};