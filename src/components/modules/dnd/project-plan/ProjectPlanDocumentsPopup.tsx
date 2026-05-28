'use client'
import React, { useEffect, useState } from 'react'
import { DataGridTable, showActionAlert, ButtonGroup } from '@/components/ui'
import Checkbox from '@mui/material/Checkbox'
import {
  useDesignTransfer,
  useDocRef,
  useSubmitDesignTransfer,
  useSubmitDocRef,
} from '@/hooks/modules/dnd/useProjectPlan'
import { COMMON_CONSTANTS, handleFileDownloadByUrl } from '@/lib/utils/common'
import { NUMBERMAP } from '@/constants/common'
import { IconButton, useTheme } from '@mui/material'
import { DocumentDownload } from 'iconsax-react'
import { getfileURL } from '@/hooks/useCommonDropdown'
import {
  CANCEL_BUTTON_TEXT,
  SAVE_BUTTON_TEXT,
} from '@/constants/components/ui/modal'
import {
  DESIGN_TRANSFER,
  DOCUMENT_REFERENCE_DESIGN_TRANSFER_FIELDS,
  DOCUMENT_REFERENCE_DESIGN_TRANSFER_HEADERS,
  STAGE_FORM,
} from '@/constants/modules/dnd/projectPlan'
import { ALERT_MESSAGES } from '@/styles/components/ui/fileUploadManagerV3'
/**
    Classification : Confidential
**/
const { FAILED_ALERT, INDEX_ZERO, INDEX_ONE } = COMMON_CONSTANTS
const {
  SNO_FIELD,
  DOCUMENT_FIELD,
  PRE_TRANSFER_FIELD,
  FINAL_DESIGN_TRANSFER_FIELD,
  DOWNLOAD_FIELD,
  CHECKBOX_FIELD,
} = DOCUMENT_REFERENCE_DESIGN_TRANSFER_FIELDS
const {
  SNO,
  DOCUMENT,
  PRE_TRANSFER,
  FINAL_DESIGN_TRANSFER,
  DOWNLOAD,
  CHECKBOX,
} = DOCUMENT_REFERENCE_DESIGN_TRANSFER_HEADERS

interface DocumentItem {
  id: number
  sno: number
  document: string
  checkbox: boolean
  preTransfer?: boolean
  finalDesignTransfer?: boolean
  download?: string
}

interface ProjectPlanDocumentsProps {
  title: string
  initialSelectedItems?: any[]
  projectId: number
  onClose: () => void
  hasEditPermission?: boolean
}

