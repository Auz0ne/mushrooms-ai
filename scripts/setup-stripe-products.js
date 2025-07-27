const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const products = [
  {
    name: 'Reishi Immune Calm',
    description: 'Premium Reishi for immunity & nighttime calm',
    price: 3499, // $34.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'reishi',
      category: 'immunity',
      benefits: 'Immunity, stress, restful sleep'
    }
  },
  {
    name: 'Lion\'s Mane Focus',
    description: 'Pure Lion\'s Mane for mental clarity & brain health',
    price: 2999, // $29.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'lions_mane',
      category: 'cognitive',
      benefits: 'Focus, cognition, memory'
    }
  },
  {
    name: 'Cordyceps Vitality',
    description: 'Energizing Cordyceps for natural endurance',
    price: 3999, // $39.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'cordyceps',
      category: 'energy',
      benefits: 'Energy, stamina, workout support'
    }
  },
  {
    name: 'Chaga Antioxidant',
    description: 'Wild-harvested Chaga for balanced immunity',
    price: 3299, // $32.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'chaga',
      category: 'immunity',
      benefits: 'Antioxidants, skin, immunity'
    }
  },
  {
    name: 'Maitake Wellness',
    description: 'Maitake for metabolic, blood sugar, and immune support',
    price: 3199, // $31.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'maitake',
      category: 'metabolic',
      benefits: 'Metabolism, blood sugar, immunity'
    }
  },
  {
    name: 'Shiitake Digestive',
    description: 'Shiitake mushroom for heart & gut health',
    price: 2699, // $26.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'shiitake',
      category: 'digestive',
      benefits: 'Heart, digestion, immune'
    }
  },
  {
    name: 'Turkey Tail Defend',
    description: 'Turkey Tail for microbiome & immune support',
    price: 2799, // $27.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'turkey_tail',
      category: 'immunity',
      benefits: 'Immunity, gut health, resilience'
    }
  },
  {
    name: 'Tremella Beauty',
    description: 'Tremella for radiant skin & youthfulness',
    price: 2899, // $28.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'tremella',
      category: 'beauty',
      benefits: 'Skin hydration, beauty, anti-aging'
    }
  },
  {
    name: 'Agaricus Blazei Protect',
    description: 'Agaricus blazei for immune & vitality support',
    price: 3399, // $33.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'agaricus_blazei',
      category: 'immunity',
      benefits: 'Immunity, anti-stress, resilience'
    }
  },
  {
    name: 'Poria Serenity',
    description: 'Poria for sleep and digestive comfort',
    price: 3099, // $30.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'poria',
      category: 'calm',
      benefits: 'Calm, sleep, digestion'
    }
  },
  {
    name: 'King Trumpet Boost',
    description: 'King Trumpet for heart and performance support',
    price: 2999, // $29.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'king_trumpet',
      category: 'performance',
      benefits: 'Heart, antioxidant, circulation'
    }
  },
  {
    name: 'Enoki Gut Harmony',
    description: 'Enoki for gut health and immune resilience',
    price: 2599, // $25.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'enoki',
      category: 'gut',
      benefits: 'Gut, immunity, overall wellness'
    }
  },
  {
    name: 'Mesima Balance',
    description: 'Mesima mushroom extract for immune & liver balance',
    price: 3599, // $35.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'mesima',
      category: 'liver',
      benefits: 'Immune support, liver health'
    }
  },
  {
    name: 'Polyporus Detox',
    description: 'Polyporus for gentle detox and kidney support',
    price: 3699, // $36.99 in cents
    image: 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800',
    metadata: {
      mushroom_id: 'polyporus',
      category: 'detox',
      benefits: 'Detox, fluid balance, kidney support'
    }
  }
];

async function setupStripeProducts() {
  console.log('Setting up Stripe products...');
  
  for (const product of products) {
    try {
      // Create the product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        images: [product.image],
        metadata: product.metadata,
      });

      // Create the price for the product
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'usd',
      });

      console.log(`✅ Created: ${product.name} (ID: ${stripeProduct.id}, Price ID: ${price.id})`);
    } catch (error) {
      console.error(`❌ Failed to create ${product.name}:`, error.message);
    }
  }
  
  console.log('Stripe products setup complete!');
}

setupStripeProducts().catch(console.error); 