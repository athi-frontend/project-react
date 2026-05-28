import { NUMBERMAP } from "@/constants/common"

export const INFO_TEXT = {
  INTRODUCTORY_INFORMATION: 'Give a detailed description of the product, its technology, its usage and benefits to the patients.',
  INTENDED_USE: 'Give the Intended use of the Product.',
  INDICATIONS_FOR_USE: 'Give the indications of use (when to use and under what conditions to be used).',
  CLASS_OF_DEVICE: 'Mention the Classification of the device.',
  NOVEL_FEATURES: 'Describe any novel features used in the product.',
  SHELF_LIFE: `If applicable give the Shelf life
If not applicable - mention Not Applicable.`,
 SHOW_DESCRIPTION: `<div>
      <p>
        Quality is the first important factor that our system is concerned. We are always quality conscious and no compromise with the quality. Starting from the receipt of the materials like, raw material and packing material and equipment etc., till the dispatch of the finished goods, each activity is followed against standard operating procedures and wherever necessary are recorded. Workers who came in contact with the equipment and machineries are properly trained to operate and keep the standard quality.
      </p> 
      <p>We have adopted following Program to ensure quality practice:</p>
      <ol>
        <li>
          Preparation of quality procedures, standard operating procedures & work instructions.
        </li>
        <li>
          Periodic review of quality procedures, standard operating procedures & work instructions to maintain their effectiveness.
        </li>
        <li>
          Periodic validating of sterilization process, calibration of measuring and monitoring devices.
        </li>
        <li>
          Process control including in-process quality control and final quality control.
        </li>
        <li>
          Control of Non-conforming product.
        </li>
        <li>
          Handling market complaints.
        </li>
        <li>
          Handling of rejected and recall products.
        </li>
        <li>
          Training programs.
        </li>
        <li>
          Analysis of data.
        </li>
      </ol>
      <p>
        Company is maintaining a complete quality management system in compliance with ISO 13485:2016 and fifth schedule of Indian Medical Device Rules, 2017.
      </p>
      <p>
        We have a self-inspection procedure with identified personnel constituting ‘internal auditing team’ for internal quality auditing purpose.
      </p>
    </div>`,
}
export const SECTION_TITLES = {
  SAFETY_PERFORMANCE: 'Safety and Performance Related Information on the Device',
  SUMMARY_REPORTABLE: 'Summary of Reportable Event and Field Safety Corrective Action From the Date of Introduction',
  DEVICE_CONTAINS: 'If the Device Contains Any of the Followings, Then Descriptive Information on the Following Need to be Provided',
}

export const ICONS = {
  TITLE: '#222',
  DOWNLOAD_FILE: '#652D90',
}

export const FORM_PLACEHOLDERS = {
  COUNTRY: 'Select Country',
  APPROVED_INDICATION: 'Enter Approved Indication',
  APPROVED_SHELF_LIFE: 'Enter Approved Shelf Life',
  CLASS_OF_DEVICE: 'Enter Class of Device',
  DATE: 'DD-MM-YYYY',
}

// API Configuration
const BASE_URL = 'api/v1/regulation/executive-summary'
export const EXECUTIVE_SUMMARY_API = {
  FETCH: (projectId: number) => `${BASE_URL}/${projectId}`,
  POST: BASE_URL,
  AGENCIES: '/api/v1/regulation/agency/all',
  COUNTRIES: '/api/v1/regulation/country/all?status=1',
}

export const EXECUTIVE_SUMMARY_FIELD_KEYS = {
  PROJECT_ID: 'project_id',
  INTRODUCTORY_INFO: 'introductory_info',
  INTENDED_USE: 'intended_use',
  INDICATIONS_FOR_USE: 'indications_for_use',
  CLASS_OF_DEVICE: 'class_of_device',
  NOVEL_FEATURE: 'novel_feature',
  STERILIZATION_INFORMATION: 'sterilization_information',
  REGULATORY_STATUS: 'regualtory_status',
  CLINICAL_EVALUATION: 'clinical_evalution',
  RISK_MANAGEMENT_CONTROL: 'risk_management_control',
  DECLARATION_CONFORMITY: 'declaration_conformity',
  DEVICE_DOMESTIC_PRICE: 'device_domestic_price',
  NON_VIABLE_CELL_TISSUE_DERIVATIVE: 'non_viable_cell_tissue_derivative',
  MICROBIAL_RECOMBINANT_ORIGIN_MATERIAL: 'microbal_recombinent_origin_material',
  IRRADIATING_COMPONENT_TYPE: 'irradiating_component_type',
  MARKETING_DEVICE_LAUNCH: 'marketing_device_launch',
  REGULATORY_APPROVAL: 'regulatory_approval',
  MARKET_CLEARANCE: 'market_clearance',
  ADVERSE_EVENTS: 'adverse_events',
  SAFETY_CORRECTION: 'safety_correction',
  CREATED_BY: 'created_by',
  MODIFIED_BY: 'modified_by',
}

