/**
 * Classification: Confidential
 * 
 * Utility functions for handling preserved documents in draft save scenarios
 * These functions help filter out documents that exist in draftData.data.documents
 * to prevent conflicts during draft save operations
 */

/**
 * Helper function to get file ID from different file object types
 */
const getFileId = (file: any): string | number | undefined => {
  if (file?.file_id) return file.file_id
  if (file?.document_id) return file.document_id
  if (file?.id) return file.id
  if (file?.fk_eqms_file_id) return file.fk_eqms_file_id
  if (file?.media_id) return file.media_id
  return undefined
}

/**
 * Extract preserved document IDs from draftData.data.documents
 * Returns an array of file IDs (as strings) that should be preserved
 * 
 * @param draftData - Draft data object containing documents array
 * @returns Array of preserved document IDs as strings
 * 
 * @example
 * const preservedIds = extractPreservedDocumentIds(draftData)
 * // Returns: ['123', '456', '789']
 */
export const extractPreservedDocumentIds = (draftData?: any): string[] => {
  const preservedDocumentIds: string[] = []
  
  if (draftData?.data?.documents && Array.isArray(draftData.data.documents)) {
    draftData.data.documents.forEach((doc: any) => {
      const fileId = getFileId(doc)
      if (fileId !== undefined && fileId !== null && fileId !== '') {
        const fileIdString = String(fileId).trim()
        if (fileIdString && !preservedDocumentIds.includes(fileIdString)) {
          preservedDocumentIds.push(fileIdString)
        }
      }
    })
  }
  
  return preservedDocumentIds
}

/**
 * Filter documents_to_delete to exclude preserved documents
 * Filters out any document IDs that exist in the preservedDocuments array
 * 
 * @param preservedDocuments - Array of document IDs that should be preserved (not deleted)
 * @param documentsToDelete - Object with structure { "key": [documentIds] } where key is section name
 * @returns Filtered object with same structure, excluding preserved documents
 * 
 * @example
 * const preserved = ['123', '456']
 * const toDelete = { 'supporting_files': ['123', '789', '456'], 'certificates': ['111'] }
 * const filtered = filterDocumentsToDelete(preserved, toDelete)
 * // Returns: { 'supporting_files': ['789'], 'certificates': ['111'] }
 */
export const filterDocumentsToDelete = (
  preservedDocuments: string[],
  documentsToDelete: Record<string, string[] | number[]>
): Record<string, string[]> => {
  const filtered: Record<string, string[]> = {}
  
  // Normalize preserved documents to strings for comparison
  const preservedSet = new Set(preservedDocuments.map(id => String(id).trim()))
  
  Object.keys(documentsToDelete).forEach((key) => {
    const docIds = documentsToDelete[key]
    if (Array.isArray(docIds) && docIds.length > 0) {
      const filteredIds = docIds
        .map(id => String(id).trim())
        .filter(id => id && !preservedSet.has(id))
      
      if (filteredIds.length > 0) {
        filtered[key] = filteredIds
      }
    }
  })
  
  return filtered
}

/**
 * Filter a flat array of document IDs to exclude preserved documents
 * 
 * @param preservedDocuments - Array of document IDs that should be preserved
 * @param documentsToDelete - Array of document IDs to filter
 * @returns Filtered array excluding preserved documents
 * 
 * @example
 * const preserved = ['123', '456']
 * const toDelete = ['123', '789', '456', '111']
 * const filtered = filterDocumentsToDeleteArray(preserved, toDelete)
 * // Returns: ['789', '111']
 */
export const filterDocumentsToDeleteArray = (
  preservedDocuments: string[],
  documentsToDelete: (string | number)[]
): string[] => {
  const preservedSet = new Set(preservedDocuments.map(id => String(id).trim()))
  
  return documentsToDelete
    .map(id => String(id).trim())
    .filter(id => id && !preservedSet.has(id))
}

/**
 * Filter update_meta_data to exclude preserved documents
 * Filters out any file IDs that exist in the preservedDocuments array
 * 
 * @param preservedDocuments - Array of document IDs that should be preserved
 * @param updateMetaData - Object with structure { "fileId": metadata } or { "section": { "fileId": metadata } }
 * @returns Filtered update_meta_data excluding preserved documents
 * 
 * @example
 * const preserved = ['123', '456']
 * const updateMeta = { '123': {...}, '789': {...}, '456': {...} }
 * const filtered = filterUpdateMetaData(preserved, updateMeta)
 * // Returns: { '789': {...} }
 */
export const filterUpdateMetaData = (
  preservedDocuments: string[],
  updateMetaData: Record<string, any>
): Record<string, any> => {
  const filtered: Record<string, any> = {}
  const preservedSet = new Set(preservedDocuments.map(id => String(id).trim()))
  
  Object.keys(updateMetaData).forEach((fileId) => {
    const fileIdString = String(fileId).trim()
    if (!preservedSet.has(fileIdString)) {
      filtered[fileId] = updateMetaData[fileId]
    }
  })
  
  return filtered
}

/**
 * Filter nested update_meta_data structure (section-based)
 * Filters out any file IDs that exist in the preservedDocuments array
 * 
 * @param preservedDocuments - Array of document IDs that should be preserved
 * @param updateMetaData - Object with structure { "section": { "fileId": metadata } }
 * @returns Filtered update_meta_data with same structure, excluding preserved documents
 * 
 * @example
 * const preserved = ['123', '456']
 * const updateMeta = { 
 *   'supporting_files': { '123': {...}, '789': {...} },
 *   'certificates': { '456': {...}, '111': {...} }
 * }
 * const filtered = filterNestedUpdateMetaData(preserved, updateMeta)
 * // Returns: { 
 * //   'supporting_files': { '789': {...} },
 * //   'certificates': { '111': {...} }
 * // }
 */
export const filterNestedUpdateMetaData = (
  preservedDocuments: string[],
  updateMetaData: Record<string, Record<string, any>>
): Record<string, Record<string, any>> => {
  const filtered: Record<string, Record<string, any>> = {}
  const preservedSet = new Set(preservedDocuments.map(id => String(id).trim()))
  
  Object.keys(updateMetaData).forEach((section) => {
    const sectionData = updateMetaData[section]
    if (sectionData && typeof sectionData === 'object') {
      const filteredSection: Record<string, any> = {}
      
      Object.keys(sectionData).forEach((fileId) => {
        const fileIdString = String(fileId).trim()
        if (!preservedSet.has(fileIdString)) {
          filteredSection[fileId] = sectionData[fileId]
        }
      })
      
      if (Object.keys(filteredSection).length > 0) {
        filtered[section] = filteredSection
      }
    }
  })
  
  return filtered
}

