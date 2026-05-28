import {
  FormData,
  FormErrors,
  SkillData,
} from '@/types/modules/hr/roleDefinition'
import { VALID_EMPLOYMENT_TYPES } from '@/constants/modules/hr/roleDefinition'
import { emailRegex, numberValidation } from '@/lib/utils/common'

export const validateCompetencyForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {}

  if (!formData.role) {
    errors.role = 'Role is required'
  }

  if (
    !formData.employmentType ||
    !VALID_EMPLOYMENT_TYPES.includes(formData.employmentType)
  ) {
    errors.employmentType = 'Type of Employment is required'
  }

  if (!formData.department) {
    errors.department = 'Department is required'
  }

  if (!formData.reportsTo) {
    errors.reportsTo = 'Reports To is required'
  }

  if (!formData.education) {
    errors.education = 'Educational Qualification is required'
  }

  if (!formData.experience) {
    errors.experience = 'Experience is required'
  }

  if (!formData.jobResponsibilities) {
    errors.jobResponsibilities = 'Job Responsibilities is required'
  }

  if (!formData.expertise) {
    errors.expertise = 'Area of Expertise is required'
  }
  if (!formData.training) {
    errors.training = 'Training & Certifications is required'
  }
  if (!formData.additionalResponsibility) {
    errors.additionalResponsibility = 'Added Responsibility is required'
  }

  return errors
}

export const validateSkill = (
  skill: { skillName: string; skillId: number; levelId: number; levelName: string },
  existingSkills: SkillData[],
  editingSkill: SkillData | null
): string | null => {
  if (!skill.skillName) {
    return 'Skill Name is required'
  }

  if (!skill.levelName) {
    return 'Skill Level is required'
  }

  const isDuplicate = existingSkills.some(
    (existing) =>
      existing.skillId === skill.skillId &&
      existing.levelId === skill.levelId &&
      (!editingSkill || existing.id !== editingSkill.id)
  )

  if (isDuplicate) {
    return 'This skill and level combination already exists'
  }

  return null
}

export const DEFAULT_FORM_DATA: FormData = {
  role: '',
  employmentType: '',
  department: '',
  reportsTo: '',
  education: '',
  experience: '',
  jobResponsibilities: '',
  expertise: '',
  training: '',
  additionalResponsibility: '',
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email)
}

export const validateNumeric = (value: string): boolean => {
  return numberValidation.test(value)
}

export const ERROR_MESSAGES = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidNumber: 'Please enter a valid number',
}
