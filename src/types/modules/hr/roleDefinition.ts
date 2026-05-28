export interface FormData {
  role: string
  employmentType: string
  department: string
  reportsTo: string
  education: string
  experience: string
  jobResponsibilities: string
  expertise: string
  training: string
  additionalResponsibility: string
}

export interface FormErrors {
  role?: string
  employmentType?: string
  department?: string
  reportsTo?: string
  education?: string
  experience?: string
  jobResponsibilities?: string
  expertise?: string
  training?: string
  additionalResponsibility?: string
}

export interface SkillData {
  id: string
  skill_level_mapper_id: number
  skillId: number
  skillName: string
  levelId: number
  levelName: string
}

export interface SkillFormData {
  skillName: string
  level: string
}

export interface SkillFormErrors {
  skillName?: string
  level?: string
}

export interface Option {
  key: string
  value: string
}

export interface EmploymentTypeOption {
  type_of_employment_id: number
  employment_type: string
}

export interface AddSkillFormData {
  skill_level_mapper_id?: number
  skillId: number
  skillName: string
 levelId: number
  levelName: string
}

export interface AddSkillFormErrors {
 skillId?: string
  levelId?: string
  [key: string]: string | undefined
}

export interface AddSkillOption {
  key: string
  value: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  nickName: string
  status: number
  contact: Array<{ contact_id: number; contact_type: string; contact: string }>
  roles: Array<{ role_Id: number; role_name: string | null }>
  department_id: number
  department_name: string
  employment_type: string
  designation_id: number | null
  designation_name: string | null
  service_group_id: number
  service_group_name: string
  responsibility_id: number
  responsibility: string
}

export interface Skill {
  skill_id: number
  skill_name: string
  status: number
}

export interface SkillLevel {
  skill_level_id: number
  skill_level: number
  status: number
}

export interface EmploymentType {
  type_of_employment_id: number
  employment_type: string
  status: number
}
