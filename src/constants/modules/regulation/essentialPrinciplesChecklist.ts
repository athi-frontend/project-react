import { FormData } from '@/types/modules/regulation/essentialPrinciplesChecklist'

const BASE_API_PATH = 'api/v1/regulation/principle-checklist'

export const API_ENDPOINTS = {
  FETCH_ALL: (projectId: number) => `/${BASE_API_PATH}/all/${projectId}`,
  FETCH_BY_ID: (id: number) => `/${BASE_API_PATH}/${id}`,
  CREATE: `/${BASE_API_PATH}`,
  UPDATE: (id: number) => `/${BASE_API_PATH}/${id}`,
  DELETE: (id: number) => `/${BASE_API_PATH}/${id}`,
}

export const ESSENTIAL_PRINCIPLES_CHECKLIST_CONSTANTS = {
  TITLE: 'Essential Principles Checklist',
  ID_FIELD: 'id',
}

export const FIELD_ESSENTIAL_PRINCIPLE = 'essentialPrinciple'
export const FIELD_RELEVANT = 'relevant'
export const FIELD_SPECIFICATION = 'specification'
export const FIELD_COMPLIES = 'complies'
export const FIELD_DOCUMENT_REF = 'documentRef'
export const ESSENTIAL_PRINCIPLES_CHECKLIST_COLUMNS = {
  SNO: { FIELD: 'sno', HEADER: 'S.No' },
  ESSENTIAL_PRINCIPLE: {
    FIELD: 'essential_principle',
    HEADER: 'Essential Principle',
  },
  IS_RELEVANT: { FIELD: 'is_relevant', HEADER: 'Relevant Yes/No' },
  SPECIFICATION: {
    FIELD: 'specification',
    HEADER: 'Specification/Standard Sub-Clause/Reference',
  },
  IS_COMPLIES: { FIELD: 'is_complies', HEADER: 'Complies Yes/No' },
  DOCUMENT_REF_JUSTIFICATION: {
    FIELD: 'document_ref_justification',
    HEADER: 'Document Reference Justification and/or Comments',
  },
}

export const ESSENTIAL_PRINCIPLES_CHECKLIST_MODAL = {
  TITLE: 'Essential Principles Checklist',
  PLACEHOLDERS: {
    ESSENTIAL_PRINCIPLE: 'Enter Essential Principles Checklist',
    SPECIFICATION: 'Enter Specification/Standard Sub-Clause/Reference',
    DOCUMENT_REF_JUSTIFICATION:
      'Enter Document Reference Justification and/or Comments',
  },
  LABELS: {
    ESSENTIAL_PRINCIPLE: 'Essential Principles Checklist*',
    RELEVANT: 'Relevant*',
    SPECIFICATION: 'Specification/Standard Sub-Clause/Reference*',
    COMPLIES: 'Complies*',
    DOCUMENT_REF_JUSTIFICATION:
      'Document Reference Justification and/or Comments*',
  },
}

export const ERROR_MESSAGES = {
  essentialPrinciple: 'Essential Principle is required',
  relevant: 'Please select if Relevant',
  specification: 'Specification is required',
  complies: 'Please select if Complies',
  documentRef: 'Document Reference is required',
}

export const INITIAL_FORM_DATA: FormData = {
  essentialPrinciple: '',
  relevant: '',
  specification: '',
  complies: '',
  documentRef: '',
}
