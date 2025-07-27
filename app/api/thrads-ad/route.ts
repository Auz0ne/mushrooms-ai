import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, chatId, userMessage, botResponse } = body;

    const apiKey = process.env.NEXT_PUBLIC_THRADS_API_KEY;
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
      conversationOffset: 0,
      adFrequencyLimit: 3,
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
    
    if (data.status === 'success' && data.data?.creative) {
      return NextResponse.json({
        status: 'success',
        data: {
          ad: {
            id: `ad_${Date.now()}`,
            content: data.data.creative.creative,
            title: data.data.prod_name || 'Sponsored Content',
            image: data.data.img_url || '',
            url: data.data.prod_url || '',
            cta: 'Learn More',
            sponsored: true,
            timestamp: new Date().toISOString(),
            impressionId: data.requestId,
          },
          impressionId: data.requestId,
        },
      });
    }

    // Handle cases where no ad is available
    if (data.status === 'success' && (!data.data || Object.keys(data.data).length === 0)) {
      return NextResponse.json({
        status: 'success',
        message: data.message || 'No ad available at this time',
        data: null,
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