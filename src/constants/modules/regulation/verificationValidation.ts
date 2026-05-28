export const VERIFICATION_VALIDATION_BASE = '/api/v1/regulation/verification-validation';

export const VERIFICATION_VALIDATION_API = {
  FETCH: (deviceMasterId: number) => `${VERIFICATION_VALIDATION_BASE}/${deviceMasterId}`,
  POST: VERIFICATION_VALIDATION_BASE,
};

export const VERIFICATION_VALIDATION_QUERY_KEY = 'verificationValidation';

export const VERIFICATION_VALIDATION_FIELDS = {
  GENERAL: 'general',
  BIOCOMPATIBILITY: 'biocompatibility',
  BIOCOMPATIBILITY_TEST_REPORT: 'biocompatibility_test_report',
  BIOLOGICAL_EVALUATION: 'biological_evaluation',
  MEDICINAL_SUBSTANCES: 'medicinal_substances',
  BIOLOGICAL_SAFETY: 'biological_safety',
  STERILE_ETO_METHOD: 'sterile_eto_method',
  SOFTWARE_VERIFICATION: 'software_verification',
  ANIMAL_STUDIES: 'animal_studies',
  STABILITY_DATA: 'stability_data',
  MAIN_UNIT: 'main_unit',
  UTILITY_TYPE_DETAILS: 'utility_type_details',
  ACCELERATED_STUDY_REPORT: 'accelerated_study_report',
  CLINICAL_EVIDANCE: 'clinical_evidance',
  POST_MARKET_SURVEILANCE_DATA: 'post_market_surveilance_data',
  DIRECT_CONTACT_VERIFICATION: 'direct_contact_verification',
  INDIRECT_CONTACT_VERIFICATION: 'indirect_contact_verification',
  BIOCOMPATIBLE_TEST_RESULTS: 'biocompatible_test_results',
};

// Verification & Validation constants for regulation module

export const INFO_TEXT = {
  GENERAL: "General information about the medical device",
  BIOCOMPATIBILITY: "Biocompatibility assessment details",
  MATERIALS_CONTACT: "Materials that come in contact with the human body",
  MATERIALS_NON_CONTACT: "Materials that do not come in contact with the human body",
  BIOCOMPATIBLE_TESTS: "List of biocompatibility tests performed and their results",
  MEDICINAL_SUBSTANCES: "Information about medicinal substances used",
  BIOLOGICAL_SAFETY: "Biological safety evaluation details",
  STERILE_ETO: "Sterilization using ETO method information",
  SOFTWARE_VERIFICATION: "Software verification and validation details",
  ANIMAL_STUDIES: "Animal studies conducted for the device",
  STABILITY_DATA: "Stability data and testing information",
  MAIN_UNIT: "Verification data for the main unit",
  ACCESSORIES: "Verification data for accessories and consumables",
  ACCELERATED_STABILITY: "Accelerated stability study report",
  CLINICAL_EVIDENCE: "Clinical evidence supporting the device",
  POST_MARKET: "Post market surveillance data"
};

export const SECTION_TITLES = {
  VERIFICATION_VALIDATION: "Verification and Validation of the Medical Device",
  LIST_OF_MATERIALS: "List of Materials",
  MATERIALS_CONTACT: "Materials Which Come in Contact with Body",
  MATERIALS_NON_CONTACT: "Materials Which Do Not Come in Contact with Body",
  BIOCOMPATIBLE_TESTS: "List of Biocompatible Tests Performed and Results"
};

// Modal types
export type ModalType = 'materialContact' | 'materialNonContact' | 'biocompatibilityTest';
export const MODAL_TYPES = {
  MATERIAL_CONTACT: 'materialContact',
  MATERIAL_NON_CONTACT: 'materialNonContact',
  BIOCOMPATIBILITY_TEST: 'biocompatibilityTest',
} as const;

// Button labels
export const BUTTON_LABELS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
};

// UI Strings
export const UI_STRINGS = {
  ADD_NEW: 'Add New',
  ENTER_GENERAL: 'Enter General',
  BIOCOMPATIBILITY: 'Biocompatibility',
  BIOCOMPATIBLE_TESTS_REPORTS: 'Biocompatible Tests Reports',
  BIOLOGICAL_EVALUATION: 'Biological Evaluation of Medical Devices',
  MEDICINAL_SUBSTANCES: 'Medicinal Substances',
  BIOLOGICAL_SAFETY: 'Biological Safety',
  STERILE_ETO_METHOD: 'Sterile – ETO Method',
  SOFTWARE_VERIFICATION: 'Software Verification and Validation',
  ANIMAL_STUDIES: 'Animal Studies',
  STABILITY_DATA: 'Stability Data',
  FOR_MAIN_UNIT: 'For Main Unit',
  FOR_ACCESSORIES: 'For Accessories/Consumables',
  ACCELERATED_STABILITY: 'Accelerated Stability Study Report of the Device',
  CLINICAL_EVIDENCE: 'Clinical Evidence',
  POST_MARKET_SURVEILLANCE: 'Post Market Surveillance Data',
  INPUT_TEXT: 'Input Text',
  FILE_ANNEXURE_1: 'Annexure 1',
  FILE_ANNEXURE_2: 'Annexure 2',
  FORM_SAVED: 'Form saved successfully',
  LOADING: 'Loading...',
  GENERAL: 'General',
  PART_NAME: 'Part Name',
  MATERIAL: 'Material',
  // Added for modal fields
  PART_NAME_LABEL: 'Part Name*',
  PART_NAME_PLACEHOLDER: 'Enter Part Name',
  MATERIAL_LABEL: 'Material*',
  MATERIAL_PLACEHOLDER: 'Enter Material',
  ACTIONS: 'Actions',
  S_NO: 'S.No.',
  STD_REF: 'Std. Ref.',
  SCOPE_OF_STUDY: 'Scope of the Study',
  RESULT: 'Result',
  // Added for biocompatibility test modal fields
  STD_REF_LABEL: 'Std. Ref.*',
  STD_REF_PLACEHOLDER: 'Enter Standard Reference',
  SCOPE_OF_STUDY_LABEL: 'Scope of Study*',
  SCOPE_OF_STUDY_PLACEHOLDER: 'Enter Scope of Study',
  RESULT_LABEL: 'Result*',
  RESULT_PLACEHOLDER: 'Enter Result',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  DELETE_CONFIRM: 'Are you sure you want to delete this item?',
};

