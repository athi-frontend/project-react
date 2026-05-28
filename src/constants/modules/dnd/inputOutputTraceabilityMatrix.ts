import { NUMBERMAP } from '@/constants/common'
import { GridColDef } from '@mui/x-data-grid'

/**
    Classification : Confidential
**/

export const PAGE_TITLE = {
  LIST_TITLE: 'Input Output Traceability Matrix',
  MODAL_TITLE: 'Output Documents',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  ID: 'execution_stage_verification_plan_id',
  POPUP_ID: 'design_transfer_documents_id'
}

// API Endpoints

const API_BASE_PATH = 'api/v1/dnd'
const API_BASE_END = 'input-output-traceability'
export const API_ENDPOINTS = {
  FETCH_ALL: (project_id: number) => `${API_BASE_PATH}/${API_BASE_END}/project/${project_id}`,
  FETC_BY_ID: (dir: number, project_id: number) => `${API_BASE_PATH}/${API_BASE_END}/dir/${dir}?project_id=${project_id}`,
  POST: `${API_BASE_PATH}/${API_BASE_END}`
}

// Query Keys
export const QUERY_KEY = {
  FETCH: 'traceability-matrix-fetch',
  POST: 'traceability-matrix-post'
}


// Table Columns
export const getColumns = (renderButtonCell: any, renderDownloadCell: any): GridColDef[] => [
  {
    field: 'sno',
    headerName: 'S.No',
    flex: NUMBERMAP.HALF,
  },
  {
    field: 'dir_ref',
    headerName: 'DIR#',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'design_stage',
    headerName: 'Verification Report#',
    flex: NUMBERMAP.ONE,
    renderCell:renderDownloadCell
  },
  {
    field: 'actions',
    headerName: 'Output Documents',
    flex: NUMBERMAP.HALF,
    renderCell: renderButtonCell
  }
];

// Popup Table Columns
export const getPopupColumns = (renderReviewedCheckbox: any, renderFileCategory: any): GridColDef[] => [
  {
    field: 'sno',
    headerName: 'S.No',
    flex: NUMBERMAP.HALF,
  },
  {
    field: 'document_name',
    headerName: 'File Category',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'file_category',
    headerName: 'Document Name',
    flex: NUMBERMAP.ONE,
     renderCell: renderFileCategory
  },
  {
    field: 'is_checked',
    headerName: 'Reviewed',
    flex: NUMBERMAP.HALF,
    renderCell: renderReviewedCheckbox
  }
]
