import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  cartTotal: number;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  cartTotal,
  onCheckout,
}) => {
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
            <div className="flex items-center justify-between p-6 border-b border-light-grey">
              <h2 className="text-xl font-inter font-bold text-dark-matte flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Cart ({cartItems.length})
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-light-grey text-dark-matte transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-16rem)]">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 text-dark-grey mx-auto mb-4" />
                  <p className="text-dark-grey font-opensans">Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-4 bg-light-grey/50 rounded-xl p-4"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-inter font-semibold text-dark-matte">
                        {item.product.name}
                      </h3>
                      <p className="text-vibrant-orange font-opensans font-semibold">
                        ${item.product.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white hover:bg-light-grey flex items-center justify-center text-dark-matte transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      
                      <span className="w-8 text-center font-opensans font-semibold text-dark-matte">
                        {item.quantity}
                      </span>
                      
                      <motion.button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white hover:bg-light-grey flex items-center justify-center text-dark-matte transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-light-grey">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-inter font-semibold text-dark-matte">
                    Total:
                  </span>
                  <span className="text-xl font-inter font-bold text-vibrant-orange">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                
                <motion.button
                  onClick={onCheckout}
                  className="w-full bg-vibrant-orange hover:bg-orange-600 text-white font-opensans font-semibold py-4 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};