export interface IntendedUseFormProps {
  onSave?: (formData: IntendedUseFormData) => void
  onCancel?: () => void
  ProjectId: string | number
}

export interface IntendedPopulationItem {
  id?: number
  value: string
  status: number
  status_name?: string
  sno?: number
}

export interface IntendedUsersItem {
  id?: number
  value: string
  status: number
  status_name?: string
  sno?: number
}

export interface IndicationsOfUseItem {
  id?: number
  value: string
  status: number
  model_ids?: number[]
  model_names?: string[]
  status_name?: string
  sno?: number
}

export interface IntendedUseFormData {
  productName: string
  intendedUse: string
  intendedPopulation: IntendedPopulationItem[]
  intendedUsers: IntendedUsersItem[]
  indicationsOfUse: IndicationsOfUseItem[]
  contraIndicationsOfUse: string
  useEnvironment: number[]
}

export interface FormErrors {
  intendedUse?: string
  intendedPopulation?: string
  intendedUsers?: string
  indicationsOfUse?: string
  contraIndicationsOfUse?: string
  useEnvironment?: string
}
