import { supabase } from '../lib/supabase';
import { Mushroom } from '../types';

export class MushroomService {
  static async getAllMushrooms(): Promise<Mushroom[]> {
    const { data, error } = await supabase
      .from('mushrooms')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching mushrooms:', error);
      throw error;
    }

    return data || [];
  }

  static async getMushroomByName(name: string): Promise<Mushroom | null> {
    const { data, error } = await supabase
      .from('mushrooms')
      .select('*')
      .ilike('name', `%${name}%`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching mushroom:', error);
      throw error;
    }

    return data;
  }

  static async searchMushrooms(query: string): Promise<Mushroom[]> {
    const { data, error } = await supabase
      .from('mushrooms')
      .select('*')
      .or(`name.ilike.%${query}%,expected_effects.cs.{${query}},impact_on_life.cs.{${query}}`)
      .order('name');

    if (error) {
      console.error('Error searching mushrooms:', error);
      throw error;
    }

    return data || [];
  }

  static async getMushroomsByEffect(effect: string): Promise<Mushroom[]> {
    const { data, error } = await supabase
      .from('mushrooms')
      .select('*')
      .contains('expected_effects', [effect])
      .order('name');

    if (error) {
      console.error('Error fetching mushrooms by effect:', error);
      throw error;
    }

    return data || [];
  }
}