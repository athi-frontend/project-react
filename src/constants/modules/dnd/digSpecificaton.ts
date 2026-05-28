/**
      *Classification : Confidential
**/
export const FIELD_NAMES = {
  SPECIFICATION: 'specification',
  DESCRIPTION: 'description',
  APPLICABLE_STATUS: 'applicable_status',
  ID: 'id',
  ACTIONS: 'actions',
}
export const QUERY_KEY = 'specifications'
export const TITLE_VARIANT = 'h1'
export const TITLE = 'Specifications Applicability'
export const SPECID = 'design_specification_type_id'
export const BUTTONS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
}

export const COLUMN_CONSTANTS = {
  
  FIELD : {
    SPEC_TYPE : 'specification_type',
    DESCRIPTION : 'description',
    ACTIONS : 'actions'
  },
  HEADERS : {
    SPECIFICATION : 'Specification',
    DESCRIPTION : 'Description',
    APPLICABLE : 'Applicable'
  }
}
export const BUTTONSTYLE = { padding: '40px' }

export const UNCHECK = 'Uncheck'
export const CHECK = 'Check'
export const SAVE = 'Save'

/** Base API path for all DND module endpoints */
const BASE_API_PATH = 'api/v1/dnd'
/** Path segment for specification applicability endpoints */
const SPECIFICATION_APPLICABILITY_PATH = 'specification-applicability'
/** Path segment for dig specification endpoints */
const DIG_SPECIFICATION_PATH = 'dig-specification'

export const API_ENDPOINTS = {
  FETCH_SPECIFICATIONS: (projectId: number) =>
    `${BASE_API_PATH}/${SPECIFICATION_APPLICABILITY_PATH}/all?project_id=${projectId}`,
  SAVE_SPECIFICATIONS: `${BASE_API_PATH}/${SPECIFICATION_APPLICABILITY_PATH}/`,
  DIG_SPECIFICATION_ALL: (specification_applicability_id: number) =>
    `${BASE_API_PATH}/${DIG_SPECIFICATION_PATH}/${specification_applicability_id}/all`,
  DIG_SPECIFICATION_DELETE: (requirementId: number) =>
    `${BASE_API_PATH}/${DIG_SPECIFICATION_PATH}/${requirementId}`,
  SPECIFICATION_APPLICABILITY: (projectId: number) =>
    `${BASE_API_PATH}/${SPECIFICATION_APPLICABILITY_PATH}/${projectId}`,
  /**
   * Endpoint to fetch lifetime of device specification data
   * @param specificationApplicabilityId - The ID of the specification applicability
   * @returns Complete API endpoint URL for lifetime of device data
   */
  LIFETIME_OF_DEVICE: (specificationApplicabilityId: number) =>
    `${BASE_API_PATH}/${DIG_SPECIFICATION_PATH}/lifetime-of-the-device/${specificationApplicabilityId}`,
  /**
   * Endpoint to delete device
   * @param deviceId - The ID of the device to delete
   * @returns Complete API endpoint URL for device deletion
   */
  DEVICE_DELETE: (deviceId: number) =>
    `${BASE_API_PATH}/${DIG_SPECIFICATION_PATH}/device/${deviceId}`,
}

export const DELTE_DEVICE_ALERT = {
  DEVICE_DELETE_TITLE: 'Delete Device',
  DEVICE_DELETE_MESSAGE: 'Deleting the device name will remove all specifications defined for it. Are you sure you want to continue?',
}