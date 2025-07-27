import { supabase } from '../lib/supabase';
import { DatabaseProduct, Product } from '../types';

export class ProductService {
  /**
   * Get all products from the database
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return data?.map(this.convertToProduct) || [];
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      return [];
    }
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      return data ? this.convertToProduct(data) : null;
    } catch (error) {
      console.error('Error in getProductById:', error);
      return null;
    }
  }

  /**
   * Get products by mushroom ID
   */
  static async getProductsByMushroomId(mushroomId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('mushroom_id', mushroomId)
        .order('name');

      if (error) {
        console.error('Error fetching products by mushroom:', error);
        return [];
      }

      return data?.map(this.convertToProduct) || [];
    } catch (error) {
      console.error('Error in getProductsByMushroomId:', error);
      return [];
    }
  }

  /**
   * Get the first product for a mushroom (for display purposes)
   */
  static async getProductByMushroomId(mushroomId: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('mushroom_id', mushroomId)
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching product by mushroom:', error);
        return null;
      }

      return data ? this.convertToProduct(data) : null;
    } catch (error) {
      console.error('Error in getProductByMushroomId:', error);
      return null;
    }
  }

  /**
   * Search products by name or description
   */
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
        .order('name');

      if (error) {
        console.error('Error searching products:', error);
        return [];
      }

      return data?.map(this.convertToProduct) || [];
    } catch (error) {
      console.error('Error in searchProducts:', error);
      return [];
    }
  }

  /**
   * Get products by key benefits
   */
  static async getProductsByBenefit(benefit: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .contains('key_benefits', [benefit])
        .order('name');

      if (error) {
        console.error('Error fetching products by benefit:', error);
        return [];
      }

      return data?.map(this.convertToProduct) || [];
    } catch (error) {
      console.error('Error in getProductsByBenefit:', error);
      return [];
    }
  }

  /**
   * Convert database product to frontend product format
   */
  private static convertToProduct(dbProduct: DatabaseProduct): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      price: dbProduct.price,
      image: dbProduct.image_url || `https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800`, // Use product image or fallback
      description: dbProduct.short_description,
      benefits: dbProduct.key_benefits,
      tags: ['Organic', 'Premium'], // Default tags
      category: 'supplement',
      inStock: true,
      // Additional fields
      main_ingredient: dbProduct.main_ingredient,
      format: dbProduct.format,
      pills_per_container: dbProduct.pills_per_container,
      daily_dose: dbProduct.daily_dose,
      use_instructions: dbProduct.use_instructions,
      key_benefits: dbProduct.key_benefits,
      short_description: dbProduct.short_description,
      certifications_notes: dbProduct.certifications_notes,
      mushroom_id: dbProduct.mushroom_id || undefined,
    };
  }
} 