'use client'
import React, { useState, useEffect } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { DataGridTable, showActionAlert } from '@/components/ui'
import { DocumentDownload } from 'iconsax-react'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import DocumentUploadModal from '@/components/modules/dnd/pre-transfer-design-output-document/designOutputDocument'
import SystemGenerateModal from '@/components/modules/dnd/pre-transfer-design-output-document/SystemGenerateModal'
import { useParams } from 'next/navigation'
import { usePreTransfer, useUploadPreTransferDocument, usePreTransferByID } from '@/hooks/modules/dnd/usePreTransferDesignOutputDocument'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import { FAILED, SUCCESS } from '@/constants/modules/dnd/pnd'
import { useDownloadFile } from '@/hooks/useCommonDropdown'
import { COMMON_CONSTANTS, handleFileDownloadUtil } from '@/lib/utils/common'
import axios from 'axios'
import { APPEND_FIELDS, BLOB_NAME, CENTER, FIELDS, HEADERS, LEFT, TITLE } from '@/constants/modules/dnd/preTransferDesignOutputDocument'
import { StepContainer, styled_container } from '@/styles/modules/dnd/preTransferDesignOutputDocument'
import { FullWidth, PADDING } from '@/styles/common'
import GlobalLoader from '@/components/shared/LoadingSpinner'

const { FAILED_ALERT, INDEX_ZERO } = COMMON_CONSTANTS
const { BLOB } = { BLOB: BLOB_NAME }

interface DocumentItem {
  id: string
  serialNumber: string
  documentName: string
  hasTemplate: boolean
  uploadLink: string
  design_transfer_plan_id: number
  document_template_id: number 
}

interface DocumentManagementTableProps {
  documents?: DocumentItem[]
}

/**
    Classification : Confidential
**/

