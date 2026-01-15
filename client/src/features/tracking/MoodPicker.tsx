/**
 * Mood Picker Component
 * Interactive mood and energy level selection
 */

import { motion } from 'framer-motion';
import { MOOD_LEVELS, ENERGY_LEVELS, MoodLevel, EnergyLevel } from './types';

interface MoodPickerProps {
  value: MoodLevel;
  onChange: (value: MoodLevel) => void;
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white/70">How are you feeling?</label>
      <div className="flex justify-between gap-2">
        {MOOD_LEVELS.map((mood) => (
          <motion.button
            key={mood.value}
            onClick={() => onChange(mood.value as MoodLevel)}
            className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
              value === mood.value
                ? 'bg-white/20 ring-2'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            style={{
              borderColor: value === mood.value ? mood.color : 'transparent',
              boxShadow: value === mood.value ? `0 0 0 2px ${mood.color}` : 'none',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs text-white/60">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

interface EnergyPickerProps {
  value: EnergyLevel | undefined;
  onChange: (value: EnergyLevel) => void;
}

export function EnergyPicker({ value, onChange }: EnergyPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white/70">Energy level</label>
      <div className="flex justify-between gap-2">
        {ENERGY_LEVELS.map((energy) => (
          <motion.button
            key={energy.value}
            onClick={() => onChange(energy.value as EnergyLevel)}
            className={`flex-1 p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              value === energy.value
                ? 'bg-white/20 ring-2'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            style={{
              borderColor: value === energy.value ? energy.color : 'transparent',
              boxShadow: value === energy.value ? `0 0 0 2px ${energy.color}` : 'none',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">{energy.emoji}</span>
            <span className="text-[10px] text-white/60">{energy.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

interface ChipSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  color?: string;
}

export function ChipSelect({ label, options, selected, onChange, color = '#8b5cf6' }: ChipSelectProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white/70">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <motion.button
              key={option}
              onClick={() => toggleOption(option)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                isSelected
                  ? 'text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
              style={{
                backgroundColor: isSelected ? color : undefined,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
