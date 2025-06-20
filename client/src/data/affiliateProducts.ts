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
  horoscopeHealthReason?: string;
}

export type ProductCategory = 
  | 'nutrition'
  | 'supplements'
  | 'fitness'
  | 'sleep'
  | 'meditation'
  | 'skincare'
  | 'selfcare';

// Premium wellness products from top DTC brands
export const affiliateProducts: AffiliateProduct[] = [
  {
    id: "prod-001",
    name: "Athletic Greens AG1",
    description: "Comprehensive daily nutritional insurance with 75 vitamins, minerals, and whole-food sourced ingredients in one scoop.",
    price: 99.00,
    imageUrl: "https://images.unsplash.com/photo-1556909114-54c8c57a52a6?w=400",
    category: "supplements",
    rating: 4.8,
    recommendedSigns: ["aries", "leo", "sagittarius", "capricorn"],
    affiliateUrl: "https://athleticgreens.com",
    horoscopeHealthReason: "Fire signs and ambitious Capricorns thrive with comprehensive nutrition that fuels their high-energy lifestyle and goal-oriented nature."
  },
  {
    id: "prod-002",
    name: "Bloom Nutrition Greens & Superfoods",
    description: "Digestive health superfood powder with probiotics, digestive enzymes, and organic fruits and vegetables.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "supplements",
    rating: 4.7,
    recommendedSigns: ["virgo", "taurus", "cancer", "scorpio"],
    affiliateUrl: "https://bloomnutrition.com",
    horoscopeHealthReason: "Earth and water signs benefit from digestive support that aligns with their sensitive systems and focus on gut health and emotional balance."
  },
  {
    id: "prod-003",
    name: "Ritual Essential for Women",
    description: "Science-backed multivitamin with traceable, bioavailable nutrients. Vegan, gluten-free, and third-party tested.",
    price: 35.00,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    category: "supplements",
    rating: 4.6,
    recommendedSigns: ["libra", "gemini", "aquarius", "pisces"],
    affiliateUrl: "https://ritual.com",
    horoscopeHealthReason: "Air signs and intuitive Pisces appreciate transparent ingredients and clean formulations that align with their values of balance and authenticity."
  },
  {
    id: "prod-004",
    name: "Four Sigmatic Mushroom Coffee",
    description: "Organic coffee with Lion's Mane and Chaga mushrooms for focus and immune support without the jitters.",
    price: 15.95,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    category: "nutrition",
    rating: 4.5,
    recommendedSigns: ["sagittarius", "gemini", "aquarius", "aries"],
    affiliateUrl: "https://foursigmatic.com"
  },
  {
    id: "prod-005",
    name: "Thorne Health Multivitamin Elite",
    description: "NSF Certified for Sport multivitamin designed for active individuals with optimal nutrient forms.",
    price: 46.00,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    category: "supplements",
    rating: 4.9,
    recommendedSigns: ["leo", "aries", "capricorn", "scorpio"],
    affiliateUrl: "https://thorne.com"
  },
  {
    id: "prod-006",
    name: "Seed Daily Synbiotic",
    description: "Precision probiotic with 24 clinically-studied strains to support digestive, immune, and heart health.",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031d4cc?w=400",
    category: "supplements",
    rating: 4.8,
    recommendedSigns: ["virgo", "cancer", "taurus", "pisces"],
    affiliateUrl: "https://seed.com"
  },
  {
    id: "prod-007",
    name: "Huel Complete Nutrition",
    description: "Nutritionally complete meal replacement with 27 essential vitamins and minerals, plant-based protein, and fiber.",
    price: 66.50,
    imageUrl: "https://images.unsplash.com/photo-1556909114-54c8c57a52a6?w=400",
    category: "nutrition",
    rating: 4.4,
    recommendedSigns: ["capricorn", "virgo", "aquarius", "gemini"],
    affiliateUrl: "https://huel.com"
  },
  {
    id: "prod-008",
    name: "Liquid IV Hydration Multiplier",
    description: "Electrolyte drink mix that hydrates faster than water alone using Cellular Transport Technology.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
    category: "supplements",
    rating: 4.6,
    recommendedSigns: ["aries", "leo", "sagittarius", "gemini"],
    affiliateUrl: "https://liquid-iv.com"
  },
  {
    id: "prod-009",
    name: "Goop Beauty G.Tox Himalayan Salt Scalp Scrub",
    description: "Detoxifying scalp treatment with pink Himalayan salt and rosemary oil for healthy hair growth.",
    price: 42.00,
    imageUrl: "https://images.unsplash.com/photo-1522338140262-f46f5913618f?w=400",
    category: "skincare",
    rating: 4.3,
    recommendedSigns: ["leo", "libra", "taurus", "pisces"],
    affiliateUrl: "https://goop.com"
  },
  {
    id: "prod-010",
    name: "Oura Ring Generation 3",
    description: "Advanced health tracking ring monitoring sleep, activity, readiness, and heart rate variability.",
    price: 299.00,
    imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
    category: "fitness",
    rating: 4.7,
    recommendedSigns: ["scorpio", "capricorn", "virgo", "aquarius"],
    affiliateUrl: "https://ouraring.com"
  },
  {
    id: "prod-011",
    name: "Nutrafol Women's Hair Growth Supplements",
    description: "Physician-formulated hair growth supplement with clinically effective ingredients for thicker, stronger hair.",
    price: 88.00,
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
    category: "supplements",
    rating: 4.5,
    recommendedSigns: ["leo", "libra", "taurus", "cancer"],
    affiliateUrl: "https://nutrafol.com"
  },
  {
    id: "prod-012",
    name: "Theragun PRO Percussive Therapy Device",
    description: "Professional-grade percussive therapy device for muscle recovery and pain relief with customizable speed settings.",
    price: 599.00,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "fitness",
    rating: 4.8,
    recommendedSigns: ["aries", "leo", "sagittarius", "capricorn"],
    affiliateUrl: "https://therabody.com"
  },
  {
    id: "prod-013",
    name: "Organifi Green Juice Powder",
    description: "Organic superfood powder blend with 11 superfoods including wheatgrass, moringa, and chlorella for natural energy.",
    price: 69.95,
    imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400",
    category: "supplements",
    rating: 4.5,
    recommendedSigns: ["taurus", "virgo", "capricorn", "cancer"],
    affiliateUrl: "https://organifi.com"
  },
  {
    id: "prod-014",
    name: "MUD\\WTR Morning Ritual",
    description: "Mushroom-based coffee alternative with Lion's Mane, Chaga, Reishi, and Cordyceps for sustained energy without caffeine crash.",
    price: 40.00,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    category: "nutrition",
    rating: 4.3,
    recommendedSigns: ["aquarius", "gemini", "libra", "sagittarius"],
    affiliateUrl: "https://mudwtr.com"
  },
  {
    id: "prod-015",
    name: "Whoop 4.0 Fitness Tracker",
    description: "24/7 health monitoring with strain coaching, sleep optimization, and recovery insights. No screen, just data.",
    price: 30.00,
    imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
    category: "fitness",
    rating: 4.6,
    recommendedSigns: ["scorpio", "capricorn", "aries", "leo"],
    affiliateUrl: "https://whoop.com"
  },
  {
    id: "prod-016",
    name: "Ancient Nutrition Bone Broth Protein",
    description: "Gut-friendly protein powder made from real bone broth with 20g protein per serving and natural collagen.",
    price: 44.95,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    category: "supplements",
    rating: 4.4,
    recommendedSigns: ["taurus", "cancer", "scorpio", "capricorn"],
    affiliateUrl: "https://ancientnutrition.com"
  },
  {
    id: "prod-017",
    name: "Peloton Guide Strength Training System",
    description: "AI-powered strength training system with movement tracking and personalized workout recommendations.",
    price: 295.00,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "fitness",
    rating: 4.2,
    recommendedSigns: ["leo", "aries", "sagittarius", "capricorn"],
    affiliateUrl: "https://onepeloton.com"
  },
  {
    id: "prod-018",
    name: "Sakara Life Metabolism Super Powder",
    description: "Plant-based metabolism booster with organic superfoods, adaptogens, and digestive enzymes.",
    price: 65.00,
    imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400",
    category: "supplements",
    rating: 4.1,
    recommendedSigns: ["libra", "gemini", "aquarius", "virgo"],
    affiliateUrl: "https://sakara.com"
  },
  {
    id: "prod-019",
    name: "Headspace Meditation & Sleep App",
    description: "Premium meditation app with guided sessions for sleep, focus, stress relief, and mindfulness training.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    category: "meditation",
    rating: 4.8,
    recommendedSigns: ["pisces", "cancer", "libra", "aquarius"],
    affiliateUrl: "https://headspace.com"
  },
  {
    id: "prod-020",
    name: "Sunday Riley Good Genes Lactic Acid Treatment",
    description: "Lactic acid treatment that smooths, brightens, and improves skin texture with purified lactic acid.",
    price: 122.00,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    category: "skincare",
    rating: 4.7,
    recommendedSigns: ["leo", "libra", "taurus", "scorpio"],
    affiliateUrl: "https://sundayriley.com"
  },
  {
    id: "prod-021",
    name: "Bulletproof Brain Octane C8 MCT Oil",
    description: "Pure C8 MCT oil for rapid ketone production, mental clarity, and sustained energy without sugar crashes.",
    price: 35.95,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    category: "supplements",
    rating: 4.6,
    recommendedSigns: ["gemini", "sagittarius", "aquarius", "aries"],
    affiliateUrl: "https://bulletproof.com"
  },
  {
    id: "prod-022",
    name: "Therabody Wave Duo Percussive Therapy",
    description: "Dual-node percussive therapy device designed for targeted muscle treatment and trigger point release.",
    price: 199.00,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "fitness",
    rating: 4.5,
    recommendedSigns: ["aries", "leo", "capricorn", "scorpio"],
    affiliateUrl: "https://therabody.com"
  },
  {
    id: "prod-023",
    name: "Vital Proteins Beauty Collagen",
    description: "Collagen peptides with hyaluronic acid and probiotics for skin hydration and gut health support.",
    price: 54.99,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    category: "supplements",
    rating: 4.4,
    recommendedSigns: ["taurus", "libra", "leo", "cancer"],
    affiliateUrl: "https://vitalproteins.com"
  },
  {
    id: "prod-024",
    name: "Lululemon Align High-Rise Pant",
    description: "Buttery-soft yoga pants made with Nulu fabric for ultimate comfort during low-impact workouts.",
    price: 128.00,
    imageUrl: "https://images.unsplash.com/photo-1506629905962-b4d5ad76f2f7?w=400",
    category: "fitness",
    rating: 4.9,
    recommendedSigns: ["libra", "taurus", "pisces", "cancer"],
    affiliateUrl: "https://lululemon.com"
  },
  {
    id: "prod-025",
    name: "HUM Nutrition Daily Cleanse",
    description: "14-ingredient blend with spirulina and chlorella to support natural detoxification and clear skin.",
    price: 40.00,
    imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400",
    category: "supplements",
    rating: 4.3,
    recommendedSigns: ["virgo", "scorpio", "capricorn", "pisces"],
    affiliateUrl: "https://humnutrition.com"
  },
  {
    id: "prod-026",
    name: "Calm Premium Meditation App",
    description: "Award-winning meditation app with sleep stories, masterclasses, and guided meditation sessions.",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    category: "meditation",
    rating: 4.6,
    recommendedSigns: ["cancer", "pisces", "libra", "taurus"],
    affiliateUrl: "https://calm.com"
  },
  {
    id: "prod-027",
    name: "Glossier Olivia Rodrigo Lip Balm Set",
    description: "Nourishing lip balm trio with rose, cherry, and coconut flavors for soft, hydrated lips.",
    price: 36.00,
    imageUrl: "https://images.unsplash.com/photo-1522338140262-f46f5913618f?w=400",
    category: "skincare",
    rating: 4.5,
    recommendedSigns: ["leo", "libra", "gemini", "aquarius"],
    affiliateUrl: "https://glossier.com"
  },
  {
    id: "prod-028",
    name: "Moon Juice SuperHair Daily Hair Nutrition",
    description: "Adaptogenic hair supplement with ashwagandha, fo-ti, and horsetail for stronger, shinier hair.",
    price: 60.00,
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
    category: "supplements",
    rating: 4.2,
    recommendedSigns: ["leo", "taurus", "libra", "virgo"],
    affiliateUrl: "https://moonjuice.com"
  },
  {
    id: "prod-029",
    name: "Fitbit Sense 2 Advanced Health Smartwatch",
    description: "Advanced health smartwatch with stress management, sleep tracking, and 6-month Fitbit Premium membership.",
    price: 299.95,
    imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
    category: "fitness",
    rating: 4.4,
    recommendedSigns: ["capricorn", "virgo", "scorpio", "aquarius"],
    affiliateUrl: "https://fitbit.com"
  },
  {
    id: "prod-030",
    name: "Honest Beauty Vitamin C Radiance Serum",
    description: "Brightening vitamin C serum with hyaluronic acid and sea buckthorn for glowing, even-toned skin.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    category: "skincare",
    rating: 4.4,
    recommendedSigns: ["leo", "aries", "sagittarius", "libra"],
    affiliateUrl: "https://honest.com"
  },
  {
    id: "prod-031",
    name: "Gua Sha Beauty Tool by Wildling",
    description: "Premium stainless steel gua sha tool for facial massage, lymphatic drainage, and natural skin tightening.",
    price: 29.00,
    imageUrl: "https://images.unsplash.com/photo-1570554886111-1bac8cfa337a?w=400",
    category: "skincare",
    rating: 4.6,
    recommendedSigns: ["taurus", "libra", "cancer", "pisces"],
    affiliateUrl: "https://wildling.com"
  },
  {
    id: "prod-032",
    name: "Onnit Alpha Brain Nootropic",
    description: "Clinically studied nootropic with Alpha-GPC, bacopa, and cat's claw for memory, focus, and processing speed.",
    price: 79.95,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    category: "supplements",
    rating: 4.3,
    recommendedSigns: ["gemini", "aquarius", "virgo", "scorpio"],
    affiliateUrl: "https://onnit.com"
  },
  {
    id: "prod-033",
    name: "Caudalie Beauty Elixir Face Mist",
    description: "Cult-favorite face mist with grape water and rosemary to tighten pores and set makeup naturally.",
    price: 49.00,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    category: "skincare",
    rating: 4.7,
    recommendedSigns: ["libra", "leo", "gemini", "pisces"],
    affiliateUrl: "https://caudalie.com"
  },
  {
    id: "prod-034",
    name: "Theragun Elite Percussive Therapy",
    description: "Quietest percussive therapy device with OLED screen, personalized routines, and 5 built-in speeds.",
    price: 399.00,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "fitness",
    rating: 4.8,
    recommendedSigns: ["aries", "leo", "capricorn", "sagittarius"],
    affiliateUrl: "https://therabody.com"
  },
  {
    id: "prod-035",
    name: "Smartypants Women's Complete Vitamins",
    description: "Premium gummy vitamins with omega-3s, vitamin D3, B12, and folate for comprehensive daily nutrition.",
    price: 24.95,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    category: "supplements",
    rating: 4.5,
    recommendedSigns: ["cancer", "taurus", "virgo", "pisces"],
    affiliateUrl: "https://smartypantsvitamins.com"
  },
  {
    id: "prod-036",
    name: "Kitsch Satin Sleep Set",
    description: "Luxurious satin pillowcase and scrunchie set designed to reduce hair breakage and maintain skin moisture.",
    price: 32.00,
    imageUrl: "https://images.unsplash.com/photo-1522338140262-f46f5913618f?w=400",
    category: "selfcare",
    rating: 4.6,
    recommendedSigns: ["leo", "libra", "taurus", "cancer"],
    affiliateUrl: "https://mykitsch.com"
  },
  {
    id: "prod-037",
    name: "Brightland Olive Oil ALIVE",
    description: "Cold-pressed extra virgin olive oil from California olives, perfect for daily wellness and culinary use.",
    price: 36.00,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
    category: "nutrition",
    rating: 4.8,
    recommendedSigns: ["taurus", "virgo", "capricorn", "cancer"],
    affiliateUrl: "https://brightland.co"
  },
  {
    id: "prod-038",
    name: "Chamberlain Coffee House Blend",
    description: "Ethically sourced, small-batch coffee roasted to perfection for a smooth, rich flavor experience.",
    price: 18.00,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    category: "nutrition",
    rating: 4.4,
    recommendedSigns: ["gemini", "sagittarius", "aquarius", "aries"],
    affiliateUrl: "https://chamberlaincoffee.com"
  },
  {
    id: "prod-039",
    name: "Everlywell Food Sensitivity Test",
    description: "At-home food sensitivity test analyzing 96 foods to help optimize your diet and wellness routine.",
    price: 159.00,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    category: "supplements",
    rating: 4.2,
    recommendedSigns: ["virgo", "scorpio", "capricorn", "aquarius"],
    affiliateUrl: "https://everlywell.com"
  },
  {
    id: "prod-040",
    name: "OUAI Hair Treatment Masque",
    description: "Weekly treatment masque with babassu and murumuru oils for deep hydration and silky, smooth hair.",
    price: 32.00,
    imageUrl: "https://images.unsplash.com/photo-1522338140262-f46f5913618f?w=400",
    category: "skincare",
    rating: 4.5,
    recommendedSigns: ["leo", "libra", "taurus", "cancer"],
    affiliateUrl: "https://theouai.com"
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