const ProjectPlanDocuments: React.FC<ProjectPlanDocumentsProps> = ({
  title,
  initialSelectedItems = [],
  projectId,
  onClose,
  hasEditPermission = true,
}) => {
  const [rows, setRows] = useState<DocumentItem[]>([])
  const { data: designTransferOptions, refetch: designTransferRefetch } =
    useDesignTransfer(projectId)
  const { data: docRefOptions, refetch: docRefRefetch } = useDocRef(projectId)
  const { mutate: saveDesignTransfer } = useSubmitDesignTransfer(projectId)
  const { mutate: saveDocRef } = useSubmitDocRef()

  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(true)

  const formatDesignTransferRows = (
    options: any[],
    initialItems: any[]
  ): any[] => {
    const getInitialItem = (id: string) =>
      initialItems.find((selected) => selected.transfer_id === id)

    return (
      options?.map((item) => {
        const initialItem = getInitialItem(item.design_transfer_id)

        return {
          id: item.design_transfer_id,
          document: item.document_title,
          preTransfer: Boolean(initialItem?.pre_transfer),
          finalDesignTransfer: Boolean(initialItem?.final_design_transfer),
        }
      }) ?? []
    )
  }

  const formatDocRefRows = (options: any[], initialItems: any[]): any[] => {
    const getInitialItem = (id: string) =>
      initialItems.find((selected) => selected.document_id === id)

    return (
      options?.map((item) => {
        const initialItem = getInitialItem(item.design_document_id)

        return {
          id: item.design_document_id,
          document: item.document_name,
          file_id: item.file_id,
          checkbox: !!initialItem,
        }
      }) ?? []
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (title === DESIGN_TRANSFER) {
          await designTransferRefetch()
          const rows = formatDesignTransferRows(
            designTransferOptions,
            initialSelectedItems
          )
          setRows(rows)
        } else {
          await docRefRefetch()
          const rows = formatDocRefRows(docRefOptions, initialSelectedItems)
          setRows(rows)
        }
        setIsLoading(false)
      } catch {
        showActionAlert(FAILED_ALERT)
      }
    }

    fetchData()
  }, [title, initialSelectedItems, designTransferOptions, docRefOptions])

  const handleCheckboxChange = (id: number, field?: string) => {
    if(!hasEditPermission) return
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => {
        if (row.id === id) {
          const updatedRow = field
            ? { ...row, [field]: !row[field as keyof DocumentItem] }
            : { ...row, checkbox: !row.checkbox }
          return updatedRow
        }
        return row
      })
      return updatedRows
    })
  }

  const handleFileDownload = async (
    documentId: number,
    documentName: string
  ) => {
    try {
         const response = await getfileURL(documentId)
           handleFileDownloadByUrl(response?.data[INDEX_ZERO].assetUrl, documentName)
    } catch {
      showActionAlert('customAlert', {
        title: ALERT_MESSAGES.DOWNLOAD_ERROR_TITLE,
        text: ALERT_MESSAGES.DOWNLOAD_ERROR_TEXT,
        icon: ALERT_MESSAGES.ALERT_ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }

  const handleSave = () => {
    if(!hasEditPermission) return
    if (title === DESIGN_TRANSFER) {
      const payload = {
        checklists: rows.map((row) => ({
          checklist_id: row.id,
          pre_transfer: row.preTransfer ? INDEX_ONE : INDEX_ZERO,
          final_design_transfer: row.finalDesignTransfer
            ? INDEX_ONE
            : INDEX_ZERO,
        })),
      }
      saveDesignTransfer(payload)
      onClose()
    } else {
      const payload = {
        project_id: projectId,
        applicable_document: rows.map((row) => ({
          document_id: row.id,
          is_applicable: row.checkbox ? INDEX_ONE : INDEX_ZERO,
        })),
      }
      saveDocRef(payload)
      onClose()
    }
  }

  const columns = [
    { field: SNO_FIELD, headerName: SNO, flex: 0.5 },
    { field: DOCUMENT_FIELD, headerName: DOCUMENT, flex: 2 },
    ...(title === DESIGN_TRANSFER
      ? [
          {
            field: PRE_TRANSFER_FIELD,
            headerName: PRE_TRANSFER,
            flex: 1,
            renderCell: (params: any) => (
              <Checkbox
                checked={params.row.preTransfer ?? false}
                disabled={!hasEditPermission}
                onChange={() =>
                  handleCheckboxChange(params.row.id, PRE_TRANSFER_FIELD)
                }
              />
            ),
          },
          {
            field: FINAL_DESIGN_TRANSFER_FIELD,
            headerName: FINAL_DESIGN_TRANSFER,
            flex: 1,
            renderCell: (params: any) => (
              <Checkbox
                checked={params.row.finalDesignTransfer ?? false}
                disabled={!hasEditPermission}
                onChange={() =>
                  handleCheckboxChange(
                    params.row.id,
                    FINAL_DESIGN_TRANSFER_FIELD
                  )
                }
              />
            ),
          },
        ]
      : [
          {
            field: DOWNLOAD_FIELD,
            headerName: DOWNLOAD,
            flex: 1,
            renderCell: (params: any) => (
              <IconButton
                onClick={() =>
                  handleFileDownload(params.row.file_id, params.row.document)
                }
              >
                <DocumentDownload
                  size={NUMBERMAP.EIGHTEEN}
                  color={theme.palette.primary.main}
                />
              </IconButton>
            ),
          },
          {
            field: CHECKBOX_FIELD,
            headerName: CHECKBOX,
            flex: 0.5,
            renderCell: (params: any) => (
              <Checkbox
                checked={params.row.checkbox ?? false}
                disabled={!hasEditPermission}
                onChange={() => handleCheckboxChange(params.row.id)}
              />
            ),
          },
        ]),
  ]

  return (
    <>
      <DataGridTable
        hideFooter
        rows={rows}
        columns={columns}
        idField={STAGE_FORM.KEY_FIELD}
        loading={isLoading}
        enableTableOverflow={true}
      />

      <ButtonGroup
        buttons={[
          {
            label: CANCEL_BUTTON_TEXT,
            onClick: onClose,
          },
          {
            label: SAVE_BUTTON_TEXT,
            onClick: handleSave,
            disabled: !hasEditPermission,
          },
        ]}
      />
    </>
  )
}

export default ProjectPlanDocuments
