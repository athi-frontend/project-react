export interface ProjectStagesFormData {
  design_stage: string
  stage_id: string
  stage_count: string
  typeOfStage?: string
  project_id?: string | number
}

export interface ProjectStagesFormProps {
  onSave: (data: ProjectStagesFormData) => void
  onClose: () => void
  open: boolean
  initialData?: ProjectStagesFormData
}
