import { NUMBERMAP } from "@/constants/common";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
/**
      *Classification : Confidential
**/
export const INITIAL_DATA = {
     applicable_specification_id: NUMBERMAP.ZERO,
  specification_name: '',
  is_adequate: NUMBERMAP.ZERO,
  remarks: ''
}

export const ERROR_MESSAGES = {
  ADEQUATE: 'Please Select Yes or No',
  REMARKS_REQUIRED: 'Remarks are required when Adequate is selected as No',
}

export const radioOptions = [
      { label: 'Yes', value: NUMBERMAP.ONE },
      { label: 'No', value: NUMBERMAP.ZERO }
    ];


export const FORM_FIELDS = {
  TITLE: 'Design Input Adequacy Check List',
  PLACEHOLDER: 'Enter Input',
  ID_FIELD: 'applicable_specification_id',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  CLICK_HERE: 'Click Here',
}


export const HANDLE_CHANGE = {
    RADIO_CHANGE:'is_adequate',
    REMARKS_CHANGE: 'remarks'

}

export const GRID_SIZES = {
  FULL_WIDTH: { md: NUMBERMAP.TWELVE },
  HALF_WIDTH: { md: NUMBERMAP.SIX },
  THIRD_WIDTH: { md: NUMBERMAP.SIX },
  QUARTER_WIDTH: { md: NUMBERMAP.SIX },
  SIXTH_WIDTH: { md: NUMBERMAP.SIX },
} as const

export const getColumns = (
    renderRadioCell?: (params: GridRenderCellParams) => React.ReactNode,
    renderRemarksCell?: (params: GridRenderCellParams) => React.ReactNode,
    renderRequirementsCell?: (params: GridRenderCellParams) => React.ReactNode,
    renderSnoCell?: (params: GridRenderCellParams) => React.ReactNode,
    renderConflictsCell?: (params: GridRenderCellParams) => React.ReactNode
):GridColDef[] => [
    {
      field: 'applicable_specification_id',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderSnoCell
    },
    {
      field: 'specification_name',
      headerName: 'Requirements',
      flex: NUMBERMAP.TWO,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderRequirementsCell
    },
    {
      field: 'is_adequate',
      headerName: 'Adequate?',
      flex: NUMBERMAP.ONE_HALF,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderRadioCell
    },
    {
      field: 'conflicts',
      headerName: 'Conflicts With Any Other DIR?',
      flex: NUMBERMAP.ONE,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderConflictsCell
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: NUMBERMAP.TWO,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderRemarksCell,
    }
]

export const FIELD_LABEL_MAP = {
  is_adequate: 'Adequacy Status*',
  remarks: 'Remarks*'
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)

export const QUERY_KEY='adequacy'
const BASE_API_PATH = 'api/v1/dnd/'
const API_BASE_END = 'dia-checklist'
export const API_ENDPOINTS = {
    FETCH_ALL: (project_id: number) => `${BASE_API_PATH}${API_BASE_END}/${project_id}`,
    POST_ADEQUACY: (project_id: number) => `${BASE_API_PATH}${API_BASE_END}/${project_id}`
}