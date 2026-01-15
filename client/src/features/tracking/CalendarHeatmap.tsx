/**
 * Calendar Heatmap Component
 * Visualizes mood/activity over time
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMoodConfig } from './types';

interface HeatmapData {
  date: string;
  value: number; // 1-5 for mood, or 0-1 for completion
  label?: string;
}

interface CalendarHeatmapProps {
  data: HeatmapData[];
  title?: string;
  type?: 'mood' | 'completion';
  weeks?: number;
}

export function CalendarHeatmap({
  data,
  title = 'Activity',
  type = 'mood',
  weeks = 12,
}: CalendarHeatmapProps) {
  const calendar = useMemo(() => {
    const today = new Date();
    const days: { date: string; value: number | null; dayOfWeek: number }[] = [];

    // Generate last N weeks of dates
    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = data.find((d) => d.date === dateStr);
      days.push({
        date: dateStr,
        value: entry?.value ?? null,
        dayOfWeek: date.getDay(),
      });
    }

    // Group by weeks
    const weekGroups: typeof days[] = [];
    let currentWeek: typeof days = [];

    // Pad first week with empty days
    const firstDayOfWeek = days[0]?.dayOfWeek || 0;
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: '', value: null, dayOfWeek: i });
    }

    days.forEach((day) => {
      if (day.dayOfWeek === 0 && currentWeek.length > 0) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      weekGroups.push(currentWeek);
    }

    return weekGroups;
  }, [data, weeks]);

  const getColor = (value: number | null) => {
    if (value === null) return 'bg-white/5';

    if (type === 'mood') {
      const config = getMoodConfig(value);
      return '';
    }

    // Completion type (0-1)
    if (value === 0) return 'bg-white/5';
    if (value < 0.5) return 'bg-green-500/30';
    if (value < 1) return 'bg-green-500/60';
    return 'bg-green-500';
  };

  const getMoodColor = (value: number | null) => {
    if (value === null) return undefined;
    const config = getMoodConfig(value);
    return config.color;
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-3">
      {title && <h3 className="text-sm font-medium text-white/70">{title}</h3>}

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-2 text-[10px] text-white/40">
          {dayLabels.map((day, i) => (
            <div key={day} className="h-3 flex items-center" style={{ height: 12 }}>
              {i % 2 === 1 ? day : ''}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {calendar.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.002 }}
                  className={`w-3 h-3 rounded-sm ${
                    !day.date ? 'opacity-0' : getColor(day.value)
                  }`}
                  style={
                    type === 'mood' && day.value !== null
                      ? { backgroundColor: getMoodColor(day.value) }
                      : undefined
                  }
                  title={day.date ? `${day.date}: ${day.value ?? 'No data'}` : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-white/40">
        <span>Less</span>
        <div className="flex gap-1">
          {type === 'mood' ? (
            [1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getMoodConfig(level).color }}
              />
            ))
          ) : (
            <>
              <div className="w-3 h-3 rounded-sm bg-white/5" />
              <div className="w-3 h-3 rounded-sm bg-green-500/30" />
              <div className="w-3 h-3 rounded-sm bg-green-500/60" />
              <div className="w-3 h-3 rounded-sm bg-green-500" />
            </>
          )}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

interface WeeklyStatsProps {
  data: { day: string; value: number }[];
  label?: string;
}

export function WeeklyStats({ data, label = 'This Week' }: WeeklyStatsProps) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      {label && <h4 className="text-xs font-medium text-white/50">{label}</h4>}
      <div className="flex items-end justify-between gap-1 h-16">
        {days.map((day, i) => {
          const entry = data[i];
          const height = entry ? (entry.value / maxValue) * 100 : 0;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, type: 'spring' }}
                className="w-full rounded-t-sm bg-gradient-to-t from-purple-600 to-purple-400"
                style={{ minHeight: entry?.value ? 4 : 0 }}
              />
              <span className="text-[10px] text-white/40">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
