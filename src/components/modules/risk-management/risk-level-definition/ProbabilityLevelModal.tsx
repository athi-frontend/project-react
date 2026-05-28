'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Grid2 from '@mui/material/Grid2'
import { ButtonGroup, InputField, Description, showActionAlert } from '@/components/ui'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { NUMBERMAP } from '@/constants/common'
import { PROBABILITY_LEVEL_FIELD_LABEL_MAP, PROBABILITY_LEVEL_FIELD_ORDER, RISK_DEFINITION_LEVEL_CONSTANTS } from '@/constants/modules/risk-management/riskLevelDefinition'
import { numberValidation, processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {
  ProbabilityLevelAPI,
  ProbabilityLevelData,
  ProbabilityLevelFormErrors,
  ProbabilityLevelModalProps,
} from '@/types/modules/risk-management/riskLevelDefinition'
import { popup_style, ErrorText } from '@/styles/common'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
/**
 *Classification : Confidential
 **/
const INITIAL_FORM_DATA: ProbabilityLevelData = {
  template_id: NUMBERMAP.ZERO,
  level_name: '',
  numerator: NUMBERMAP.ZERO,
  denominator: NUMBERMAP.ZERO,
  level_value: '-',
  description: '',
}

const INITIAL_ERRORS: ProbabilityLevelFormErrors = {
  level_name: '',
  numerator: '',
  denominator: '',
  level_value: '',
  description: '',
}

/**
 * Function Name: calculateLevelValue
 * Params: numerator (number), denominator (number)
 * Description: Calculates level value based on numerator and denominator
 * Author: Madhumitha
 * Created: 23-09-2025
 * Modified:
 * Classification: Confidential
 */
const calculateLevelValue = (numerator: number, denominator: number): string => {
  if (numerator > NUMBERMAP.ZERO && denominator > NUMBERMAP.ZERO) {
    const divisionResult = numerator / denominator
    return parseFloat(divisionResult?.toFixed?.(NUMBERMAP.THREE))?.toString()
  } else {
    return '-'
  }
}

const ProbabilityLevelModal: React.FC<ProbabilityLevelModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
  projectId,
  permissions = [],
}) => {
  const [formData, setFormData] =
    useState<ProbabilityLevelData>(INITIAL_FORM_DATA)
  const [formErrors, setFormErrors] =
    useState<ProbabilityLevelFormErrors>(INITIAL_ERRORS)

  // Update form data when initialData changes (for editing)
  useEffect(() => {
    if (initialData?.apiData) {
      const apiData = initialData.apiData as ProbabilityLevelAPI
      setFormData({
        template_id: apiData.template_id ?? NUMBERMAP.ZERO,
        level_name: apiData.level_name ?? '',
        numerator: apiData.numerator ?? NUMBERMAP.ZERO,
        denominator: apiData.denominator ?? NUMBERMAP.ZERO,
        level_value: apiData.level_value ?? '-',
        description: apiData.description ?? '',
      })
    } else {
      setFormData(INITIAL_FORM_DATA)
    }
  }, [initialData])

  /**
   * Function Name: handleChange
   * Params: field (string), value (string | number)
   * Description: Handles form field changes with automatic level_value calculation for numerator/denominator
   * Author: Madhumitha
   * Created: 06-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleChange = (field: string) => (value: string | number) => {
    if (
      field === RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_NAMES.NUMERATOR ||
      field === RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_NAMES.DENOMINATOR
    ) {
      // Handle number input for numerator and denominator
      const stringValue = String(value)
      
      // Allow empty string for clearing the field
      if (stringValue === '') {
        setFormData((prev) => {
          const updatedData = {
            ...prev,
            [field]: NUMBERMAP.ZERO,
          }
          
          // Recalculate level_value when field is cleared
          updatedData.level_value = calculateLevelValue(updatedData.numerator, updatedData.denominator)
          
          return updatedData
        })
        return
      }
      
      // Use regex validation for positive numbers only
      if (!numberValidation.test(stringValue)) {
        return // Don't update if not a valid positive number
      }
      
      const numValue = Number(stringValue)
      
      setFormData((prev) => {
        const updatedData = {
          ...prev,
          [field]: numValue,
        }
        
        // Calculate level_value when numerator or denominator changes
        updatedData.level_value = calculateLevelValue(updatedData.numerator, updatedData.denominator)
        
        return updatedData
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    if (formErrors[field as keyof ProbabilityLevelFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = useCallback((): boolean => {
    const newErrors: ProbabilityLevelFormErrors = {
      level_name: !formData.level_name?.trim()
        ? RISK_DEFINITION_LEVEL_CONSTANTS.ERROR_MESSAGES.LEVEL_NAME_REQUIRED
        : '',
      numerator:
        !formData.numerator || formData.numerator <= NUMBERMAP.ZERO
          ? RISK_DEFINITION_LEVEL_CONSTANTS.ERROR_MESSAGES.NUMERATOR_REQUIRED
          : '',
      denominator:
        !formData.denominator || formData.denominator <= NUMBERMAP.ZERO
          ? RISK_DEFINITION_LEVEL_CONSTANTS.ERROR_MESSAGES.DENOMINATOR_REQUIRED
          : '',
      level_value: formData.level_value && formData.level_value !== '-' 
        ? (() => {
            const numericValue = parseFloat(formData.level_value)
            return (numericValue < RISK_DEFINITION_LEVEL_CONSTANTS.VALIDATION_LIMITS.SEVERITY_LEVEL_VALUE_MIN || 
                    numericValue > RISK_DEFINITION_LEVEL_CONSTANTS.VALIDATION_LIMITS.SEVERITY_LEVEL_VALUE_MAX)
              ? RISK_DEFINITION_LEVEL_CONSTANTS.ERROR_MESSAGES.PROBABILITY_VALUE_RANGE_INVALID
              : ''
          })()
        : '',
      description: !formData.description?.trim()
        ? RISK_DEFINITION_LEVEL_CONSTANTS.ERROR_MESSAGES.DESCRIPTION_REQUIRED
        : '',
    }

    setFormErrors(newErrors)
    return (
      Object.keys(newErrors).filter(
        (key) => newErrors[key as keyof ProbabilityLevelFormErrors] !== ''
      ).length === NUMBERMAP.ZERO
    )
  }, [formData])

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA)
    setFormErrors(INITIAL_ERRORS)
  }

  /**
   * Function Name: handleModalSave
   * Params: none
   * Description: Validates form data and saves probability level data, then closes modal
   * Author: Madhumitha
   * Created: 06-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleModalSave = () => {
    if (!validateForm()) {
      const formDataForFocus = { ...formData }
      if (formDataForFocus.numerator === NUMBERMAP.ZERO) formDataForFocus.numerator = ''
      if (formDataForFocus.denominator === NUMBERMAP.ZERO) formDataForFocus.denominator = ''
      validateAndFocusFirstEmptyField(formDataForFocus, Array.from(PROBABILITY_LEVEL_FIELD_ORDER), PROBABILITY_LEVEL_FIELD_LABEL_MAP)
      return
    }

    onSave?.(formData)
    resetForm()
    onClose?.()
  }

  const handleModalClose = () => {
    resetForm()
    onCancel?.()
    onClose?.()
  }

  const actionHandlers: Record<string, (id: number) => void> = {
    Save: () => handleModalSave(),
    Cancel: () => handleModalClose(),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions ?? [], actionHandlers, false)

  // Permission access denied logic - check permissions from fetch by id
  useEffect(() => {
    if (open && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON as 'error',
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [open, buttonDetails])

  return (
    <CommonModal
      open={open}
      onClose={handleModalClose}
      onSave={handleModalSave}
      buttonRequired={!buttonDetails}
      title={
        RISK_DEFINITION_LEVEL_CONSTANTS.MODAL_TITLES.EDIT_PROBABILITY_LEVELS
      }
    >
      <Grid2 container spacing={NUMBERMAP.TWO} sx={popup_style}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InfoField
            label={
              RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_LABELS.PROBABILITY_NAME
            }
            value={formData.level_name ?? ''}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_LABELS.NUMERATOR}
            placeholder={
              RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_PLACEHOLDERS.NUMERATOR
            }
            value={formData.numerator === NUMBERMAP.ZERO ? '' : String(formData.numerator ?? NUMBERMAP.ZERO)}
            onChange={handleChange(
              RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_NAMES.NUMERATOR
            )}
            error={formErrors.numerator}
            disabled={!hasEditPermission}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_LABELS.DENOMINATOR}
            placeholder={
              RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_PLACEHOLDERS.DENOMINATOR
            }
            value={formData.denominator === NUMBERMAP.ZERO ? '' : String(formData.denominator ?? NUMBERMAP.ZERO)}
            onChange={handleChange(
              RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_NAMES.DENOMINATOR
            )}
            error={formErrors.denominator}
            disabled={!hasEditPermission}
            maxLength={NUMBERMAP.EIGHT}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InfoField
            label={RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_LABELS.LEVEL_VALUE}
            value={formData.level_value}
          />
          {formErrors.level_value && <ErrorText>{formErrors.level_value}</ErrorText>}
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <Description
            label={RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_LABELS.DESCRIPTION}
            placeholder={
              RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_PLACEHOLDERS.DESCRIPTION
            }
            value={formData.description ?? ''}
            onChange={handleChange(
              RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_NAMES.DESCRIPTION
            )}
            error={formErrors.description}
            disabled={!hasEditPermission}
          />
        </Grid2>
      </Grid2>
      {buttonDetails && <ButtonGroup buttons={buttonDetails} />}
    </CommonModal>
  )
}

export default ProbabilityLevelModal