'use client'
import React from 'react'
import { Box, Checkbox, IconButton, useTheme } from '@mui/material'
import {
  PROCEDURES_AND_DOCUMENTS_COLUMNS,
  PROCEDURES_AND_DOCUMENTS_TITLE,
  DOWNLOAD_FILE,
  CHECKBOX,
} from '@/constants/modules/dnd/projectPlan'
import { DocumentReferenceProps } from '@/types/modules/dnd/projectPlan'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { DataTable, showActionAlert } from '../../../ui'
import { DocumentDownload } from 'iconsax-react'
import { CONTENT_MODE, NUMBERMAP } from '@/constants/common'
import {  getfileURL } from '@/hooks/useCommonDropdown'
import { COMMON_CONSTANTS, handleFileDownloadByUrl } from '@/lib/utils/common'
import { ID_FIELD } from '@/constants/modules/dnd/formTeam'
import { ALERT_MESSAGES } from '@/styles/components/ui/fileUploadManagerV3'
const { CENTER } = CONTENT_MODE
const { INDEX_ZERO } = COMMON_CONSTANTS

const ProceduresAndDocumentsSection: React.FC<DocumentReferenceProps> = ({
  title = PROCEDURES_AND_DOCUMENTS_TITLE,
  documentReferenceData = [],
}) => {
  const theme = useTheme()

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

  const updatedColumns = PROCEDURES_AND_DOCUMENTS_COLUMNS.map((column) => {
    if (column.field === DOWNLOAD_FILE) {
      return {
        ...column,
        headerAlign: CENTER,
        align: CENTER,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <IconButton
              onClick={() =>
                handleFileDownload(params.row.file_id, params.row.document_name)
              }
            >
              <DocumentDownload
                size={NUMBERMAP.EIGHTEEN}
                color={theme.palette.primary.main}
              />
            </IconButton>
          )
        },
      }
    }
    if (column.field === CHECKBOX) {
      return {
        ...column,
        headerAlign: CENTER,
        align: CENTER,
        sortable: false,
        disableColumnMenu: true,
        renderCell: () => (
          <Checkbox
            checked={true}
            disabled={true}
            color={theme.palette.primary.main}
          />
        ),
      }
    }
    return column
  })

  return (
    <Box>
      {/* <Typography sx={designTeamSectionStyles.title}>{title}</Typography> */}
      <DataTable
        columns={updatedColumns}
        rows={documentReferenceData}
        IdField={ID_FIELD}
      />
    </Box>
  )
}

export default ProceduresAndDocumentsSection
