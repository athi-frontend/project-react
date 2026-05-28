export const FIELD_LABELS = {
  PRODUCT_NAME: 'Product Generic Name*',
  MARKET: 'Market*',
  REGULATIONS: 'Regulations*',
  INTENDED_USE: 'Initial Intended Use*',
  APPLICATIONS: 'Applications of Product*',
  MARKET_SCENARIO: 'Market Scenario*',
  COMPETITIVE_PRODUCTS: 'Competitive Products*',
  MARKET_SIZE: 'Market Size',
  TARGET_GEOGRAPHY: 'Target Geography*',
  TARGET_SEGMENT: 'Target Segment*',
  TARGET_AUDIENCE: 'Target Audience*',
  INITIAL_SUCCESS_FACTOR: 'Initial Success Factor',
  GROWTH_SUSTAINING_FACTOR: 'Growth Sustaining Factor',
  STRATEGIC_MARKETING: 'Strategic Marketing Requirements',
  DEMAND_GENERATIONS: 'Demand Generations for Next Years',
  POTENTIAL_RISK: 'Potential Business Risk',
  FILE_UPLOAD: 'File Upload*',
  SEGMENT: 'Segment*',
  MAJOR_COMPETITOR: 'Major Competitor*',
  SEGMENT_SHARE: 'Segment Share*',
  PRICE_RANGE: 'Price Range*',
}

export const FIELD_PLACEHOLDERS = {
  PRODUCT_NAME: 'Enter Product Generic Name',
  INTENDED_USE: 'Enter Initial Intended Use',
  APPLICATIONS: 'Enter Applications of Product',
  MARKET_SCENARIO: 'Enter Market Scenario',
  COMPETITIVE_PRODUCTS: 'Enter Competitive Products',
  MARKET_SIZE: 'Enter Market Size',
  MARKET: 'Select Markets',
  REGULATIONS: 'Select Regulations',
  TARGET_GEOGRAPHY: 'Enter Target Geography',
  TARGET_SEGMENT: 'Enter Target Segment',
  TARGET_AUDIENCE: 'Enter Target Audience',
  INITIAL_SUCCESS_FACTOR: 'Enter Initial Success Factor',
  GROWTH_SUSTAINING_FACTOR: 'Enter Growth Sustaining Factor',
  STRATEGIC_MARKETING: 'Enter Strategic Marketing Requirements',
  DEMAND_GENERATIONS: 'Enter Demand Generations for Next Years',
  POTENTIAL_RISK: 'Enter Potential Business Risk',
  SEGMENT: 'Enter segment',
  MAJOR_COMPETITOR: 'Enter Major Competitor',
  SEGMENT_SHARE: 'Enter Segment Share',
  PRICE_RANGE: 'Enter Price Range',
}

export const ERROR_MESSAGES = {
  PRODUCT_NAME: 'Product Generic Name is required',
  INTENDED_USE: 'Initial Intended Use is required',
  APPLICATIONS: 'Applications of Product is required',
  MARKET_SCENARIO: 'Market Scenario is required',
  COMPETITIVE_PRODUCTS: 'Competitive Products is required',
  TARGET_GEOGRAPHY: 'Target Geography is required',
  TARGET_SEGMENT: 'Target Segment is required',
  TARGET_AUDIENCE: 'Target Audience is required',
  FILE_UPLOAD: 'File upload is required',
  MARKET_SEGMENT_PERCENTAGE:
    'Please enter valid Percentage of use in Market Segment',
    MARKET: 'Market is required',
  REGULATIONS: 'Regulation is required',
  MARKET_REGULATION_CONSISTENCY: 'Each selected market must have at least one regulation assigned.',
  SEGMENT: 'Segment is required',
  MAJOR_COMPETITOR: 'Major Competitor is required',
  SEGMENT_SHARE: 'Segment Share is required',
  PRICE_RANGE: 'Price Range is required',
}

export const SECTION_TITLES = {
  HLD: 'HLD',
  MARKET_SEGMENT: 'Market Segment',
  MARKET_DEMOGRAPHY: 'Market Demography to be Addressed',
  REGION: 'Region',
  MARKET_SIZE: 'Market Size',
  COMPETITIVE_LANDSCAPE: 'Competitive Landscape',
  SOLUTION_REQUIREMENTS: 'Solution Requirements',
  BUSINESS_OPPORTUNITY: 'Potential Business Opportunity',
  CONVERSION_RATE: 'Potential Expected Conversion Rate',
}

export const MODAL_TITLES = {
  COMPETITIVE_LANDSCAPE: 'Competitive Landscape',
  SOLUTION_REQUIREMENTS: 'Solution Requirements',
  EDIT_CONVERSION_RATE: 'Edit Conversion Rate',
  ADD_CONVERSION_RATE: 'Add Conversion Rate',
}

