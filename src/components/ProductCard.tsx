import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isActive?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  isActive = false,
}) => {
  return (
    <motion.div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
        isActive ? 'ring-2 ring-vibrant-orange' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Add to Cart Button Overlay */}
        <motion.button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 right-4 bg-vibrant-orange hover:bg-orange-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-inter font-semibold text-dark-matte">
            {product.name}
          </h3>
          <span className="text-xl font-inter font-bold text-vibrant-orange">
            ${product.price}
          </span>
        </div>

        {/* Benefits Tags */}
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

        <p className="text-dark-grey font-opensans text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-vibrant-orange hover:bg-orange-600 text-white font-opensans font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add to Cart
          </motion.button>
          
          <motion.button
            onClick={() => onViewDetails(product)}
            className="p-3 border-2 border-light-grey hover:border-vibrant-orange text-dark-grey hover:text-vibrant-orange rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`View details for ${product.name}`}
          >
            <Info className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};