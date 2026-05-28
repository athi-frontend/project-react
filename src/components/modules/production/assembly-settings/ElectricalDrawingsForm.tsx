'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Grid2 } from '@mui/material';
import { ActionButton, InputField, RichTextEditor, RadioButtonGroup, DataTable, showActionAlert } from '@/components/ui';
import { P20P40 } from '@/styles/common';
import { FINALFILEINITIALDATA, NUMBERMAP, STATUS } from '@/constants/common';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport';
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager';
import { useElectricalDrawingList, useUpsertElectricalDrawing, useDeleteElectricalDrawing, useElectricalDrawingById } from '@/hooks/modules/production/useElectricalDrawing';
import { FinalFileData, mergeFinalFileData, hasFileData } from '@/lib/utils/common';
import { FileDocument } from '@/types/components/ui/fileUploadV3';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import { useDraftSave } from '@/hooks/common/useDraftSave';
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave';
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon';

// Clean type
export interface ElectricalDrawing {
  id: number | string;
  electrical_drawing_id?: number;
  drawing_name: string;
  drawing_description: string;
  drawing_type_slug: string;
  document?: any[];
}

interface ElectricalDrawingsFormProps {
  assemblyPartItemDetailId: number;
}

const drawingTypeOptions = [
  { value: 'circuit_diagram', label: 'Circuit Diagram' },
  { value: 'wiring_diagram', label: 'Wiring Diagram' },
  { value: 'cable_drawing', label: 'Cable Drawing' },
];

