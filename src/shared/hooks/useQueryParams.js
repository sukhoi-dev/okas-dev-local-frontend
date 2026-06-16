import { useSearchParams } from 'react-router-dom';

export default function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key) => searchParams.get(key);

  const set = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === null || value === undefined || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  };

  const setMany = (params) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(params).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '') next.delete(k);
        else next.set(k, v);
      });
      return next;
    });
  };

  return { get, set, setMany, searchParams };
}
