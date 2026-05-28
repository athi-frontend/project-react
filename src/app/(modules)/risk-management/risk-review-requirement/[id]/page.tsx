'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Checkbox } from '@mui/material'
import { DataGridTable, showActionAlert } from '@/components/ui'
import { GridColDef } from '@mui/x-data-grid'
import { BUTTON_LABEL, NUMBERMAP, STATUS } from '@/constants/common'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import {
  RISK_REVIEW_REQUIREMENT_CONSTANTS,
  RISK_REVIEW_REQUIREMENT_TABLE_CONSTANTS,
} from '@/constants/modules/risk-management/risk-review-requirement'
import {
  useRiskReviewRequirement,
  useUpsertRiskReviewRequirement,
} from '@/hooks/modules/risk-management/useRiskReviewRequirement'
import { RiskReviewRequirementItem } from '@/types/modules/risk-management/risk-review-requirement'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { PageContainer } from '@/styles/modules/hr/inductionTraining'
import { TableContainer } from '@/styles/components/ui/datatable'
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'
import GlobalLoader from '@/components/shared/LoadingSpinner'

/**
 * Risk Review Requirement Page
 * Classification: Confidential
 */

const RiskReviewRequirementForm: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.id)
  const [reviewItems, setReviewItems] = useState<RiskReviewRequirementItem[]>(
    []
  )

  const { data: reviewRequirementData, isLoading } =
    useRiskReviewRequirement(projectId)

  const { mutate: upsertRiskReviewRequirement, isPending: isSaving } =
    useUpsertRiskReviewRequirement()

  useEffect(() => {
    if (reviewRequirementData?.data) {
      let items: RiskReviewRequirementItem[] = []
      
      // Handle both formats: data as array or data.review_requirement_mappings for draft
      if (Array.isArray(reviewRequirementData.data)) {
        items = reviewRequirementData.data
      } else if (
        reviewRequirementData.data.review_requirement_mappings &&
        Array.isArray(reviewRequirementData.data.review_requirement_mappings)
      ) {
        items = reviewRequirementData.data.review_requirement_mappings
      }
      
      if (items.length > NUMBERMAP.ZERO) {
        setReviewItems(items)
      }
    }
  }, [reviewRequirementData])

  const handleCheckboxChange = (
    stageApplicableId: number,
    checked: boolean
  ) => {
    if (!hasEditPermission) {
      return
    }
    setReviewItems((prev) => {
      return prev.map((item) =>
        item.stage_applicable_id === stageApplicableId
          ? {
              ...item,
              is_review_required: checked ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
            }
          : item
      )
    })
  }

  const handleSave = () => {
    const reviewRequirementMappings = reviewItems.map((item) => ({
      ...(item.review_requirement_id && {
        review_requirement_id: item.review_requirement_id,
      }),
      stage_applicable_id: item.stage_applicable_id,
      is_review_required: item.is_review_required ?? NUMBERMAP.ZERO,
    }))

    const payload = {
      project_id: projectId,
      review_requirement_mappings: reviewRequirementMappings,
    }

    upsertRiskReviewRequirement(payload, {
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

  const permissions =
    reviewRequirementData?.meta_info?.action_control?.permissions ?? []

  const actionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.CANCEL]: () => handleCancel(),
    [BUTTON_LABEL.SAVE]: () => handleSave(),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, actionHandlers, isSaving)

  const columns: GridColDef[] = [
    {
      field: RISK_REVIEW_REQUIREMENT_TABLE_CONSTANTS.COLUMNS.SNO,
      headerName: RISK_REVIEW_REQUIREMENT_TABLE_CONSTANTS.HEADERS.SNO,
      flex: NUMBERMAP.ONE,
    },
    {
      field: RISK_REVIEW_REQUIREMENT_TABLE_CONSTANTS.COLUMNS.STAGE_NAME,
      headerName: RISK_REVIEW_REQUIREMENT_TABLE_CONSTANTS.HEADERS.STAGE_NAME,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => params.row.stage_name,
    },
    {
      field: RISK_REVIEW_REQUIREMENT_TABLE_CONSTANTS.COLUMNS.REQUIRES_REVIEW,
      headerName:
        RISK_REVIEW_REQUIREMENT_TABLE_CONSTANTS.HEADERS.REQUIRES_REVIEW,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Checkbox
          checked={params.row.is_review_required === NUMBERMAP.ONE}
          disabled={!hasEditPermission}
          onChange={(e) =>
            handleCheckboxChange(
              params.row.stage_applicable_id,
              e.target.checked
            )
          }
        />
      ),
    },
  ]

  const loading = () => {
    if (isLoading) return true
    if (isSaving) return true
    return false
  }

  useEffect(() => {
    if (!isLoading && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [buttonDetails, isLoading])

  return (
    <PageContainer>
      <GlobalLoader loading={loading()} />
      <CommonSharedTale
        title={RISK_REVIEW_REQUIREMENT_CONSTANTS.HEADER_TITLE}
        Table={
          <TableContainer>
            <DataGridTable
              rows={reviewItems}
              columns={columns}
              idField={
                RISK_REVIEW_REQUIREMENT_TABLE_CONSTANTS.FIELDS
                  .STAGE_APPLICABLE_ID
              }
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

export default RiskReviewRequirementForm
