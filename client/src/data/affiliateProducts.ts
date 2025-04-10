import { ZodiacSign } from "@shared/types";

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: ProductCategory;
  rating: number; // 1-5
  recommendedSigns: ZodiacSign[];
  affiliateUrl: string;
}

export type ProductCategory = 
  | 'nutrition'
  | 'supplements'
  | 'fitness'
  | 'sleep'
  | 'meditation'
  | 'skincare'
  | 'selfcare';

// Mock data for affiliate products - in a real app, this would come from a database or API
export const affiliateProducts: AffiliateProduct[] = [
  {
    id: "prod-001",
    name: "Celestial Calm Tea",
    description: "Organic herbal tea blend designed to promote relaxation and stress relief. Perfect for evening wind-down rituals.",
    price: 18.99,
    imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg",
    category: "nutrition",
    rating: 4.7,
    recommendedSigns: ["taurus", "cancer", "pisces", "libra"],
    affiliateUrl: "https://example.com/celestial-calm-tea"
  },
  {
    id: "prod-002",
    name: "Zodiac Wellness Journal",
    description: "Track your wellness journey with this beautifully designed journal featuring astrological insights for each month.",
    price: 24.95,
    imageUrl: "https://images.pexels.com/photos/636690/pexels-photo-636690.jpeg",
    category: "selfcare",
    rating: 4.8,
    recommendedSigns: ["virgo", "capricorn", "aquarius", "gemini"],
    affiliateUrl: "https://example.com/zodiac-wellness-journal"
  },
  {
    id: "prod-003",
    name: "Fire Element Yoga Mat",
    description: "Eco-friendly yoga mat with designs inspired by fire zodiac signs. Extra grip and cushioning for intense workouts.",
    price: 59.99,
    imageUrl: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
    category: "fitness",
    rating: 4.6,
    recommendedSigns: ["aries", "leo", "sagittarius"],
    affiliateUrl: "https://example.com/fire-yoga-mat"
  },
  {
    id: "prod-004",
    name: "Earth Element Essential Oil Blend",
    description: "Grounding essential oil blend with notes of sandalwood, vetiver, and patchouli to promote stability and calmness.",
    price: 32.50,
    imageUrl: "https://images.pexels.com/photos/3868862/pexels-photo-3868862.jpeg",
    category: "selfcare",
    rating: 4.9,
    recommendedSigns: ["taurus", "virgo", "capricorn"],
    affiliateUrl: "https://example.com/earth-element-oils"
  },
  {
    id: "prod-005",
    name: "Air Element Sleep Diffuser",
    description: "Smart aromatherapy diffuser that creates the perfect sleep environment with customizable scent programs.",
    price: 89.99,
    imageUrl: "https://images.pexels.com/photos/4046718/pexels-photo-4046718.jpeg",
    category: "sleep",
    rating: 4.5,
    recommendedSigns: ["gemini", "libra", "aquarius"],
    affiliateUrl: "https://example.com/air-diffuser"
  },
  {
    id: "prod-006",
    name: "Water Element Bath Salts",
    description: "Mineral-rich bath salts with blue lotus and sea kelp to promote deep relaxation and emotional healing.",
    price: 28.99,
    imageUrl: "https://images.pexels.com/photos/3907507/pexels-photo-3907507.jpeg",
    category: "selfcare",
    rating: 4.7,
    recommendedSigns: ["cancer", "scorpio", "pisces"],
    affiliateUrl: "https://example.com/water-bath-salts"
  },
  {
    id: "prod-007",
    name: "Luna Cycle Adaptogenic Supplements",
    description: "Moon-phase aligned supplement regimen to support hormonal balance and vitality throughout the month.",
    price: 45.00,
    imageUrl: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg",
    category: "supplements",
    rating: 4.3,
    recommendedSigns: ["cancer", "pisces", "scorpio", "taurus"],
    affiliateUrl: "https://example.com/luna-supplements"
  },
  {
    id: "prod-008",
    name: "Solar Plexus Power Protein",
    description: "Plant-based protein blend with turmeric and maca to boost energy and confidence for active signs.",
    price: 39.99,
    imageUrl: "https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg",
    category: "nutrition",
    rating: 4.4,
    recommendedSigns: ["leo", "aries", "sagittarius", "capricorn"],
    affiliateUrl: "https://example.com/solar-protein"
  },
  {
    id: "prod-009",
    name: "Mercury Retrograde Rescue Kit",
    description: "Survival kit for Mercury retrograde with calming tools, organization helpers, and a guide to navigating this challenging time.",
    price: 34.99,
    imageUrl: "https://images.pexels.com/photos/6765635/pexels-photo-6765635.jpeg",
    category: "selfcare",
    rating: 4.8,
    recommendedSigns: ["gemini", "virgo", "libra", "aquarius"],
    affiliateUrl: "https://example.com/mercury-kit"
  },
  {
    id: "prod-010",
    name: "Horoscope Health Sleep Mask",
    description: "Luxurious silk sleep mask with cooling gel insert and subtle constellation design for deep, restorative sleep.",
    price: 29.95,
    imageUrl: "https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg",
    category: "sleep",
    rating: 4.6,
    recommendedSigns: ["taurus", "cancer", "pisces", "libra", "scorpio"],
    affiliateUrl: "https://example.com/horoscope-sleep-mask"
  },
  {
    id: "prod-011",
    name: "Zodiac Resistance Bands Set",
    description: "Five-piece resistance band set with zodiac element-inspired designs and varying tension levels for all fitness levels.",
    price: 27.50,
    imageUrl: "https://images.pexels.com/photos/6551078/pexels-photo-6551078.jpeg",
    category: "fitness",
    rating: 4.7,
    recommendedSigns: ["aries", "leo", "capricorn", "scorpio", "taurus"],
    affiliateUrl: "https://example.com/zodiac-bands"
  },
  {
    id: "prod-012",
    name: "Astral Meditation Cushion",
    description: "Ergonomic meditation cushion with celestial pattern and eco-friendly filling for comfortable daily practice.",
    price: 58.00,
    imageUrl: "https://images.pexels.com/photos/6483433/pexels-photo-6483433.jpeg",
    category: "meditation",
    rating: 4.9,
    recommendedSigns: ["virgo", "libra", "pisces", "aquarius"],
    affiliateUrl: "https://example.com/astral-cushion"
  },
  {
    id: "prod-013",
    name: "Horoscope Health Clarity Skincare Set",
    description: "Complete skincare regime with adaptogenic ingredients to bring balance and radiance to all skin types.",
    price: 85.00,
    imageUrl: "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg",
    category: "skincare",
    rating: 4.8,
    recommendedSigns: ["libra", "taurus", "cancer", "leo", "virgo"],
    affiliateUrl: "https://example.com/horoscope-skincare"
  },
  {
    id: "prod-014",
    name: "Alignment Yoga Wheel",
    description: "Versatile yoga prop for back bends, stretches, and developing flexibility with zodiac alignment markers.",
    price: 42.99,
    imageUrl: "https://images.pexels.com/photos/6832208/pexels-photo-6832208.jpeg",
    category: "fitness",
    rating: 4.5,
    recommendedSigns: ["aries", "leo", "scorpio", "capricorn", "aquarius"],
    affiliateUrl: "https://example.com/alignment-wheel"
  },
  {
    id: "prod-015",
    name: "Celestial Superfoods Blend",
    description: "Nutrient-dense superfood powder with adaptogenic mushrooms, greens, and berries for daily wellness support.",
    price: 49.99,
    imageUrl: "https://images.pexels.com/photos/5938248/pexels-photo-5938248.jpeg",
    category: "nutrition",
    rating: 4.7,
    recommendedSigns: ["virgo", "capricorn", "aquarius", "gemini", "libra"],
    affiliateUrl: "https://example.com/celestial-superfoods"
  }
];

// Get products recommended for a specific zodiac sign
export function getProductsForSign(sign: ZodiacSign): AffiliateProduct[] {
  return affiliateProducts.filter(product => 
    product.recommendedSigns.includes(sign)
  );
}

// Get products by category
export function getProductsByCategory(category: ProductCategory): AffiliateProduct[] {
  return affiliateProducts.filter(product => product.category === category);
}

// Get all product categories with labels
export const productCategories: {id: ProductCategory; label: string}[] = [
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'supplements', label: 'Supplements' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'meditation', label: 'Meditation' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'selfcare', label: 'Self Care' },
];