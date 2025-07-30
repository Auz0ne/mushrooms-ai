import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Send, Bot, User, ChevronLeft, ChevronRight, Info, ShoppingCart } from 'lucide-react';
import { Product, Mushroom } from '../types';
import { MushroomService } from '../services/mushroomService';
import { ProductService } from '../services/productService';
import { useChat } from '../hooks/useChat';
import { getCategoriesForMushroom, getCategoryForEffect } from '../utils/categoryIcons';

interface HomePageProps {
  onAddToCart: (product: Product) => void;
  onGoToCheckout: () => void;
  cartItemsCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onAddToCart,
  onGoToCheckout,
  cartItemsCount,
}) => {
  const [mushrooms, setMushrooms] = useState<Mushroom[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isDeployed, setIsDeployed] = useState(false);
  const [showProductPresentation, setShowProductPresentation] = useState(false);
  const [selectedProductForPresentation, setSelectedProductForPresentation] = useState<Product | null>(null);
  const [showComposition, setShowComposition] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { 
    messages, 
    isTyping, 
    isStreaming, 
    sendMessage, 
    handleAdDismiss, 
    handleAdClick 
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load mushrooms and products in parallel
        const [mushroomsData, productsData] = await Promise.all([
          MushroomService.getAllMushrooms(),
          ProductService.getAllProducts()
        ]);
        
        setMushrooms(mushroomsData);
        setProducts(productsData);
        
        // Set Reishi as the default selected mushroom
        const reishiIndex = mushroomsData.findIndex(mushroom => 
          mushroom.name.toLowerCase().includes('reishi')
        );
        if (reishiIndex !== -1) {
          setCurrentProductIndex(reishiIndex);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Mobile keyboard handling
  useEffect(() => {
    // Detect if we're on mobile
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    
    // Handle visual viewport changes (keyboard appearance)
    const handleViewportChange = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const keyboardHeight = window.innerHeight - window.visualViewport.height;
        setKeyboardHeight(Math.max(0, keyboardHeight));
      }
    };
    
    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange(); // Initial check
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  // Find the product associated with the current mushroom (for price only)
  const getProductPriceForMushroom = (mushroom: Mushroom): number | null => {
    const associatedProduct = products.find(product => product.mushroom_id === mushroom.id);
    return associatedProduct ? associatedProduct.price : null;
  };

  // Convert mushroom to product format for display (keep all mushroom data, only update price)
  const convertMushroomToProduct = (mushroom: Mushroom): Product => {
    const productPrice = getProductPriceForMushroom(mushroom);
    
    return {
      id: mushroom.id,
      name: mushroom.name,
      price: productPrice || 29.99, // Use product price if available, otherwise default
      image: mushroom.photo_url || `https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800`,
      video: (mushroom.video_url && (mushroom.video_url.startsWith('http://') || mushroom.video_url.startsWith('https://'))) ? mushroom.video_url : undefined,
      description: mushroom.story_behind_consumption || 'Premium mushroom supplement',
      benefits: mushroom.expected_effects || [],
      tags: mushroom.expected_effects?.slice(0, 3) || ['Natural', 'Organic'],
      category: 'supplement',
      inStock: true,
    };
  };

  // NEW: Handle adding actual product to cart
  const handleAddToCart = async (mushroom: Mushroom) => {
    try {
      // Fetch the actual product associated with this mushroom
      const product = await ProductService.getProductByMushroomId(mushroom.id);
      
      if (product) {
        onAddToCart(product); // Add the actual Product object to cart
        console.log('Added actual product to cart:', product.name);
      } else {
        console.error('No product found for mushroom:', mushroom.name);
        // Fallback: use converted mushroom as product
        const fallbackProduct = convertMushroomToProduct(mushroom);
        onAddToCart(fallbackProduct);
      }
    } catch (error) {
      console.error('Error fetching product for cart:', error);
      // Fallback: use converted mushroom as product
      const fallbackProduct = convertMushroomToProduct(mushroom);
      onAddToCart(fallbackProduct);
    }
  };

  const displayProducts = mushrooms.map(convertMushroomToProduct);
  const currentProduct = displayProducts[currentProductIndex];

  const handlePrevious = () => {
    setCurrentProductIndex(prev => 
      prev > 0 ? prev - 1 : displayProducts.length - 1
    );
  };

  const handleNext = () => {
    setCurrentProductIndex(prev => 
      prev < displayProducts.length - 1 ? prev + 1 : 0
    );
  };

  const handleProductSuggestion = (product: Product) => {
    const index = displayProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      setCurrentProductIndex(index);
    }
  };

  const handleMushroomSuggestion = (mushroom: Mushroom) => {
    const product = convertMushroomToProduct(mushroom);
    handleProductSuggestion(product);
  };

  const handleProductTap = (product: Product) => {
    setSelectedProductForPresentation(product);
    setShowProductPresentation(true);
  };

  const handleBackToProducts = () => {
    setShowProductPresentation(false);
    setSelectedProductForPresentation(null);
    setShowComposition(false);
  };

  const handleAskAI = (effect: string) => {
    const question = `Tell me more about ${effect} and how it can benefit me`;
    const context = {
      cartItems: [],
      currentProduct: currentProduct,
    };
    sendMessage(question, context, handleMushroomSuggestion);
    setIsDeployed(true); // Deploy chatbot when asking AI
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (!isDeployed) setIsDeployed(true); // Auto-deploy if minimized
      const context = {
        cartItems: [],
        currentProduct: currentProduct,
      };
      sendMessage(inputValue.trim(), context, handleMushroomSuggestion);
      setInputValue('');
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 80; // Minimum drag distance to trigger state change
    
    if (info.offset.y < -threshold) {
      // Dragged up - deploy chatbot
      setIsDeployed(true);
    } else if (info.offset.y > threshold) {
      // Dragged down - minimize chatbot
      setIsDeployed(false);
    }
  };

  if (loading) {
    return (
      <div className="h-dvh bg-dark-matte flex items-center justify-center">
        <div className="text-white font-inter">Loading mushrooms...</div>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className="h-dvh bg-dark-matte flex items-center justify-center">
        <div className="text-white font-inter">No mushrooms found</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black flex flex-col">
      {/* Header - Absolutely positioned with blur */}
      <header className="absolute top-0 left-0 right-0 p-4 text-center bg-black/20 backdrop-blur-xl z-50">
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-inter font-bold text-xl text-white">
            Mushrooms AI
          </h1>
        </div>
        
        {/* Cart Button */}
        <motion.button
          onClick={onGoToCheckout}
          className="absolute top-4 right-4 bg-white/15 backdrop-blur-md border border-white/40 text-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="font-opensans font-semibold text-sm">
            Cart
          </span>
          {cartItemsCount > 0 && (
            <span className="w-4 h-4 bg-vibrant-orange rounded-full flex items-center justify-center text-white text-xs font-bold">
              {cartItemsCount > 9 ? '9+' : cartItemsCount}
            </span>
          )}
        </motion.button>
      </header>

      {/* Product Card */}
      <div 
        className="px-4 pt-16 flex flex-col items-center justify-start"
        style={{
          height: isDeployed ? 'calc(30vh - 64px)' : 'calc(100vh - 180px)',
          minHeight: '400px'
        }}
      >
        {showProductPresentation && selectedProductForPresentation ? (
          /* Product Presentation View */
          <div className="w-full max-w-md mx-auto pb-4 overflow-y-auto h-full">
            {/* Back Button */}
            <motion.button
              onClick={handleBackToProducts}
              className="mb-4 p-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Top Section: Video/Image + Name/Description */}
            <div className="flex gap-4 mb-3">
              {/* Video/Image - Left Side */}
              <div className="w-24 h-24 flex-shrink-0">
                {selectedProductForPresentation.video ? (
                  <video
                    src={selectedProductForPresentation.video}
                    className="w-full h-full object-cover rounded-xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={selectedProductForPresentation.image}
                    alt={selectedProductForPresentation.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>

              {/* Name and Description - Right Side */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-white font-inter font-bold text-xl flex-1">
                    {selectedProductForPresentation.name}
                  </h2>
                  <motion.button
                    onClick={() => handleAskAI(selectedProductForPresentation.name)}
                    className="ml-2 px-2 py-1 bg-vibrant-orange/80 hover:bg-vibrant-orange text-white text-xs font-opensans font-medium rounded-full flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bot className="w-3 h-3" />
                    Ask AI
                  </motion.button>
                </div>
                
                {(() => {
                  const mushroom = mushrooms.find(m => m.id === selectedProductForPresentation.id);
                  return (
                    <div className="space-y-2">
                      {mushroom?.scientific_name && (
                        <p className="text-white/80 font-opensans text-xs italic">
                          {mushroom.scientific_name}
                        </p>
                      )}
                      {mushroom?.region_medicine && (
                        <div className="flex items-start justify-between">
                          <p className="text-white/80 font-opensans text-xs flex-1">
                            Traditional use: {mushroom.region_medicine}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="mb-4">
              {(() => {
              const mushroom = mushrooms.find(m => m.id === selectedProductForPresentation.id);
                return (
                  <p className="text-white/90 font-opensans text-sm leading-relaxed">
                  {selectedProductForPresentation.description}
                  </p>
                );
              })()}
            </div>

            {/* Database Information */}
            {(() => {
              const mushroom = mushrooms.find(m => m.id === selectedProductForPresentation.id);
              if (!mushroom) return null;

              return (
                <div className="mb-6"></div>
              );
            })()}

            {/* Effects by Category */}
            {(() => {
              const mushroom = mushrooms.find(m => m.id === selectedProductForPresentation.id);
              if (!mushroom || !mushroom.expected_effects) return null;

              const categorizedEffects = new Map<string, { category: any, effects: string[] }>();
              
              mushroom.expected_effects.forEach(effect => {
                const category = getCategoryForEffect(effect);
                if (category) {
                  const key = category.name;
                  if (!categorizedEffects.has(key)) {
                    categorizedEffects.set(key, { category, effects: [] });
                  }
                  categorizedEffects.get(key)!.effects.push(effect);
                }
              });

              return (
                <div className="mb-6">
                  <h3 className="text-white font-inter font-semibold text-lg mb-4">Effects by Category</h3>
                  <div className="space-y-4">
                    {Array.from(categorizedEffects.entries()).map(([categoryName, { category, effects }]) => (
                      <div key={categoryName} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img src={category.icon} alt={categoryName} className="w-6 h-6" />
                          <h4 className="text-white font-inter font-semibold text-sm">{categoryName}</h4>
                        </div>
                        <div className="space-y-2">
                          {effects.map((effect, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-white/90 font-opensans text-sm">{effect}</span>
                              <motion.button
                                onClick={() => handleAskAI(effect)}
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
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Price and Product Info */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-white font-inter font-bold text-2xl">${selectedProductForPresentation.price}</span>
                  <span className="text-white/70 font-opensans text-sm">per bottle</span>
                </div>
                <motion.button
                  onClick={() => setShowComposition(!showComposition)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Info className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="text-white/90 font-opensans text-sm mb-3">
                <p>60 capsules • 30-day supply</p>
                <p>500mg per capsule</p>
              </div>

              {showComposition && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/20 pt-3 mt-3"
                >
                  <h4 className="text-white font-inter font-semibold text-sm mb-2">Composition</h4>
                  <ul className="text-white/90 font-opensans text-sm space-y-1">
                    <li>• Organic {selectedProductForPresentation.name} Extract (500mg)</li>
                    <li>• Vegetable Cellulose Capsule</li>
                    <li>• Rice Flour (anti-caking agent)</li>
                    <li>• Magnesium Stearate (flow agent)</li>
                  </ul>
                </motion.div>
              )}

              {/* Add to Cart Button - Small and in bottom right corner */}
              <div className="mt-4 pt-3 border-t border-white/20 flex justify-end">
                <motion.button
                  onClick={async (e) => {
                    e.stopPropagation();
                    // Find the mushroom for this product
                    const mushroom = mushrooms.find(m => m.id === selectedProductForPresentation.id);
                    if (mushroom) {
                      await handleAddToCart(mushroom);
                    } else {
                      // Fallback: add the product directly
                      onAddToCart(selectedProductForPresentation);
                    }
                  }}
                  className="relative px-4 py-2 rounded-lg bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/30 shadow-lg overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Liquid glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  {/* Button content */}
                  <div className="relative flex items-center gap-2 text-white">
                    <ShoppingCart className="w-3 h-3" />
                    <span className="font-opensans font-semibold text-sm">
                      Add to Cart
                    </span>
                    <span className="font-inter font-bold text-sm text-vibrant-orange">
                      ${selectedProductForPresentation.price}
                    </span>
                  </div>
                  
                  {/* Glass reflection */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg" />
                  
                  {/* Bottom glow */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2/3 h-2 bg-vibrant-orange/30 blur-md rounded-full" />
                </motion.button>
              </div>
            </div>


          </div>
        ) : (
          /* Original Product Card View */
          <div className="pb-4">
            {/* Category Effects */}
            <div className="mb-4 w-full">
              <div className="flex flex-wrap justify-center gap-2">
                {(() => {
                  const mushroom = mushrooms.find(m => m.id === currentProduct.id);
                  if (!mushroom) return null;
                  
                  const effects = mushroom.expected_effects || [];
                  return effects.slice(0, 4).map((effect, index) => {
                    const category = getCategoryForEffect(effect);
                    if (!category) return null;
                    
                    return (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-opensans font-medium rounded-full"
                    >
                      <img 
                        src={category.icon} 
                        alt={effect}
                        className="w-3 h-3"
                      />
                      <span className="truncate max-w-20 text-xs">
                        {effect}
                      </span>
                    </div>
                    );
                  }).filter(Boolean);
                })()}
              </div>
            </div>

            <div className="relative w-full mb-4" onTouchStart={(e) => {
              // This outer touch handler is removed to prevent interference
            }}>
              {/* Product Card */}
              <div
                className="relative bg-transparent rounded-2xl overflow-hidden w-72 h-72 mx-auto"
                onTouchStart={(e) => {
                  const startX = e.touches[0].clientX;
                  const startY = e.touches[0].clientY;
                  const startTime = Date.now();
                  let hasMoved = false;
                  let isVerticalScroll = false;
                  
                  const handleTouchMove = (moveEvent: TouchEvent) => {
                    const currentX = moveEvent.touches[0].clientX;
                    const currentY = moveEvent.touches[0].clientY;
                    const diffX = Math.abs(startX - currentX);
                    const diffY = Math.abs(startY - currentY);
                    
                    // Determine if this is vertical scrolling
                    if (diffY > diffX && diffY > 10) {
                      isVerticalScroll = true;
                      return; // Allow vertical scrolling
                    }
                    
                    if (diffX > 10 && !isVerticalScroll) { // If moved more than 10px horizontally, it's a swipe
                      hasMoved = true;
                      moveEvent.preventDefault();
                    }
                  };
                  
                  const handleTouchEnd = (endEvent: TouchEvent) => {
                    const endX = endEvent.changedTouches[0].clientX;
                    const endTime = Date.now();
                    const diffX = startX - endX;
                    const timeDiff = endTime - startTime;
                    
                    if (hasMoved && Math.abs(diffX) > 50 && !isVerticalScroll) {
                      // It's a swipe
                      if (diffX > 0) {
                        handleNext();
                      } else {
                        handlePrevious();
                      }
                    } else if (!hasMoved && !isVerticalScroll && timeDiff < 500) {
                      // It's a tap (no movement and quick)
                      handleProductTap(currentProduct);
                    }
                    
                    document.removeEventListener('touchmove', handleTouchMove);
                    document.removeEventListener('touchend', handleTouchEnd);
                  };
                  
                  document.addEventListener('touchmove', handleTouchMove, { passive: false });
                  document.addEventListener('touchend', handleTouchEnd);
                }}
              >
                <motion.div
                  key={currentProduct.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                {/* Product Video/Image */}
                <div className="w-full h-full relative">
                  {currentProduct.video ? (
                    <video
                      src={currentProduct.video}
                      className="w-full h-full object-cover rounded-2xl"
                      autoPlay
                      loop
                      muted
                      playsInline
                      webkit-playsinline="true"
                      controls={false}
                      disablePictureInPicture
                      preload="metadata"
                      onLoadStart={() => {
                        console.log('Video loading started');
                      }}
                      onCanPlay={(e) => {
                        console.log('Video can play');
                        const video = e.currentTarget;
                        // Only try to play if not already playing
                        if (video.paused) {
                          const playPromise = video.play();
                          if (playPromise !== undefined) {
                            playPromise.catch(error => {
                              console.log('Autoplay failed:', error);
                              // Show fallback image if autoplay fails
                              const imageElement = video.parentElement?.querySelector('.fallback-image') as HTMLImageElement;
                              if (imageElement) {
                                video.style.display = 'none';
                                imageElement.style.display = 'block';
                              }
                            });
                          }
                        }
                      }}
                      onPlay={(e) => {
                        console.log('Video started playing');
                        // Hide fallback image when video starts playing
                        const imageElement = e.currentTarget.parentElement?.querySelector('.fallback-image') as HTMLImageElement;
                        if (imageElement) {
                          imageElement.style.display = 'none';
                        }
                      }}
                      onPause={() => {
                        console.log('Video paused');
                      }}
                      onError={(e) => {
                        console.error('Video failed to load:', e);
                        // Hide video and show photo_url fallback
                        const videoElement = e.currentTarget;
                        const imageElement = videoElement.parentElement?.querySelector('.fallback-image') as HTMLImageElement;
                        videoElement.style.display = 'none';
                        if (imageElement) {
                          imageElement.style.display = 'block';
                        }
                      }}
                    />
                  ) : (
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  )}
                  
                  {/* Fallback image using photo_url from database */}
                  {currentProduct.video && (
                    <img
                      className="fallback-image w-full h-full object-cover rounded-2xl absolute inset-0"
                      src={currentProduct.image}
                      alt={currentProduct.name}
                    />
                  )}
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl" />

                  {/* Price Overlay */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-vibrant-orange text-white font-inter font-bold text-sm rounded-full">
                      ${currentProduct.price}
                    </span>
                  </div>

                  {/* Product Name */}
                  <div className="absolute bottom-12 left-3 right-16">
                    <h2 className="text-white font-inter font-bold text-lg">
                      {currentProduct.name}
                    </h2>
                    <p className="text-white/90 font-opensans text-xs mt-0.5 line-clamp-1">
                      {currentProduct.description}
                    </p>
                  </div>
                </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Add to Cart Button - Always at bottom right of product area */}
      {!showProductPresentation && (
        <div
          className="fixed right-8 z-20 transition-all duration-500 ease-out"
          style={{
            bottom: '204px'
          }}
        >
          <motion.button
            onClick={async (e) => {
              e.stopPropagation();
              // Find the mushroom for this product
              const mushroom = mushrooms.find(m => m.id === currentProduct.id);
              if (mushroom) {
                await handleAddToCart(mushroom);
              } else {
                // Fallback: add the product directly
                onAddToCart(currentProduct);
              }
            }}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Add to cart"
          >
            <img 
              src="/Cart-Button-Photoroom.png" 
              alt="Add to cart" 
              className="w-12 h-12"
            />
          </motion.button>
        </div>
      )}

      {/* Chatbot Section */}
      <div 
        className={`fixed left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/20 rounded-t-3xl p-3 flex flex-col shadow-lg cursor-ns-resize z-40 ${
          isDeployed ? 'h-70dvh' : 'h-[180px]'
        } transition-all duration-500 ease-out`}
        style={{
          bottom: isMobile && keyboardHeight > 0 ? `${keyboardHeight}px` : '0px'
        }}
        onTouchStart={(e) => {
          // Only handle drag if not touching the scrollable messages area
          const target = e.target as HTMLElement;
          const messagesContainer = target.closest('.messages-container');
          if (messagesContainer) return; // Let messages scroll normally
          
          e.stopPropagation();
          const startY = e.touches[0].clientY;
          let hasMoved = false;
          
          const handleTouchMove = (moveEvent: TouchEvent) => {
            moveEvent.preventDefault();
            moveEvent.stopPropagation();
            const deltaY = moveEvent.touches[0].clientY - startY;
            
            if (Math.abs(deltaY) > 30) {
              hasMoved = true;
              if (deltaY < 0 && !isDeployed) {
                // Dragged up - deploy chatbot
                setIsDeployed(true);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              } else if (deltaY > 0 && isDeployed) {
                // Dragged down - minimize chatbot
                setIsDeployed(false);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              }
            }
          };
          
          const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
          };
          
          document.addEventListener('touchmove', handleTouchMove, { passive: false });
          document.addEventListener('touchend', handleTouchEnd);
        }}
        onPointerDown={(e) => {
          // Only handle drag if not touching the scrollable messages area
          const target = e.target as HTMLElement;
          const messagesContainer = target.closest('.messages-container');
          if (messagesContainer) return; // Let messages scroll normally
          
          e.stopPropagation();
          const startY = e.clientY;
          let hasMoved = false;
          
          const handlePointerMove = (moveEvent: PointerEvent) => {
            moveEvent.preventDefault();
            moveEvent.stopPropagation();
            const deltaY = moveEvent.clientY - startY;
            
            if (Math.abs(deltaY) > 30) {
              hasMoved = true;
              if (deltaY < 0 && !isDeployed) {
                // Dragged up - deploy chatbot
                setIsDeployed(true);
                document.removeEventListener('pointermove', handlePointerMove);
                document.removeEventListener('pointerup', handlePointerUp);
              } else if (deltaY > 0 && isDeployed) {
                // Dragged down - minimize chatbot
                setIsDeployed(false);
                document.removeEventListener('pointermove', handlePointerMove);
                document.removeEventListener('pointerup', handlePointerUp);
              }
            }
          };
          
          const handlePointerUp = () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
          };
          
          document.addEventListener('pointermove', handlePointerMove);
          document.addEventListener('pointerup', handlePointerUp);
        }}
      >
        {/* Extended Drag Area - Invisible hit box above the chatbot */}
        <div 
          className="absolute -top-8 left-0 right-0 h-8 cursor-ns-resize"
          style={{ touchAction: 'none' }}
        />
        
        {/* Drag Handle */}
        <div 
          className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full mb-2 cursor-ns-resize"
          style={{ touchAction: 'none' }}
        />
        
        <h3 className="font-inter font-semibold text-white mb-2 text-center text-sm mt-4">
          Ask our AI for supplement advice
        </h3>
        
        {/* Chat Messages */}
        <div
          ref={messagesContainerRef}
          className="messages-container flex-1 overflow-y-auto space-y-4 mb-2 mt-2 min-h-0"
          style={{ touchAction: 'pan-y' }}
        >
          {(() => {
            const displayMessages = messages.slice(-10);
            console.log('Total messages:', messages.length);
            console.log('Displaying messages:', displayMessages.map(m => ({ id: m.id, sender: m.sender, content: m.content.substring(0, 50) })));
            console.log('Ad messages in display:', displayMessages.filter(m => m.sender === 'ad').length);
            return displayMessages;
          })().map((message) => {
            // Handle ad messages
            if (message.sender === 'ad' && message.adData) {
              return (
                <div key={message.id} className="flex gap-3 justify-start">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="max-w-[80%] rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-3 relative">
                    <div className="absolute -top-2 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      Sponsored
                    </div>
                    <div className="mt-2">
                      {message.adData.title && (
                        <h4 className="font-inter font-semibold text-dark-matte text-xs mb-1">
                          {message.adData.title}
                        </h4>
                      )}
                      <p className="font-opensans text-xs text-dark-matte leading-snug">
                        {message.content}
                      </p>
                      {message.adData.cta && (
                        <div className="flex justify-end mt-2">
                          <motion.button
                            onClick={() => {
                              console.log('Ad clicked:', { adId: message.adData!.id, url: message.adData!.url, impressionId: message.adData!.impressionId });
                              handleAdClick(message.adData!.id, message.adData!.impressionId);
                              if (message.adData!.url && message.adData!.url !== 'https://example.com/test-ad') {
                                console.log('Opening URL:', message.adData!.url);
                                window.open(message.adData!.url, '_blank', 'noopener,noreferrer');
                              } else {
                                console.log('No valid URL available for this ad, showing alert instead');
                                alert('Ad clicked! This would normally open: ' + (message.adData!.url || 'No URL'));
                              }
                            }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-opensans font-semibold py-1 px-3 rounded text-xs"
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{ 
                              scale: 0.95,
                              transition: { duration: 0.1 }
                            }}
                          >
                            {message.adData.cta}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Handle regular messages
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <img 
                    src="/Chatbot.png" 
                    alt="AI Assistant" 
                    className="w-8 h-8 flex-shrink-0"
                  />
                )}

                <div className="max-w-[80%]">
                  <div className={`font-opensans text-xs leading-snug drop-shadow-sm ${
                    message.sender === 'user' ? 'text-vibrant-orange font-semibold' : 'text-white'
                  }`}>
                    {message.sender === 'bot' ? (
                      message.content.split('\n').map((paragraph, index) => (
                        <p key={index} className={index > 0 ? 'mt-2' : ''}>
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <img 
                    src="/User.png" 
                    alt="User" 
                    className="w-8 h-8 flex-shrink-0"
                  />
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && !isStreaming && (
            <div className="flex gap-3 justify-start">
              <img 
                src="/Chatbot.png" 
                alt="AI Assistant" 
                className="w-6 h-6 flex-shrink-0"
              />
              <div className="max-w-[80%]">
                <div className="flex gap-1 drop-shadow-sm">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Text Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2 mt-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              if (!isDeployed) {
                setIsDeployed(true);
              }
            }}
            placeholder="Ask about supplements..."
            className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5 text-white placeholder-white/70 font-opensans text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
            disabled={isTyping}
          />
          <motion.button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-8 h-8 bg-vibrant-orange hover:bg-orange-600 disabled:bg-dark-grey disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-3 h-3" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};