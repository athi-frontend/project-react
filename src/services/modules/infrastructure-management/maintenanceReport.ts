import { API_ENDPOINTS } from "@/constants/modules/infrastructure-management/maintenanceReport"
import { apiClient } from "@/shared/apiClient"
import type { 
  MaintenanceReportDetailApiResponse,
  EquipmentItemsApiResponse,
  EquipmentCalibrationApiResponse
} from "@/types/modules/infrastructure-management/maintenanceReport"
/**
 * Classification : Confidential
 **/

export const getMaintenanceReportList = async (status?: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_MAINTENANCE_REPORT_LIST, {
    params: {...(status?{status:status}:{}) }
  })
  return response.data
}

export const getMaintenanceReportById = async (maintenance_report_id: number): Promise<MaintenanceReportDetailApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_MAINTENANCE_REPORT_BY_ID(maintenance_report_id))
  return response.data
}

export const getMaintenanceReportByInfrastructureId = async (infrastructure_id: number): Promise<MaintenanceReportDetailApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_MAINTENANCE_REPORT_BY_INFRASTRUCTURE_ID(infrastructure_id))
  return response.data
}

export const saveMaintenanceReport = async (formData: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.SAVE_MAINTENANCE_REPORT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const deleteMaintenanceReport = async (maintenance_report_id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.DELETE_MAINTENANCE_REPORT(maintenance_report_id))
}

export const getEquipmentItems = async (equipment_id?: number, status: number = 1): Promise<EquipmentItemsApiResponse> => {
  const params: any = { status }
  if (equipment_id) {
    params.equipment_id = equipment_id
  }
  const response = await apiClient.get(API_ENDPOINTS.FETCH_EQUIPMENT_ITEMS, { params })
  return response.data
}

export const getEquipmentCalibration = async (equipment_item_id: number, status: number = 1): Promise<EquipmentCalibrationApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_EQUIPMENT_CALIBRATION, {
    params: { status, equipment_item_id }
  })
  return response.data
}

