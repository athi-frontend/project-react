'use client'
import React, { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import { InputField } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import ButtonGroup from '@/components/ui/button-group/ButtonGroup'
import {
  PatientPopulationModalData,
  PatientPopulationModalFormErrors,
  PatientPopulationModalProps,
} from '@/types/modules/risk-management/scope'
import {
  PATIENT_POPULATION_MODAL,
  FIELD_NAMES,
  FORM_FIELD_NAMES,
  VALIDATION_FIELD_NAMES,
} from '@/constants/modules/risk-management/scope'
import { BUTTONLABELS} from '@/lib/utils/common'
/**
 *Classification : Confidential
 **/
const INITIAL_FORM_DATA: PatientPopulationModalData = {
  ageRange: '',
  gender: '',
  diseaseState: '',
}

const INITIAL_ERRORS: PatientPopulationModalFormErrors = {
  ageRange: '',
  gender: '',
  diseaseState: '',
}

// Gender options will be fetched from API

const PatientPopulationModal: React.FC<PatientPopulationModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
  genderData,
  genderLoading = false,
  genderError = null,
  readOnly = false,

}) => {
  const [patientData, setPatientData] =
    useState<PatientPopulationModalData>(INITIAL_FORM_DATA)
  const [formErrors, setFormErrors] =
    useState<PatientPopulationModalFormErrors>(INITIAL_ERRORS)

  const isGenderFieldDisabled = () => {
    if (genderLoading) return true
    if (readOnly) return true
    return false
  }

  React.useEffect(() => {
    if (initialData) {
      setPatientData(initialData)
    } else {
      setPatientData(INITIAL_FORM_DATA)
    }
  }, [initialData])

  const handleChange =
    (field: keyof PatientPopulationModalData) => (value: string) => {
      setPatientData((prev) => ({
        ...prev,
        [field]: value,
      }))

      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: '' }))
      }
    }

  /**
   * Function Name: validateForm
   * Params: None
   * Description: Validates the patient population form data and returns validation status
   * Author: Madhumitha
   * Created: 01-09-2025
   * Modified:
   * Classification: Confidential
   */
  const validateForm = (): boolean => {
    const errors = { ...INITIAL_ERRORS }
    let valid = true

    // Common validation for required string fields
    const requiredFields = [
      {
        field: VALIDATION_FIELD_NAMES.AGE_RANGE,
        error: PATIENT_POPULATION_MODAL.AGE_RANGE_REQUIRED,
      },
      {
        field: VALIDATION_FIELD_NAMES.GENDER,
        error: PATIENT_POPULATION_MODAL.GENDER_REQUIRED,
      },
      {
        field: VALIDATION_FIELD_NAMES.DISEASE_STATE,
        error: PATIENT_POPULATION_MODAL.DISEASE_STATE_REQUIRED,
      },
    ]

    requiredFields.forEach(({ field, error }) => {
      if (!patientData[field as keyof PatientPopulationModalData]?.trim()) {
        errors[field as keyof PatientPopulationModalFormErrors] = error
        valid = false
      }
    })

    setFormErrors(errors)
    return valid
  }

  const resetForm = () => {
    setPatientData(INITIAL_FORM_DATA)
    setFormErrors(INITIAL_ERRORS)
  }

  const handleModalSave = () => {
    if (!validateForm()) return
    onSave?.(patientData)
    resetForm()
    onClose?.()
  }

  const handleModalClose = () => {
    resetForm()
    onCancel?.()
    onClose?.()
  }

  return (
    <CommonModal
      open={open}
      onClose={handleModalClose}
      title={PATIENT_POPULATION_MODAL.TITLE}
    >
      <Grid2 container spacing={NUMBERMAP.TWO}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={PATIENT_POPULATION_MODAL.AGE_RANGE_LABEL}
            placeholder={PATIENT_POPULATION_MODAL.AGE_RANGE_PLACEHOLDER}
            value={patientData.ageRange}
            onChange={handleChange(
              FORM_FIELD_NAMES.AGE_RANGE as keyof PatientPopulationModalData
            )}
            error={formErrors.ageRange}
            disabled={readOnly}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={PATIENT_POPULATION_MODAL.GENDER_LABEL}
            placeholder={
              genderLoading
                ? PATIENT_POPULATION_MODAL.GENDER_LOADING_PLACEHOLDER
                : PATIENT_POPULATION_MODAL.GENDER_PLACEHOLDER
            }
            isDropdown={true}
            value={patientData.gender}
            onChange={handleChange(
              FORM_FIELD_NAMES.GENDER as keyof PatientPopulationModalData
            )}
            options={genderData ?? []}
            error={
              formErrors.gender ??
              (genderError
                ? PATIENT_POPULATION_MODAL.FAILED_TO_LOAD_GENDERS
                : undefined)
            }
            keyField={FIELD_NAMES.ID}
            valueField={FIELD_NAMES.GENDER_NAME}
            disabled={isGenderFieldDisabled()}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={PATIENT_POPULATION_MODAL.DISEASE_STATE_LABEL}
            placeholder={PATIENT_POPULATION_MODAL.DISEASE_STATE_PLACEHOLDER}
            value={patientData.diseaseState}
            onChange={handleChange(
              FORM_FIELD_NAMES.DISEASE_STATE as keyof PatientPopulationModalData
            )}
            error={formErrors.diseaseState}
            disabled={readOnly}
          />
        </Grid2>
      </Grid2>
      <ButtonGroup
        buttons={[
          { label: BUTTONLABELS.BUTTON_LABEL_CANCEL, onClick: handleModalClose },
          { label: BUTTONLABELS.BUTTON_LABEL_SAVE, onClick: handleModalSave, disabled: readOnly }
        ]}
      />
    </CommonModal>
  )
}

export default PatientPopulationModal
