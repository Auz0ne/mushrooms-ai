import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Menu } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemsCount,
  onCartClick,
  onMenuClick,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-light-grey sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Menu Button */}
          <motion.button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-dark-matte hover:bg-light-grey transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-vibrant-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-inter font-bold text-lg">F</span>
            </div>
            <h1 className="font-inter font-bold text-xl text-dark-matte">
              FungiWell
            </h1>
          </div>

          {/* Cart Button */}
          <motion.button
            onClick={onCartClick}
            className="relative p-2 rounded-lg text-dark-matte hover:bg-light-grey transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Shopping cart with ${cartItemsCount} items`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-vibrant-orange rounded-full flex items-center justify-center text-white text-xs font-opensans font-semibold"
              >
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};