export const LABELS = {
  INTRO_INFO: 'Introductory Descriptive Information',
  INTENDED_USE: 'Intended Use',
  INDICATIONS_FOR_USE: 'Indications for Use',
  CLASS_OF_DEVICE: 'Class of Device',
  NOVEL_FEATURES: 'Novel Features',
  SHELF_LIFE: 'Shelf Life',
  STERILIZATION_INFO: 'Information Regarding Sterilization of the Device',
  REGULATORY_STATUS: 'Regulatory Status of the Similar Device in India',
  CLINICAL_EVIDENCE: 'Clinical Evidence and Evaluation',
  RISK_MANAGEMENT: 'Risk Management Plan, Risk Analysis, Evaluation and Control Documents',
  DECLARATION_OF_CONFORMITY: 'Declaration of Conformity',
  DOMESTIC_PRICE: 'Domestic Price of the Device in the Currency Followed in the Country of Origin',
  MARKETING_HISTORY: 'Marketing History of the Device From the Date of Introducing the Device in the Market',
  REGULATORY_APPROVALS: 'List of Regulatory Approvals or Marketing Clearance Obtained',
  MARKET_CLEARANCE: 'Status of Market Clearance Pending, Rejected or Withdrawn',
  SERIOUS_ADVERSE_EVENT: 'For Serious Adverse Event',
  FSCA: 'For Field Safety Corrective Action (FSCA)',
  ANIMAL_HUMAN_CELLS: 'Animal or Human Cells Tissues or Derivatives There of, Rendered Non-Viable',
  MICROBIAL_RECOMBINANT: 'Cells, Tissues or Derivatives of Microbial Recombinant Origin',
  IRRADIATING_COMPONENTS: 'Irradiating Components, Ionizing or Non-Ionizing',
  ADD_NEW: 'Add New',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  INPUT_TEXT: 'Input Text',
  PLACEHOLDER_DOMESTIC_PRICE: 'Enter Domestic price of the Device in the Currency Followed in the Country of Origin',
  PLACEHOLDER_ANIMAL_HUMAN_CELLS: 'Enter Animal or Human Cells Tissues or Derivatives There of, Rendered Non-Viable',
  PLACEHOLDER_MICROBIAL_RECOMBINANT: 'Enter Cells, Tissues or Derivatives of Microbial Recombinant Origin',
  PLACEHOLDER_IRRADIATING_COMPONENTS: 'Enter Irradiating Components, Ionizing or Non-Ionizing',
  EXECUTIVE_SUMMARY: 'Executive Summary',
  MARKETING_HISTORY_DEVICE: 'Marketing History of the Device From the Date of Introducing the Device in the Market',
  LIST_REGULATORY_APPROVALS: 'List of Regulatory Approvals or Marketing Clearance Obtained',
  STATUS_MARKET_CLEARANCE: 'Status of Market Clearance Pending, Rejected or Withdrawn',
  FOR_SERIOUS_ADVERSE_EVENT: 'For Serious Adverse Event',
  FOR_FIELD_SAFETY_CORRECTIVE_ACTION: 'For Field Safety Corrective Action (FSCA)',
  DEVICE_CONTAINS_FOLLOWING: 'If the Device Contains Any of the Followings, Then Descriptive Information on the Following Need to be Provided',
  S_NO: 'S.No.',
  YEAR: 'Year',
  QTY_MARKETED_NOS: 'Qty Marketed in Nos',
  ACTIONS: 'Actions',
  APPROVED_INDICATION: 'Approved indication',
  APPROVED_SHELF_LIFE: 'Approved shelf life',
  CLASS_OF_DEVICE_TABLE: 'Class of device',
  DATE_OF_FIRST_APPROVAL: 'Date of first approval',
  REGULATORY_AGENCY_COUNTRY: 'Regulatory Agency of the country',
  INDICATION_FOR_USE: 'Indication for use',
  REGISTRATION_STATUS: 'Registration status',
  DATE: 'Date',
  SERIOUS_ADVERSE_EVENT_SAE: 'Serious Adverse Event(SAE)',
  DURATION: 'Duration',
  FROM: 'From',
  TO: 'To',
  NUMBER_SAE_REPORTED: 'Number of the SAE reported',
  TOTAL_UNITS_SOLD: 'Total Units Sold',
  DATE_OF_FSCA: 'Date of FSCA',
  REASON_FOR_FSCA: 'Reason for FSCA',
  COUNTRIES_FSCA_CONDUCTED: 'Countries where FSCA was conducted',
  DESCRIPTION_ACTION_TAKEN: 'Description of the action taken',
  DASH: '-',
};

