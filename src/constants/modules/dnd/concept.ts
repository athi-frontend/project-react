import { NUMBERMAP } from "@/constants/common"
import { DocumentStructure, FormErrors, ProjectFormData } from "@/types/modules/dnd/concept"

export const CONCEPT_API_ENDPOINTS = {
  GET_CONCEPTS: (project_stage_order_id: number) => `/api/v1/dnd/concept/${project_stage_order_id}`,
  UPSERT_CONCEPT: '/api/v1/dnd/concept/',
}

export const CONCEPT_QUERY_KEYS = {
  FETCH_CONCEPTS_KEY: 'fetchConcepts',
  UPSERT_CONCEPT_KEY: 'upsertConcept',
}

export const statusOptions = [
    { id: 1, name: 'Completed' },
    { id: 2, name: 'Not Completed'}
  ]

export const INITIAL_FORM_DATA: ProjectFormData = {
  product_description: '',
  concept_status_id: '',
  document: []
}

export const INITIAL_ERRORS: FormErrors = {
  product_description: '',
  concept_status_id: '',
}

export const INITIAL_FILE_DATA: DocumentStructure = {
  documents_to_create: [],
  documents_to_delete: [],
  create_meta_data: {},
  update_meta_data: {},
  local_files_to_delete:[]
}

// Field label map for validation focus
export const FIELD_LABEL_MAP = {
  product_description: 'Description*'
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)

export const CONCEPT_CONSTANTS={
    OBJECT_KEY: 'object',
    FILE_ID: 'file_id',
    DESCRIPTION_REQUIRED: 'Description is required',
    CONCEPT: "Concept",
    CONCEPT_FORM:"concept-form",
    ID:"id",
    NAME: "name",
    DOCUMENTS:'Documents',
    LABEL:"Description*",
    PRODUCT_DESCRIPTION: 'product_description',
    STATUS: "Status",
    CANCEL: 'Cancel',
    SAVE: 'Save',
    DOCUMENTS_TO_CREATE: 'documents_to_create',
    DOCUMENTS_TO_DELETE: 'documents_to_delete',
    CREATE_META_DATA: 'create_meta_data',
    UPDATE_META_DATA: 'update_meta_data',
    PROJECT_ID: 'project_id',
    PROJECT_STAGE_ORDER_ID: 'project_stage_order_id',
    CONCEPT_DESCRIPTION: 'concept_description',
    CONCEPT_STATUS_ID: 'concept_status_id',
    CONTENT_TYPE: 'Content-Type',
    MULTIPART_FORM_DATA: 'multipart/form-data',
    SELECT_STATUS:'Select Status',
    ENTER_DESCRIPTION: 'Enter Description',
    PATH:"/dnd/project/list",
    KEY:"product-description-editor",
    SX:{ mt: NUMBERMAP.ONE, display: 'block' },
    ERROR:"error",
    SUCCESS: 'success',
    FAILED: 'failed',
    STAGE_NUMBER: 'stage_number',
}