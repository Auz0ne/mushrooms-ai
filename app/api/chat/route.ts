import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MushroomService } from '../../../src/services/mushroomService';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the mushroom advisor
const SYSTEM_PROMPT = `You are an expert mushroom supplement advisor and salesperson for Lyceum, a premium mushroom supplement brand. Your role is to:

1. **Provide Expert Advice**: Help customers find the perfect mushroom supplements based on their wellness goals
2. **Educate**: Share knowledge about mushroom benefits, traditional uses, and modern research
3. **Recommend Products**: Suggest specific mushrooms from our premium collection
4. **Build Trust**: Be knowledgeable, friendly, and professional
5. **Drive Sales**: Naturally guide conversations toward product recommendations

**Available Mushroom Products:**
- Reishi: Immune support, stress relief, sleep quality
- Lion's Mane: Cognitive function, memory, focus
- Cordyceps: Energy, athletic performance, stamina
- Chaga: Antioxidant, immune support, cellular health
- Turkey Tail: Immune system, gut health
- Maitake: Blood sugar support, immune function
- Shiitake: Immune support, cardiovascular health
- Oyster: Cholesterol support, antioxidant properties

**Conversation Guidelines:**
- Always be helpful and informative
- Ask follow-up questions to understand customer needs
- Provide specific product recommendations with benefits
- Mention scientific backing when relevant
- Be enthusiastic about the products but not pushy
- Address common concerns about mushroom supplements
- Suggest complementary mushroom combinations when appropriate

**Response Style:**
- Conversational and friendly
- Include emojis occasionally for warmth
- Be concise but informative
- Always end with a question or call-to-action
- Reference specific mushroom benefits and effects

Remember: You're helping people improve their wellness through premium mushroom supplements. Be their trusted advisor!`;

export async function POST(request: NextRequest) {
  try {
    const { messages, cartItems, currentProduct } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 }
      );
    }

    // Load mushrooms for context
    let mushrooms: any[] = [];
    try {
      mushrooms = await MushroomService.getAllMushrooms();
    } catch (error) {
      console.error('Failed to load mushrooms for context:', error);
    }

    // Create context string from mushrooms
    const mushroomContext = mushrooms.map(mushroom => 
      `${mushroom.name}: ${mushroom.expected_effects.join(', ')}. ${mushroom.story_behind_consumption}`
    ).join('\n');

    // Create cart context
    const cartContext = cartItems && cartItems.length > 0 
      ? `Current cart: ${cartItems.map((item: any) => item.product.name).join(', ')}`
      : '';

    // Create current product context
    const productContext = currentProduct 
      ? `Currently viewing: ${currentProduct.name}`
      : '';

    // Build the full context
    const contextParts = [
      SYSTEM_PROMPT,
      mushroomContext && `\n**Available Products:**\n${mushroomContext}`,
      cartContext && `\n**Customer Cart:** ${cartContext}`,
      productContext && `\n**Current Product:** ${productContext}`,
    ].filter(Boolean).join('\n\n');

    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: 'system', content: contextParts },
      ...messages.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ] as any;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // GPT-4.1 mini
      messages: openaiMessages,
      max_tokens: 500,
      temperature: 0.7,
      stream: false, // Set to true for streaming responses
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now. Please try again.';

    return NextResponse.json({ 
      message: response,
      usage: completion.usage 
    });

  } catch (error: any) {
    console.error('Chat API error:', error);

    // Handle specific OpenAI errors
    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Chat service configuration error.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
} 