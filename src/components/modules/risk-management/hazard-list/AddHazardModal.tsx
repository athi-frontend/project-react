/**
 * Add Hazard Modal Component
 * Classification: Confidential
 */
'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Description, ButtonGroup, MultiSelect, InputField } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {
  AddHazardModalProps,
  HazardFormData,
  HarmOption,
} from '@/types/modules/risk-management/riskAnalysisControl'
import { MODAL_STYLES } from '@/styles/modules/dnd/verification'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import {
  ADD_HAZARD_MODAL_CONSTANTS,
  HAZARD_FIELD_LABEL_MAP,
  HAZARD_FIELD_ORDER,
  REFERENCE_RCM_FIELD_CONSTANTS,
} from '@/constants/modules/risk-management/riskAnalysisControl'
import {
  getHarmIdsFromSelection,
  transformHarmApiToOptions,
} from '@/lib/modules/risk-management/hazardTransformer'
import {
  useHarms,
  useReferenceRCM,
} from '@/hooks/modules/risk-management/useRiskAnalysisControl'
import {
  FormContainer,
  FieldContainer,
} from '@/styles/modules/risk-management/riskAnalysisControl'
import { NUMBERMAP } from '@/constants/common'
import { getItemByIdFromArray } from '@/lib/utils/common'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'

