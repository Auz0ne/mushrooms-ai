// Test script for ChatGPT integration
// Run with: node test-chatgpt.js

const testChatAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            id: '1',
            content: 'Hi there! 👋 I\'m your AI mushroom supplement advisor. I can help you find the perfect supplements for your wellness goals. What would you like to improve today?',
            sender: 'bot',
            timestamp: new Date(),
          },
          {
            id: '2',
            content: 'I need help with focus and memory',
            sender: 'user',
            timestamp: new Date(),
          }
        ],
        cartItems: [],
        currentProduct: null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      return;
    }

    const data = await response.json();
    console.log('✅ ChatGPT Response:', data.message);
    console.log('📊 Usage:', data.usage);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
console.log('🧪 Testing ChatGPT Integration...');
testChatAPI(); 