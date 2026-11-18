import { useEffect, useState } from 'react';

export const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (globalThis.window !== undefined && globalThis.matchMedia) {
      return globalThis.matchMedia(`(max-width: ${breakpoint}px)`).matches;
    }
    return false;
  });

  useEffect(() => {
    if (globalThis.window === undefined || !globalThis.matchMedia) return;

    const mediaQuery = globalThis.matchMedia(`(max-width: ${breakpoint}px)`);
    const updateMatches = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener?.('change', updateMatches);

    return () => {
      mediaQuery.removeEventListener?.('change', updateMatches);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
