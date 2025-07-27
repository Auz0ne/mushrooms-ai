import { useState, useEffect } from 'react';
import { Mushroom, Product } from '../types';
import { MushroomService } from '../services/mushroomService';
import { ProductService } from '../services/productService';

export interface MushroomProduct {
  mushroom: Mushroom;
  product: Product | null;
  loading: boolean;
}

export const useMushroomProducts = () => {
  const [mushroomProducts, setMushroomProducts] = useState<MushroomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMushroomProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load mushrooms
      const mushrooms = await MushroomService.getAllMushrooms();
      
      // Load products for each mushroom
      const mushroomProductsData: MushroomProduct[] = await Promise.all(
        mushrooms.map(async (mushroom) => {
          try {
            const product = await ProductService.getProductByMushroomId(mushroom.id);
            return {
              mushroom,
              product,
              loading: false,
            };
          } catch (err) {
            console.error(`Error loading product for mushroom ${mushroom.name}:`, err);
            return {
              mushroom,
              product: null,
              loading: false,
            };
          }
        })
      );

      setMushroomProducts(mushroomProductsData);
    } catch (err) {
      setError('Failed to load mushrooms and products');
      console.error('Error loading mushroom products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get display product (prefer product over mushroom)
  const getDisplayProduct = (mushroomProduct: MushroomProduct): Product => {
    if (mushroomProduct.product) {
      // Use product data but include video from mushroom
      // If product doesn't have image_url, fall back to mushroom photo_url
      const productImage = mushroomProduct.product.image || mushroomProduct.mushroom.photo_url || `https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800`;
      return {
        ...mushroomProduct.product,
        image: productImage,
        video: mushroomProduct.mushroom.video_url || undefined,
      };
    }

    // Fallback to mushroom data if no product exists
    const mushroom = mushroomProduct.mushroom;
    return {
      id: mushroom.id,
      name: mushroom.name,
      price: 29.99, // Default price
      image: mushroom.photo_url || `https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800`,
      video: mushroom.video_url || undefined,
      description: mushroom.story_behind_consumption || 'Premium mushroom supplement',
      benefits: mushroom.expected_effects || [],
      tags: mushroom.expected_effects?.slice(0, 3) || ['Natural', 'Organic'],
      category: 'supplement',
      inStock: true,
    };
  };

  // Get all display products
  const getDisplayProducts = (): Product[] => {
    return mushroomProducts.map(getDisplayProduct);
  };

  // Get mushroom product by index
  const getMushroomProductByIndex = (index: number): MushroomProduct | null => {
    return mushroomProducts[index] || null;
  };

  // Get display product by index
  const getDisplayProductByIndex = (index: number): Product | null => {
    const mushroomProduct = getMushroomProductByIndex(index);
    return mushroomProduct ? getDisplayProduct(mushroomProduct) : null;
  };

  // Load on mount
  useEffect(() => {
    loadMushroomProducts();
  }, []);

  return {
    mushroomProducts,
    loading,
    error,
    loadMushroomProducts,
    getDisplayProduct,
    getDisplayProducts,
    getMushroomProductByIndex,
    getDisplayProductByIndex,
  };
}; 