import { useQuery } from '@tanstack/react-query';
import projectService from './projectService';

export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: projectService.getProjects });
