import { FinalFileData } from '@/lib/utils/common'

/**
 * Classification: confidential
 */
export interface DraftDocumentsConfig {
  /**
   * Map of formData field names to section names
   * For single file: provide { 'none': 'section_name' } or { 'documents': 'section_name' }
   * For multiple files: provide { 'field1': 'section1', 'field2': 'section2' }
   */
  fileFieldToSectionMap: Record<string, string>
  
  /**
   * Map of section types to section names
   * For single file: provide { 'none': 'section_name' } or { 'single': 'section_name' }
   * For multiple files: provide { 'type1': 'section1', 'type2': 'section2' }
   */
  sectionTypeToNameMap: Record<string, string>
  
  /**
   * Response data key mapping (optional)
   * Maps formData keys to response data keys
   * Example: { 'documents': 'supporting_files' }
   */
  responseDataKeyMap?: Record<string, string>
}

/**
 * Helper function to get file ID from different file object types
 */
const getFileId = (file: any): string | number | undefined => {
  if (file?.file_id) return file.file_id
  if (file?.fk_eqms_file_id) return file.fk_eqms_file_id
  return undefined
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
    ].filter(id => id !== undefined && id !== null && id !== '')
    
    return possibleIds.some(id => {
      const normalizedId = String(id).trim()
      return normalizedId === normalizedDocId || normalizedId === docId || String(id) === String(docId)
    })
  })
}

/**
 * Convert formData file fields to draftDocuments format
 * Handles both formData (with field names) and draftData (with section names)
 */
export const formDraftDataGeneric = (
  formData: any,
  draftData: any,
  config: DraftDocumentsConfig,
  finalDocuments?: Record<string, FinalFileData> | { 'none': FinalFileData } | { 'single': FinalFileData }
): Record<string, any[]> => {
  const draftDocuments: Record<string, any[]> = {};

  const draftDocumentsSource =
    draftData?.data?.draftDocuments ?? draftData?.draftDocuments;

  if (isValidDraftSource(draftDocumentsSource)) {
    const result = processDraftDocumentsSource(draftDocumentsSource, draftData, config);
    if (Object.keys(result).length > 0) return result;
  }

  return buildDraftDocumentsFromForm(formData, draftData, config, finalDocuments);
};

//
// ────────────────────────────────────────────────────────────────
// Helper functions
// ────────────────────────────────────────────────────────────────
//

function isValidDraftSource(source: any) {
  return source && typeof source === "object";
}

function filterNewDocuments(docs: any[], draftData: any): any[] {
  return docs.filter((doc) => {
    const docId = String(getFileId(doc));
    return !isDocumentInDraftData(docId, draftData);
  });
}

function processDraftDocumentsSource(
  source: any,
  draftData: any,
  config: DraftDocumentsConfig
): Record<string, any[]> {
  const draftDocuments: Record<string, any[]> = {};

  if (Array.isArray(source)) {
    // Legacy array format
    const section = getSectionName(config);
    if (!section) return {};
    draftDocuments[section] = filterNewDocuments(source, draftData);
    return draftDocuments;
  }

  // Object format
  copySectionedDocuments(source, draftDocuments);
  moveNumericKeysIfNeeded(source, draftDocuments, draftData, config);

  return draftDocuments;
}

function copySectionedDocuments(
  source: any,
  draftDocuments: Record<string, any[]>
) {
  Object.entries(source).forEach(([key, value]) => {
    if (!/^\d+$/.test(key) && Array.isArray(value)) {
      draftDocuments[key] = value;
    }
  });
}

function moveNumericKeysIfNeeded(
  source: any,
  draftDocuments: Record<string, any[]>,
  draftData: any,
  config: DraftDocumentsConfig
) {
  const numericKeys = Object.keys(source).filter((key) => /^\d+$/.test(key));
  if (numericKeys.length === 0 || Object.keys(draftDocuments).length > 0) return;

  const section = getSectionName(config);
  if (!section) return;

  const docs = numericKeys
    .map((key) => source[key])
    .filter((doc: any) => !isDocumentInDraftData(String(getFileId(doc)), draftData));

  if (docs.length > 0) draftDocuments[section] = docs;
}

