import { WellnessCategory } from "@shared/types";

export interface WellnessCategoryInfo {
  category: WellnessCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  pills: string[];
}

export const wellnessCategories: WellnessCategoryInfo[] = [
  {
    category: "nutrition",
    name: "Nutrition",
    description: "Personalized dietary insights based on your zodiac element and planetary alignments.",
    icon: "utensils",
    color: "teal",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    pills: ["Foods to Focus On", "Hydration", "Digestion"]
  },
  {
    category: "sleep",
    name: "Sleep",
    description: "Rest and recovery strategies aligned with lunar cycles and your sign's energy patterns.",
    icon: "moon",
    color: "indigo",
    image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    pills: ["Sleep Quality", "Relaxation", "Dreams"]
  },
  {
    category: "stress",
    name: "Stress",
    description: "Techniques to manage stress based on your zodiac sign's typical stress response patterns.",
    icon: "wind",
    color: "amber",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    pills: ["Stress Reduction", "Emotional Balance", "Breath Work"]
  },
  {
    category: "fitness",
    name: "Fitness",
    description: "Movement recommendations tailored to your zodiac element and current planetary energies.",
    icon: "dumbbell",
    color: "amber",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    pills: ["Exercise Type", "Energy Levels", "Recovery"]
  },
  {
    category: "mindfulness",
    name: "Mindfulness",
    description: "Mental wellness practices that align with your sign's strengths and challenges.",
    icon: "brain",
    color: "violet",
    image: "https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    pills: ["Mental Clarity", "Focus", "Intuition"]
  }
];

export interface Testimonial {
  name: string;
  zodiacSign: string;
  icon: string;
  testimonial: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "Jessica T.",
    zodiacSign: "Pisces",
    icon: "water",
    testimonial: "I've always struggled with setting boundaries, but my daily horoscope consistently reminds me when I need to prioritize my emotional wellbeing. It's like having a celestial wellness coach!",
    rating: 5
  },
  {
    name: "Marcus L.",
    zodiacSign: "Aries",
    icon: "fire",
    testimonial: "As a skeptic, I didn't expect much, but the fitness recommendations are surprisingly on point! The workout suggestions match my energy levels so well I've actually stuck with my routine for 3 months.",
    rating: 4.5
  },
  {
    name: "Priya K.",
    zodiacSign: "Capricorn",
    icon: "mountain",
    testimonial: "The nutrition tips have helped me be more mindful about my eating habits. As a Capricorn, I tend to skip meals when busy, but my daily reminders keep me on track with proper nourishment.",
    rating: 5
  }
];

export interface ZodiacTrait {
  title: string;
  description: string;
  icon: string;
}

export const zodiacTraits: ZodiacTrait[] = [
  {
    title: "Personalized Rest Patterns",
    description: "Cancer needs more recovery time after social events",
    icon: "moon"
  },
  {
    title: "Stress Response Insights",
    description: "Aries benefits from physical activity to release tension",
    icon: "fire"
  },
  {
    title: "Nutrition Alignments",
    description: "Taurus might benefit from mindful eating practices",
    icon: "apple-alt"
  }
];

export const valuePropositions = [
  {
    title: "Daily Health Tips for Your Zodiac Sign",
    description: "Personalized recommendations based on your astrological profile.",
    icon: "star"
  },
  {
    title: "Watchouts for Stress, Burnout & Energy Slumps",
    description: "Timely alerts when zodiac alignments might affect your wellbeing.",
    icon: "wind"
  },
  {
    title: "Micro-Habits Backed by Wellness Experts",
    description: "Simple, science-based actions you can take each day.",
    icon: "leaf"
  },
  {
    title: "Delivered by Email & Optional SMS",
    description: "Receive your guidance when and where you need it most.",
    icon: "envelope"
  }
];
