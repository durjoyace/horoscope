/**
 * Offline Indicator Component
 * Shows when the app is offline
 */

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  position?: 'top' | 'bottom';
  className?: string;
}

export function OfflineIndicator({
  position = 'bottom',
  className,
}: OfflineIndicatorProps) {
  const { isOnline } = usePWA();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
          className={cn(
            'fixed left-0 right-0 z-50 flex items-center justify-center px-4 py-2',
            position === 'top' ? 'top-0' : 'bottom-0',
            'bg-amber-500/90 backdrop-blur-sm',
            className
          )}
        >
          <WifiOff className="w-4 h-4 mr-2 text-white" />
          <span className="text-sm font-medium text-white">
            You&apos;re offline. Some features may be limited.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mini indicator for navbar
export function OfflineBadge({ className }: { className?: string }) {
  const { isOnline } = usePWA();

  return (
    <motion.div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        isOnline
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'bg-amber-500/20 text-amber-400',
        className
      )}
      animate={{
        scale: isOnline ? 1 : [1, 1.05, 1],
      }}
      transition={{
        duration: 1,
        repeat: isOnline ? 0 : Infinity,
      }}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Offline</span>
        </>
      )}
    </motion.div>
  );
}

export default OfflineIndicator;