export const TABLE_COLUMNS = {
  SHELF_LIFE: [
    { field: 'sno', headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: 'parameter', headerName: 'Parameter', flex: NUMBERMAP.TWO },
    { field: 'specification', headerName: 'Specification', flex: NUMBERMAP.TWO },
  ],
  MARKETING_HISTORY: [
    { field: 'sno', headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: 'year', headerName: LABELS.YEAR, flex: NUMBERMAP.ONE },
    { field: 'qtyMarketed', headerName: LABELS.QTY_MARKETED_NOS, flex: NUMBERMAP.TWO },
  ],
  REGULATORY_APPROVAL: [
    { field: 'sno', headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: 'approvedIndication', headerName: LABELS.APPROVED_INDICATION, flex: NUMBERMAP.TWO },
    { field: 'approvedShelfLife', headerName: LABELS.APPROVED_SHELF_LIFE, flex: NUMBERMAP.TWO },
    { field: 'classOfDevice', headerName: LABELS.CLASS_OF_DEVICE_TABLE, flex: NUMBERMAP.TWO },
    { field: 'dateOfFirstApproval', headerName: LABELS.DATE_OF_FIRST_APPROVAL, flex: NUMBERMAP.TWO },
  ],
  MARKET_CLEARANCE: [
    { field: 'sno', headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: 'regulatoryAgency', headerName: LABELS.REGULATORY_AGENCY_COUNTRY, flex: NUMBERMAP.THREE },
    { field: 'indicationForUse', headerName: LABELS.INDICATION_FOR_USE, flex: NUMBERMAP.TWO },
    { field: 'registrationStatus', headerName: LABELS.REGISTRATION_STATUS, flex: NUMBERMAP.TWO },
    { field: 'date', headerName: LABELS.DATE, flex: NUMBERMAP.ONE },
  ],
  ADVERSE_EVENT: [
    { field: 'sno', headerName: LABELS.S_NO, flex: NUMBERMAP.HALF },
    { field: 'seriousAdverseEvent', headerName: LABELS.SERIOUS_ADVERSE_EVENT_SAE, flex: NUMBERMAP.TWO },
    { field: 'duration', headerName: LABELS.DURATION, flex: NUMBERMAP.THREE },
    { field: 'numberOfSAE', headerName: LABELS.NUMBER_SAE_REPORTED, flex: NUMBERMAP.TWO },
    { field: 'totalUnitsSold', headerName: LABELS.TOTAL_UNITS_SOLD, flex: NUMBERMAP.TWO },
  ],
  FSCA: [
    { field: 'sno', headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: 'dateOfFSCA', headerName: LABELS.DATE_OF_FSCA, flex: NUMBERMAP.TWO },
    { field: 'reasonForFSCA', headerName: LABELS.REASON_FOR_FSCA, flex: NUMBERMAP.TWO },
    { field: 'countriesWhereFSCA', headerName: LABELS.COUNTRIES_FSCA_CONDUCTED, flex: NUMBERMAP.THREE },
    { field: 'descriptionOfAction', headerName: LABELS.DESCRIPTION_ACTION_TAKEN, flex: NUMBERMAP.THREE },
  ],
};

export const TABLE_TYPES = {
  MARKETING: 'marketing',
  REGULATORY: 'regulatory',
  CLEARANCE: 'clearance',
  ADVERSE: 'adverse',
  FSCA: 'fsca',
} as const;

