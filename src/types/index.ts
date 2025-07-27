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
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  productSuggestion?: Product;
  mushroomSuggestion?: Mushroom;
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