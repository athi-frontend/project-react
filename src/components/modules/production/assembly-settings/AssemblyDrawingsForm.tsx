'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Grid2, Typography } from '@mui/material'
import { DataGridTable, ActionButton, InputField, showActionAlert } from '@/components/ui'
import { P20P40 } from '@/styles/common'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { useAssemblyDrawingList, useAssemblyDrawingById, useUpsertAssemblyDrawing, useDeleteAssemblyDrawing } from '@/hooks/modules/production/useAssemblyDrawing'
import { FinalFileData, isDocumentUploadValid, mergeFinalFileData, hasFileData } from '@/lib/utils/common'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'

/**
 * Classification: Confidential
 * Assembly Drawings Form Component
 */

/** Normal API: { data: [ { id, drawing_number, document } ] }. Draft: { data: { id, drawingNo, draftDocuments, draftDelete } } */
function getRecordFromDrawingByIdData(raw: { data?: any } | undefined): Record<string, any> | null {
  if (raw?.data == null) {
    const isRecord =
      raw &&
      typeof raw === 'object'
    return isRecord ? (raw as Record<string, any>) : null
  }
  if (Array.isArray(raw.data) && raw.data.length > NUMBERMAP.ZERO) {
    return raw.data[NUMBERMAP.ZERO] as Record<string, any>
  }
  if (!Array.isArray(raw.data)) {
    return raw.data as Record<string, any>
  }
  return null
}

function normalizeDraftDeleteToArray(value: unknown): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).flat() as string[]
  }
  return []
}

export interface AssemblyDrawing {
  id: string
  drawing_id?: number
  sno: number
  drawingNo: string
  filename: string
}

interface AssemblyDrawingsFormProps {
  drawings: AssemblyDrawing[]
  onDrawingsChange: (drawings: AssemblyDrawing[]) => void
  assemblyPartItemDetailId?: number
}