// Modal Constants
export const MODAL_TITLES = {
  MARKETING_HISTORY: 'Marketing History of the Device from the Date of Introducing the Device in the Market',
  REGULATORY_APPROVALS: 'List of Regulatory Approvals or Marketing Clearance Obtained',
  MARKET_CLEARANCE: 'Status of Market Clearance Pending, Rejected or Withdrawn',
  SERIOUS_ADVERSE_EVENT: 'For Serious Adverse Event',
  FIELD_SAFETY_CORRECTIVE_ACTION: 'For Field Safety Corrective Action (FSCA)',
} as const;

// Marketing History Modal Constants
export const MARKETING_HISTORY = {
  FORM_ERRORS: {
    YEAR_ERROR: 'Year is required',
    QUANTITY_ERROR: 'Quantity is required',
  },
  FORM_LABELS: {
    YEAR: 'Year*',
    QTY_MARKETED: 'Qty Marketed in Nos*',
  },
  FORM_PLACEHOLDERS: {
    YEAR: 'Enter Year',
    QTY_MARKETED: 'Enter Qty Marketed in Nos',
  },
} as const;

// Regulatory Modal Constants
export const REGULATORY = {
  FORM_ERRORS: {
    COUNTRY_ERROR: 'Country is required',
    APPROVED_INDICATION_ERROR: 'Approved Indication is required',
    APPROVED_SHELF_LIFE_ERROR: 'Approved Shelf Life is required',
    CLASS_OF_DEVICE_ERROR: 'Class of Device is required',
    DATE_ERROR: 'Date is required',
  },
  FORM_LABELS: {
    COUNTRY: 'Country*',
    APPROVED_INDICATION: 'Approved Indication*',
    APPROVED_SHELF_LIFE: 'Approved Shelf Life*',
    CLASS_OF_DEVICE: 'Class of Device*',
    DATE: 'Date*',
  },
  FORM_PLACEHOLDERS: {
    COUNTRY: 'Select Country',
    APPROVED_INDICATION: 'Enter Approved Indication',
    APPROVED_SHELF_LIFE: 'Enter Approved Shelf Life',
    CLASS_OF_DEVICE: 'Enter Class of Device',
    DATE: 'DD-MM-YYYY',
  },
  DATA_CHANGE: {
    COUNTRY: 'country',
    APPROVED_INDICATION: 'approvedIndication',
    APPROVED_SHELF_LIFE: 'approvedShelfLife',
    CLASS_OF_DEVICE: 'classOfDevice',
    DATE: 'date',
  },
  KEY_FIELD: {
    COUNTRY: 'id',
  },
  VALUE_FIELD: {
    COUNTRY: 'country_name',
  },
  DATA_TABLE_NAME: {
    REGULATORY_APPROVALS: 'regulatory_approvals',
  },
  DATA_FIELD_NAME: {
    COUNTRY: 'country',
  },
} as const;

// Status of Market Clearance Modal Constants
export const MARKET_CLEARANCE = {
  FORM_ERRORS: {
    REGULATORY_AGENCY_ERROR: 'Regulatory Agency is required',
    INDICATION_FOR_USE_ERROR: 'Indication for Use is required',
    REGISTRATION_STATUS_ERROR: 'Registration Status is required',
    DATE_ERROR: 'Date is required',
  },
  FORM_LABELS: {
    REGULATORY_AGENCY: 'Regulatory Agency of the Country*',
    INDICATION_FOR_USE: 'Indication for Use*',
    REGISTRATION_STATUS: 'Registration Status*',
    DATE: 'Date*',
  },
  FORM_PLACEHOLDERS: {
    REGULATORY_AGENCY: 'Select Regulatory Agency of the Country',
    INDICATION_FOR_USE: 'Enter Indication for Use',
    REGISTRATION_STATUS: 'Enter Registration Status',
    DATE: 'DD-MM-YYYY',
  },
  DATA_CHANGE: {
    REGULATORY_AGENCY: 'regulatoryAgency',
    INDICATION_FOR_USE: 'indicationForUse',
    REGISTRATION_STATUS: 'registrationStatus',
    DATE: 'date',
  },
  KEY_FIELD: {
    REGULATORY_AGENCY: 'id',
  },
  VALUE_FIELD: {
    REGULATORY_AGENCY: 'agency_name',
  },
  DATA_TABLE_NAME: {
    MARKET_CLEARANCE: 'market_clearance',
  },
  DATA_FIELD_NAME: {
    REGULATORY_AGENCY: 'regulatoryAgency',
  },
} as const;