export const API_FIELD_KEYS = {
  PROJECT_ID: 'project_id',
  DESIGN_DOCUMENT_TITLE: 'design_document_title',
  PRODUCT_GENERIC_NAME: 'product_generic_name',
  INITIAL_INTENDED_USE: 'initial_intended_use',
  APPLICATIONS_OF_PRODUCT: 'applications_of_product',
  MARKET_SCENARIO: 'market_scenario',
  COMPETITIVE_PRODUCTS: 'competitive_products',
  MARKET:'markets',
  REGULATIONS: 'regulation',
  MARKET_SEGMENT: 'market_segment',
  MARKET_DEMOGRAPHY: 'market_demography',
  MARKET_SIZE: 'market_size',
  COMPETITIVE_LANDSCAPE: 'competitive_landscape',
  DESIGN_REQUIREMENTS: 'design_requirements',
  DESIGN_CONVERSION_RATE: 'design_conversion_rate',
  INITIAL_SUCCESS_FACTOR: 'initial_success_factor',
  GROWTH_SUSTAINING_FACTOR: 'growth_sustaining_factor',
  STRATEGIC_MARKETING_REQUIREMENTS: 'strategic_marketing_requirements',
  DEMAND_GENERATIONS_FOR_NEXT_YEARS: 'demand_generations_for_next_years',
  POTENTIAL_BUSINESS_RISK: 'potential_business_risk',
  TARGET_GEOGRAPHY: 'target_geography',
  TARGET_SEGMENT: 'target_segment',
  TARGET_AUDIENCE: 'target_audience',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
}

export const ALERT_MESSAGES = {
  MARKET_SEGMENT_ERROR: {
    title: 'Something went Wrong!',
    text: 'The total percentage of usage across all market segments must equal exactly 100%.',
    icon: 'error',
    cancelButton: false,
    confirmButton: false,
  },
} as const

export const API_ENDPOINTS = {
  PROJECT_DETAIL_HLD_INFO: 'api/v1/dnd/hld/',
  PROJECT_DETAIL_HLD_MARKET: 'api/v1/dnd/market-segment/all',
  PROJECT_DETAIL_HLD_MARKET_DEMOGRAPHY: 'api/v1/dnd/market-demography/all',
  SUBMIT_PROJECT_HLD: 'api/v1/dnd/hld',
  FETCH_FILE_URL: '/api/v1/dam/assets/download/',
}

export const FIELD_KEYS = {
  CUSTOM_ALERT: 'customAlert',
  COMPETITIVE_PRODUCTS: 'competitiveProducts',
  PRODUCT_NAME: 'productName',
  INTENDED_USE: 'intendedUse',
  APPLICATIONS: 'applications',
  MARKET_SCENARIO: 'marketScenario',
  SPECIAL_CATEGORY: 'specialCategory',
  MARKET_SIZE: 'marketSize',
  TARGET_GEOGRAPHY: 'targetGeography',
  TARGET_SEGMENT: 'targetSegment',
  TARGET_AUDIENCE: 'targetAudience',
  INITIAL_SUCCESS_FACTOR: 'initialSuccessFactor',
  GROWTH_SUSTAINING_FACTOR: 'growthSustainingFactor',
  STRATEGIC_MARKETING: 'strategicMarketing',
  DEMAND_GENERATIONS: 'demandGenerations',
  POTENTIAL_RISK: 'potentialRisk',
   MARKET: 'market_id',
  REGULATIONS: 'regulation_id'
} as const

export const PERCENTAGE = 100
export const PROJECT_LIST_SCREEN_URL = '/dnd/project'

export const MENU_NAME = 'HLD'

// market and regulations
export const MARKET = 'market'
export const REGULATIONS = 'regulations'

export const FIELD_VALUES = {
  MARKET: 'market_name',
  REGULATIONS: 'regulation'
} as const
export const FIELD_NAME ={
  TARGET: 'target_customer_segment',
  CONVO_1: 'conversion_1',
  CONVO_2: 'conversion_2',
  CONVO_3: 'conversion_3',
}
export const VALID_TEXT = 'Please enter a valid number'
export const VALIDATION = {
  TARGET: 'Number of Target Customers Per Each Segment is required',
  CONVO_1: 'Conversion Year 1 is required',
  CONVO_2: 'Conversion Year 2 is required',
  CONVO_3: 'Conversion Year 3 is required',
}
export const NUMBER_TYPE = 'number'

export const FIELD_ORDER = [
  'productName',
  'intendedUse', 
  'applications',
  'marketScenario',
  'markets',
  'regulations',
  'competitiveProducts',
  'targetGeography',
  'targetSegment',
  'targetAudience',
]

export const FIELD_IDS = {
  COMPETITIVE_PRODUCTS: 'competitive_products',
}