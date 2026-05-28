import { FinalFileData } from '@/lib/utils/common'
import { FILE_SECTION_NAMES } from '@/constants/modules/hr/employeeList'
import { 
  prepareDraftDocumentsGeneric, 
  DraftDocumentsConfig 
} from './draftDocumentsCommon'

/**
 * Mapping between formData file field names and draft document section names
 */
const FILE_FIELD_TO_SECTION_MAP: Record<string, string> = {
  qualification_files: FILE_SECTION_NAMES.EDUCATIONAL_QUALIFICATION,
  experience_files: FILE_SECTION_NAMES.EXPERIENCE,
  expertise_files: FILE_SECTION_NAMES.EXPERTISE,
  skill_set_supporting_files: FILE_SECTION_NAMES.SKILL_SET,
  employee_supporting_files: FILE_SECTION_NAMES.EMPLOYEE_SUPPORTING_DOCUMENT,
  training_needs_supporting_files: FILE_SECTION_NAMES.TRAINING_NEEDS,
}

/**
 * Mapping between section types and draft document section names
 */
const SECTION_TYPE_TO_NAME_MAP: Record<string, string> = {
  educationalQualification: FILE_SECTION_NAMES.EDUCATIONAL_QUALIFICATION,
  experience: FILE_SECTION_NAMES.EXPERIENCE,
  areaOfExpertise: FILE_SECTION_NAMES.EXPERTISE,
  skillSet: FILE_SECTION_NAMES.SKILL_SET,
  trainingEffectiveness: FILE_SECTION_NAMES.EMPLOYEE_SUPPORTING_DOCUMENT,
  trainingNeeds: FILE_SECTION_NAMES.TRAINING_NEEDS,
}

/**
 * Helper function to get file ID from different file object types
 */
const getFileId = (file: any): string | number | undefined => {
  if (file?.file_id) return file.file_id
  if (file?.document_id) return file.document_id
  if (file?.id) return file.id
  if (file?.fk_eqms_file_id) return file.fk_eqms_file_id
  return undefined
}

/**
 * Convert formData file fields to draftDocuments format
 * Handles both formData (with field names like qualification_files) and draftData (with section names)
 */
export const formDraftData = (
  formData: any,
  draftData?: any
): Record<string, any[]> => {
  let draftDocuments: Record<string, any[]> = {}

  // If draftData exists with draftDocuments (from draftData.data.draftDocuments or draftData.draftDocuments), use that directly
  const draftDocumentsSource = draftData?.data?.draftDocuments ?? draftData?.draftDocuments
  if (draftDocumentsSource && typeof draftDocumentsSource === 'object') {
    Object.keys(draftDocumentsSource).forEach((key) => {
      if (draftDocumentsSource[key] && Array.isArray(draftDocumentsSource[key])) {
        draftDocuments[key] = draftDocumentsSource[key]
      }
    })
    if (Object.keys(draftDocuments).length > 0) {
      return draftDocuments
    }
  }

  // Otherwise, map from formData file fields to draft section names
  Object.entries(FILE_FIELD_TO_SECTION_MAP).forEach(([formField, sectionName]) => {
    if (formData?.[formField] && Array.isArray(formData[formField])) {
      draftDocuments[sectionName] = formData[formField]
    }
  })

  return draftDocuments
}

/**
 * Get documents to delete from formData
 * Extracts file IDs from formData file fields
 */
export const handleDocumentsToDelete = (formData: any): string[] => {
  let documentsToDelete: string[] = []

  Object.keys(FILE_FIELD_TO_SECTION_MAP).forEach((formField) => {
    if (formData?.[formField] && Array.isArray(formData[formField])) {
      const fileIds = formData[formField]
        .map((file: any) => getFileId(file))
        .filter((id: any) => id !== undefined && id !== null)
      documentsToDelete.push(...fileIds.map(String))
    }
  })

  return documentsToDelete
}

/**
 * Handle create metadata for draft save
 * Maps FinalFileData create_meta_data to section-based structure
 */
export const handleCreateMetaData = (
  documents: FinalFileData,
  type?: string
): Record<string, any> => {
  if (!type || !documents?.create_meta_data) return {}

  const sectionName = SECTION_TYPE_TO_NAME_MAP[type]
  if (!sectionName) return {}

  return {
    [sectionName]: documents.create_meta_data,
  }
}

/**
 * Helper function to check if a document exists in draftData.data.documents
 * Checks multiple possible ID fields to match documents
 */
