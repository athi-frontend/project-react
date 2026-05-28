/**
    Classification : Confidential
**/
export const QUERY_KEYS: Record<string, Record<string, string>> = {
  HLD: {
    LIST: '',
    FETCH_BY_ID: 'projectDetailHLDInfo',
  },
  FEASIBILITY_STUDY: {
    LIST: '',
    FETCH_BY_ID: 'feasibilityStudy',
  },
  Project: {
    FETCH_BY_ID: 'projectInfo',
  },
  'PND Review': {
    FETCH_BY_ID: 'pndReviewFetch',
  },
  'Product Realization Plan': {
    FETCH_BY_ID: 'project_id',
  },
  'Market research and study': {
    FETCH_BY_ID: 'market-research-list',
  },
  PND: {
    FETCH_BY_ID: 'pndFetch',
  },
  'Design Project Plan': {
    FETCH_BY_ID: 'projectPlan',
  },
  'Project Plan': {
    FETCH_BY_ID: 'projectPlan',
  },
  'Applicable specification': {
    FETCH_BY_ID: 'specifications',
  },
  'Functional Block': {
    FETCH_BY_ID: 'functionalBlocks',
  },
  DIR: {
    FETCH_BY_ID: 'dir',
    FETCH_LIST: 'dirList',
  },
  'Intended Use': {
    FETCH_BY_ID: 'intendedUse',
  },
  'QMS Clause Applicability': {
    FETCH_BY_ID: 'appliability',
  },
  'I/O Traceability Matrix': {
    FETCH_BY_ID: 'traceability-matrix-fetch',
  },
  DEVICE_DESCRIPTION: {
    FETCH_BY_ID: 'deviceDescription',
    FETCH_SPECIFICATION_ASPECTS: 'specificationAspects',
  },
  GENERAL_INFORMATION: {
    FETCH_BY_ID: 'generalInformation',
    EMPLOYEES_ENGAGED: 'employeesEngaged',
  },
  'CANDIDATE EVALUATION': {
    FETCH_BY_ID: 'candidate_evaluation',
  },
  'EMPLOYEE ONBOARDING': {
    FETCH_BY_ID: 'employee_by_id',
  },
  'RESOURCE REQUISITION': {
    FETCH_BY_ID: 'recruitment',
  },
  'clinical evaluation': {
    FETCH_BY_ID: 'clinical-evaluation',
  },
  'Design input adequacy checklist': {
    FETCH_BY_ID: 'adequacy',
  },
  'design Quality plan': {
    FETCH_BY_ID: 'fetchDesignQuality',
  },
  concept:{
    FETCH_BY_ID:'fetchConcepts'
  },
  prototype:{
    FETCH_BY_ID:'prototypeData'
  },
  'prototype verification plan':{
    FETCH_BY_ID:'verificationPlans',
    FETCH_LIST: 'verificationPlan'
  },
  'prototype verification report':{
    FETCH_BY_ID:'report'
  },
  'prototype design Review report':{
    FETCH_BY_ID:'fetchActions'
  },
  'initiate test license':{
    FETCH_BY_ID:'license_type'
  },
  'Pilot':{
    FETCH_BY_ID:'prototypeData'
  },
  'pilot verification plan':{
    FETCH_BY_ID:'verificationPlans',
    FETCH_LIST: 'verificationPlan'
  },
  'pilot verification report':{
    FETCH_BY_ID:'report'
  },
  'pilot design Review report':{
    FETCH_BY_ID:'fetchActions'
  },
  'pilot Validation Plan':{
    FETCH_BY_ID:'uatValidation',
  },
  'Pilot validation Report':{
    FETCH_BY_ID:'validationReport'
  },
  'Product Life Declaration':{
    FETCH_BY_ID:'fetchProductDeclaration'
  },
  'Add Installation Procedure':{
    FETCH_BY_ID:'fetchInstallationList'
  },
  'Design Output Document':{
    FETCH_BY_ID:'Fetch_Design_Output_Document'
  },
  'Acknowledgement of design Transfer':{
    FETCH_BY_ID:'acknowledgement'
  },
  ORDER_ACKNOWLEDGEMENT: {
    FETCH_ALL: 'order-acknowledgement-all',
    FETCH_BY_ID: 'order-acknowledgement-by-id',
    UPSERT: 'order-acknowledgement-upsert',
    DELETE: 'order-acknowledgement-delete',
  },
  ORDER_APPROVAL_MODE: {
    FETCH_ALL: 'order-approval-mode-all',
  },
  QUOTATION: {
    FETCH_ALL: 'quotation-all',
    FETCH_BY_ID: 'quotation-by-id',
    UPSERT: 'quotation-upsert',
    DELETE: 'quotation-delete',
    CUSTOMERS: 'quotation-customers',
    MODELS: 'quotation-models',
  },
  NON_CONFORMANCE_DETAILS: {
    FETCH_ALL: 'non-conformance-details-all',
    FETCH_BY_ID: 'non-conformance-details-by-id',
  },
  CUSTOMER_FEEDBACK_CRITERIA: {
    FETCH_ALL: 'customer-feedback-criteria-all',
    FETCH_BY_ID: 'customer-feedback-criteria-by-id',
    DELETE: 'customer-feedback-criteria-delete',
    PRODUCT_ALL: 'customer-feedback-criteria-product-all',
  },
  DELIVERY_DISPATCH: {
    FETCH_ALL: 'delivery-dispatch-all',
    FETCH_BY_ID: 'delivery-dispatch-by-id',
    UPSERT: 'delivery-dispatch-upsert',
    DELETE: 'delivery-dispatch-delete',
  },
  BOM: {
    BILL_OF_MATERIAL: 'bill-of-material',
    BOM_UPLOAD_LIST: 'bom-upload-list',
    BOM_UPLOAD_DETAIL: 'bom-upload-detail',
    MODELS: 'models',
    BOM_VERSIONS: 'bom-versions',
    ORGANIZATION_UNITS: 'organization-units',
    ORGANIZATION_SITES: 'organization-sites',
    ASSEMBLY_TYPES: 'assembly-types',
    BOM_PART: 'bom-part',
    FETCH_ALL: 'bill-of-materials-all',
  },
}


