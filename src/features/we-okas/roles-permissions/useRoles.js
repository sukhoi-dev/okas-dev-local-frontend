import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roleService from './roleService';

const QK = 'roles';

export const useRoles = (params) =>
  useQuery({ queryKey: [QK, params], queryFn: () => roleService.list(params) });

export const useRole = (id) =>
  useQuery({ queryKey: [QK, id], queryFn: () => roleService.detail(id), enabled: !!id });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => roleService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => roleService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => roleService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  });
};
