/**
 * Classification : Confidential
 * Helper functions for Maintenance Plan module
 **/

import { NUMBERMAP } from "@/constants/common";
import {
  ToolApiResponse,
  EquipmentApiResponse,
  FrequencyApiResponse,
  ServiceTypeApiResponse,
} from "@/types/modules/infrastructure-management/infrastructureOnboardingTabs";

/**
 * Helper function to find tool ID by tool name
 */
export const getToolIdByName = (
  toolName: string,
  toolOptions?: { data?: ToolApiResponse[] }
): number | null => {
  const tool = toolOptions?.data?.find((t: ToolApiResponse) => t.tool_name === toolName);
  return tool?.tool_id ?? null;
};

/**
 * Helper function to find tool name by tool ID
 */
export const getToolNameById = (
  toolId: string | number,
  toolOptions?: { data?: ToolApiResponse[] }
): string | null => {
  const tool = toolOptions?.data?.find((t: ToolApiResponse) => t.tool_id === Number(toolId));
  return tool?.tool_name ?? null;
};

/**
 * Helper function to find equipment ID by equipment name
 */
export const getEquipmentIdByName = (
  equipmentName: string,
  equipmentOptions?: { data?: EquipmentApiResponse[] }
): number | null => {
  const equipment = equipmentOptions?.data?.find(
    (e: EquipmentApiResponse) => e.equipment_name === equipmentName
  );
  return equipment?.equipment_id ?? null;
};

/**
 * Helper function to find equipment name by equipment ID
 */
export const getEquipmentNameById = (
  equipmentId: string | number,
  equipmentOptions?: { data?: EquipmentApiResponse[] }
): string | null => {
  const equipment = equipmentOptions?.data?.find(
    (e: EquipmentApiResponse) => e.equipment_id === Number(equipmentId)
  );
  return equipment?.equipment_name ?? null;
};

/**
 * Helper function to find frequency ID by frequency name
 */
export const getFrequencyIdByName = (
  frequencyName: string,
  frequencyData?: { data?: FrequencyApiResponse[] }
): number | null => {
  const frequency = frequencyData?.data?.find(
    (f: FrequencyApiResponse) => f.frequency_name === frequencyName
  );
  return frequency?.id ?? null;
};

/**
 * Helper function to find frequency name by frequency ID
 */
export const getFrequencyNameById = (
  frequencyId: string | number,
  frequencyData?: { data?: FrequencyApiResponse[] }
): string | null => {
  const frequency = frequencyData?.data?.find(
    (f: FrequencyApiResponse) => f.id === Number(frequencyId)
  );
  return frequency?.frequency_name ?? null;
};

/**
 * Helper function to map responsibility key to service type ID
 */
export const getServiceTypeIdByName = (
  responsibilityName: string,
  serviceTypesData?: { data?: ServiceTypeApiResponse[] }
): number | null => {
  if (serviceTypesData?.data) {
    const serviceType = serviceTypesData.data.find(
      (st: ServiceTypeApiResponse) => st.maintenance_service_type === responsibilityName
    );
    if (serviceType) return serviceType.id;
  }
  return null;
};

/**
 * Helper function to find service type name by service type ID
 */
export const getServiceTypeNameById = (
  serviceTypeId: string | number,
  serviceTypesData?: { data?: ServiceTypeApiResponse[] }
): string | null => {
  const serviceType = serviceTypesData?.data?.find(
    (st: ServiceTypeApiResponse) => st.id === Number(serviceTypeId)
  );
  return serviceType?.maintenance_service_type ?? null;
};

/**
 * Helper function to convert status_id to status string (for display)
 */
export const getStatusStringFromId = (
  statusId: number,
  statusData?: { data?: Array<{ status_id: number; status_name: string }> }
): string => {
  const status = statusData?.data?.find((s: any) => s.status_id === statusId);
  return status?.status_name ?? (statusId === NUMBERMAP.ONE ? "Active" : "Inactive");
};