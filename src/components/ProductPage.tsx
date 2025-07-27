import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Info, Bot, Star, Leaf, Award, Package, Clock, Users } from 'lucide-react';
import { Product } from '../types';
import { getCategoryForEffect } from '../utils/categoryIcons';

interface ProductPageProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAskAI: (question: string) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAskAI,
}) => {
  const [showComposition, setShowComposition] = useState(false);

  if (!product || !isOpen) return null;

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
            {/* Header with Product Image/Video */}
            <div className="relative">
              {product.video ? (
                <video
                  src={product.video}
                  className="w-full h-48 object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={product.image}
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
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
              <div className="absolute bottom-4 left-4 bg-vibrant-orange text-white px-4 py-2 rounded-full">
                <span className="font-inter font-bold text-lg">${product.price}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
              {/* Product Title */}
              <div className="mb-4">
                <h2 className="text-2xl font-inter font-bold text-dark-matte mb-2">
                  {product.name}
                </h2>
                
                {/* Product Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-light-grey text-dark-matte text-sm font-opensans font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-vibrant-orange" />
                  Product Description
                </h3>
                <p className="text-dark-grey font-opensans leading-relaxed">
                  {product.short_description || product.description}
                </p>
              </div>

              {/* Product Details */}
              <div className="mb-6">
                <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-vibrant-orange" />
                  Product Details
                </h3>
                <div className="space-y-3">
                  {product.main_ingredient && (
                    <div className="flex justify-between">
                      <span className="text-dark-grey font-opensans">Main Ingredient:</span>
                      <span className="text-dark-matte font-opensans font-medium">{product.main_ingredient}</span>
                    </div>
                  )}
                  {product.format && (
                    <div className="flex justify-between">
                      <span className="text-dark-grey font-opensans">Format:</span>
                      <span className="text-dark-matte font-opensans font-medium">{product.format}</span>
                    </div>
                  )}
                  {product.pills_per_container && (
                    <div className="flex justify-between">
                      <span className="text-dark-grey font-opensans">Capsules per Bottle:</span>
                      <span className="text-dark-matte font-opensans font-medium">{product.pills_per_container}</span>
                    </div>
                  )}
                  {product.daily_dose && (
                    <div className="flex justify-between">
                      <span className="text-dark-grey font-opensans">Daily Dose:</span>
                      <span className="text-dark-matte font-opensans font-medium">{product.daily_dose}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage Instructions */}
              {product.use_instructions && (
                <div className="mb-6">
                  <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-vibrant-orange" />
                    How to Use
                  </h3>
                  <p className="text-dark-grey font-opensans leading-relaxed">
                    {product.use_instructions}
                  </p>
                </div>
              )}

              {/* Key Benefits */}
              {product.key_benefits && product.key_benefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-vibrant-orange" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-2">
                    {product.key_benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-vibrant-orange mt-0.5 flex-shrink-0" />
                        <span className="text-dark-grey font-opensans text-sm">
                          {benefit}
                        </span>
                        <motion.button
                          onClick={() => onAskAI(`Tell me more about ${benefit} and how it can benefit me`)}
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

              {/* Certifications */}
              {product.certifications_notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-vibrant-orange" />
                    Quality & Certifications
                  </h3>
                  <p className="text-dark-grey font-opensans leading-relaxed">
                    {product.certifications_notes}
                  </p>
                </div>
              )}

              {/* Composition Section */}
              <div className="bg-light-grey rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-inter font-semibold text-dark-matte flex items-center gap-2">
                    <Package className="w-5 h-5 text-vibrant-orange" />
                    Product Composition
                  </h3>
                  <motion.button
                    onClick={() => setShowComposition(!showComposition)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-dark-matte"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Info className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="text-dark-grey font-opensans text-sm mb-3">
                  <p>{product.pills_per_container} capsules • 30-day supply</p>
                  <p>500mg per capsule</p>
                </div>

                <AnimatePresence>
                  {showComposition && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/20 pt-3 mt-3"
                    >
                      <h4 className="text-dark-matte font-inter font-semibold text-sm mb-2">Composition</h4>
                      <ul className="text-dark-grey font-opensans text-sm space-y-1">
                        <li>• Organic {product.name} Extract (500mg)</li>
                        <li>• Vegetable Cellulose Capsule</li>
                        <li>• Rice Flour (anti-caking agent)</li>
                        <li>• Magnesium Stearate (flow agent)</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-vibrant-orange hover:bg-orange-600 text-white font-opensans font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart - ${product.price}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 