/**
 * AI Coach Service
 * Provides personalized wellness coaching using zodiac-aware prompts
 */

import OpenAI from 'openai';
import { ConversationContext, buildMessageHistory, addMessage } from './context.service';
import { logger } from '../../logger';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zodiac personality traits for personalized coaching
const ZODIAC_TRAITS: Record<string, {
  element: string;
  traits: string[];
  wellnessStyle: string;
  motivationStyle: string;
}> = {
  aries: {
    element: 'Fire',
    traits: ['energetic', 'competitive', 'bold', 'impatient'],
    wellnessStyle: 'High-intensity workouts, competitive sports, quick results',
    motivationStyle: 'Direct challenges, achievement-focused goals, action-oriented advice',
  },
  taurus: {
    element: 'Earth',
    traits: ['patient', 'reliable', 'sensual', 'stubborn'],
    wellnessStyle: 'Consistent routines, sensory experiences, comfort-focused',
    motivationStyle: 'Steady progress, tangible rewards, practical advice',
  },
  gemini: {
    element: 'Air',
    traits: ['curious', 'adaptable', 'witty', 'restless'],
    wellnessStyle: 'Variety in activities, social wellness, mental stimulation',
    motivationStyle: 'Interesting facts, variety in suggestions, conversational approach',
  },
  cancer: {
    element: 'Water',
    traits: ['nurturing', 'intuitive', 'emotional', 'protective'],
    wellnessStyle: 'Home-based wellness, emotional health, nurturing self-care',
    motivationStyle: 'Emotional support, family-oriented goals, gentle encouragement',
  },
  leo: {
    element: 'Fire',
    traits: ['confident', 'dramatic', 'generous', 'proud'],
    wellnessStyle: 'Group fitness, performance-based activities, spotlight moments',
    motivationStyle: 'Recognition, celebratory approach, confidence-building',
  },
  virgo: {
    element: 'Earth',
    traits: ['analytical', 'practical', 'perfectionist', 'helpful'],
    wellnessStyle: 'Structured programs, detailed tracking, health optimization',
    motivationStyle: 'Data-driven insights, systematic approaches, practical tips',
  },
  libra: {
    element: 'Air',
    traits: ['diplomatic', 'harmonious', 'social', 'indecisive'],
    wellnessStyle: 'Partner activities, balanced routines, aesthetic experiences',
    motivationStyle: 'Balanced perspectives, social support, harmony-focused',
  },
  scorpio: {
    element: 'Water',
    traits: ['intense', 'determined', 'mysterious', 'transformative'],
    wellnessStyle: 'Transformational programs, deep healing, intensity',
    motivationStyle: 'Deep insights, transformation narratives, intensity',
  },
  sagittarius: {
    element: 'Fire',
    traits: ['adventurous', 'optimistic', 'philosophical', 'restless'],
    wellnessStyle: 'Outdoor activities, adventure sports, exploration',
    motivationStyle: 'Big picture thinking, adventure framing, philosophical insights',
  },
  capricorn: {
    element: 'Earth',
    traits: ['ambitious', 'disciplined', 'responsible', 'reserved'],
    wellnessStyle: 'Goal-oriented programs, career-health balance, long-term plans',
    motivationStyle: 'Achievement-focused, structured goals, professional tone',
  },
  aquarius: {
    element: 'Air',
    traits: ['innovative', 'independent', 'humanitarian', 'detached'],
    wellnessStyle: 'Unconventional methods, technology-assisted, community wellness',
    motivationStyle: 'Innovative approaches, unique perspectives, community impact',
  },
  pisces: {
    element: 'Water',
    traits: ['compassionate', 'artistic', 'intuitive', 'escapist'],
    wellnessStyle: 'Spiritual practices, water activities, creative expression',
    motivationStyle: 'Intuitive guidance, spiritual framing, creative approaches',
  },
};

// System prompt template
const SYSTEM_PROMPT_TEMPLATE = `You are Celeste, an empathetic and knowledgeable AI wellness coach with expertise in holistic health, astrology, and personalized wellness guidance.

PERSONALITY:
- Warm, supportive, and understanding
- Combines scientific wellness knowledge with astrological insights
- Offers practical, actionable advice
- Celebrates small wins and progress
- Uses occasional cosmic/celestial metaphors naturally

{{ZODIAC_CONTEXT}}

CAPABILITIES:
- Nutrition and diet guidance
- Fitness and exercise recommendations
- Stress management and mindfulness
- Sleep optimization
- Emotional wellness support
- Habit formation and tracking
- Lunar cycle wellness alignment

GUIDELINES:
1. Always be supportive and non-judgmental
2. Provide evidence-based wellness advice
3. Incorporate the user's zodiac traits naturally (when known)
4. Keep responses conversational but informative
5. Suggest actionable steps they can take today
6. Ask follow-up questions to better understand their needs
7. Reference their progress and previous conversations when relevant

FORMAT:
- Keep responses concise but helpful (2-4 paragraphs max)
- Use bullet points for lists
- Include 1-2 specific actionable suggestions
- End with an encouraging note or question`;

