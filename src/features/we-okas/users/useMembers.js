import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import memberService from './memberService';

const QK = 'members';

export const useMembers = (params) =>
  useQuery({
    queryKey: [QK, params],
    queryFn: () => memberService.list(params),
  });

export const useCreateMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => memberService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  });
};

export const useUpdateMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => memberService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  });
};

export const usePatchMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => memberService.patch(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  });
};

export const useDeleteMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => memberService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  });
};
