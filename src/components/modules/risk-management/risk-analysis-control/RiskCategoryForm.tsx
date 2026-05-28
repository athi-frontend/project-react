/**
 * Risk Category Form Component
 * Classification: Confidential
 */
'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Grid2 } from '@mui/material'
import { ButtonGroup } from '@/components/ui'
import { RiskCategoryFormProps } from '@/types/modules/risk-management/riskAnalysisControl'
import {
  HAZARD_LIST_CONSTANTS,
  RISK_CATEGORY_CONSTANTS,
  RISK_CATEGORY_ROUTES,
} from '@/constants/modules/risk-management/riskAnalysisControl'
import QuestionField from './QuestionField'
import { PageContainer } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { StyledTypography } from '@/styles/modules/risk-management/riskAnalysisControl'
import { AccessDeniedContainer } from '@/styles/components/ui/notfound'

/**
 * RiskCategoryForm Component
 * Renders the form for a specific risk category step
 * Classification: Confidential
 */
const RiskCategoryForm: React.FC<RiskCategoryFormProps> = ({
  currentQuestionId,
  currentStep,
  formData,
  onFieldChange,
  onHazardClick,
  onAddHazard,
  onSave,
  isSaving = false,
  readOnly = false,
  hazardLinkText,
  showActions = true,
  enableAddHazardFromLink = true,
  showApplicabilityCheckbox = true,
}) => {
  const router = useRouter()
  const [applicabilityData, setApplicabilityData] = useState<{
    [key: string]: { isApplicable: boolean; response: string }
  }>({})
  const currentPos = useRef<Record<string, HTMLElement | null>>({})

  // Initialize applicability data from existing data when step or data changes
  useEffect(() => {
    const initialData: {
      [key: string]: { isApplicable: boolean; response: string }
    } = {}

    currentStep.subcategory_and_response?.forEach((question) => {
      const questionId = question.sub_category_id.toString()
      const existingValue = question.response ?? ''

      initialData[questionId] = {
        isApplicable: question.is_applicable === NUMBERMAP.ONE,
        response: existingValue,
      }
    })

    setApplicabilityData(initialData)
  }, [currentStep.id, currentStep.subcategory_and_response])

  const handleFieldChange = useCallback(
    (questionId: string, value: string, isApplicable: boolean) => {
      if (readOnly) return
      setApplicabilityData((prev) => ({
        ...prev,
        [questionId]: {
          isApplicable,
          response: value,
        },
      }))

      onFieldChange(questionId, value)
    },
    [onFieldChange, readOnly]
  )

  const handleSave = useCallback(
    async (showAlerts: boolean = true) => {
      if (readOnly) return
      // Format data according to the required structure
      const saveData = {
        category_id: currentStep.id,
        applicability_list:
          currentStep.subcategory_and_response?.map((question) => {
            const questionId = question.sub_category_id.toString()
            const data = applicabilityData[questionId] ?? {
              isApplicable: question.is_applicable === NUMBERMAP.ONE,
              response: question.response ?? '',
            }

            return {
              sub_category_id: question.sub_category_id,
              is_applicable: data.isApplicable ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
              response: data.isApplicable ? data.response : '',
            }
          }) ?? [],
      }

      if (onSave) {
        onSave(saveData, showAlerts)
      }
    },
    [currentStep, applicabilityData, onSave, readOnly]
  )

  const handleCancel = () => {
    router.push(RISK_CATEGORY_ROUTES.RISK_MANAGEMENT)
  }

  const handleHazardClick = useCallback(
    (questionId: string) => {
      if (onHazardClick) {
        onHazardClick(questionId)
      }
    },
    [onHazardClick]
  )
  useEffect(() => {
    if (currentQuestionId && currentPos.current[currentQuestionId]) {
      currentPos.current[currentQuestionId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      currentPos.current[currentQuestionId]?.focus()
    }
  }, [currentQuestionId])
  return (
    <PageContainer>
      {!currentStep.subcategory_and_response?.length ? (
        <AccessDeniedContainer>
          <StyledTypography>
            {HAZARD_LIST_CONSTANTS.NO_SUBCATEGORY_FOUND}
          </StyledTypography>
        </AccessDeniedContainer>
      ) : (
        <Grid2 container size={NUMBERMAP.TWELVE} sx={{ px: NUMBERMAP.SIX }}>
          {currentStep.subcategory_and_response?.map((question, index) => (
            <Grid2
              key={question.sub_category_id}
              size={NUMBERMAP.TWELVE}
              sx={{ mb: NUMBERMAP.ONE }}
            >
              <Box
                ref={(el: HTMLElement | null) => {
                  currentPos.current[question.sub_category_id.toString()] = el
                }}
              >
                <QuestionField
                  question={{
                    id: question.sub_category_id.toString(),
                    label: question.subcategory,
                    required: true,
                    hazardLink: true,
                    riskApplicabilityId: question.subcategory_applicability_id,
                  }}
                  value={
                    applicabilityData[question.sub_category_id.toString()]
                      ?.response ?? ''
                  }
                  isChecked={
                    applicabilityData[question.sub_category_id.toString()]
                      ?.isApplicable ?? false
                  }
                  onChange={(value: string, isApplicable: boolean) =>
                    handleFieldChange(
                      question.sub_category_id.toString(),
                      value,
                      isApplicable
                    )
                  }
                  onHazardClick={() => {
                    handleHazardClick(question.sub_category_id.toString())
                  }}
                  onAddHazard={onAddHazard}
                  onSave={handleSave}
                  readOnly={readOnly}
                  hazardLinkText={hazardLinkText}
                  enableAddHazardFromLink={enableAddHazardFromLink}
                  showApplicabilityCheckbox={showApplicabilityCheckbox}
                />
              </Box>
            </Grid2>
          ))}
          {showActions && (
            <Grid2
              size={NUMBERMAP.TWELVE}
              sx={{ alignItems: 'flex-end', marginBottom: NUMBERMAP.THREE }}
            >
              <ButtonGroup
                buttons={[
                  {
                    label: RISK_CATEGORY_CONSTANTS.CANCEL_BUTTON,
                    onClick: handleCancel,
                    disabled: isSaving,
                  },
                  {
                    label: RISK_CATEGORY_CONSTANTS.SAVE_BUTTON,
                    onClick: handleSave,
                    disabled: isSaving,
                  },
                ]}
              />
            </Grid2>
          )}
        </Grid2>
      )}
    </PageContainer>
  )
}

export default RiskCategoryForm
