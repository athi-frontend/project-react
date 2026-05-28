export interface DesignInputFormData {
  isSoftwareApplicable: string
  isUsabilityRequirementsApplicable: string
  isPOVApplicable: string
  isFRSApplicable: string
}

export interface PopupFormProps {
  onSave: (data: DesignInputFormData) => void
  onClose: () => void
  open: boolean
  initialData?: DesignInputFormData
}
