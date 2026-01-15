/**
 * Daily Check-In Component
 * Full mood entry form with energy, emotions, activities
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { MoodPicker, EnergyPicker, ChipSelect } from './MoodPicker';
import { LunarPhaseWidget } from './LunarPhaseWidget';
import { MoodLevel, EnergyLevel, LunarData, getMoodConfig } from './types';
import { X, Save, Moon, Zap, Heart, Activity, Pencil } from 'lucide-react';

interface DailyCheckInProps {
  onClose: () => void;
  existingEntry?: {
    moodScore: number;
    energyLevel: number | null;
    emotions: string[];
    activities: string[];
    notes: string | null;
  } | null;
}

interface MoodOptions {
  emotions: string[];
  activities: string[];
}

export function DailyCheckIn({ onClose, existingEntry }: DailyCheckInProps) {
  const queryClient = useQueryClient();

  const [mood, setMood] = useState<MoodLevel>((existingEntry?.moodScore as MoodLevel) || 3);
  const [energy, setEnergy] = useState<EnergyLevel | undefined>(
    (existingEntry?.energyLevel as EnergyLevel) || undefined
  );
  const [emotions, setEmotions] = useState<string[]>(existingEntry?.emotions || []);
  const [activities, setActivities] = useState<string[]>(existingEntry?.activities || []);
  const [notes, setNotes] = useState(existingEntry?.notes || '');
  const [step, setStep] = useState(0);

  // Fetch mood options
  const { data: options } = useQuery<MoodOptions>({
    queryKey: ['mood-options'],
    queryFn: async () => {
      const res = await fetch('/api/v2/tracking/mood/options');
      const data = await res.json();
      return data.data;
    },
  });

  // Fetch lunar data
  const { data: lunarData } = useQuery<LunarData>({
    queryKey: ['lunar-today'],
    queryFn: async () => {
      const res = await fetch('/api/v2/tracking/mood/today');
      const data = await res.json();
      return data.data.lunarData;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/v2/tracking/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          moodScore: mood,
          energyLevel: energy,
          emotions,
          activities,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to save mood entry');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['mood-entries'] });
      onClose();
    },
  });

  const steps = [
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'emotions', label: 'Feelings', icon: Moon },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'notes', label: 'Notes', icon: Pencil },
  ];

  const moodConfig = getMoodConfig(mood);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-gray-900 rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Daily Check-In</h2>
            <p className="text-sm text-white/50">How are you feeling today?</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="px-4 pt-4 flex justify-center gap-2">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                step === i
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              <s.icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="mood"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <MoodPicker value={mood} onChange={setMood} />

                {/* Selected mood preview */}
                <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5">
                  <span className="text-4xl">{moodConfig.emoji}</span>
                  <span className="text-lg text-white">{moodConfig.label}</span>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="energy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <EnergyPicker value={energy} onChange={setEnergy} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="emotions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ChipSelect
                  label="What emotions are you experiencing?"
                  options={options?.emotions || []}
                  selected={emotions}
                  onChange={setEmotions}
                  color="#8b5cf6"
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="activities"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ChipSelect
                  label="What have you been doing?"
                  options={options?.activities || []}
                  selected={activities}
                  onChange={setActivities}
                  color="#22c55e"
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">
                    Any thoughts to capture?
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write about your day, gratitude, or anything on your mind..."
                    className="w-full h-32 p-3 rounded-xl bg-white/5 border border-white/10
                             text-white placeholder:text-white/30 resize-none
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    maxLength={500}
                  />
                  <p className="text-xs text-white/40 text-right">{notes.length}/500</p>
                </div>

                {/* Lunar phase context */}
                {lunarData && <LunarPhaseWidget lunar={lunarData} compact />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg text-white/60 hover:text-white
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 rounded-lg bg-purple-600 text-white
                       hover:bg-purple-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <motion.button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="px-6 py-2 rounded-lg bg-green-600 text-white
                       hover:bg-green-700 transition-colors flex items-center gap-2
                       disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? 'Saving...' : 'Save Check-In'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
