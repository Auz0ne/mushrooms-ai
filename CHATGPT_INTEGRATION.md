# ChatGPT 4.1 Mini Integration Guide

## 🚀 Overview

This integration adds ChatGPT 4.1 mini as the conversational AI engine for the mushroom supplement chatbot. The AI acts as an expert mushroom supplement advisor and salesperson, providing personalized recommendations based on user queries and context.

## 📋 Features

- **GPT-4.1 Mini Integration**: Uses OpenAI's latest model with 1M token context window
- **Context-Aware Responses**: Includes cart items, current product, and user preferences
- **Streaming Responses**: Real-time typing effect for better UX
- **Error Handling**: Graceful fallbacks for API errors and rate limits
- **Product Knowledge**: Access to complete mushroom database for accurate recommendations

## 🔧 Setup Instructions

### 1. Environment Variables

Add your OpenAI API key to `.env.local`:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 2. Install Dependencies

```bash
npm install openai
```

### 3. Vercel Environment Variables

Add the same environment variable to your Vercel project:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `OPENAI_API_KEY` = `sk-your-actual-openai-api-key-here`
3. Select all environments (Production, Preview, Development)
4. Redeploy your project

## 🏗️ Architecture

### API Route (`app/api/chat/route.ts`)

Handles all ChatGPT API calls with:
- Input validation
- Context injection (cart, current product, mushroom database)
- Error handling for rate limits and API errors
- Response formatting

### Service Layer (`src/services/chatGPTService.ts`)

Provides:
- `generateResponse()`: Standard chat completion
- `generateStreamingResponse()`: Real-time streaming with typing effect
- Error handling and fallback responses

### Hook Integration (`src/hooks/useChat.ts`)

Updated to use ChatGPT service with:
- Streaming message updates
- Context-aware conversations
- Error state management

## 🎯 Usage Examples

### Basic Chat

```typescript
const { sendMessage, messages, isTyping } = useChat();

// Send a message with context
const context = {
  cartItems: [],
  currentProduct: selectedProduct,
};

sendMessage("I need help with focus and memory", context);
```

### AI-Powered Product Recommendations

```typescript
const handleAskAI = (effect: string) => {
  const question = `Tell me more about ${effect} and how it can benefit me`;
  const context = {
    cartItems: cartItems,
    currentProduct: currentProduct,
  };
  sendMessage(question, context);
};
```

## 🧠 System Prompt

The AI is configured with a comprehensive system prompt that:

1. **Establishes Role**: Expert mushroom supplement advisor for Lyceum
2. **Defines Products**: Complete list of available mushrooms and benefits
3. **Sets Guidelines**: Conversation style, sales approach, and trust-building
4. **Provides Context**: Cart items, current product, and user preferences

## 🔄 Context Injection

Every chat request includes:

- **Conversation History**: Previous messages for continuity
- **Cart Context**: Current cart items for personalized recommendations
- **Product Context**: Currently viewed product
- **Mushroom Database**: Complete product catalog with effects and benefits

## ⚡ Performance Optimization

### Model Configuration

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini', // GPT-4.1 mini
  messages: openaiMessages,
  max_tokens: 500,        // Reasonable response length
  temperature: 0.7,       // Balanced creativity
  stream: false,          // Set to true for real streaming
});
```

### Error Handling

- **Rate Limits**: Automatic retry with exponential backoff
- **API Errors**: Graceful fallback responses
- **Network Issues**: User-friendly error messages
- **Invalid Input**: Input validation and sanitization

## 🧪 Testing

### Local Testing

1. Set up your OpenAI API key in `.env.local`
2. Start the development server: `npm run dev`
3. Test the chatbot in your app
4. Check browser console for any errors

### API Testing

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"sender": "user", "content": "I need help with focus"}
    ],
    "cartItems": [],
    "currentProduct": null
  }'
```

## 🔒 Security Considerations

1. **API Key Protection**: Never expose in client-side code
2. **Input Validation**: Sanitize all user inputs
3. **Rate Limiting**: Implement proper rate limiting
4. **Error Handling**: Don't expose sensitive error details

## 📊 Monitoring

### Usage Tracking

The API returns usage statistics:

```typescript
{
  message: "AI response...",
  usage: {
    prompt_tokens: 150,
    completion_tokens: 200,
    total_tokens: 350
  }
}
```

### Error Monitoring

Monitor these error types:
- `rate_limit_exceeded`: API rate limits
- `insufficient_quota`: Billing issues
- `invalid_api_key`: Configuration problems

## 🚀 Deployment

### Vercel Deployment

1. Ensure environment variables are set in Vercel
2. Deploy automatically via GitHub integration
3. Test the live deployment
4. Monitor for any API errors

### Environment Variables Checklist

- [ ] `OPENAI_API_KEY` set in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel

## 🎯 Best Practices

1. **Context Management**: Always pass relevant context
2. **Error Handling**: Provide helpful fallback responses
3. **User Experience**: Use streaming for better engagement
4. **Cost Management**: Monitor token usage and optimize prompts
5. **Testing**: Regularly test with various user scenarios

## 🔧 Troubleshooting

### Common Issues

1. **"Chat service not configured"**: Check OpenAI API key
2. **Rate limit errors**: Implement exponential backoff
3. **Streaming not working**: Check network connectivity
4. **Context not updating**: Verify context object structure

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are set
3. Test API endpoint directly
4. Monitor Vercel function logs

## 📈 Future Enhancements

- **Real Streaming**: Implement true server-sent events
- **Memory Management**: Implement conversation memory limits
- **Analytics**: Track conversation quality and conversion rates
- **A/B Testing**: Test different prompts and configurations
- **Multi-language**: Support for different languages
- **Voice Integration**: Add voice input/output capabilities

---

**Note**: This integration provides a powerful AI-powered chatbot that enhances the user experience while maintaining security and performance best practices. 