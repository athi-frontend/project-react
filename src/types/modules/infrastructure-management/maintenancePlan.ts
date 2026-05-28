/**
 * Classification : Confidential
 **/

// Common types
export interface DropdownOption {
  key: string;
  value: string;
}

// API Response types
export interface SkillSetRequiredItem {
  maintenance_plan_skill_id: number;
  skill_id: number;
  skill_name: string;
  status_id: number;
}

export interface ToolItem {
  maintenance_plan_tool_id?: number;
  infrastructure_maintenance_tool_id?: number;
  tool_id?: number;
  tool_type_id?: number;
  tool_name?: string;
  tool_type?: string;
  status_id: number;
  status_name?: string;
  status_slug?: string;
}

export interface EquipmentRequiredItem {
  maintenance_plan_equipment_id?: number;
  infrastructure_maintenance_equipment_id?: number;
  equipment_id?: number;
  equipment_type_id?: number;
  equipment_name?: string;
  equipment_type?: string;
  status_id: number;
  status_name?: string;
  status_slug?: string;
}

export interface MaintenancePlanDetailItem {
  maintenance_plan_detail_id?: number;
  infrastructure_maintenance_plan_id?: number;
  maintenance_description: string;
  maintenance_service_type_id?: number;
  done_by_id?: number;
  maintenance_service_type?: string;
  done_by?: string;
  frequency_id: number;
  frequency_name?: string;
  frequency?: string;
  status_id: number;
  status_name?: string;
  status_slug?: string;
}

export interface MaintenancePlanApiResponse {
  maintenance_id?: number;
  infrastructure_id?: number;
  infrastructure_name?: string;
  infra_type_id?: number;
  infra_type: string;
  infra_category_id?: number;
  infra_category?: string;
  status_id: number;
  status_name?: string;
  status_slug?: string;
  skill_set_required?: SkillSetRequiredItem[];
  skill_set?: Array<{
    id: number;
    skill_name: string;
  }>;
  tools?: ToolItem[];
  tools_required?: Array<{
    infrastructure_maintenance_tool_id: number;
    tool_type_id: number;
    tool_type: string;
    status_id: number;
    status_name?: string;
    status_slug?: string;
  }>;
  equipment_required: EquipmentRequiredItem[];
  maintenance_plan: MaintenancePlanDetailItem[];
}

export interface MaintenancePlanListApiResponse {
  data: MaintenancePlanApiResponse[];
}

export interface MaintenancePlanByIdApiResponse {
  data: MaintenancePlanApiResponse[];
}

export interface ToolApiResponse {
  tool_id: number;
  tool_name: string;
  status: number;
}

export interface ToolsApiResponse {
  data: ToolApiResponse[];
}

export interface ServiceTypeApiResponse {
  id: number;
  maintenance_service_type: string;
  status: number;
}

export interface ServiceTypesApiResponse {
  data: ServiceTypeApiResponse[];
}

export interface FrequencyApiResponse {
  id: number;
  frequency_name: string;
  status: number;
}

export interface FrequenciesApiResponse {
  data: FrequencyApiResponse[];
}

export interface EquipmentApiResponse {
  equipment_id: number;
  equipment_name: string;
  status: number;
}

export interface EquipmentsApiResponse {
  data: EquipmentApiResponse[];
}

export interface InfrastructureCategoryApiResponse {
  infrastructure_category_id: number;
  infrastructure_category_name: string;
  status: number;
}

export interface InfrastructureCategoriesApiResponse {
  data: InfrastructureCategoryApiResponse[];
}

export interface InfrastructureTypeApiResponse {
  infrastructure_type_id: number;
  infrastructure_type_name: string;
  status: number;
}

export interface InfrastructureTypesApiResponse {
  data: InfrastructureTypeApiResponse[];
}

export interface SkillSetApiResponse {
  skill_id: number;
  skill_name: string;
  status: number;
  documents: any[];
}

export interface SkillSetsApiResponse {
  data: SkillSetApiResponse[];
}

