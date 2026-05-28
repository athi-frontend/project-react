export interface MaterialsBodyFormData {
  part_name: string;
  material: string;
}

export type ModalState = {
  open: boolean
  type: 'contact' | 'noncontact' | null
  mode: 'add' | 'edit'
  editIndex: number | null
  item: MaterialsBodyFormData | undefined
}

export interface MaterialItem {
  id?: string
  part_name: string
  material: string
}

export interface PredicateDeviceItem {
  specification_aspects_id?: number
  product_specification_aspects_id?: number
  predicate_device_company: string
}

export interface SpecificationAspect {
  id: number
  sectionNo: string
  aspects: string
}

export interface PredicateRow {
  id: number
  serialNo: string
  aspects: string
  predicateDeviceCompany: string
}

export interface MaterialRow {
  id: string
  part_name: string
  material: string
  idx: number
  type: 'contact' | 'noncontact'
}

export interface DeviceDescriptionFormData {
  generic_name?: string
  intended_use?: string
  instruction_for_use?: string
  indication?: string
  model_name?: string[]
  model_number?: string
  status?: string
  company_name?: string
  materials_of_construction?: string
  contraindications?: string
  warnings_precautions?: string
  potential_adverse_effects?: string
  intended_patient_population?: string
  accessories_description?: string
  explanation_novel_features?: string
  principle_of_operation?: string
  general_description_key_elements?: string
  various_configurations?: string
  emits_ionizing_radiation?: string
  product_specifications?: string
  previous_generation_device?: string
  predicate_devices_markets?: string
  comparative_analysis?: string
  direct_contact?: MaterialItem[]
  indirect_contact?: MaterialItem[]
  predicate_device?: PredicateDeviceItem[]
  [key: string]: string | string[] | MaterialItem[] | PredicateDeviceItem[] | undefined
}

export interface DeviceDescriptionPayload {
  project_id: number
  generic_name?: string
  intended_use?: string
  instruction_for_use?: string
  indication?: string
  model_name?: string[]
  model_number?: string
  status?: string
  company_name?: string
  materials_of_construction?: string
  contraindications?: string
  warnings_precautions?: string
  potential_adverse_effects?: string
  intended_patient_population?: string
  accessories_description?: string
  explanation_novel_features?: string
  principle_of_operation?: string
  general_description_key_elements?: string
  various_configurations?: string
  emits_ionizing_radiation?: string
  product_specifications?: string
  previous_generation_device?: string
  predicate_devices_markets?: string
  comparative_analysis?: string
  direct_contact?: Omit<MaterialItem, 'id'>[]
  indirect_contact?: Omit<MaterialItem, 'id'>[]
  predicate_device?: Omit<PredicateDeviceItem, 'product_specification_aspects_id'>[]
}

export interface MaterialsBodyModalProps {
  onSave?: (data: MaterialsBodyFormData) => void;
  onCancel?: () => void;
  onClose?: () => void;
  open: boolean;
  defaultValues?: MaterialsBodyFormData;
  title: string;
}