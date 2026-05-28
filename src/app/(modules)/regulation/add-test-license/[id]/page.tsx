'use client'
import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { ButtonGroup, DataGridTable } from '@/components/ui'
import { NUMBERMAP, BUTTON_LABEL, FILE_UPLOAD_SUB_HEADER, WORKFLOW_ACTIONS, REGULATIONPATH } from '@/constants/common'
import { PageContainer } from '@/styles/modules/hr/inductionTraining'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { CommonModalScroll } from '@/styles/common'
import { FinalFileData, mergeFinalFileData } from '@/lib/utils/common'
import { FileData, FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  useAddTestLicenseById,
  useAddTestLicenseFiles,
  useSaveAddTestLicense,
  useAddTestLicense,
} from '@/hooks/modules/regulation/useTestLicenseChecklist'
import { downloadStyles, TableContainer } from '@/styles/components/ui/datatable'
import { ADD_TEST_LICENSE_CONSTANTS, ADD_TEST_LICENSE_COLUMNS } from '@/constants/modules/regulation/addTestLicense'
import { RegulationReviewerModalManager } from "@/components/modules/regulation/reviewer-modal";

/**
    Classification : Confidential
**/

const createInitialFinalFileData = (): FinalFileData => ({
  documents_to_create: [],
  documents_to_delete: [],
  create_meta_data: {},
  update_meta_data: {},
  local_files_to_delete: [],
})

const INITIAL_FORM_ERRORS = { uploadDocuments: '' }