// Maintenance Plan List types
export interface MaintenancePlanListItem {
  id: number;
  sno: string;
  infrastructureCategory: string;
  infrastructureType: string;
  status: string;
}

// Maintenance Plan Form types
export interface MaintenancePlanFormProps {
  infrastructureCategoryOptions?: DropdownOption[];
  infrastructureTypeOptions?: DropdownOption[];
  infrastructureCategoryValue?: string;
  infrastructureTypeValue?: string;
  onInfrastructureCategoryChange?: (value: string) => void;
  onInfrastructureTypeChange?: (value: string) => void;
  maintenanceId?: number | string;
  initialData?: MaintenancePlanApiResponse;
}

export interface ToolData {
  id: string;
  serialNo: string;
  toolType: string;
  status: string;
  toolId?: number; // maintenance_plan_tool_id from API, used for updates
}

export interface EquipmentData {
  id: string;
  serialNo: string;
  equipmentType: string;
  status: string;
  equipmentId?: number; // maintenance_plan_equipment_id from API, used for updates
}

export interface MaintenancePlanData {
  id: string;
  serialNo: string;
  maintenanceDescription: string;
  toBeDoneBy: string;
  frequency: string;
  status: string;
  maintenancePlanId?: number; // maintenance_plan_detail_id from API, used for updates
}

// Union type for entity data
export type EntityData = ToolData | EquipmentData | MaintenancePlanData;

// Type alias for the entity type handled in infrastructure maintenance plans
export type EntityType = 'tool' | 'equipment' | 'maintenancePlan';

// Component prop types
export interface DataGridSectionProps {
  onAddRow: () => void;
  columns: any[];
  rows: any[];
  title: string;
  error?: string;
}

// Modal form data types
export interface ToolFormData {
  toolType: string;
  status: string;
}

export interface StatusApiResponse {
  status_id: number;
  status_name: string;
}

export interface StatusApiDataResponse {
  data: StatusApiResponse[];
}

export interface ToolsModalProps {
  onSave?: (data: ToolFormData) => void;
  onCancel?: () => void;
  onClose?: () => void;
  initialData?: Partial<ToolFormData>;
  toolsData?: ToolsApiResponse;
  statusData?: StatusApiDataResponse;
}

export interface EquipmentFormData {
  equipmentType: string;
  status: string;
}

export interface EquipmentModalProps {
  onSave?: (data: EquipmentFormData) => void;
  onCancel?: () => void;
  onClose?: () => void;
  initialData?: Partial<EquipmentFormData>;
  equipmentData?: EquipmentsApiResponse;
  statusData?: StatusApiDataResponse;
}

export interface MaintenancePlanFormData {
  maintenanceDescription: string;
  toBeDoneBy: string;
  frequency: string;
  status: string;
}

export interface MaintenancePlanModalProps {
  onSave?: (data: MaintenancePlanFormData) => void;
  onCancel?: () => void;
  onClose?: () => void;
  initialData?: Partial<MaintenancePlanFormData>;
  frequencyData?: FrequenciesApiResponse;
  serviceTypesData?: ServiceTypesApiResponse;
  statusData?: StatusApiDataResponse;
}

// API Payload types
export interface ToolPayload {
  tool_type_id: number | null;
  tool_status: number;
  tool_id?: number; // Optional, only for updates
}

export interface EquipmentPayload {
  equipment_type_id: number | null;
  equipment_status: number;
  equipment_id?: number; // Optional, only for updates
}

export interface MaintenancePlanPayload {
  maintenance_description: string;
  to_be_done: number | null;
  frequency: number | null;
  maintenance_status: number;
  maintenance_plan_id?: number; // Optional, only for updates
}

export interface MaintenancePlanPostPayload {
  infra_category_id: number;
  infra_type: number;
  status: number;
  skill_set_required: number[];
  tools: ToolPayload[];
  equipment_required: EquipmentPayload[];
  maintenance_plan: MaintenancePlanPayload[];
  maintenance_id?: number; // Optional, only for updates
}

