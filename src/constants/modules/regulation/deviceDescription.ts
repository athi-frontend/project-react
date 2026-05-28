import { NUMBERMAP } from "@/constants/common";

export const DEVICE_DESCRIPTION_INFO_TEXT = {
  PRODUCT_SPECIFICATION: `List the features, dimensions and performance attributes of the medical device, its variants and accessories, that would typically appear in the product specification made available to the end user`,
}

const BASE_DEVICE_DESCRIPTION_API_PATH = '/api/v1/regulation';

export const DEVICE_DESCRIPTION_API_ENDPOINTS = {
  FETCH_BY_ID: (projectID: number) => `${BASE_DEVICE_DESCRIPTION_API_PATH}/device-description/${projectID}`,
  POST: `${BASE_DEVICE_DESCRIPTION_API_PATH}/device-description`,
  FETCH_SPECIFICATION_ASPECTS: `${BASE_DEVICE_DESCRIPTION_API_PATH}/specification-aspects/all?status=${NUMBERMAP.ONE}`,
};

export const DEVICE_DESCRIPTION_LABELS = {
  PAGE_TITLE: 'Device Description and Product Specification, Including Variants and Accessories',
  DOSSIER_SUBHEADER: 'The Dossier Contains the Following Descriptive Information for the Device',
  GENERAL_DESCRIPTION: 'General Description',
  GENERIC_NAME: 'Generic Name',
  MODEL_NAME_VARIANTS: 'Model Name / Variants',
  MODEL_NO: 'Model No',
  MATERIALS_OF_CONSTRUCTION: 'Materials of Construction',
  INTENDED_USE: 'Intended Use',
  INDICATIONS: 'Indications',
  INSTRUCTIONS_FOR_USE: 'Instructions For Use',
  CONTRAINDICATIONS: 'Contraindications',
  WARNINGS_PRECAUTIONS: 'Warnings, Precautions',
  POTENTIAL_ADVERSE_EFFECTS: 'Potential Adverse Effects',
  INTENDED_PATIENT_POPULATION: 'The Intended Patient Population and Medical Condition to be Diagnosed or Treated and Other Considerations Such as Patient Selection Criteria',
  ACCESSORIES_DESCRIPTION: 'Description of the Accessories, Other Medical Device and Other Product that are not Medical Device, Which are Intended to be Used in Combination',
  EXPLANATION_NOVEL_FEATURES: 'Explanation of Novel Features',
  PRINCIPLE_OF_OPERATION: 'Principle of Operation or Mode of Action',
  GENERAL_DESCRIPTION_KEY_ELEMENTS: 'General Description of the Key Functional Elements',
  VARIOUS_CONFIGURATIONS: 'Various Configurations or Variants of the Device',
  MATERIALS_SECTION: 'Description of the Materials Incorporated Into Key Functional Elements and Those Making Either Direct Contact with a Human Body or Indirect Contact with the Body',
  MATERIALS_CONTACT: 'Materials Which Come in Contact With Body',
  MATERIALS_NONCONTACT: 'Materials Which Do Not Come in Contact With Body',
  MEDICAL_DEVICES_IONIZING_RADIATION: 'Medical Devices Intended to Emit Ionizing Radiation',
  PRODUCT_SPECIFICATION: 'Product Specification',
  PRODUCT_SPECIFICATIONS: 'Product Specifications',
  REFERENCE_PREDICATE: 'Reference to Predicate or Previous Generations of the Device',
  PREVIOUS_GENERATION_DEVICE: 'Previous Generation of the Device',
  PREDICATE_DEVICES_MARKETS: 'Predicate Devices Available on the Local and International Markets',
  COMPARATIVE_ANALYSIS: 'Comparative Analysis to Prove Substantial Equivalence to the Predicate Device(s) as Claimed',
  COMPANY_NAME: 'Company Name',
  ADD_NEW: 'Add New',
};

export const DEVICE_DESCRIPTION_COLUMNS = {
  MATERIALS: {
    SNO: { FIELD: 'sno', HEADER: 'S.No.' },
    PART_NAME: { FIELD: 'part_name', HEADER: 'Part Name' },
    MATERIAL: { FIELD: 'material', HEADER: 'Material' },
    ACTIONS: { FIELD: 'actions', HEADER: 'Actions' },
  },
  PREDICATE: {
    SNO: { FIELD: 'serialNo', HEADER: 'S.No.' },
    ASPECTS: { FIELD: 'aspects', HEADER: 'Aspects' },
    PREDICATE_DEVICE_COMPANY: { FIELD: 'predicateDeviceCompany', HEADER: 'Predicate Device Company' },
  }
};

export const DEVICE_DESCRIPTION_MODAL = {
  DEFAULT_STATE: { open: false, type: null, mode: 'add' as const, editIndex: null, item: null },
  TYPE: {
    CONTACT: 'contact',
    NONCONTACT: 'noncontact',
  },
  MODE: {
    ADD: 'add' as const,
    EDIT: 'edit' as const,
  },
};

export const DEVICE_DESCRIPTION_BUTTONS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
};

export const INPUT_TEXT = 'Input Text';

export const DEVICE_DESCRIPTION_PLACEHOLDERS = {
  PH_MEDICAL_DEVICES_IONIZING_RADIATION: 'Enter Medical Devices Intended to Emit Ionizing Radiation',
  PH_PREDICATE_DEVICE_COMPANY: 'Enter Predicate Device Company',
};

export const DEVICE_DESCRIPTION_FIELDS = {
  GENERIC_NAME: 'generic_name',
  MODEL_NAME_VARIANTS: 'model_name',
  MODEL_NO: 'model_number',
  MATERIALS_OF_CONSTRUCTION: 'material_construction',
  INTENDED_USE: 'intended_use',
  INDICATIONS: 'indication',
  INSTRUCTIONS_FOR_USE: 'instruction_for_use',
  CONTRAINDICATIONS: 'contra_indications',
  WARNINGS_PRECAUTIONS: 'precautions',
  POTENTIAL_ADVERSE_EFFECTS: 'potential_adverse_effects',
  INTENDED_PATIENT_POPULATION: 'intended_use_patient_criteria',
  ACCESSORIES_DESCRIPTION: 'accessory_combination_product_description',
  EXPLANATION_NOVEL_FEATURES: 'novel_features',
  PRINCIPLE_OF_OPERATION: 'principle_of_operation',
  GENERAL_DESCRIPTION_KEY_ELEMENTS: 'key_functional_elements_description',
  VARIOUS_CONFIGURATIONS: 'device_configurations_variants',
  MEDICAL_DEVICES_IONIZING_RADIATION: 'emits_ionizing_radiation',
  PRODUCT_SPECIFICATIONS: 'product_specifications',
  PREVIOUS_GENERATION_DEVICE: 'previous_generation',
  PREDICATE_DEVICES_MARKETS: 'predicate_device_available',
  COMPARATIVE_ANALYSIS: 'comparative_analysis',
  COMPANY_NAME: 'company_name',
};

export const DIRECT_CONTACT = 'direct_contact'
export const INDIRECT_CONTACT = 'indirect_contact'
