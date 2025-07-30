import { stripe } from '../lib/stripe';

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  image: string;
  metadata: {
    mushroom_id: string;
    category: string;
    benefits: string;
    product_id?: string; // Optional for backward compatibility
  };
}

export class StripeProductService {
  /**
   * Get all Stripe products
   */
  static async getAllProducts(): Promise<StripeProduct[]> {
    try {
      const products = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
      });

      return products.data.map((product) => {
        const price = product.default_price as any;
        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: price ? price.unit_amount / 100 : 0, // Convert from cents
          priceId: price ? price.id : '',
          image: product.images?.[0] || '',
          metadata: {
            mushroom_id: product.metadata.mushroom_id || '',
            category: product.metadata.category || '',
            benefits: product.metadata.benefits || '',
            product_id: product.metadata.product_id || '',
          },
        };
      });
    } catch (error) {
      console.error('Error fetching Stripe products:', error);
      return [];
    }
  }

  /**
   * Get a single Stripe product by ID
   */
  static async getProductById(id: string): Promise<StripeProduct | null> {
    try {
      const product = await stripe.products.retrieve(id, {
        expand: ['default_price'],
      });

      const price = product.default_price as any;
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: price ? price.unit_amount / 100 : 0,
        priceId: price ? price.id : '',
        image: product.images?.[0] || '',
        metadata: {
          mushroom_id: product.metadata.mushroom_id || '',
          category: product.metadata.category || '',
          benefits: product.metadata.benefits || '',
          product_id: product.metadata.product_id || '',
        },
      };
    } catch (error) {
      console.error('Error fetching Stripe product:', error);
      return null;
    }
  }

  /**
   * Get Stripe product by mushroom ID
   */
  static async getProductByMushroomId(mushroomId: string): Promise<StripeProduct | null> {
    try {
      const products = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
      });

      const product = products.data.find(p => p.metadata.mushroom_id === mushroomId);
      
      if (!product) return null;

      const price = product.default_price as any;
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: price ? price.unit_amount / 100 : 0,
        priceId: price ? price.id : '',
        image: product.images?.[0] || '',
        metadata: {
          mushroom_id: product.metadata.mushroom_id || '',
          category: product.metadata.category || '',
          benefits: product.metadata.benefits || '',
          product_id: product.metadata.product_id || '',
        },
      };
    } catch (error) {
      console.error('Error fetching Stripe product by mushroom ID:', error);
      return null;
    }
  }
} 