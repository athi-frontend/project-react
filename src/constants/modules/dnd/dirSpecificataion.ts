import { NUMBERMAP } from "@/constants/common"

/**
 Classification : Confidential
**/

export const STRINGS = {
  ACCESSORIES_REQUIRED: 'Accessories / Consumables is required',
  PARAMETER_REQUIRED: 'Parameter is required',
  UNIT_REQUIRED: 'Unit is required',
  VALUE_REQUIRED: 'Value is required',
  FUNCTIONAL_BLOCK_REQUIRED: 'Functional Block is required',
  MODEL_REQUIRED: 'A model must be selected',
  ACCURACY_LEVEL_REQUIRED: 'Accuracy level is required',
  FILE_REQUIRED: 'File is required',
  LABEL: 'Label',
  DESCRIPTION: 'Description...',
  FIRST_PAGE: '?page=1',
  LAST_PAGE: '?page=1',
  REGULATIONS_REQUIRED: 'Regulations is required',  
  MARKET_REQUIRED: 'Market is required',
  USABILITY_INTERFACE_SPECIFICATION: 'Usability Interface Specifications',
  USABILITY_SPECIFICATION: 'Usability Specification',
  MARKET: 'market',
  REGULATIONS: 'regulations',
  MARKET_REGULATION_REQUIRED: 'Each selected market must have at least one regulation assigned.',
}

export const TOOLTIP_CONFIG = {
  TOOLTIP_PLACEMENT: 'top-start' as const
}


export const TABLE_FIELDS = {
  SNO: 'sno',
  PARAMETER: 'parameter',
  SPECIFICATION_DESCRIPTION: 'specification_description',
  UNIT: 'unit',
  VALUE: 'value',
  ACTIONS: 'actions',
}

export const TABLE_HEADERS = {
  SNO: 'S.No',
  PARAMETER: 'Parameter',
  SPECIFICATION_DESCRIPTION: 'Description',
  UNIT: 'Unit',
  VALUE: 'Value',
  ACTIONS: 'Actions',
}

export const DEFAULT_COLUMNS = [
  { field: 'sno', headerName: 'S.No', width: 100 },
  { field: 'parameter', headerName: 'Parameter', flex: 1 },
  { field: 'specification_description', headerName: 'Description', flex: 1 },
  { field: 'unit', headerName: 'Unit', width: 150 },
  { field: 'value', headerName: 'Value', width: 150 },
  { field: 'actions', headerName: 'Actions', width: 150 }
]

export const PERFORMANCE_SPECIFICATION_LABELS = {
  PERFORMANCE_SPECIFICATIONS_LABEL: 'Performance Specifications*',
  ACCESSORIES_CONSUMABLES_LABEL: 'Accessories / Consumables*',
  FUNCTIONAL_BLOCK_LABEL_NON_MANDATORY: 'Functional Block',
  PARAMETER_LABEL: 'Parameter*',
  PARAMETER_LABEL_NON_MANDATORY: 'Parameter',
  UNIT_LABEL: 'Unit',
  VALUE_LABEL: 'Value',
  FUNCTIONAL_BLOCK_LABEL: 'Functional Block*',
  MODELS_LABEL: 'Models*',
  ACCURACY_LEVEL_LABEL: 'Accuracy Level in Percentage',
  DESCRIPTION_LABEL: 'Description*',
  ADD_LABEL: 'Add New',
  POR_FRS_LABEL: 'Type',
  ADVERSE_EVENT_LABEL: 'Adverse Event*',
  MODULE_BLOCK_LABEL: 'Module*',
  LIFETIME_DEVICE_LABEL: 'Lifetime of Device*',
  MODULE_LABEL: 'Module*',
  CLAUSE_NUMBER_LABEL: 'Clause Number not Applicable',
  REGULATIONS_LABEL: 'Regulations*',
  MARKET_LABEL: 'Market*',
  APPLICABLE_STANDARDS_LABEL: 'Applicable Standards',
  DEVICE_LABEL: 'Device Name*',
  DEVICE_MULTIPLE_FIELD_LABEL: 'Select Device Name*',
  CONNECTIVITY : 'Connectivity',
  CONNECTIVITY_MODE : 'Mode of Connectivity',
  COMMUNICATION_PROTOCOL : 'Communication Protocol',
  STANDARDS : 'Standards*',

}

