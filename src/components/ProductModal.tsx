import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Leaf, Award } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

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
            className="relative w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-dark-matte transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Price Badge */}
              <div className="absolute bottom-4 left-4 bg-vibrant-orange text-white px-4 py-2 rounded-full">
                <span className="font-inter font-bold text-lg">${product.price}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-12rem)]">
              {/* Title and Tags */}
              <div className="mb-4">
                <h2 className="text-2xl font-inter font-bold text-dark-matte mb-3">
                  {product.name}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-light-grey text-dark-matte text-sm font-opensans font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-dark-grey font-opensans leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="text-lg font-inter font-semibold text-dark-matte mb-3 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-vibrant-orange" />
                  Key Benefits
                </h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-vibrant-orange mt-0.5 flex-shrink-0" />
                      <span className="text-dark-grey font-opensans text-sm">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quality Badge */}
              <div className="bg-light-grey rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-vibrant-orange" />
                  <div>
                    <h4 className="font-inter font-semibold text-dark-matte">
                      Premium Quality
                    </h4>
                    <p className="text-sm text-dark-grey font-opensans">
                      Organic, third-party tested, and sustainably sourced
                    </p>
                  </div>
                </div>
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