import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { HomePage } from './components/HomePage';
import { CheckoutPage } from './components/CheckoutPage';
import { useCart } from './hooks/useCart';
import { Product } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'checkout'>('home');

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
  } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleGoToCheckout = () => {
    setCurrentPage('checkout');
  };

  const handleGoBack = () => {
    setCurrentPage('home');
  };

  const handlePay = () => {
    // For now, just show a success message
    console.log('Processing payment...');
    // In a real app, this would integrate with Stripe
  };

  const handleProductClick = (productId: string) => {
    // Find the product and navigate to its page
    console.log('Navigating to product:', productId);
    // For now, we'll just go back to home and show the product
    setCurrentPage('home');
  };

  return (
    <div className="min-h-dvh">
      <Toaster />
      
      {currentPage === 'home' ? (
        <HomePage
          onAddToCart={handleAddToCart}
          onGoToCheckout={handleGoToCheckout}
          cartItemsCount={getCartItemsCount()}
        />
      ) : (
        <CheckoutPage
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onAddToCart={addToCart}
          cartTotal={getCartTotal()}
          onGoBack={handleGoBack}
          onPay={handlePay}
          onProductClick={handleProductClick}
        />
      )}
    </div>
  );
}

export default App;