import { useQuery } from '@tanstack/react-query';
import roomService from './roomService';
export const useRooms = (b, f, p) => useQuery({ queryKey: ['rooms', b, f, p], queryFn: () => roomService.list(b, f, p), enabled: !!b && !!f });
