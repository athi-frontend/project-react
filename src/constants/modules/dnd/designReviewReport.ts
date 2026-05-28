/**
 Classification : Confidential
**/

import { NUMBERMAP } from "@/constants/common"

export const FORM_TITLE = 'Design Review Report'

export const FORM_FIELDS_CONFIG = {
  DESIGN_STAGE: {
    label: 'Design Stage',
    placeholder: 'Select Design Stage',
    onChange: 'designStage',
    required: true,
  },
  PLACE: {
    label: 'Place',
    placeholder: 'Enter Place',
    onChange: 'place',
    required: true,
  },
  MEMBERS: {
    label: 'Members',
    placeholder: 'Select Members',
    onChange: 'members',
    idField: 'id',
    valueField: 'name',
    required: true,
  },
  TOPIC: {
    label: 'Topic*',
    placeholder: 'Enter Topic',
    onChange: 'topic',
    required: true,
  },
  MINUTES: {
    label: 'Minutes of Meeting*',
    onChange: 'minutes',
    required: true,
    placeholder: 'Enter Minutes of Meeting',
  },
  DOCUMENTS: {
    label: 'Upload*',
    onChange: 'documents',
    required: true,
  },
  FIELDS_TO_APPEND_CONFIG: {
    design_stage_id: (formData: any) => formData.designStage,
    place: (formData: any) => formData.place,
    members: (formData: any) => JSON.stringify(formData.members),
    topic: (formData: any) => formData.topic,
    minutes: (formData: any) => formData.minutes,
  },
}

export const FILE_SIZE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024,
  ERROR_MESSAGE: 'File size exceeds 10MB limit',
}

export const API_PARAMS = {
  REVIEW_ID: 'reviewId',
  STATUS: 'status',
  ORGANIZATION_REVIEW_ID: 'organization_review_id',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
}

export const ROUTE_PATHS = {
  REVIEW_LIST: '/design-review',
}

export const GRID_SIZES = {
  FULL_WIDTH: 12,
  HALF_WIDTH: 6,
  FIFTH_WIDTH: 5.8,
  THIRD_WIDTH: 4,
  QUARTER_WIDTH: 3,
  SIXTH_WIDTH: 2,
}

export const BUTTON_CONFIG = [
  { label: 'Submit for Review', key: 'submitForReview' },
  { label: 'Submit for Approval', key: 'submitForApproval' },
  { label: 'Approve', key: 'approve' },
  { label: 'Reject', key: 'reject' },
  { label: 'Submit', key: 'submit' },
  { label: 'Design Review Approval', key: 'designReviewApproval' },
  { label: 'Cancel', key: 'cancel' },
  { label: 'Save', key: 'save' },
]

export const API_ENDPOINTS = {
  DESIGN_REVIEW: '/api/v1/dnd/design-review-report/',
  DESIGN_STAGES: '/api/design-stages',
  MEMBERS: 'v1/api/members',
}

export const DESIGN_REVIEW_STATUS_TABLE = {
  HEADERNAME: {
    SNO: 'S.No',
    MEMBER_NAME: 'Member Name',
    ROLE: 'Role',
    STATUS: 'Status',
  },
  FIELDNAME: {
    SNO: 'sno',
    MEMBER_NAME: 'firstName',
    ROLE: 'role_name',
    STATUS: 'status_id',
  },
}

export const DESIGN_REVIEW_STATUS_TITLE = 'Functional Head Approval Status'
export const YET_TO_START = 'Yet to Start'

// File property constants
export const FILE_PROPERTIES = {
  FILE_ID: 'file_id' as const,
  ID: 'id' as const,
} as const

export const FIELD_LABEL_MAP = {
  topic: 'Topic*',
  minutes: 'Minutes of Meeting*',
  documents: 'Upload*'
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)

// Members Attended Table Columns
export const MEMBERS_ATTENDED_COLUMNS = [
  { field: 'sno', headerName: 'S.No.', flex: NUMBERMAP.HALF },
  { field: 'member_name', headerName: 'Member Name', flex: NUMBERMAP.ONE },
  { field: 'role', headerName: 'Role', flex: NUMBERMAP.ONE },
  { field: 'actions', headerName: 'Actions', flex: NUMBERMAP.ONE, disableColumnMenu: true, sortable: false },
]

// Members Modal Constants
export const MEMBERS_MODAL_CONSTANTS = {
  ADD: 'Add Members',
  EDIT: 'Edit Members',
  ROLE_LABEL: 'Role*',
  ROLE_PLACEHOLDER: 'Select Role',
  ROLE_KEY: 'role_id',
  ROLE_VALUE: 'role_name',
  ROLE_ERROR: 'Role is required',
  MEMBER_NAME_LABEL: 'Member Name*',
  MEMBER_NAME_PLACEHOLDER: 'Select Member Name',
  MEMBER_NAME_KEY: 'id',
  MEMBER_NAME_VALUE: 'employee_name',
  MEMBER_NAME_ERROR: 'Member Name is required',
  DESCRIPTION_LABEL: 'Description',
  DESCRIPTION_PLACEHOLDER: 'Enter Description',
  STATUS_LABEL: 'Status*',
  STATUS_PLACEHOLDER: 'Select Status',
  STATUS_KEY: 'value',
  STATUS_VALUE: 'label',
  STATUS_ERROR: 'Status is required',
} as const