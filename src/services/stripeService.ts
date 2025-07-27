import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../types';

let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export interface CheckoutOptions {
  cartItems: CartItem[];
  successUrl?: string;
  cancelUrl?: string;
}

export class StripeService {
  /**
   * Create a checkout session and redirect to Stripe
   */
  static async createCheckoutSession(options: CheckoutOptions) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  }

  /**
   * Get Stripe instance for other operations
   */
  static async getStripeInstance() {
    return await getStripe();
  }
} 