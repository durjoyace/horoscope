/**
 * AI Coach Feature Types
 */

export interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: number;
  userId: number;
  topic: string | null;
  zodiacSign: string | null;
  messageCount: number;
  lastMessageAt: string | null;
  recentMessages?: Message[];
}

export interface ConversationWithContext extends Conversation {
  recentMessages: Message[];
}

export interface CreateConversationResponse {
  success: boolean;
  message: string;
  data: {
    conversation: Conversation;
    suggestedPrompts: string[];
    zodiacInsight: string | null;
  };
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    conversationId: number;
    message: string;
  };
}

export interface SSEMessage {
  type: 'start' | 'token' | 'complete' | 'error';
  content?: string;
  conversationId?: number;
  totalLength?: number;
  message?: string;
}

export interface PromptsResponse {
  success: boolean;
  data: {
    prompts: string[];
    zodiacInsight: string | null;
  };
}

// Coach personality configuration
export const COACH_NAME = 'Celeste';
export const COACH_TAGLINE = 'Your Cosmic Wellness Guide';

// Animation durations (ms)
export const TYPING_SPEED = 30;
export const MESSAGE_FADE_IN = 300;
export const AVATAR_PULSE = 2000;

// UI Colors for zodiac elements
export const ELEMENT_COLORS: Record<string, { primary: string; secondary: string; glow: string }> = {
  fire: { primary: '#ef4444', secondary: '#fca5a5', glow: 'rgba(239, 68, 68, 0.3)' },
  earth: { primary: '#22c55e', secondary: '#86efac', glow: 'rgba(34, 197, 94, 0.3)' },
  air: { primary: '#3b82f6', secondary: '#93c5fd', glow: 'rgba(59, 130, 246, 0.3)' },
  water: { primary: '#8b5cf6', secondary: '#c4b5fd', glow: 'rgba(139, 92, 246, 0.3)' },
};

// Map zodiac signs to elements
export const ZODIAC_ELEMENTS: Record<string, string> = {
  aries: 'fire',
  leo: 'fire',
  sagittarius: 'fire',
  taurus: 'earth',
  virgo: 'earth',
  capricorn: 'earth',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
};

export function getElementColor(zodiacSign?: string | null) {
  if (!zodiacSign) return ELEMENT_COLORS.air;
  const element = ZODIAC_ELEMENTS[zodiacSign.toLowerCase()];
  return ELEMENT_COLORS[element] || ELEMENT_COLORS.air;
}