const DocumentManagementTable: React.FC<DocumentManagementTableProps> = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [systemGenerateModalOpen, setSystemGenerateModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null)
  const [uploadFiles, setUploadFiles] = useState<any[]>([])
  const [systemGenerateFiles, setSystemGenerateFiles] = useState<any[]>([])
  const [finalFileData, setFinalFileData] = useState(FINALFILEINITIALDATA)
  const [templateID, setTemplateID] = useState<string | number>('-')
  const [downloadDocName, setDownloadDocName] = useState<string | null>(null)
  const [triggerDownload, setTriggerDownload] = useState(false)
  const theme = useTheme()
  const params = useParams()
  const projectId = params.id
  const { data: TransferResponse, isLoading } = usePreTransfer(Number(projectId))
  const { mutate: uploadDocument } = useUploadPreTransferDocument()
  const { refetch: fetchPreTransferByID } = usePreTransferByID(
    selectedDocument?.design_transfer_plan_id ?? NUMBERMAP.ZERO
  )
  const { refetch: refetchDownload, isLoading: downloadFileLoading } = useDownloadFile(Number(templateID))

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDocument?.design_transfer_plan_id) {
        try {
          const response = await fetchPreTransferByID()
          if (response?.data?.data?.documents) {
            setUploadFiles(response.data.data.documents)
          } else {
            setUploadFiles([])
          }
        } catch {
          showActionAlert(FAILED_ALERT)
          setUploadFiles([])
        }
      }
    }

    fetchData()
  }, [selectedDocument, fetchPreTransferByID])

 

  useEffect(() => {
    if (finalFileData.documents_to_delete && finalFileData.documents_to_delete.length > NUMBERMAP.ZERO) {
      const deleteIds: number[] = finalFileData.documents_to_delete as number[]
      setUploadFiles((prev) => {
        return prev.filter(
          (file) => file.file_id && !deleteIds.includes(Number(file.file_id))
        )
      })
    }
    if (finalFileData.local_files_to_delete && finalFileData.local_files_to_delete.length > NUMBERMAP.ZERO) {
      const localDeleteIds: string[] = finalFileData.local_files_to_delete as string[]
      setUploadFiles((prev) => {
        return prev.filter(
          (file) => file.id && !localDeleteIds.includes(String(file.id))
        )
      })
    }
  }, [finalFileData])

  const handleDownloadSuccess = async (assetUrl: string, documentName: string) => {
    try {
      const fileResponse = await axios.get(assetUrl, {
        responseType: BLOB
      })
      const blob = fileResponse.data
      const name = `Template_${documentName.replace(/\s+/g, '_')}`
   
      handleFileDownloadUtil({ blob, name })
    } catch {
      showActionAlert(FAILED_ALERT)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (Number(templateID) && triggerDownload && downloadDocName) {
        const response = await refetchDownload()
        if (response?.data) {
          await handleDownloadSuccess(
            response.data.data[INDEX_ZERO].assetUrl,
            downloadDocName
          )
        } else {
          showActionAlert(FAILED_ALERT)
        }
      
        setTriggerDownload(false)
      }
    }

    fetchData()
  }, [templateID, triggerDownload])

  const handleTemplateDownload = (templateId: number | undefined, documentName: string) => {
    if (!templateId) {
      showActionAlert(FAILED_ALERT)
      return
    }
    setTemplateID(templateId)
    setDownloadDocName(documentName)
    setTriggerDownload(true)
  }

  const handleUploadClick = async (document: DocumentItem) => {
    setSelectedDocument(document)
    setUploadModalOpen(true)
  }

  const handleSystemGenerateClick = async (document: DocumentItem) => {
    setSelectedDocument(document)
    setSystemGenerateModalOpen(true)
  }

  useEffect(() => {
    const fetchSystemGenerateData = async () => {
      if (selectedDocument?.design_transfer_plan_id && systemGenerateModalOpen) {
        const response = await fetchPreTransferByID()
        if (response?.data?.data?.documents) {
          setSystemGenerateFiles(response.data.data.documents)
        } else {
          setSystemGenerateFiles([])
        }
      }
    }

    fetchSystemGenerateData()
  }, [selectedDocument, systemGenerateModalOpen, fetchPreTransferByID])

  const handleCloseModal = () => {
    setUploadModalOpen(false)
    setSelectedDocument(null)
    setUploadFiles([])
    setFinalFileData(FINALFILEINITIALDATA)
  }

  const handleCloseSystemGenerateModal = () => {
    setSystemGenerateModalOpen(false)
    setSelectedDocument(null)
    setSystemGenerateFiles([])
  }

  const handleSaveSystemGenerate = () => {
    if (!selectedDocument) {
      showActionAlert(FAILED)
      return
    }

    if (systemGenerateFiles.length === NUMBERMAP.ZERO) {
      showActionAlert(FAILED)
      return
    }

    const formData = new FormData()
    if (projectId) {
      formData.append(APPEND_FIELDS.PROJECT_ID, projectId.toString())
    }
    formData.append(APPEND_FIELDS.DESIGN, selectedDocument.design_transfer_plan_id.toString())
    
    // Add documents_to_create (files) - empty for system generate as files are already in system
    // Add documents_to_delete (always include as empty array)
    formData.append(APPEND_FIELDS.DELETE, JSON.stringify([]))

    // Add create_meta_data (always include, even if empty)
    formData.append(APPEND_FIELDS.META_CREATE, JSON.stringify({}))

    // Add update_meta_data (always include, even if empty)
    formData.append(APPEND_FIELDS.UPDATE, JSON.stringify({}))

    // Add local_files_to_delete (always include as empty array)
    formData.append(APPEND_FIELDS.LOCAL_DELETE, JSON.stringify([]))

    uploadDocument(formData, {
      onSuccess: () => {
        showActionAlert(SUCCESS)
        handleCloseSystemGenerateModal()
      },
      onError: () => {
        showActionAlert(FAILED)
      },
    })
  }

  const hasAnyUploadData = (): boolean => {
    return (
      uploadFiles.length > NUMBERMAP.ZERO ||
      finalFileData.documents_to_create.length > NUMBERMAP.ZERO ||
      finalFileData.documents_to_delete.length > NUMBERMAP.ZERO ||
      finalFileData.local_files_to_delete.length > NUMBERMAP.ZERO
    )
  }

  const validateUploadData = (): boolean => {
    return selectedDocument !== null && hasAnyUploadData()
  }

  const appendFilesToFormData = (formData: FormData) => {
    if (finalFileData?.documents_to_create?.length > NUMBERMAP.ZERO) {
      finalFileData.documents_to_create.forEach((file: File) => {
        if (file instanceof File) {
          formData.append(APPEND_FIELDS.CREATE, file, file.name)
        }
      })
    }
  }

  const appendArrayField = (formData: FormData, field: string, data: any[], defaultValue: any[] = []) => {
    const value = data && data.length > NUMBERMAP.ZERO ? data : defaultValue
    formData.append(field, JSON.stringify(value))
  }

  const appendObjectField = (formData: FormData, field: string, data: any, defaultValue: any = {}) => {
    const value = data && Object.keys(data).length > NUMBERMAP.ZERO ? data : defaultValue
    formData.append(field, JSON.stringify(value))
  }

  const buildUploadFormData = (): FormData => {
    const formData = new FormData()
    formData.append(APPEND_FIELDS.PROJECT_ID, projectId.toString())
    formData.append(APPEND_FIELDS.DESIGN, selectedDocument?.design_transfer_plan_id.toString() ?? '')
    
    appendFilesToFormData(formData)
    appendArrayField(formData, APPEND_FIELDS.DELETE, finalFileData.documents_to_delete, [])
    appendObjectField(formData, APPEND_FIELDS.META_CREATE, finalFileData.create_meta_data, {})
    appendObjectField(formData, APPEND_FIELDS.UPDATE, finalFileData.update_meta_data, {})
    appendArrayField(formData, APPEND_FIELDS.LOCAL_DELETE, finalFileData.local_files_to_delete, [])

    return formData
  }

  const handleSaveUpload = () => {
    if (!validateUploadData()) {
      showActionAlert(FAILED)
      return
    }

    const formData = buildUploadFormData()

    uploadDocument(formData, {
      onSuccess: () => {
        showActionAlert(SUCCESS)
        handleCloseModal()
      },
      onError: () => {
        showActionAlert(FAILED)
      },
    })
  }

  const columns: GridColDef[] = [
    {
      field: FIELDS.S_NO,
      headerName: HEADERS.S_NO,
      flex: NUMBERMAP.HALF,
      sortable: false,
      headerAlign: LEFT,
      align: LEFT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{params.row.serialNumber}</Typography>
      ),
    },
    {
      field: FIELDS.DOCUMENT_NAME,
      headerName: HEADERS.DOCUMENT_NAME,
      flex: NUMBERMAP.ONE,
      sortable: false,
      headerAlign: LEFT,
      align: LEFT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography component={StepContainer}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: FIELDS.TEMPLATE,
      headerName: HEADERS.DOCUMENT_TEMPLATE,
      flex: NUMBERMAP.ONE,
      sortable: false,
      headerAlign: CENTER,
      align: CENTER,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={FullWidth}>
          {params.row.document_template_id ? (
            <DocumentDownload
              size={NUMBERMAP.TWENTYFOUR}
              color={theme.palette.primary.main}
              onClick={() => handleTemplateDownload(params.row.document_template_id, params.row.document_name)}
            />
          ) : (
            <Typography>-</Typography>
          )}
        </Box>
      ),
    },
    {
      field: FIELDS.UPLOAD,
      headerName: HEADERS.UPLOAD,
      flex: NUMBERMAP.ONE,
      sortable: false,
      headerAlign: CENTER,
      align: CENTER,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={FullWidth}>
          <Typography
            sx={styled_container}
            onClick={() => {
              handleUploadClick(params.row as DocumentItem)
            }}
          >
            Click Here
          </Typography>
        </Box>
      ),
    },
    {
      field: FIELDS.SYSTEM_GENERATE,
      headerName: HEADERS.SYSTEM_GENERATE,
      flex: NUMBERMAP.ONE,
      sortable: false,
      headerAlign: CENTER,
      align: CENTER,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={FullWidth}>
          <Typography
            sx={styled_container}
            onClick={() => {
              handleSystemGenerateClick(params.row as DocumentItem)
            }}
          >
            Click Here
          </Typography>
        </Box>
      ),
    },
  ]

  return (
    <>
    <GlobalLoader loading={downloadFileLoading} />
      <CommonSharedTale
        title={TITLE}
        Table={
            <Box sx={PADDING}>
              <DataGridTable
                idField={FIELDS.DESIGN_TRANSFER_PLAN_ID}
                rows={TransferResponse?.data?.response ?? []}
                columns={columns}
                hideFooter={true}
                loading={isLoading}
                hideHeader={true}
                autoHeight={true}
              />
            </Box>
        }
      />

      <DocumentUploadModal
        open={uploadModalOpen}
        onClose={handleCloseModal}
        uploadFiles={uploadFiles}
        setUploadFiles={setUploadFiles}
        onSave={handleSaveUpload}
        setFinalFileData={setFinalFileData}
      />

      <SystemGenerateModal
        open={systemGenerateModalOpen}
        onClose={handleCloseSystemGenerateModal}
        onSave={handleSaveSystemGenerate}
        files={systemGenerateFiles}
        setFiles={setSystemGenerateFiles}
      />
    </>
  )
}

export default DocumentManagementTable