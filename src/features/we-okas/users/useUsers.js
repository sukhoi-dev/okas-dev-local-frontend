import { useQuery } from '@tanstack/react-query';
import userService from './userService';
export const useUsers = (p) => useQuery({ queryKey: ['users', p], queryFn: () => userService.list(p) });
