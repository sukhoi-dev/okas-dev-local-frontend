import { useQuery } from '@tanstack/react-query';
import floorService from './floorService';
export const useFloors = (b, p) => useQuery({ queryKey: ['floors', b, p], queryFn: () => floorService.list(b, p), enabled: !!b });