const isDocumentInDraftData = (
  docId: string,
  draftData?: any
): boolean => {
  if (!draftData?.data?.documents || !Array.isArray(draftData.data.documents)) {
    return false
  }
  
  const normalizedDocId = String(docId).trim()
  
  return draftData.data.documents.some((doc: any) => {
    // Try multiple ID field variations
    const possibleIds = [
      doc.file_id,
      doc.document_id,
      doc.id,
      doc.fk_eqms_file_id,
      doc.media_id,
      getFileId(doc),
    ].filter(id => id !== undefined && id !== null)
    
    return possibleIds.some(id => String(id).trim() === normalizedDocId)
  })
}

/**
 * Filter deleted documents from draftDocuments and prepare delete list
 * Handles deletion tracking for draft documents
 * 
 * @param draftDocuments - Current draft documents
 * @param documents - FinalFileData with documents to delete
 * @param type - Section type
 * @param draftData - Draft data from API to check if documents exist in server
 */
export const handleDocumentsToDeleteDraft = (
  draftDocuments: Record<string, any[]>,
  documents: FinalFileData,
  type?: string,
  draftData?: any
): {
  documents_to_delete: string[] // Documents from server (draftData.data.documents) that should be deleted
  draftDeleteItems: string[] // Documents that exist only in draftDocuments (not in draftData.data.documents)
  filteredDraftDocuments: Record<string, any[]>
} => {
  let documentsToDelete: string[] = [] // Server documents to delete
  let draftDeleteItems: string[] = [] // Draft-only documents to delete
  const filteredDraftDocuments: Record<string, any[]> = { ...draftDocuments }

  if (!type || !documents?.documents_to_delete) {
    return {
      documents_to_delete: documentsToDelete,
      draftDeleteItems,
      filteredDraftDocuments,
    }
  }

  const sectionName = SECTION_TYPE_TO_NAME_MAP[type]
  if (!sectionName || !filteredDraftDocuments[sectionName]) {
    return {
      documents_to_delete: documentsToDelete,
      draftDeleteItems,
      filteredDraftDocuments,
    }
  }

  // Get current documents in this section
  const currentDocuments = filteredDraftDocuments[sectionName] ?? []

  // Extract delete IDs from documents
  const deleteIds = documents.documents_to_delete.map(String)

  // Process each document ID that needs to be deleted
  deleteIds.forEach((docId) => {
    // Check if this document exists in draftData.data.documents (server document)
    if (isDocumentInDraftData(docId, draftData)) {
      // Server document - add to documentsToDelete
      documentsToDelete.push(docId)
    } else {
      // Check if document exists in current draftDocuments
      const existsInDraft = currentDocuments.some((doc: any) => {
        const currentDocId = String(getFileId(doc))
        return currentDocId === docId
      })
      
      if (existsInDraft) {
        // Draft-only document that exists in draftDocuments - add to draftDeleteItems
        draftDeleteItems.push(docId)
      }
    }
  })

  // Filter out deleted documents from draftDocuments
  filteredDraftDocuments[sectionName] = currentDocuments.filter((doc: any) => {
    const docId = String(getFileId(doc))
    return !deleteIds.includes(docId)
  })

  return {
    documents_to_delete: documentsToDelete,
    draftDeleteItems,
    filteredDraftDocuments,
  }
}

/**
 * Handle update metadata for draft documents
 * Only updates files that exist in draftDocuments
 */
export const handleUpdateMetaData = (
  draftDocuments: Record<string, any[]>,
  documents: FinalFileData,
  type?: string
): {
  update_meta_data: Record<string, any>
  filteredDraftDocuments: Record<string, any[]>
} => {
  const updateMetaData: Record<string, any> = {}
  const filteredDraftDocuments: Record<string, any[]> = { ...draftDocuments }

  if (!type || !documents?.update_meta_data) {
    return {
      update_meta_data: updateMetaData,
      filteredDraftDocuments,
    }
  }

  const sectionName = SECTION_TYPE_TO_NAME_MAP[type]
  if (!sectionName || !filteredDraftDocuments[sectionName]) {
    return {
      update_meta_data: updateMetaData,
      filteredDraftDocuments,
    }
  }

  const currentDocuments = filteredDraftDocuments[sectionName] ?? []
  const updateMetaEntries = Object.entries(documents.update_meta_data ?? {})

  // Only include updates for files that exist in draftDocuments
  updateMetaEntries.forEach(([fileId, metaData]) => {
    const fileExists = currentDocuments.some((doc: any) => {
      const docId = String(getFileId(doc))
      return docId === String(fileId)
    })

    if (fileExists) {
      updateMetaData[sectionName] ??= {}
      updateMetaData[sectionName][fileId] = metaData
    }
  })

  return {
    update_meta_data: updateMetaData,
    filteredDraftDocuments,
  }
}

