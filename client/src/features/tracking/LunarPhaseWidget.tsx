/**
 * Lunar Phase Widget
 * Displays current moon phase with visual
 */

import { motion } from 'framer-motion';
import { LunarData, LUNAR_EMOJIS } from './types';

interface LunarPhaseWidgetProps {
  lunar: LunarData;
  compact?: boolean;
}

export function LunarPhaseWidget({ lunar, compact = false }: LunarPhaseWidgetProps) {
  const emoji = LUNAR_EMOJIS[lunar.phase] || lunar.emoji;

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
        <span className="text-lg">{emoji}</span>
        <span className="text-sm text-white/70">{lunar.phaseName}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20
                 border border-indigo-500/30"
    >
      <div className="flex items-center gap-4">
        {/* Moon visualization */}
        <div className="relative w-16 h-16">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-400"
            style={{
              boxShadow: `0 0 ${lunar.illumination * 30}px rgba(255, 255, 255, ${lunar.illumination * 0.3})`,
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-4xl">
            {emoji}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{lunar.phaseName}</h3>
          <p className="text-sm text-white/60">
            {Math.round(lunar.illumination * 100)}% illuminated
          </p>
          <div className="flex gap-4 mt-2 text-xs text-white/50">
            {lunar.daysUntilNew > 0 && lunar.daysUntilNew <= 14 && (
              <span>{lunar.daysUntilNew} days to new moon</span>
            )}
            {lunar.daysUntilFull > 0 && lunar.daysUntilFull <= 14 && (
              <span>{lunar.daysUntilFull} days to full moon</span>
            )}
          </div>
        </div>
      </div>

      {/* Lunar insight */}
      <div className="mt-3 p-3 rounded-lg bg-white/5">
        <p className="text-sm text-white/70">
          {getLunarInsight(lunar.phase)}
        </p>
      </div>
    </motion.div>
  );
}

function getLunarInsight(phase: string): string {
  const insights: Record<string, string> = {
    new_moon: 'A time for new beginnings and setting intentions. Perfect for starting new habits.',
    waxing_crescent: 'Energy is building. Focus on taking initial steps toward your goals.',
    first_quarter: 'Time for action and decision-making. Push through challenges.',
    waxing_gibbous: 'Refine and adjust your plans. Stay focused on your intentions.',
    full_moon: 'Peak energy and illumination. Celebrate progress and release what no longer serves you.',
    waning_gibbous: 'Time for gratitude and sharing wisdom. Reflect on lessons learned.',
    last_quarter: 'Release and let go. Clear space for new cycles.',
    waning_crescent: 'Rest and restore. Prepare for the next new moon cycle.',
  };
  return insights[phase] || 'Connect with the lunar cycle for enhanced well-being.';
}
