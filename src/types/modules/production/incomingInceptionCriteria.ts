/**
 * Classification: Confidential
 */
export interface IncomingInspectionCriteriaModalProps {
    open: boolean
    onClose: () => void
    onSave: (data: any) => void
    initialData?: any
    criteriaId?: number
    criteriaDetails?: any[]
  }
  
  export interface CriteriaFormProps {
    partAssemblyDetailId?: number
    assemblyPartItemDetailId?: number
  }
  
  // Types moved from services/modules/production/incomingInspectionCriteria.ts
  export interface IncomingInspectionCriteriaItem {
    incoming_inspection_criteria_id: number;
    part_type_name: string;
    part_sub_type_name: string;
    part_sub_class_name: string;
    part_category_name: string;
    status: number;
  }
  
  export interface IncomingInspectionCriteriaResponse {
    data: IncomingInspectionCriteriaItem[];
  }
  
  export interface InspectionGroupItem {
    group_id: number;
    group_value: string;
    status: number;
  }
  
  export interface InspectionGroupListResponse {
    data: InspectionGroupItem[];
  }
  
  export interface CriteriaItem {
    sub_group_id: number;
    sub_group_value: string;
    group_id: number;
    status: number;
  }
  
  export interface CriteriaListResponse {
    data: CriteriaItem[];
  }