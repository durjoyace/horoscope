import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
    
    // Also handle cases where content loads after navigation
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
}