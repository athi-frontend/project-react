'use client'

import React from 'react'
import { Grid2 } from '@mui/material'
import { RadioButtonGroup, InputField } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import {
  PROCESS_VALIDATION_FORM_LABELS,
  PROCESS_VALIDATION_FORM_PLACEHOLDERS,
  RESULT_OPTIONS,
  STATUS_DROPDOWN_CONFIG,
} from '@/constants/modules/production/process-validation'
import { ResultAndStatusFieldsProps } from '@/types/modules/production/process-validation'

/**
 * Classification: Confidential
 * Shared component for Result and Status fields in Process Validation modals
 */

const ResultAndStatusFields: React.FC<ResultAndStatusFieldsProps> = ({
  result,
  status,
  resultError,
  statusError,
  statusOptions,
  onResultChange,
  onStatusChange,
}) => {
  return (
    <>
      {/* Result */}
      <Grid2 size={NUMBERMAP.TWELVE}>
        <RadioButtonGroup
          label={PROCESS_VALIDATION_FORM_LABELS.RESULT}
          name="result"
          options={RESULT_OPTIONS}
          value={result}
          onChange={onResultChange}
          error={resultError}
        />
      </Grid2>

      {/* Status */}
      <Grid2 size={NUMBERMAP.TWELVE}>
        <InputField
          label={PROCESS_VALIDATION_FORM_LABELS.STATUS}
          placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.SELECT_STATUS}
          isDropdown
          options={statusOptions}
          keyField={STATUS_DROPDOWN_CONFIG.KEY_FIELD}
          valueField={STATUS_DROPDOWN_CONFIG.VALUE_FIELD}
          value={status}
          onChange={onStatusChange}
          error={statusError}
        />
      </Grid2>
    </>
  )
}

export default ResultAndStatusFields

