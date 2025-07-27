import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, Mushroom, Product, CartItem, AdMessage } from '../types';
import { ChatGPTService, ChatContext } from '../services/chatGPTService';
import { ThradsAdService } from '../services/thradsAdService';

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
  const [chatId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);

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
      async (fullResponse: string) => {
        // Finalize the message
        setMessages(prev => prev.map(msg => 
          msg.id === tempBotMessage.id 
            ? { ...msg, content: fullResponse }
            : msg
        ));
        setIsTyping(false);
        setIsStreaming(false);

        // Check if we should show an ad (every 3 messages)
        const updatedMessages = messages.concat([
          userMessage,
          { ...tempBotMessage, content: fullResponse }
        ]);
        
        if (ThradsAdService.shouldShowAd(updatedMessages.length)) {
          try {
            const adResponse = await ThradsAdService.getSponsoredMessage(
              userId,
              chatId,
              content,
              fullResponse
            );

            if (adResponse?.status === 'success' && adResponse.data?.ad) {
              const adMessage: ChatMessage = {
                id: `ad_${Date.now()}`,
                content: adResponse.data.ad.content,
                sender: 'ad',
                timestamp: new Date(),
                adData: adResponse.data.ad,
              };

              setMessages(prev => [...prev, adMessage]);

              // Log impression
              if (adResponse.data.impressionId) {
                await ThradsAdService.logImpression({
                  user_id: userId,
                  chat_id: chatId,
                  ad_id: adResponse.data.ad.id,
                  impression_id: adResponse.data.impressionId,
                  timestamp: new Date(),
                });
              }
            } else if (adResponse?.status === 'success' && !adResponse.data) {
              // Ad request successful but no ad available (too soon, etc.)
              console.log('No ad available:', adResponse.message);
            }
          } catch (error) {
            console.error('Failed to fetch ad:', error);
          }
        }
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
  }, [messages, chatId, userId]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: '1',
      content: "Hi there! 👋 I'm your AI mushroom supplement advisor. I can help you find the perfect supplements for your wellness goals. What would you like to improve today?",
      sender: 'bot',
      timestamp: new Date(),
    }]);
  }, []);

  const handleAdDismiss = useCallback((adId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== adId));
  }, []);

  const handleAdClick = useCallback(async (adId: string, impressionId?: string) => {
    if (impressionId) {
      await ThradsAdService.trackClick(impressionId, adId);
    }
  }, []);

  return {
    messages,
    isTyping,
    isStreaming,
    sendMessage,
    clearChat,
    handleAdDismiss,
    handleAdClick,
    chatId,
    userId,
  };
};