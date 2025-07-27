import { useState, useCallback } from 'react';
import { ChatMessage, Mushroom } from '../types';
import { ChatBot } from '../utils/chatbot';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi there! 👋 I'm your mushroom supplement guide. I can help you find the perfect supplements for your wellness goals. What would you like to improve today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const chatBot = new ChatBot();

  const sendMessage = useCallback((content: string, onMushroomSuggestion?: (mushroom: Mushroom) => void) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      chatBot.generateResponse(content).then(response => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          sender: 'bot',
          timestamp: new Date(),
          productSuggestion: response.suggestedMushroom,
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);

        // Trigger mushroom suggestion callback
        if (response.suggestedMushroom && onMushroomSuggestion) {
          onMushroomSuggestion(response.suggestedMushroom);
        }
      }).catch(error => {
        console.error('Error generating response:', error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      });
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }, [chatBot]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: '1',
      content: "Hi there! 👋 I'm your mushroom supplement guide. I can help you find the perfect supplements for your wellness goals. What would you like to improve today?",
      sender: 'bot',
      timestamp: new Date(),
    }]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
  };
};