// API keys
export const DIRECT_CONTACT_VERIFICATION = 'direct_contact_verification';
export const INDIRECT_CONTACT_VERIFICATION = 'indirect_contact_verification';
export const BIOCOMPATIBLE_TEST_RESULTS = 'biocompatible_test_results';

// Status strings
export const STATUS_SUCCESS = 'success';
export const STATUS_FAILED = 'failed';

// Modal types (for type safety and string usage)
export const MATERIAL_CONTACT = 'materialContact';
export const MATERIAL_NON_CONTACT = 'materialNonContact';
export const BIOCOMPATIBILITY_TEST = 'biocompatibilityTest';

// Field keys for DataGrid columns and row mapping
export const FIELD_KEYS = {
  SNO: 'Sno',
  PART_NAME: 'part_name',
  MATERIAL: 'material',
  ACTIONS: 'actions',
  SERIAL_NUMBER: 'serialNumber',
  STD_REF: 'std_ref',
  SCOPE_OF_PLAN: 'scope_of_plan',
  RESULT: 'result',
};

// Form field keys for label, placeholder, and onChange
export const FORM_FIELDS = {
  GENERAL: 'general',
  BIOCOMPATIBILITY: 'biocompatibility',
  BIOCOMPATIBILITY_TEST_REPORT: 'biocompatibility_test_report',
  BIOLOGICAL_EVALUATION: 'biological_evaluation',
  MEDICINAL_SUBSTANCES: 'medicinal_substances',
  BIOLOGICAL_SAFETY: 'biological_safety',
  STERILE_ETO_METHOD: 'sterile_eto_method',
  SOFTWARE_VERIFICATION: 'software_verification',
  ANIMAL_STUDIES: 'animal_studies',
  STABILITY_DATA: 'stability_data',
  MAIN_UNIT: 'main_unit',
  UTILITY_TYPE_DETAILS: 'utility_type_details',
  CLINICAL_EVIDANCE: 'clinical_evidance',
  POST_MARKET_SURVEILANCE_DATA: 'post_market_surveilance_data',
  ACCELERATED_STUDY_REPORT: 'accelerated_study_report',
};

// Add UI constants for button variant and DataGrid id field
export const BUTTON_VARIANT_OUTLINED = "outlined";
export const DATA_GRID_ID_FIELD = "id";

// Initial state for VerificationValidationData
export const INITIAL_VERIFICATION_VALIDATION_DATA = {
  verification_id: 0,
  device_master_id: 0,
  general: '',
  biocompatibility: '',
  biocompatibility_test_report: '',
  biological_evaluation: '',
  medicinal_substances: '',
  biological_safety: '',
  sterile_eto_method: '',
  software_verification: '',
  animal_studies: '',
  stability_data: '',
  main_unit: '',
  utility_type_details: '',
  accelerated_study_report: '',
  clinical_evidance: '',
  post_market_surveilance_data: '',
  direct_contact_verification: [],
  indirect_contact_verification: [],
  biocompatible_test_results: [],
};

// Placeholder constants
export const PLACEHOLDER_BIOCOMPATIBILITY = "Biocompatibility";

// Validation error messages
export const VALIDATION_ERRORS = {
  PART_NAME_REQUIRED: 'Part Name is required',
  MATERIAL_REQUIRED: 'Material is required',
  STD_REF_REQUIRED: 'Standard Reference is required',
  SCOPE_OF_STUDY_REQUIRED: 'Scope of Study is required',
  RESULT_REQUIRED: 'Result is required',
};

// Modal titles
export const MODAL_TITLES = {
  EDIT_MATERIAL_CONTACT: 'Edit Material in Contact with Body',
  ADD_MATERIAL_CONTACT: 'Add Material in Contact with Body',
  EDIT_MATERIAL_NON_CONTACT: 'Edit Material Not in Contact with Body',
  ADD_MATERIAL_NON_CONTACT: 'Add Material Not in Contact with Body',
  EDIT_BIOCOMPATIBILITY_TEST: 'Edit Biocompatibility Test',
  ADD_BIOCOMPATIBILITY_TEST: 'Add Biocompatibility Test',
}; 