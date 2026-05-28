import { GridColDef } from "@mui/x-data-grid";
/**
    Classification : Confidential
**/
export const API_ENDPOINTS = {
  GET_PLANT_MASTER: 'api/v1/regulation/plant-master'
} as const

export const FIELD_NAMES = {
  COMPANY_PROFILE: 'company_profile',
  FACILITY_PROFILE: 'facility_profile',
  MANUFACTURING_ACTIVITY: 'manufacturing_activity',
  OTHER_MANUFACTURING_ACTIVITY: 'other_manufacturing_activity',
  EXACT_ADDRESS: 'exact_address',
  PRODUCT_MANUFACTURED_TYPE: 'product_manufactured_type',
  SITE_SHORT_DESCRIPTION: 'site_short_description',
  OUTSIDE_TECH_ASSISTANCE: 'outside_tech_assistance',
  QMS_SHORT_DESCRIPTION: 'qms_short_description',
} as const


 export const TOOLBAR = {items:[
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'imageUpload',
    'outdent',
    'indent',
    '|',
    'blockQuote',
    'insertTable',
    'undo',
    'redo',
  ]}

export const FIELD_LABELS = {
  NAME_OF_FIRM: 'Name of the firm',
  ADDRESS: 'Address',
  COMPANY_PROFILE: 'Profile of the company',
  FACILITY_PROFILE: 'Profile of the Facility',
  MANUFACTURING_ACTIVITY: 'Manufacturing Activity',
  OTHER_MANUFACTURING_ACTIVITY: 'Any Other Manufacturing Activity if carried out at the Site',
  EXACT_ADDRESS: 'Exact Address of the Site including Telephone, Fax Numbers',
  PRODUCT_MANUFACTURED_TYPE: 'Type of Products Manufactured on the Site',
  SITE_SHORT_DESCRIPTION: 'Short Description of the Site',
  OUTSIDE_TECH_ASSISTANCE: 'Use of Outside Technical Assistance in the Design, Manufacture and Testing',
  QMS_SHORT_DESCRIPTION: 'Short Description of the Quality Management System of the Firm Responsible for Manufacture',
} as const

export const FIELD_PLACEHOLDERS = {
  INPUT_TEXT: 'Input Text',
} as const

export const DEPARTMENT_TABLE_COLUMNS = [
  { field: 'sno', headerName: 'S.No.', flex: 1 },
  { field: 'department', headerName: 'Department', flex: 1.5 },
  { field: 'noOfEffectivePersonnel', headerName: 'No. of Effective Personnel', flex: 1},
] as GridColDef[];

export const INFO_TEXT = {
  QMS_DESCRIPTION: 'Quality is the first important factor that our system is concerned. We are always quality conscious and no compromise with the quality. Starting from the receipt of the materials like, raw material and packing material and equipment etc., till the dispatch of the finished',
} as const

export const SECTION_TITLES = {
  GENERAL_INFORMATION: 'General Information',
  BRIEF_INFORMATION: 'Brief information of the site',
  DEPARTMENT_TABLE: 'Department Information',
} as const