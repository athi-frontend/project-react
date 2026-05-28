export const CONFORMITY_API_BASE = '/api/v1/regulation/conformity';

export const CONFORMITY_API_ENDPOINTS = {
  GET_CONFORMITY: (id: number | string) => `${CONFORMITY_API_BASE}/${id}`,
  UPSERT_CONFORMITY: CONFORMITY_API_BASE,
};

export const REGULATION_CONFORMITY_QUERY_KEY = 'regulation_conformity';

export interface DeclarationConformityFormData {
  manufacturer_name: string;
  product_generic_name: string;
  manufacture_contact_details: string;
  manufacture_trade_name: string;
  product_brand_name: string;
  model_name: string;
  product_code: string;
  product_catalogue_number: string;
  product_intended_use: string;
  basic_udi_di: string;
  regulation_conformity: boolean;
  product_classification: string;
  conformity_assessment_route: string;
  general_applicable_directives: string;
  notified_body_name: string;
  appliable_common_specification: string;
  applied_standard: string;
  notified_body_number: string;
  competent_authority: string;
  authorized_representative: string;
  place: string;
  conformity_declaration_date: string;
}

export interface FormErrors {
  manufacture_contact_details: string;
  manufacture_trade_name: string;
  product_brand_name: string;
  product_code: string;
  product_catalogue_number: string;
  conformity_assessment_route: string;
  regulation_conformity: string;
  general_applicable_directives: string;
  notified_body_name: string;
  appliable_common_specification: string;
  applied_standard: string;
  notified_body_number: string;
  competent_authority: string;
  authorized_representative: string;
  place: string;
  conformity_declaration_date: string;
}

export const INITIAL_DECLARATION_CONFORMITY_FORM_DATA = {
  manufacturer_name: "-",
  product_generic_name: "-",
  manufacture_contact_details: "",
  manufacture_trade_name: "",
  product_brand_name: "",
  model_name: "-",
  product_code: "",
  product_catalogue_number: "",
  product_intended_use: "-",
  basic_udi_di: "-",
  regulation_conformity: 0,
  product_classification: "-",
  conformity_assessment_route: "",
  general_applicable_directives: "",
  notified_body_name: "",
  appliable_common_specification: "",
  applied_standard: "",
  notified_body_number: "",
  competent_authority: "",
  authorized_representative: "",
  place: "",
  conformity_declaration_date: ""
};

export const DECLARATION_CONFORMITY_FORM_ERRORS = {
  MANUFACTURER_ADDRESS_ERROR: 'Address of the Manufacturer and Contact Details is required',
  TRADE_NAME_MANUFACTURER_ERROR: 'Trade Name of Manufacturer is required',
  PRODUCT_BRAND_NAME_ERROR: 'Product Brand Name is required',
  PRODUCT_CODE_ERROR: 'Product Code or Project Code is required',
  PRODUCT_CATALOGUE_NUMBER_ERROR: 'Product Catalogue Number is required',
  CONFORMITY_REGULATION_ERROR: 'Conformity to Regulation must be confirmed',
  CONFORMITY_ASSESSMENT_ROUTE_ERROR: 'Conformity Assessment Route is required',
  GENERAL_APPLICABLE_DIRECTIVES_ERROR: 'General Applicable Directives is required',
  NOTIFIED_BODY_NAME_ERROR: 'Name of the Notified Body is required',
  APPLICABLE_COMMON_SPECIFICATION_ERROR: 'Applicable Common Specification is required',
  APPLIED_STANDARDS_ERROR: 'Applied Standards under this declaration of Conformity is required',
  NOTIFIED_BODY_NUMBER_ERROR: 'Notified Body Number is required',
  COMPETENT_AUTHORITY_ERROR: 'Competent Authority is required',
  AUTHORIZED_REPRESENTATIVE_ERROR: 'Authorized Representative is required',
  PLACE_ERROR: 'Place is required',
  DATE_ERROR: 'Date is required',
};

