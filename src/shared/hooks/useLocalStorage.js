import { useState } from 'react';
export default function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; } });
  const set = (val) => { const next = val instanceof Function ? val(v) : val; setV(next); localStorage.setItem(key, JSON.stringify(next)); };
  return [v, set, () => { setV(initial); localStorage.removeItem(key); }];
}
