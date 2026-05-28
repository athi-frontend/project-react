import { UseMutateFunction } from '@tanstack/react-query'
import { IntendedUseFormData, FormErrors } from '@/types/modules/dnd/intendedUse'

export const handleChange = (
  field: keyof IntendedUseFormData,
  value: any,
  setFormData: React.Dispatch<React.SetStateAction<IntendedUseFormData>>,
  setErrors?: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }))
  
  // Clear error for the field being changed
  if (setErrors) {
    setErrors((prev: FormErrors) => ({
      ...prev,
      [field]: '',
    }))
  }
}

export const handleModelChange = (
  selectedValues: string[],
  modelOptionsData: { key: string; value: string }[],
  setFormData: React.Dispatch<React.SetStateAction<IntendedUseFormData>>,
  setSelectedModelKeys: React.Dispatch<React.SetStateAction<string[]>>,
  setErrors?: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  handleChange('models_name', selectedValues, setFormData, setErrors)

  const selectedKeys =
    modelOptionsData
      ?.filter((option) => selectedValues.includes(option.value))
      .map((option) => option.model_id) ?? []
  setSelectedModelKeys(selectedKeys)
}

export const handleSave = (
  formData: IntendedUseFormData,
  mutation: UseMutateFunction<any, unknown, any, unknown>,
  ProjectId: string,
  onSuccess?: () => void
) => {
  const requestData = {
    project_id: Number(ProjectId),
    intended_use: formData.intendedUse,
    intended_user: formData.intendedUsers,
    indication_use: formData.indicationsOfUse,
    intended_population: formData.intendedPopulation,
    use_environment: formData.useEnvironment,
    contra_indication_use: formData.contraIndicationsOfUse,
  }

  mutation(requestData, {
    onSuccess: () => {
      onSuccess?.()
    }
  })
}

export const handleCancel = (onCancel?: () => void) => {
  if (onCancel) {
    onCancel()
  }
}
