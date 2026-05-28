'use client'
import React, { useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { DataTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import {
  useRecordGenerationColumns,
  formatRecordGenerationRows,
} from '@/components/shared/RecordGenerationColumns'
import { PageContainer } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { downloadDocumentURL } from '@/hooks/useCommonDropdown'
import { Grid2 } from '@mui/material'
import { handleArrayBufferDownload } from '@/lib/utils/common'
import { useOrganizationRecord } from '@/hooks/common/useRecordGeneration'
import {
  CONTEXT_TYPE_PROJECT,
  ID,
} from '@/constants/modules/risk-management/recordGeneration'
import { useSelector } from 'react-redux'
import { selectMenuData } from '@/store/slices/menuSlice'
import { getPageTitle } from '@/lib/utils/recordGeneration'
import { RecordGenerationProps } from '@/types/components/modules/stepper'

/**
 *Classification : Confidential
 **/

const RecordGeneration: React.FC<RecordGenerationProps> = ({ contextType }) => {
  const params = useParams()
  const pathname = usePathname()
  const projectId = Number(params.id)
  const formId = String(params.form)

  const { data, isLoading, refetch } = useOrganizationRecord(
    projectId,
    CONTEXT_TYPE_PROJECT,
  )

  useEffect(() => {
    refetch()
  }, [formId])

  const menuData = useSelector(selectMenuData)

  const pageTitle = getPageTitle(menuData, pathname, contextType)

  const handleDownloadRecords = async (
    fileId: string | number,
    version: string | number,
    version_no: string | number,
    doc_name?: string
  ) => {
    try {
      const response = await downloadDocumentURL(fileId, version)
      const assetData = response?.data
      if (assetData.length > NUMBERMAP.ZERO) {
        handleArrayBufferDownload({
          bufferData: assetData[NUMBERMAP.ZERO],
          fileName: doc_name ?? '',
          version: version_no.toString(),
          type: 'pdf',
        })
      }
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  // Use common columns configuration
  const columns = useRecordGenerationColumns({
    handleDownload: handleDownloadRecords,
  })

  // Format data rows using common utility
  const tableRows = formatRecordGenerationRows(data?.data)

  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <Grid2 container>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <CommonSharedTale
            title={pageTitle}
            Table={
              <DataTable
                IdField={ID}
                rows={tableRows}
                columns={columns}
                loading={isLoading}
              />
            }
          />
        </Grid2>
      </Grid2>
    </PageContainer>
  )
}

export default RecordGeneration
