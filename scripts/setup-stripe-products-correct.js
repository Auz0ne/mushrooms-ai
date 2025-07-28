const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

// This represents the 14 products from your Supabase products table
const products = [
  {
    name: 'Reishi Immune Calm',
    description: 'Premium Reishi mushroom supplement for immune support and stress relief',
    price: 3499, // $34.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'reishi-immune-calm',
      category: 'immunity',
      benefits: 'Immune Support, Stress Relief, Adaptogen'
    }
  },
  {
    name: 'Lion\'s Mane Focus',
    description: 'Pure Lion\'s Mane for mental clarity and brain health',
    price: 2999, // $29.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'lions-mane-focus',
      category: 'cognitive',
      benefits: 'Brain Health, Focus, Memory'
    }
  },
  {
    name: 'Cordyceps Vitality',
    description: 'Energizing Cordyceps for natural endurance and stamina',
    price: 3999, // $39.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'cordyceps-vitality',
      category: 'energy',
      benefits: 'Energy, Stamina, Athletic Support'
    }
  },
  {
    name: 'Chaga Antioxidant',
    description: 'Wild-harvested Chaga for balanced immunity and antioxidants',
    price: 3299, // $32.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'chaga-antioxidant',
      category: 'immunity',
      benefits: 'Antioxidants, Immune Support, Anti-Aging'
    }
  },
  {
    name: 'Maitake Wellness',
    description: 'Maitake for metabolic health and immune support',
    price: 3199, // $31.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'maitake-wellness',
      category: 'metabolic',
      benefits: 'Metabolic Health, Immunity, Blood Sugar'
    }
  },
  {
    name: 'Shiitake Digestive',
    description: 'Shiitake mushroom for heart and gut health',
    price: 2699, // $26.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'shiitake-digestive',
      category: 'digestive',
      benefits: 'Heart Health, Digestion, Immune'
    }
  },
  {
    name: 'Turkey Tail Defend',
    description: 'Turkey Tail for microbiome and immune support',
    price: 2799, // $27.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'turkey-tail-defend',
      category: 'immunity',
      benefits: 'Immunity, Gut Health, Resilience'
    }
  },
  {
    name: 'Tremella Beauty',
    description: 'Tremella for radiant skin and youthfulness',
    price: 2899, // $28.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'tremella-beauty',
      category: 'beauty',
      benefits: 'Skin Hydration, Beauty, Anti-Aging'
    }
  },
  {
    name: 'Agaricus Blazei Protect',
    description: 'Agaricus blazei for immune and vitality support',
    price: 3399, // $33.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'agaricus-blazei-protect',
      category: 'immunity',
      benefits: 'Immunity, Anti-Stress, Resilience'
    }
  },
  {
    name: 'Poria Serenity',
    description: 'Poria for sleep and digestive comfort',
    price: 3099, // $30.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'poria-serenity',
      category: 'calm',
      benefits: 'Calm, Sleep, Digestive'
    }
  },
  {
    name: 'King Trumpet Heart',
    description: 'King Trumpet for heart health and antioxidants',
    price: 2999, // $29.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'king-trumpet-heart',
      category: 'heart',
      benefits: 'Heart Health, Antioxidant, Immune'
    }
  },
  {
    name: 'Enoki Gut Health',
    description: 'Enoki for gut health and immunity',
    price: 2599, // $25.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'enoki-gut-health',
      category: 'gut',
      benefits: 'Gut Health, Immunity, Wellness'
    }
  },
  {
    name: 'Oyster Recovery',
    description: 'Oyster mushroom for anti-inflammatory and immunity',
    price: 2499, // $24.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'oyster-recovery',
      category: 'recovery',
      benefits: 'Anti-Inflammatory, Immunity, Recovery'
    }
  },
  {
    name: 'Mesima Defense',
    description: 'Mesima for immune and liver health support',
    price: 3599, // $35.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      product_id: 'mesima-defense',
      category: 'defense',
      benefits: 'Anti-Tumor, Immunity, Liver Health'
    }
  }
];

async function setupStripeProducts() {
  console.log('Setting up Stripe products...');
  
  // First, let's delete all existing products to start fresh
  console.log('Deleting existing products...');
  const existingProducts = await stripe.products.list({ limit: 100 });
  for (const product of existingProducts.data) {
    console.log(`Deleting product: ${product.name}`);
    await stripe.products.del(product.id);
  }
  
  console.log('Creating new products...');
  
  for (const productData of products) {
    try {
      // Create the product
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        images: [productData.image],
        metadata: productData.metadata,
      });

      // Create the price for the product
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: productData.price,
        currency: 'usd',
      });

      // Update the product to set the default price
      await stripe.products.update(product.id, {
        default_price: price.id,
      });

      console.log(`✅ Created product: ${productData.name} (ID: ${product.id}, Price: ${price.id})`);
    } catch (error) {
      console.error(`❌ Error creating product ${productData.name}:`, error);
    }
  }
  
  console.log('✅ Stripe products setup complete!');
  console.log(`Created ${products.length} products in Stripe.`);
}

// Run the setup
setupStripeProducts().catch(console.error); 