function buildDraftDocumentsFromForm(
  formData: any,
  draftData: any,
  config: DraftDocumentsConfig,
  finalDocuments?: Record<string, FinalFileData> | { 'none': FinalFileData } | { 'single': FinalFileData }
): Record<string, any[]> {
  const result: Record<string, any[]> = {};

  Object.entries(config.fileFieldToSectionMap).forEach(([field, section]) => {
    let docs: any[] | undefined;
    
    if (field === "none" || field === "documents") {
      // For "none" or "documents", use formData?.documents
      docs = formData?.documents;
    } else {
      // For specific fields, check multiple possible locations:
      // 1. formData[field].files (nested structure like eyeTest.files)
      // 2. formData[field] (direct array)
      // 3. formData.documents (fallback)
      docs = formData?.[field]?.files ?? formData?.[field];
      if (!Array.isArray(docs) || docs.length === 0) {
        docs = formData?.documents;
      }
      // If still no docs found, check finalDocuments for documents_to_create
      if ((!Array.isArray(docs) || docs.length === 0) && finalDocuments) {
        const finalDocData = (finalDocuments as Record<string, FinalFileData>)[field];
        if (finalDocData && Array.isArray(finalDocData.documents_to_create)) {
          docs = finalDocData.documents_to_create;
        }
      }
    }

    if (!Array.isArray(docs) || docs.length === 0) return;

    const filtered = docs.filter((doc: any) => {
      const id = getFileId(doc);
      // Include all documents with a valid file_id, regardless of whether they exist in draftData
      // This allows tracking of both new draft documents and existing server documents
      return id != null && id !== undefined && String(id).trim() !== '';
    });

    if (filtered.length > 0) result[section] = filtered;
  });

  return result;
}

function getSectionName(config: DraftDocumentsConfig): string | undefined {
  return (
    config.fileFieldToSectionMap["none"] ??
    config.fileFieldToSectionMap["documents"] ??
    "supporting_files"
  );
}



/**
 * Handle create metadata for draft save
 * Maps FinalFileData create_meta_data to section-based structure
 */
export const handleCreateMetaDataGeneric = (
  documents: FinalFileData,
  type: string | undefined,
  config: DraftDocumentsConfig
): Record<string, any> => {
  if (!type || !documents?.create_meta_data) return {}

  const sectionName = config.sectionTypeToNameMap[type]
  if (!sectionName) return {}

  // Use responseDataKeyMap if provided, otherwise use sectionName
  const responseKey = config.responseDataKeyMap?.[type] ?? sectionName

  return {
    [responseKey]: documents.create_meta_data,
  }
}

/**
 * Filter deleted documents from draftDocuments and prepare delete list
 */

const getDeletedDcuments = (
  deleteIds: string[],
  draftData: any,
  documentsToDelete: string[],
  draftDeleteItems: string[],
  draftDeleteItemsBySection: Record<string, string[]>,
  responseKey: string,
  currentDocuments: any[]
) => {
  let newDraftDeleteItems = [...draftDeleteItems];
  let newDraftDeleteItemsBySection = { ...draftDeleteItemsBySection };
  let newDocumentsToDelete = [...documentsToDelete];

  const isServerDoc = (id: string) =>
    isDocumentInDraftData(id, draftData);

  const isDraftDoc = (id: string) =>
    currentDocuments.some(
      (doc: any) => String(getFileId(doc)).trim() === id
    );

  const addServerDelete = (id: string) => {
    if (!newDocumentsToDelete.includes(id)) {
      newDocumentsToDelete.push(id);
    }
  };

  const addDraftDelete = (id: string) => {
    if (!newDraftDeleteItems.includes(id)) {
      newDraftDeleteItems.push(id);
    }

    if (!newDraftDeleteItemsBySection[responseKey]) {
      newDraftDeleteItemsBySection[responseKey] = [];
    }

    const sectionList = newDraftDeleteItemsBySection[responseKey];
    if (!sectionList.includes(id)) {
      sectionList.push(id);
    }
  };

  deleteIds.forEach((docId) => {
    const normalizedId = String(docId).trim();

    if (isServerDoc(normalizedId)) {
      addServerDelete(normalizedId);
    } else if (isDraftDoc(normalizedId)) {
      addDraftDelete(normalizedId);
    }
  });

  return {
    draftDeleteItemsLastest: newDraftDeleteItems,
    draftDeleteItemsBySectionLatest: newDraftDeleteItemsBySection,
    documentsToDeleteLatest: newDocumentsToDelete,
  };
};

