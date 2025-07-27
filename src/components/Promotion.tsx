import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface PromotionProps {
  cartItems: CartItem[];
  onAddProducts: (productNames: string[]) => void;
}

interface ArchetypeData {
  id: string;
  name: string;
  icon: string;
  requiredMushrooms: string[];
  discount: number;
  description: string;
}

const archetypes: ArchetypeData[] = [
  {
    id: 'mentalist',
    name: 'Mentalist',
    icon: '/compressed_Brain-Photoroom.png',
    requiredMushrooms: ["Lion's Mane", 'Cordyceps', 'Reishi'],
    discount: 20,
    description: 'Cognitive Power & Focus'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    icon: '/compressed_Shield-Photoroom.png',
    requiredMushrooms: ['Reishi', 'Turkey Tail', 'Chaga'],
    discount: 20,
    description: 'Immunity & Wellness Protection'
  },
  {
    id: 'athlete',
    name: 'Athlete',
    icon: '/compressed_Lightning-Photoroom.png',
    requiredMushrooms: ['Cordyceps', 'King Trumpet', 'Maitake'],
    discount: 20,
    description: 'Energy, Vitality & Fitness'
  },
  {
    id: 'radiant',
    name: 'Radiant',
    icon: '/compressed_Lotus-Photoroom.png',
    requiredMushrooms: ['Tremella', 'Chaga', 'Shiitake'],
    discount: 20,
    description: 'Beauty, Skin & Longevity'
  },
  {
    id: 'zen_seeker',
    name: 'Zen Seeker',
    icon: '/compressed_Spiral-Photoroom.png',
    requiredMushrooms: ['Reishi', 'Poria', 'Maitake'],
    discount: 20,
    description: 'Calm, Stress Relief & Sleep'
  },
  {
    id: 'gut_guru',
    name: 'Gut Guru',
    icon: '/compressed_Drop-Photoroom.png',
    requiredMushrooms: ['Shiitake', 'Turkey Tail', 'Enoki'],
    discount: 20,
    description: 'Digestive & Gut Health'
  }
];

export const Promotion: React.FC<PromotionProps> = ({ cartItems, onAddProducts }) => {
  const cartMushroomNames = cartItems.map(item => item.product.name);
  
  // Find the most relevant archetype to suggest
  const findBestArchetype = (): { archetype: ArchetypeData; missingProducts: string[]; progress: number } | null => {
    let bestMatch = null;
    let highestProgress = 0;
    
    for (const archetype of archetypes) {
      const ownedMushrooms = archetype.requiredMushrooms.filter(required =>
        cartMushroomNames.some(cartName => 
          cartName.toLowerCase().includes(required.toLowerCase())
        )
      );
      
      const missingMushrooms = archetype.requiredMushrooms.filter(required =>
        !cartMushroomNames.some(cartName => 
          cartName.toLowerCase().includes(required.toLowerCase())
        )
      );
      
      const progress = ownedMushrooms.length / archetype.requiredMushrooms.length;
      
      // Only suggest if user has at least 1 mushroom and it's not complete
      if (ownedMushrooms.length > 0 && missingMushrooms.length > 0 && progress > highestProgress) {
        highestProgress = progress;
        bestMatch = {
          archetype,
          missingProducts: missingMushrooms,
          progress
        };
      }
    }
    
    return bestMatch;
  };

  const suggestion = findBestArchetype();
  
  if (!suggestion) {
    return null; // Don't show promotion if no relevant archetype found
  }

  const { archetype, missingProducts } = suggestion;
  const productPrice = 29.99; // Default price per product
  const totalAdditionalCost = missingProducts.length * productPrice;
  
  const formatProductList = (products: string[]) => {
    if (products.length === 1) {
      return `"${products[0]}"`;
    } else if (products.length === 2) {
      return `"${products[0]}" and "${products[1]}"`;
    } else {
      const lastProduct = products[products.length - 1];
      const otherProducts = products.slice(0, -1);
      return `"${otherProducts.join('", "')}" and "${lastProduct}"`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg"
    >
      {/* Header with Icon and Archetype Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <img 
            src={archetype.icon} 
            alt={archetype.name} 
            className="w-12 h-12"
          />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-vibrant-orange rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-inter font-bold text-white text-lg">
            Unlock {archetype.name} Achievement
          </h3>
          <p className="text-white/80 font-opensans text-sm">
            {archetype.description}
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-vibrant-orange font-inter font-bold text-lg">
            {archetype.discount}% OFF
          </div>
          <div className="text-white/60 font-opensans text-xs">
            Total Order
          </div>
        </div>
      </div>

      {/* Missing Products */}
      <div className="mb-4">
        <h4 className="text-white font-inter font-semibold text-sm mb-2">
          Add to complete:
        </h4>
        <div className="space-y-2">
          {missingProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
              <span className="text-white font-opensans text-sm">{product}</span>
              <span className="text-vibrant-orange font-opensans font-semibold text-sm">
                ${productPrice.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        {/* Total Additional Cost */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
          <span className="text-white/80 font-opensans text-sm">
            Additional cost:
          </span>
          <span className="text-white font-inter font-semibold">
            ${totalAdditionalCost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-white font-opensans text-sm leading-relaxed">
            Add {formatProductList(missingProducts)} to unlock the <span className="font-semibold text-vibrant-orange">{archetype.name}</span> achievement
          </p>
        </div>
        
        <motion.button
          onClick={() => {
            // Add all missing products to complete the archetype
            onAddProducts(missingProducts);
          }}
          className="px-6 py-2 bg-vibrant-orange hover:bg-orange-600 text-white font-opensans font-semibold rounded-lg flex items-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};