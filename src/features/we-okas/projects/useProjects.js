import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectService from './projectService';
export const useProjects   = (p) => useQuery({ queryKey: ['projects', p], queryFn: () => projectService.list(p) });
export const useProject    = (id) => useQuery({ queryKey: ['project', id], queryFn: () => projectService.detail(id), enabled: !!id });
export const useCreateProject = () => { const qc = useQueryClient(); return useMutation({ mutationFn: projectService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }) }); };
export const useDeleteProject = () => { const qc = useQueryClient(); return useMutation({ mutationFn: projectService.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }) }); };
