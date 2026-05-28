export interface DesignReviewFormData {
  id?: number
  // designStage: string | number
  execution_stage_id: number
  place: string
  members: string
  topic: string
  minutes: string
  documents: (File | BasicFileObject)[]
  status?: string
  created_at?: string
  updated_at?: string
}

export interface DesignStage {
  id: number
  key: string
  value: string
}

export interface Member {
  id: number
  key: string
  name: string
  value: string
}

export interface UploadedFile {
  id: number
  name: string
  source: string
  uploadDate: string
  category: string
  status: string
  url?: string
}

export interface PayloadParams {
  isUpdate: boolean
  formData: DesignReviewFormData
  createReviewForm: FormData
  documentIdToDelete: number[]
  activeStatus: string
  reviewStatus: string
  organizationReviewId: string
  documentsToDelete: string
}

export interface BasicFileObject {
  id: number
  name: string
  url: string
}
