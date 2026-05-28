/**
 * Hazard Identification Tool Constants
 * Classification: Confidential
 */

const HAZARD_IDENTIFICATION_TOOL_BASE_API =
  '/api/v1/risk/hazard-identification-tool'

export const HAZARD_IDENTIFICATION_TOOL_CONSTANTS = {
  TITLE: 'Hazard Identification Tool',
  MULTI_SELECT: {
    LABEL: 'Hazard Identification Tool Used*',
    PLACEHOLDER: 'Select tool(s)',
    ID_FIELD: 'id',
    VALUE_FIELD: 'hazard_identification_tool',
  },
  DESCRIPTION: {
    LABEL: 'Description',
    PLACEHOLDER: 'Enter description',
  },
  ERROR_MESSAGES: {
    TOOL_REQUIRED: 'Hazard Identification Tool Used is Required',
  },
  API: {
    DROPDOWN: `${HAZARD_IDENTIFICATION_TOOL_BASE_API}/all`,
    UPSERT: HAZARD_IDENTIFICATION_TOOL_BASE_API,
    FETCH_BY_PROJECT: `${HAZARD_IDENTIFICATION_TOOL_BASE_API}/list`,
  },
}