export const REGULATION_QUERY_KEYS = {
  TEST_LICENSE_CHECKLIST: {
    FETCH_BY_ID: 'test-license-checklist',
  },
  ADD_TEST_LICENSE: {
    FETCH_BY_ID: 'add-test-license',
    FETCH_TEST_LICENSE_FILES: 'add-test-license-files',
  },
  ADD_MANUFACTURING_LICENSE: 'add-manufacturing-license',
  MEDICAL_DEVICE: {
    FETCH_BY_ID: 'medicalDeviceComplaints',
  },
  ESSENTIAL_PRINCIPLES_CHECKLIST: {
    LIST: 'essentialPrinciplesChecklistList',
    FETCH_BY_ID: 'essentialPrinciplesChecklistById',
  },
  EQUIPMENT: {
    FETCH_BY_ID: 'fetchEquipment',
  },
  PERSONNEL: {
    FETCH_BY_ID: 'fetchPersonnel',
  },
  EXECUTIVE_SUMMARY: {
    FETCH_BY_ID: 'executive-summary',
  },
}

export const RISK_MANAGEMENT_QUERY_KEYS = {
  PROBABILITY_LEVELS: {
    LIST: 'probability-levels-list',
    FETCH_BY_ID: 'probability-level-by-id',
  },
  SEVERITY_LEVELS: {
    LIST: 'severity-levels-list',
    FETCH_BY_ID: 'severity-level-by-id',
  },
  APPLICABILITY: {
    LIST: 'applicability-all',
    UPSERT: 'applicability-upsert',
  },
  RISK_ANALYSIS_CONTROL: {
    FETCH_CATEGORIES: 'riskAnalysisControlCategories',
    FETCH_SUBCATEGORIES: 'riskAnalysisControlSubcategories',
    UPSERT_CATEGORY: 'riskAnalysisControlUpsert',
  },
  PRODUCTION_POST_PRODUCTION_INFO: {
    FETCH_BY_ID: 'production-post-production-fetch',
    UPSERT: 'production-post-production-save',
  },
  HAZARD: {
    FETCH_ALL: 'fetchAllHazards',
    FETCH_BY_ID: 'fetchHazardById',
    UPSERT: 'upsertHazard',
    DELETE: 'deleteHazard',
  },
  RISK: {
    FETCH_BY_ID: 'fetchRiskById',
    UPSERT: 'upsertRisk',
    DELETE: 'deleteRisk',
  },
  RCM: {
    FETCH_BY_ID: 'fetchRCMById',
    UPSERT: 'upsertRCM',
    DELETE: 'deleteRCM',
  },
  REFERENCE_RCM: {
    FETCH_ALL: 'fetchReferenceRCM',
  },
  HAZARD_IDENTIFICATION_TOOL: {
    DROPDOWN: 'hazard-identification-tool-dropdown',
    FETCH_BY_PROJECT: 'hazard-identification-tool-by-project',
    UPSERT: 'hazard-identification-tool-upsert',
  },
  HAZARD_IDENTIFICATION_USED: {
    LIST: 'hazardIdentificationUsedList',
    FETCH_BY_TOOL_MAPPER_ID: 'hazardIdentificationUsed',
  },
  HARMS: {
    FETCH_ALL: 'fetchAllHarms',
  },
  DROPDOWN_OPTIONS: {
    FETCH_PROBABILITY_LEVELS: 'fetchProbabilityLevels',
    FETCH_SEVERITY_LEVELS: 'fetchSeverityLevels',
    FETCH_RISK_IDENTIFICATION_METHODS: 'fetchRiskIdentificationMethods',
    FETCH_RCM_TYPES: 'fetchRCMTypes',
    FETCH_RISK_ACCEPTABILITY: 'fetchRiskAcceptability',
  },
  RISK_TEAM: {
    LIST: 'getRiskTeam',
  },
  APPLICABILITY_STAGES: {
    LIST: 'getStages',
  },
  RISK_ASSESSMENT_MATRIX: {
    LIST: 'getRiskMatrix',
    POST: 'postRiskMatrix',
  },
  RISK_REVIEW_REQUIREMENT: {
    LIST: 'risk-review-requirement-all',
    UPSERT: 'risk-review-requirement-upsert',
  },
  COMMITTEE: {
    LIST: 'committee-list',
    FETCH_BY_ID: 'committee-fetch-by-id',
    UPSERT: 'committee-upsert',
    DELETE: 'committee-delete',
    ROLES: 'committee-roles',
    EMPLOYEES: 'committee-employees',
    STATUS: 'committee-status',
  },
  OTHER_HAZARDS: {
    LIST: 'other-hazards-list',
    FETCH_BY_ID: 'other-hazard-by-id',
  },
  MITIGATION_MATRIX: {
    BEFORE_MITIGATION: 'before-mitigation-matrix',
    AFTER_MITIGATION: 'after-mitigation-matrix',
    RISK_DETAILS: 'risk-details-by-id',
    AFTER_MITIGATION_RISK_DETAILS: 'after-mitigation-risk-details-by-id',
  },
  RISK_REVIEW: {
    FETCH_ALL: 'risk-review-all',
    FETCH_BY_ID: 'risk-review-by-id',
    FETCH_SUMMARY: 'risk-review-summary',
    UPSERT: 'risk-review-upsert',
  },
  RISK_REVIEW_REPORT_SUMMARY: {
    FETCH_BY_PROJECT_ID: 'risk-review-report-summary-by-project-id',
  },
  INDIVIDUAL_RISK_ANALYSIS: {
    LIST: 'individualRiskAnalysisList',
    FETCH_BY_ID: 'individualRiskAnalysisById',
  },
}

export const PURCHASE_QUERY_KEYS = {
  SANITY_CHECK_INSPECTION: {
    LIST: 'sanity-check-inspection-list',
    FETCH_BY_ID: 'sanity-check-inspection-fetch-by-id',
    UPSERT: 'sanity-check-inspection-upsert',
    DELETE: 'sanity-check-inspection-delete',
    PURCHASE_ORDERS: 'sanity-check-inspection-purchase-orders',
    PURCHASE_ORDER_DETAILS: 'sanity-check-inspection-purchase-order-details',
    PART_DETAILS: 'sanity-check-inspection-part-details',
    SPECIFICATION_CHECKLIST: 'sanity-check-inspection-specification-checklist',
  },
}