import { useEffect, useState } from 'react'
import { ProjectFormData, fieldLabels } from '@/types/modules/dnd/project'
import { FILE_SIZE_LIMITS } from '@/constants/modules/dnd/project'
import { NUMBERMAP } from '@/constants/common'

type ExcludedKeys =
  | 'tid'
  | 'eid'
  | 'org_id'
  | 'project_id'
  | 'product_sub_type'
  | 'organization_project_id'
type RequiredFieldKeys = Exclude<keyof ProjectFormData, ExcludedKeys>

export const trimValue = (value: any): any =>
  typeof value === 'string' ? value.trim() : value

export const getEngineeringChangeErrors = () => ({
  is_hld_required: '',
  is_pnd_required: '',
  is_feasibility_study_required: '',
})

interface CreatePayloadParams {
  isUpdate: boolean
  projectFormData: ProjectFormData
  createProjectForm: FormData
  documentIdToDelete: number[]
  activeStatus: number
  projectStatus: string
  organizationProjectId: string
  documentsToDelete: string
}

export const createPayload = ({
  isUpdate,
  projectFormData,
  createProjectForm,
  documentIdToDelete,
  activeStatus,
  projectStatus,
  organizationProjectId,
  documentsToDelete,
}: CreatePayloadParams) => {
  if (isUpdate) {
    createProjectForm.append(
      'project_id',
      projectFormData.project_id?.toString()
    )
    createProjectForm.append(projectStatus, projectFormData.status.toString())
    createProjectForm.append(
      organizationProjectId,
      projectFormData.organization_product_id?.toString() ?? ''
    )
    createProjectForm.append(
      documentsToDelete,
      JSON.stringify(documentIdToDelete)
    )

    return {
      projectId: projectFormData.project_id,
      formData: createProjectForm,
    }
  }
  createProjectForm.append(projectStatus, activeStatus.toString())
  return { formData: createProjectForm }
}

export const validateProjectFields = (
  projectFormData: ProjectFormData,
  projectFormDataKeys: (keyof ProjectFormData)[],
  productSubTypeList: any[]
): Partial<Record<RequiredFieldKeys, string>> => {
  const newErrors: Partial<Record<RequiredFieldKeys, string>> = {}
  const skipKeys = [
    'tid',
    'eid',
    'org_id',
    'project_id',
    'organization_project_id',
    'product_sub_type',
  ]

  const isEmpty = (val: any) =>
    val === '' || val === null || (Array.isArray(val) && val.length === 0)

  const setError = (key: RequiredFieldKeys, fallbackLabel = key) => {
    const label = fieldLabels[key] ?? fallbackLabel
    newErrors[key] = `${label} is required`
  }

  projectFormDataKeys.forEach((fieldKey) => {
    if (skipKeys.includes(fieldKey)) return

    const value = projectFormData[fieldKey]
    const trimmedValue = trimValue(value)

    if (fieldKey === 'regulations' && projectFormData.market.length === 0)
      if (
        fieldKey === 'product_sub_type_id' &&
        (!projectFormData.product_type_id || productSubTypeList.length === 0)
      )
        return

    if (fieldKey === 'documents') {
      if (!projectFormData.documents || projectFormData.documents.length === 0)
        return
    }

    if (
      isEmpty(trimmedValue) ||
      (fieldKey === 'steps' && (!trimmedValue || trimmedValue.length === 0))
    ) {
      setError(fieldKey as RequiredFieldKeys)
    }
  })
  return newErrors
}

export const validateFileSize = (
  files: File[],
  setErrors: (prevErrors: any) => void,
  handleInputChange: (name: keyof ProjectFormData, value: any) => void
): File[] => {
  let hasError = false
  const originalFiles: File[] = []

  files.forEach((file) => {
    if (file.size > FILE_SIZE_LIMITS.MAX_SIZE) {
      hasError = true
    } else {
      originalFiles.push(file)
    }
  })

  handleInputChange('documents', originalFiles)

  setErrors((prevErrors: any) => {
    const updatedErrors = { ...prevErrors }
    if (hasError) {
      updatedErrors.documents = FILE_SIZE_LIMITS.ERROR_MESSAGE
    } else {
      updatedErrors.documents = ''
    }
    return updatedErrors
  })

  return originalFiles
}

export function useDebounce<T>(value: T, delay: number = NUMBERMAP.FIVEHUNDRED): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export const getButtonConfig = (
  handleCancel: () => void,
  handleSave: () => void,
  isDisabled: boolean
) => [
  { label: 'Cancel', onClick: handleCancel },
  { label: 'Save', onClick: handleSave, disabled: isDisabled },
]

export const projectListInitialData = {
  data: [],
  rowsAffected: { total_count: 0 },
}

export const initialDataForProjectScreen = { data: [] }

export const projectInitialValue: ProjectFormData = {
  tid: NUMBERMAP.ZERO,
  eid: NUMBERMAP.ZERO,
  org_id: NUMBERMAP.ZERO,
  project_id: NUMBERMAP.ZERO,
  organization_project_id: NUMBERMAP.ZERO,
  status: NUMBERMAP.ZERO,
  project_reason: '',
  is_hld_required: '',
  is_pnd_required: '',
  product_category_id: '',
  product_type_id: null,
  product_sub_type_id: null,
  product_sub_type: '',
  product_name: '',
  product_generic_name: '',
  product_group_id: '',
  is_feasibility_study_required: '',
  product_description: '',
  market: [],
  regulations: [],
  documents: [],
  steps: [
    { id: NUMBERMAP.ONE, title: 'Project Initiation', subtitle: 'Initiation' },
    { id: NUMBERMAP.TWO, title: 'Functional Specification', subtitle: 'Specification' },
    { id: NUMBERMAP.THREE, title: 'Technical Design', subtitle: 'Design' },
    { id: NUMBERMAP.FOUR, title: 'Implementation Phase', subtitle: 'Phase' },
    { id: NUMBERMAP.FIVE, title: 'Communication Protocol', subtitle: 'Phase' },
    { id: NUMBERMAP.SIX, title: 'Interface Specification', subtitle: 'Phase' },
    { id: NUMBERMAP.SEVEN, title: 'Power Supply', subtitle: 'Phase' },
  ],
}
