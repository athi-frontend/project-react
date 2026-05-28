'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Grid2 } from '@mui/material'
import {
  ButtonGroup,
  RadioButtonGroup,
  RichTextEditor,
  Label,
} from '@/components/ui'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { NUMBERMAP, DRAFT } from '@/constants/common'
import {
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_ROUTES,
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM,
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_MESSAGES,
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_LABEL,
  INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM_TYPE,
} from '@/constants/modules/risk-management/individualResidualRiskAnalysis'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import {
  useFetchIndividualRiskAnalysisById,
  useUpsertIndividualRiskAnalysis,
} from '@/hooks/modules/risk-management/useIndividualResidualRiskAnalysis'
import { RiskRowType } from '@/types/modules/risk-management/individualResidualRiskAnalysis'
import { BUTTONLABELS, formatValue } from '@/lib/utils/common'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { CKReadOnlyHeight } from '@/styles/components/ui/input'

/**
 * Classification: Confidential
 */

const IndividualResidualRiskAnalysisDetail: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const riskId = Number(params.riskId)
  const isInitialDataLoad = useRef(true)
  // fetch data by riskId
  const { data, isLoading, refetch } = useFetchIndividualRiskAnalysisById(riskId)
  const { mutate: upsert, isPending } = useUpsertIndividualRiskAnalysis(riskId)
  const {
    draftSave,
    clearDraftSave,
    isDraftSaving,
    checkUnsavedDraftBeforeLeave,
  } = useDraftSave({
    context_type: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM_TYPE,
    context_instance_id: riskId,
    onSuccess: refetch,
  })

  const isAnyLoading = () => {
    if (isLoading) return true
    if (isPending) return true
    return false
  }

  // states
  const [formData, setFormData] = useState({
    riskControlPossible: null as string | null,
    justification: '',
  })
  const [errors, setErrors] = useState({
    riskControlPossible: '',
    justification: '',
  })
  // store full fetched row for info fields
  const [row, setRow] = useState<RiskRowType | null>(null)

  // effect to populate fields when fetched
  useEffect(() => {
    if (data?.data) {
      const responseData = data.data
      let riskRaw = null
      
      if (responseData && typeof responseData === 'object' && (responseData as any).type === DRAFT) {
        riskRaw = responseData
      } else if (Array.isArray(responseData) && responseData.length > NUMBERMAP.ZERO) {
        riskRaw = responseData[NUMBERMAP.ZERO] ?? null
      }
      
      if (riskRaw) {
        const risk: RiskRowType = {
          ...riskRaw,
          selection: riskRaw.selection ?? '',
        }
        setRow(risk)
        setFormData({
          riskControlPossible: risk.selection ?? null,
          justification: risk.justification ?? '',
        })
        // Set initial load to false after all data is loaded
        setTimeout(() => {
          isInitialDataLoad.current = false
        }, NUMBERMAP.THOUSAND)
      }
    }
  }, [data])

  const handleDraftSave = (formData: {
    justification: string
    riskControlPossible: string | null
  }) => {
    const payload = {
      hazard_code: row?.hazard_code ?? '',
      risk_title: row?.risk_title ?? '',
      risk_description: row?.risk_description ?? '',
      probability_level_name: row?.probability_level_name ?? '',
      severity_level_name: row?.severity_level_name ?? '',
      risk_id: riskId,
      justification: formData.justification,
      selection: formData.riskControlPossible,
      type: DRAFT,
    }
    draftSave({
      risk_id: riskId,
      form_type: INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM_TYPE,
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }

  const handleSave = () => {
    let isError = false
    if (!formData.riskControlPossible) {
      setErrors((prev) => ({
        ...prev,
        riskControlPossible:
          INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_MESSAGES.RADIO_REQUIRED,
      }))
      isError = true
    } else {
      setErrors((prev) => ({ ...prev, riskControlPossible: '' }))
    }
    if (
      formData.riskControlPossible ===
        INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.RADIO.OPTIONS.NO.value &&
      !formData.justification.trim()
    ) {
      setErrors((prev) => ({
        ...prev,
        justification:
          INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_MESSAGES.JUSTIFICATION_REQUIRED,
      }))
      isError = true
    } else {
      setErrors((prev) => ({ ...prev, justification: '' }))
    }
    if (isError) return

    const payload = {
      risk_id: riskId,
      justification: formData.justification,
      selection: formData.riskControlPossible,
    }
    clearDraftSave()
    upsert(payload)
    router.push(INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_ROUTES.BASE(projectId))
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_ROUTES.BASE(projectId))
  }

  const buttons = [
    {
      label: BUTTONLABELS.BUTTON_LABEL_BACK,
      onClick: () => {
        handleCancel()
      },
    },
    {
      label: BUTTONLABELS.BUTTON_LABEL_SAVE,
      onClick: handleSave,
    },
  ]

  const radioOptions = [
    INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.RADIO.OPTIONS.YES,
    INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.RADIO.OPTIONS.NO,
  ]

  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isAnyLoading()} />
      <FormContainer>
        <FormWrapper>
          <Label title={INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_LABEL} />
          <FormContent>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField
                  label={
                    INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.LABELS.HAZARD_NO
                  }
                  value={formatValue(row?.hazard_code)}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField
                  label={
                    INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.LABELS.RISK_TITLE
                  }
                  value={formatValue(row?.risk_title)}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  toolbaroptions={[]}
                  label={
                    INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.LABELS.DESCRIPTION
                  }
                  value={formatValue(row?.risk_description)}
                  disabled
                  hideBorder
                  height={CKReadOnlyHeight}
                  onChange={() => {}}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField
                  label={
                    INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.LABELS.PROBABILITY
                  }
                  value={formatValue(row?.probability_level_name)}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField
                  label={INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.LABELS.SEVERITY}
                  value={formatValue(row?.severity_level_name)}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RadioButtonGroup
                  label={
                    INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.LABELS.RADIO_LABEL
                  }
                  name={INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.RADIO.NAME}
                  options={radioOptions}
                  value={formData.riskControlPossible ?? ''}
                  onChange={(value) => {
                    setFormData((prev) => {
                      const updated = {
                        ...prev,
                        riskControlPossible: value as string,
                      }
                      if (!isInitialDataLoad.current) {
                        handleDraftSave(updated)
                      }
                      return updated
                    })
                    if (errors.riskControlPossible)
                      setErrors((prev) => ({
                        ...prev,
                        riskControlPossible: '',
                      }))
                    if (
                      value ===
                        INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.RADIO.OPTIONS.YES
                          .value &&
                      errors.justification
                    )
                      setErrors((prev) => ({
                        ...prev,
                        justification: '',
                      }))
                  }}
                  error={errors.riskControlPossible}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <RichTextEditor
                  label={
                    INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.LABELS.JUSTIFICATION
                  }
                  placeholder={
                    INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM.PLACEHOLDERS
                      .JUSTIFICATION
                  }
                  value={formData.justification}
                  onChange={(value) => {
                    setFormData((prev) => {
                      const updated = { ...prev, justification: value }
                      if (!isInitialDataLoad.current) {
                        handleDraftSave(updated)
                      }
                      return updated
                    })
                    if (errors.justification)
                      setErrors((prev) => ({ ...prev, justification: '' }))
                  }}
                  error={errors.justification}
                />
              </Grid2>
            </Grid2>
            <ButtonGroup buttons={buttons} />
          </FormContent>
        </FormWrapper>
      </FormContainer>
    </PageContainer>
  )
}

export default IndividualResidualRiskAnalysisDetail
