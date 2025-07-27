import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface AddToCartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const TAX_RATE = 0.08; // 8% tax rate
  const subtotal = product.price * quantity;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirm = () => {
    onAddToCart(product, quantity);
    onClose();
    setQuantity(1); // Reset quantity for next time
  };

  const handleClose = () => {
    onClose();
    setQuantity(1); // Reset quantity when closing
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Product Name and Tags */}
              <div className="mb-4">
                <h2 className="text-xl font-inter font-bold text-dark-matte mb-2">
                  {product.name}
                </h2>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-light-grey text-dark-matte text-xs font-opensans font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-dark-grey font-opensans text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-inter font-semibold text-dark-matte mb-3">
                  Quantity
                </label>
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full bg-light-grey hover:bg-dark-grey disabled:bg-light-grey disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-dark-matte transition-colors duration-200"
                    whileHover={{ scale: quantity > 1 ? 1.1 : 1 }}
                    whileTap={{ scale: quantity > 1 ? 0.95 : 1 }}
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                  
                  <span className="text-2xl font-inter font-bold text-dark-matte min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  
                  <motion.button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-light-grey hover:bg-dark-grey flex items-center justify-center text-dark-matte transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-light-grey/50 rounded-xl p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-opensans text-sm text-dark-grey">
                      Subtotal ({quantity} × ${product.price.toFixed(2)})
                    </span>
                    <span className="font-opensans font-semibold text-dark-matte">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-opensans text-sm text-dark-grey">
                      Tax (8%)
                    </span>
                    <span className="font-opensans font-semibold text-dark-matte">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-dark-grey/20 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-inter font-bold text-lg text-dark-matte">
                        Total
                      </span>
                      <span className="font-inter font-bold text-xl text-vibrant-orange">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <motion.button
                onClick={handleConfirm}
                className="w-full bg-vibrant-orange hover:bg-orange-600 text-white font-opensans font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add {quantity} to Cart - ${total.toFixed(2)}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};