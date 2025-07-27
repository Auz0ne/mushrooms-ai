# Thrads Ad Network Integration

This document describes the integration of Thrads ad network's sponsored messages into the Mushroom AI chatbot.

## Overview

The integration allows sponsored messages to appear naturally within the chat flow, providing monetization opportunities while maintaining a good user experience.

## Architecture

### Components

1. **ThradsAdService** (`src/services/thradsAdService.ts`)
   - Handles API communication with Thrads
   - Manages ad frequency and targeting
   - Tracks impressions and interactions

2. **AdMessageComponent** (`src/components/AdMessage.tsx`)
   - Renders sponsored messages in the chat
   - Handles click and dismiss interactions
   - Provides clear "Sponsored" labeling

3. **Enhanced Chat Hook** (`src/hooks/useChat.ts`)
   - Integrates ad fetching into message flow
   - Manages ad display timing
   - Handles ad interaction callbacks

4. **Database Schema** (`supabase/migrations/20250727000000_create_ad_impressions.sql`)
   - Tracks ad impressions and interactions
   - Enables analytics and reporting

## Configuration

### Environment Variables

Add to your `.env.local`:

```bash
# Thrads API Configuration
NEXT_PUBLIC_THRADS_API_KEY=your_thrads_api_key_here
```

### Ad Service Configuration

```typescript
import { ThradsAdService } from '../services/thradsAdService';

// Configure the ad service
ThradsAdService.configure({
  enabled: true,           // Enable/disable ads
  frequency: 3,            // Show ad every N messages
  sandboxMode: true,       // Use sandbox API in development
  userRegion: 'US',        // Optional: user's region for targeting
});
```

## API Integration

### Request Format

```typescript
{
  userId: "user_123",
  chatId: "chat_456",
  content: {
    user: "What mushrooms help with energy?",
    chatbot: "Cordyceps is excellent for energy and stamina..."
  },
  conversationOffset: 0,
  adFrequencyLimit: 3,
  userRegion: "US"
}
```

### Response Format

```typescript
{
  status: "success",
  data: {
    ad: {
      id: "ad_123",
      content: "Boost your energy naturally with our premium supplements!",
      title: "Energy Boost Special",
      image: "https://example.com/ad-image.jpg",
      url: "https://example.com/promo",
      cta: "Learn More",
      sponsored: true,
      timestamp: "2024-01-01T00:00:00.000Z",
      impressionId: "imp_456"
    }
  }
}
```

## Usage

### Basic Integration

The ad integration is automatically handled by the `useChat` hook:

```typescript
const { 
  messages, 
  sendMessage, 
  handleAdDismiss, 
  handleAdClick 
} = useChat();
```

### Manual Ad Fetching

```typescript
import { ThradsAdService } from '../services/thradsAdService';

const adResponse = await ThradsAdService.getSponsoredMessage(
  userId,
  chatId,
  userMessage,
  botResponse
);

if (adResponse?.status === 'success') {
  // Display the ad
  const adMessage = {
    id: `ad_${Date.now()}`,
    content: adResponse.data.ad.content,
    sender: 'ad',
    timestamp: new Date(),
    adData: adResponse.data.ad,
  };
}
```

## Ad Display

### Message Types

The chat system now supports three message types:

1. **User Messages** (`sender: 'user'`)
2. **Bot Messages** (`sender: 'bot'`)
3. **Ad Messages** (`sender: 'ad'`)

### Ad Styling

Ad messages are styled with:
- Purple gradient background
- "Sponsored" badge
- Dismiss button
- Call-to-action buttons
- Responsive design

## Analytics & Tracking

### Impression Tracking

```typescript
// Log ad impression
await ThradsAdService.logImpression({
  user_id: userId,
  chat_id: chatId,
  ad_id: adId,
  impression_id: impressionId,
  timestamp: new Date(),
});
```

### Click Tracking

```typescript
// Track ad click
await ThradsAdService.trackClick(impressionId, adId);
```

