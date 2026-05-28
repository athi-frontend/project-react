import { 
  FETCH_MAINTENANCE_REPORT_LIST_KEY,
  FETCH_MAINTENANCE_REPORT_BY_ID_KEY,
  FETCH_MAINTENANCE_REPORT_BY_INFRASTRUCTURE_ID_KEY,
  FETCH_EQUIPMENT_ITEMS_KEY,
  FETCH_EQUIPMENT_CALIBRATION_KEY,
  ERROR_MESSAGES,
} from "@/constants/modules/infrastructure-management/maintenanceReport"
import { 
  getMaintenanceReportList,
  getMaintenanceReportById,
  getMaintenanceReportByInfrastructureId,
  saveMaintenanceReport,
  deleteMaintenanceReport,
  getEquipmentItems,
  getEquipmentCalibration,
} from "@/services/modules/infrastructure-management/maintenanceReport"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { NUMBERMAP, STATUS } from '@/constants/common'
import { showActionAlert } from '@/components/ui'
/**
 * Classification : Confidential
 **/

export const useGetMaintenanceReportList = (status?: number) => {
  return useQuery({
    queryKey: [FETCH_MAINTENANCE_REPORT_LIST_KEY],
    queryFn: () => getMaintenanceReportList(status),
  })
}

export const useGetMaintenanceReportById = (maintenance_report_id?: number) => {
  return useQuery({
    queryKey: [FETCH_MAINTENANCE_REPORT_BY_ID_KEY, maintenance_report_id],
    queryFn: () => {
      if (!maintenance_report_id) {
        throw new Error(ERROR_MESSAGES.MAINTENANCE_REPORT_ID_REQUIRED)
      }
      return getMaintenanceReportById(maintenance_report_id)
    },
    enabled: !!maintenance_report_id && maintenance_report_id !== undefined,
    placeholderData: undefined,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  })
}

export const useGetMaintenanceReportByInfrastructureId = (infrastructure_id?: number) => {
  return useQuery({
    queryKey: [FETCH_MAINTENANCE_REPORT_BY_INFRASTRUCTURE_ID_KEY, infrastructure_id],
    queryFn: () => {
      if (!infrastructure_id) {
        throw new Error(ERROR_MESSAGES.INFRASTRUCTURE_ID_REQUIRED)
      }
      return getMaintenanceReportByInfrastructureId(infrastructure_id)
    },
    enabled: !!infrastructure_id && infrastructure_id !== undefined,
      placeholderData: undefined,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  })
}

export const useSaveMaintenanceReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => saveMaintenanceReport(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FETCH_MAINTENANCE_REPORT_LIST_KEY] })
      queryClient.invalidateQueries({ queryKey: [FETCH_MAINTENANCE_REPORT_BY_ID_KEY] })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useDeleteMaintenanceReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMaintenanceReport,
    onSuccess: (data, maintenance_report_id) => {
      queryClient.invalidateQueries({
        queryKey: [FETCH_MAINTENANCE_REPORT_LIST_KEY],
      })
      // Invalidate the specific item query to ensure edit page shows updated data
      queryClient.invalidateQueries({
        queryKey: [FETCH_MAINTENANCE_REPORT_BY_ID_KEY, maintenance_report_id],
      })
    },
  })
}

export const useGetEquipmentItems = (equipment_id?: number, status: number = 1) => {
  return useQuery({
    queryKey: [FETCH_EQUIPMENT_ITEMS_KEY, equipment_id, status],
    queryFn: () => getEquipmentItems(equipment_id, status),
    enabled: true, // Always enabled, equipment_id is optional
  })
}

export const useGetEquipmentCalibration = (equipment_item_id?: number, status: number = 1) => {
  return useQuery({
    queryKey: [FETCH_EQUIPMENT_CALIBRATION_KEY, equipment_item_id, status],
    queryFn: () => {
      if (!equipment_item_id) {
        throw new Error(ERROR_MESSAGES.EQUIPMENT_ITEM_ID_REQUIRED)
      }
      return getEquipmentCalibration(equipment_item_id, status)
    },
    enabled: !!equipment_item_id && equipment_item_id !== undefined,
  })
}

