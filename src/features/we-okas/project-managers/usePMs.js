import { useQuery } from '@tanstack/react-query';
import pmService from './pmService';
export const usePMs = (p) => useQuery({ queryKey: ['pms', p], queryFn: () => pmService.list(p) });
