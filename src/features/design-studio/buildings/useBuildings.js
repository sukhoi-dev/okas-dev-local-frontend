import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import buildingService from './buildingService';
export const useBuildings    = (p) => useQuery({ queryKey: ['buildings', p], queryFn: () => buildingService.list(p) });
export const useBuilding     = (id) => useQuery({ queryKey: ['building', id], queryFn: () => buildingService.detail(id), enabled: !!id });
export const useCreateBuilding = () => { const qc = useQueryClient(); return useMutation({ mutationFn: buildingService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['buildings'] }) }); };
