/**
 * Classification: Confidential
 * Production Module Common Constants
 */

const BASE_API_PATH = 'api/v1/production';
const BASE_ORGANIZATION_API_PATH = 'api/v1/organization';

export const API_ENDPOINTS = {
  // Inventory Detail endpoints
  INVENTORY_DETAIL_UPSERT: `${BASE_API_PATH}/inventory-detail`,
  INVENTORY_DETAIL_LIST: (assemblyPartItemId: number) => `${BASE_API_PATH}/inventory-detail/${assemblyPartItemId}`,
  
  // IQA Exclusion endpoints
  IQA_EXCLUSION_UPSERT: `${BASE_API_PATH}/iqa-exclusion`,
  IQA_EXCLUSION_LIST: (assemblyPartItemDetailId: number) => `${BASE_API_PATH}/iqa-exclusion/${assemblyPartItemDetailId}`,
  
  // Serial Batch Number endpoints
  SERIAL_BATCH_UPSERT: `${BASE_API_PATH}/serial-batch`,
  SERIAL_BATCH_LIST: (partAssemblyDetailId: number) => `${BASE_API_PATH}/serial-batch/${partAssemblyDetailId}`,
  
  // Storage Environment endpoints
  STORAGE_ENVIRONMENT_UPSERT: `${BASE_API_PATH}/storage-environment`,
  STORAGE_ENVIRONMENT_LIST: (assemblyPartItemDetailId: number) => `${BASE_API_PATH}/storage-environment/${assemblyPartItemDetailId}`,
  
  // Electrical Drawing endpoints (also used for Assembly Drawing)
  ELECTRICAL_DRAWING_UPSERT: `${BASE_API_PATH}/assembly-drawing`,
  ELECTRICAL_DRAWING_LIST: (assemblyPartItemDetailId: number) => `${BASE_API_PATH}/assembly-drawing/all?applicable_settings_id=${assemblyPartItemDetailId}`,
  ELECTRICAL_DRAWING_FETCH_ALL: `${BASE_API_PATH}/assembly-drawing/all`,
  ELECTRICAL_DRAWING_BY_ID: (drawingId: number) => `${BASE_API_PATH}/assembly-drawing/${drawingId}`,
  ELECTRICAL_DRAWING_FETCH_BY_ID: (drawingId: number) => `${BASE_API_PATH}/assembly-drawing/${drawingId}`,
  ELECTRICAL_DRAWING_DELETE: (drawingId: number) => `${BASE_API_PATH}/assembly-drawing/${drawingId}`,
  
  // Shelf Life endpoints
  SHELF_LIFE_UPSERT: `${BASE_API_PATH}/shelf-life`,
  SHELF_LIFE_LIST: (assemblyPartItemDetailId: number) => `${BASE_API_PATH}/shelf-life/${assemblyPartItemDetailId}`,
  NON_CONFORMED_LOCATION_ALL: `${BASE_API_PATH}/non-conformed-location/all`,
  
  // Unit dropdown endpoint
  UNIT_ALL: `${BASE_ORGANIZATION_API_PATH}/unit/all`,
  
  // Assembly Work Instruction endpoints
  ASSEMBLY_WORK_INSTRUCTION_UPSERT: `${BASE_API_PATH}/assembly-work-instruction`,
  ASSEMBLY_WORK_INSTRUCTION_FETCH_BY_ID: (assemblyPartItemDetailId: number) => `${BASE_API_PATH}/assembly-work-instruction/${assemblyPartItemDetailId}`,
  
  // Jigs Type dropdown endpoint
  JIGS_TYPE_ALL: `${BASE_API_PATH}/jigs-type/all`,
  
  // Bill of Material endpoints
  BILL_OF_MATERIAL_ALL: (projectId: number) => `${BASE_API_PATH}/bill-of-material/all?project_id=${projectId}`,
  // Bill of Material Settings endpoint
  BILL_OF_MATERIAL_SETTINGS: (partItemDetailId: number) => `${BASE_API_PATH}/bill-of-material-settings/${partItemDetailId}`,
  JIGS_FIXTURE_REPORT : `${BASE_API_PATH}/jig-fixtures-validation-report`
};

export const QUERY_KEYS = {
  INVENTORY_DETAIL_LIST: 'inventoryDetailList',
  INVENTORY_DETAIL_UPSERT: 'inventoryDetailUpsert',
  IQA_EXCLUSION_LIST: 'iqaExclusionList',
  IQA_EXCLUSION_UPSERT: 'iqaExclusionUpsert',
  SERIAL_BATCH_LIST: 'serialBatchList',
  SERIAL_BATCH_UPSERT: 'serialBatchUpsert',
  STORAGE_ENVIRONMENT_LIST: 'storageEnvironmentList',
  STORAGE_ENVIRONMENT_UPSERT: 'storageEnvironmentUpsert',
  ELECTRICAL_DRAWING_LIST: 'electricalDrawingList',
  ELECTRICAL_DRAWING_FETCH_BY_ID: 'electricalDrawingFetchById',
  ELECTRICAL_DRAWING_UPSERT: 'electricalDrawingUpsert',
  SHELF_LIFE_LIST: 'shelfLifeList',
  SHELF_LIFE_UPSERT: 'shelfLifeUpsert',
  NON_CONFORMED_LOCATION_ALL: 'nonConformedLocationAll',
  UNIT_ALL: 'unitAll',
  ASSEMBLY_WORK_INSTRUCTION_UPSERT: 'assemblyWorkInstructionUpsert',
  ASSEMBLY_WORK_INSTRUCTION_FETCH_BY_ID: 'assemblyWorkInstructionFetchById',
  JIGS_TYPE_ALL: 'jigsTypeAll',
    JIGS_TYPE: 'jigs-type',

};


export const DOCUMENT_UPLOAD_CONSTANTS = {
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
}

  export const STEPS = {
    ASSEMBLY_SETTING_WORK:'Assembly Work Instruction',
    PART_ASSEMBLY_DRAWINGS:'Part/ Assembly drawing',
    JIGS_AND_FIXTURE_VALIDATION_REPORT:'Jigs and Fixture Validation Report',
    SHELF_LIFE:'Shelf-Life',
    ELECTRICAL_DRAWINGS:'Electrical Drawings',
    ITEM_EXCLUDED_FROM_IQA_WITH_JUSTIFICATIONS:'Items excluded from IQA with justifications',
    SERIAL_BATCH_NUMBER:'Serial / Batch Number',
    INVENTORY_DETAILS:'Inventory Detail',
    STORAGE_AND_ENVIRONMENT_DETAILS:'Storage and Environment',
    INCOMING_INSPECTION:'Incoming Inspection Criteria',
  }
