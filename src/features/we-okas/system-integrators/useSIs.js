import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import siService from './siService';

export const useSIs = (params) =>
  useQuery({
    queryKey: ['sis', params],
    queryFn:  () => siService.list(params),
    select:   (data) => data.body ?? [],
  });

export const useCreateSI = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => siService.create(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['sis'] }),
  });
};

export const useUpdateSI = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => siService.update(id, data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['sis'] }),
  });
};

export const useDeleteSI = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => siService.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['sis'] }),
  });
};
