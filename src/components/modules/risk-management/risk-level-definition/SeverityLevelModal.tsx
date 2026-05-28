'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Grid2 from '@mui/material/Grid2'
import { ButtonGroup, InputField, Description, showActionAlert } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import { RISK_DEFINITION_LEVEL_CONSTANTS, SEVERITY_LEVEL_FIELD_LABEL_MAP, SEVERITY_LEVEL_FIELD_ORDER } from '@/constants/modules/risk-management/riskLevelDefinition'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {
  SeverityLevelAPI,
  SeverityLevelData,
  SeverityLevelFormErrors,
  SeverityLevelModalProps,
} from '@/types/modules/risk-management/riskLevelDefinition'
import { popup_style } from '@/styles/common'
import { DecimalNumberMax5Places, processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'

/**
 *Classification : Confidential
 **/
const INITIAL_FORM_DATA: SeverityLevelData = {
  template_id: NUMBERMAP.ZERO,
  level_name: '',
  level_value: null,
  description: '',
}

const INITIAL_ERRORS: SeverityLevelFormErrors = {
  level_name: '',
  level_value: '',
  description: '',
}

const SeverityLevelModal: React.FC<SeverityLevelModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
  projectId,
  permissions = [],
}) => {
  const [formData, setFormData] = useState<SeverityLevelData>(INITIAL_FORM_DATA)
  const [formErrors, setFormErrors] =
    useState<SeverityLevelFormErrors>(INITIAL_ERRORS)

  // Update form data when initialData changes (for editing)
  useEffect(() => {
    if (initialData?.apiData) {
      const apiData = initialData.apiData as SeverityLevelAPI
      setFormData({
        template_id: apiData.template_id ?? NUMBERMAP.ZERO,
        level_name: apiData.level_name ?? '',
        level_value: apiData.level_value ?? null,
        description: apiData.description ?? '',
      })
    } else {
      setFormData(INITIAL_FORM_DATA)
    }
  }, [initialData])

  /**
   * Function Name: handleChange
   * Params: field (string), value (string | number)
   * Description: Handles form field changes with null conversion for empty level_value
   * Author: Madhumitha
   * Created: 06-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleChange = (field: string) => (value: string | number) => {
    // For level_value field, only allow numbers and decimals
    if (field === RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_NAMES.LEVEL_VALUE) {
      const stringValue = String(value)

      // Allow empty string to set as null
      if (stringValue === '' || stringValue === 'null') {
        setFormData((prev) => ({
          ...prev,
          [field]: null,
        }))
      } else if (DecimalNumberMax5Places.test(stringValue)) {
        // More permissive regex for typing - allows partial input
        // Allows: digits, single decimal point, leading decimal, max 5 decimal places
        const numericValue = parseFloat(stringValue)
        
        // Validate range using constants
        if (numericValue >= RISK_DEFINITION_LEVEL_CONSTANTS.VALIDATION_LIMITS.SEVERITY_LEVEL_VALUE_MIN && 
            numericValue <= RISK_DEFINITION_LEVEL_CONSTANTS.VALIDATION_LIMITS.SEVERITY_LEVEL_VALUE_MAX) {
          setFormData((prev) => ({
            ...prev,
            [field]: stringValue,
          }))
        }
        // If validation fails, don't update the field
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    if (formErrors[field as keyof SeverityLevelFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = useCallback((): boolean => {
    const newErrors: SeverityLevelFormErrors = {
      level_name: !formData.level_name?.trim()
        ? RISK_DEFINITION_LEVEL_CONSTANTS.ERROR_MESSAGES.LEVEL_NAME_REQUIRED
        : '',
      level_value: formData.level_value && formData.level_value !== null
        ? (() => {
            const numericValue = parseFloat(formData.level_value)
            return (numericValue < RISK_DEFINITION_LEVEL_CONSTANTS.VALIDATION_LIMITS.SEVERITY_LEVEL_VALUE_MIN || 
                    numericValue > RISK_DEFINITION_LEVEL_CONSTANTS.VALIDATION_LIMITS.SEVERITY_LEVEL_VALUE_MAX)
              ? RISK_DEFINITION_LEVEL_CONSTANTS.ERROR_MESSAGES.LEVEL_VALUE_RANGE_INVALID
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
        (key) => newErrors[key as keyof SeverityLevelFormErrors] !== ''
      ).length === NUMBERMAP.ZERO
    )
  }, [formData])

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA)
    setFormErrors(INITIAL_ERRORS)
  }

  /**
   * Function Name: handleSeverityModalSave
   * Params: none
   * Description: Validates form data, converts empty values to null, and saves severity level data
   * Author: Madhumitha
   * Created: 06-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleSeverityModalSave = () => {
    if (!validateForm()) {
      validateAndFocusFirstEmptyField(formData, Array.from(SEVERITY_LEVEL_FIELD_ORDER), SEVERITY_LEVEL_FIELD_LABEL_MAP)
      return
    }
    // Convert "0" to null before saving
    const dataToSave = {
      ...formData,
      level_value: formData.level_value === String(NUMBERMAP.ZERO) ? null : formData.level_value,
    }

    onSave?.(dataToSave)
    resetForm()
    onClose?.()
  }

  const handleSeverityModalClose = () => {
    resetForm()
    onCancel?.()
    onClose?.()
  }

  const severityActionHandlers: Record<string, (id: number) => void> = {
    Save: () => handleSeverityModalSave(),
    Cancel: () => handleSeverityModalClose(),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions ?? [], severityActionHandlers, false)

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
      onClose={handleSeverityModalClose}
      onSave={handleSeverityModalSave}
      buttonRequired={!buttonDetails}
      title={RISK_DEFINITION_LEVEL_CONSTANTS.MODAL_TITLES.EDIT_SEVERITY_LEVEL}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InfoField
            label={RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_LABELS.SEVERITY_NAME}
            value={formData.level_name ?? ''}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_LABELS.LEVEL_VALUE}
            placeholder={
              RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_PLACEHOLDERS.LEVEL_VALUE
            }
            value={formData.level_value ?? ''}
            onChange={handleChange(
              RISK_DEFINITION_LEVEL_CONSTANTS.FIELD_NAMES.LEVEL_VALUE
            )}
            error={formErrors.level_value}
            disabled={!hasEditPermission}
          />
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

export default SeverityLevelModal