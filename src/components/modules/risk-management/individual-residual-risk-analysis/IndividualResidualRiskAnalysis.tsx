'use client'

import React from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { IconButton, useTheme } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { DataTable } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import { Edit } from 'iconsax-react'
import {
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS,
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS,
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_PAGE,
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_ARIA,
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_ROUTES,
} from '@/constants/modules/risk-management/individualResidualRiskAnalysis'
import { useFetchAllIndividualRiskAnalysis } from '@/hooks/modules/risk-management/useIndividualResidualRiskAnalysis'

/**
 * Classification: Confidential
 */

const IndividualResidualRiskAnalysis: React.FC = () => {
  const theme = useTheme()
  const params = useParams()
  const router = useRouter()
  const projectId = params?.id as string | undefined

  // API Integration
  const { data, isLoading } = useFetchAllIndividualRiskAnalysis(
    Number(projectId),
    NUMBERMAP.ONE
  )

  const handleEdit = (row: Record<string, unknown>) => {
    const riskId = row?.[INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS.RISK_ID]
    if (!projectId || riskId === undefined) return
    router.push(
      INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_ROUTES.DETAIL(
        projectId,
        riskId as string
      )
    )
  }

  const columns: GridColDef[] = [
    {
      field: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS.SNO,
      headerName: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.SNO.headerName,
    },
    {
      field: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS.HAZARD_CODE,
      headerName:
        INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.HAZARD_NO.headerName,
      flex: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.HAZARD_NO.flex,
    },
    {
      field: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS.RISK_TITLE,
      headerName:
        INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.RISK_TITLE.headerName,
      flex: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.RISK_TITLE.flex,
    },
    {
      field: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS.PROBABILITY,
      headerName:
        INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.PROBABILITY.headerName,
      flex: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.PROBABILITY.flex,
    },
    {
      field: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS.SEVERITY,
      headerName: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.SEVERITY.headerName,
      flex: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.SEVERITY.flex,
    },
    {
      field: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS.ACTIONS,
      headerName: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS.ACTIONS.headerName,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          aria-label={INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_ARIA.EDIT}
          onClick={() => handleEdit(params.row)}
        >
          <Edit size={NUMBERMAP.EIGHTEEN} color={theme.palette.primary.main} />
        </IconButton>
      ),
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_PAGE.TITLE}
        Table={
          <DataTable
            rows={data?.data ?? []}
            columns={columns}
            IdField={INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS.RISK_ID}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default IndividualResidualRiskAnalysis
