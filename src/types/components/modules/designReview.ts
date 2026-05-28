export interface DesignReviewFormData {
  designStage: string
  place: string
  members: string[]
  topic: string
  minutesOfMeeting: string
  files: File[]
}

export interface UploadedFile {
  id: string
  name: string
  source: string
  uploadDate: string
  category: string
  status: string
}

export interface DesignReviewFormProps {
  initialData?: Partial<DesignReviewFormData>
  onSubmit?: (data: DesignReviewFormData) => void
  onSave?: (data: DesignReviewFormData) => void
  onCancel?: () => void
}
