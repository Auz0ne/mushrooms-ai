import { ThradsAdRequest, ThradsAdResponse, AdMessage, AdImpression } from '../types';

export interface AdServiceConfig {
  enabled: boolean;
  frequency: number; // Show ad every N messages
  sandboxMode: boolean;
  userRegion?: string;
}

export class ThradsAdService {
  private static config: AdServiceConfig = {
    enabled: true,
    frequency: 3, // Show ad every 3 messages (matching Thrads adFrequencyLimit)
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
   * Request a sponsored message from Thrads via our API route
   */
  static async getSponsoredMessage(
    userId: string,
    chatId: string,
    userMessage: string,
    botResponse: string,
    conversationTurn: number
  ): Promise<ThradsAdResponse | null> {
    if (!this.config.enabled) {
      return null;
    }

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log('ThradsAdService: Not in browser environment, skipping ad request');
      return null;
    }

    try {
      console.log('ThradsAdService: Requesting ad...');
      const response = await fetch('/api/thrads-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          chatId,
          userMessage,
          botResponse,
          conversationTurn,
        }),
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
              ...data.data.ad,
              timestamp: new Date(data.data.ad.timestamp),
            },
            impressionId: data.data.impressionId,
          },
        };
      }

      // Handle cases where no ad is available
      if (data.status === 'success' && !data.data) {
        return {
          status: 'success',
          message: data.message || 'No ad available at this time',
          data: undefined,
        };
      }

      return {
        status: 'error',
        message: data.message || 'No ad available',
      };
    } catch (error) {
      console.error('Thrads ad service error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
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
    // Check if we should show ad (every N messages, starting from turn 3)
    // Turn 3, 6, 9, etc. (every 3rd turn)
    const shouldShow = messageCount >= 3 && messageCount % this.config.frequency === 0;
    console.log(`Ad check: messageCount=${messageCount}, frequency=${this.config.frequency}, shouldShow=${shouldShow}`);
    return shouldShow;
  }

  /**
   * Get current configuration
   */
  static getConfig(): AdServiceConfig {
    return { ...this.config };
  }
} 