// Interface for POST payload
export interface ProductLifeDeclarationPayload {
  dir_id: number
  lifetime_calculation_criteria: {
    part_no: string
    description: string
    remarks: string
  }[]
  conclusion: string
}

// Interface for GET response
export interface ProductLifeDeclarationResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: {
    id: number
    dir_id: number
    dir_name: string | null
    step_number: number
    lifetime_calculation_criteria: {
      lifetime_id: number
      part_no: string
      description: string
      remarks: string
    }[]
    conclusion: string
  }
}

export interface LifeTimePopupFormProps {
  onClose?: () => void;
  onSave?: (data: {
    partNo: string;
    description: string;
    remarks: string;
  }) => void;
  hasEditPermission?: boolean;
}

export interface CriteriaData {
  id: string
  sno: string
  partNo: string
  description: string 
  remarks: string
}