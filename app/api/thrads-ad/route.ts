import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, chatId, userMessage, botResponse, conversationTurn } = body;

    const apiKey = process.env.THRADS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Thrads API key not configured' },
        { status: 500 }
      );
    }

    const payload = {
      userId,
      chatId,
      content: {
        user: userMessage,
        chatbot: botResponse,
      },
      conversationOffset: conversationTurn || 1, // Use actual conversation turn
      adFrequencyLimit: 3, // Show ads every 3 turns (following Thrads docs)
      userRegion: 'US',
    };

    const response = await fetch('https://dev.thrads.ai/api/v1/message/get-ad/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'thrads-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Thrads API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Thrads API response:', JSON.stringify(data, null, 2));
    console.log('Data.data type:', typeof data.data);
    console.log('Data.data value:', data.data);
    console.log('Data.data keys:', data.data ? Object.keys(data.data) : 'null/undefined');
    console.log('=== DEBUGGING THRADS API ===');
    
    if (data.status === 'success' && data.data?.creative) {
      const adData = {
        id: `ad_${Date.now()}`,
        content: data.data.creative.creative,
        title: data.data.prod_name || 'Sponsored Content',
        image: data.data.img_url || '',
        url: data.data.prod_url || 'https://example.com/test-ad',
        cta: 'Learn More',
        sponsored: true,
        timestamp: new Date().toISOString(),
        impressionId: data.requestId,
      };
      
      console.log('Ad data being sent to client:', JSON.stringify(adData, null, 2));
      
      return NextResponse.json({
        status: 'success',
        data: {
          ad: adData,
          impressionId: data.requestId,
        },
      });
    }

    // Handle cases where no ad is available
    console.log('Checking fallback condition...');
    console.log('data.status === success:', data.status === 'success');
    console.log('!data.data:', !data.data);
    console.log('Object.keys(data.data).length === 0:', data.data ? Object.keys(data.data).length === 0 : 'N/A');
    
    if (data.status === 'success' && (!data.data || Object.keys(data.data).length === 0)) {
      // For testing purposes, return a simulated ad when Thrads doesn't provide one
      const testAdData = {
        id: `test_ad_${Date.now()}`,
        content: "Looking for natural energy boosters? Our premium mushroom supplements are specially formulated to enhance your vitality and focus. Try our Energy Blend today!",
        title: "Premium Mushroom Supplements",
        image: "",
        url: "https://example.com/mushroom-supplements",
        cta: "Shop Now",
        sponsored: true,
        timestamp: new Date().toISOString(),
        impressionId: `test_${Date.now()}`,
      };
      
      console.log('No ad from Thrads, returning test ad:', JSON.stringify(testAdData, null, 2));
      
      return NextResponse.json({
        status: 'success',
        data: {
          ad: testAdData,
          impressionId: testAdData.impressionId,
        },
      });
    }

    return NextResponse.json({
      status: 'error',
      message: data.message || 'No ad available',
    });

  } catch (error) {
    console.error('Thrads ad service error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ad' },
      { status: 500 }
    );
  }
} 