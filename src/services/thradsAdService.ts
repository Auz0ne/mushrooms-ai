import { ThradsAdRequest, ThradsAdResponse, AdMessage, AdImpression } from '../types';

export interface AdServiceConfig {
  enabled: boolean;
  frequency: number; // Show ad every N messages
  sandboxMode: boolean;
  userRegion?: string;
}

export class ThradsAdService {
  private static readonly API_BASE_URL = 'https://dev.thrads.ai/api/v1';
  private static readonly PROD_API_BASE_URL = 'https://api.thrads.ai/api/v1';
  
  private static config: AdServiceConfig = {
    enabled: true,
    frequency: 3, // Show ad every 3 messages
    sandboxMode: process.env.NODE_ENV === 'development',
    userRegion: undefined,
  };

  /**
   * Configure the ad service
   */
  static configure(config: Partial<AdServiceConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get the appropriate API base URL based on environment
   */
  private static getApiBaseUrl(): string {
    return this.config.sandboxMode ? this.API_BASE_URL : this.PROD_API_BASE_URL;
  }

  /**
   * Request a sponsored message from Thrads
   */
  static async getSponsoredMessage(
    userId: string,
    chatId: string,
    userMessage: string,
    botResponse: string
  ): Promise<ThradsAdResponse | null> {
    if (!this.config.enabled) {
      return null;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_THRADS_API_KEY;
      if (!apiKey) {
        console.warn('Thrads API key not configured');
        return null;
      }

      const payload: ThradsAdRequest = {
        userId,
        chatId,
        content: {
          user: userMessage,
          chatbot: botResponse,
        },
        conversationOffset: 0, // Can be made configurable
        adFrequencyLimit: this.config.frequency,
        userRegion: this.config.userRegion,
      };

      const response = await fetch(`${this.getApiBaseUrl()}/message/get-ad/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Thrads API error:', response.status, response.statusText);
        return {
          status: 'error',
          message: `API error: ${response.status}`,
        };
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data?.ad) {
        return {
          status: 'success',
          data: {
            ad: {
              id: data.data.ad.id || `ad_${Date.now()}`,
              content: data.data.ad.content,
              title: data.data.ad.title,
              image: data.data.ad.image,
              url: data.data.ad.url,
              cta: data.data.ad.cta,
              sponsored: true,
              timestamp: new Date(),
            },
            impressionId: data.data.impressionId,
          },
        };
      }

      return {
        status: 'error',
        message: data.message || 'No ad available',
      };
    } catch (error) {
      console.error('Thrads ad service error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch ad',
      };
    }
  }

  /**
   * Log ad impression to Supabase
   */
  static async logImpression(impression: Omit<AdImpression, 'id'>): Promise<void> {
    try {
      // This would be implemented with your Supabase client
      // For now, we'll just log to console
      console.log('Ad impression logged:', impression);
      
      // TODO: Implement Supabase logging
      // const { data, error } = await supabase
      //   .from('ad_impressions')
      //   .insert(impression);
      
      // if (error) {
      //   console.error('Failed to log ad impression:', error);
      // }
    } catch (error) {
      console.error('Error logging ad impression:', error);
    }
  }

  /**
   * Track ad click
   */
  static async trackClick(impressionId: string, adId: string): Promise<void> {
    try {
      // TODO: Implement click tracking
      console.log('Ad click tracked:', { impressionId, adId });
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  }

  /**
   * Track ad dismiss
   */
  static async trackDismiss(impressionId: string, adId: string): Promise<void> {
    try {
      // TODO: Implement dismiss tracking
      console.log('Ad dismiss tracked:', { impressionId, adId });
    } catch (error) {
      console.error('Error tracking ad dismiss:', error);
    }
  }

  /**
   * Check if we should show an ad based on message count
   */
  static shouldShowAd(messageCount: number): boolean {
    if (!this.config.enabled) return false;
    return messageCount > 0 && messageCount % this.config.frequency === 0;
  }

  /**
   * Get current configuration
   */
  static getConfig(): AdServiceConfig {
    return { ...this.config };
  }
} 