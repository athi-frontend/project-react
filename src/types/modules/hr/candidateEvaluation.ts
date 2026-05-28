export interface FormData {
  resourceRequisitionId: string
  firstName: string
  lastName: string
  role: string
  interviewDate: string
  educationJd: string
  actualEducation: string
  experienceJd: string
  actualExperience: string
  interviewedBy: string[]
  status: string
  comments: string
  justification: string
  skill_level: string
  skill_level_id: string
}

export interface FormErrors {
  resourceRequisitionId?: string
  firstName?: string
  lastName?: string
  interviewDate?: string
  actualEducation?: string
  actualExperience?: string
  interviewedBy?: string
  status?: string
  skills?: string
}

export interface SkillData {
  id: string
  skillName: string
  levelRequired?: string
  levelPossessed?: string
}

export interface ButtonData {
  label: string
  onClick: () => void
  variant: 'text' | 'outlined' | 'contained'
}

export interface CandidateEvaluationResponse {
  candidate_id: number
  candidate_name: string
  date_of_interview: string
  interview_status: string
  candidate_resource_requisition_id : number
  status: number
}

export interface CandidateEvaluationDetailsResponse {
  candidate_id: number
  candidate_name: string
  date_of_interview: string
  actual_educational_qualification: string
  actual_experience: string
  comments: string
  department_id: number
  department_name: string
  role_id: number
  role_name: string
  candidate_recruitment_details_id: number
  interviewed_by: { user_id: number }[]
  candidate_evaluation_skill_set: {
    id: number
    fk_eqms_hr_candidate_evalution_id: number
    fk_eqms_hr_competency_skill_level_mapper_id: number
    fk_eqms_hr_skill_level_lk_id: number
  }[]
  interview_status: string
  interviewed_status_id: number
}

export interface UserContact {
  contact_id: number
  contact_type: string
  contact: string
}

export interface UserRole {
  role_Id: number
  role_name: string | null
}

export interface User {
  id: number
  tenantKey: number
  organizationId: number
  firstName: string
  lastName: string
  nickName: string
  status: number
  contact: UserContact[]
  roles: UserRole[]
  department_id: number
  department_name: string
  designation_id: number | null
  designation_name?: string
  service_group_id: number
  service_group_name: string
  responsibility_id: number
  responsibility: string
}

export interface Skill {
  skill_level_id: number
  skill_level: number
}