export const PERFORMANCE_SPECIFICATION_PLACEHOLDERS = {
  PERFORMANCE_SPECIFICATION: 'Select Performance Specifications',
  ACCESSORIES_CONSUMABLES: 'Select Accessories / Consumables',
  PARAMETER: 'Enter Parameter',
  UNIT: 'Enter Unit',
  VALUE: 'Enter Value',
  DESCRIPTION: 'Enter the Input',
  FUNCTIONAL_BLOCK: 'Select Functional Block',
  MODELS: 'Select Model',
  ACCURACY_LEVEL: 'Enter Accuracy Level in Percentage',
  POR_FRS: 'Select Type',
  ADVERSE_EVENT: 'Enter Adverse Event',
  LIFETIME_DEVICE: 'Enter Lifetime of Device',
  MODULE: 'Select Module',
  CLAUSE_NUMBER: 'Input Text',
  REGULATIONS: 'Select Regulations',
  MARKET: 'Select Market',
  APPLICABLE_STANDARDS: 'Enter Applicable Standards',
  DEVICE: 'Select Device Name',
  DEVICE_NAME: 'Enter Device Name',
  CONNECTIVITY : 'Enter Connectivity',
  CONNECTIVITY_MODE : 'Enter Mode of Connectivity',
  COMMUNICATION_PROTOCOL : 'Enter Communication Protocol',
  STANDARDS : 'Enter Standards',
}

export const SPECIFICATION_FIELDS = {
  PERFORMANCE_SPECIFICATION_FIELD: 'performanceSpecification',
  ACCESSORIES_CONSUMABLES_FIELD: 'accessoriesConsumables',
  PARAMETER_FIELD: 'parameter',
  UNIT_FIELD: 'unit',
  VALUE_FIELD: 'value',
  FUNCTIONAL_BLOCK_FIELD: 'functionalBlock',
  MODELS_FIELD: 'models',
  MODULE_FIELD: 'module',
  ACCURACY_LEVEL_FIELD: 'accuracylevel',
  DESCRIPTION_FIELD: 'description',
  TYPE_FIELD: 'type',
  DEVICE_FIELD:'deviceName',
  DEVICE_MULTIPLE_FIELD   : 'deviceMultiple',
  ADVERSE_EVENT_FIELD: 'adverseEvents',
  MANUFACTURING_PROCESS: 'manufacturingProcess',
  FUNCTIONAL_BLOCK_MULTISELECT_FIELD: 'functionalBlockMultiselect',
  LIFETIME_DEVICE_FIELD: 'lifeTimeOfDevice',
  UPLOAD_FILE: 'uploadedFile',
  CLAUSE_NUMBER: 'clauseNumber',
  REGULATIONS_FIELD: 'regulations',
  MARKET_FIELD: 'market',
  APPLICABLE_STANDARDS_FIELD: 'applicableStandards',  
  CONNECTIVITY_FIELD: 'connectivity',
  CONNECTIVITY_MODE_FIELD: 'connectivityMode',
  COMMUNICATION_PROTOCOL_FIELD: 'communicationProtocol',
  STANDARDS_FIELD: 'standards',
} as const

export const SPECIFICATION_FORM_FIELD = {
  ...SPECIFICATION_FIELDS,
  UPLOADED_FILE: 'uploadedFile',
}

export const SPECIFICATION_REQUIRED_MESSAGE = {
  PERFORMANCE_SPECIFICATION_REQUIRED: 'Performance Specification is required',
  ACCESSORIES_REQUIRED: 'Accessories / Consumables is required',
  PARAMETER_REQUIRED: 'Parameter is required',
  FUNCTIONAL_BLOCK_REQUIRED: 'Functional Block is required',
  MODELS_REQUIRED: 'Model is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  ADVERSE_EVENT_REQUIRED: 'Adverse Event is required',
  LIFETIME_DEIVICE_REQUIRED: 'Lifetime Device is required',
  REGULATIONS_REQUIRED: 'Regulations is required',
  MARKET_REQUIRED: 'Market is required',
  MODULE_REQUIRED: 'Module is required',
  DEVICE_REQUIRED:'Device Name is required',
  CONNECTIVITY_REQUIRED: 'Connectivity is required',
  CONNECTIVITY_MODE_REQUIRED: 'Mode of Connectivity is required',
  COMMUNICATION_PROTOCOL_REQUIRED: 'Communication Protocol is required',
  STANDARDS_REQUIRED: 'Standards is required',
}

export const PERFORMANCE_SPECIFICATION_BUTTONS = {
  CANCEL: { label: 'Cancel' },
  SAVE: { label: 'Save' },
  CLOSE: { label: 'Close' },
}

