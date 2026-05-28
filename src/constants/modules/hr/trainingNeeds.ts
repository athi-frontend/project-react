import { GridColDef } from "@mui/x-data-grid";
import { NUMBERMAP } from "@/constants/common";
import { TrainingNeedsForm } from "@/types/modules/hr/trainingNeeds";

export const TRAINING_LIST = {
    TITLE: 'Training Needs',
    ID_FIELD: 'training_needs_id',
    SAVE: 'Save',
    CANCEL: 'Cancel'
}
export const INITIAL_NEEDS: TrainingNeedsForm = {
  skill: "",
  source: "",
  employee: [],
  dateOfJoining: "",
  uploadedFile: []
};

export const FORM_LABEL = {
  SKILL_TITLE: 'Skill*',
  SOURCE: 'Source',
  EMPLOYEE: 'Employee*',
  TARGET_DATE: 'Target Date*'
}

export const FORM_PLACEHOLDER = {
  SKILL_TITLE: 'Select skill',
  SOURCE: 'Select Source',
  EMPLOYEE: 'Select Employee',
  TARGET_DATE: 'Please select date'
}

export const DATA_CHANGE = {
  SKILL:'skill',
  SOURCE: 'source',
  EMPLOYEE: 'employee',
  TARGET_DATE: 'dateOfJoining'
}

export const INITIAL_ERRORS = {
  skill: '',
  source: '',
  employee: '',
  dateOfJoining: '',
};

export const ERRORS = {
  SKILL_ERROR: 'Skill is Required',
 EMPLOYEE_ERROR: 'A Minimum of One Employee Selection is Needed',
  SOURCE_ERROR: 'Source is Required',
  DATE_ERROR: 'Target Date is Required'
}

export const DATA_GRID_DELETE_CLASS = ".data-grid-delete"
export const DATA_DELETE='data-grid-delete row-'
export const CONTAINER_ID='HR_TRAINING_NEEDS'

export const DATA_TABLE_NAME = {
  TRAINING_NEEDS: 'eqms_hr_employee_training_needs',
  MAPPER: 'eqms_hr_employee_training_needs_mapper',
  FILE_SUPPORTING: 'eqms_hr_employee_training_supporting_document',

}

export const DATA_FIELD_NAME= {
  SKILL: 'fk_eqms_hr_skill_master_id',
  SOURCE: 'fk_eqms_hr_employee_source_lk_id',
  EMPLOYEE: 'fk_eqms_organization_employee_id',
  TARGET_DATE: 'target_date',
  STATUS: 'status',
  FILE_SUPPORTING_ID: 'fk_eqms_file_id'
}

export const KEY_FIELD = {
  SKILL:'skill_id',
  SOURCE: 'source_id',
  EMPLOYEE: 'id',
}

export const VALUE_FIELD = {
  SKILL:'skill_name',
  SOURCE: 'source',
  EMPLOYEE: 'employee_name',
}

export const getColumns = (
    renderActionsCell: (params: any) => React.ReactNode,
    renderStatusCell: (params: any) => React.ReactNode,
    renderDateCell : (params)=> React.ReactNode
): GridColDef[] => [
     {
      field: 'sno',
    headerName: 'S.No',
    flex:NUMBERMAP.HALF,
    sortable: false,
    },
    {
      field: 'skill_name',
      headerName: 'Skill',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'target_date',
      headerName: 'Target Date',
      flex: NUMBERMAP.ONE,
      renderCell: renderDateCell
    },
    {
      field: 'creation_date',
      headerName: 'Created Date',
      flex: NUMBERMAP.ONE,
      renderCell: renderDateCell

    },
    {
      field: 'created_by',
      headerName: 'Created By',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: NUMBERMAP.HALF,
      renderCell: renderStatusCell
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: NUMBERMAP.HALF,
      sortable: false,
      renderCell: renderActionsCell
    }
]
export const QUERY_KEY = {
    TRAINING_NEEDS: 'training_needs',
    SKILLS: 'skills',
    SOURCE: 'source',
    EMPLOYEE: 'employee'
}
const API_BASE_PATH='api/v1/hrcs'
const API_BASE_END='training-needs'
const API_BASE_PATH_GENERATE_RECORDS='api/v1/dms'
const API_BASE_END_GENERATE_RECORDS='records/generate'
export const API_ENDPOINTS = {
    FETCH_ALL_NEEDS: `${API_BASE_PATH}/${API_BASE_END}/all`,
    FETCH_ALL_SKILLS: `${API_BASE_PATH}/skill/all`,
    FETCH_SOURCE: `${API_BASE_PATH}/source/all`,
    FETCH_EMPLOYEES: `${API_BASE_PATH}/employee/all?status=${NUMBERMAP.ONE}`,
    FETCH_NEEDS_BY_ID: (needsId: number) => `${API_BASE_PATH}/${API_BASE_END}/${needsId}`,
     GENERATE_RECORDS:`${API_BASE_PATH_GENERATE_RECORDS}/${API_BASE_END_GENERATE_RECORDS}/${NUMBERMAP.FOUR}`
}