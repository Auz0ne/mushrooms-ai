import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../src/lib/stripe';
import { StripeProductService } from '../../../src/services/stripeProductService';

export async function POST(request: NextRequest) {
  try {
    const { cartItems, successUrl, cancelUrl } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Get Stripe products and create line items
    const stripeProducts = await StripeProductService.getAllProducts();
    
    const lineItems = cartItems.map((item: any) => {
      // Find matching Stripe product by name
      const stripeProduct = stripeProducts.find(sp => 
        sp.name.toLowerCase().includes(item.product.name.toLowerCase()) ||
        item.product.name.toLowerCase().includes(sp.name.toLowerCase())
      );

      if (stripeProduct) {
        // Use existing Stripe product
        return {
          price: stripeProduct.priceId,
          quantity: item.quantity,
        };
      } else {
        // Fallback to dynamic pricing
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              description: item.product.description,
              images: [item.product.image],
            },
            unit_amount: Math.round(item.product.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      }
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata: {
        cartItems: JSON.stringify(cartItems.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }))),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 