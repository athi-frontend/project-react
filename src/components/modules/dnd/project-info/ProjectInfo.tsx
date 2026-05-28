'use client'
import React from 'react'
import { Typography, Grid2, IconButton } from '@mui/material'
import InfoField from './InfoField'
import { ProjectInfoProps } from '@/types/modules/dnd/project'
import { COMMON_CONSTANTS, handleFileDownloadUtil, handleFileDownloadByUrl } from '@/lib/utils/common'
import {
  StyledPaper,
  SectionTitle,
  FileList,
} from '@/styles/components/modules/projectInfo'
import { ALERT_MESSAGES } from '@/styles/components/ui/fileUploadManagerV3'
import { getFileColumns, getFileUploadColumns, PROJECT_INFO, STATUS, STATUS_LABELS, SUMMARY_LABELS } from '@/constants/modules/dnd/project'
import { DataGridTable } from '@/components/ui'
import { GridRenderCellParams } from '@mui/x-data-grid'
import DownloadIcon from '@mui/icons-material/Download'
import { getfileURL } from '@/hooks/useCommonDropdown'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { NUMBERMAP } from '@/constants/common'
import GlobalLoader from '@/components/shared/LoadingSpinner'

/**
 Classification : Confidential
**/
const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectFormData, isDataLoading }) => {
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
 
  if (!projectFormData) {
    return
  }

  const {
    PRODUCT_NAME,
    GENERIC_NAME,
    DESCRIPTION,
    PRODUCT_GROUP,
    PRODUCT_CATEGORY,
    PRODUCT_TYPE,
    PRODUCT_SUB_TYPE,
    REASON,
    MARKET,
    REGULATIONS,
    DECISION,
  } = SUMMARY_LABELS

  const mapStatus = (status: number) => {
    return status === NUMBERMAP.ONE ? STATUS.ACTIVE : STATUS.INACTIVE
  }


  const renderStatusCell = (params: GridRenderCellParams) => {
    return (
       <Typography
          color={params.value === NUMBERMAP.ONE ? STATUS_LABELS.STYLE.ACTIVE : STATUS_LABELS.STYLE.INACTIVE}
        >
          {mapStatus(params.value)}
        </Typography>
    )
  }

  const renderActionCell = (params: GridRenderCellParams) => {
    return (
      <IconButton
          onClick={() => handleDownload(params.row)}
          aria-label={PROJECT_INFO.DOWNLOAD}
        >
          <DownloadIcon />
        </IconButton>
    )
  }


  const handleDownload = async (row: any) => {
    const documentId = row.file_id
    const name = row.file_name
    try {
      if (!row.file) {
        const response = await getfileURL(documentId)
        const assetUrl = response?.data?.[0]?.assetUrl
      
        handleFileDownloadByUrl(assetUrl, name)
      } else {
        handleFileDownloadUtil({ name, blob: row.file })
      }
    } catch{
      showActionAlert('customAlert', {
        title: ALERT_MESSAGES.DOWNLOAD_ERROR_TITLE,
        text: ALERT_MESSAGES.DOWNLOAD_ERROR_TEXT,
        icon: ALERT_MESSAGES.ALERT_ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }
   const fileUploadColumns = getFileUploadColumns(renderStatusCell, renderActionCell)


  const fileColumns = getFileColumns(renderActionCell)

  return (
    <StyledPaper elevation={NUMBERMAP.ZERO}>
      <GlobalLoader loading = {isDataLoading} />
      {!isDataLoading && (
        <>
          <SectionTitle variant={PROJECT_INFO.VARIANT.H5}>Info Section</SectionTitle>
      <Grid2 container spacing={NUMBERMAP.ONE}>
        {[
          { label: DECISION, value: projectFormData.decision??'-'},
          { label: REASON, value: projectFormData.project_reason },
          { label: PRODUCT_NAME, value: projectFormData.product_name },
          { label: GENERIC_NAME, value: projectFormData.product_generic_name},
          { label: PRODUCT_GROUP, value: projectFormData.product_group },
          { label: PRODUCT_CATEGORY, value: projectFormData.product_category },
          { label: PRODUCT_TYPE, value: projectFormData.product_type },
          { label: PRODUCT_SUB_TYPE, value: projectFormData.product_subtype },
          {
            label: MARKET,
            value: projectFormData.market_name?.length ? projectFormData.market_name.join(', ') : '-'
          },
          {
            label: REGULATIONS,
             value: projectFormData.market_name?.length ?projectFormData.regulation_name?.join(', ') : '-',
          },
          { label: DESCRIPTION, value: projectFormData.product_description },
        ].map(({ label, value }) => (
          <InfoField key={label} label={label} value={value} />
        ))}
      </Grid2>
  <Grid2 container spacing={NUMBERMAP.TWO} mt={NUMBERMAP.ONE}>
    <Grid2 size={NUMBERMAP.SIX}>
      <Typography variant={PROJECT_INFO.VARIANT.BODY1} gutterBottom>
        HLD
      </Typography>
      <DataGridTable
        idField={PROJECT_INFO.FILE.FILE_ID}
        rows={projectFormData?.hld_documents??[]}
        columns={fileColumns}
        hideFooter
      />
    </Grid2>
    <Grid2 size={NUMBERMAP.SIX}>
      <Typography variant={PROJECT_INFO.VARIANT.BODY1}gutterBottom>
        Feasibility
      </Typography>
      <DataGridTable
        idField={PROJECT_INFO.FILE.FILE_ID}
        rows={projectFormData?.feasibility_documents??[]}
        columns={fileColumns}
        hideFooter
      />
    </Grid2>
  </Grid2>

      {projectFormData.documents?.length > EMPTY_ARRAY_LENGTH && (
        <FileList>
          <Typography variant={PROJECT_INFO.VARIANT.BODY1} gutterBottom>
            Uploaded Files
          </Typography>
          <DataGridTable
            idField={PROJECT_INFO.FILE.FILE_ID}
            rows={projectFormData.documents ?? []}
            columns={fileUploadColumns}
            hideFooter
          />
        </FileList>
      )}
        </>
      )}
    </StyledPaper>
  )
}

export default ProjectInfo
