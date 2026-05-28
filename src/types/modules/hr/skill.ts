import { FILE_SECTION_TABLES } from "@/constants/modules/hr/skill"

export interface Skill {
  skill_id: number
  skill_name: string
  status: 0 | 1
  documents: Document[]
}
export interface Skillresponse {
  data: Skill[]
  code: number
}
export interface Document {
  file_category_id: number
  file_size: any
  uploaded_date: string
  state: number
  file_description: string
  purpose: string
  file_name: any
  file_id: number
  name: string
  document_object_key: string
  source?: string
  file_category?: string | null
  status: number
  size: number
  extension: string
  created_date: string
  file_tags: FileTag[]
}

export interface FileTag {
  tag_id: number
  tag_name: string
}

export interface FetchAllSkillsResponse {
  code: number
  status: 'success' | 'error'
  message: string
  response_timestamp: string
  data: Skill[]
}

export interface FetchSkillByIdResponse {
  code: number
  status: 'success' | 'error'
  message: string
  response_timestamp: string
  data: Skill[]
}

export interface AddSkillFormData {
  skillName: string
  uploadedFile: any[]
}

export interface AddSkillFormErrors {
  skillName: string
}

export interface DocumentStructure {
  documents_to_create: any[]
  documents_to_delete: any[]
  create_meta_data: Record<string, any>
  update_meta_data: Record<string, any>
  local_files_to_delete: any[]
}

export interface AddSkillPopupFormProps {
  draftSkills: Skill[]
  onClose: () => void
  onSave: (data: AddSkillFormData) => void
  mode: 'add' | 'edit'
  skillId?: number,
  editSkillModal:boolean,
  skillModal:boolean
}
export type FileSection = keyof typeof FILE_SECTION_TABLES