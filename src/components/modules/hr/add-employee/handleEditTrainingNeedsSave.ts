import { magicFormSave } from '@/lib/utils/magicSave';
import magicSaveConstants from '@/constants/magicSave';
import { STATUS } from '@/constants/common';
import { showActionAlert } from '@/components/ui';
import { FILE_SECTION_TABLES } from '@/constants/modules/hr/employeeList';

interface HandleEditTrainingNeedsSaveParams {
  formData: Record<string, string | string[]>;
  trainingNeedsRef: React.RefObject<any>;
  trainingNeedsFinalData: any;
  operationType: string;
  keys?: any;
  dataframeworkOtherParamsBag?: any;
  onClose: () => void;
}

const prepareFileMetadata = (trainingNeedsFinalData: any) => {
  const createMetadata: any = {};
  const updateMetadata: any = {};
  const deleteMetadata: any = {};
  const files = trainingNeedsFinalData;
  if (files && Object.keys(files?.create_meta_data ?? {}).length > 0) {
    createMetadata[FILE_SECTION_TABLES['trainingNeeds']] = Object.entries(files.create_meta_data).reduce(
      (acc: any, [fileName, fileData]) => {
        if (fileData && typeof fileData === 'object') {
          acc[fileName] = {
            ...fileData,
            fk_eqms_file_id: '{fileId}',
          };
        } else {
          acc[fileName] = { fk_eqms_file_id: '{fileId}' };
        }
        return acc;
      },
      {}
    );
  }
  if (files && Object.keys(files?.update_meta_data ?? {}).length > 0) {
    updateMetadata[FILE_SECTION_TABLES['trainingNeeds']] = Object.entries(files.update_meta_data).reduce(
      (acc: any, [fileName, fileData]) => {
        if (fileData && typeof fileData === 'object') {
          acc[fileName] = {
            ...fileData,
          };
        } else {
          acc[fileName] = {};
        }
        return acc;
      },
      {}
    );
  }
  if (files && (files?.documents_to_delete ?? []).length > 0) {
    deleteMetadata[FILE_SECTION_TABLES['trainingNeeds']] = {
          fk_eqms_file_id: files.documents_to_delete.map(Number),
        }
  }
  // If you have deletedTrainingNeeds, add here
  return {
    fileOperation: { create: createMetadata, update: updateMetadata, delete: deleteMetadata },
    documents_to_create: files?.documents_to_create ?? [],
  };
};

export const handleEditTrainingNeedsSave = async ({
   onSave,
  formData,
  trainingNeedsRef,
  trainingNeedsFinalData,
  operationType,
  keys = {},
  dataframeworkOtherParamsBag = {},
  onClose,
}: HandleEditTrainingNeedsSaveParams) => {
  try {
    const fileMetadata = prepareFileMetadata(trainingNeedsFinalData);
    const response = await magicFormSave({
      currentFormRef: trainingNeedsRef,
      dataframeworkOperatorType: operationType,
      dataframeworkOtherParamsBag,
      keys,
      fileMetadata,
      diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
    });

    if (
      response &&
      'response' in response &&
      (response as any).response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
    ) {
      showActionAlert(STATUS.SUCCESS);
      onClose();
      onSave?.(formData)
      return { success: true, response };
    } else {
      showActionAlert(STATUS.FAILED);
      return { success: false, response };
    }
  } catch (error) {
    showActionAlert(STATUS.FAILED);
    return { success: false, error };
  }
}; 