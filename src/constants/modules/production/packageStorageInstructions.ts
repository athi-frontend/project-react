import { NUMBERMAP } from "@/constants/common"

/**
 * Classification: Confidential
 * Package Storage Instructions Constants
 */

const BASE_API_PATH = 'api/v1/production'

export const API_URLS = {
  STORAGE_TYPE: {
    ALL: `/${BASE_API_PATH}/storage-type/all`,
  },
  PACKAGING_STORAGE_INSTRUCTION: {
    FETCH_BY_ID: (id: string | number, project_id: string | number) =>
      `/${BASE_API_PATH}/packaging-storage-instruction/project/${project_id}?model_id=${id}`,
    POST: `/${BASE_API_PATH}/packaging-storage-instruction/`,
  },
}


export const PACKAGE_STORAGE_INSTRUCTIONS_COLUMNS = [
  {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF,
  },
  {
      field: 'part_number',
      headerName: 'Part Number',
      flex: NUMBERMAP.ONE,
  },
  {
      field: 'part_name',
      headerName: 'Part Name',
      flex: NUMBERMAP.ONE,
  }
]


export const PACKAGE_STORAGE_INSTRUCTIONS = {
  PAGE_TITLE: 'Package Storage Instructions',

  FORM_FIELDS: {
  PROJECT_ID: 'project_id',
  MODEL_ID: 'model_id',
  STORAGE_TYPE_ID: 'storage_type_id',
  IS_DISMANTLE_DURING_PACKING: 'is_dismantle_during_packing',
  IS_ASSEMBLE_COMPLETE_UNIT: 'is_assemble_complete_unit',
  SPECIFIC_INSTRUCTION: 'specific_instruction',
  REMARKS: 'remarks',
  PACKAGING_MATERIALS_REQUIRED: 'packaging_materials_required',
  PACKAGING_INSTRUCTION_SUPPORTING_FILE_DOCUMENTS: 'packaging_instruction_supporting_file_documents',
  STORAGE_INSTRUCTION_SUPPORTING_FILE_DOCUMENTS: 'storage_instruction_supporting_file_documents',
  },
  FORM_LABELS: {
    MODEL: 'Model*',
    STORAGE_TYPE: 'Storage*',
    IS_DISMANTLE_DURING_PACKING: 'Dismantle During Packing',
    IS_ASSEMBLE_COMPLETE_UNIT: 'Assemble as Complete Unit',
    SPECIFIC_INSTRUCTION: 'Any Specific Instruction',
    REMARKS: 'Remarks',
    PACKAGING_INSTRUCTIONS: 'Package Instruction',
    STORAGE_INSTRUCTIONS: ' Storage Instruction',
  },
  FORM_PLACEHOLDERS: {
    MODEL: 'Select Model',
    STORAGE_TYPE_MODEL: 'Select Storage',
    IS_DISMANTLE_DURING_PACKING: 'Is Dismantle During Packing',
    IS_ASSEMBLE_COMPLETE_UNIT: 'Is Assemble Complete Unit',
    SPECIFIC_INSTRUCTION: 'Specific Instruction',
    REMARKS: 'Remarks',
  },
  FORM_ERRORS: {
    MODEL: 'Model is required',
    STORAGE_TYPE: 'Storage is required',
    IS_DISMANTLE_DURING_PACKING: 'Dismantle During Packing is required',
    IS_ASSEMBLE_COMPLETE_UNIT: 'Assemble as Complete Unit is required',
    RADIO_REQUIRED: 'At least one radio value must be selected based on storage type',
    FILE_PROPERTIES_REQUIRED: 'File Upload is required',
    PACKAGING_INSTRUCTION_FILE_REQUIRED: 'Package Instruction file upload is required',
    STORAGE_INSTRUCTION_FILE_REQUIRED: 'Storage Instruction file upload is required',
    SPECIFIC_INSTRUCTION: 'Specific Instruction is required',
    REMARKS: 'Remarks is required',
  },
  KEY_FIELDS: { 
    ID: 'id',
    MODEL_ID: 'model_id',
    STORAGE_TYPE_ID: 'storage_type_id',
    IS_DISMANTLE_DURING_PACKING: 'is_dismantle_during_packing',
    IS_ASSEMBLE_COMPLETE_UNIT: 'is_assemble_complete_unit',
    SPECIFIC_INSTRUCTION: 'specific_instruction',
    REMARKS: 'remarks',
    PACKAGING_MATERIALS_REQUIRED: 'packaging_materials_required',
    PACKAGING_INSTRUCTION_SUPPORTING_FILE_DOCUMENTS: 'packaging_instruction_supporting_file_documents',
    STORAGE_INSTRUCTION_SUPPORTING_FILE_DOCUMENTS: 'storage_instruction_supporting_file_documents',
  },
  VALUE_FIELDS: {
    MODEL: 'model_name',
    STORAGE_TYPE: 'storage_type',
    IS_DISMANTLE_DURING_PACKING: 'is_dismantle_during_packing',
    IS_ASSEMBLE_COMPLETE_UNIT: 'is_assemble_complete_unit',
    SPECIFIC_INSTRUCTION: 'specific_instruction',
    REMARKS: 'remarks',
},
TABLE_NAME :{
 PACKAGE_TABLE_NAME : 'Package Materials Required',
},


}


export const INITIAL_FORM_DATA = {
  model_id: null,
  storage_type_id: '',
  is_dismantle_during_packing: null,
  is_assemble_complete_unit: null,
  specific_instruction: '',
  remarks: '',
  packaging_materials_required: [],
  packaging_instruction_supporting_file_documents: [],
  storage_instruction_supporting_file_documents: [],
}
