/**
 * Classification: Confidential
 */
import { NUMBERMAP } from '@/constants/common'

export const HAZARD_IDENTIFICATION_USED_CONSTANTS = {
  FORM_KEYS: {
    DOCUMENTS_TO_CREATE: 'documents_to_create',
    DOCUMENTS_TO_DELETE: 'documents_to_delete',
    CREATE_META_DATA: 'create_meta_data',
    UPDATE_META_DATA: 'update_meta_data',
  }, 
  TITLE: 'Hazard Identification Used',
  TABLE_ID_FIELD: 'tool_mapper_id',
  DEFAULT_LABEL: 'Label',
  TABLE_COLUMNS: {
    SNO: {
      field: 'sno',
      headerName: 'S.No',
      flex: NUMBERMAP.TWO,
    },
    HAZARD_IDENTIFICATION: {
      field: 'hazard_identification_tool',
      headerName: 'Hazard Identification',
      flex: NUMBERMAP.THREE,
    },
    ACTIONS: {
      field: 'actions',
      headerName: 'Actions',
    },
  },
  MODAL: {
    TITLE: 'Hazard Identification',
    SUB_HEADER: 'Upload',
  },
  ACTION_LABELS: {
    UPLOAD: 'Upload supporting documents',
  },
}

// Context type for workflow integration
export const CONTEXT_TYPE = {
  HAZARD_IDENTIFICATION_USED: 'hazard_identification_used',
} as const

export const HAZARD_IDENTIFICATION_USED_API_ENDPOINTS = {
  HAZARD_IDENTIFCATION_USED_API_PATH:
    '/api/v1/risk/hazard-identification-used/',
}
