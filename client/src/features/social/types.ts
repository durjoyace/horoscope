/**
 * Social Feature Types
 */

export interface Friend {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  zodiacSign: string | null;
  friendshipId: number;
  friendSince: string;
}

export interface PendingRequest {
  id: number;
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    zodiacSign: string | null;
  };
  requestedAt: string;
  type: 'incoming' | 'outgoing';
}

export interface Conversation {
  id: number;
  otherUser: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    zodiacSign: string | null;
  };
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// Zodiac sign emojis
export const ZODIAC_EMOJIS: Record<string, string> = {
  aries: '\u2648',
  taurus: '\u2649',
  gemini: '\u264A',
  cancer: '\u264B',
  leo: '\u264C',
  virgo: '\u264D',
  libra: '\u264E',
  scorpio: '\u264F',
  sagittarius: '\u2650',
  capricorn: '\u2651',
  aquarius: '\u2652',
  pisces: '\u2653',
};

export function getDisplayName(user: { firstName: string | null; lastName: string | null; email: string }): string {
  if (user.firstName || user.lastName) {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
  }
  return user.email.split('@')[0];
}

export function getZodiacEmoji(sign: string | null): string {
  if (!sign) return '';
  return ZODIAC_EMOJIS[sign.toLowerCase()] || '';
}
