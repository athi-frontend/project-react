import { FinalFileData, mapDocumentsByCategory, mapFileResponse } from '@/lib/utils/common'
import { NUMBERMAP, FINALFILEINITIALDATA } from '@/constants/common'
import { prepareDraftDocumentsGeneric, DraftDocumentsConfig } from '@/lib/utils/modules/hr/draftDocumentsCommon'

interface CreateFileMetadataParams {
  isEditMode: boolean
  draftData: any
  existingData: any
  finalFileData: FinalFileData
  dataPath?: string // For accessing nested data like data[NUMBERMAP.ZERO] or data.documents
}

/**
 * Common utility function to create file metadata for draft save
 * Handles merging draft documents with existing documents and preparing metadata
 */
export const createFileMetadata = ({
  isEditMode,
  draftData,
  existingData,
  finalFileData,
  dataPath = 'documents',
}: CreateFileMetadataParams) => {
  // Get preserved document IDs from draft or existing data
  const getDocumentsFromData = (data: any): any[] => {
    if (!data) return []
    
    // Handle array response like data[NUMBERMAP.ZERO]?.documents
    if (Array.isArray(data)) {
      return data[NUMBERMAP.ZERO]?.[dataPath] ?? []
    }
    
    // Handle object response
    if (typeof data === 'object') {
      // Check if dataPath is 'documents' and data has documents array
      if (dataPath === 'documents' && Array.isArray(data.documents)) {
        return data.documents
      }
      // Check if dataPath is nested like 'data.documents'
      const pathParts = dataPath.split('.')
      let result = data
      for (const part of pathParts) {
        result = result?.[part]
        if (!result) return []
      }
      return Array.isArray(result) ? result : []
    }
    
    return []
  }

  const preservedDocumentIds = [
    ...getDocumentsFromData(!isEditMode ? draftData?.data : existingData?.data),
  ]
    .map((doc: any) =>
      doc?.file_id ?? doc?.id ?? doc?.document_id ?? doc?.fk_eqms_file_id
    )
    .filter(Boolean)
    .map(String)

  // Get drafted data - prioritize draft data in create mode, existing data in edit mode
  let draftedDatas = !isEditMode ? draftData?.data : existingData?.data
  // Handle array response for existing data
  if (isEditMode && Array.isArray(existingData?.data) && existingData.data.length > NUMBERMAP.ZERO) {
    draftedDatas = existingData.data[NUMBERMAP.ZERO]
  }
  
  // Handle array response for draft data
  if (!isEditMode && Array.isArray(draftData?.data)) {
    draftedDatas = draftData.data
  }

  let structuredDraftDocuments = mapDocumentsByCategory(draftedDatas?.draftDocuments ?? []) ?? []
  const draftedDocuments = structuredDraftDocuments?.[dataPath] ?? []
  const draftedDeleteDocs = draftedDatas?.draftDelete?.[dataPath] ?? []
  const shallowFinalFileData = {...(finalFileData??FINALFILEINITIALDATA)}
  let create_meta_data: Record<string, any> = {...(shallowFinalFileData.create_meta_data ?? {}) }
  let update_meta_data: Record<string, any> = {...(shallowFinalFileData.update_meta_data ?? {})}
  let documents_to_delete: number[] = [...(shallowFinalFileData.documents_to_delete ?? [])]?.map(Number)
  let updateDocument = (!Array.isArray(existingData?.data) && isEditMode) || !isEditMode

  // Process drafted documents and existing documents
  const {update_meta_data_draft,create_meta_data_draft} = createUpdateMetaData(draftedDatas,updateDocument,documents_to_delete,draftedDocuments)
  // Process draft delete documents
  create_meta_data = {...create_meta_data,...create_meta_data_draft}
  update_meta_data = {...update_meta_data,...update_meta_data_draft}

  if (draftedDeleteDocs.length > NUMBERMAP.ZERO) {
    draftedDeleteDocs.forEach((fileId: string | number) => {
      if (!preservedDocumentIds.includes(String(fileId)) && !documents_to_delete.includes(Number(fileId))) {
        documents_to_delete.push(Number(fileId))
      }
    })
  }
  if(draftedDatas?.documents){
    documents_to_delete = documents_to_delete.filter(
  id => !draftedDatas?.documents?.some(
    doc => doc?.file_id == id
  )
  )
  }

  return {
    create_meta_data: Object.keys(create_meta_data).length > NUMBERMAP.ZERO ? create_meta_data : {},
    update_meta_data: Object.keys(update_meta_data).length > NUMBERMAP.ZERO ? update_meta_data : {},
    documents_to_delete: documents_to_delete.length > NUMBERMAP.ZERO ? documents_to_delete : [],
  }
}