export const handleDocumentsToDeleteDraftGeneric = (
  draftDocuments: Record<string, any[]>,
  documents: FinalFileData,
  type: string | undefined,
  draftData: any,
  config: DraftDocumentsConfig
): {
  documents_to_delete: string[] // Documents from server (draftData.data.documents) that should be deleted
  draftDeleteItems: string[] // Documents that exist only in draftDocuments (not in draftData.data.documents)
  draftDeleteItemsBySection: Record<string, string[]> // Structured by responseKey
  filteredDraftDocuments: Record<string, any[]>
} => {
  let documentsToDelete: string[] = []
  let draftDeleteItems: string[] = []
  const draftDeleteItemsBySection: Record<string, string[]> = {}
  const filteredDraftDocuments: Record<string, any[]> = { ...draftDocuments }

  if (!type) {
    return {
      documents_to_delete: documentsToDelete,
      draftDeleteItems,
      draftDeleteItemsBySection,
      filteredDraftDocuments,
    }
  }

  const sectionName = config.sectionTypeToNameMap[type]
  if (!sectionName) {
    return {
      documents_to_delete: documentsToDelete,
      draftDeleteItems,
      draftDeleteItemsBySection,
      filteredDraftDocuments,
    }
  }

  // Get responseKey for this section type
  const responseKey = config.responseDataKeyMap?.[type] ?? sectionName

  // Initialize section if it doesn't exist (important for maintaining structure across multiple sections)
  if (!filteredDraftDocuments[sectionName]) {
    filteredDraftDocuments[sectionName] = []
  }

  // Get current documents in this section
  const currentDocuments = filteredDraftDocuments[sectionName] ?? []

  // Extract delete IDs from documents and ensure they're strings
  // Process even if documents_to_delete is empty/undefined to maintain structure
  const deleteIds = Array.isArray(documents?.documents_to_delete)
    ? documents.documents_to_delete.map(String).filter(id => id && id !== 'undefined' && id !== 'null')
    : []

  // Process each document ID that needs to be deleted
  // This will process deletions even if deleteIds is empty (to maintain structure)
  const {draftDeleteItemsLastest, draftDeleteItemsBySectionLatest,documentsToDeleteLatest} = getDeletedDcuments(deleteIds, draftData, documentsToDelete, draftDeleteItems, draftDeleteItemsBySection, responseKey, currentDocuments)

  // Filter out deleted documents from draftDocuments
  filteredDraftDocuments[sectionName] = currentDocuments.filter((doc: any) => {
    const docId = String(getFileId(doc))
    return !deleteIds.includes(docId)
  })

  return {
    documents_to_delete: documentsToDeleteLatest,
    draftDeleteItems: draftDeleteItemsLastest,
    draftDeleteItemsBySection: draftDeleteItemsBySectionLatest,
    filteredDraftDocuments,
  }
}

/**
 * Handle update metadata for draft documents
 * Only updates files that exist in draftDocuments (draft-only documents)
 * If a document from draftDocuments appears in update_meta_data, it should be stored in draft updateMetadata
 */
