/**
 * Classification : Confidential
 **/

import { NUMBERMAP } from '@/constants/common'
import { ComplaintFormData } from '@/types/modules/infrastructure-management/raiseComplaint'

export const RAISE_COMPLAINT_CONSTANTS = {
  TITLE: 'Raise a Complaint',
  DATATABLE_IDFIELD: 'complaint_id',
  MODAL_TITLES: {
    ADD: 'Add Complaint',
    EDIT: 'Edit Complaint',
  },
  FIELD_LABELS: {
    INFRASTRUCTURE_CATEGORY: 'Infrastructure Category',
    INFRASTRUCTURE_TYPE: 'Infrastructure Type',
    SERIAL_NUMBER: 'Serial No.*',
    COMPLAINT_DATE: 'Complaint Date*',
    COMPLAINT_TITLE: 'Complaint Title*',
    COMPLAINT_DESCRIPTION: 'Complaint Description*',
    STATUS: 'Status*',
    ROOT_CAUSE: 'Root Cause',
    RESOLUTION: 'Resolution',
    ACKNOWLEDGE_DATE: 'Acknowledge Date*',
    DOCUMENTS: 'Upload Document*',
  },
  FIELD_PLACEHOLDERS: {
    INFRASTRUCTURE_CATEGORY: 'Select Infrastructure Category',
    INFRASTRUCTURE_TYPE: 'Select Infrastructure Type',
    SERIAL_NUMBER: 'Select Serial No.',
    COMPLAINT_DATE: 'Select Complaint Date',
    COMPLAINT_TITLE: 'Enter Complaint Title',
    COMPLAINT_DESCRIPTION: 'Enter Complaint Description',
    STATUS: 'Select Status',
    ROOT_CAUSE: 'Enter Root Cause',
    RESOLUTION: 'Enter Resolution',
    ACKNOWLEDGE_DATE: 'Select Acknowledge Date',
    RICH_TEXT_EDITOR: 'Enter Complaint Description',
  },
  ERROR_MESSAGES: {
    INFRASTRUCTURE_CATEGORY_REQUIRED: 'Infrastructure Category is required',
    INFRASTRUCTURE_TYPE_REQUIRED: 'Infrastructure Type is required',
    SERIAL_NUMBER_REQUIRED: 'Serial No. is required',
    COMPLAINT_DATE_REQUIRED: 'Complaint Date is required',
    COMPLAINT_TITLE_REQUIRED: 'Complaint Title is required',
    COMPLAINT_DESCRIPTION_REQUIRED: 'Complaint Description is required',
    STATUS_REQUIRED: 'Status is required',
    COMPLAINT_DATE_INVALID: 'Complaint Date cannot exceed today',
    ACKNOWLEDGE_DATE_REQUIRED: 'Acknowledge Date is required',
    ACKNOWLEDGE_DATE_INVALID: 'Acknowledge Date cannot exceed today',
    DOCUMENTS_REQUIRED: 'File Upload is required',
  },
  TABLE_COLUMNS: {
    SNO: {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.ONE,
    },
    COMPLAINT_TITLE: {
      field: 'complaint_title',
      headerName: 'Complaint No.',
      flex: NUMBERMAP.TWO,
    },
    SERIAL_NUMBER: {
      field: 'serial_number',
      headerName: 'Infrastructure No.',
      flex: NUMBERMAP.TWO,
    },
    ACKNOWLEDGE_DATE: {
      field: 'acknowledge_date',
      headerName: 'Date Reported',
      flex: NUMBERMAP.ONE_HALF,
    },
    STATUS: {
      field: 'status',
      headerName: 'Status',
      flex: NUMBERMAP.ONE,
    },
    ACTIONS: {
      field: 'action',
      headerName: 'Actions',
    },
  },
  SECTION_TITLES: {
    SERVICE_DETAILS: 'Service Details',
  },
  DATE_FORMAT: 'YYYY-MM-DD',
  SECTION_TITLE_STYLES: {
    fontSize: '20px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  DROPDOWN_FIELDS: {
    INFRASTRUCTURE_CATEGORY: {
      KEY_FIELD: 'infrastructure_category_id',
      VALUE_FIELD: 'infrastructure_category_name',
    },
    INFRASTRUCTURE_TYPE: {
      KEY_FIELD: 'infrastructure_type_id',
      VALUE_FIELD: 'infrastructure_type_name',
    },
    SERIAL_NUMBER: {
      KEY_FIELD: 'infrastructure_id',
      VALUE_FIELD: 'serial_number',
    },
  },
  FORM_FIELD_NAMES: {
    COMPLAINT_ID: 'complaint_id',
    INFRASTRUCTURE_ID: 'infrastructure_id',
    COMPLAINT_DATE: 'complaint_date',
    COMPLAINT_TITLE: 'complaint_title',
    COMPLAINT_DESCRIPTION: 'complaint_description',
    STATUS_ID: 'status_id',
    ACKNOWLEDGE_DATE: 'acknowledge_date',
    ROOT_CAUSE: 'root_cause',
    RESOLUTION: 'resolution',
    INFRASTRUCTURE_CATEGORY_ID: 'infrastructure_category_id',
    INFRASTRUCTURE_TYPE_ID: 'infrastructure_type_id',
    SERIAL_NUMBER: 'serial_number',
    DOCUMENTS_TO_DELETE: 'documents_to_delete',
    CREATE_META_DATA: 'create_meta_data',
    UPDATE_META: 'update_meta_data',
    DOCUMENTS_TO_CREATE: 'documents_to_create',
    LOCAL_FILES_TO_DELETE: 'local_files_to_delete',
  }
}

