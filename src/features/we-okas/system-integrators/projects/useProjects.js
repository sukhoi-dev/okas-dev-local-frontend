import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectService from './projectService';

export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: projectService.getProjects });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => projectService.updateProject(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};
