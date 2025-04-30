import { useEffect } from 'react';
//import { useFrameworkReady } from '@/hooks/useFrameworkReady';


declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    window.frameworkReady?.();
  });
}
