import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Info, Bot, Star, Leaf, Award, Package, Clock, Users } from 'lucide-react';
import { Mushroom, Product } from '../types';
import { getCategoryForEffect } from '../utils/categoryIcons';

interface MushroomPageProps {
  mushroom: Mushroom | null;
  associatedProduct: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAskAI: (question: string) => void;
}

export const MushroomPage: React.FC<MushroomPageProps> = ({
  mushroom,
  associatedProduct,
  isOpen,
  onClose,
  onAddToCart,
  onAskAI,
}) => {
  const [showComposition, setShowComposition] = useState(false);

  if (!mushroom || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header with Mushroom Image/Video */}
            <div className="relative">
              {mushroom.video_url ? (
                <video
                  src={mushroom.video_url}
                  className="w-full h-48 object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={mushroom.photo_url}
                />
              ) : (
                <img
                  src={mushroom.photo_url || `https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800`}
                  alt={mushroom.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-dark-matte transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Price Badge */}
              {associatedProduct && (
                <div className="absolute bottom-4 left-4 bg-vibrant-orange text-white px-4 py-2 rounded-full">
                  <span className="font-inter font-bold text-lg">${associatedProduct.price}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
              {/* Mushroom Title */}
              <div className="mb-4">
                <h2 className="text-2xl font-inter font-bold text-dark-matte mb-2">
                  {mushroom.name}
                </h2>
                
                {/* Scientific Name */}
                {mushroom.scientific_name && (
                  <p className="text-dark-grey font-opensans text-sm italic mb-3">
                    {mushroom.scientific_name}
                  </p>
                )}
              </div>

              {/* Traditional Use */}
              {mushroom.region_medicine && (
                <div className="mb-6">
                  <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-vibrant-orange" />
                    Traditional Use
                  </h3>
                  <p className="text-dark-grey font-opensans leading-relaxed">
                    {mushroom.region_medicine}
                  </p>
                </div>
              )}

              {/* Story Behind Consumption */}
              {mushroom.story_behind_consumption && (
                <div className="mb-6">
                  <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-vibrant-orange" />
                    About This Mushroom
                  </h3>
                  <p className="text-dark-grey font-opensans leading-relaxed">
                    {mushroom.story_behind_consumption}
                  </p>
                </div>
              )}

              {/* Expected Effects */}
              {mushroom.expected_effects && mushroom.expected_effects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-vibrant-orange" />
                    Expected Effects
                  </h3>
                  <ul className="space-y-2">
                    {mushroom.expected_effects.map((effect, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-vibrant-orange mt-0.5 flex-shrink-0" />
                        <span className="text-dark-grey font-opensans text-sm">
                          {effect}
                        </span>
                        <motion.button
                          onClick={() => onAskAI(`Tell me more about ${effect} and how it can benefit me`)}
                          className="ml-auto px-2 py-1 bg-vibrant-orange/80 hover:bg-vibrant-orange text-white text-xs font-opensans font-medium rounded-full flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Bot className="w-3 h-3" />
                          Ask AI
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Impact on Life */}
              {mushroom.impact_on_life && mushroom.impact_on_life.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-vibrant-orange" />
                    Impact on Life
                  </h3>
                  <ul className="space-y-2">
                    {mushroom.impact_on_life.map((impact, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-vibrant-orange mt-0.5 flex-shrink-0" />
                        <span className="text-dark-grey font-opensans text-sm">
                          {impact}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Effects by Category */}
              {mushroom.expected_effects && mushroom.expected_effects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-vibrant-orange" />
                    Effects by Category
                  </h3>
                  <div className="space-y-4">
                    {(() => {
                      const categorizedEffects = new Map<string, { category: any, effects: string[] }>();
                      
                      mushroom.expected_effects.forEach((effect: string) => {
                        const category = getCategoryForEffect(effect);
                        if (category) {
                          const key = category.name;
                          if (!categorizedEffects.has(key)) {
                            categorizedEffects.set(key, { category, effects: [] });
                          }
                          categorizedEffects.get(key)!.effects.push(effect);
                        }
                      });

                      return Array.from(categorizedEffects.entries()).map(([categoryName, { category, effects }]) => (
                        <div key={categoryName} className="bg-light-grey rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <img src={category.icon} alt={categoryName} className="w-6 h-6" />
                            <h4 className="text-dark-matte font-inter font-semibold text-sm">{categoryName}</h4>
                          </div>
                          <div className="space-y-2">
                            {effects.map((effect, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-dark-grey font-opensans text-sm">{effect}</span>
                                <motion.button
                                  onClick={() => onAskAI(`Tell me more about ${effect} and how it can benefit me`)}
                                  className="px-3 py-1 bg-vibrant-orange/80 hover:bg-vibrant-orange text-white text-xs font-opensans font-medium rounded-full"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Ask AI
                                </motion.button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              {associatedProduct && (
                <motion.button
                  onClick={() => {
                    onAddToCart(associatedProduct);
                    onClose();
                  }}
                  className="w-full bg-vibrant-orange hover:bg-orange-600 text-white font-opensans font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart - ${associatedProduct.price}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 