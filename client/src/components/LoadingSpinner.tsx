import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  fullPage?: boolean;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  fullPage = false,
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const spinner = (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Loader2 className={cn(
            'animate-spin text-primary', 
            sizeClasses[size]
          )} />
          <div className={cn(
            'absolute inset-0 animate-pulse rounded-full opacity-30 bg-primary/20',
            sizeClasses[size]
          )} />
        </div>
        {text && (
          <p className={cn(
            'text-muted-foreground text-center max-w-[200px]',
            size === 'xs' && 'text-xs',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base',
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300">
        <div className="p-6 rounded-lg bg-background/30 shadow-lg backdrop-blur-md">
          {spinner}
        </div>
      </div>
    );
  }
  
  return spinner;
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  text,
  size = 'md'
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px] rounded-md z-10 animate-in fade-in duration-200">
          <div className="flex flex-col items-center p-4 rounded-lg bg-background/50 shadow-lg">
            <LoadingSpinner size={size} text={text} />
          </div>
        </div>
      )}
    </div>
  );
}