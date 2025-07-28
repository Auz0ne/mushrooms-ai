import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trash2, CreditCard, ShoppingCart, Sparkles, X, User, Send } from 'lucide-react';
import { CartItem, Product } from '../types';
import { getCategoryForEffect } from '../utils/categoryIcons';
import { ProductService } from '../services/productService';
import { StripeService } from '../services/stripeService';
import { Promotion } from './Promotion';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddToCart: (product: any) => void;
  cartTotal: number;
  onGoBack: () => void;
  onPay: () => void;
  onProductClick: (productId: string) => void;
}

interface CategoryScore {
  name: string;
  icon: string;
  score: number;
  maxScore: number;
}

interface Archetype {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requirements: string[];
  discount: number; // percentage
  isUnlocked: boolean;
  missingItems: string[];
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  cartTotal,
  onGoBack,
  onPay,
  onProductClick,
}) => {
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);
  const [stripeProducts, setStripeProducts] = useState<any[]>([]);
  const [archetypes, setArchetypes] = useState<Archetype[]>([
    {
      id: 'cognitive_warrior',
      name: 'Cognitive Warrior',
      description: 'Master of mental clarity',
      icon: <Sparkles className="w-4 h-4" />,
      requirements: ["lion's mane"],
      discount: 10,
      isUnlocked: false,
      missingItems: [],
    },
    {
      id: 'zen_guardian',
      name: 'Zen Guardian',
      description: 'Balanced protector',
      icon: <Sparkles className="w-4 h-4" />,
      requirements: ['reishi'],
      discount: 10,
      isUnlocked: false,
      missingItems: [],
    },
    {
      id: 'energy_champion',
      name: 'Energy Champion',
      description: 'Unstoppable vitality',
      icon: <Sparkles className="w-4 h-4" />,
      requirements: ['cordyceps'],
      discount: 10,
      isUnlocked: false,
      missingItems: [],
    },
    {
      id: 'immune_fortress',
      name: 'Immune Fortress',
      description: 'Unbreakable defender',
      icon: <Sparkles className="w-4 h-4" />,
      requirements: ['chaga', 'turkey tail'],
      discount: 15,
      isUnlocked: false,
      missingItems: [],
    },
    {
      id: 'wellness_sage',
      name: 'Wellness Sage',
      description: 'Complete wellness master',
      icon: <Sparkles className="w-4 h-4" />,
      requirements: ['reishi', "lion's mane", 'cordyceps', 'chaga'],
      discount: 25,
      isUnlocked: false,
      missingItems: [],
    },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, content: string, sender: 'user' | 'bot'}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<string>('');
  const aiAssistantRef = useRef<HTMLDivElement>(null);

  const [completedArchetypes, setCompletedArchetypes] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await ProductService.getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();
  }, []);

  // Load Stripe products on component mount
  useEffect(() => {
    const loadStripeProducts = async () => {
      try {
        const response = await fetch('/api/stripe/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStripeProducts(data);
        console.log('Loaded Stripe products:', data.length);
        console.log('Stripe products metadata:', data.map((sp: any) => ({
          name: sp.name,
          mushroom_id: sp.metadata.mushroom_id,
          price: sp.price
        })));
      } catch (error) {
        console.error('Failed to load Stripe products:', error);
      }
    };

    loadStripeProducts();
  }, []);

  // Helper function to get the associated product for a mushroom
  const getAssociatedProduct = (mushroomId: string): Product | null => {
    return products.find(product => product.mushroom_id === mushroomId) || null;
  };

  // Helper function to get Stripe product data for a mushroom
  const getStripeProductForMushroom = (mushroomId: string) => {
    console.log('Looking for Stripe product for mushroom ID:', mushroomId);
    console.log('Available Stripe products:', stripeProducts.map(sp => ({
      name: sp.name,
      mushroom_id: sp.metadata.mushroom_id
    })));
    
    const found = stripeProducts.find(sp => sp.metadata.mushroom_id === mushroomId);
    console.log('Found Stripe product:', found ? found.name : 'None');
    return found;
  };

  // Helper function to get Stripe product data for a mushroom by name
  const getStripeProductForMushroomByName = (mushroomName: string) => {
    // Map mushroom names to Stripe product IDs
    const nameToStripeId: { [key: string]: string } = {
      'reishi': 'reishi',
      'lion\'s mane': 'lions_mane',
      'lions mane': 'lions_mane',
      'cordyceps': 'cordyceps',
      'chaga': 'chaga',
      'maitake': 'maitake',
      'shiitake': 'shiitake',
      'turkey tail': 'turkey_tail',
      'tremella': 'tremella',
      'agaricus blazei': 'agaricus_blazei',
      'poria': 'poria',
      'king trumpet': 'king_trumpet',
      'enoki': 'enoki',
      'mesima': 'mesima',
      'polyporus': 'polyporus'
    };
    
    const mushroomNameLower = mushroomName.toLowerCase();
    const stripeId = nameToStripeId[mushroomNameLower];
    
    console.log('Looking for Stripe product by name:', {
      mushroomName,
      mushroomNameLower,
      stripeId
    });
    
    if (!stripeId) {
      console.log('No mapping found for mushroom name:', mushroomName);
      return null;
    }
    
    const found = stripeProducts.find(sp => sp.metadata.mushroom_id === stripeId);
    console.log('Found Stripe product by name:', found ? found.name : 'None');
    return found;
  };

  // Helper function to get effects for a mushroom
  const getMushroomEffects = (mushroomName: string): string[] => {
    const name = mushroomName.toLowerCase();
    if (name.includes('reishi')) {
      return ['immunity', 'stress relief', 'sleep'];
    } else if (name.includes("lion's mane")) {
      return ['focus', 'memory', 'brain health'];
    } else if (name.includes('cordyceps')) {
      return ['energy', 'stamina', 'vitality'];
    } else if (name.includes('chaga')) {
      return ['immunity', 'anti-inflammatory'];
    } else if (name.includes('turkey tail')) {
      return ['immunity', 'gut health'];
    } else if (name.includes('maitake')) {
      return ['metabolic health', 'immunity'];
    } else if (name.includes('shiitake')) {
      return ['immunity', 'cardiovascular health'];
    } else if (name.includes('oyster')) {
      return ['cholesterol', 'anti-inflammatory'];
    } else {
      // Default effects for any other mushroom
      return ['wellness', 'anti-inflammatory'];
    }
  };

  // Check for completed archetypes whenever cart changes
  useEffect(() => {
    const checkCompletedArchetypes = () => {
      const cartProductNames = new Set(
        cartItems.map(item => item.product.name.toLowerCase())
      );
      
      const newCompletedArchetypes: string[] = [];
      
      // Check each archetype
      if (cartProductNames.has("lion's mane") && cartProductNames.has('cordyceps') && cartProductNames.has('reishi')) {
        newCompletedArchetypes.push('Mentalist');
      }
      if (cartProductNames.has('reishi') && cartProductNames.has('turkey tail') && cartProductNames.has('chaga')) {
        newCompletedArchetypes.push('Guardian');
      }
      if (cartProductNames.has('cordyceps') && cartProductNames.has('king trumpet') && cartProductNames.has('maitake')) {
        newCompletedArchetypes.push('Athlete');
      }
      if (cartProductNames.has('tremella') && cartProductNames.has('chaga') && cartProductNames.has('shiitake')) {
        newCompletedArchetypes.push('Radiant');
      }
      if (cartProductNames.has('reishi') && cartProductNames.has('poria') && cartProductNames.has('maitake')) {
        newCompletedArchetypes.push('Zen Seeker');
      }
      if (cartProductNames.has('shiitake') && cartProductNames.has('turkey tail') && cartProductNames.has('enoki')) {
        newCompletedArchetypes.push('Gut Guru');
      }
      
      setCompletedArchetypes(newCompletedArchetypes);
    };
    
    checkCompletedArchetypes();
  }, [cartItems]);

  // Available products mapping (you can expand this based on your actual product data)
  const availableProducts = {
    "lion's mane": { id: 'lions-mane', name: "Lion's Mane", price: 29.99 },
    "cordyceps": { id: 'cordyceps', name: 'Cordyceps', price: 39.99 },
    "reishi": { id: 'reishi', name: 'Reishi', price: 34.99 },
    "turkey tail": { id: 'turkey-tail', name: 'Turkey Tail', price: 27.99 },
    "chaga": { id: 'chaga', name: 'Chaga', price: 32.99 },
    "king trumpet": { id: 'king-trumpet', name: 'King Trumpet', price: 29.99 },
    "maitake": { id: 'maitake', name: 'Maitake', price: 31.99 },
    "tremella": { id: 'tremella', name: 'Tremella', price: 28.99 },
    "shiitake": { id: 'shiitake', name: 'Shiitake', price: 26.99 },
    "poria": { id: 'poria', name: 'Poria', price: 30.99 },
    "enoki": { id: 'enoki', name: 'Enoki', price: 25.99 },
  };

  const handleAskAI = (effect: string, mushroomName: string) => {
    setSelectedEffect(effect);
    setShowChatbot(true);
    
    // Scroll to AI Assistant section
    setTimeout(() => {
      aiAssistantRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
    
    // Generate initial AI response about the effect
    const initialMessage = generateEffectResponse(effect, mushroomName);
    setChatMessages([{
      id: Date.now().toString(),
      content: initialMessage,
      sender: 'bot'
    }]);
  };

  const generateEffectResponse = (effect: string, mushroomName: string): string => {
    const responses: Record<string, string> = {
      'focus': `${mushroomName} enhances focus through its unique compounds called hericenones and erinacines, which stimulate nerve growth factor (NGF) production. This promotes the growth and maintenance of neurons, leading to improved cognitive function and sustained attention.`,
      'memory': `${mushroomName} supports memory formation by promoting neuroplasticity - the brain's ability to form new neural connections. The bioactive compounds help protect existing neurons while encouraging the growth of new ones, particularly in areas crucial for memory processing.`,
      'brain health': `${mushroomName} provides comprehensive brain health support through neuroprotective compounds that reduce inflammation, support myelin sheath repair, and enhance overall cognitive resilience against age-related decline.`,
      'stress relief': `${mushroomName} acts as an adaptogen, helping your body manage stress more effectively by regulating cortisol levels and supporting the hypothalamic-pituitary-adrenal (HPA) axis. This leads to a calmer, more balanced stress response.`,
      'immunity': `${mushroomName} contains powerful beta-glucans and other polysaccharides that modulate immune system function, enhancing your body's natural defense mechanisms while maintaining immune balance.`,
      'energy': `${mushroomName} supports cellular energy production by improving oxygen utilization and ATP synthesis in mitochondria, leading to sustained energy without the crash associated with stimulants.`,
      'stamina': `${mushroomName} enhances physical endurance by improving oxygen delivery to muscles and supporting efficient energy metabolism, allowing for better performance during physical activities.`,
      'vitality': `${mushroomName} promotes overall vitality through its adaptogenic properties, supporting multiple body systems simultaneously for enhanced well-being and resilience.`
    };
    
    return responses[effect.toLowerCase()] || `${mushroomName} provides ${effect} benefits through its unique bioactive compounds that work synergistically with your body's natural processes.`;
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: chatInput,
      sender: 'user' as const
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: `That's a great question about ${selectedEffect}! Based on current research, the effects typically become noticeable within 2-4 weeks of consistent use. The key is maintaining a regular supplementation schedule to allow the bioactive compounds to build up in your system.`,
        sender: 'bot' as const
      };
      setChatMessages(prev => [...prev, botMessage]);
      setIsChatTyping(false);
    }, 1500);
  };

  // Calculate category scores and archetypes
  useEffect(() => {
    const categoryMap = new Map<string, { score: number; maxScore: number; icon: string }>();
    
    // Initialize categories
    const allCategories = [
      { name: 'Immunity & Disease Support', icon: '/compressed_Shield-Photoroom.png' },
      { name: 'Cognitive & Mental Health', icon: '/compressed_Brain-Photoroom.png' },
      { name: 'Vitality, Energy & Physical Performance', icon: '/compressed_Lightning-Photoroom.png' },
      { name: 'Metabolic, Digestive & Detox', icon: '/compressed_Drop-Photoroom.png' },
      { name: 'Beauty, Skin & Anti-Aging', icon: '/compressed_Lotus-Photoroom.png' },
      { name: 'Cardiovascular & Circulatory Health', icon: '/compressed_Heart-Photoroom.png' },
      { name: 'General Wellness & Anti-inflammatory', icon: '/compressed_Spiral-Photoroom.png' },
    ];

    allCategories.forEach(cat => {
      categoryMap.set(cat.name, { score: 0, maxScore: 10, icon: cat.icon });
    });

    // Calculate scores from cart items
    cartItems.forEach(item => {
      const mushroomName = item.product.name;
      const effects = getMushroomEffects(mushroomName);
      
      effects.forEach(effect => {
        const category = getCategoryForEffect(effect);
        if (category && categoryMap.has(category.name)) {
          const current = categoryMap.get(category.name)!;
          current.score = Math.min(current.score + item.quantity * 2, current.maxScore);
        }
      });
    });

    const calculatedScores = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      icon: data.icon,
      score: data.score,
      maxScore: data.maxScore,
    })).filter(cat => cat.score > 0);
    
    setCategoryScores(calculatedScores);

  }, [cartItems]);

  const getDiscountAmount = () => {
    // Only apply discount if there are completed archetypes from the Promotion component
    if (completedArchetypes.length === 0) return 0;
    
    // Apply 20% discount for completed archetypes
    return (cartTotal * 20) / 100;
  };

  const finalTotal = cartTotal - getDiscountAmount();

  const handleAddMissingItem = (mushroomName: string) => {
    // This would typically add the mushroom to cart
    console.log(`Adding ${mushroomName} to complete archetype`);
  };

  const handleAddProducts = (productNames: string[]) => {
    productNames.forEach(productName => {
      const productKey = productName.toLowerCase();
      const productData = availableProducts[productKey as keyof typeof availableProducts];
      
      if (productData) {
        // Find the actual product price from database
        const actualProduct = products.find(p => 
          p.name.toLowerCase().includes(productName.toLowerCase()) ||
          productName.toLowerCase().includes(p.name.toLowerCase())
        );
        
        // Create a product object that matches your Product interface
        const product = {
          id: productData.id,
          name: productData.name,
          price: actualProduct ? actualProduct.price : productData.price, // Use actual price if found
          image: `https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800`,
          description: `Premium ${productData.name} supplement`,
          benefits: ['Natural wellness support'],
          tags: ['Organic', 'Premium'],
          category: 'supplement',
          inStock: true,
        };
        
        // Add to cart
        onAddToCart(product);
      }
    });
    
    // The useEffect will automatically detect completed archetypes
  };

  // Stripe payment handler
  const handleStripePayment = async () => {
    try {
      await StripeService.createCheckoutSession({
        cartItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/`,
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <header className="p-4">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onGoBack}
            className="p-2 rounded-full hover:bg-white/20 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="font-inter font-bold text-xl text-white">Checkout Page</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Completed Archetypes Badges */}
        {completedArchetypes.length > 0 && (
          <div className="mx-4 mb-6 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
            <div className="flex flex-wrap gap-3 justify-start">
              {completedArchetypes.map((archetypeName) => {
                // Map archetype names to their icons
                const archetypeIcons: Record<string, string> = {
                  'Mentalist': '/compressed_Brain-Photoroom.png',
                  'Guardian': '/compressed_Shield-Photoroom.png',
                  'Athlete': '/compressed_Lightning-Photoroom.png',
                  'Radiant': '/compressed_Lotus-Photoroom.png',
                  'Zen Seeker': '/compressed_Spiral-Photoroom.png',
                  'Gut Guru': '/compressed_Drop-Photoroom.png',
                };
                
                const archetypeIcon = archetypeIcons[archetypeName] || '/compressed_Spiral-Photoroom.png';
                
                return (
                  <motion.div
                    key={archetypeName}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-2 p-3"
                  >
                    <img src={archetypeIcon} alt={archetypeName} className="w-8 h-8" />
                    <span className="text-white font-opensans font-semibold text-xs text-center">
                      {archetypeName}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Your Enhanced Self */}
        {categoryScores.length > 0 && (
          <div className="p-4">
            <h2 className="font-inter font-semibold text-white mb-4">Your Enhanced Self</h2>
            <div className="space-y-3">
              {categoryScores.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={category.icon} alt={category.name} className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-opensans text-sm">{category.name}</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-vibrant-orange to-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Effects from mushrooms in this category */}
                  <div className="ml-8 space-y-2 mt-3">
                    {(() => {
                      const effectsInCategory: { effect: string; mushroomName: string }[] = [];
                      
                      cartItems.forEach(item => {
                        const mushroomName = item.product.name;
                        const effects = getMushroomEffects(mushroomName);

                        effects.forEach(effect => {
                          const effectCategory = getCategoryForEffect(effect);
                          if (effectCategory && effectCategory.name === category.name) {
                            effectsInCategory.push({ effect, mushroomName: item.product.name });
                          }
                        });
                      });

                      return effectsInCategory.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <span className="text-white/90 font-opensans text-sm capitalize bg-white/5 px-3 py-1 rounded-full">
                              {item.effect}
                            </span>
                            <span className="text-white/60 font-opensans text-xs bg-white/5 px-2 py-1 rounded-full">
                              from {item.mushroomName}
                            </span>
                          </div>
                          <motion.button
                            onClick={() => handleAskAI(item.effect, item.mushroomName)}
                            className="px-3 py-1 bg-vibrant-orange/80 hover:bg-vibrant-orange text-white text-xs font-opensans font-medium rounded-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Ask AI
                          </motion.button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Promotion Section */}
        <Promotion 
          cartItems={cartItems}
          onAddProducts={handleAddProducts}
          products={products}
        />

        {/* Shopping List */}
        <div className="p-4">
          <h2 className="font-inter font-semibold text-white mb-4">Your Supplements</h2>
          <div className="space-y-3">
            {cartItems.map((item) => {
              console.log('Processing cart item:', {
                mushroomId: item.product.id,
                mushroomName: item.product.name,
                mushroomPrice: item.product.price,
                mushroomIdType: typeof item.product.id,
                mushroomIdLength: item.product.id?.length
              });
              
              // Try to find Stripe product by mushroom name instead of ID
              const stripeProduct = getStripeProductForMushroomByName(item.product.name);
              const displayName = stripeProduct?.name || item.product.name;
              const displayPrice = stripeProduct?.price || item.product.price;
              const displayImage = stripeProduct?.image || item.product.image;
              
              console.log('Display data:', {
                displayName,
                displayPrice,
                displayImage,
                hasStripeProduct: !!stripeProduct
              });
              
              return (
                <motion.div 
                  key={item.product.id} 
                  className="flex items-center gap-3 bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => console.log('Navigate to product:', displayName)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-inter font-semibold text-white text-sm">{displayName}</h3>
                    <p className="text-vibrant-orange font-opensans font-semibold text-sm">${displayPrice}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Minus className="w-3 h-3" />
                    </motion.button>
                    
                    <span className="w-6 text-center font-opensans font-semibold text-white text-sm">
                      {item.quantity}
                    </span>
                    
                    <motion.button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-3 h-3" />
                    </motion.button>
                  </div>

                  <motion.button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1 rounded-full hover:bg-red-500/20 text-red-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Checkout Information and AI Assistant Block */}
      <div className="pb-24">
        {/* Order Summary */}
        <div className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-opensans text-white/80">Subtotal:</span>
              <span className="font-opensans font-semibold text-white">${cartTotal.toFixed(2)}</span>
            </div>
            {getDiscountAmount() > 0 && (
              <div className="flex justify-between">
                <span className="font-opensans text-green-400">Archetype Discount:</span>
                <span className="font-opensans font-semibold text-green-400">-${getDiscountAmount().toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-white/20 pt-2">
              <div className="flex justify-between">
                <span className="font-inter font-bold text-lg text-white">Total:</span>
                <span className="font-inter font-bold text-xl text-vibrant-orange">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Section - Full Width */}
        {showChatbot && (
          <div ref={aiAssistantRef} className="px-4 mt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-inter font-semibold text-white text-lg">
                Ask our AI for supplement advice
              </h3>
              <motion.button
                onClick={() => setShowChatbot(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white/60"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Chat Messages */}
            <div className="overflow-y-auto space-y-3 mb-4 max-h-80">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-6 h-6 bg-transparent border-2 border-white rounded-full flex items-center justify-center flex-shrink-0">
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-vibrant-orange text-white'
                        : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white'
                    }`}
                  >
                    <p className="font-opensans text-xs leading-snug">
                      {message.content}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-6 h-6 bg-dark-grey rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isChatTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-6 h-6 bg-transparent border-2 border-white rounded-full flex items-center justify-center">
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-3 py-2">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Text Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(); }} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about supplements..."
                className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5 text-white placeholder-white/70 font-opensans text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                disabled={isChatTyping}
              />
              <motion.button
                type="submit"
                disabled={!chatInput.trim() || isChatTyping}
                className="w-10 h-10 bg-vibrant-orange hover:bg-orange-600 disabled:bg-dark-grey disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        )}
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-matte/95 backdrop-blur-sm border-t border-white/20">
        <motion.button
          onClick={handleStripePayment}
          className="w-full bg-vibrant-orange hover:bg-orange-600 text-white font-opensans font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CreditCard className="w-5 h-5" />
          Complete Purchase - ${finalTotal.toFixed(2)}
        </motion.button>
      </div>
    </div>
  );
};