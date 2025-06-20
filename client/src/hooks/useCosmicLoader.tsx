import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface CosmicLoaderContextType {
  isLoading: boolean;
  showLoader: (duration?: number) => Promise<void>;
  hideLoader: () => void;
  setLoadingMessage: (message: string) => void;
  loadingMessage: string;
}

const CosmicLoaderContext = createContext<CosmicLoaderContextType | null>(null);

export function CosmicLoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Aligning your cosmic energy...');

  const showLoader = (duration: number = 3000): Promise<void> => {
    return new Promise((resolve) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, duration);
    });
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  return (
    <CosmicLoaderContext.Provider value={{
      isLoading,
      showLoader,
      hideLoader,
      setLoadingMessage,
      loadingMessage
    }}>
      {children}
    </CosmicLoaderContext.Provider>
  );
}

export function useCosmicLoader() {
  const context = useContext(CosmicLoaderContext);
  if (!context) {
    throw new Error('useCosmicLoader must be used within a CosmicLoaderProvider');
  }
  return context;
}

// Hook for automatic loading states during async operations
export function useAsyncWithLoader() {
  const { showLoader, hideLoader, setLoadingMessage } = useCosmicLoader();

  const executeWithLoader = async <T,>(
    asyncFn: () => Promise<T>,
    message?: string,
    minDuration?: number
  ): Promise<T> => {
    if (message) setLoadingMessage(message);
    
    const startTime = Date.now();
    showLoader(minDuration);
    
    try {
      const result = await asyncFn();
      
      // Ensure minimum duration if specified
      if (minDuration) {
        const elapsed = Date.now() - startTime;
        if (elapsed < minDuration) {
          await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
        }
      }
      
      return result;
    } finally {
      hideLoader();
    }
  };

  return { executeWithLoader };
}