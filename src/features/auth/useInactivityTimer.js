import { useEffect, useRef } from 'react';

export default function useInactivityTimer({ timeoutMs, onTimeout, enabled }) {
  const timerRef = useRef(null);
  const onTimeoutRef = useRef(onTimeout);

  // Keep the callback ref up-to-date without re-registering listeners
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (!enabled) return;

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onTimeoutRef.current(), timeoutMs);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    // Start the initial timer
    reset();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [enabled, timeoutMs]);
}
