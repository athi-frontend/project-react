'use client'

import React from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter, useParams } from 'next/navigation'
import { PageContainer } from '@/styles/modules/hr/inductionTraining'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { DataGridTable } from '@/components/ui'
import {
  RISK_REVIEW_COLUMNS,
  RISK_REVIEW_FIELDS,
  RISK_REVIEW_PAGE,
  RISK_REVIEW_ACTIONS,
  RISK_REVIEW_DETAIL_ROUTE,
} from '@/constants/modules/risk-management/riskReview'
import {
  downloadStyles,
  TableContainer,
} from '@/styles/components/ui/datatable'
import { useRiskReviewAll } from '@/hooks/modules/risk-management/useRiskReview'
import { formatDate } from '@/lib/utils/common'
import { Typography } from '@mui/material'

/**
 * Classification: Confidential
 */

const RiskReviewList: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = Number(params.id)

  const { data: riskReviewData, isLoading } = useRiskReviewAll(projectId)

  const handleReviewClick = (row: any) => {
    if (projectId && row.review_requirement_id)
      router.push(
        RISK_REVIEW_DETAIL_ROUTE(projectId, row.review_requirement_id)
      )
  }

  const columns: GridColDef[] = [
    {
      field: RISK_REVIEW_FIELDS.SNO,
      headerName: RISK_REVIEW_COLUMNS.SNO.headerName,
      flex: RISK_REVIEW_COLUMNS.SNO.flex,
    },
    {
      field: RISK_REVIEW_FIELDS.STAGE_NAME,
      headerName: RISK_REVIEW_COLUMNS.STAGE_NAME.headerName,
      flex: RISK_REVIEW_COLUMNS.STAGE_NAME.flex,
    },
    {
      field: RISK_REVIEW_FIELDS.RISK_REVIEW_DATE,
      headerName: RISK_REVIEW_COLUMNS.RISK_REVIEW_DATE.headerName,
      flex: RISK_REVIEW_COLUMNS.RISK_REVIEW_DATE.flex,
      renderCell: (params: GridRenderCellParams) => {
        const dateValue = params.row[RISK_REVIEW_FIELDS.RISK_REVIEW_DATE]
        if (!dateValue) return '-'
        return formatDate(dateValue) ?? '-'
      },
    },
    {
      field: RISK_REVIEW_FIELDS.ACTIONS,
      headerName: RISK_REVIEW_COLUMNS.ACTIONS.headerName,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          sx={downloadStyles.title}
          onClick={() => handleReviewClick(params.row)}
        >
          {RISK_REVIEW_ACTIONS.REVIEW}
        </Typography>
      ),
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={RISK_REVIEW_PAGE.TITLE}
        Table={
          <TableContainer>
            <DataGridTable
              rows={riskReviewData?.data ?? []}
              columns={columns}
              idField={RISK_REVIEW_FIELDS.APPLICABLE_STAGE_ID}
              hideFooter={true}
              loading={isLoading}
            />
          </TableContainer>
        }
      />
    </PageContainer>
  )
}

export default RiskReviewList