export const PERFORMANCE_SPECIFICATION_TITLES = {
  ADD: 'Performance Specification',
  EDIT: 'Edit Performance Specification',
  LOADING: 'Loading...',
  ERROR: 'Error',
}

export const FUNCTIONAL_SPECIFICATION_TITLE = 'Functional Specification'
export const PERFORMANCE_SPECIFICATION_TITLE = 'Performance Specifications'
export const PHYSICAL_CHARACTERSTIC_TITLE = 'Physical Characterstic'

export const PERFORMANCE_SPECIFICATION_MESSAGES = {
  LOADING: 'Loading specification data...',
}

export const SPECIFICATION_SCHEMA = {
  ID: 'id',
  REF_ID: 'ref_id',
  EQMS_USABILITY_TYPE: 'eqms_usability_type',
  EQMS_DIG_SPECIFICATION_USABILITY_TYPE_MAPPER: 'eqms_dig_specification_usability_type_mapper',
  EQMS_DIG_SPECIFICATION: 'eqms_dig_specification',
  EQMS_DIG_SPECIFICATION_MAPPER: 'eqms_dig_specification_mapper',
  EQMS_DIR_SUPPORTING_DOCUMENT: 'eqms_dir_supporting_document',
  FK_EQMS_SUPPORTING_DOCUMENT_ID: 'fk_eqms_supporting_document_id',
  FK_EQMS_SUPPORTING_FILE_ID: 'fk_eqms_supporting_file_id',
  FK_EQMS_SOURCE_SPECIFICATION_ID: 'fk_eqms_source_specification_id',
  FK_EQMS_DESIGN_SPECIFICATION_TYPE_LK_ID: 'fk_eqms_design_specification_type_lk_id',
  EQMS_MODELS_MAPPER: 'eqms_dig_specification_model_mapper',
  EQMS_FUNCTIONAL_MAPPER: 'eqms_dig_specification_functional_block_mapper',
  SPECIFICATION_PARAMETER: 'specification_parameter',
  SPECIFICATION_UNIT: 'specification_unit',
  SPECIFICATION_VALUE: 'specification_value',
  SPECIFICATION_CLAUSE_NUMBER: 'clause_no_of_applicable',
  APPLICABLE_STANDARDS: 'applicable_standards',
  MODEL_MAPPER: 'eqms_dig_specification_model_mapper',
  FK_EQMS_PROJECT_PRODUCT_VARIANTS_ID: 'fk_eqms_project_product_variants_id',
  FUNCTIONAL_BLOCK_MAPPER: 'eqms_dig_specification_functional_block_mapper',
  FK_EQMS_PRODUCT_FUNCTIONAL_BLOCK_ID: 'fk_eqms_product_functional_block_id',
  TOLERANCE_PERCENTAGE: 'tolerance_percentage',
  SPECIFICATION_DESCRIPTION: 'specification_description',
  DESIGN_INPUT_GATHERING_ID: 'design_input_gathering_id',
  STATUS: 'status',
  SPECIFICATION_TYPE: 'fk_eqms_usability_type_id',
  SPECIFICATION_ADVERESE_EVENT: 'adverse_event',
  USABILITY_TYPE: 'usability_type',
  DEVICE_COMPATIBILITY: '',
  LIFETIME_DEVICE: 'lifetime_of_device',
  CONNECTIVITY: 'connectivity',
  CONNECTIVITY_MODE: 'mode_of_connectivity',
  COMMUNICATION_PROTOCOL: 'communication_protocol',
}

export const SPECIFICATION_KEY_VALUE_FIELD = {
  PERFORMANCE_SPECIFICATION_ID: 'performance_specification_id',
  ACCESSORIES_ID: 'utility_type_id',
  ACCESSORIES_NAME: 'utility_type',
  PARAMETER: 'parameter',
  KEY: 'key',
  VALUE: 'value',
  MODEL_ID: 'model_id',
  MODEL_NAME: 'model_name',
  FUNCTIONAL_BLOCK_ID: 'key',
  FUNCTIONAL_BLOCK_NAME: 'value',
  ID: 'id',
  REF_ID: 'ref_id',
  TYPE_NAME: 'usability_type',
  LIFETIME_DEVICE_ID: 'lifetime_id',
  LIFETIME_DEVICE_NAME: 'lifetime_name',
  MODULE_ID: 'module_id',
  MODULE_NAME: 'module_name',
  // CLAUSE_NUMBER: 'clause_value',
}

