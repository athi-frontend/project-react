export interface UploadedFileData {
  uuid: string;
  id: string
  name: string
  file?: File // Optional if needed only for uploads
  source: string
  uploadDate: string // or Date, but make it match usage
  category: string
  status: string
  document_id?: number // optional if used elsewhere
}

export interface DocumentStructure {
  documents_to_create: string[];
  documents_to_delete: string[];
  create_meta_data: Record<string, string>;
  update_meta_data: Record<string, string>;
  local_files_to_delete: string[];
}

export interface EmployeeList {
  id: number,
  employee_name: string,
  department: string,
  role: string,
  status: number
}

export interface AddEmployee {
   id?: number
   first_name: string
   last_name: string
   employee_id: string
   age: string 
   role: number
   dateOfJoining: string
   department: number
   recruitmentId: number
   candidate_evaluation_id: string
   employmentType: string
   educationalQualification: string
   experience: string
   areaOfExpertise: string
   skillSet: string
   trainingEffectiveness: string
   functional_reports_to_user_id: string
   administrativeReports: Array<{
     site: string
     administrativeReportsTo: string
   }>
   trainingNeeds: TrainingNeed[]
   educationalQualificationAsPerJd?: string
   experienceAsPerJd?: string
   areaOfExpertiseAsPerJd?: string
   responsibilityAsPerJd?: string
   skillRequired?: string
   levelRequired?: string
   levelPossess?: number
}

export interface TrainingNeed {
  id?: number
  skill: string
  skill_name?: string
  skill_id?: number
  fk_eqms_hr_skill_master_id?: number
  dateOfJoining: string
  target_date?: string
  status: string
  source?: string
  source_id?: number
  fk_eqms_hr_employee_source_lk_id?: number
  employee_training_needs_id?: string
  training_supporting_files?: any[]
  level_required?: string
  level_possess?: string
}