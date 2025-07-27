import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, X, Megaphone } from 'lucide-react';
import { AdMessage } from '../types';
import { ThradsAdService } from '../services/thradsAdService';

interface AdMessageProps {
  ad: AdMessage;
  onDismiss: (adId: string) => void;
  onTrackClick: (adId: string, impressionId?: string) => void;
}

export const AdMessageComponent: React.FC<AdMessageProps> = ({
  ad,
  onDismiss,
  onTrackClick,
}) => {
  const handleClick = () => {
    onTrackClick(ad.id, ad.impressionId);
    if (ad.url) {
      window.open(ad.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDismiss = () => {
    onDismiss(ad.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-3 justify-start"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
        <Megaphone className="w-4 h-4 text-white" />
      </div>

      <div className="max-w-[80%] rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 relative">
        {/* Sponsored Badge */}
        <div className="absolute -top-2 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
          Sponsored
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors"
          aria-label="Dismiss ad"
        >
          <X className="w-3 h-3 text-gray-600" />
        </button>

        {/* Ad Content */}
        <div className="mt-2">
          {ad.title && (
            <h4 className="font-inter font-semibold text-dark-matte text-sm mb-2">
              {ad.title}
            </h4>
          )}
          
          <p className="font-opensans text-sm text-dark-matte leading-relaxed mb-3">
            {ad.content}
          </p>

          {/* Ad Image (if available) */}
          {ad.image && (
            <div className="mb-3">
              <img
                src={ad.image}
                alt={ad.title || 'Sponsored content'}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Call to Action */}
          {ad.cta && (
            <button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-opensans font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              {ad.cta}
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mt-2">
          {ad.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </p>
      </div>
    </motion.div>
  );
}; 