const BASE_API_PATH = 'api/v1/dnd'
const BASE_API_END = 'dig-specification'

export const API_URLS = {
  PERFORMANCE_SPECIFICATION: {
    BASE: `/${BASE_API_PATH}/${BASE_API_END}`,
    FETCH: (designInputId: string) =>
      `/${BASE_API_PATH}/${BASE_API_END}/${designInputId}`,
    CREATE: `/${BASE_API_PATH}/${BASE_API_END}`,
    UPDATE: (designInputId: string) =>
      `/${BASE_API_PATH}/${BASE_API_END}/${designInputId}`,
    MODELS: `/${BASE_API_PATH}/model/all`,
    LIST: `/${BASE_API_PATH}/${BASE_API_END}/performance-specification/`,
  },
  FUNCTIONAL_SPECIFICATION: {
    FETCH: `/${BASE_API_PATH}/${BASE_API_END}/functional-specification`,
  },
  FUNCTIONAL_BLOCK: {
    FETCH: (projectId: string) =>
      `/${BASE_API_PATH}/functional-block/${projectId}`,
  },

  REGULATIONS_SAVE: {
    SAVE: `/${BASE_API_PATH}/regulation-market/`,
  },
  REGULATION_MARKET: {
    FETCH: (projectId: number) => `/${BASE_API_PATH}/regulation-market/${projectId}`,
  },
  ACCESSORIES: {
    FETCH_BY_USABILITY_TYPE: (specId: number, usabilityTypeId: number) => 
      `/${BASE_API_PATH}/accessory/all?spec_id=${specId}&usability_type=${usabilityTypeId}&status=${NUMBERMAP.ONE}`,
  },
  MAGIC_SAVE_DIR: {
    CREATE: `/${BASE_API_PATH}/dir`,
  },
}

export const SPECIFICATION_FORM_ID = {
  FUNCTIONAL_SPECIFICATION_FORM_ID:
    'DND_SPECIFICATION_WITH_REFERENCE_TO_OTHER_SPECIFICATION',
  OTHER_SPECIFICATION_FORM_ID: 'DND_SPECIFICATION',
  USABILITY_FORM_ID: 'DND_USABILITY_TYPE',
  OTHER_SPECIFICATION_DEVICE:'DND_DEVICE_SPECIFICATION',
  SHELF_LIFE: 'DND_SPECIFICATION_SHELF_LIFE',
}

export const SPECIFICATION_NAMES = {
  FUNCTIONAL_SPECIFICATION: 'Functional Specifications',
  PERFORMANCE_SPECIFICATION: 'Performance Specifications',
  USER_AND_PATIENT_REQUIREMENTS: 'User and Patient Requirements',
  PHYSICAL_CHARACTERSTIC: 'Physical Characteristics',
  POWER_SUPPLY: 'Power Supply',
  USABILITY_INTERFACE_SPECIFICATION: 'Usability Interface Specifications',
  COMMUNICATION_PROTOCOL: 'Communication Protocol',
  ENVIRONMENTAL_SPECIFICATION: 'Environmental Specifications',
  SOFTWARE_REQUIREMENTS: 'Software Requirements',
  LABELLING_AND_PACKAGING: 'Labelling and Packaging Requirements',
  STORAGE_AND_HANDLING_REQUIREMENTS: 'Storage & Handling Requirements',
  MANUFACTURING_PROCESS: 'Manufacturing Process',
  INSTALLATION_REQUIREMENTS: 'Installation Requirements',
  SERVICING_REQUIREMENTS: 'Servicing Requirements',
  RISK_CONTROL_MEASURES: 'Risk Control Measures',
  ADVERSE_EVENTS: 'Adverse Events Design Input',
  REFERENCE_FROM_PREVIOUS_DESIGN: 'References from the Previous Design',
  TRAINING_REQUIREMENT: 'Training Requirements for Customers',
  LIFETIME_DEVICE: 'Lifetime of the Device',
  STERILIZATION_REQUIREMENTS: 'Sterilization Requirements',
  RELIABILITY_REQUIREMENTS: 'Reliability Requirements',
  TOXICITY_AND_BIOCOMPATABILITY: 'Toxicity & Biocompatability',
  ACCESSORIES_CONSUMABLES: 'Accessories & Consumables',
  SHELF_LIFE: 'Shelf Life',
  DEVICE_NAME_FORM: 'Device Name',
  DEVICE_COMPATIBILITY: 'Other Device Compatibility',
  OTHER_REQUIREMENTS: 'Other Requirements',
  REGULATIONS: 'Regulations',
  SAFETY: 'Safety',
  STATUTORY: 'Statutory',
}