export const handleUpdateMetaDataGeneric = (
  draftDocuments: Record<string, any[]>,
  documents: FinalFileData,
  type: string | undefined,
  config: DraftDocumentsConfig,
  draftData?: any
): {
  update_meta_data: Record<string, any>
  draftUpdateMetaData: Record<string, any> // Separate draft-only updates
  filteredDraftDocuments: Record<string, any[]>
} => {
  const updateMetaData: Record<string, any> = {}
  const draftUpdateMetaData: Record<string, any> = {}
  const filteredDraftDocuments: Record<string, any[]> = { ...draftDocuments }

  if (!type) {
    return {
      update_meta_data: updateMetaData,
      draftUpdateMetaData,
      filteredDraftDocuments,
    }
  }

  const sectionName = config.sectionTypeToNameMap[type]
  if (!sectionName) {
    return {
      update_meta_data: updateMetaData,
      draftUpdateMetaData,
      filteredDraftDocuments,
    }
  }

  // Initialize section if it doesn't exist (important for maintaining structure across multiple sections)
  if (!filteredDraftDocuments[sectionName]) {
    filteredDraftDocuments[sectionName] = []
  }

  const currentDocuments = filteredDraftDocuments[sectionName] ?? []
  
  // Process update_meta_data even if empty to maintain structure
  // Extract update entries from documents
  const updateMetaEntries = Object.entries(documents?.update_meta_data ?? {})
  
  // If no update entries, still return with correct structure
  if (updateMetaEntries.length === 0) {
    return {
      update_meta_data: updateMetaData,
      draftUpdateMetaData,
      filteredDraftDocuments,
    }
  }

  // Use responseDataKeyMap if provided
  const responseKey = config.responseDataKeyMap?.[type] ?? sectionName

  // Process each update entry
  updateMetaEntries.forEach(([fileId, metaData]) => {
    const normalizedFileId = String(fileId).trim()
    
    // Find the document in draftDocuments and update it directly
    let documentFound = false
    const updatedDocuments = currentDocuments.map((doc: any) => {
      const possibleIds = [
        getFileId(doc),
        doc.file_id,
        doc.document_id,
        doc.id,
        doc.fk_eqms_file_id,
        doc.media_id,
      ].filter(id => id !== undefined && id !== null && id !== '')
      
      const matches = possibleIds.some(id => {
        const normalizedId = String(id).trim()
        return normalizedId === normalizedFileId || 
               normalizedId === fileId || 
               String(id) === String(fileId) ||
               String(id) === normalizedFileId ||
               normalizedId === String(fileId)
      })
      
      if (matches) {
        documentFound = true
        // Update the document with new metadata values
        return {
          ...doc,
          ...metaData,
          // Preserve the file_id to ensure we can still match it
          file_id: doc.file_id ?? metaData.file_id ?? fileId,
        }
      }
      return doc
    })

    // Check if this is a server document (exists in draftData.data.documents)
    const isServerDocument = isDocumentInDraftData(normalizedFileId, draftData)

    if (documentFound) {
      // Document exists in draftDocuments - update it directly and update the filtered documents
      filteredDraftDocuments[sectionName] = updatedDocuments
      // Also store in draftUpdateMetaData for API submission
      draftUpdateMetaData[responseKey] ??= {};

      draftUpdateMetaData[responseKey][fileId] = metaData
    } else if (isServerDocument) {
      // Document is a server document but NOT in draftDocuments - add to regular update metadata (for server API)
      updateMetaData[responseKey] ??= {}
      updateMetaData[responseKey][fileId] = metaData
    }
    // If document doesn't exist in draftDocuments and is not a server document, 
    // it might be a new document being updated - we'll handle that in create metadata
  })

  return {
    update_meta_data: updateMetaData,
    draftUpdateMetaData,
    filteredDraftDocuments,
  }
}

/**
 * Generic function to prepare draft documents with create, update, and delete handling
 * Works for both single file and multiple file scenarios
 * 
 * @param existingDraftDocuments - Current state of draftDocuments (from component state)
 * @param existingDraftDelete - Current state of draftDelete (from component state)
 * @param formData - Form data containing file fields
 * @param finalDocuments - Object containing file sections with their FinalFileData
 *                        For single file: { 'none': FinalFileData } or { 'single': FinalFileData }
 *                        For multiple files: { 'type1': FinalFileData, 'type2': FinalFileData }
 * @param draftData - Draft data from API (optional)
 * @param config - Configuration for file field mappings
 */
type FinalDocuments =
  | Record<string, FinalFileData>
  | { none: FinalFileData }
  | { single: FinalFileData };

