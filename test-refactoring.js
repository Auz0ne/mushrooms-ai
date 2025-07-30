// Test script to verify the refactoring works correctly
const { ProductService } = require('./src/services/productService.ts');

async function testRefactoring() {
  console.log('🧪 Testing Refactoring...\n');

  try {
    // Test 1: Fetch products from database
    console.log('1️⃣ Testing ProductService.getAllProducts()...');
    const products = await ProductService.getAllProducts();
    console.log(`✅ Found ${products.length} products`);
    
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log(`   Sample product: ${firstProduct.name} - $${firstProduct.price}`);
      console.log(`   Has mushroom_id: ${!!firstProduct.mushroom_id}`);
      console.log(`   Has stripe_product_id: ${!!firstProduct.stripe_product_id}`);
    }

    // Test 2: Test product by mushroom ID
    console.log('\n2️⃣ Testing ProductService.getProductByMushroomId()...');
    if (products.length > 0) {
      const productWithMushroomId = products.find(p => p.mushroom_id);
      if (productWithMushroomId) {
        const product = await ProductService.getProductByMushroomId(productWithMushroomId.mushroom_id);
        if (product) {
          console.log(`✅ Found product for mushroom: ${product.name}`);
        } else {
          console.log('❌ No product found for mushroom ID');
        }
      } else {
        console.log('⚠️  No products with mushroom_id found');
      }
    }

    console.log('\n🎉 Refactoring tests completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Test adding mushrooms to cart');
    console.log('3. Test checkout flow');
    console.log('4. Verify Stripe integration works');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testRefactoring(); 