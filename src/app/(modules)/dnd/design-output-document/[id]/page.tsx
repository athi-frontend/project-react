'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { DataGridTable, showActionAlert, ButtonGroup } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { PageContainer, CommonModalScroll, P20P40, FullWidth } from '@/styles/common'
import { GridColDef } from '@mui/x-data-grid'
import { DocumentDownload } from 'iconsax-react'
import { Box, Grid2, IconButton, Typography, useTheme } from '@mui/material'
import SystemGenerateModal from '@/components/modules/dnd/pre-transfer-design-output-document/SystemGenerateModal'
import { styled_container } from '@/styles/modules/dnd/preTransferDesignOutputDocument'
import { useDownloadFile } from '@/hooks/useCommonDropdown'
import {
  COMMON_CONSTANTS,
  handleFileDownloadUtil,
  FinalFileData,
  mergeFinalFileData,
  BUTTONLABELS
} from '@/lib/utils/common'
import axios from 'axios'
import {
  SECTION_TITLES,
  HEADERS,
  FIELDS,
  CONTENT_MODE,
  API_FIELD_KEYS,
  UI_TEXT,
} from '@/constants/modules/dnd/design-output-document'
import {
  useGetDesignOutputDocuments,
  useSaveDesignDocument,
  useGetDesignTransferPlanById,
} from '@/hooks/modules/dnd/useDesignOutputDocument'
import { UploadedFileData } from '@/types/common'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { BUTTONSTYLE, FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import { WIDTH_100 } from '@/constants/modules/hr/trainingEvaluation'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { CommentsHistoryContainer } from '@/styles/components/modules/taskSchedule'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
const { BUTTON_LABEL_CANCEL, BUTTON_LABEL_SAVE } = BUTTONLABELS
const { INDEX_ZERO, FAILED_ALERT, SUCCESS_ALERT, EMPTY_ARRAY_LENGTH } =
  COMMON_CONSTANTS
const { DESIGN_OUTPUT_DOCUMENT, OUTPUT_DOCUMENTS } = SECTION_TITLES
const { S_NO, DOCUMENT_NAME, DOCUMENT_TEMPLATE, UPLOAD, SYSTEM_GENERATE } =
  HEADERS
const {
  S_NO_FIELD,
  DOCUMENT_NAME_FIELD,
  DOCUMENT_TEMPLATE_FIELD,
  UPLOAD: UPLOAD_FIELD,
  SYSTEM_GENERATE: SYSTEM_GENERATE_FIELD,
} = FIELDS
const {
  PROJECT_ID,
  DESIGN_TRANSFER_PLAN_ID,
  CREATE_META_DATA,
  UPDATE_META_DATA,
  DOCUMENTS_TO_CREATE,
  DOCUMENTS_TO_DELETE,
} = API_FIELD_KEYS
const { CENTER, BLOB, TEXT } = CONTENT_MODE

export default function SimpleListPage() {
  const theme = useTheme()
  const params = useParams()
  const router = useRouter()
  const projectId = params.id
  
  const [hasEditPermission, setHasEditPermission] = useState(true)

  const [templateID, setTemplateID] = useState(NUMBERMAP.ZERO)
  const [designTransferPlanId, setDesignTransferPlanId] = useState(NUMBERMAP.ZERO)

  const {
    data: designOutputDocumentData,
    isLoading: designOutputDocumentLoading,
  } = useGetDesignOutputDocuments(Number(projectId))
  const { refetch } = useDownloadFile(templateID)
  const { mutate: saveDesignDocument } = useSaveDesignDocument()
  const { refetch: designTransferPlanByIdRefetch } =
    useGetDesignTransferPlanById(designTransferPlanId)

  const [downloadDocName, setDownloadDocName] = useState<string | null>(null)
  const [triggerDownload, setTriggerDownload] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [systemGenerateModalOpen, setSystemGenerateModalOpen] = useState(false)
  const [selectedDesignTransferPlanId, setSelectedDesignTransferPlanId] = useState(NUMBERMAP.ZERO)
  const [finalFileData, setFinalFileData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  const [uploadedFile, setUploadedFile] = useState<File[] | FileData2[]>([])
  const [systemGenerateFiles, setSystemGenerateFiles] = useState<any[]>([])

  const Columns: GridColDef[] = [
    {
      headerName: S_NO,
      field: S_NO_FIELD,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      headerName: DOCUMENT_NAME,
      field: DOCUMENT_NAME_FIELD,
      flex: NUMBERMAP.ONE,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      headerName: DOCUMENT_TEMPLATE,
      field: DOCUMENT_TEMPLATE_FIELD,
      flex: NUMBERMAP.ONE,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: CENTER,
      align: CENTER,
      renderCell: (params) => {
        return (
          <Box sx={{ width: WIDTH_100}}>
            <IconButton
              onClick={() =>
                handleTemplateDownload(
                  params.row.document_template_id,
                  params.row.document_name
                )
              }
            >
              <DocumentDownload size={NUMBERMAP.EIGHTEEN} color={theme.palette.primary.main} />
            </IconButton>
          </Box>
        )
      },
    },
    {
      headerName: UPLOAD,
      field: UPLOAD_FIELD,
      flex: NUMBERMAP.ONE,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: CENTER,
      align: CENTER,
      renderCell: (params) => {
        return (
          <Box sx={FullWidth}>
            <Typography
              sx={styled_container}
              onClick={() => handleUploadClick(params.row.design_transfer_plan_id)}
            >
              {UI_TEXT.CLICK_HERE}
            </Typography>
          </Box>
        )
      },
    },
    {
      headerName: SYSTEM_GENERATE,
      field: SYSTEM_GENERATE_FIELD,
      flex: NUMBERMAP.ONE,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: CENTER,
      align: CENTER,
      renderCell: (params) => {
        return (
          <Box sx={FullWidth}>
            <Typography
              sx={styled_container}
              onClick={() => handleSystemGenerateClick(params.row.design_transfer_plan_id)}
            >
              {UI_TEXT.CLICK_HERE}
            </Typography>
          </Box>
        )
      },
    },
  ]

  const handleDownloadSuccess = async (
    assetUrl: string,
    documentName: string
  ) => {
    try {
      const fileResponse = await axios.get(assetUrl, {
        responseType: BLOB,
      })
      const blob = fileResponse.data
      const name = `Template_${documentName.replace(/\s+/g, '_')}`
      handleFileDownloadUtil({ blob, name })
    } catch {
      showActionAlert(FAILED_ALERT)
    }
  }

  const fetchDesignTransferPlan = async () => {
    const response = await designTransferPlanByIdRefetch()
    if (response?.data) {
      setUploadedFile(response.data.data.documents ?? [])
    } else {
      setUploadedFile([])
    }
  }

  //Method to download template
  useEffect(() => {
    const fetchData = async () => {
      if (Number(templateID) && triggerDownload && downloadDocName) {
        const response = await refetch()
        if (response?.data) {
          await handleDownloadSuccess(
            response.data.data[INDEX_ZERO].assetUrl,
            downloadDocName
          )
        } else {
          showActionAlert(FAILED_ALERT)
        }
        // Reset trigger
        setTriggerDownload(false)
      }
    }

    fetchData()
  }, [templateID, triggerDownload]) // Runs when templateID or triggerDownload changes

  //Method to fetch documents based on designTransferPlanId for upload
  useEffect(() => {
    if (Number(selectedDesignTransferPlanId) && uploadModalOpen) {
      fetchDesignTransferPlan()
    }
  }, [selectedDesignTransferPlanId, uploadModalOpen])

  //Method to fetch documents based on designTransferPlanId for system generate
  useEffect(() => {
    const fetchSystemGenerateData = async () => {
      if (Number(selectedDesignTransferPlanId) && systemGenerateModalOpen) {
        const response = await designTransferPlanByIdRefetch()
        if (response?.data) {
          setSystemGenerateFiles(response.data.data.documents ?? [])
        } else {
          setSystemGenerateFiles([])
        }
      }
    }
    fetchSystemGenerateData()
  }, [selectedDesignTransferPlanId, systemGenerateModalOpen, designTransferPlanByIdRefetch])

  const handleTemplateDownload = async (
    templateId: number,
    documentName: string
  ) => {
    setTemplateID(templateId)
    setDownloadDocName(documentName)
    setTriggerDownload(true)
  }

  const handleUploadClick = (designTransferPlanId: number) => {
    setSelectedDesignTransferPlanId(designTransferPlanId)
    setDesignTransferPlanId(designTransferPlanId)
    setUploadModalOpen(true)
  }

  const handleSystemGenerateClick = (designTransferPlanId: number) => {
    setSelectedDesignTransferPlanId(designTransferPlanId)
    setDesignTransferPlanId(designTransferPlanId)
    setSystemGenerateModalOpen(true)
  }

  // Handler for File Upload in FileUploadManager
  const handleFileUpload = (newFile: File | FileData2) => {
    setUploadedFile((prev) => [...prev, newFile])
  }

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      setUploadedFile((prev) =>
        prev.map((file: FileData2) => {
          const currentId = file.id ?? file.file_id ?? undefined
          const updatedId = updatedFile.document_id ?? updatedFile.id

          return currentId === updatedId ? { ...file, ...updatedFile } : file
        })
      )
    },
    []
  )

  const handleSaveOutputDocument = () => {
    const designOutputDocumentFormData = new FormData()

    const hasItemsToDelete =
      (finalFileData.documents_to_delete?.length ?? NUMBERMAP.ZERO) > NUMBERMAP.ZERO
    const hasCreateMetaData =
      Object.keys(finalFileData.create_meta_data ?? {}).length > NUMBERMAP.ZERO
    const hasUpdateMetaData =
      Object.keys(finalFileData.update_meta_data ?? {}).length > NUMBERMAP.ZERO

    if (hasItemsToDelete || hasCreateMetaData || hasUpdateMetaData) {
      // Build createMetaData and append files
      const fieldsToAppend = {
        [PROJECT_ID]: projectId?.toString(),
        [DESIGN_TRANSFER_PLAN_ID]: designTransferPlanId?.toString(),
        [DOCUMENTS_TO_DELETE]: JSON.stringify(
          finalFileData.documents_to_delete ?? []
        ),
        [CREATE_META_DATA]: JSON.stringify(
          finalFileData.create_meta_data ?? []
        ),
        [UPDATE_META_DATA]: JSON.stringify(
          finalFileData.update_meta_data ?? []
        ),
      }
      finalFileData?.documents_to_create?.forEach((fileData: File | string) => {
        // Check if this is a new file (has actual File object)
        if (fileData instanceof File) {
          designOutputDocumentFormData.append(
            DOCUMENTS_TO_CREATE,
            fileData,
            fileData.name
          )
        }
      })

      Object.entries(fieldsToAppend).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          designOutputDocumentFormData.append(key, value)
        }
      })
      const payload = { formData: designOutputDocumentFormData }

      saveDesignDocument(payload, {
        onSuccess: () => {
          showActionAlert(SUCCESS_ALERT)
          handleCloseUploadModal()
        },
        onError: () => {
          showActionAlert(FAILED_ALERT)
        },
      })
    } else {
      handleCloseUploadModal()
    }
  }

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false)
    setUploadedFile([])
    setFinalFileData(FINALFILEINITIALDATA)
    setSelectedDesignTransferPlanId(NUMBERMAP.ZERO)
    setDesignTransferPlanId(NUMBERMAP.ZERO)
  }

  const handleCloseSystemGenerateModal = () => {
    setSystemGenerateModalOpen(false)
    setSystemGenerateFiles([])
    setSelectedDesignTransferPlanId(NUMBERMAP.ZERO)
    setDesignTransferPlanId(NUMBERMAP.ZERO)
  }

  const handleSaveSystemGenerate = () => {
    if (!selectedDesignTransferPlanId) {
      showActionAlert(FAILED_ALERT)
      return
    }

    const formData = new FormData()
    if (projectId) {
      formData.append(PROJECT_ID, projectId.toString())
    }
    formData.append(DESIGN_TRANSFER_PLAN_ID, selectedDesignTransferPlanId.toString())
    
    // Add documents_to_delete (always include as empty array)
    formData.append(DOCUMENTS_TO_DELETE, JSON.stringify([]))

    // Add create_meta_data (always include, even if empty)
    formData.append(CREATE_META_DATA, JSON.stringify({}))

    // Add update_meta_data (always include, even if empty)
    formData.append(UPDATE_META_DATA, JSON.stringify({}))

    const payload = { formData }

    saveDesignDocument(payload, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT)
        handleCloseSystemGenerateModal()
      },
      onError: () => {
        showActionAlert(FAILED_ALERT)
      },
    })
  }


  useEffect(() => {
    if (finalFileData.documents_to_delete?.length > EMPTY_ARRAY_LENGTH) {
      setUploadedFile((prev) => {
        return prev.filter(
          (file: FileData2) =>
            !finalFileData.documents_to_delete.includes(file.file_id)
        )
      })
    }
    if (finalFileData.local_files_to_delete?.length > EMPTY_ARRAY_LENGTH) {
      setUploadedFile((prev) => {
        return prev.filter(
          (file: FileData2) =>
            !finalFileData.local_files_to_delete.includes(file.id)
        )
      })
    }
  }, [finalFileData])

  return (
    <PageContainer>
      <CommonSharedTale
        Table={
          <Box sx={{ padding: P20P40 }}>
            <DataGridTable
              columns={Columns}
              rows={designOutputDocumentData?.data}
              idField={DESIGN_TRANSFER_PLAN_ID}
              loading={designOutputDocumentLoading}
              hideFooter
            />
          </Box>
        }
        title={DESIGN_OUTPUT_DOCUMENT}
      />
      <CommentsHistoryContainer>
        <CommentsHistory 
          comments={designOutputDocumentData?.meta_info?.task_info?.task_comments} 
        />
      </CommentsHistoryContainer>
      <Grid2 sx={BUTTONSTYLE}>
      <ReviewerModalManager
            isLoading={designOutputDocumentLoading}
            permissions={designOutputDocumentData?.meta_info?.action_control?.permissions ?? []}
            projectId={Number(projectId)}
            menuId={designOutputDocumentData?.meta_info?.action_control?.menuId}
            menuName={designOutputDocumentData?.meta_info?.action_control?.formName}
            hideSaveButton={true}
            customHandlers={{ 
              handleCancel: ()=>{router.push(ROUTE_PATHS.DND_PROJECT_LIST)}
            }}
            onPermissionChange={setHasEditPermission}
            reviewerList={designOutputDocumentData?.meta_info?.task_info?.reviewer_list}
          />
          </Grid2>
      <CommonModal
        title={OUTPUT_DOCUMENTS}
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
      >
        <CommonModalScroll>
          <FileUploadManager
            initialFiles={uploadedFile ?? []}
            onFileUpload={handleFileUpload}
            onFileEdit={handleFileEdit}
            hasEditable={!hasEditPermission}
            onSubmit={(data) => {
              setFinalFileData((prev) => mergeFinalFileData(prev, data))
            }}
            subHeader={UPLOAD}
          />
          <ButtonGroup
            buttons={[
              { label: BUTTON_LABEL_CANCEL, onClick: handleCloseUploadModal },
              {
                label: BUTTON_LABEL_SAVE,
                onClick: handleSaveOutputDocument,
                disabled: !hasEditPermission,
              },
            ]}
          />
        </CommonModalScroll>
      </CommonModal>

      <SystemGenerateModal
        open={systemGenerateModalOpen}
        onClose={handleCloseSystemGenerateModal}
        onSave={handleSaveSystemGenerate}
        files={systemGenerateFiles}
        setFiles={setSystemGenerateFiles}
      />
    </PageContainer>
  )
}
