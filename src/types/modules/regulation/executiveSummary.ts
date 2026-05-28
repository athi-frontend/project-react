export interface ShelfLifeData {
  id: string;
  sno: string;
  parameter: string;
  specification: string;
}

export interface MarketingHistoryData {
  id: string;
  sno: string;
  year: string;
  qtyMarketed: string;
}

export interface RegulatoryApprovalData {
  id: string;
  sno: string;
  approvedIndication: string;
  approvedShelfLife: string;
  classOfDevice: string;
  dateOfFirstApproval: string;
  country_id: number;
}

export interface MarketClearanceData {
  id: string;
  sno: string;
  regulatoryAgency: string;
  regulatoryAgencyId: string;
  indicationForUse: string;
  registrationStatus: string;
  date: string;
}

export interface AdverseEventData {
  id: string;
  sno: string;
  seriousAdverseEvent: string;
  durationFrom: string;
  durationTo: string;
  numberOfSAE: string;
  totalUnitsSold: string;
}

export interface FSCAData {
  id: string;
  sno: string;
  dateOfFSCA: string;
  reasonForFSCA: string;
  countriesWhereFSCA: string;
  countriesIds: any[];
  descriptionOfAction: string;
}

export interface FormData {
  introductoryInfo: string;
  intendedUse: string;
  indicationsForUse: string;
  classOfDevice: string;
  novelFeatures: string;
  shelfLife: ShelfLifeData[];
  sterilizationInfo: string;
  regulatoryStatus: string;
  clinicalEvidence: string;
  riskManagement: string;
  declarationOfConformity: string;
  domesticPrice: string;
  animalHumanCells: string;
  microbialRecombinant: string;
  irradiatingComponents: string;
}

export interface EditingRow {
  tableType: string;
  row: any;
}

// Modal Interfaces
export interface MarketingHistoryModalData {
  year: string;
  quantity: string;
}

export interface RegulatoryModalData {
  country: string;
  approvedIndication: string;
  approvedShelfLife: string;
  classOfDevice: string;
  date: string;
}

export interface StatusOfMarketClearanceModalData {
  regulatoryAgency: string;
  regulatoryAgencyId: string;
  indicationForUse: string;
  registrationStatus: string;
  date: string;
}

export interface AdverseEventModalData {
  seriousAdverseEvent: string;
  startDate: string;
  endDate: string;
  numberOfSAE: string;
  totalUnitsSold: string;
}

export interface FscaModalData {
  date: string;
  reasonForFsca: string;
  countries: Array<{ id: number; country_name: string }>;
  actionDescription: string;
}

export interface FscaModalInitialData {
  date: string;
  reasonForFsca: string;
  countries: Array<{ id: number; country_name: string }> | number[];
  actionDescription: string;
}

// Form Error Interfaces
export interface MarketingHistoryFormErrors {
  year: string;
  quantity: string;
}

export interface RegulatoryFormErrors {
  country: string;
  approvedIndication: string;
  approvedShelfLife: string;
  classOfDevice: string;
  date: string;
}

export interface StatusOfMarketClearanceFormErrors {
  regulatoryAgency: string;
  regulatoryAgencyId: string;
  indicationForUse: string;
  registrationStatus: string;
  date: string;
}

export interface AdverseEventFormErrors {
  seriousAdverseEvent: string;
  startDate: string;
  endDate: string;
  numberOfSAE: string;
  totalUnitsSold: string;
}

export interface FscaFormErrors {
  date: string;
  reasonForFsca: string;
  countries: string;
  actionDescription: string;
}

// Modal Props Interfaces
export interface MarketingHistoryModalProps {
  onSave?: (data: MarketingHistoryModalData) => void;
  onCancel?: () => void;
  onClose?: () => void;
  open: boolean;
  initialData?: MarketingHistoryModalData;
}

export interface RegulatoryModalProps {
  onSave?: (data: RegulatoryModalData) => void;
  onCancel?: () => void;
  onClose?: () => void;
  open: boolean;
  initialData?: RegulatoryModalData;
}

export interface StatusOfMarketClearanceModalProps {
  onSave?: (data: StatusOfMarketClearanceModalData) => void;
  onCancel?: () => void;
  onClose?: () => void;
  open: boolean;
  initialData?: StatusOfMarketClearanceModalData;
}

export interface AdverseEventModalProps {
  onSave?: (data: AdverseEventModalData) => void;
  onCancel?: () => void;
  onClose?: () => void;
  open: boolean;
  initialData?: AdverseEventModalData;
}

export interface FscaModalProps {
  onSave?: (data: FscaModalData) => void;
  onCancel?: () => void;
  onClose?: () => void;
  open: boolean;
  initialData?: FscaModalInitialData;
}

// API Interfaces
export interface MarketingDeviceLaunch {
  year: string
  quantity: string
}

export interface RegulatoryApproval {
  country_id: number
  approval_indication: string
  approved_shelf_life: string
  device_class: string
  approved_date: string
}

export interface MarketClearance {
  regulatory_agency_id: number
  indication_use: string
  registration_status: string
  clearance_date: string
}

export interface AdverseEvent {
  serious_adverse_event: string
  start_date: string
  end_date: string
  sae_reported_count: number
  total_unit_sold: number
}

export interface SafetyCorrection {
  fsca_reason: string
  countries: number[]
  reason_action: string
  fsca_date: string
}

export interface Agency {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  country_name: string;
}

export interface ExecutiveSummaryData {
  project_id: number
  project_description?: string
  intended_use?: string
  indications_of_use?: string
  class_of_device?: string
  novel_feature?: string
  sterilization_information?: string
  regualtory_status?: string
  clinical_evalution?: string
  risk_management_control?: string
  declaration_conformity?: string
  device_domestic_price?: string
  non_viable_cell_tissue_derivative?: string
  microbal_recombinent_origin_material?: string
  irradiating_component_type?: string
  shelf_life?: ShelfLifeData[]
  marketing_device_launch?: MarketingDeviceLaunch[]
  regulatory_approval?: RegulatoryApproval[]
  market_clearance?: MarketClearance[]
  adverse_events?: AdverseEvent[]
  safety_correction?: SafetyCorrection[]
  created_by: number
  modified_by?: number
} 