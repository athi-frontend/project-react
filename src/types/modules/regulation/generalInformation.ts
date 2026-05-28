export interface GeneralInformationData {
  organization_site_id: number
  site: string
  site_address: string
  company_profile: string
  facility_profile: string
  manufacturing_activity: string
  other_manufacturing_activity: string
  exact_address: string
  product_manufactured_type: string
  site_short_description: string
  outside_tech_assistance: string
  qms_short_description: string
  employees_engaged?: {
    department_id: number
    no_of_effective_personnel: number
  }[]
  department_user_counts?: {
    department_id: number
    department_name: string
    user_count: number
  }[]
}

export interface GeneralInformationResponse {
  data: GeneralInformationData[]
}

export interface EmployeeEngaged {
  department_id: number
  department_name: string
  no_of_effective_personnel: number
}

export interface EmployeesEngagedResponse {
  data: EmployeeEngaged[]
}

export interface DepartmentData {
  id: string
  department: string
  noOfEffectivePersonnel: string
}