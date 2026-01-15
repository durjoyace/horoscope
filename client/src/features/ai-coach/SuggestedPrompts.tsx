/**
 * Suggested Prompts Component
 * Quick-select prompts to start conversations
 */

import { motion } from 'framer-motion';
import { getElementColor } from './types';

interface SuggestedPromptsProps {
  prompts: string[];
  zodiacSign?: string | null;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedPrompts({
  prompts,
  zodiacSign,
  onSelect,
  disabled = false,
}: SuggestedPromptsProps) {
  const colors = getElementColor(zodiacSign);

  if (prompts.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/50 uppercase tracking-wider">Suggested Topics</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <motion.button
            key={prompt}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(prompt)}
            disabled={disabled}
            className="px-3 py-2 text-sm rounded-full border border-white/20 bg-white/5
                       text-white/80 hover:bg-white/10 hover:border-white/40
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: disabled ? undefined : `${colors.primary}40`,
            }}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/**
 * Welcome message with zodiac insight
 */
interface WelcomeMessageProps {
  zodiacSign?: string | null;
  zodiacInsight?: string | null;
  coachName: string;
}

export function WelcomeMessage({ zodiacSign, zodiacInsight, coachName }: WelcomeMessageProps) {
  const colors = getElementColor(zodiacSign);
  const signName = zodiacSign
    ? zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8 space-y-4"
    >
      <div
        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          boxShadow: `0 0 30px ${colors.glow}`,
        }}
      >
        <svg
          className="w-10 h-10 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-white">
          Hello{signName ? `, ${signName}` : ''}!
        </h2>
        <p className="text-white/60 mt-1">
          I'm {coachName}, your cosmic wellness guide
        </p>
      </div>

      {zodiacInsight && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white/70 max-w-md mx-auto px-4 leading-relaxed"
          style={{ color: colors.secondary }}
        >
          {zodiacInsight}
        </motion.p>
      )}

      <p className="text-sm text-white/50 max-w-sm mx-auto">
        Ask me anything about nutrition, fitness, stress management, sleep, or your daily wellness routine.
      </p>
    </motion.div>
  );
}
