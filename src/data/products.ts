import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: "Lion's Mane",
    price: 29.99,
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Boost cognitive function and mental clarity with our premium Lion\'s Mane extract.',
    benefits: [
      'Enhanced cognitive function',
      'Improved memory and focus',
      'Supports nerve health',
      'May help with anxiety and depression'
    ],
    tags: ['Focus', 'Memory', 'Cognitive'],
    category: 'cognitive',
    inStock: true,
  },
  {
    id: '2',
    name: 'Reishi',
    price: 34.99,
    image: 'https://images.pexels.com/photos/7188808/pexels-photo-7188808.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The "King of Mushrooms" for stress relief and immune support.',
    benefits: [
      'Stress reduction and relaxation',
      'Immune system support',
      'Better sleep quality',
      'Adaptogenic properties'
    ],
    tags: ['Immunity', 'Stress Relief', 'Sleep'],
    category: 'immunity',
    inStock: true,
  },
  {
    id: '3',
    name: 'Cordyceps',
    price: 39.99,
    image: 'https://images.pexels.com/photos/7188850/pexels-photo-7188850.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Natural energy booster and performance enhancer for active lifestyles.',
    benefits: [
      'Increased energy and stamina',
      'Enhanced athletic performance',
      'Respiratory health support',
      'Anti-aging properties'
    ],
    tags: ['Energy', 'Performance', 'Stamina'],
    category: 'energy',
    inStock: true,
  },
  {
    id: '4',
    name: 'Chaga',
    price: 32.99,
    image: 'https://images.pexels.com/photos/7188845/pexels-photo-7188845.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Powerful antioxidant support for overall wellness and vitality.',
    benefits: [
      'High antioxidant content',
      'Immune system support',
      'Anti-inflammatory properties',
      'Skin health benefits'
    ],
    tags: ['Antioxidant', 'Immunity', 'Anti-aging'],
    category: 'immunity',
    inStock: true,
  },
  {
    id: '5',
    name: 'Turkey Tail',
    price: 27.99,
    image: 'https://images.pexels.com/photos/7188842/pexels-photo-7188842.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Comprehensive immune support with powerful polysaccharides.',
    benefits: [
      'Immune system modulation',
      'Gut health support',
      'Antioxidant properties',
      'May support cancer therapy'
    ],
    tags: ['Immunity', 'Gut Health', 'Antioxidant'],
    category: 'immunity',
    inStock: true,
  }
];