// Adverse Event Modal Constants
export const ADVERSE_EVENT = {
  FORM_ERRORS: {
    SERIOUS_ADVERSE_EVENT_ERROR: 'Serious Adverse Event is required',
    START_DATE_ERROR: 'Start Date is required',
    END_DATE_ERROR: 'End Date is required',
    DATE_RANGE_ERROR: 'Start Date cannot be greater than End Date',
    START_DATE_RANGE_ERROR: 'Start Date cannot be after End Date',
    END_DATE_RANGE_ERROR: 'End Date cannot be before Start Date',
    NUMBER_OF_SAE_ERROR: 'Number of the SAE Reported is required',
    TOTAL_UNITS_SOLD_ERROR: 'Total Units Sold is required',
  },
  FORM_LABELS: {
    SERIOUS_ADVERSE_EVENT: 'Serious Adverse Event (SAE)*',
    START_DATE: 'Start Date*',
    END_DATE: 'End Date*',
    NUMBER_OF_SAE: 'Number of the SAE Reported*',
    TOTAL_UNITS_SOLD: 'Total Units Sold*',
  },
  FORM_PLACEHOLDERS: {
    SERIOUS_ADVERSE_EVENT: 'Enter Serious Adverse Event (SAE)',
    START_DATE: 'DD-MM-YYYY',
    END_DATE: 'DD-MM-YYYY',
    NUMBER_OF_SAE: 'Enter Number of the SAE Reported',
    TOTAL_UNITS_SOLD: 'Enter Total Units Sold',
  },
  DATA_CHANGE: {
    SERIOUS_ADVERSE_EVENT: 'seriousAdverseEvent',
    START_DATE: 'startDate',
    END_DATE: 'endDate',
    NUMBER_OF_SAE: 'numberOfSAE',
    TOTAL_UNITS_SOLD: 'totalUnitsSold',
  },
  DATA_TABLE_NAME: {
    ADVERSE_EVENT: 'adverse_event',
  },
  DATA_FIELD_NAME: {
    SERIOUS_ADVERSE_EVENT: 'seriousAdverseEvent',
    START_DATE: 'startDate',
    END_DATE: 'endDate',
    NUMBER_OF_SAE: 'numberOfSAE',
    TOTAL_UNITS_SOLD: 'totalUnitsSold',
  },
} as const;

// FSCA Modal Constants
export const FSCA = {
  FORM_ERRORS: {
    DATE_ERROR: 'Date is required',
    REASON_FOR_FSCA_ERROR: 'Reason for FSCA is required',
    COUNTRIES_ERROR: 'Countries where FSCA was Conducted is required',
    ACTION_DESCRIPTION_ERROR: 'Description of the Action Taken is required',
  },
  FORM_LABELS: {
    DATE: 'Date*',
    REASON_FOR_FSCA: 'Reason for FSCA*',
    COUNTRIES: 'Countries where FSCA was Conducted',
    ACTION_DESCRIPTION: 'Description of the Action Taken*',
  },
  FORM_PLACEHOLDERS: {
    DATE: 'DD-MM-YYYY',
    REASON_FOR_FSCA: 'Reason for FSCA',
    COUNTRIES: 'Select Countries where FSCA was Conducted',
    ACTION_DESCRIPTION: 'Description of the Action Taken',
  },
  DATA_CHANGE: {
    DATE: 'date',
    REASON_FOR_FSCA: 'reasonForFsca',
    COUNTRIES: 'countries',
    ACTION_DESCRIPTION: 'actionDescription',
  },
  DATA_TABLE_NAME: {
    FSCA: 'fsca',
  },
  DATA_FIELD_NAME: {
    DATE: 'date',
    REASON_FOR_FSCA: 'reasonForFsca',
    COUNTRIES: 'countries',
    ACTION_DESCRIPTION: 'actionDescription',
  },
  FORM_FIELDS_CONFIG: {
    REASON_FOR_FSCA: {
      onChange: 'reasonForFsca',
    },
    ACTION_DESCRIPTION: {
      onChange: 'actionDescription',
    },
  },
} as const;

