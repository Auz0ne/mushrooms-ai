export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
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
  mushroom_id: string | null;
  image_url: string | null;
  created_at: string;
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