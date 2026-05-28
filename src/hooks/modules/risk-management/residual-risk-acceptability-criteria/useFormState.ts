/**
 *Classification : Confidential
 **/
import { useState } from 'react'
import { initialFormData } from '@/lib/utils/modules/risk-management/residualRiskCriteriaUtils'
import {
  FormData,
  FormErrors,
  CriteriaSection,
  UseFormStateReturn,
} from '@/types/modules/risk-management/residualRiskCriteria'

export const useFormState = (): UseFormStateReturn => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})

  const updateField = (
    sectionId: keyof FormData,
    field: keyof CriteriaSection,
    value: number | number[] | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value,
      },
    }))

    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [`${sectionId}_${String(field)}`]: undefined,
    }))
  }

  return {
    formData,
    errors,
    setFormData,
    setErrors,
    updateField,
  }
}
