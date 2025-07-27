export interface CategoryMapping {
  name: string;
  icon: string;
  effects: string[];
}

export const categoryMappings: CategoryMapping[] = [
  {
    name: 'Immunity & Disease Support',
    icon: '/compressed_Shield-Photoroom.png',
    effects: [
      'immunity', 'immunity boost', 'immune support', 'immune regulation', 
      'anti-tumor', 'cancer support', 'anti-cancer'
    ]
  },
  {
    name: 'Cognitive & Mental Health',
    icon: '/compressed_Brain-Photoroom.png',
    effects: [
      'brain health', 'focus', 'memory', 'neuroprotection', 'better focus', 
      'mental resilience', 'mental balance', 'stress relief', 'stress resilience', 
      'calm', 'sleep', 'sleep improvement', 'adaptogen'
    ]
  },
  {
    name: 'Vitality, Energy & Physical Performance',
    icon: '/compressed_Lightning-Photoroom.png',
    effects: [
      'vitality', 'stamina', 'energy', 'endurance', 'athletic support', 
      'muscle recovery support', 'recovery'
    ]
  },
  {
    name: 'Metabolic, Digestive & Detox',
    icon: '/compressed_Drop-Photoroom.png',
    effects: [
      'metabolic health', 'metabolism', 'gut health', 'digestion', 
      'digestive improvement', 'detoxification', 'detox', 'diuretic'
    ]
  },
  {
    name: 'Beauty, Skin & Anti-Aging',
    icon: '/compressed_Lotus-Photoroom.png',
    effects: [
      'skin hydration', 'beauty', 'youthfulness', 'hydration', 
      'skin glow', 'anti-aging'
    ]
  },
  {
    name: 'Cardiovascular & Circulatory Health',
    icon: '/compressed_Heart-Photoroom.png',
    effects: [
      'heart health', 'cholesterol', 'cardiovascular health', 
      'circulatory and vascular support'
    ]
  },
  {
    name: 'General Wellness & Anti-inflammatory',
    icon: '/compressed_Spiral-Photoroom.png',
    effects: [
      'wellness', 'resilience', 'anti-inflammatory'
    ]
  }
];

export const getCategoryForEffect = (effect: string): CategoryMapping | null => {
  const normalizedEffect = effect.toLowerCase().trim();
  
  return categoryMappings.find(category => 
    category.effects.some(categoryEffect => 
      normalizedEffect.includes(categoryEffect.toLowerCase()) ||
      categoryEffect.toLowerCase().includes(normalizedEffect)
    )
  ) || null;
};

export const getCategoriesForMushroom = (effects: string[]): CategoryMapping[] => {
  const categories = new Set<CategoryMapping>();
  
  effects.forEach(effect => {
    const category = getCategoryForEffect(effect);
    if (category) {
      categories.add(category);
    }
  });
  
  return Array.from(categories);
};