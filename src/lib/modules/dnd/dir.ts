import { NUMBERMAP } from '@/constants/common'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'

/**
 Classification : Confidential
**/
export const DEFAULT_PAGINATION: GridPaginationModel = {
  page: 0,
  pageSize: NUMBERMAP.TEN,
}

export const DIR_COLUMNS: GridColDef[] = [
  { field: 'sno', headerName: 'S.No.', flex:0.5 },
  { field: 'dir_id', headerName: 'DIR ID', flex: 1 },
  { field: 'specification_parameter', headerName: 'DIR Name', flex: 1 },
  { field: 'verification_stage_name', headerName: 'DIR Category', flex:1 },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1 }
]

export const initialFormState = {
  dirName: '',
  dirId: '',
  dirCategory: '',
  functional_block_type_id: '',
  stage: '',
  owner: '',
  softwareUnit: '',
  moduleSubmodule: '',
  hardwareSoftwareOther: '',
  referenceToExistingDir: '',
  dirNumber: '',
  allocateExecutionStage: '',
  allocateVerificationStage: '',
  reasonForCreating: '',
  dirSpecification: '',
  dirDescription: '',
  verificationMethod: '',
  verificationPlan: '',
  comments: '',
  isDirConflict: 0,
  conflictingDirId: [],
  conflictRemarks: '',
  isDirUnambiguous: 0,
  unambiguousRemarks: '',
  isDirVerifiable: 0,
  verifiableRemarks: '',
  isDirComplete: 0,
  completeRemarks: '',
}

export const hardwareSoftwareOptions = [
  { label: 'Hardware', value: 'hardware' },
  { label: 'Software', value: 'software' },
  { label: 'Other', value: 'other' },
]

export const referenceOptions = [
  { label: 'Yes', value: '1' },
  { label: 'No', value: '0' },
]

export  const radioOptions = [
    { value: '1', label: 'Yes' },
    { value: '0', label: 'No' },
  ];

export const formButtons = [
  { label: 'Submit for Review', onClick: () => {} },
  { label: 'Submit for Approval', onClick: () => {} },
  { label: 'Approve', onClick: () => {} },
  { label: 'Redo', onClick: () => {} },
  { label: 'Cancel', onClick: () => {} },
  { label: 'Save', onClick: () => {} },
]
