import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { AdMessageComponent } from './AdMessage';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onAdDismiss?: (adId: string) => void;
  onAdClick?: (adId: string, impressionId?: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isTyping,
  onSendMessage,
  onAdDismiss,
  onAdClick,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl border-t border-light-grey">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-light-grey">
        <div className="w-10 h-10 bg-vibrant-orange rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-inter font-semibold text-dark-matte">
            FungiWell Assistant
          </h3>
          <p className="text-sm text-dark-grey font-opensans">
            Your mushroom supplement guide
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-64 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => {
            // Handle ad messages
            if (message.sender === 'ad' && message.adData) {
              return (
                <AdMessageComponent
                  key={message.id}
                  ad={message.adData}
                  onDismiss={onAdDismiss || (() => {})}
                  onTrackClick={onAdClick || (() => {})}
                />
              );
            }

            // Handle regular messages
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-vibrant-orange rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-vibrant-orange text-white'
                      : 'bg-light-grey text-dark-matte'
                  }`}
                >
                  <p className="font-opensans text-sm leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-orange-100'
                        : 'text-dark-grey'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-dark-grey rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 bg-vibrant-orange rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-light-grey rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-dark-grey rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-dark-grey rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-dark-grey rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-light-grey">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about supplements, benefits, or recommendations..."
            className="flex-1 bg-light-grey border-none rounded-full px-4 py-3 text-dark-matte placeholder-dark-grey font-opensans focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
            disabled={isTyping}
          />
          <motion.button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 bg-vibrant-orange hover:bg-orange-600 disabled:bg-dark-grey disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};