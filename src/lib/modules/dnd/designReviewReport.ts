import {
  DesignReviewFormData,
  PayloadParams,
} from '@/types/modules/design-review'
import { BUTTON_CONFIG } from '@/constants/modules/dnd/designReviewReport'
import { useState, useEffect } from 'react'
import { NUMBERMAP } from '@/constants/common'

export const designReviewInitialValue: DesignReviewFormData = {
  execution_stage_id: NUMBERMAP.ZERO,
  place: '',
  members: '',
  topic: '',
  minutes: '',
  documents: [],
}

export const  intial_form_data = {   
    project_quality_plan_id: '',
    item_for_test: '',
    uploadedFile: [],
    stage_name: '',
    stage_number: '',
    item_for_test_id: NUMBERMAP.ZERO,
    test_method_acceptance_criteria: '',
    parameters_for_inspection: [],
}
export const validateDesignReviewFields = (
  formData: DesignReviewFormData,
  formDataKeys: (keyof DesignReviewFormData)[]
) => {
  const errors: Partial<Record<keyof DesignReviewFormData, string>> = {}

  const isEmpty = (value: any) => {
    return (
      value === undefined ||
      value === null ||
      value.trim() === '' ||
      (Array.isArray(value) && value.length === NUMBERMAP.ZERO)
    )
  }

  const requiredFields: Record<string, string> = {
    // designStage: 'Design Stage is required',
    // place: 'Place is required',
    // members: 'At least one member is required',
    topic: 'Topic is required',
    minutes: 'Minutes of Meeting is required',
    // documents: 'At least one document is required',
  }

  formDataKeys.forEach((key) => {
    if (requiredFields[key] && isEmpty(formData[key])) {
      errors[key] = requiredFields[key]
    }
  })

  return errors
}

export const createPayload = ({
  isUpdate,
  formData,
  createReviewForm,
  documentIdToDelete,
  activeStatus,
  reviewStatus,
  organizationReviewId,
  documentsToDelete,
}: PayloadParams) => {
  if (isUpdate) {
    createReviewForm.append(reviewStatus, activeStatus)
    createReviewForm.append(organizationReviewId, formData.id?.toString() ?? '')

    if (documentIdToDelete.length > 0) {
      documentIdToDelete.forEach((id) => {
        createReviewForm.append(documentsToDelete, id.toString())
      })
    }

    return createReviewForm
  }

  createReviewForm.append(reviewStatus, activeStatus)
  return createReviewForm
}

export const getButtonConfig = (
  handleCancel: () => void,
  handleSave: () => void,
  isDisabled: boolean
) => {
  return BUTTON_CONFIG.map((button) => {
    if (button.key === 'cancel') {
      return {
        label: button.label,
        onClick: handleCancel,
        disabled: isDisabled,
      }
    }
    if (button.key === 'save') {
      return {
        label: button.label,
        onClick: handleSave,
        disabled: isDisabled,
      }
    }
    return {
      label: button.label,
      onClick: () => {},
      disabled: isDisabled,
    }
  })
}

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
