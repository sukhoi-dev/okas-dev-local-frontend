import { useState, useEffect } from 'react';
export default function useDebounce(value, delay = 400) {
  const [dv, setDv] = useState(value);
  useEffect(() => { const id = setTimeout(() => setDv(value), delay); return () => clearTimeout(id); }, [value, delay]);
  return dv;
}
