import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all products
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.searchProducts(query);
      setProducts(data);
    } catch (err) {
      setError('Failed to search products');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get products by benefit
  const getProductsByBenefit = async (benefit: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.getProductsByBenefit(benefit);
      setProducts(data);
    } catch (err) {
      setError('Failed to get products by benefit');
      console.error('Error getting products by benefit:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get products by mushroom ID
  const getProductsByMushroomId = async (mushroomId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.getProductsByMushroomId(mushroomId);
      setProducts(data);
    } catch (err) {
      setError('Failed to get products by mushroom');
      console.error('Error getting products by mushroom:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    searchProducts,
    getProductsByBenefit,
    getProductsByMushroomId,
  };
}; 