import { useEffect, useRef } from 'react';

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes — matches reference app

export default function useInactivityLogout(onLogout, enabled = true) {
  const timer = useRef(null);

  const reset = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(onLogout, TIMEOUT_MS);
  };

  useEffect(() => {
    if (!enabled) return;
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [enabled]);
}
