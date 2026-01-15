/**
 * Update Prompt Component
 * Prompts users to update to the latest version
 */

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { CosmicButton } from '@/components/cosmic';
import { cn } from '@/lib/utils';

interface UpdatePromptProps {
  variant?: 'banner' | 'toast';
  className?: string;
}

export function UpdatePrompt({
  variant = 'toast',
  className,
}: UpdatePromptProps) {
  const { needsUpdate, isUpdating, updateApp, dismissUpdate } = usePWA();

  if (variant === 'banner') {
    return (
      <AnimatePresence>
        {needsUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={cn(
              'fixed top-0 left-0 right-0 z-50',
              'bg-gradient-to-r from-cyan-600/90 to-purple-600/90 backdrop-blur-lg',
              'px-4 py-3 shadow-lg',
              className
            )}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    New version available!
                  </p>
                  <p className="text-white/80 text-sm">
                    Refresh to get the latest features and improvements.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={dismissUpdate}
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  <X className="w-5 h-5" />
                </button>
                <CosmicButton
                  onClick={updateApp}
                  isLoading={isUpdating}
                  variant="secondary"
                  size="sm"
                  leftIcon={<RefreshCw className={cn('w-4 h-4', isUpdating && 'animate-spin')} />}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  {isUpdating ? 'Updating...' : 'Update Now'}
                </CosmicButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Toast variant
  return (
    <AnimatePresence>
      {needsUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={cn(
            'fixed bottom-20 left-1/2 -translate-x-1/2 z-50',
            'bg-cosmic-surface backdrop-blur-lg rounded-2xl p-4 shadow-2xl',
            'border border-cosmic-border',
            'flex items-center gap-4',
            className
          )}
        >
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>

          <div className="flex-1">
            <p className="text-cosmic-text-primary font-medium">
              Update Available
            </p>
            <p className="text-cosmic-text-secondary text-sm">
              New features and improvements ready!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={dismissUpdate}
              className="text-cosmic-text-tertiary hover:text-cosmic-text-primary transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>
            <CosmicButton
              onClick={updateApp}
              isLoading={isUpdating}
              size="sm"
              leftIcon={<RefreshCw className={cn('w-4 h-4', isUpdating && 'animate-spin')} />}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </CosmicButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UpdatePrompt;
