import React from 'react';
import { useCosmicLoader } from '@/hooks/useCosmicLoader';
import { CosmicLoader } from '@/components/ui/CosmicLoader';

export function CosmicLoaderWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, hideLoader, loadingMessage } = useCosmicLoader();

  return (
    <>
      {children}
      {isLoading && (
        <CosmicLoader 
          duration={3000}
          onComplete={hideLoader}
          message={loadingMessage}
        />
      )}
    </>
  );
}