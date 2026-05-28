'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Checkbox } from '@mui/material'
import { DataGridTable, showActionAlert } from '@/components/ui'
import { GridColDef } from '@mui/x-data-grid'
import { NUMBERMAP, STATUS } from '@/constants/common'
import {
  APPLICABILITY_CONSTANTS,
  APPLICABILITY_TABLE_CONSTANTS,
  APPLICABILITY_ROUTES,
} from '@/constants/modules/risk-management/applicability'
import {
  useApplicability,
  useUpsertApplicability,
} from '@/hooks/modules/risk-management/useApplicability'
import { ApplicabilityItem } from '@/types/modules/risk-management/applicability'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { PageContainer } from '@/styles/modules/hr/inductionTraining'
import { TableContainer } from '@/styles/components/ui/datatable'
import {
  BUTTONLABELS,
  processButtonsWithPermissions,
  QUERYCONSTANTS,
} from '@/lib/utils/common'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'

/**
 * Applicability Page
 * Classification: Confidential
 */

const ApplicabilityForm: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.id)
  const [applicabilityItems, setApplicabilityItems] = useState<
    ApplicabilityItem[]
  >([])

  const { data: applicabilityData, isLoading } = useApplicability(projectId)

  const { mutate: upsertApplicability, isPending: isSaving } =
    useUpsertApplicability()

  useEffect(() => {
    if (
      applicabilityData?.data &&
      Array.isArray(applicabilityData.data) &&
      applicabilityData.data.length > NUMBERMAP.ZERO
    ) {
      setApplicabilityItems(applicabilityData.data)
    }
  }, [applicabilityData])

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setApplicabilityItems((prev) => {
      return prev.map((item) =>
        item.category_id === id
          ? { ...item, is_applicable: checked ? NUMBERMAP.ONE : NUMBERMAP.ZERO }
          : item
      )
    })
  }

  const handleSave = () => {
    const applicableRisks = applicabilityItems.map((item) => ({
      category_id: item.category_id,
      is_applicable: item.is_applicable,
    }))

    const payload = {
      project_id: projectId,
      applicable_risks: applicableRisks,
    }

    upsertApplicability(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  const handleCancel = () => {
    router.push(APPLICABILITY_ROUTES.RISK_MANAGEMENT)
  }

  // Extract permissions from filteredActionControl
  const permissions =
    applicabilityData?.meta_info?.action_control?.permissions ?? []

  // Create action handlers for buttons
  const actionHandlers: Record<string, (id: number) => void> = {
    [BUTTONLABELS.BUTTON_LABEL_CANCEL]: (_id: number) => handleCancel(),
    [BUTTONLABELS.BUTTON_LABEL_SAVE]: (_id: number) => handleSave(),
  }

  // Process permissions to get dynamic buttons
  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, actionHandlers, isSaving)

  const columns: GridColDef[] = [
    {
      field: APPLICABILITY_TABLE_CONSTANTS.COLUMNS.SNO,
      headerName: APPLICABILITY_TABLE_CONSTANTS.HEADERS.SNO,
      flex: NUMBERMAP.ONE,
    },
    {
      field: APPLICABILITY_TABLE_CONSTANTS.COLUMNS.CATEGORY,
      headerName: APPLICABILITY_TABLE_CONSTANTS.HEADERS.CATEGORY,
      flex: NUMBERMAP.TWO,
    },
    {
      field: APPLICABILITY_TABLE_CONSTANTS.COLUMNS.APPLICABLE,
      headerName: APPLICABILITY_TABLE_CONSTANTS.HEADERS.APPLICABLE,
      flex: NUMBERMAP.HALF,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.is_applicable === NUMBERMAP.ONE}
          onChange={(e) =>
            handleCheckboxChange(params.row.category_id, e.target.checked)
          }
          disabled={!hasEditPermission}
        />
      ),
    },
  ]

  // Permission access denied logic - only show after API has responded
  useEffect(() => {
    if (!isLoading && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: 'error' as const,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [isLoading, buttonDetails])

  const loading = () => {
    if (isLoading) return true
    if (isSaving) return true
    return false
  }

  return (
    <PageContainer>
      <GlobalLoader loading={loading()} />
      <CommonSharedTale
        title={APPLICABILITY_CONSTANTS.HEADER_TITLE}
        Table={
          <TableContainer>
            <DataGridTable
              rows={applicabilityItems}
              columns={columns}
              idField={APPLICABILITY_TABLE_CONSTANTS.FIELDS.CATEGORY_ID}
              hideFooter={true}
            />
            <RiskNavigationButtonGroup
              projectId={projectId}
              buttons={buttonDetails ?? []}
            />
          </TableContainer>
        }
      />
    </PageContainer>
  )
}

export default ApplicabilityForm