// API URL Constants
const INFRASTRUCTURE_API_BASE_URL = '/api/v1/infrastructure/'
const RAISE_COMPLAINT_END_URL = 'raise-complaint/'

export const RAISE_COMPLAINT_API_ENDPOINTS = {
  GET_ALL: `${INFRASTRUCTURE_API_BASE_URL}${RAISE_COMPLAINT_END_URL}all`,
  GET_BY_ID: (complaintId: number) =>
    `${INFRASTRUCTURE_API_BASE_URL}${RAISE_COMPLAINT_END_URL}${complaintId}`,
  UPSERT: `${INFRASTRUCTURE_API_BASE_URL}${RAISE_COMPLAINT_END_URL}`,
  DELETE: (complaintId: number) =>
    `${INFRASTRUCTURE_API_BASE_URL}${RAISE_COMPLAINT_END_URL}${complaintId}`,
}

export const INFRASTRUCTURE_CATEGORY_API_ENDPOINTS = {
  GET_ALL: `${INFRASTRUCTURE_API_BASE_URL}category/all`,
}

export const INFRASTRUCTURE_TYPE_API_ENDPOINTS = {
  GET_ALL: `${INFRASTRUCTURE_API_BASE_URL}type/all`,
}

export const SERIAL_NUMBER_API_ENDPOINTS = {
  GET_ALL: `${INFRASTRUCTURE_API_BASE_URL}serial-number/all`,
}

export const QUERY_PARAMS = {
  INFRASTRUCTURE_CATEGORY_ID: 'infrastructure_category_id',
  INFRASTRUCTURE_TYPE_ID: 'infrastructure_type_id',
}

export const RAISE_COMPLAINT_QUERY_KEYS = {
  LIST: 'raise-complaint-list',
  FETCH_BY_ID: 'raise-complaint-by-id',
  INFRASTRUCTURE_CATEGORY: 'infrastructure-category-list',
  INFRASTRUCTURE_TYPE: 'infrastructure-type-list',
  SERIAL_NUMBER: 'serial-number-list',
}

export const INITIAL_COMPLAINT_FORM_DATA: ComplaintFormData = {
  infrastructure_category_id: null,
  infrastructure_type_id: null,
  infrastructure_id: null,
  serial_number: '',
  complaint_date: '',
  complaint_title: '',
  complaint_description: '',
  status_id: null,
  root_cause: '',
  resolution: '',
  acknowledge_date: '',
  documents: [],
}