// Utility functions to eliminate code duplication
export const createFormDataFromApi = (data: any) => ({
  introductoryInfo: data.project_description ?? "",
  intendedUse: data.intended_use ?? "",
  indicationsForUse: data.indications_of_use ?? "",
  classOfDevice: data.class_of_device ?? "",
  novelFeatures: data.novel_feature ?? "",
  shelfLife: data?.shelf_life ?? [],
  sterilizationInfo: data.sterilization_information ?? "",
  regulatoryStatus: data.regualtory_status ?? "",
  clinicalEvidence: data.clinical_evalution ?? "",
  riskManagement: data.risk_management_control ?? "",
  declarationOfConformity: data.declaration_conformity ?? "",
  domesticPrice: data.device_domestic_price ?? "",
  animalHumanCells: data.non_viable_cell_tissue_derivative ?? "",
  microbialRecombinant: data.microbal_recombinent_origin_material ?? "",
  irradiatingComponents: data.irradiating_component_type ?? ""
});

export const createMarketingHistoryData = (data: any[], startIndex: number = NUMBERMAP.ZERO) => 
  data.map((item: any, index: number) => ({
    id: (startIndex + index + NUMBERMAP.ONE).toString(),
    sno: (startIndex + index + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, '0'),
    year: item.year ?? "",
    qtyMarketed: item.quantity ?? ""
  }));

export const createRegulatoryApprovalData = (data: any[], startIndex: number = NUMBERMAP.ZERO) => 
  data.map((item: any, index: number) => ({
    id: (startIndex + index + NUMBERMAP.ONE).toString(),
    sno: (startIndex + index + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, '0'),
    approvedIndication: item.approval_indication ?? "",
    approvedShelfLife: item.approved_shelf_life ?? "",
    classOfDevice: item.device_class ?? "",
    dateOfFirstApproval: item.approved_date ?? "",
    country_id: item.country_id,
  }));

export const createMarketClearanceData = (data: any[], startIndex: number = NUMBERMAP.ZERO) => 
  data.map((item: any, index: number) => ({
    id: (startIndex + index + NUMBERMAP.ONE).toString(),
    sno: (startIndex + index + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, '0'),
    regulatoryAgency: item.regulatory_agency ?? "",
    regulatoryAgencyId: item.regulatory_agency_id?.toString() ?? "",
    indicationForUse: item.indication_use ?? "",
    registrationStatus: item.registration_status ?? "",
    date: item.clearance_date ?? ""
  }));

export const createAdverseEventData = (data: any[], startIndex: number = NUMBERMAP.ZERO) => 
  data.map((item: any, index: number) => ({
    id: (startIndex + index + NUMBERMAP.ONE).toString(),
    sno: (startIndex + index + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, '0'),
    seriousAdverseEvent: item.serious_adverse_event ?? "",
    durationFrom: item.start_date ?? "",
    durationTo: item.end_date ?? "",
    numberOfSAE: item.sae_reported_count?.toString() ?? "",
    totalUnitsSold: item.total_unit_sold?.toString() ?? ""
  }));

export const createFscaData = (data: any[], startIndex: number = NUMBERMAP.ZERO) => 
  data.map((item: any, index: number) => {
    let countriesDisplay = "";
    if (item.countries && Array.isArray(item.countries)) {
        // Handle array of objects with country_name
        countriesDisplay = item.countries.map((country: any) => country.country_name).join(', ');
    }
    
    return {
      id: (startIndex + index + NUMBERMAP.ONE).toString(),
      sno: (startIndex + index + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, '0'),
      dateOfFSCA: item.fsca_date ?? "",
      reasonForFSCA: item.fsca_reason ?? "",
      countriesWhereFSCA: countriesDisplay,
      countriesIds: item.countries ?? [],
      descriptionOfAction: item.reason_action ?? ""
    };
  });

export const getEmptyFormData = () => ({
  introductoryInfo: "",
  intendedUse: "",
  indicationsForUse: "",
  classOfDevice: "",
  novelFeatures: "",
  shelfLife: [],
  sterilizationInfo: "",
  regulatoryStatus: "",
  clinicalEvidence: "",
  riskManagement: "",
  declarationOfConformity: "",
  domesticPrice: "",
  animalHumanCells: "",
  microbialRecombinant: "",
  irradiatingComponents: ""
});