/**
 * Build a personalized system prompt based on zodiac sign
 */
export function buildSystemPrompt(zodiacSign?: string | null): string {
  let zodiacContext = '';

  if (zodiacSign && ZODIAC_TRAITS[zodiacSign.toLowerCase()]) {
    const traits = ZODIAC_TRAITS[zodiacSign.toLowerCase()];
    zodiacContext = `
USER'S ZODIAC PROFILE:
- Sign: ${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)}
- Element: ${traits.element}
- Key Traits: ${traits.traits.join(', ')}
- Wellness Style: ${traits.wellnessStyle}
- Motivation Approach: ${traits.motivationStyle}

Naturally incorporate this zodiac awareness into your responses, but don't force it.`;
  } else {
    zodiacContext = 'No zodiac information available. Provide general wellness coaching.';
  }

  return SYSTEM_PROMPT_TEMPLATE.replace('{{ZODIAC_CONTEXT}}', zodiacContext);
}

/**
 * Generate AI coach response (non-streaming)
 */
export async function generateCoachResponse(
  userMessage: string,
  context: ConversationContext
): Promise<string> {
  try {
    const systemPrompt = buildSystemPrompt(context.zodiacSign);
    const messageHistory = buildMessageHistory(context);

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messageHistory,
      { role: 'user', content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';

    // Save messages to database
    await addMessage(context.id, 'user', userMessage);
    await addMessage(context.id, 'assistant', response);

    logger.info({ conversationId: context.id }, 'Generated AI coach response');
    return response;
  } catch (error) {
    logger.error({ err: error, conversationId: context.id }, 'Failed to generate AI response');
    throw error;
  }
}

/**
 * Generate AI coach response with streaming
 */
export async function* generateCoachResponseStream(
  userMessage: string,
  context: ConversationContext
): AsyncGenerator<string, void, unknown> {
  try {
    const systemPrompt = buildSystemPrompt(context.zodiacSign);
    const messageHistory = buildMessageHistory(context);

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messageHistory,
      { role: 'user', content: userMessage },
    ];

    // Save user message immediately
    await addMessage(context.id, 'user', userMessage);

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        yield content;
      }
    }

    // Save assistant response after streaming completes
    await addMessage(context.id, 'assistant', fullResponse);

    logger.info({ conversationId: context.id }, 'Completed streaming AI coach response');
  } catch (error) {
    logger.error({ err: error, conversationId: context.id }, 'Failed to stream AI response');
    throw error;
  }
}

/**
 * Suggested prompts based on context
 */
export function getSuggestedPrompts(zodiacSign?: string | null): string[] {
  const generalPrompts = [
    "What's a good morning routine for me?",
    "How can I improve my sleep quality?",
    "I'm feeling stressed. What should I do?",
    "What foods should I focus on this week?",
    "Help me create a simple workout plan",
  ];

  if (!zodiacSign || !ZODIAC_TRAITS[zodiacSign.toLowerCase()]) {
    return generalPrompts;
  }

  const traits = ZODIAC_TRAITS[zodiacSign.toLowerCase()];
  const signName = zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1);

  // Add zodiac-specific prompts
  const zodiacPrompts: Record<string, string[]> = {
    fire: [
      `What high-energy workouts suit ${signName}?`,
      "How can I channel my energy productively?",
    ],
    earth: [
      `What grounding practices work for ${signName}?`,
      "How can I build sustainable health habits?",
    ],
    air: [
      `How can I keep my wellness routine interesting as a ${signName}?`,
      "What mental wellness practices should I try?",
    ],
    water: [
      `How do I manage emotional wellness as a ${signName}?`,
      "What self-care practices align with my intuitive nature?",
    ],
  };

  const elementPrompts = zodiacPrompts[traits.element.toLowerCase()] || [];
  return [...elementPrompts, ...generalPrompts.slice(0, 3)];
}

/**
 * Get wellness insight based on zodiac
 */
export function getZodiacWellnessInsight(zodiacSign: string): string | null {
  const traits = ZODIAC_TRAITS[zodiacSign.toLowerCase()];
  if (!traits) return null;

  return `As a ${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)} (${traits.element} sign), your wellness journey thrives with ${traits.wellnessStyle.toLowerCase()}. Your natural ${traits.traits.slice(0, 2).join(' and ')} nature means you respond best to ${traits.motivationStyle.toLowerCase()}.`;
}
