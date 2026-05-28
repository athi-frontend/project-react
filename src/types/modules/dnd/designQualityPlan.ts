export interface DesignQualityFormData {
  stage_name: string
  stage_number?: number
  quality_objective: string
  itemForTest: string | number
  parametersForInspection: string[]
  testMethodsAndCriteria: string
  design_quality_plan_id?: string
  stage_order_id?: string
}

export interface DesignQualityErrorFormData {
  quality_objective: string
  parametersForInspection: string
  testMethodsAndCriteria: string
}

export interface ParameterOption {
  specification_applicability_id: number
  specification_type: string
}

export interface DesignQualityPlanProps {
  onSave: (data: DesignQualityFormData) => void
  onClose: () => void
  open: boolean
  initialData?: DesignQualityFormData
  stageOrderId?: number
  hasEditPermission?: boolean
}

