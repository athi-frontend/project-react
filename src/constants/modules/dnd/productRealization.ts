export const POSTPRODUCT = 'postProduct'
export const API_ENDPOINTS ={
    POST_PRODUCT_API: 'api/v1/dnd/product-realization-plan/',
    GET_PRODUCT: (project_id: number) =>
    `api/v1/dnd/product-realization-plan/${project_id}`,
}
export const PROJECT_ID ='project_id'
export const FIELD_IS_REQUIRED = {
     PRODUCT_REALIZATION: 'Product Realization Decision Document Reference is required', 
    SEQUENCE_OF_PROCESS: 'Sequence of Process is required',
    RESOURCE:'Resource Competency Plan is required',
    INFRASTRUCTURE_PLAN:'Infrastructure Plan is required',
    ENVIRONMENTAL_CLEANLINESS: 'Environmental Cleanliness and Safety Plan is required',
    STAGE_GRID: 'Stages of Product Realization with Sequence of Processes is required',
    PRODUCT_QUALITY_OBJ: 'Product Quality Objective is required',
    PROCESS_MEASUREMENT_PLAN: 'Process Measurement Plan is required',
    PRODUCT_DISPOSITION: 'Product Disposition Method is required',
    QUALITY_OBJECTIVE:'Quality Objective is required',
    MEASURE:'Measure of Objective is required',
    STAGE: 'Stage is required',
    SCHEDULE:'Schedule is required',
    RESPONSIBILITY:'Responsibility is required'
}
export const PATH_TO_FEASIBILITY = (projectId:number)=> `/project-details/feasibility-study/${projectId}`
export const TITLE ='Product Realization Plan'
export const LABEL ={
    PRODUCT_REALIZATION: 'Product Realization Decision Document Reference*', 
    SEQUENCE_OF_PROCESS: 'Sequence of Process*',
    RESOURCE:'Resource Competency Plan*',
    INFRASTRUCTURE_PLAN:'Infrastructure Plan*',
    ENVIRONMENTAL_CLEANLINESS: 'Environmental Cleanliness and Safety Plan*',
    PROCESS_MEASUREMENT_PLAN: 'Process Measurement Plan*',
    PRODUCT_DISPOSITION: 'Product Disposition Method*',
    QUALITY_OBJECTIVE:'Quality Objective*',
    MEASURE:'Measure of Objective*',
    STAGE: 'Stage*',
    SCHEDULE:'Schedule*',
    RESPONSIBILITY:'Responsibility*'
}
export const ONCHANGE_VALUE = {
    PRODUCT_REALIZATION:'productRealization',
    SEQUENCE_OF_PROCESS: 'sequenceOfProcess',
    RESOURCE:'resourceCompetencyPlan',
    INFRASTRUCTURE_PLAN:'infrastructurePlan',
    ENVIRONMENTAL_CLEANLINESS:'environmentalPlan',
    PROCESS_MEASUREMENT_PLAN:'processMeasurementPlan',
    PRODUCT_DISPOSITION:'productDispositionMethod',
    QUALITY_OBJECTIVE:'quality_objective',
    MEASURE:'measure_of_objective',
    STAGE:'stage',
    SCHEDULE:'schedule',
    RESPONSIBILITY:'responsibility',
 
}
export const PLACEHOLDER = {
    PRODUCT_REALIZATION:'Enter Product Realization Decision Document Reference',
    INPUT_TEXT: 'Input Text',
    STAGE:'Enter Stage',
    SCHEDULE:'MM-YYYY',
    QUALITY_OBJECTIVE:'Enter Quality Objective',
    MEASURE:'Enter Measure of Objective',
    RESPONSIBILITY:'Enter Responsibility',
    SEQUENCE_OF_PROCESS: 'Enter Sequence of Process',
    RESOURCE:'Enter Resource Competency Plan',
    INFRASTRUCTURE_PLAN:'Enter Infrastructure Plan',
    ENVIRONMENTAL_CLEANLINESS: 'Enter Environmental Cleanliness and Safety Plan',
    PROCESS_MEASUREMENT_PLAN: 'Enter Process Measurement Plan',
    PRODUCT_DISPOSITION: 'Enter Product Disposition Method',
}
export const PRODUCT_QUALITY_TITLE='Product Quality Objective'
export const STAGE_TITLE ='Stages of Product Realization with Sequence of Processes'
export const FIELD_COLUMN ={
    SNO:'sno',
    QUALITY_OBJ: 'quality_objective',
    MEASURE: 'measure_of_objective',
    ACTION: 'action',
    STAGE: 'stage',
    SCHEDULE:'schedule',
    RESPONSIBILITY: 'responsibility'
}
export const FIELD_VALUE ={
    SNO:'S.No',
    QUALITY_OBJ: 'Quality Objective',
    MEASURE: 'Measure of Objective',
    ACTION: 'Action',
    STAGE: 'Stages',
    SCHEDULE:'Schedule',
    RESPONSIBILITY: 'Responsibility'
}
export const SAVE = 'Save'
export const CANCEL ='Cancel'

export const ALERT_ACTIONS = {
    CUSTOM_ALERT : 'customAlert',
    TITLE : 'Something went wrong',
    DUPLICATE_PRODUCT_TEXT : 'Entered Duplicate Record for Product Quality Objective',
    DUPLICATE_STAGES_TEXT : 'Entered Duplicate Record for Stages of Product Realization',
    ERROR : 'error'
}


export const FIELD_IDS = {
  QUALITY_OBJECTIVES: 'product-quality-objective',
  STAGES: 'stages-of-product-realization'
}

export const FIELD_LABEL_MAP = {
  productRealization: LABEL.PRODUCT_REALIZATION,
  qualityObjectives: FIELD_IDS.QUALITY_OBJECTIVES,
  stages: FIELD_IDS.STAGES,
  sequenceOfProcess: LABEL.SEQUENCE_OF_PROCESS,
  resourceCompetencyPlan: LABEL.RESOURCE,
  infrastructurePlan: LABEL.INFRASTRUCTURE_PLAN,
  environmentalPlan: LABEL.ENVIRONMENTAL_CLEANLINESS,
  processMeasurementPlan: LABEL.PROCESS_MEASUREMENT_PLAN,
  productDispositionMethod: LABEL.PRODUCT_DISPOSITION
}

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)

export const VALIDATION_VALUES = {
  HAS_DATA: 'hasData',
  EMPTY: ''
}

export const SCHEDULE_DATE_FORMAT = 'MM-yyyy'