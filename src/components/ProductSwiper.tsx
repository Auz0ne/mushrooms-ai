import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductSwiperProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onProductChange?: (product: Product) => void;
  selectedProduct?: Product;
}

export const ProductSwiper: React.FC<ProductSwiperProps> = ({
  products,
  onAddToCart,
  onViewDetails,
  onProductChange,
  selectedProduct,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const currentProduct = selectedProduct || products[currentIndex];

  useEffect(() => {
    if (selectedProduct) {
      const index = products.findIndex(p => p.id === selectedProduct.id);
      if (index !== -1 && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }, [selectedProduct, products, currentIndex]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : products.length - 1;
    setCurrentIndex(newIndex);
    onProductChange?.(products[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < products.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onProductChange?.(products[newIndex]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX.current - endX;
    
    if (Math.abs(diffX) > 50) { // Minimum swipe distance
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  return (
    <div className="relative w-full">
      {/* Main Product Display */}
      <div 
        className="relative overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={containerRef}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <ProductCard
              product={currentProduct}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <motion.button
          onClick={handlePrevious}
          className="p-2 rounded-full bg-light-grey hover:bg-vibrant-orange hover:text-white text-dark-matte transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous product"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                onProductChange?.(products[index]);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2 ${
                index === currentIndex
                  ? 'bg-vibrant-orange w-6'
                  : 'bg-light-grey hover:bg-dark-grey'
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          className="p-2 rounded-full bg-light-grey hover:bg-vibrant-orange hover:text-white text-dark-matte transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next product"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};