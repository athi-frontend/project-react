import { NUMBERMAP } from "@/constants/common"

/**
 Classification : Confidential
**/
export const QUALITY_LIST_KEY = 'qualityList'
export const QUALITYINSTILATION = 'qualitypost'

export const HEADER ={
    SNO:'S.No',
    STAGE:'Stage',
    ITEM:'Item for test',
    ACTION:'Action'
}
export const FIELD_VALUE ={
    SNO:'sno',
    STAGE:'parameters_for_inspection',
    STAGE_INFO:'stage_info',
    ITEM:'item_for_test',
    ACTION:'action'
}
export const STAGE_ORDER_ID = 'stage_order_id'
export const TITLE= 'Design Quality Report'

export const LABEL ={
 ITEM: "Item for test"
}
export const PLACEHOLDER ={
 ITEM: 'Select Item for test'
}
export const STAGE_VALUE = 'item_type'
export const STAGE_ID = 'stage_item_id'
export const TEST_ID = 'item_for_test'
export const OBJECT ='object'

export const TEST = 'test'


export const API_ENDPOINTS = {
    QUALITY_FETCH: (projectId: number) => `api/v1/dnd/design-quality-report/${projectId}/all`,
    QUALITY_FETCH_BY_ORDER: (orderId: number) => `api/v1/dnd/design-quality-report/${orderId}`,
    TEST: 'api/v1/dnd/design-stage-item/all?status=1',
    POST_QUALITY: 'api/v1/dnd/installation-procedures/',
    GET_QUALITY: (id: number) => `api/v1/dnd/design-quality-report/${id}`
}
export const QUALITY_REPORT = 'quality'

// Table column definitions
export const ITEM_FOR_TEST_COLUMNS = [
  { field: 'sno', headerName: 'S.No.', flex: NUMBERMAP.HALF },
  { field: 'item_for_test', headerName: 'Items For Test', flex: NUMBERMAP.TWO },
  { field: 'sl_no_batch_no', headerName: 'SL.No / Batch No.', flex: NUMBERMAP.TWO },
]

export const EXECUTION_DIR_COLUMNS = [
  { field: 'sno', headerName: 'S.No.', flex: NUMBERMAP.HALF },
  { field: 'dir_id', headerName: 'DIR #', flex: NUMBERMAP.ONE },
  { field: 'dir_description', headerName: 'DIR Description', flex: NUMBERMAP.TWO },
]

export const VERIFICATION_DIR_COLUMNS = [
  { field: 'sno', headerName: 'S.No.', flex: NUMBERMAP.HALF },
  { field: 'dir_id', headerName: 'DIR#', flex: NUMBERMAP.TWO },
  { field: 'acceptance_criteria', headerName: 'Acceptance Criteria', flex: NUMBERMAP.TWO },
  { field: 'verification_status', headerName: 'Verification Status', flex: NUMBERMAP.ONE },
]

export const FORM_TITLE = 'Design Quality Report'

// Form Labels
export const LABELS = {
  STAGE: 'Stage',
  ITEM_FOR_TEST: 'Item for Test',
  EXECUTION_DIRS: "Execution DIR's",
  TEST_METHODS_ACCEPTANCE_CRITERIA: 'Test Methods and Acceptance Criteria',
  VERIFICATION_DIR: 'Verification DIR',
}

// Field Names
export const FIELD_NAMES = {
  ID: 'id',
  DIR_DESCRIPTION: 'dir_description',
  ACCEPTANCE_CRITERIA: 'acceptance_criteria',
}

// Default Values
export const DEFAULT_VALUES = {
  EMPTY: '-',
}
