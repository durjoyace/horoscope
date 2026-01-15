/**
 * Typing Indicator Component
 * Shows animated dots when AI is generating a response
 */

import { motion } from 'framer-motion';
import { CoachAvatar } from './CoachAvatar';
import { getElementColor, COACH_NAME } from './types';

interface TypingIndicatorProps {
  zodiacSign?: string | null;
}

export function TypingIndicator({ zodiacSign }: TypingIndicatorProps) {
  const colors = getElementColor(zodiacSign);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 items-start"
    >
      <CoachAvatar zodiacSign={zodiacSign} size="sm" isTyping />

      <div
        className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/10 backdrop-blur-sm border border-white/20"
        style={{ borderColor: `${colors.primary}30` }}
      >
        <div className="flex items-center gap-1">
          <span className="text-sm text-white/60 mr-2">{COACH_NAME} is typing</span>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Streaming text indicator with partial text
 */
interface StreamingTextProps {
  text: string;
  zodiacSign?: string | null;
}

export function StreamingText({ text, zodiacSign }: StreamingTextProps) {
  const colors = getElementColor(zodiacSign);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 items-start"
    >
      <CoachAvatar zodiacSign={zodiacSign} size="sm" isTyping />

      <div
        className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/10 backdrop-blur-sm border border-white/20 max-w-[80%]"
        style={{ borderColor: `${colors.primary}30` }}
      >
        <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
          {text}
          <motion.span
            className="inline-block w-2 h-4 ml-0.5 rounded-sm"
            style={{ backgroundColor: colors.primary }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </p>
      </div>
    </motion.div>
  );
}
