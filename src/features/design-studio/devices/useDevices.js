import { useQuery } from '@tanstack/react-query';
import deviceService from './deviceService';
export const useDevices = (b, f, r, p) => useQuery({ queryKey: ['devices', b, f, r, p], queryFn: () => deviceService.list(b, f, r, p), enabled: !!b && !!f && !!r });
export const useDevice  = (b, f, r, d)  => useQuery({ queryKey: ['device', d], queryFn: () => deviceService.detail(b, f, r, d), enabled: !!d });
