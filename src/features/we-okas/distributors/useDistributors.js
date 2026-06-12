import { useQuery } from '@tanstack/react-query';
import distributorService from './distributorService';
export const useDistributors = (p) => useQuery({ queryKey: ['distributors', p], queryFn: () => distributorService.list(p) });
