/**
 * Risk Management Modal Base Component
 * Classification: Confidential
 */
'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { Grid2 } from '@mui/material'
import { InputField, ButtonGroup } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { MODAL_STYLES } from '@/styles/modules/dnd/verification'
import {
  AcceptabilityContainer,
  AcceptabilityButtonContainer,
  AcceptableButton,
  NotAcceptableButton,
} from '@/styles/modules/risk-management/riskAnalysisControl'

import { NUMBERMAP } from '@/constants/common'
import { COMMON_FIELD_CONSTANTS, RISK_CATEGORY_CONSTANTS } from '@/constants/modules/risk-management/riskAnalysisControl'
import {
  RiskManagementModalBaseProps,
  UseProbabilitySeverityReturn,
} from '@/types/modules/risk-management/riskAnalysisControl'
import {
  useProbabilityLevels,
  useRiskAcceptability,
  useSeverityLevels,
} from '@/hooks/modules/risk-management/useRiskAnalysisControl'
import { ErrorText } from '@/styles/common'

/**
 * Classification: Confidential
 */

export const useProbabilitySeverity = (
  projectId: number,
  open: boolean,
  initialProbability?: string,
  initialSeverity?: string
): UseProbabilitySeverityReturn => {
  const [probabilityId, setProbabilityId] = useState<number>()
  const [severityId, setSeverityId] = useState<number>()
  const [acceptabilityValue, setAcceptabilityValue] = useState<number | null>(
    null
  )

  // API hooks for dropdown data
  const { data: probabilityData, isLoading: probabilityLoading } =
    useProbabilityLevels(projectId, open)
  const { data: severityData, isLoading: severityLoading } = useSeverityLevels(
    projectId,
    open
  )
  const {
    data: riskAcceptabilityData,
    isLoading: acceptabilityLoading,
    refetch: refetchRiskAcceptability,
  } = useRiskAcceptability(
    probabilityId ?? NUMBERMAP.ZERO,
    severityId ?? NUMBERMAP.ZERO
  )

  // Transform API data to dropdown options
  const probabilityOptions = useMemo(() => {
    if (!probabilityData?.data) return []
    return probabilityData.data
      .filter((item) => item.id && item.level_name)
      .map((item) => ({
        id: item.id.toString(),
        name: item.level_name,
      }))
  }, [probabilityData])

  const severityOptions = useMemo(() => {
    if (!severityData?.data) return []
    return severityData.data
      .filter((item) => item.id && item.level_name)
      .map((item) => ({
        id: item.id.toString(),
        name: item.level_name,
      }))
  }, [severityData])

  // Reset state when modal is closed
  useEffect(() => {
    if (!open) {
      setProbabilityId(NUMBERMAP.ZERO)
      setSeverityId(NUMBERMAP.ZERO)
      setAcceptabilityValue(null)
    }
  }, [open])

  // Refetch risk acceptability when modal opens and values are available
  useEffect(() => {
    if (open && probabilityId && severityId) {
      refetchRiskAcceptability()
    }
  }, [open, probabilityId, severityId, refetchRiskAcceptability])

  // Initialize probability and severity IDs from initial values
  useEffect(() => {
    if (initialProbability) {
      setProbabilityId(parseInt(initialProbability))
    }
    if (initialSeverity) {
      setSeverityId(parseInt(initialSeverity))
    }
  }, [initialProbability, initialSeverity])

  // Update acceptability value when API data changes
  useEffect(() => {
    if (
      riskAcceptabilityData?.data &&
      riskAcceptabilityData.data.length > NUMBERMAP.ZERO
    ) {
      setAcceptabilityValue(
        riskAcceptabilityData.data[NUMBERMAP.ZERO].is_acceptable
      )
    } else {
      setAcceptabilityValue(null)
    }
  }, [riskAcceptabilityData])

  // Reset acceptability value when probability or severity is cleared
  useEffect(() => {
    if (probabilityId === null || severityId === null) {
      setAcceptabilityValue(null)
    }
  }, [probabilityId, severityId])

  return {
    probabilityOptions,
    severityOptions,
    probabilityLoading,
    severityLoading,
    acceptabilityValue,
    setProbabilityId,
    setSeverityId,
    acceptabilityLoading,
  }
}

