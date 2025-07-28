import { NextResponse } from 'next/server';
import { StripeProductService } from '../../../src/services/stripeProductService';

export async function GET() {
  try {
    const products = await StripeProductService.getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Stripe products' },
      { status: 500 }
    );
  }
} 