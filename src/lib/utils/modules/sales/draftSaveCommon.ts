import { NUMBERMAP } from '@/constants/common';
import { FinalFileData } from '@/lib/utils/common';
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave';

/**
 * Classification: Confidential
 * Description: Common utility functions for draft save operations in sales modules
 */

export interface DraftPreparationResult {
  draftDocuments?: Record<string, any[]>;
  draftDelete?: string[] | Record<string, string[]>;
  createMetaData?: Record<string, any>;
  updateMetaData?: Record<string, any>;
  documentsToPreserve?: any[];
}

/**
 * Processes draft preparation results and updates state setters
 * This centralizes the duplicate code pattern found in:
 * - order-acknowledgement
 * - delivery-dispatch
 * - initiate-quotation
 * - SalesForecastModal
 */
export const processDraftPreparation = (
  draftPreparation: DraftPreparationResult,
  setDraftDocuments: (value: Record<string, any[]>) => void,
  setDraftDelete: (value: string[]) => void
): void => {
  if (draftPreparation.draftDocuments) {
    setDraftDocuments(draftPreparation.draftDocuments);
  }

  if (draftPreparation.draftDelete) {
    const deleteArray = Array.isArray(draftPreparation.draftDelete)
      ? draftPreparation.draftDelete
      : Object.values(draftPreparation.draftDelete).flat();
    setDraftDelete(deleteArray);
  }
};

/**
 * Removes specified fields from form data object
 * This centralizes the duplicate code pattern found in:
 * - order-acknowledgement
 * - delivery-dispatch
 * - initiate-quotation
 * - SalesForecastModal
 */
export const removeFieldsFromFormData = <T extends Record<string, any>>(
  formData: T,
  fieldsToRemove: string[]
): Omit<T, keyof typeof fieldsToRemove> => {
  const Obj = { ...formData };
  const cleaned = Object.fromEntries(
    Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key))
  );
  return cleaned as Omit<T, keyof typeof fieldsToRemove>;
};

/**
 * Appends file metadata to FormData payload
 * This centralizes the duplicate code pattern found in:
 * - order-acknowledgement
 * - delivery-dispatch
 * - initiate-quotation
 */
export const appendFileMetadataToFormData = (
  formDataPayload: FormData,
  finalFileData: FinalFileData,
  createFileMetadata: () => any
): void => {
  // Handle file uploads - documents_to_create (File objects)
  if (finalFileData.documents_to_create && finalFileData.documents_to_create.length > NUMBERMAP.ZERO) {
    finalFileData.documents_to_create.forEach((file: File) => {
      formDataPayload.append('documents_to_create', file, file.name);
    });
  }

  // Use createFileMetadata to generate file metadata
  const fileMetadata = createFileMetadata();
  if (fileMetadata) {
    if (fileMetadata.documents_to_delete && fileMetadata.documents_to_delete.length > NUMBERMAP.ZERO) {
      formDataPayload.append('documents_to_delete', JSON.stringify(fileMetadata.documents_to_delete));
    }
    if (fileMetadata.create_meta_data && Object.keys(fileMetadata.create_meta_data).length > NUMBERMAP.ZERO) {
      formDataPayload.append('create_meta_data', JSON.stringify(fileMetadata.create_meta_data));
    }
    if (fileMetadata.update_meta_data && Object.keys(fileMetadata.update_meta_data).length > NUMBERMAP.ZERO) {
      formDataPayload.append('update_meta_data', JSON.stringify(fileMetadata.update_meta_data));
    }
  }
};

/**
 * Creates a file metadata generator function
 * This centralizes the createFileMetadata pattern
 */
export const createFileMetadataGenerator = (params: {
  isEditMode: boolean;
  draftData?: any;
  existingData?: any;
  finalFileData: FinalFileData;
  dataPath: string;
}) => {
  return () => {
    return createFileMetadataUtil({
      isEditMode: params.isEditMode,
      draftData: params.draftData,
      existingData: params.existingData,
      finalFileData: params.finalFileData,
      dataPath: params.dataPath,
    });
  };
};