export const EQMS_DEVICE='fk_eqms_device_lk_id'
export const DATA_SOURCE='data-sourcename'
export const ACTIONS_NAME='Actions'
export const SPECIFICATION_CONTAINER='DND_SPECIFICATION'
export const NO_SPECIFICATION='No Specification Available'
export const DEVICE_NAME='Device Name'

export const QUERY_KEY = 'regulationMarket'
export const FIELDS={
  SNO:'sno',
  DEVICE:'device_name',
  ACTION:'actions'
}
export const DATA_SOURCE_NAMES={
  DEVICE:'eqms_device_lk'
}
export const DATA_FIELD_NAMES={
   ID:'id',
   DEVICE_NAME:'device_name',
   STATUS:'status'
}
export const ICON_SIZES = '24'

export const ICON_PROPS = {
  SIZE: '24',
  COLOR: 'currentColor',
}
export const ICON_BUTTON_PROPS = {
  EDIT_COLOR: 'primary',
  DELETE_COLOR: 'error',
}
export const BOX_LAYOUT = {
  DISPLAY: 'flex',
}
export const DATA_ATTRIBUTES = {
  STATUS: 'data-status',
}
export const BOX_STYLE = { marginTop: '10px' }
export const ADD_NEW = '+ Add New'
export const DATA_GRID_DELETE_CLASS = '.data-grid-delete'

const snoColumn = {
  field: 'sno',
  headerName: 'S.No',
  'data-sourcename': 'eqms_dig_specification',
  'data-fieldname': 'id',
  flex: NUMBERMAP.ONE,
}

const ActionsColumn =  {
  field: 'actions',
  headerName: 'Actions',
  'data-sourcename': 'eqms_dig_specification',
  'data-fieldname': 'status',
}

const ParameterColumn = {
  field: 'specification_parameter',
  headerName: 'Parameter',
  'data-sourcename': 'eqms_dig_specification',
  'data-fieldname': 'specification_parameter',
  flex: NUMBERMAP.ONE_HALF,
}

const DescriptionColumn = {
  field: 'specification_description',
  headerName: 'Description',
  'data-sourcename': 'eqms_dig_specification',
  'data-fieldname': 'specification_description',
  flex: NUMBERMAP.ONE,
}

const performanceSpecification = [
  snoColumn,
  ParameterColumn,
  DescriptionColumn,
  {
    field: 'specification_unit',
    headerName: 'Unit',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_unit',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'specification_value',
    headerName: 'Value',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_value',
    flex: NUMBERMAP.ONE,
  },
 ActionsColumn,
]
const softwareRequirements = [
  {
    field: 'sno',
    headerName: 'S.No',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'id',
    flex: NUMBERMAP.THREE,
  },
  {
    field: 'specification_description',
    headerName: 'Description',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_description',
    flex: NUMBERMAP.THREE,
  },

  {
    field: 'actions',
    headerName: 'Actions',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'status',
    flex: NUMBERMAP.ONE,
  },
]
const manufacturingProcess = [
  {
    field: 'sno',
    headerName: 'S.No',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'id',
    flex: NUMBERMAP.HALF,
  },
  {
    field: 'specification_parameter',
    headerName: 'Parameter',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_parameter',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'specification_description',
    headerName: 'Description',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_description',
    flex: NUMBERMAP.ONE,
  },

  {
    field: 'actions',
    headerName: 'Actions',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'status',
  },
]
const accessoriesConsumables = [
  {
    field: 'sno',
    headerName: 'S.No',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'id',
    flex: NUMBERMAP.ONE_HALF,
  },
  {
    field: 'specification_description',
    headerName: 'Description',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_description',
    flex: NUMBERMAP.TWO,
  },
  {
    field: 'specification_unit',
    headerName: 'Unit',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_unit',
    flex: NUMBERMAP.TWO,
  },
  {
    field: 'specification_value',
    headerName: 'Value',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_value',
    flex: NUMBERMAP.TWO,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'status',
  },
]
const shelfLife = [
  {
    field: 'sno',
    headerName: 'S.No',
    'data-sourcename': 'eqms_dig_specification_mapper_eqms_dig_specification_mapper_fk_eqms_target_specification_idToeqms_dig_specification',
    'data-fieldname': 'fk_eqms_target_specification_id',
    flex: NUMBERMAP.HALF,
  },
  {
    field: 'usability_type',
    headerName: 'Type',
    'data-sourcename': 'eqms_usability_type',
    'data-fieldname': 'usability_type',
    flex: NUMBERMAP.HALF
  },
  {
    field: 'specification_parameter',
    headerName: 'Accessories / Consumables',
    'data-sourcename': 'eqms_dig_specification_eqms_dig_specification_mapper_fk_eqms_source_specification_idToeqms_dig_specification',
    'data-fieldname': 'specification_parameter',
    flex: NUMBERMAP.ONE_HALF
  },
  {
    field: 'specification_unit',
    headerName: 'Unit',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_unit',
    flex: NUMBERMAP.ONE
  },
  {
    field: 'specification_value',
    headerName: 'Value',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'specification_value',
    flex: NUMBERMAP.ONE
  },
  {
    field: 'actions',
    headerName: 'Actions',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'status',
  },
]

