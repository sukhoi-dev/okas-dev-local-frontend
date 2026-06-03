import { useQuery } from '@tanstack/react-query';
import siService from './siService';
export const useSIs = (p) => useQuery({ queryKey: ['sis', p], queryFn: () => siService.list(p) });
