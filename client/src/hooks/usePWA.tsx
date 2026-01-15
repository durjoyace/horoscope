/**
 * PWA Hook
 * Handles PWA installation, updates, and offline status
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface PWAState {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  needsUpdate: boolean;
  isUpdating: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isInstallable: false,
    isInstalled: false,
    needsUpdate: false,
    isUpdating: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState((prev) => ({ ...prev, isInstallable: true }));
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setState((prev) => ({ ...prev, isInstallable: false, isInstalled: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setState((prev) => ({ ...prev, isInstalled: true }));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register service worker manually (for development compatibility)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Check for updates periodically
      const checkForUpdates = async () => {
        if (swRegistrationRef.current) {
          try {
            await swRegistrationRef.current.update();
          } catch (error) {
            console.error('Error checking for SW updates:', error);
          }
        }
      };

      // Listen for SW updates
      const handleControllerChange = () => {
        setState((prev) => ({ ...prev, needsUpdate: true }));
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      // Check for updates every 60 seconds
      const interval = setInterval(checkForUpdates, 60000);

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        clearInterval(interval);
      };
    }
  }, []);

  // Install app
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setState((prev) => ({ ...prev, isInstallable: false, isInstalled: true }));
        return true;
      }
    } catch (error) {
      console.error('Install error:', error);
    }

    return false;
  }, [deferredPrompt]);

  // Update app
  const updateApp = useCallback(async () => {
    setState((prev) => ({ ...prev, isUpdating: true }));

    try {
      // Reload the page to get the new version
      window.location.reload();
    } catch (error) {
      console.error('Update error:', error);
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  }, []);

  // Dismiss update
  const dismissUpdate = useCallback(() => {
    setState((prev) => ({ ...prev, needsUpdate: false }));
  }, []);

  return {
    ...state,
    installApp,
    updateApp,
    dismissUpdate,
  };
}

export default usePWA;
