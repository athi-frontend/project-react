/**
 * Classification : Confidential
 * Column definitions for Maintenance Plan DataGrid tables
 **/

import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { NUMBERMAP, STATUS_VALUE } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { ActionButton } from "@/components/ui";
import { stripHtml } from "@/lib/utils/common";
import {
  MAINTENANCE_PLAN_FORM_FIELDS as FORM_FIELDS,
  MAINTENANCE_PLAN_FORM_HEADERS as FORM_HEADERS,
  MAINTENANCE_PLAN_ENTITY_TYPES as ENTITY_TYPES,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";
import {
  ToolData,
  EquipmentData,
  MaintenancePlanData,
} from "@/types/modules/infrastructure-management/maintenancePlan";

type EntityType = "tool" | "equipment" | "maintenancePlan";

const getStatusValue = (status: string) => {
  return STATUS_VALUE[status as keyof typeof STATUS_VALUE] ?? NUMBERMAP.ZERO;
};

type HandleEditFn = (
  row: ToolData | EquipmentData | MaintenancePlanData,
  type: EntityType
) => void;
type HandleDeleteFn = (id: string, type: EntityType) => void;

/**
 * Get common STATUS column definition
 */
const getStatusColumn = (): GridColDef => ({
  field: FORM_FIELDS.STATUS,
  headerName: FORM_HEADERS.STATUS,
  flex: NUMBERMAP.ONE,
  renderCell: (params) => (
    <StatusTypography value={getStatusValue(params.value as string)} />
  ),
});

/**
 * Get common ACTIONS column definition
 */
const getActionsColumn = (
  onEdit: HandleEditFn,
  onDelete: HandleDeleteFn,
  entityType: EntityType
): GridColDef => ({
  field: FORM_FIELDS.ACTIONS,
  headerName: FORM_HEADERS.ACTIONS,
  flex: NUMBERMAP.ONE,
  renderCell: (params) => (
    <ActionButton
      onEdit={() => onEdit(params.row, entityType)}
      onDelete={() => onDelete(params.id.toString(), entityType)}
      deleteDisabled={!getStatusValue(params.row.status as string)}
    />
  ),
});

/**
 * Get tools columns configuration
 */
export const getToolsColumns = (
  onEdit: HandleEditFn,
  onDelete: HandleDeleteFn
): GridColDef[] => [
  { field: FORM_FIELDS.SERIAL_NO, headerName: FORM_HEADERS.SERIAL_NO, flex: NUMBERMAP.ONE },
  { field: FORM_FIELDS.TOOL_TYPE, headerName: FORM_HEADERS.TOOL_TYPE, flex: NUMBERMAP.TWO },
  getStatusColumn(),
  getActionsColumn(onEdit, onDelete, ENTITY_TYPES.TOOL),
];

/**
 * Get equipment columns configuration
 */
export const getEquipmentColumns = (
  onEdit: HandleEditFn,
  onDelete: HandleDeleteFn
): GridColDef[] => [
  { field: FORM_FIELDS.SERIAL_NO, headerName: FORM_HEADERS.SERIAL_NO, flex: NUMBERMAP.ONE },
  {
    field: FORM_FIELDS.EQUIPMENT_TYPE,
    headerName: FORM_HEADERS.EQUIPMENT_TYPE,
    flex: NUMBERMAP.TWO,
  },
  getStatusColumn(),
  getActionsColumn(onEdit, onDelete, ENTITY_TYPES.EQUIPMENT),
];

/**
 * Get maintenance plan columns configuration
 */
export const getMaintenancePlanColumns = (
  onEdit: HandleEditFn,
  onDelete: HandleDeleteFn
): GridColDef[] => [
  { field: FORM_FIELDS.SERIAL_NO, headerName: FORM_HEADERS.SERIAL_NO, flex: NUMBERMAP.ONE },
  {
    field: FORM_FIELDS.MAINTENANCE_DESCRIPTION,
    headerName: FORM_HEADERS.MAINTENANCE_DESCRIPTION,
    flex: NUMBERMAP.THREE, 
    tooltip: true,
    renderCell: (params) => (
      stripHtml(params?.value ?? '' as string)
    ),
  },
  { field: FORM_FIELDS.TO_BE_DONE_BY, headerName: FORM_HEADERS.TO_BE_DONE_BY, flex: NUMBERMAP.TWO },
  { field: FORM_FIELDS.FREQUENCY, headerName: FORM_HEADERS.FREQUENCY, flex: NUMBERMAP.TWO },
  getStatusColumn(),
  getActionsColumn(onEdit, onDelete, ENTITY_TYPES.MAINTENANCE_PLAN),
];