// Declaration of Conformity Form UI Strings
export const DECLARATION_CONFORMITY_LABELS = {
  PAGE_TITLE: "Declaration of Conformity",
  NAME_OF_MANUFACTURER: "Name of Manufacturer",
  PRODUCT_GENERIC_NAME: "Product Generic Name",
  MANUFACTURER_ADDRESS: "Address of the Manufacturer and Contact Details*",
  TRADE_NAME_MANUFACTURER: "Trade Name of Manufacturer*",
  PRODUCT_BRAND_NAME: "Product Brand Name*",
  PRODUCT_MODEL_NUMBER: "Product Model Number",
  PRODUCT_CODE: "Product Code or Project Code*",
  PRODUCT_CATALOGUE_NUMBER: "Product Catalogue Number*",
  INTENDED_USE: "Intended Use of the Product",
  BASIC_UDI_DI: "Basic UDI-DI",
  CONFORMITY_TO_REGULATION: "Conformity to Regulation*",
  CLASSIFICATION_PRODUCT: "Classification of Product Under Regulation with Rule Applied",
  CONFORMITY_ASSESSMENT_ROUTE: "Conformity Assessment Route*",
  GENERAL_APPLICABLE_DIRECTIVES: "General Applicable Directives*",
  NOTIFIED_BODY_NAME: "Name of the Notified Body*",
  APPLICABLE_COMMON_SPECIFICATION: "Applicable Common Specification*",
  APPLIED_STANDARDS: "Applied Standards under this declaration of Conformity*",
  NOTIFIED_BODY_NUMBER: "Notified Body Number*",
  COMPETENT_AUTHORITY: "Competent Authority*",
  AUTHORIZED_REPRESENTATIVE: "Authorized Representative*",
  PLACE: "Place*",
  DATE: "Date*",
  CANCEL: "Cancel",
  SAVE: "Save",
  CONFORMITY_TO_REGULATION_LABEL: "Label",
};

export const DECLARATION_CONFORMITY_PLACEHOLDERS = {
  NAME_OF_MANUFACTURER: "Name of Manufacturer",
  PRODUCT_GENERIC_NAME: "Product Generic Name",
  MANUFACTURER_ADDRESS: "Enter Address of the Manufacturer and Contact Details",
  TRADE_NAME_MANUFACTURER: "Enter Trade Name of Manufacturer",
  PRODUCT_BRAND_NAME: "Enter Product Brand Name",
  PRODUCT_MODEL_NUMBER: "Product Model Number",
  PRODUCT_CODE: "Enter Product Code or Project Code",
  PRODUCT_CATALOGUE_NUMBER: "Enter Product Catalogue Number",
  INTENDED_USE: "Intended Use of the Product",
  BASIC_UDI_DI: "Basic UDI-DI",
  CLASSIFICATION_PRODUCT: "Classification of Product Under Regulation with Rule Applied",
  CONFORMITY_ASSESSMENT_ROUTE: "Enter Conformity Assessment Route",
  GENERAL_APPLICABLE_DIRECTIVES: "Enter General Applicable Directives",
  NOTIFIED_BODY_NAME: "Enter Name of the Notified Body",
  APPLICABLE_COMMON_SPECIFICATION: "Enter Applicable Common Specification",
  APPLIED_STANDARDS: "Enter Applied Standards",
  NOTIFIED_BODY_NUMBER: "Enter Notified Body Number",
  COMPETENT_AUTHORITY: "Enter Competent Authority",
  AUTHORIZED_REPRESENTATIVE: "Enter Authorized Representative",
  PLACE: "Enter Place",
};

// Utility constant for dataIsAutocomplete
export const DECLARATION_CONFORMITY_DATA_IS_AUTOCOMPLETE = "off";

// Field name constants for handleInputChange
export const DECLARATION_CONFORMITY_FIELDS = {
  MANUFACTURER_ADDRESS: 'manufacture_contact_details',
  TRADE_NAME_MANUFACTURER: 'manufacture_trade_name',
  PRODUCT_BRAND_NAME: 'product_brand_name',
  PRODUCT_CODE: 'product_code',
  PRODUCT_CATALOGUE_NUMBER: 'product_catalogue_number',
  CONFORMITY_ASSESSMENT_ROUTE: 'conformity_assessment_route',
  CONFORMITY_REGULATION: 'regulation_conformity',
  GENERAL_APPLICABLE_DIRECTIVES: 'general_applicable_directives',
  NOTIFIED_BODY_NAME: 'notified_body_name',
  APPLICABLE_COMMON_SPECIFICATION: 'appliable_common_specification',
  APPLIED_STANDARDS: 'applied_standard',
  NOTIFIED_BODY_NUMBER: 'notified_body_number',
  COMPETENT_AUTHORITY: 'competent_authority',
  AUTHORIZED_REPRESENTATIVE: 'authorized_representative',
  PLACE: 'place',
  DATE: 'conformity_declaration_date',
  NAME_OF_MANUFACTURER: 'manufacturer_name',
  PRODUCT_GENERIC_NAME: 'product_generic_name',
  PRODUCT_MODEL_NUMBER: 'model_name',
  INTENDED_USE: 'product_intended_use',
  BASIC_UDI_DI: 'basic_udi_di',
  CLASSIFICATION_PRODUCT: 'product_classification',
};

