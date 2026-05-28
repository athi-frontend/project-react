import { RecruitmentFormData } from '@/types/modules/hr/resourceRequistion'
import { FORMFIELDNAMES } from '@/constants/modules/hr/resourceRequisition'
import { DecimalNumber, numberValidation } from '@/lib/utils/common'

export const DEFAULT_FORM_DATA: RecruitmentFormData = {
  resourceRequired: '',
  product: '',
  reportsTo: '',
  estimatedCTC: '',
  onboardBy: '',
  openings: '',
  role: '',
  department: '',
  recruitmentType: '',
  description: '',
}

export const NUMERIC_REGEX = /^\d+$/

export const InputProps = {
  NUMERIC: {
    inputMode: 'numeric' as const,
    pattern: '[0-9]*',
  },
  DECIMAL: {
    inputMode: 'decimal' as const,
  },
}

export const ERROR_MESSAGES = {
  resourceRequired: 'Resource Required is required',
  product: 'Product is required',
  reportsTo: 'Reports to is required',
  estimatedCTC: 'Estimated CTC is required',
  onboardBy: 'Onboard by is required',
  openings: 'Number of Openings is required',
  invalidOpenings: 'Number of Openings is required',
  role: 'Role is required',
  department: 'Department is required',
  recruitmentType: 'Recruitment Type is required',
  description: 'Description is required',
}

export const REQUIRED_FIELDS = [
  FORMFIELDNAMES.RESOURCE_REQUIRED,
  FORMFIELDNAMES.REPORTS_TO,
  FORMFIELDNAMES.ESTIMATED_CTC,
  FORMFIELDNAMES.ONBOARD_BY,
  FORMFIELDNAMES.OPENINGS,
  FORMFIELDNAMES.ROLE,
  FORMFIELDNAMES.DEPARTMENT,
  FORMFIELDNAMES.RECRUITMENT_TYPE,
  FORMFIELDNAMES.DESCRIPTION,
]

export const validateNumeric = (value: string): boolean => {
  return numberValidation.test(value)
}

export const validateDecimal = (value: string): boolean => {
  return DecimalNumber.test(value)
}
