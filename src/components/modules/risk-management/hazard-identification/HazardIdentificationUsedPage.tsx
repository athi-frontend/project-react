/**
 * Hazard Identification Used Page
 * Classification: Confidential
 */
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { IconButton, useTheme } from '@mui/material'
import { DocumentUpload } from 'iconsax-react'
import { PageContainer } from '@/styles/modules/hr/inductionTraining'
import { TableContainer } from '@/styles/components/ui/datatable'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { ButtonGroup, DataGridTable } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { BUTTON_LABEL, NUMBERMAP } from '@/constants/common'
import { HAZARD_IDENTIFICATION_USED_CONSTANTS, CONTEXT_TYPE } from '@/constants/modules/risk-management/hazardIdentificationUsed'
import { CommonModalScroll } from '@/styles/common'
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import {
  useHazardIdentificationUsedByToolMapperId,
  useHazardIdentificationUsedList,
  useUpsertHazardIdentificationUsed,
} from '@/hooks/modules/risk-management/useHazardIdentificationUsed'
import { FileDocument, FileData } from '@/types/components/ui/fileUploadV3'
import { mergeFinalFileData, FinalFileData } from '@/lib/utils/common'
import ProjectDetailsLoader from '../../dnd/project-details/ProjectDetailsLoader'
import RiskManagementReviewerModalManager from '@/components/modules/risk-management/reviewer-modal/RiskManagementReviewerModalManager'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'

const { TABLE_COLUMNS, ACTION_LABELS } = HAZARD_IDENTIFICATION_USED_CONSTANTS

type HazardIdentificationRow = {
  tool_mapper_id: number
  hazard_identification_tool: string
}