const ElectricalDrawingsForm: React.FC<ElectricalDrawingsFormProps> = ({ assemblyPartItemDetailId }) => {
  const { data, isLoading } = useElectricalDrawingList(assemblyPartItemDetailId, !!assemblyPartItemDetailId);
  const upsertMutation = useUpsertElectricalDrawing(assemblyPartItemDetailId);
  const deleteMutation = useDeleteElectricalDrawing(assemblyPartItemDetailId);
  const rows = data?.data ?? [];
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({});
  const [draftDelete, setDraftDelete] = useState<string[] | Record<string, string[]>>([]);
  // Modal & Form state
  const [openModal, setOpenModal] = useState(false);
  const [editingRow, setEditingRow] = useState<ElectricalDrawing | null>(null);
  const [drawingName, setDrawingName] = useState('');
  const [drawingDescription, setDrawingDescription] = useState('');
  const [drawingTypeSlug, setDrawingTypeSlug] = useState<string>('');
  const { data: apiEditData } = useElectricalDrawingById(editingRow?.electrical_drawing_id ?? NUMBERMAP.ZERO, Boolean(editingRow));
  const [formData, setFormData] = useState<{ documents: any[] }>({ documents: [] });
  const [errors, setErrors] = useState<{ drawingType?: string; drawingName?: string; drawingDescription?: string }>({});
  const initialDraftLoading = useRef(true);

  const contextInstanceIdForDraft =editingRow ? editingRow.electrical_drawing_id : null;

  const { draftSave, clearDraftSave, isDraftSaving, fetchDraft, draftData, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'electrical_drawing',
    context_instance_id: contextInstanceIdForDraft,
    enableFetch: false,
  });

  const handleDraftSave = useCallback(
    (formFields: { drawingName: string; drawingDescription: string; drawingTypeSlug: string }, fileData?: FinalFileData) => {
      const finalFileDataValue = fileData ?? finalFileData;
      const draftDatas = editingRow ? apiEditData : draftData;
      const draftConfig = {
        fileFieldToSectionMap: { documents: 'documents' },
        sectionTypeToNameMap: { documents: 'documents' },
        responseDataKeyMap: { documents: 'documents' },
      };
      const draftPreparation = prepareDraftDocumentsGeneric(
        draftDocuments,
        draftDelete,
        { documents: formData.documents ?? [] },
        { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
        draftDatas,
        draftConfig
      );
      if (draftPreparation.draftDocuments) {
        setDraftDocuments(draftPreparation.draftDocuments);
      }
      if (draftPreparation.draftDelete) {
        const deleteArray = Array.isArray(draftPreparation.draftDelete)
          ? draftPreparation.draftDelete
          : Object.values(draftPreparation.draftDelete).flat();
        setDraftDelete(deleteArray);
      }
      const payload = {
        id: contextInstanceIdForDraft ?? Date.now(),
        drawingName: formFields.drawingName,
        drawingDescription: formFields.drawingDescription,
        drawingTypeSlug: formFields.drawingTypeSlug,
        draftDocuments: draftPreparation.draftDocuments,
        draftDelete: draftPreparation.draftDelete,
        type: 'draft',
      };
      draftSave({
        form_data: payload,
        upload_documents: {
          documents_to_create: finalFileDataValue?.documents_to_create ?? [],
          create_meta_data: draftPreparation.createMetaData,
          update_meta_data: draftPreparation.updateMetaData,
          documents_to_delete: [],
          documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
        },
        timestamp: new Date().toISOString(),
      });
    },
    [
      finalFileData,
      formData.documents,
      draftDocuments,
      draftDelete,
      editingRow,
      apiEditData,
      draftData,
      contextInstanceIdForDraft,
      draftSave,
    ]
  );

  useEffect(() => {
    if (!draftData?.data || !openModal) return;
    if(draftData?.data) {
    const d = draftData.data
    setDrawingName(d.drawingName);
    setDrawingDescription(d.drawingDescription);
    setDrawingTypeSlug(d.drawingTypeSlug);
    setFormData((prev) => ({ ...prev, documents: d.documents as any[] }));
    setDraftDocuments(d.draftDocuments as Record<string, any[]>);
    setDraftDelete(d.draftDelete as string[]);}
  }, [draftData, openModal]);

  // Helper to create file metadata (reuse pattern from part-category)
  const createFileMetadata = useCallback(() => {
    const documents = formData?.documents ?? [];
    if (!hasFileData(finalFileData) && documents.length === NUMBERMAP.ZERO) return null;
    const raw = apiEditData as { data?: any[] | Record<string, unknown> } | undefined;
    let record: Record<string, unknown> | null = null;
    if (Array.isArray(raw?.data) && raw.data.length > NUMBERMAP.ZERO) {
      record = raw.data[NUMBERMAP.ZERO];
    }else {
      record = raw?.data?? {};
    }
    const existingData = editingRow?.electrical_drawing_id
      ? { data: record ? { documents: record.document ?? record.documents ?? [] } : { documents: [] } }
      : { data: { documents: [], draftDocuments, draftDelete } };
    const metadata = createFileMetadataUtil({
      isEditMode: !!editingRow?.electrical_drawing_id,
      draftData,
      existingData,
      finalFileData,
      dataPath: 'documents',
    });
    return {
      documents_to_delete: metadata.documents_to_delete,
      create_meta_data: metadata.create_meta_data,
      update_meta_data: metadata.update_meta_data,
    };
  }, [
    formData?.documents,
    finalFileData,
    apiEditData,
    editingRow?.electrical_drawing_id,
    draftData,
    draftDocuments,
    draftDelete,
  ]);

  function validate() {
    const newErrors: typeof errors = {};
    if (!drawingTypeSlug) newErrors.drawingType = 'Drawing type is required.';
    if (!drawingName.trim()) newErrors.drawingName = 'Drawing name is required.';
    if (!drawingDescription.trim()) newErrors.drawingDescription = 'Drawing description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === NUMBERMAP.ZERO;
  }

  // Columns definition
  const drawingColumns = [
    { field: 'sno', headerName: 'S.No', flex: NUMBERMAP.ONE },
    { field: 'drawing_name', headerName: 'Drawing Name', flex: NUMBERMAP.ONE },
    {
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: any) => (
        <ActionButton onEdit={() => handleEdit(params.row)} onDelete={() => handleDelete(params.row)} />
      ),
    },
  ];

  // Handlers
  function handleEdit(row: ElectricalDrawing) {
    setEditingRow(row);
    setFinalFileData(FINALFILEINITIALDATA);
    setOpenModal(true);
  }

  React.useEffect(() => {
    const raw = apiEditData as { data?: any[] | Record<string, unknown> } | undefined;
    let record: Record<string, unknown> | null = null;
    if (Array.isArray(raw?.data) && raw.data.length > NUMBERMAP.ZERO) {
      record = raw.data[NUMBERMAP.ZERO] as Record<string, unknown>;
    } else if (raw?.data != null && !Array.isArray(raw.data)) {
      record = raw.data;
    }
    if (record && openModal && editingRow) {
      const name = record.drawing_name ?? record.drawingName ?? '';
      const desc = record.drawing_description ?? record.drawingDescription ?? '';
      const slug = record.drawing_type_slug ?? record.drawingTypeSlug ?? '';
      setDrawingName(typeof name === 'string' ? name : '');
      setDrawingDescription(typeof desc === 'string' ? desc : '');
      setDrawingTypeSlug(typeof slug === 'string' ? slug : '');
      const docs = record.document ?? record.documents;
      if (Array.isArray(docs)) setFormData((prev) => ({ ...prev, documents: docs }));
    }
  }, [apiEditData, openModal, editingRow]);

  function handleDelete(row: ElectricalDrawing) {
    showActionAlert("delete").then((result) => {
      if (result.isConfirmed) {
        if (row.electrical_drawing_id) {
          deleteMutation.mutate(row.electrical_drawing_id, {
            onSuccess: () => {
              showActionAlert("success")
            }
          });
        }
      }
    })

  }

  function handleAdd() {
    setEditingRow(null);
    setDrawingName('');
    setDrawingDescription('');
    setDrawingTypeSlug('');
    setFinalFileData(FINALFILEINITIALDATA);
    setDraftDocuments({});
    setDraftDelete([]);
    setFormData({ documents: [] });
    setOpenModal(true);
  }

  // Fetch draft when Add modal opens (add mode: no editingRow, context = assemblyPartItemDetailId)
  useEffect(() => {
    if (openModal && !editingRow && assemblyPartItemDetailId) {
      fetchDraft();
    }
  }, [openModal, editingRow, assemblyPartItemDetailId, fetchDraft]);

  // Initialize draft loading flag with setTimeout (like form-team / delivery-dispatch reference)
  useEffect(() => {
    if (!openModal) return;
    setTimeout(() => {
      initialDraftLoading.current = false;
    }, NUMBERMAP.TWOTHOUSAND);
  }, [openModal]);

  const handleFileUpload = (newFile: File) => {
    setFormData((prev) => ({
      ...prev,
      documents: [...(prev.documents ?? []), newFile],
    }));
  };

  const handleFileEdit = useCallback((documents: any) => {
    setFormData((prev) => {
      const updatedFiles = (prev.documents ?? []).map((file: any) => {
        const currentId =
          typeof file === 'object' ? (file?.file_id ?? file?.id) : undefined;
        const updatedId = documents.document_id ?? documents.id;
        return currentId === updatedId ? { ...file, ...documents } : file;
      });
      return { ...prev, documents: updatedFiles };
    });
  }, []);

  const handleFileRemove = (data: any) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = (prev.documents ?? []).filter((file: any) => {
          let fileName: string | undefined;
          if (file instanceof File) {
            fileName = file.name?.split('.')[NUMBERMAP.ZERO];
          } else {
            fileName =
              file?.file?.name?.split('.')[NUMBERMAP.ZERO] ??
              file?.name?.split('.')[NUMBERMAP.ZERO];
          }
          return !data.local_files_to_delete.includes(fileName);
        });
        return { ...prev, documents: updatedDocs };
      });
    }
    if (data?.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = (prev.documents ?? []).filter((file: any) => {
          const fileId = (file as FileDocument)?.file_id ?? (file as FileDocument)?.id;
          return !data.documents_to_delete.includes(fileId);
        });
        return { ...prev, documents: updatedDocs };
      });
    }
  };

  function handleSave() {
    if (!validate()) return;
    clearDraftSave();
    const fileMetadata = createFileMetadata();
    const documents_to_delete = fileMetadata?.documents_to_delete ?? [];
    const create_meta_data = fileMetadata?.create_meta_data ?? {};
    const update_meta_data = fileMetadata?.update_meta_data ?? {};
    upsertMutation.mutate(
      {
        electrical_drawing_id: editingRow?.electrical_drawing_id,
        applicable_settings_id: assemblyPartItemDetailId,
        drawing_name: drawingName,
        drawing_description: drawingDescription,
        drawing_type_slug: drawingTypeSlug,
        documents_to_create: finalFileData.documents_to_create ?? [],
        create_meta_data: JSON.stringify(create_meta_data),
        update_meta_data: JSON.stringify(update_meta_data),
        documents_to_delete: JSON.stringify(
          Array.isArray(documents_to_delete) ? documents_to_delete.map(String) : documents_to_delete
        ),
      },
      {
        onSuccess: () => {
          setOpenModal(false);
          setEditingRow(null);
          setDrawingName('');
          setDrawingDescription('');
          setDrawingTypeSlug('');
          setFinalFileData(FINALFILEINITIALDATA);
          setErrors({});
          setFormData({ documents: [] });
          setDraftDocuments({});
          setDraftDelete([]);
          showActionAlert(STATUS.SUCCESS);
        },
      }
    );
  }

  const handleModalClose = useCallback(async () => {
    const canLeave = await checkUnsavedDraftBeforeLeave();
    if (!canLeave) return;
    setOpenModal(false);
    setEditingRow(null);
    setDrawingName('');
    setDrawingDescription('');
    setDrawingTypeSlug('');
    setFinalFileData(FINALFILEINITIALDATA);
    setErrors({});
    setFormData({ documents: [] });
    setDraftDocuments({});
    setDraftDelete([]);
  }, [checkUnsavedDraftBeforeLeave]);

  return (
    <>
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <CommonSharedTale
            title="Electrical Drawings"
            pathName={'#'}
            hanldeClick={() => handleAdd()}
            Table={<DataTable
              rows={rows}
              columns={drawingColumns}
              IdField="electrical_drawing_id"
              loading={isLoading ?? upsertMutation.isPending ?? deleteMutation.isPending}
            />}
          />

        </Grid2>
      </Grid2>
      <CommonModal
        open={openModal}
        title={editingRow ? 'Edit Electrical Drawing' : 'Add Electrical Drawing'}
        onClose={handleModalClose}
        onSave={handleSave}
        buttonRequired={true}
        modalMaxWidth="900px"
      >
        {openModal && isDraftSaving && <DraftLoading />}
        <Grid2 container spacing={NUMBERMAP.ONE} sx={{ ...POPUP_STYLE }}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RadioButtonGroup
              label={'Drawing Type*'}
              name="drawingType"
              options={drawingTypeOptions}
              value={drawingTypeSlug}
              error={errors.drawingType}
              onChange={(value: string | number) => {
                setDrawingTypeSlug(value as string);
                setErrors((e) => ({ ...e, drawingType: undefined }));
                handleDraftSave({ drawingName, drawingDescription, drawingTypeSlug: value as string });
              }}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Drawing Name*'}
              placeholder={'Enter Drawing Name'}
              value={drawingName}
              error={errors.drawingName}
              onChange={(value: string) => {
                setDrawingName(value);
                setErrors((e) => ({ ...e, drawingName: undefined }));
                if (!initialDraftLoading.current) {
                  handleDraftSave({ drawingName: value, drawingDescription, drawingTypeSlug });
                }
              }}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Description*'}
              placeholder={'Enter Description'}
              value={drawingDescription}
              error={errors.drawingDescription}
              onChange={(value: string) => {
                setDrawingDescription(value);
                setErrors((e) => ({ ...e, drawingDescription: undefined }));
                handleDraftSave({ drawingName, drawingDescription: value, drawingTypeSlug });
              }}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <FileUploadManager
              initialFiles={formData?.documents as any}
              onSubmit={(data: any) => {
                setFinalFileData((prev) => {
                  const mergedData = mergeFinalFileData(prev, data);
                  if (!initialDraftLoading.current) {
                    handleDraftSave(
                      { drawingName, drawingDescription, drawingTypeSlug },
                      mergedData
                    );
                  }
                  return mergedData;
                });
                handleFileRemove(data);
              }}
              onFileEdit={handleFileEdit}
              onFileUpload={handleFileUpload as any}
            />
          </Grid2>
        </Grid2>
      </CommonModal>
    </>
  );
};

export default ElectricalDrawingsForm;