const AddHazardModal: React.FC<AddHazardModalProps> = ({
  open,
  onClose,
  onSave,
  isPending = false,
  initialData,
  hazardId,
}) => {
  const params = useParams()
  const projectId = Number(params?.id)
  const [formData, setFormData] = useState<HazardFormData>({
    referenceRcm: ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_REFERENCE_RCM,
    hazardEvent: ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_HAZARD_EVENT,
    harm: ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_HARM,
    harmTo: [...ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_HARM_TO],
    harmIds: [...ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_HARM_IDS],
  })

  const [errors, setErrors] = useState<Partial<HazardFormData>>({})

  // Fetch harm options from API
  const { data: harmsApiData, isLoading: harmsLoading } = useHarms(open) // Only fetch when modal is open
  const { data: referenceRcmApiData, isLoading: referenceRcmLoading } =
    useReferenceRCM(projectId, open)

  // Transform API data to options format
  const harmToOptions: HarmOption[] = React.useMemo(() => {
    if (harmsApiData?.data) {
      return transformHarmApiToOptions(harmsApiData.data)
    }
    return []
  }, [harmsApiData])

  // Transform HarmOption to MultiSelect compatible format
  const multiSelectOptions = React.useMemo(() => {
    return harmToOptions.map((option) => ({
      id: option.id,
      name: option.name,
      harmId: option.harmId,
    }))
  }, [harmToOptions])

  // Prepare reference RCM dropdown options
  const referenceRcmDropdownOptions = React.useMemo(() => {
    const allOptions = referenceRcmApiData?.data ?? [];
    const activeOptions = allOptions.filter((item: any) => item.status === NUMBERMAP.ONE);
    const inactiveOptions = allOptions.filter((item: any) => item.status !== NUMBERMAP.ONE);

    let result = [...activeOptions];
    const initialRCMId = initialData?.referenceRcm;
    if (initialRCMId) {
      const inactiveItem = getItemByIdFromArray(initialRCMId, inactiveOptions);
      if (inactiveItem) {
        // Append only if not already in active
        if (!activeOptions.some((item: any) => String(item.id) === String(initialRCMId))) {
          result = [...activeOptions, inactiveItem];
        }
      }
    }
    return result;
  }, [referenceRcmApiData, initialData]);

  // Load form data from initialData (passed from parent component)
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const handleChange =
    (field: keyof HazardFormData) => (value: string | string[] | number[]) => {
      setFormData((prev) => {
        const newData = { ...prev }

        // Type-safe assignment based on field type
        if (field === ADD_HAZARD_MODAL_CONSTANTS.FIELD_REFERENCE_RCM) {
          newData[field] = value as string
        } else
        if (
          field === ADD_HAZARD_MODAL_CONSTANTS.FIELD_HAZARD_EVENT ||
          field === ADD_HAZARD_MODAL_CONSTANTS.FIELD_HARM
        ) {
          newData[field] = value as string
        } else if (field === ADD_HAZARD_MODAL_CONSTANTS.FIELD_HARM_TO) {
          newData[field] = value as string[]
          // Automatically update harmIds when harmTo is changed
          if (Array.isArray(value)) {
            newData.harmIds = getHarmIdsFromSelection(
              value as string[],
              harmToOptions
            )
          }
        }

        return newData
      })

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
    }

  const validateForm = (): boolean => {
    const newErrors: Partial<HazardFormData> = {}
    let isValid = true

    if (!formData.hazardEvent.trim()) {
      newErrors.hazardEvent =
        ADD_HAZARD_MODAL_CONSTANTS.ERROR_HAZARD_EVENT_REQUIRED
      isValid = false
    }

    if (!formData.harm.trim()) {
      newErrors.harm = ADD_HAZARD_MODAL_CONSTANTS.ERROR_HARM_REQUIRED
      isValid = false
    }

    if (!formData.harmTo || formData.harmTo.length === NUMBERMAP.ZERO) {
      newErrors.harmTo = [ADD_HAZARD_MODAL_CONSTANTS.ERROR_HARM_TO_REQUIRED]
      isValid = false
    }

    setErrors(newErrors)
    if (!isValid) {
      validateAndFocusFirstEmptyField(formData, Array.from(HAZARD_FIELD_ORDER), HAZARD_FIELD_LABEL_MAP);
    }
    return isValid
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      referenceRcm: ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_REFERENCE_RCM,
      hazardEvent: ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_HAZARD_EVENT,
      harm: ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_HARM,
      harmTo: [...ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_HARM_TO],
      harmIds: [...ADD_HAZARD_MODAL_CONSTANTS.DEFAULT_HARM_IDS],
    })
    setErrors({})
    onClose()
  }

  const isAnyLoading = () => {
    if (harmsLoading) return true
    if (referenceRcmLoading) return true
    if (isPending) return true
    return false
  }

  return (
    <>
      <GlobalLoader loading={isAnyLoading()} />
      <CommonModal
        open={open}
        onClose={handleClose}
        title={
          hazardId
            ? ADD_HAZARD_MODAL_CONSTANTS.MODAL_TITLE_EDIT
            : ADD_HAZARD_MODAL_CONSTANTS.MODAL_TITLE_ADD
        }
        modalMaxWidth={ADD_HAZARD_MODAL_CONSTANTS.MODAL_MAX_WIDTH}
      >
        <FormContainer sx={MODAL_STYLES.scrollableContainer}>
          <FieldContainer>
            <InputField
              label={ADD_HAZARD_MODAL_CONSTANTS.LABEL_REFERENCE_RCM}
              placeholder={ADD_HAZARD_MODAL_CONSTANTS.PLACEHOLDER_REFERENCE_RCM}
              isDropdown
              value={formData.referenceRcm ?? ''}
              onChange={handleChange(
                ADD_HAZARD_MODAL_CONSTANTS.FIELD_REFERENCE_RCM
              )}
              options={referenceRcmDropdownOptions}
              keyField={REFERENCE_RCM_FIELD_CONSTANTS.KEY_FIELD}
              valueField={REFERENCE_RCM_FIELD_CONSTANTS.VALUE_FIELD}
            />
          </FieldContainer>

          <FieldContainer>
            <Description
              label={ADD_HAZARD_MODAL_CONSTANTS.LABEL_HAZARD_EVENT}
              placeholder={ADD_HAZARD_MODAL_CONSTANTS.PLACEHOLDER_HAZARD_EVENT}
              value={formData.hazardEvent}
              onChange={handleChange(
                ADD_HAZARD_MODAL_CONSTANTS.FIELD_HAZARD_EVENT
              )}
              error={errors.hazardEvent}
            />
          </FieldContainer>

          <FieldContainer>
            <Description
              label={ADD_HAZARD_MODAL_CONSTANTS.LABEL_HARM}
              placeholder={ADD_HAZARD_MODAL_CONSTANTS.PLACEHOLDER_HARM}
              value={formData.harm}
              onChange={handleChange(ADD_HAZARD_MODAL_CONSTANTS.FIELD_HARM)}
              error={errors.harm}
            />
          </FieldContainer>

          <FieldContainer>
            <MultiSelect
              options={multiSelectOptions}
              idField={ADD_HAZARD_MODAL_CONSTANTS.FIELD_ID}
              valueField={ADD_HAZARD_MODAL_CONSTANTS.FIELD_NAME}
              label={ADD_HAZARD_MODAL_CONSTANTS.LABEL_HARM_TO}
              placeholder={ADD_HAZARD_MODAL_CONSTANTS.PLACEHOLDER_HARM_TO}
              onChange={(value) =>
                handleChange(ADD_HAZARD_MODAL_CONSTANTS.FIELD_HARM_TO)(
                  value as string[]
                )
              }
              value={formData.harmTo}
              error={
                Array.isArray(errors.harmTo)
                  ? errors.harmTo.join(', ')
                  : (errors.harmTo ?? [])
              }
            />
          </FieldContainer>
        </FormContainer>

        <ButtonGroup
          buttons={[
            {
              label: ADD_HAZARD_MODAL_CONSTANTS.BUTTON_CANCEL,
              onClick: handleClose,
              disabled: isPending,
            },
            {
              label: ADD_HAZARD_MODAL_CONSTANTS.BUTTON_SAVE,
              onClick: handleSave,
              disabled: isPending,
            },
          ]}
        />
      </CommonModal>
    </>
  )
}

export default AddHazardModal
