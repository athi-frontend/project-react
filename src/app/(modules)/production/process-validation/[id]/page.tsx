'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Typography, Box } from '@mui/material'
import { PageContainer } from '@/styles/common'
import { DataTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { NUMBERMAP } from '@/constants/common'
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid'
import { useFetchProcessChecklistByProject } from '@/hooks/modules/production/useProcessValidation'
import { ProcessChecklistItem } from '@/types/modules/production/process-validation'
import { ValidationActionCell, ValidationActionText } from '@/styles/modules/production/process-validation'
import {
  PROCESS_VALIDATION_LIST_PAGE_LABELS,
  PROCESS_VALIDATION_ROUTES,
} from '@/constants/modules/production/process-validation'

/**
 * Classification: Confidential
 * Process Validation List Page
 */

const ProcessValidationList: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.id ? Number(params.id) : null

  const { data: processChecklistData, isLoading } = useFetchProcessChecklistByProject(
    projectId ?? NUMBERMAP.ZERO
  )

  const renderSettingsCell = (params: GridRenderCellParams) => {
    return (
      <Box sx={ValidationActionCell}>
        <Typography
          onClick={() => handleSettingsClick(params.row.process_checklist_id ?? params.row.id)}
          sx={ValidationActionText}
        >
          {PROCESS_VALIDATION_LIST_PAGE_LABELS.VALIDATION}
        </Typography>
      </Box>
    )
  }

  const handleSettingsClick = (processChecklistId: number) => {
    if (projectId !== null) {
      router.push(PROCESS_VALIDATION_ROUTES.DETAIL(projectId, processChecklistId))
    }
  }

  const columns: GridColDef[] = [
    {
      field: PROCESS_VALIDATION_LIST_PAGE_LABELS.FIELD_SNO,
      headerName: PROCESS_VALIDATION_LIST_PAGE_LABELS.SNO,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PROCESS_VALIDATION_LIST_PAGE_LABELS.FIELD_PROCESS_GROUP,
      headerName: PROCESS_VALIDATION_LIST_PAGE_LABELS.PROCESS_GROUP,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PROCESS_VALIDATION_LIST_PAGE_LABELS.FIELD_PROCESS_NAME,
      headerName: PROCESS_VALIDATION_LIST_PAGE_LABELS.PROCESS_NAME,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PROCESS_VALIDATION_LIST_PAGE_LABELS.SETTINGS_FIELD,
      headerName: PROCESS_VALIDATION_LIST_PAGE_LABELS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: renderSettingsCell,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={PROCESS_VALIDATION_LIST_PAGE_LABELS.TITLE}
        Table={
          <DataTable
            rows={processChecklistData?.data?.[NUMBERMAP.ZERO]?.process_checklist?.filter(
              (item: ProcessChecklistItem) => item.status_id === NUMBERMAP.ONE
            ) ?? []}
            columns={columns}
            IdField="process_card_checklist_id"
            loading={isLoading}
          />
        }
      />
    </PageContainer> 
  )
}

export default ProcessValidationList