export const INITIAL_DECLARATION_CONFORMITY_FORM_ERRORS: FormErrors = {
  manufacture_contact_details: "",
  manufacture_trade_name: "",
  product_brand_name: "",
  product_code: "",
  product_catalogue_number: "",
  conformity_assessment_route: "",
  regulation_conformity: "",
  general_applicable_directives: "",
  notified_body_name: "",
  appliable_common_specification: "",
  applied_standard: "",
  notified_body_number: "",
  competent_authority: "",
  authorized_representative: "",
  place: "",
  conformity_declaration_date: "",
};

// Date format constant for DatePicker
export const DECLARATION_CONFORMITY_DATE_FORMAT = 'DD-MM-YYYY';

export const DECLARATION_CONFORMITY_PAYLOAD_DATE_FORMAT = 'YYYY-MM-DD';

// Field type constants for validation
export const DECLARATION_CONFORMITY_FIELD_TYPES = {
  STRING: 'string',
  BOOLEAN: 'boolean',
} as const;

// Validation schema for Declaration of Conformity form
export const DECLARATION_CONFORMITY_VALIDATION_SCHEMA = [
  { field: 'manufacture_contact_details', errorKey: 'MANUFACTURER_ADDRESS_ERROR', type: 'string' },
  { field: 'manufacture_trade_name', errorKey: 'TRADE_NAME_MANUFACTURER_ERROR', type: 'string' },
  { field: 'product_brand_name', errorKey: 'PRODUCT_BRAND_NAME_ERROR', type: 'string' },
  { field: 'product_code', errorKey: 'PRODUCT_CODE_ERROR', type: 'string' },
  { field: 'product_catalogue_number', errorKey: 'PRODUCT_CATALOGUE_NUMBER_ERROR', type: 'string' },
  { field: 'conformity_assessment_route', errorKey: 'CONFORMITY_ASSESSMENT_ROUTE_ERROR', type: 'string' },
  { field: 'regulation_conformity', errorKey: 'CONFORMITY_REGULATION_ERROR', type: 'boolean' },
  { field: 'general_applicable_directives', errorKey: 'GENERAL_APPLICABLE_DIRECTIVES_ERROR', type: 'string' },
  { field: 'notified_body_name', errorKey: 'NOTIFIED_BODY_NAME_ERROR', type: 'string' },
  { field: 'appliable_common_specification', errorKey: 'APPLICABLE_COMMON_SPECIFICATION_ERROR', type: 'string' },
  { field: 'applied_standard', errorKey: 'APPLIED_STANDARDS_ERROR', type: 'string' },
  { field: 'notified_body_number', errorKey: 'NOTIFIED_BODY_NUMBER_ERROR', type: 'string' },
  { field: 'competent_authority', errorKey: 'COMPETENT_AUTHORITY_ERROR', type: 'string' },
  { field: 'authorized_representative', errorKey: 'AUTHORIZED_REPRESENTATIVE_ERROR', type: 'string' },
  { field: 'place', errorKey: 'PLACE_ERROR', type: 'string' },
  { field: 'conformity_declaration_date', errorKey: 'DATE_ERROR', type: 'string' },
]; 
// Type for API payload (only required fields)
export interface DeclarationConformityPayload {
  project_id: number;
  manufacture_contact_details: string;
  manufacture_trade_name: string;
  product_brand_name: string;
  product_code: string;
  product_catalogue_number: string;
  regulation_conformity: boolean;
  conformity_assessment_route: string;
  general_applicable_directives: string;
  notified_body_number: string;
  appliable_common_specification: string;
  applied_standard: string;
  competent_authority: string;
  authorized_representative: string;
  place: string;
  notified_body_name: string;
  conformity_declaration_date: string;
} 

// Fields in DeclarationConformityFormData that are NOT required in DeclarationConformityPayload
export const DECLARATION_CONFORMITY_UNWANTED_FIELDS = [
  "manufacturer_name",
  "product_generic_name",
  "model_name",
  "product_intended_use",
  "basic_udi_di",
  "product_classification"
]; 