const createUpdateMetaData = (draftedDatas,updateDocument,documents_to_delete,draftedDocuments)=>{
  let update_meta_data = {}
  let create_meta_data = {}
  const allDocuments =  [...(mapFileResponse(draftedDatas?.documents ?? []))]
  if (allDocuments.length > NUMBERMAP.ZERO && updateDocument) {
    allDocuments.forEach((doc: any) => {
      if (doc.file_id && !documents_to_delete.includes(doc.file_id)) {
        create_meta_data[doc.file_id + doc.file_name] = doc
        if (doc.source != '') {
          update_meta_data[doc.file_id] = doc
        }
      }
    })
  }
  if (draftedDocuments.length > NUMBERMAP.ZERO && updateDocument) {
    draftedDocuments.forEach((doc: any) => {
      if (doc.file_id && !documents_to_delete?.includes(doc?.file_id)) {
        if (doc.source != '') {
          update_meta_data[doc.file_id] = doc
        }
      }
    })
  }
  return {update_meta_data_draft:update_meta_data,create_meta_data_draft:create_meta_data}
}
/**
 * Helper function to process draft delete array
 * Converts object or array to flat array
 */
export const processDraftDelete = (draftDelete: any): string[] => {
  if (Array.isArray(draftDelete)) {
    return draftDelete
  }
  if (typeof draftDelete === 'object' && draftDelete !== null) {
    return Object.values(draftDelete).flat() as string[]
  }
  return []
}

/**
 * Interface for prepareDraftSave parameters
 */
export interface PrepareDraftSaveParams {
  draftDocuments: Record<string, any[]>
  draftDelete: string[] | Record<string, string[]>
  setDraftDocuments: (documents: Record<string, any[]>) => void
  setDraftDelete: (deleteItems: string[]) => void
  formDataToSave: any
  fieldValue: any[] // Field value to be passed (e.g., formDataToSave.logo ?? [])
  finalFileDataValue: FinalFileData
  draftDatas: any
  fieldName: string // e.g., 'logo' or 'documents'
  responseDataKey: string // e.g., 'supporting_files' or 'documents'
}

/**
 * Common function to prepare draft documents and clean form data
 * Handles the duplicate code pattern across vendor-re-evaluation-criteria,
 * vendor-selection-criteria, sample-order, and part-category
 */
export const prepareDraftSave = ({
  draftDocuments,
  draftDelete,
  setDraftDocuments,
  setDraftDelete,
  formDataToSave,
  fieldValue,
  finalFileDataValue,
  draftDatas,
  fieldName,
  responseDataKey,
}: PrepareDraftSaveParams) => {
  const draftConfig: DraftDocumentsConfig = {
    fileFieldToSectionMap: { [fieldName]: fieldName },
    sectionTypeToNameMap: { [fieldName]: fieldName },
    responseDataKeyMap: { [fieldName]: responseDataKey },
  }

  const draftPreparation = prepareDraftDocumentsGeneric(
    draftDocuments,
    draftDelete,
    { ...formDataToSave, [fieldName]: fieldValue },
    { [fieldName]: finalFileDataValue ?? FINALFILEINITIALDATA },
    draftDatas,
    draftConfig
  )

  if (draftPreparation.draftDocuments) {
    setDraftDocuments(draftPreparation.draftDocuments)
  }

  if (draftPreparation.draftDelete) {
    const deleteArray = Array.isArray(draftPreparation.draftDelete)
      ? draftPreparation.draftDelete
      : Object.values(draftPreparation.draftDelete).flat()
    setDraftDelete(deleteArray)
  }

  const fieldsToRemove = [fieldName]
  const Obj = { ...formDataToSave }
  const cleaned = Object.fromEntries(
    Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key))
  )

  return {
    cleaned,
    draftPreparation,
  }
}