const HazardIdentificationUsedPage: React.FC = () => {
  
  const theme = useTheme()
  const router = useRouter()
  const { id } = useParams()

  const { data: hazardListData, isLoading: isListLoading, refetch: refetchList } =
    useHazardIdentificationUsedList(Number(id), NUMBERMAP.ONE)

  const [toolMapperId, setToolMapperId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasEditPermission, setHasEditPermission] = useState(true)
  const fileFinalDataDefault: FinalFileData = {
    documents_to_create: [],
    documents_to_delete: [],
    create_meta_data: {},
    update_meta_data: {},
    local_files_to_delete: [],
  }
  const [fileFinalData, setFileFinalData] =
    useState<FinalFileData>(fileFinalDataDefault)
  const [initialFiles, setInitialFiles] = useState<FileDocument[]>([])
  const {
    data: usedData,
    isLoading,
    refetch,
  } = useHazardIdentificationUsedByToolMapperId(toolMapperId)
  const upsertMutation = useUpsertHazardIdentificationUsed()

  useEffect(() => {
    if (isModalOpen && toolMapperId) {
      refetch()
    }
  }, [isModalOpen, toolMapperId])

  useEffect(() => {
    if (usedData?.data && isModalOpen) {
      const documents = Array.isArray(usedData?.data)
        ? (usedData?.data[NUMBERMAP.ZERO]?.documents ?? [])
        : []
      setInitialFiles(Array.isArray(documents) ? documents : [])
    }
  }, [usedData, isModalOpen])

  const handleUploadClick = (rowData: HazardIdentificationRow) => {
    setToolMapperId(rowData.tool_mapper_id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setFileFinalData(fileFinalDataDefault)
    setInitialFiles([])
    setToolMapperId(null)
  }

  // Removes files from initialFiles and updates fileFinalData
  const handleFileRemove = (data: FinalFileData) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setInitialFiles((prev) =>
        prev.filter(
          (file) =>
            !data.local_files_to_delete.includes(
              (file.file?.name ?? '').split('.')[NUMBERMAP.ZERO]
            )
        )
      )
    }
  }

  const handleFileUpload = (file: FileData) => {
    setInitialFiles((prev) => [...prev, file as FileDocument])
  }

  const handleFileEdit = (file: FileData) => {
    setInitialFiles((prev) =>
      prev.map((f) => (f.id === Number(file.id) ? (file as FileDocument) : f))
    )
  }

  const handleModalSave = () => {
    // Check if all payload parts are empty, if so just close modal and don't call API
    const isPayloadEmpty =
      (!fileFinalData.documents_to_create ||
        fileFinalData.documents_to_create.length === NUMBERMAP.ZERO) &&
      (!fileFinalData.documents_to_delete ||
        fileFinalData.documents_to_delete.length === NUMBERMAP.ZERO) &&
      (!fileFinalData.create_meta_data ||
        Object.keys(fileFinalData.create_meta_data).length ===
          NUMBERMAP.ZERO) &&
      (!fileFinalData.update_meta_data ||
        Object.keys(fileFinalData.update_meta_data).length === NUMBERMAP.ZERO)

    if (isPayloadEmpty) {
      setIsModalOpen(false)
      setFileFinalData(fileFinalDataDefault)
      setInitialFiles([])
      return
    }

    const formData = new FormData()
    formData.append(
      HAZARD_IDENTIFICATION_USED_CONSTANTS.TABLE_ID_FIELD,
      String(toolMapperId)
    )

    if (Array.isArray(fileFinalData.documents_to_create)) {
      fileFinalData.documents_to_create.forEach((file) => {
        if (file instanceof File) {
          formData.append(
            HAZARD_IDENTIFICATION_USED_CONSTANTS.FORM_KEYS.DOCUMENTS_TO_CREATE,
            file,
            file.name
          )
        }
      })
    }

    if (
      Array.isArray(fileFinalData.documents_to_delete) &&
      fileFinalData.documents_to_delete.length > NUMBERMAP.ZERO
    ) {
      formData.append(
        HAZARD_IDENTIFICATION_USED_CONSTANTS.FORM_KEYS.DOCUMENTS_TO_DELETE,
        JSON.stringify(fileFinalData.documents_to_delete)
      )
    }

    if (
      fileFinalData.create_meta_data &&
      Object.keys(fileFinalData.create_meta_data).length > NUMBERMAP.ZERO
    ) {
      formData.append(
        HAZARD_IDENTIFICATION_USED_CONSTANTS.FORM_KEYS.CREATE_META_DATA,
        JSON.stringify(fileFinalData.create_meta_data)
      )
    }

    if (
      fileFinalData.update_meta_data &&
      Object.keys(fileFinalData.update_meta_data).length > NUMBERMAP.ZERO
    ) {
      formData.append(
        HAZARD_IDENTIFICATION_USED_CONSTANTS.FORM_KEYS.UPDATE_META_DATA,
        JSON.stringify(fileFinalData.update_meta_data)
      )
    }

    upsertMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false)
        setFileFinalData(fileFinalDataDefault)
        setInitialFiles([])
      },
    })
  }

  const columns: GridColDef[] = [
    {
      field: TABLE_COLUMNS.SNO.field,
      headerName: TABLE_COLUMNS.SNO.headerName,
      flex: TABLE_COLUMNS.SNO.flex,
    },
    {
      field: TABLE_COLUMNS.HAZARD_IDENTIFICATION.field,
      headerName: TABLE_COLUMNS.HAZARD_IDENTIFICATION.headerName,
      flex: TABLE_COLUMNS.HAZARD_IDENTIFICATION.flex,
    },
    {
      field: TABLE_COLUMNS.ACTIONS.field,
      headerName: TABLE_COLUMNS.ACTIONS.headerName,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          aria-label={ACTION_LABELS.UPLOAD}
          onClick={() => {
            handleUploadClick(params.row)
          }}
        >
          <DocumentUpload
            size={NUMBERMAP.EIGHTEEN}
            color={theme.palette.primary.main}
          />
        </IconButton>
      ),
    },
  ]

  const isAnyLoading = () => {
    if (isLoading) return true
    if (upsertMutation.isPending) return true
    return false
  }

  const hasPageWorkflowData = hazardListData?.meta_info?.action_control

  return (
    <PageContainer>
      <CommonSharedTale
        title={HAZARD_IDENTIFICATION_USED_CONSTANTS.TITLE}
        Table={
          <TableContainer>
            <DataGridTable
              rows={hazardListData?.data ?? []}
              columns={columns}
              idField={HAZARD_IDENTIFICATION_USED_CONSTANTS.TABLE_ID_FIELD}
              hideFooter
              loading={isListLoading}
            />
            {hasPageWorkflowData && (
                <RiskManagementReviewerModalManager
                  isLoading={isListLoading}
                  permissions={hazardListData?.meta_info?.action_control?.permissions ?? []}
                  menuId={hazardListData?.meta_info?.action_control?.menuId}
                  menuName={hazardListData?.meta_info?.action_control?.formName}
                  taskInfo={hazardListData?.meta_info?.task_info}
                  onPermissionChange={setHasEditPermission}
                  customHandlers={{
                    handleCancel: () => router.push(APPLICABILITY_ROUTES.RISK_MANAGEMENT),
                  }}
                  contextType={CONTEXT_TYPE.HAZARD_IDENTIFICATION_USED}
                  contextId={Number(id)}
                  onRefetch={refetchList}
                  queryKey={RISK_MANAGEMENT_QUERY_KEYS.HAZARD_IDENTIFICATION_USED.LIST}
                  hideSaveButton={true}
                />
            )}
          </TableContainer>
        }
      />

      <CommonModal
        open={isModalOpen}
        onClose={handleModalClose}
        title={HAZARD_IDENTIFICATION_USED_CONSTANTS.MODAL.TITLE}
      >
        <ProjectDetailsLoader loading={isAnyLoading()} />
        <CommonModalScroll>
          <FileUploadManager
            subHeader={HAZARD_IDENTIFICATION_USED_CONSTANTS.MODAL.SUB_HEADER}
            initialFiles={initialFiles}
            onFileUpload={handleFileUpload}
            onFileEdit={handleFileEdit}
            hasEditable={!hasEditPermission}
            onSubmit={(data) => {
              setFileFinalData((prev: FinalFileData) =>
                mergeFinalFileData(prev, data)
              )
              handleFileRemove(data)
            }}
          />
            <ButtonGroup buttons={[
              { label: BUTTON_LABEL.CANCEL, onClick: handleModalClose },
              {
                label: BUTTON_LABEL.SAVE,
                onClick: handleModalSave,
                disabled: !hasEditPermission,
              },
            ]} />
        </CommonModalScroll>
      </CommonModal>
    </PageContainer>
  )
}

export default HazardIdentificationUsedPage