const AssemblyDrawingsForm: React.FC<AssemblyDrawingsFormProps> = ({
  drawings,
  onDrawingsChange,
  assemblyPartItemDetailId,
}) => {
  const { data: assemblyDrawingsData, isLoading: isLoadingDrawings, refetch: refetchAssemblyDrawings } = useAssemblyDrawingList(
    assemblyPartItemDetailId ?? NUMBERMAP.ZERO,
    !!assemblyPartItemDetailId
  )

  const [openDrawingModal, setOpenDrawingModal] = useState(false)
  const [editingDrawingId, setEditingDrawingId] = useState<number | null>(null)
  const [editingDrawing, setEditingDrawing] = useState<AssemblyDrawing | null>(null)
  const [drawingNo, setDrawingNo] = useState('')
  const [formData, setFormData] = useState<{ documents: any[] }>({ documents: [] })
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])
  const [errors, setErrors] = useState<{ drawingNo?: string; fileUpload?: string }>({})

  const { data: drawingByIdData } = useAssemblyDrawingById(
    editingDrawingId ?? NUMBERMAP.ZERO,
    openDrawingModal && !!editingDrawingId
  )

  const { mutate: upsertDrawing, isPending: isSavingDrawing } = useUpsertAssemblyDrawing()
  const { mutate: deleteDrawing, isPending: isDeletingDrawing } = useDeleteAssemblyDrawing()

  const contextInstanceIdForDraft = editingDrawingId

  const { draftSave, clearDraftSave, isDraftSaving, fetchDraft, draftData, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'assembly_drawing',
    context_instance_id: contextInstanceIdForDraft,
    enableFetch: false,
  })

  const handleDraftSave = useCallback(
    (formFields: { drawingNo: string }, fileData?: FinalFileData) => {
      const finalFileDataValue = fileData ?? finalFileData
      const draftDatas = editingDrawingId ? drawingByIdData : draftData
      const draftConfig = {
        fileFieldToSectionMap: { documents: 'documents' },
        sectionTypeToNameMap: { documents: 'documents' },
        responseDataKeyMap: { documents: 'documents' },
      }
      const draftPreparation = prepareDraftDocumentsGeneric(
        draftDocuments,
        draftDelete,
        { documents: formData.documents ?? [] },
        { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
        draftDatas,
        draftConfig
      )
      if (draftPreparation.draftDocuments) {
        setDraftDocuments(draftPreparation.draftDocuments)
      }
      if (draftPreparation.draftDelete) {
        setDraftDelete(draftPreparation.draftDelete)
      }
      const payload = {
        id: contextInstanceIdForDraft ?? Date.now(),
        drawingNo: formFields.drawingNo,
        draftDocuments: draftPreparation.draftDocuments,
        draftDelete: draftPreparation.draftDelete,
        type: 'draft',
      }
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
      })
    },
    [
      finalFileData,
      formData.documents,
      draftDocuments,
      draftDelete,
      editingDrawingId,
      drawingByIdData,
      draftData,
      contextInstanceIdForDraft,
      draftSave,
    ]
  )

  // Prefill modal from API /api/v1/production/assembly-drawing/:drawing_id
  useEffect(() => {
    const record = getRecordFromDrawingByIdData(drawingByIdData as { data?: any } | undefined)
    if (!record || !openDrawingModal || !editingDrawingId) return

    setDrawingNo(String(record.drawing_number ?? record.drawingNo ?? ''))
    const docs =
      record.draftDocuments?.documents ?? record.document ?? record.documents ?? []
    if (Array.isArray(docs)) {
      setFormData((prev) => ({ ...prev, documents: docs }))
    }
    if (record.draftDocuments) {
      setDraftDocuments(record.draftDocuments)
    }
    if (record.draftDelete != null) {
      setDraftDelete(normalizeDraftDeleteToArray(record.draftDelete))
    }
    setEditingDrawing({
      id: String(record.id),
      drawingNo: record.drawing_number ?? record.drawingNo ?? '',
      sno: NUMBERMAP.ZERO,
      filename: '',
    })
  }, [drawingByIdData, openDrawingModal, editingDrawingId])

  // Load draft data when modal is open in add mode only
  // Draft response: { data: { drawingNo, draftDocuments: { documents }, documents, draftDelete } }
  useEffect(() => {
    if (!draftData?.data || !openDrawingModal || editingDrawingId) return
    setDrawingNo(draftData.data.drawingNo ?? '')
    if (draftData.data.documents && Array.isArray(draftData.data.documents)) {
      setFormData((prev) => ({ ...prev, documents: draftData.data.documents }))
    }
    setDraftDocuments(draftData.data.draftDocuments)
    setDraftDelete(draftData.data.draftDelete)
  }, [draftData, openDrawingModal, editingDrawingId])

  // Fetch draft when Add modal opens
  useEffect(() => {
    if (openDrawingModal && !editingDrawingId && assemblyPartItemDetailId) {
      fetchDraft()
    }
  }, [openDrawingModal, editingDrawingId, assemblyPartItemDetailId, fetchDraft])

  const createFileMetadata = useCallback(() => {
    const documents = formData?.documents ?? []
    if (!hasFileData(finalFileData) && documents.length === NUMBERMAP.ZERO) return null
    const record = getRecordFromDrawingByIdData(drawingByIdData as { data?: any } | undefined)
    const existingDocs = record
      ? (record.document ??
         record.documents ??
         (record.draftDocuments?.documents ?? []))
      : []
    const existingData = editingDrawingId
      ? { data: record ? { documents: existingDocs } : { documents: [] } }
      : { data: { documents: [], draftDocuments, draftDelete } }
    const metadata = createFileMetadataUtil({
      isEditMode: !!editingDrawingId,
      draftData,
      existingData,
      finalFileData,
      dataPath: 'documents',
    })
    return {
      documents_to_delete: metadata.documents_to_delete,
      create_meta_data: metadata.create_meta_data,
      update_meta_data: metadata.update_meta_data,
    }
  }, [finalFileData, formData?.documents, drawingByIdData, editingDrawingId, draftData, draftDocuments, draftDelete])

  const drawingColumns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'drawing_number',
      headerName: 'Drawing No.',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'filename',
      headerName: 'Filename',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <Typography>{params.row.document?.map((item: any) => item.file_name).join(', ') ?? ''}</Typography>
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: any) => (
        <ActionButton
          onDelete={() => handleDeleteDrawing(params.row.id)}
          onEdit={() => handleEditDrawing(params.row.id)}
        />
      ),
    },
  ]

  const handleDeleteDrawing = (id: string | number) => {
    const list = [...(assemblyDrawingsData?.data ?? [])]
    const drawing = list.find((item: any) => item.id == id)
    if (drawing?.id != null && assemblyPartItemDetailId) {
      showActionAlert('delete').then((result) => {
        if (result.isConfirmed) {
          deleteDrawing(Number(drawing.id))
          refetchAssemblyDrawings()
        }
      })
    } else {
      showActionAlert('delete').then((result) => {
        if (result.isConfirmed) {
          const updatedDrawings = list
            .filter((item: any) => item.id !== id)
            .map((item: any, index: number) => ({
              ...item,
              sno: index + NUMBERMAP.ONE,
            }))
          onDrawingsChange(updatedDrawings)
        }
      })
    }
  }

  const handleEditDrawing = (id: string | number) => {
    setEditingDrawingId(Number(id))
    setEditingDrawing(null)
    setDrawingNo('')
    setFormData({ documents: [] })
    setFinalFileData(FINALFILEINITIALDATA)
    setDraftDocuments({})
    setDraftDelete([])
    setErrors({})
    setOpenDrawingModal(true)
  }

  const handleAddDrawing = () => {
    setEditingDrawingId(null)
    setEditingDrawing(null)
    setDrawingNo('')
    setFormData({ documents: [] })
    setFinalFileData(FINALFILEINITIALDATA)
    setDraftDocuments({})
    setDraftDelete([])
    setErrors({})
    setOpenDrawingModal(true)
  }

  const validateDrawing = (): boolean => {
    const newErrors: { drawingNo?: string; fileUpload?: string } = {}

    if (!drawingNo?.trim()) {
      newErrors.drawingNo = 'Drawing No is required'
    }

    if (!isDocumentUploadValid(finalFileData, formData?.documents ?? [])) {
      newErrors.fileUpload = 'File/documents are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSaveDrawing = () => {
    if (!validateDrawing()) return

    if (!assemblyPartItemDetailId) {
      const documents = formData?.documents ?? []
      const filename = documents.length > NUMBERMAP.ZERO
        ? (documents[NUMBERMAP.ZERO].fileName ?? documents[NUMBERMAP.ZERO].file_name ?? documents[NUMBERMAP.ZERO].name ?? '')
        : ''

      if (editingDrawing) {
        const updatedDrawings = drawings.map((item) =>
          item.id === editingDrawing.id ? { ...item, drawingNo, filename } : item
        )
        onDrawingsChange(updatedDrawings)
      } else {
        const newDrawing: AssemblyDrawing = {
          id: `drawing-${Date.now()}`,
          sno: drawings.length + NUMBERMAP.ONE,
          drawingNo,
          filename,
        }
        onDrawingsChange([...drawings, newDrawing])
      }
      setOpenDrawingModal(false)
      setEditingDrawingId(null)
      setEditingDrawing(null)
      setDrawingNo('')
      setFormData({ documents: [] })
      setFinalFileData(FINALFILEINITIALDATA)
      setDraftDocuments({})
      setDraftDelete([])
      setErrors({})
      return
    }

    clearDraftSave()
    const fileMetadata = createFileMetadata()

    upsertDrawing(
      {
        part_assembly_drawing_id: editingDrawingId ?? undefined,
        applicable_settings_id: assemblyPartItemDetailId,
        drawing_number: drawingNo,
        finalFileData: {
          ...finalFileData,
          documents_to_delete: fileMetadata?.documents_to_delete ?? finalFileData.documents_to_delete ?? [],
          create_meta_data: fileMetadata?.create_meta_data ?? finalFileData.create_meta_data ?? {},
          update_meta_data: fileMetadata?.update_meta_data ?? finalFileData.update_meta_data ?? {},
        },
      },
      {
        onSuccess: () => {
          setOpenDrawingModal(false)
          setEditingDrawingId(null)
          setEditingDrawing(null)
          setDrawingNo('')
          setFormData({ documents: [] })
          setFinalFileData(FINALFILEINITIALDATA)
          setDraftDocuments({})
          setDraftDelete([])
          setErrors({})
          refetchAssemblyDrawings()
        },
      }
    )
  }

  const handleFileUpload = (newFile: File ) => {
    setFormData((prev) => ({
      ...prev,
      documents: [...(prev.documents ?? []), newFile],
    }))
    if (errors.fileUpload) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.fileUpload
        return newErrors
      })
    }
  }

  const handleFileEdit = useCallback((fileData: any) => {
    setFormData((prev) => {
      const updatedFiles = (prev.documents ?? []).map((file: any) => {
        const currentId = typeof file === 'object' ? (file?.file_id ?? file?.id) : undefined
        const updatedId = fileData.document_id ?? fileData.id ?? fileData.file_id
        return currentId === updatedId ? { ...file, ...fileData } : file
      })
      return { ...prev, documents: updatedFiles }
    })
  }, [])

  const handleFileRemove = (data: any) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = (prev.documents ?? []).filter((file: any) => {
          let fileName: string | undefined
          if (file instanceof File) {
            fileName = file.name?.split('.')[NUMBERMAP.ZERO]
          } else {
            fileName =
              file?.file?.name?.split('.')[NUMBERMAP.ZERO] ??
              file?.name?.split('.')[NUMBERMAP.ZERO] ??
              file?.file_name
          }
          return !data.local_files_to_delete.includes(fileName)
        })
        return { ...prev, documents: updatedDocs }
      })
    }
    if (data?.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = (prev.documents ?? []).filter((file: any) => {
          const fileId = (file as FileDocument)?.file_id ?? (file as FileDocument)?.id
          return !data.documents_to_delete.includes(fileId)
        })
        return { ...prev, documents: updatedDocs }
      })
    }
  }

  const handleFileSubmit = (data: FinalFileData) => {
    setFinalFileData((prev) => mergeFinalFileData(prev, data))
    handleFileRemove(data)
    handleDraftSave({ drawingNo }, mergeFinalFileData(finalFileData, data))
    if (errors.fileUpload) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.fileUpload
        return newErrors
      })
    }
  }

  const handleModalClose = useCallback(async () => {
    await checkUnsavedDraftBeforeLeave()
    setOpenDrawingModal(false)
  }, [checkUnsavedDraftBeforeLeave])


  return (
    <>
      {isDraftSaving && <DraftLoading />}
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title="Assembly Drawings"
            rows={assemblyDrawingsData?.data ?? []}
            showAddButton
            onAddRow={handleAddDrawing}
            columns={drawingColumns}
            idField="id"
            loading={isLoadingDrawings ?? isSavingDrawing ?? isDeletingDrawing}
            hideFooter={true}
          />
        </Grid2>
      </Grid2>

      <CommonModal
        open={openDrawingModal}
        title={editingDrawingId ? 'Edit Assembly Drawing' : 'Add Assembly Drawing'}
        onClose={handleModalClose}
        onSave={handleSaveDrawing}
        buttonRequired={true}
        modalMaxWidth="900px"
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={{ ...POPUP_STYLE }}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Drawing No.*'}
              placeholder={'Enter Drawing No.'}
              value={drawingNo}
              onChange={(value: string) => {
                setDrawingNo(value)
                  handleDraftSave({ drawingNo: value })
                if (errors.drawingNo) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.drawingNo
                    return newErrors
                  })
                }
              }}
              error={errors.drawingNo}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <FileUploadManager
              initialFiles={formData?.documents}
              onSubmit={handleFileSubmit}
              onFileEdit={handleFileEdit}
              onFileUpload={handleFileUpload}
              uploadMandError={errors.fileUpload}
            />
          </Grid2>
        </Grid2>
      </CommonModal>
    </>
  )
}

export default AssemblyDrawingsForm