const TestLicenceChecklistPage: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const PROJECT_ID = Number(params.id)
  const { data: testLicenseData, isLoading } = useAddTestLicenseById(PROJECT_ID)
  const { data: workflowData, isLoading: isWorkflowLoading, refetch: refetchWorkflow } = useAddTestLicense(PROJECT_ID.toString())
  const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(
    null
  )
  const { data: filesData, refetch: refetchFiles } = useAddTestLicenseFiles(
    selectedChecklistId ?? undefined
  )
  const { mutate: saveAddTestLicense } = useSaveAddTestLicense()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<
    File[] | FileDocument[]
  >([])
  const [finalFileData, setFinalFileData] =
    useState<FinalFileData>(createInitialFinalFileData())
  const [errors, setErrors] = useState<{ uploadDocuments: string }>(
    INITIAL_FORM_ERRORS
  )
  const [hasEditPermission, setHasEditPermission] = useState(false)  
  // Check if only Cancel button is available (no edit permissions)
  const hasOnlyCancelButton = workflowData?.meta_info?.action_control?.permissions?.length === NUMBERMAP.ONE && 
    workflowData?.meta_info?.action_control?.permissions?.some((p: { action: string }) => p.action === WORKFLOW_ACTIONS.CANCEL);

  const resetUploadState = () => {
    setUploadedDocuments([])
    setFinalFileData(createInitialFinalFileData())
    setErrors(INITIAL_FORM_ERRORS)
  }

  const handleSave = () => {
    if (!selectedChecklistId) return;
    const formData = new FormData()
    
    // Append files (already processed by FileUploadManager with UUID names)
    finalFileData.documents_to_create.forEach((file) => {
      formData.append('documents_to_create', file, file.name)
    })
    
    // Append other fields
    formData.append('license_id', selectedChecklistId.toString())
    formData.append('create_meta_data', JSON.stringify(finalFileData.create_meta_data))
    formData.append('update_meta_data', JSON.stringify(finalFileData.update_meta_data))
    formData.append('documents_to_delete', JSON.stringify(finalFileData.documents_to_delete))
    
    saveAddTestLicense(formData, {
      onSuccess: () => {
        refetchWorkflow() // Refetch workflow data to show new buttons
        setIsModalOpen(false)
      }
    })
  }

  const handleCancel = () => {
    resetUploadState()
    setIsModalOpen(false)
    router.push(REGULATIONPATH)
  }

  useEffect(() => {
    if (Number(selectedChecklistId)) {
      refetchFiles()
    }
  }, [selectedChecklistId])

  const handleOpenModal = (checklistId: number) => {
    setSelectedChecklistId(checklistId)
    resetUploadState()
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedChecklistId(null)
    resetUploadState()
    setIsModalOpen(false)
  }

  const handleFileUpload = (newFile: File | FileData) => {
    if (!hasEditPermission) return; // Prevent file upload if no edit permission
    setUploadedDocuments(
      (prev) => [...prev, newFile] as File[] | FileDocument[]
    )
    if (errors.uploadDocuments) {
      setErrors((prev) => ({ ...prev, uploadDocuments: '' }))
    }
  }

  const handleFileEdit = (updatedFile: File | FileData) => {
    if (!hasEditPermission) return; // Prevent file edit if no edit permission
    setUploadedDocuments(
      (prev) =>
        prev.map((file: any) => {
          // Use id or file_id for matching
          const fileId = file.file_id ?? file.id
          const updatedId =
            (updatedFile as any).file_id ?? (updatedFile as any).id
          return fileId === updatedId ? { ...file, ...updatedFile } : file
        }) as File[] | FileDocument[]
    )
  }

  useEffect(() => {
    if (filesData?.data && Array.isArray(filesData.data)) {
      setUploadedDocuments(filesData?.data)
    }
  }, [filesData?.data])

  const columns = [
    {
      field: ADD_TEST_LICENSE_COLUMNS.SNO.FIELD,
      headerName: ADD_TEST_LICENSE_COLUMNS.SNO.HEADER,
      flex: NUMBERMAP.HALF,
    },
    {
      field: ADD_TEST_LICENSE_COLUMNS.SECTION_NO.FIELD,
      headerName: ADD_TEST_LICENSE_COLUMNS.SECTION_NO.HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: { row: { section_no: string } }) => params.row.section_no,
    },
    {
      field: ADD_TEST_LICENSE_COLUMNS.CHECKLIST_NAME.FIELD,
      headerName: ADD_TEST_LICENSE_COLUMNS.CHECKLIST_NAME.HEADER,
      flex: NUMBERMAP.TWO,
      renderCell: (params: { row: { checklist_name: string } }) => params.row.checklist_name,
    },
    {
      field: ADD_TEST_LICENSE_COLUMNS.UPLOAD_FILE.FIELD,
      headerName: ADD_TEST_LICENSE_COLUMNS.UPLOAD_FILE.HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: { row: { checklist_id: number } }) => (
        <Typography
          sx={downloadStyles.title}
          onClick={(e) => {
            e.preventDefault()
            handleOpenModal(params.row.checklist_id)
          }}
        >
          {ADD_TEST_LICENSE_CONSTANTS.UPLOAD_FILE_LABEL}
        </Typography>
      ),
    },
  ]

  return (
    <PageContainer>
      <Box>
        <CommonSharedTale
          title={ADD_TEST_LICENSE_CONSTANTS.TITLE}
          Table={
            <TableContainer>
              <DataGridTable
                rows={testLicenseData?.data ?? []}
                columns={columns}
                idField={ADD_TEST_LICENSE_CONSTANTS.CHECKLIST_ID_FIELD}
                checkboxSelection={false}
                hideFooter={true}
                loading={isLoading}
              />
              <RegulationReviewerModalManager
                isLoading={isWorkflowLoading}
                permissions={workflowData?.meta_info?.action_control?.permissions ?? []}
                taskInfo={{
                  task_comments: workflowData?.meta_info?.task_info?.task_comments ?? [],
                  reviewer_list: workflowData?.meta_info?.task_info?.reviewer_list ?? []
                }}
                menuId={workflowData?.meta_info?.action_control?.menuId}
                menuName={workflowData?.meta_info?.action_control?.formName}
                        contextType="test_license"
                contextId={PROJECT_ID}
                userId={PROJECT_ID.toString()}
                organizationSiteId={PROJECT_ID.toString()}
                onPermissionChange={(permission) => {
                  // If only Cancel button is available, user should not be allowed to edit
                  setHasEditPermission(permission && !hasOnlyCancelButton);
                }}
                refetch={refetchWorkflow}
                customHandlers={{
                  handleCancel: handleCancel,
                  isDisabled: !hasEditPermission
                }}
                hideSaveButton={true} // Checklist pages handle save logic in modals, not in workflow buttons
              />
              <CommonModal
                open={isModalOpen}
                title={ADD_TEST_LICENSE_CONSTANTS.TITLE}
                onClose={handleCloseModal}
              >
                <CommonModalScroll>
                  <FileUploadManager
                    initialFiles={uploadedDocuments}
                    onFileUpload={handleFileUpload}
                    onFileEdit={handleFileEdit}
                    onSubmit={(data) =>
                      setFinalFileData((prev) => mergeFinalFileData(prev, data))
                    }
                    uploadMandError={errors.uploadDocuments}
                    subHeader={FILE_UPLOAD_SUB_HEADER}
                    hasEditable={!hasEditPermission}
                  />
                  <ButtonGroup
                    buttons={[
                      {
                        label: BUTTON_LABEL.CANCEL,
                        onClick: handleCloseModal,
                      },
                      ...(hasEditPermission ? [{
                        label: BUTTON_LABEL.SAVE,
                        onClick: handleSave,
                      }] : []),
                    ]}
                  />
                </CommonModalScroll>
              </CommonModal>
            </TableContainer>
          }
        />
      </Box>
    </PageContainer>
  )
}

export default TestLicenceChecklistPage