### Dismiss Tracking

```typescript
// Track ad dismiss
await ThradsAdService.trackDismiss(impressionId, adId);
```

## Database Schema

### ad_impressions Table

```sql
CREATE TABLE ad_impressions (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  ad_id TEXT NOT NULL,
  impression_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  clicked BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE
);
```

## Testing

### Sandbox Mode

Enable sandbox mode for testing:

```typescript
ThradsAdService.configure({
  sandboxMode: true,
  frequency: 1, // Show ads more frequently for testing
});
```

### Test API Calls

```bash
# Test the API directly
curl -X POST https://dev.thrads.ai/api/v1/message/get-ad/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "userId": "test_user",
    "chatId": "test_chat",
    "content": {
      "user": "Hello",
      "chatbot": "Hi there!"
    }
  }'
```

## Configuration Options

### Frequency Control

```typescript
// Show ad every 5 messages
ThradsAdService.configure({ frequency: 5 });

// Show ad every 2 messages
ThradsAdService.configure({ frequency: 2 });
```

### Regional Targeting

```typescript
// Set user region for better targeting
ThradsAdService.configure({ userRegion: 'US' });
```

### Enable/Disable

```typescript
// Disable ads completely
ThradsAdService.configure({ enabled: false });

// Enable ads
ThradsAdService.configure({ enabled: true });
```

## Error Handling

The integration includes comprehensive error handling:

- API failures don't break the chat flow
- Network errors are logged but don't affect UX
- Invalid responses are gracefully handled
- Fallback behavior when ads are unavailable

## Performance Considerations

- Ads are fetched asynchronously
- Ad requests don't block message sending
- Failed ad requests don't affect chat functionality
- Ad components are optimized for mobile performance

## Security

- API keys are stored in environment variables
- No sensitive data is logged
- Ad interactions are tracked securely
- User privacy is maintained

## Monitoring

### Key Metrics

Track these metrics for optimization:

1. **Impression Rate**: Percentage of eligible messages that show ads
2. **Click Rate**: Percentage of impressions that result in clicks
3. **Dismiss Rate**: Percentage of ads dismissed by users
4. **Revenue**: Total revenue generated from ad clicks

### Logging

```typescript
// Enable detailed logging
console.log('Ad impression:', { userId, chatId, adId });
console.log('Ad click:', { impressionId, adId });
console.log('Ad dismiss:', { impressionId, adId });
```

## Troubleshooting

### Common Issues

1. **Ads not showing**
   - Check API key configuration
   - Verify frequency settings
   - Ensure sandbox mode is correct

2. **API errors**
   - Check network connectivity
   - Verify API endpoint URLs
   - Review request payload format

3. **Styling issues**
   - Check CSS classes
   - Verify responsive design
   - Test on different devices

### Debug Mode

Enable debug logging:

```typescript
// Add to your development environment
const DEBUG_ADS = process.env.NODE_ENV === 'development';
if (DEBUG_ADS) {
  console.log('Ad service config:', ThradsAdService.getConfig());
}
```

## Future Enhancements

### Planned Features

1. **A/B Testing**: Test different ad frequencies
2. **Advanced Targeting**: User behavior-based targeting
3. **Performance Optimization**: Lazy loading of ad components
4. **Analytics Dashboard**: Real-time ad performance metrics

### Integration Opportunities

1. **Sponsored Prompts**: AI-generated prompts with ads
2. **Sponsored Queries**: Ad-supported search suggestions
3. **Product Recommendations**: Sponsored product suggestions
4. **Educational Content**: Sponsored educational messages

## Support

For technical support or questions about the Thrads integration:

1. Check the [Thrads API Documentation](https://docs.thrads.ai)
2. Review this README for configuration details
3. Contact the development team for implementation issues
4. Monitor logs for debugging information

---

**Note**: This integration is designed to be non-intrusive and user-friendly while providing effective monetization opportunities. Always prioritize user experience when adjusting ad frequency or styling. 