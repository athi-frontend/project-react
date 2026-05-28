/**
 * Classification: Confidential
 * Electrical Drawing Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchElectricalDrawingList,
  fetchElectricalDrawingById,
  upsertElectricalDrawing,
  deleteElectricalDrawing,
  ElectricalDrawingPayload,
  ElectricalDrawingListResponse,
} from '@/services/modules/production/electricalDrawingService';
import { NUMBERMAP } from '@/constants/common';

export const useElectricalDrawingList = (
  assemblyPartItemDetailId: number,
  enabled: boolean = true
) => {
  return useQuery<ElectricalDrawingListResponse, Error>({
    queryKey: ['electricalDrawingList'],
    queryFn: () => fetchElectricalDrawingList(assemblyPartItemDetailId),
    enabled: enabled && !!assemblyPartItemDetailId,
  });
};

export const useElectricalDrawingById = (
  electricalDrawingId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['electricalDrawingById', electricalDrawingId],
    queryFn: () => fetchElectricalDrawingById(electricalDrawingId),
    enabled: enabled && !!electricalDrawingId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });
};

export const useUpsertElectricalDrawing = (assemblyPartItemDetailId?: number) => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, ElectricalDrawingPayload>({
    mutationFn: (payload) => upsertElectricalDrawing(payload),
    onSuccess: () => {
      if (assemblyPartItemDetailId) {
        queryClient.invalidateQueries({ queryKey: ['electricalDrawingList'] });
      }
    },
  });
};

export const useDeleteElectricalDrawing = (assemblyPartItemDetailId?: number) => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, number>({
    mutationFn: (electricalDrawingId) => deleteElectricalDrawing(electricalDrawingId),
    onSuccess: () => {
      if (assemblyPartItemDetailId) {
        queryClient.invalidateQueries({ queryKey: ['electricalDrawingList'] });
      }
    },
  });
};