export const prepareDraftDocumentsGeneric = (
  existingDraftDocuments: Record<string, any[]>,
  existingDraftDelete: string[] | Record<string, string[]>,
  formData: any,
  finalDocuments: FinalDocuments,
  draftData: any,
  config: DraftDocumentsConfig
): {
  draftDocuments: Record<string, any[]>
  createMetaData: Record<string, any>
  updateMetaData: Record<string, any>
  draftUpdateMetaData: Record<string, any>
  documentsToDelete: Record<string, { eqms_file_id: string[] }> | {}
  draftDelete: string[] | Record<string, string[]>
  documentsToPreserve: string[]
} => {

  // --- Helper functions ---

  const normalizeExistingDraftDocuments = (): Record<string, any[]> => {
    // Always get documents from formData first
    const formDataDocuments = formDraftDataGeneric(formData, draftData, config, finalDocuments)
    
    if (!existingDraftDocuments || Object.keys(existingDraftDocuments).length === 0) {
      return formDataDocuments
    }

    const normalizedDraft: Record<string, any[]> = {}
    const numericKeys: string[] = []

    Object.keys(existingDraftDocuments).forEach(key => {
      if (/^\d+$/.test(key)) {
        numericKeys.push(key)
      } else if (Array.isArray(existingDraftDocuments[key])) {
        normalizedDraft[key] = [...existingDraftDocuments[key]]
      }
    })

    if (numericKeys.length > 0) {
      const sectionName = config.fileFieldToSectionMap['none'] 
        ?? config.fileFieldToSectionMap['documents'] 
        ?? 'supporting_files'

      const documentsArray = numericKeys
        .map(key => existingDraftDocuments[key])
        .filter(doc => doc !== undefined && doc !== null)

      if (normalizedDraft[sectionName]) {
        normalizedDraft[sectionName] = [...normalizedDraft[sectionName], ...documentsArray]
      } else {
        normalizedDraft[sectionName] = documentsArray
      }
    }

    // Merge formData documents with existing draft documents
    // For each section in formDataDocuments, merge with existing or set new
    Object.keys(formDataDocuments).forEach(section => {
      if (normalizedDraft[section]) {
        // Merge arrays, avoiding duplicates based on file_id
        const existingIds = new Set(
          normalizedDraft[section].map((doc: any) => String(getFileId(doc)).trim())
        )
        const newDocs = formDataDocuments[section].filter((doc: any) => {
          const id = String(getFileId(doc)).trim()
          return id && !existingIds.has(id)
        })
        normalizedDraft[section] = [...normalizedDraft[section], ...newDocs]
      } else {
        normalizedDraft[section] = [...formDataDocuments[section]]
      }
    })

    return normalizedDraft
  }

  const mergeDraftDataDocuments = (draftDocuments: Record<string, any[]>): Record<string, any[]> => {
    const draftDataDocumentsSource = draftData?.data?.draftDocuments
    if (!draftDataDocumentsSource) return draftDocuments

    const addToSection = (sectionName: string, docs: any[]) => {
      if (docs.length > 0) {
        draftDocuments[sectionName] = docs
      } else if (!draftDocuments[sectionName]) {
        draftDocuments[sectionName] = []
      }
    }

    if (Array.isArray(draftDataDocumentsSource)) {
      const sectionName = config.fileFieldToSectionMap['none'] ?? config.fileFieldToSectionMap['documents'] ?? 'supporting_files'
      addToSection(sectionName, draftDataDocumentsSource.filter(doc => !isDocumentInDraftData(String(getFileId(doc)), draftData)))
    } else {
      const numericKeys: string[] = []
      const sectionKeys: string[] = []

      Object.keys(draftDataDocumentsSource).forEach(key => /^\d+$/.test(key) ? numericKeys.push(key) : sectionKeys.push(key))

      sectionKeys.forEach(key => {
        if (Array.isArray(draftDataDocumentsSource[key])) {
          addToSection(key, draftDataDocumentsSource[key].filter(doc => !isDocumentInDraftData(String(getFileId(doc)), draftData)))
        }
      })

      if (numericKeys.length > 0 && sectionKeys.length === 0) {
        const sectionName = config.fileFieldToSectionMap['none'] ?? config.fileFieldToSectionMap['documents'] ?? 'supporting_files'
        const documentsArray = numericKeys.map(key => draftDataDocumentsSource[key])
          .filter(doc => !isDocumentInDraftData(String(getFileId(doc)), draftData))
        addToSection(sectionName, documentsArray)
      }
    }

    return draftDocuments
  }

  // --- Main logic ---

  let draftDocuments = normalizeExistingDraftDocuments()
  draftDocuments = mergeDraftDataDocuments(draftDocuments)

  const allCreateMetaData: Record<string, any> = {}
  const allUpdateMetaData: Record<string, any> = {}
  const allDraftUpdateMetaData: Record<string, any> = {}
  const allDocumentsToDelete: string[] = []
  let allDraftDeleteItems: string[] = []
  const allDraftDeleteItemsBySection: Record<string, string[]> = {}

  const sectionsToProcess = Object.keys(finalDocuments).map(key => ({
    key,
    sectionName: config.sectionTypeToNameMap[key] ?? config.sectionTypeToNameMap['none'] ?? key
  }))

  // Check if we should use structured draftDelete (if responseDataKeyMap has multiple keys)
  const shouldUseStructuredDraftDelete = config.responseDataKeyMap && Object.keys(config.responseDataKeyMap).length > 0

  sectionsToProcess.forEach(({ key }) => {
    const documents = finalDocuments[key as keyof typeof finalDocuments]
    if (!documents || Array.isArray(documents) || typeof documents !== 'object') return

    const deleteResult = handleDocumentsToDeleteDraftGeneric(draftDocuments, documents, key, draftData, config)
    draftDocuments = deleteResult.filteredDraftDocuments
    if (deleteResult.documents_to_delete?.length) allDocumentsToDelete.push(...deleteResult.documents_to_delete)
    if (deleteResult.draftDeleteItems?.length) allDraftDeleteItems.push(...deleteResult.draftDeleteItems)
    
    // Merge structured draftDeleteItems
    if (deleteResult.draftDeleteItemsBySection) {
      Object.keys(deleteResult.draftDeleteItemsBySection).forEach(responseKey => {
        if (!allDraftDeleteItemsBySection[responseKey]) {
          allDraftDeleteItemsBySection[responseKey] = []
        }
        allDraftDeleteItemsBySection[responseKey].push(...deleteResult.draftDeleteItemsBySection[responseKey])
      })
    }

    const updateResult = handleUpdateMetaDataGeneric(draftDocuments, documents, key, config, draftData)
    draftDocuments = updateResult.filteredDraftDocuments

 if (updateResult.update_meta_data) {
  Object.keys(updateResult.update_meta_data).forEach(sectionKey => {
    allCreateMetaData[sectionKey] ??= {};
    allUpdateMetaData[sectionKey] ??= {}; // ensure it exists
    Object.assign(allUpdateMetaData[sectionKey], updateResult.update_meta_data[sectionKey]);
  });
}

if (updateResult.draftUpdateMetaData) {
  Object.keys(updateResult.draftUpdateMetaData).forEach(sectionKey => {
    allCreateMetaData[sectionKey] ??= {};
    allDraftUpdateMetaData[sectionKey] ??= {}; // ensure it exists
    Object.assign(allDraftUpdateMetaData[sectionKey], updateResult.draftUpdateMetaData[sectionKey]);
  });
}


    const createMetaData = handleCreateMetaDataGeneric(documents, key, config)
    if (createMetaData) {
      Object.keys(createMetaData).forEach(sectionKey => {
        allCreateMetaData[sectionKey] ??= {}
        Object.assign(allCreateMetaData[sectionKey], createMetaData[sectionKey])
      })
    }
  })

  // Build draftDelete - structured if responseDataKeyMap exists, otherwise flat array
  let draftDelete: string[] | Record<string, string[]> = []
  
  if (shouldUseStructuredDraftDelete) {
    // Merge existing draftDelete if it's structured
    const existingStructured: Record<string, string[]> = Array.isArray(existingDraftDelete) 
      ? {} 
      : (existingDraftDelete)
    
    // Merge with new structured items
    const structuredDraftDelete: Record<string, string[]> = { ...existingStructured }
    Object.keys(allDraftDeleteItemsBySection).forEach(responseKey => {
      if (!structuredDraftDelete[responseKey]) {
        structuredDraftDelete[responseKey] = []
      }
      const uniqueIds = Array.from(new Set([
        ...(Array.isArray(structuredDraftDelete[responseKey]) ? structuredDraftDelete[responseKey] : []),
        ...allDraftDeleteItemsBySection[responseKey]
      ])).filter(id => id != null && id !== '')
      structuredDraftDelete[responseKey] = uniqueIds
    })
    
    // Remove empty arrays
    Object.keys(structuredDraftDelete).forEach(key => {
      if (Array.isArray(structuredDraftDelete[key]) && structuredDraftDelete[key].length === 0) {
        delete structuredDraftDelete[key]
      }
    })
    
    draftDelete = structuredDraftDelete
  } else {
    // Flat array for backward compatibility
    const existingArray = Array.isArray(existingDraftDelete) ? existingDraftDelete : []
    draftDelete = Array.from(new Set([...existingArray, ...allDraftDeleteItems]))
      .filter(id => id != null && id !== '')
  }

  // Build structured deleted documents ONLY from documents explicitly in documents_to_delete
  // Use allDocumentsToDelete which comes from handleDocumentsToDeleteDraftGeneric (only processes explicit deletions)
  const uniqueDocumentsToDelete = Array.from(new Set(allDocumentsToDelete)).filter(id => id != null && id !== '')
  const structuredDeletedDocuments: Record<string, { eqms_file_id: string[] }> = {}

  // ONLY process documents that are explicitly in documents_to_delete (from allDocumentsToDelete)
  if (uniqueDocumentsToDelete.length > 0 && draftData?.data?.documents) {
    uniqueDocumentsToDelete.forEach(docId => {
      const docIdString = String(docId).trim()
      
      // Find the document in draftData.data.documents to get its document_type
      const serverDoc = draftData.data.documents.find((doc: any) => {
        const possibleIds = [
          doc.file_id,
          doc.document_id,
          doc.id,
          doc.fk_eqms_file_id,
          doc.media_id,
          getFileId(doc),
        ].filter(id => id !== undefined && id !== null && id !== '')
        
        return possibleIds.some(id => String(id).trim() === docIdString)
      })

      if (serverDoc) {
        const documentType = serverDoc.document_type ?? serverDoc.documentType ?? 'default'
        structuredDeletedDocuments[documentType] ??= { eqms_file_id: [] }
        // Use the docId we searched for (from documents_to_delete), not the file_id from the document
        // This ensures we only delete the document that was explicitly marked for deletion
        if (docIdString && !structuredDeletedDocuments[documentType].eqms_file_id.includes(docIdString)) {
          structuredDeletedDocuments[documentType].eqms_file_id.push(docIdString)
        }
      } else {
        // If document not found in draftData, use 'default' type
        structuredDeletedDocuments['default'] ??= { eqms_file_id: [] }
        if (docIdString && !structuredDeletedDocuments['default'].eqms_file_id.includes(docIdString)) {
          structuredDeletedDocuments['default'].eqms_file_id.push(docIdString)
        }
      }
    })
  }

  const finalStructuredDocumentsToDelete: Record<string, { eqms_file_id: string[] }> = {}
  Object.keys(structuredDeletedDocuments).forEach(documentType => {
    const fileIds = Array.from(new Set(structuredDeletedDocuments[documentType].eqms_file_id))
      .filter(id => id != null && id !== '')
    if (fileIds.length > 0) finalStructuredDocumentsToDelete[documentType] = { eqms_file_id: fileIds }
  })

  // Collect all file_ids from draftData.data.documents for documents_to_preserve
  // Exclude documents that are marked for deletion
  const documentsToPreserve: string[] = []
  
  // Get all document IDs that are marked for deletion
  const deletedDocumentIds = new Set<string>()
  
  // Add IDs from allDocumentsToDelete (server documents to be deleted from finalFileData)
  allDocumentsToDelete.forEach(docId => {
    deletedDocumentIds.add(String(docId).trim())
  })
  
  // Add IDs from finalDocuments (documents_to_delete from the finalDocuments parameter)
  sectionsToProcess.forEach(({ key }) => {
    const documents = finalDocuments[key as keyof typeof finalDocuments]
    if (documents && typeof documents === 'object' && !Array.isArray(documents)) {
      const finalFileData = documents as FinalFileData
      const deleteIds = Array.isArray(finalFileData?.documents_to_delete)
        ? finalFileData.documents_to_delete.map((id: string | number) => String(id)).filter((id: string) => id && id !== 'undefined' && id !== 'null')
        : []
      deleteIds.forEach((docId: string) => {
        deletedDocumentIds.add(String(docId).trim())
      })
    }
  })
  
  // Add IDs from finalStructuredDocumentsToDelete (structured format)
  Object.values(finalStructuredDocumentsToDelete).forEach((docType) => {
    if (docType?.eqms_file_id && Array.isArray(docType.eqms_file_id)) {
      docType.eqms_file_id.forEach((docId: string) => {
        deletedDocumentIds.add(String(docId).trim())
      })
    }
  })
  
  // Collect preserved documents (excluding deleted ones)
  if (draftData?.data?.documents && Array.isArray(draftData.data.documents)) {
    draftData.data.documents.forEach((doc: any) => {
      const fileId = getFileId(doc)
      if (fileId !== undefined && fileId !== null && fileId !== '') {
        const fileIdString = String(fileId).trim()
        // Only include if not marked for deletion
        if (fileIdString && !deletedDocumentIds.has(fileIdString) && !documentsToPreserve.includes(fileIdString)) {
          documentsToPreserve.push(fileIdString)
        }
      }
    })
  }

  return {
    draftDocuments,
    createMetaData: allCreateMetaData,
    updateMetaData: allUpdateMetaData,
    draftUpdateMetaData: allDraftUpdateMetaData,
    documentsToDelete: Object.keys(finalStructuredDocumentsToDelete).length > 0 ? finalStructuredDocumentsToDelete : {},
    draftDelete,
    documentsToPreserve
  }
}


