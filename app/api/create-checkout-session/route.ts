import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../src/lib/stripe';
import { StripeProductService } from '../../../src/services/stripeProductService';

export async function POST(request: NextRequest) {
  try {
    // Test Stripe connection
    console.log('Testing Stripe connection...');
    try {
      const testAccount = await stripe.accounts.retrieve();
      console.log('Stripe connection successful');
    } catch (stripeError: any) {
      console.error('Stripe connection failed:', stripeError);
      return NextResponse.json(
        { error: 'Stripe configuration error', details: stripeError.message },
        { status: 500 }
      );
    }

    const { cartItems, successUrl, cancelUrl } = await request.json();

    console.log('Creating checkout session with:', {
      cartItemsCount: cartItems?.length,
      successUrl,
      cancelUrl,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    });

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Get Stripe products and create line items
    const stripeProducts = await StripeProductService.getAllProducts();
    console.log('Available Stripe products:', stripeProducts.length);
    
    // Map mushroom names to actual product names (from products table)
    const mushroomToProductName: { [key: string]: string } = {
      'reishi': 'Reishi Immune Calm',
      'lion\'s mane': 'Lion\'s Mane Focus',
      'lions mane': 'Lion\'s Mane Focus',
      'cordyceps': 'Cordyceps Vitality',
      'chaga': 'Chaga Antioxidant',
      'maitake': 'Maitake Wellness',
      'shiitake': 'Shiitake Digestive',
      'turkey tail': 'Turkey Tail Defend',
      'tremella': 'Tremella Beauty',
      'agaricus blazei': 'Agaricus Blazei Protect',
      'poria': 'Poria Serenity',
      'king trumpet': 'King Trumpet Heart',
      'enoki': 'Enoki Gut Health',
      'oyster': 'Oyster Recovery',
      'mesima': 'Mesima Defense'
    };
    
    const lineItems = cartItems.map((item: any) => {
      console.log('Processing cart item:', item.product.name);
      
      // Use name-based matching to find the actual product name
      const mushroomNameLower = item.product.name.toLowerCase();
      const productName = mushroomToProductName[mushroomNameLower];
      
      console.log('Looking for Stripe product by name:', {
        mushroomName: item.product.name,
        mushroomNameLower,
        productName
      });
      
      if (!productName) {
        console.log('No mapping found for mushroom name:', item.product.name);
        // Fallback to dynamic pricing
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              description: item.product.description || `Premium ${item.product.name} supplement`,
              images: [item.product.image],
            },
            unit_amount: Math.round(item.product.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      }
      
      // Find matching Stripe product by actual product name
      const stripeProduct = stripeProducts.find(sp => 
        sp.name === productName
      );

      if (stripeProduct) {
        console.log('Found matching Stripe product for mushroom:', stripeProduct.name);
        return {
          price: stripeProduct.priceId,
          quantity: item.quantity,
        };
      } else {
        console.log('No matching Stripe product found for mushroom, using dynamic pricing');
        // Fallback to dynamic pricing for mushrooms
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              description: item.product.description || `Premium ${item.product.name} supplement`,
              images: [item.product.image],
            },
            unit_amount: Math.round(item.product.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      }
    });

    console.log('Line items created:', lineItems.length);

    // Validate line items
    if (lineItems.length === 0) {
      console.error('No valid line items created');
      return NextResponse.json(
        { error: 'No valid products found for checkout' },
        { status: 400 }
      );
    }

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

    console.log('Checkout session created successfully:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      decline_code: error.decline_code
    });
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
} 