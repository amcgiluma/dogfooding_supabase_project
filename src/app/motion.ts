import { useEffect, useState } from 'react';

export interface MotionPreferences {
  reduced: boolean;
  hidden: boolean;
}

/** Shares live motion and tab visibility preferences across the app. */
export function useMotionPreferences(): MotionPreferences {
  const [preferences, setPreferences] = useState<MotionPreferences>(() => ({
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    hidden: document.visibilityState === 'hidden',
  }));

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setPreferences((current) => ({ ...current, reduced: media.matches }));
    const updateVisibility = () => setPreferences((current) => ({ ...current, hidden: document.visibilityState === 'hidden' }));
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return preferences;
}
