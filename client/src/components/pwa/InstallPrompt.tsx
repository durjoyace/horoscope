/**
 * Install Prompt Component
 * Prompts users to install the PWA
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { CosmicButton } from '@/components/cosmic';
import { cn } from '@/lib/utils';

interface InstallPromptProps {
  variant?: 'banner' | 'modal' | 'toast';
  delay?: number;
  className?: string;
}

export function InstallPrompt({
  variant = 'banner',
  delay = 30000, // 30 seconds delay before showing
  className,
}: InstallPromptProps) {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Don't show for 7 days after dismissal
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
        return;
      }
    }

    // Show after delay if installable
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled) {
        setIsVisible(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, delay]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isDismissed || isInstalled || !isInstallable) return null;

  if (variant === 'banner') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={cn(
              'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50',
              'bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-lg',
              'rounded-2xl p-4 shadow-2xl border border-white/10',
              className
            )}
          >
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">
                  Install AstralInsight
                </h3>
                <p className="text-white/80 text-sm mb-3">
                  Get the full cosmic experience with offline access and instant loading.
                </p>

                <CosmicButton
                  onClick={handleInstall}
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download className="w-4 h-4" />}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  Install App
                </CosmicButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (variant === 'modal') {
    return (
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={handleDismiss}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
                'w-[90%] max-w-md',
                'bg-cosmic-bg-primary rounded-2xl p-6 shadow-2xl border border-cosmic-border',
                className
              )}
            >
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 text-cosmic-text-tertiary hover:text-cosmic-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Smartphone className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-xl font-bold text-cosmic-text-primary mb-2">
                  Install AstralInsight
                </h2>
                <p className="text-cosmic-text-secondary mb-6">
                  Add to your home screen for the best experience with offline access,
                  push notifications, and faster loading.
                </p>

                <div className="flex gap-3">
                  <CosmicButton
                    variant="ghost"
                    onClick={handleDismiss}
                    fullWidth
                  >
                    Maybe Later
                  </CosmicButton>
                  <CosmicButton
                    variant="primary"
                    onClick={handleInstall}
                    leftIcon={<Download className="w-4 h-4" />}
                    fullWidth
                  >
                    Install
                  </CosmicButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Toast variant
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={cn(
            'fixed top-4 right-4 z-50',
            'bg-cosmic-surface backdrop-blur-lg rounded-xl p-3 shadow-lg border border-cosmic-border',
            'flex items-center gap-3',
            className
          )}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cosmic-text-primary truncate">
              Install AstralInsight
            </p>
            <p className="text-xs text-cosmic-text-tertiary">
              Quick access from home screen
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="text-cosmic-text-tertiary hover:text-cosmic-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <CosmicButton
              size="sm"
              onClick={handleInstall}
            >
              Install
            </CosmicButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InstallPrompt;
