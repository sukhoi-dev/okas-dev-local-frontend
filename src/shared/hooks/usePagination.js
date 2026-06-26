import { useState } from 'react';
export default function usePagination(initial = 10) {
  const [page, setPage]     = useState(1);
  const [pageSize, setSize] = useState(initial);
  return { page, pageSize, setPage, setPageSize: (s) => { setSize(s); setPage(1); }, reset: () => setPage(1) };
}
