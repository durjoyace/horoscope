/**
 * Cosmic Toast Notification System
 * Beautiful animated toast notifications with cosmic themes
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Star,
  Sparkles,
  Trophy,
  Zap,
  Heart,
  X
} from 'lucide-react';

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'xp' | 'streak' | 'level';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  icon?: ReactNode;
  data?: {
    xp?: number;
    level?: number;
    streak?: number;
    achievementIcon?: string;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  // Convenience methods
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  achievement: (title: string, message?: string, icon?: string) => void;
  xpGained: (amount: number, reason?: string) => void;
  levelUp: (level: number) => void;
  streakMilestone: (streak: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useCosmicToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useCosmicToast must be used within CosmicToastProvider');
  }
  return context;
}

export function CosmicToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id, duration: toast.duration || 5000 };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Convenience methods
  const success = (title: string, message?: string) =>
    addToast({ type: 'success', title, message });

  const error = (title: string, message?: string) =>
    addToast({ type: 'error', title, message });

  const warning = (title: string, message?: string) =>
    addToast({ type: 'warning', title, message });

  const info = (title: string, message?: string) =>
    addToast({ type: 'info', title, message });

  const achievement = (title: string, message?: string, icon?: string) =>
    addToast({ type: 'achievement', title, message, duration: 7000, data: { achievementIcon: icon } });

  const xpGained = (amount: number, reason?: string) =>
    addToast({ type: 'xp', title: `+${amount} XP`, message: reason, duration: 3000, data: { xp: amount } });

  const levelUp = (level: number) =>
    addToast({ type: 'level', title: 'Level Up!', message: `You reached level ${level}`, duration: 8000, data: { level } });

  const streakMilestone = (streak: number) =>
    addToast({ type: 'streak', title: `${streak} Day Streak!`, message: 'Keep up the cosmic momentum!', duration: 6000, data: { streak } });

  return (
    <ToastContext.Provider value={{
      toasts, addToast, removeToast,
      success, error, warning, info, achievement, xpGained, levelUp, streakMilestone
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Toast container component
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <CosmicToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Individual toast item
function CosmicToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(onRemove, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onRemove]);

  const config = getToastConfig(toast.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`
        pointer-events-auto relative overflow-hidden rounded-2xl
        backdrop-blur-xl border shadow-2xl
        ${config.bgClass} ${config.borderClass}
      `}
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 opacity-30 ${config.gradientClass}`}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Glow effect */}
      <div className={`absolute inset-0 ${config.glowClass} blur-xl opacity-50`} />

      {/* Content */}
      <div className="relative p-4 flex items-start gap-3">
        {/* Icon */}
        <motion.div
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${config.iconBgClass}`}
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
        >
          {toast.icon || config.icon}
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <motion.h4
            className={`font-semibold text-sm ${config.titleClass}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {toast.title}
          </motion.h4>
          {toast.message && (
            <motion.p
              className="text-sm text-white/70 mt-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {toast.message}
            </motion.p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/50" />
        </button>
      </div>

      {/* Progress bar */}
      {toast.duration && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${config.progressClass}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}

      {/* Sparkle effects for special toasts */}
      {['achievement', 'level', 'streak'].includes(toast.type) && (
        <SparkleEffect />
      )}
    </motion.div>
  );
}

// Sparkle particle effect
function SparkleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -20],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
}

// Toast configuration helper
function getToastConfig(type: ToastType) {
  const configs = {
    success: {
      bgClass: 'bg-emerald-950/90',
      borderClass: 'border-emerald-500/30',
      gradientClass: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20',
      glowClass: 'bg-emerald-500/20',
      iconBgClass: 'bg-emerald-500/20',
      titleClass: 'text-emerald-300',
      progressClass: 'bg-gradient-to-r from-emerald-400 to-teal-400',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    },
    error: {
      bgClass: 'bg-red-950/90',
      borderClass: 'border-red-500/30',
      gradientClass: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
      glowClass: 'bg-red-500/20',
      iconBgClass: 'bg-red-500/20',
      titleClass: 'text-red-300',
      progressClass: 'bg-gradient-to-r from-red-400 to-rose-400',
      icon: <XCircle className="w-5 h-5 text-red-400" />,
    },
    warning: {
      bgClass: 'bg-amber-950/90',
      borderClass: 'border-amber-500/30',
      gradientClass: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
      glowClass: 'bg-amber-500/20',
      iconBgClass: 'bg-amber-500/20',
      titleClass: 'text-amber-300',
      progressClass: 'bg-gradient-to-r from-amber-400 to-orange-400',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    },
    info: {
      bgClass: 'bg-blue-950/90',
      borderClass: 'border-blue-500/30',
      gradientClass: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
      glowClass: 'bg-blue-500/20',
      iconBgClass: 'bg-blue-500/20',
      titleClass: 'text-blue-300',
      progressClass: 'bg-gradient-to-r from-blue-400 to-cyan-400',
      icon: <Info className="w-5 h-5 text-blue-400" />,
    },
    achievement: {
      bgClass: 'bg-purple-950/90',
      borderClass: 'border-purple-500/30',
      gradientClass: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
      glowClass: 'bg-purple-500/30',
      iconBgClass: 'bg-gradient-to-br from-purple-500/30 to-pink-500/30',
      titleClass: 'text-purple-300',
      progressClass: 'bg-gradient-to-r from-purple-400 to-pink-400',
      icon: <Trophy className="w-5 h-5 text-purple-400" />,
    },
    xp: {
      bgClass: 'bg-violet-950/90',
      borderClass: 'border-violet-500/30',
      gradientClass: 'bg-gradient-to-r from-violet-500/20 to-indigo-500/20',
      glowClass: 'bg-violet-500/20',
      iconBgClass: 'bg-violet-500/20',
      titleClass: 'text-violet-300',
      progressClass: 'bg-gradient-to-r from-violet-400 to-indigo-400',
      icon: <Sparkles className="w-5 h-5 text-violet-400" />,
    },
    level: {
      bgClass: 'bg-gradient-to-br from-amber-950/90 to-yellow-950/90',
      borderClass: 'border-amber-400/40',
      gradientClass: 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30',
      glowClass: 'bg-amber-400/30',
      iconBgClass: 'bg-gradient-to-br from-amber-500/30 to-yellow-500/30',
      titleClass: 'text-amber-300',
      progressClass: 'bg-gradient-to-r from-amber-400 to-yellow-400',
      icon: <Star className="w-5 h-5 text-amber-400" />,
    },
    streak: {
      bgClass: 'bg-gradient-to-br from-orange-950/90 to-red-950/90',
      borderClass: 'border-orange-500/30',
      gradientClass: 'bg-gradient-to-r from-orange-500/20 to-red-500/20',
      glowClass: 'bg-orange-500/20',
      iconBgClass: 'bg-gradient-to-br from-orange-500/30 to-red-500/30',
      titleClass: 'text-orange-300',
      progressClass: 'bg-gradient-to-r from-orange-400 to-red-400',
      icon: <Zap className="w-5 h-5 text-orange-400" />,
    },
  };

  return configs[type] || configs.info;
}

export default CosmicToastProvider;