const otherDeviceCompatibility = [
  snoColumn,
  ParameterColumn,
  DescriptionColumn,
  {
    field: 'connectivity',
    headerName: 'Connectivity',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'connectivity',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'mode_of_connectivity',
    headerName: 'Mode of Connectivity',
    'data-sourcename': 'eqms_dig_specification',
    'data-fieldname': 'mode_of_connectivity',
    flex: NUMBERMAP.ONE,
  },
  ActionsColumn,
]
export const COLUMN_OBJECT = {
  'PERFORMANCE SPECIFICATIONS': performanceSpecification,
  'FUNCTIONAL SPECIFICATIONS': performanceSpecification,
  'USER AND PATIENT REQUIREMENTS': performanceSpecification,
  'PHYSICAL CHARACTERISTICS': performanceSpecification,
  'POWER SUPPLY': performanceSpecification,
  'USABILITY INTERFACE SPECIFICATIONS': performanceSpecification,
  'COMMUNICATION PROTOCOL': performanceSpecification,
  'ENVIRONMENTAL SPECIFICATIONS': performanceSpecification,
  'SOFTWARE REQUIREMENTS': softwareRequirements,
  'LABELLING AND PACKAGING REQUIREMENTS': performanceSpecification,
  'STORAGE & HANDLING REQUIREMENTS': performanceSpecification,
  'MANUFACTURING PROCESS': manufacturingProcess,
  'INSTALLATION REQUIREMENTS': performanceSpecification,
  'SERVICING REQUIREMENTS': performanceSpecification,
  'RISK_CONTROL_MEASURES': performanceSpecification,
  'ADVERSE EVENTS DESIGN INPUT': softwareRequirements,
  'REFERENCES FROM THE PREVIOUS DESIGN': manufacturingProcess,
  'TRAINING REQUIREMENTS FOR CUSTOMERS': softwareRequirements,
  'LIFETIME OF THE DEVICE': softwareRequirements,
  'STERILIZATION REQUIREMENTS': performanceSpecification,
  'RELIABILITY REQUIREMENTS': performanceSpecification,
  'TOXICITY & BIOCOMPATABILITY': performanceSpecification,
  'ACCESSORIES & CONSUMABLES': accessoriesConsumables,
  'SHELF LIFE': shelfLife,
  'OTHER DEVICE COMPATIBILITY': otherDeviceCompatibility,
  'OTHER REQUIREMENTS': performanceSpecification,
  'REGULATIONS': manufacturingProcess,
  'SAFETY': performanceSpecification,
  'STATUTORY': performanceSpecification,
}

export const REQUIRED_FIELD={
  LIFETIME_DEVICE:'Lifetime of Device is required',
  DESCRIPTION_REQUIRED:'Description is required'
}
export const INSERT='insert'
export const UPDATE='update'
export const CONTAINER='DND_SPECIFICATION'
export const LABELS={
  LIFETIME:'Lifetime of Device*',
  DESCRIPTION:'Description*',
  CANCEL:'Cancel',
  SAVE:'Save',
  OUTLINE:'outlined',
  CONTAINED:'contained'
}
export const OBJECT='object'
export const PLACE_HOLDERS={
  LIFE_TIME:"Enter Lifetime of Device",
  DESCRIPTION:'Input Text'
}
export const VARIABLES={
  LIFE_TIME:'lifetimeOfDevice',
  DESCRIPTION:'description'
}
export const LIFE_TIME_DATA_SOURCE='eqms_dig_specification'
export const LIFE_TIME_DEVICE_DATA_FIELD='lifetime_of_device'
export const DESCRIPTION_DATA_FIELD='specification_description'