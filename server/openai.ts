import OpenAI from "openai";
import { ZodiacSign, WellnessCategory, HoroscopeContent } from "@shared/types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "your-api-key" });

// Function to generate a health horoscope for a specific zodiac sign
export async function generateHealthHoroscope(
  sign: ZodiacSign,
  date: string
): Promise<HoroscopeContent> {
  try {
    const zodiacTraits = getZodiacTraits(sign);
    
    const prompt = `
    Generate a health-focused horoscope for ${sign} for ${date}. 
    The horoscope should include:
    
    1. A brief overview of how cosmic energies affect ${sign}'s health and wellness today
    2. Specific health tips based on ${sign}'s ${zodiacTraits.element} element and ${zodiacTraits.characteristics}
    3. Nutritional guidance that would benefit a ${sign} today
    4. An element alignment note related to ${sign}'s ${zodiacTraits.element} element
    
    Focus on actionable, practical advice in these wellness categories: nutrition, sleep, stress, fitness, mindfulness.
    Make the advice specific, evidence-informed, and personalized to ${sign}.
    
    Respond with JSON in this format:
    {
      "overview": "Brief overview of cosmic influence on health",
      "wellnessCategories": ["pick 1-3 from: nutrition, sleep, stress, fitness, mindfulness"],
      "healthTip": "Specific actionable health tip for today",
      "nutritionFocus": "Food or nutrient to focus on today",
      "elementAlignment": "How their element influences wellbeing today"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert astrologer with deep knowledge of wellness and health. You create personalized health horoscopes that blend cosmic insights with actionable wellness advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const horoscopeContent = JSON.parse(response.choices[0].message.content) as HoroscopeContent;
    return horoscopeContent;
  } catch (error) {
    console.error("Error generating horoscope:", error);
    throw new Error("Failed to generate horoscope. Please try again later.");
  }
}

// Helper function to get zodiac sign traits
function getZodiacTraits(sign: ZodiacSign): { element: string; characteristics: string } {
  const traits = {
    aries: {
      element: "fire",
      characteristics: "active, energetic, impulsive nature"
    },
    taurus: {
      element: "earth",
      characteristics: "grounded, steady, sensory-focused nature"
    },
    gemini: {
      element: "air",
      characteristics: "intellectual, communicative, adaptable nature"
    },
    cancer: {
      element: "water",
      characteristics: "emotional, nurturing, intuitive nature"
    },
    leo: {
      element: "fire",
      characteristics: "passionate, expressive, confident nature"
    },
    virgo: {
      element: "earth",
      characteristics: "analytical, detail-oriented, health-conscious nature"
    },
    libra: {
      element: "air",
      characteristics: "balanced, social, harmony-seeking nature"
    },
    scorpio: {
      element: "water",
      characteristics: "intense, transformative, determined nature"
    },
    sagittarius: {
      element: "fire",
      characteristics: "adventurous, optimistic, freedom-loving nature"
    },
    capricorn: {
      element: "earth",
      characteristics: "disciplined, ambitious, structured nature"
    },
    aquarius: {
      element: "air",
      characteristics: "innovative, independent, humanitarian nature"
    },
    pisces: {
      element: "water",
      characteristics: "compassionate, intuitive, dreamy nature"
    }
  };
  
  return traits[sign];
}
