export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  video?: string;
  description: string;
  benefits: string[];
  tags: string[];
  category: string;
  inStock: boolean;
  // New fields for the products table
  main_ingredient?: string;
  format?: string;
  pills_per_container?: number;
  daily_dose?: string;
  use_instructions?: string;
  key_benefits?: string[];
  short_description?: string;
  certifications_notes?: string;
  mushroom_id?: string;
}

export interface DatabaseProduct {
  id: string;
  name: string;
  main_ingredient: string;
  format: string;
  pills_per_container: number;
  daily_dose: string;
  use_instructions: string;
  key_benefits: string[];
  short_description: string;
  certifications_notes: string;
  price: number;
  image_url: string;
  mushroom_id: string | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'ad';
  timestamp: Date;
  productSuggestion?: Product;
  mushroomSuggestion?: Mushroom;
  // Ad-specific fields
  adData?: AdMessage;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: string[];
}

export interface Mushroom {
  id: string;
  name: string;
  scientific_name: string;
  region_medicine: string;
  expected_effects: string[];
  story_behind_consumption: string;
  impact_on_life: string[];
  created_at: string;
  video_url?: string;
  photo_url?: string;
}

export interface Archetype {
  id: string;
  bundle_name: string;
  mushrooms_included: string[];
  user_objective: string;
  archetype: string;
  created_at: string;
}

// Thrads Ad Integration Types
export interface AdMessage {
  id: string;
  content: string;
  title?: string;
  image?: string;
  url?: string;
  cta?: string;
  sponsored: boolean;
  timestamp: Date;
  impressionId?: string;
}

export interface ThradsAdRequest {
  userId: string;
  chatId: string;
  content: {
    user: string;
    chatbot: string;
  };
  conversationOffset?: number;
  adFrequencyLimit?: number;
  userRegion?: string;
}

export interface ThradsAdResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    ad: AdMessage;
    impressionId?: string;
  };
}

export interface AdImpression {
  id: string;
  user_id: string;
  chat_id: string;
  ad_id: string;
  impression_id?: string;
  timestamp: Date;
  clicked?: boolean;
  dismissed?: boolean;
}