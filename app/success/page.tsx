'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Package } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full text-center"
      >
        {isLoading ? (
          <div className="space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-vibrant-orange rounded-full flex items-center justify-center mx-auto"
            >
              <Package className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-white font-opensans">Processing your order...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="font-inter font-bold text-2xl text-white">
                Payment Successful!
              </h1>
              <p className="text-white/80 font-opensans">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            {sessionId && (
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/60 font-opensans text-sm">
                  Order ID: {sessionId}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-white/80 font-opensans text-sm">
                You will receive an email confirmation shortly with your order details.
              </p>
              
              <motion.button
                onClick={handleGoHome}
                className="w-full bg-vibrant-orange hover:bg-orange-600 text-white font-opensans font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 