export const renderAcceptabilityButton = (
  acceptabilityValue: number | null,
  acceptableButtonText: string,
  notAcceptableButtonText: string
) => {
  if (acceptabilityValue === null) {
    return null
  }

  if (acceptabilityValue === NUMBERMAP.ONE) {
    return (
      <AcceptableButton variant="contained" isSelected={true}>
        {acceptableButtonText}
      </AcceptableButton>
    )
  }

  return (
    <NotAcceptableButton variant="contained" isSelected={true}>
      {notAcceptableButtonText}
    </NotAcceptableButton>
  )
}

export const ProbabilitySeverityFields: React.FC<{
  probabilityOptions: Array<{ id: string; name: string }>
  severityOptions: Array<{ id: string; name: string }>
  probabilityLoading: boolean
  severityLoading: boolean
  probabilityValue: string
  severityValue: string
  onProbabilityChange: (value: string) => void
  onSeverityChange: (value: string) => void
  probabilityError?: string
  severityError?: string
  probabilityLabel: string
  severityLabel: string
  probabilityPlaceholder: string
  severityPlaceholder: string
  disabled?: boolean
}> = ({
  probabilityOptions,
  severityOptions,
  probabilityLoading,
  severityLoading,
  probabilityValue,
  severityValue,
  onProbabilityChange,
  onSeverityChange,
  probabilityError,
  severityError,
  probabilityLabel,
  severityLabel,
  probabilityPlaceholder,
  severityPlaceholder,
  disabled = false,
}) => {
  // Helper function to check if any loading state is active or field is disabled
  const isAnyLoading = () => {
    if (probabilityLoading) return true
    if (severityLoading) return true
    if (disabled) return true
    return false
  }

  return (
    <>
      <Grid2 size={NUMBERMAP.TWELVE}>
        <InputField
          label={probabilityLabel}
          placeholder={probabilityPlaceholder}
          isDropdown={true}
          value={probabilityValue}
          onChange={onProbabilityChange}
          options={probabilityOptions}
          keyField={COMMON_FIELD_CONSTANTS.KEY_FIELD}
          valueField={COMMON_FIELD_CONSTANTS.VALUE_FIELD}
          error={probabilityError}
          disabled={isAnyLoading()}
        />
      </Grid2>

      <Grid2 size={NUMBERMAP.TWELVE}>
        <InputField
          label={severityLabel}
          placeholder={severityPlaceholder}
          isDropdown={true}
          value={severityValue}
          onChange={onSeverityChange}
          options={severityOptions}
          keyField={COMMON_FIELD_CONSTANTS.KEY_FIELD}
          valueField={COMMON_FIELD_CONSTANTS.VALUE_FIELD}
          error={severityError}
          disabled={isAnyLoading()}
        />
      </Grid2>
    </>
  )
}

export const AcceptabilityField: React.FC<{
  acceptabilityValue: number | null
  acceptableButtonText: string
  notAcceptableButtonText: string
  error?: string
}> = ({
  acceptabilityValue,
  acceptableButtonText,
  notAcceptableButtonText,
  error,
}) => (
  <Grid2 size={NUMBERMAP.TWELVE} id={RISK_CATEGORY_CONSTANTS.ACCEPTABILITY_FIELD}>
    <AcceptabilityContainer>
      <AcceptabilityButtonContainer>
        {renderAcceptabilityButton(
          acceptabilityValue,
          acceptableButtonText,
          notAcceptableButtonText
        )}
      </AcceptabilityButtonContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </AcceptabilityContainer>
  </Grid2>
)

const RiskManagementModalBase: React.FC<RiskManagementModalBaseProps> = ({
  open,
  onClose,
  onSave,
  isPending = false,
  title,
  modalMaxWidth,
  projectId,
  children,
  cancelButtonLabel,
  saveButtonLabel,
  customButtons,
}) => {
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={title}
      modalMaxWidth={modalMaxWidth}
    >
      <Grid2
        container
        spacing={NUMBERMAP.TWO}
        sx={MODAL_STYLES.scrollableContainer}
      >
        {children}
      </Grid2>

      {customButtons ?? (
        <ButtonGroup
          buttons={[
            { label: cancelButtonLabel, onClick: onClose, disabled: isPending },
            { label: saveButtonLabel, onClick: onSave, disabled: isPending },
          ]}
        />
      )}
    </CommonModal>
  )
}

export default RiskManagementModalBase
