import { Mushroom } from '../types';
import { MushroomService } from '../services/mushroomService';

interface ChatResponse {
  message: string;
  suggestedMushroom?: Mushroom;
}

export class ChatBot {
  private mushrooms: Mushroom[] = [];

  constructor() {
    this.loadMushrooms();
  }

  private async loadMushrooms() {
    try {
      this.mushrooms = await MushroomService.getAllMushrooms();
    } catch (error) {
      console.error('Failed to load mushrooms:', error);
    }
  }

  private getKeywords(message: string): string[] {
    const keywords = [
      'focus', 'concentrate', 'study', 'brain', 'cognitive', 'mental', 'memory', 'remember',
      'stress', 'anxiety', 'calm', 'relax', 'zen', 'adaptogen',
      'energy', 'tired', 'fatigue', 'stamina', 'endurance', 'athletic', 'performance',
      'immune', 'immunity', 'cold', 'flu', 'sick', 'cancer', 'tumor',
      'antioxidant', 'aging', 'anti-aging', 'cellular', 'skin', 'beauty',
      'sleep', 'insomnia', 'rest', 'bedtime',
      'gut', 'digestion', 'digestive', 'stomach',
      'heart', 'cholesterol', 'cardiovascular',
      'liver', 'detox', 'detoxification',
      'inflammation', 'anti-inflammatory'
    ];

    return keywords.filter(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private async findBestMushroom(keywords: string[]): Promise<Mushroom | null> {
    if (this.mushrooms.length === 0) {
      await this.loadMushrooms();
    }

    // Score mushrooms based on keyword matches
    const scoredMushrooms = this.mushrooms.map(mushroom => {
      let score = 0;
      const allEffects = [...mushroom.expected_effects, ...mushroom.impact_on_life];
      
      keywords.forEach(keyword => {
        // Check if keyword matches any effect or impact
        allEffects.forEach(effect => {
          if (effect.toLowerCase().includes(keyword.toLowerCase())) {
            score += 2;
          }
        });
        
        // Check if keyword matches mushroom name
        if (mushroom.name.toLowerCase().includes(keyword.toLowerCase())) {
          score += 3;
        }
        
        // Check story for context
        if (mushroom.story_behind_consumption.toLowerCase().includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      
      return { mushroom, score };
    });

    // Sort by score and return the best match
    scoredMushrooms.sort((a, b) => b.score - a.score);
    return scoredMushrooms[0]?.score > 0 ? scoredMushrooms[0].mushroom : null;
  }

  public async generateResponse(message: string): Promise<ChatResponse> {
    const keywords = this.getKeywords(message);
    const bestMushroom = await this.findBestMushroom(keywords);

    if (bestMushroom) {
      const effects = bestMushroom.expected_effects.join(', ');
      const impacts = bestMushroom.impact_on_life.join(', ');
      
      return {
        message: `I recommend ${bestMushroom.name}${bestMushroom.scientific_name ? ` (${bestMushroom.scientific_name})` : ''}! ${bestMushroom.story_behind_consumption} ${effects ? `It's known for: ${effects}.` : ''} ${impacts ? `Users typically experience: ${impacts}.` : ''}`,
        suggestedMushroom: bestMushroom,
      };
    }

    // Default response with a random mushroom suggestion
    if (this.mushrooms.length === 0) {
      await this.loadMushrooms();
    }
    
    const randomMushroom = this.mushrooms[Math.floor(Math.random() * this.mushrooms.length)];
    return {
      message: "I'd love to help you find the perfect mushroom supplement! Could you tell me more about what you're looking to improve? Are you interested in focus, energy, stress relief, or immune support?",
      suggestedMushroom: randomMushroom,
    };
  }
}