/**
 * Get existing draftDelete from draftData
 * Merges with new deletions to maintain a cumulative list
 */
export const getDraftDelete = (
  draftData?: any,
  newDeletions: string[] = []
): string[] => {
  // Get existing draftDelete from draftData
  const existingDraftDelete = 
    draftData?.data?.draftDelete ?? 
    draftData?.draftDelete ?? 
    []

  // Combine with new deletions and remove duplicates
  const allDeletions = [...existingDraftDelete, ...newDeletions]
  return Array.from(new Set(allDeletions)).filter(
    (id) => id !== null && id !== undefined && id !== ''
  )
}

/**
 * Employee-specific configuration for draft documents
 */
export const EMPLOYEE_DRAFT_CONFIG: DraftDocumentsConfig = {
  fileFieldToSectionMap: {
    qualification_files: FILE_SECTION_NAMES.EDUCATIONAL_QUALIFICATION,
    experience_files: FILE_SECTION_NAMES.EXPERIENCE,
    expertise_files: FILE_SECTION_NAMES.EXPERTISE,
    skill_set_supporting_files: FILE_SECTION_NAMES.SKILL_SET,
    employee_supporting_files: FILE_SECTION_NAMES.EMPLOYEE_SUPPORTING_DOCUMENT,
    training_needs_supporting_files: FILE_SECTION_NAMES.TRAINING_NEEDS,
  },
  sectionTypeToNameMap: {
    educationalQualification: FILE_SECTION_NAMES.EDUCATIONAL_QUALIFICATION,
    experience: FILE_SECTION_NAMES.EXPERIENCE,
    areaOfExpertise: FILE_SECTION_NAMES.EXPERTISE,
    skillSet: FILE_SECTION_NAMES.SKILL_SET,
    trainingEffectiveness: FILE_SECTION_NAMES.EMPLOYEE_SUPPORTING_DOCUMENT,
    trainingNeeds: FILE_SECTION_NAMES.TRAINING_NEEDS,
  },
     responseDataKeyMap: {
      educationalQualification: FILE_SECTION_NAMES.EDUCATIONAL_QUALIFICATION,
    experience: FILE_SECTION_NAMES.EXPERIENCE,
    areaOfExpertise: FILE_SECTION_NAMES.EXPERTISE,
    skillSet: FILE_SECTION_NAMES.SKILL_SET,
    trainingEffectiveness: FILE_SECTION_NAMES.EMPLOYEE_SUPPORTING_DOCUMENT,
    trainingNeeds: FILE_SECTION_NAMES.TRAINING_NEEDS,
      },
}

/**
 * Comprehensive function to prepare draft documents with create, update, and delete handling
 * This is a wrapper around the generic function with employee-specific configuration
 */
export const prepareDraftDocuments = (
  existingDraftDocuments: Record<string, any[]>,
  existingDraftDelete: string[],
  formData: any,
  finalDocuments: {
    educationalQualification?: FinalFileData
    experience?: FinalFileData
    areaOfExpertise?: FinalFileData
    skillSet?: FinalFileData
    trainingEffectiveness?: FinalFileData
    trainingNeeds?: FinalFileData
  },
  draftData?: any
): {
  draftDocuments: Record<string, any[]>
  createMetaData: Record<string, any>
  updateMetaData: Record<string, any>
  documentsToDelete: string[]
  draftDelete: string[]
  documentsToPreserve: string[]
} => {
  const result = prepareDraftDocumentsGeneric(
    existingDraftDocuments,
    existingDraftDelete,
    formData,
    finalDocuments,
    draftData,
    EMPLOYEE_DRAFT_CONFIG
  )
  
  // Flatten structured documentsToDelete into an array for employee module
  const flattenedDocumentsToDelete: string[] = []
  if (result.documentsToDelete && typeof result.documentsToDelete === 'object') {
    Object.values(result.documentsToDelete).forEach((docType: any) => {
      if (docType?.eqms_file_id && Array.isArray(docType.eqms_file_id)) {
        flattenedDocumentsToDelete.push(...docType.eqms_file_id.map(String))
      }
    })
  }
  
  // Flatten draftDelete if it's a Record
  return {
    ...result,
    documentsToDelete: flattenedDocumentsToDelete,
    draftDelete: result.draftDelete
  }
}

