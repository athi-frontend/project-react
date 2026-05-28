'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import { Description, InputField, RichTextEditor } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import { ContentWrapper } from '@/styles/modules/dnd/feasibilityStudy'
import { MODAL_STYLES } from '@/styles/modules/dnd/verification'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import {
  QUALIFICATION_CHECKLIST_UI_STRINGS,
  QUALIFICATION_CHECKLIST_FIELD_NAMES,
} from '@/constants/modules/infrastructure-management/infrastructureOnboardingTabs'
import { AddInfrastructureQualificationChecklistModalProps, QualificationFormData } from '@/types/modules/infrastructure-management/infrastructureOnboardingTabs'

/**
 * Classification : Confidential
 **/


export const DEFAULT_QUALIFICATION_FORM_DATA: QualificationFormData = {
  testPerformed: '',
  acceptanceCriteria: '',
  status_id: '',
}

const AddInfrastructureQualificationChecklistModal: React.FC<AddInfrastructureQualificationChecklistModalProps> = ({
  formData = DEFAULT_QUALIFICATION_FORM_DATA,
  errors = {},
  onChange = () => {},
}) => {
  const { data: statusData } = useOrganizationStatus()

  return (
    <ContentWrapper>
      <Grid2 container spacing={NUMBERMAP.TWO} sx={MODAL_STYLES.scrollableContainer}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <Description
            label={QUALIFICATION_CHECKLIST_UI_STRINGS.TEST_PERFORMED_LABEL}
            placeholder={QUALIFICATION_CHECKLIST_UI_STRINGS.TEST_PERFORMED_PLACEHOLDER}
            value={formData.testPerformed}
            onChange={(value: string) => onChange(QUALIFICATION_CHECKLIST_FIELD_NAMES.TEST_PERFORMED, value)}
            error={errors.testPerformed}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <RichTextEditor
            label={QUALIFICATION_CHECKLIST_UI_STRINGS.ACCEPTANCE_CRITERIA_LABEL}
            placeholder={QUALIFICATION_CHECKLIST_UI_STRINGS.ACCEPTANCE_CRITERIA_PLACEHOLDER}
            value={formData.acceptanceCriteria}
            onChange={(value: string) => onChange(QUALIFICATION_CHECKLIST_FIELD_NAMES.ACCEPTANCE_CRITERIA, value)}
            error={errors.acceptanceCriteria}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={QUALIFICATION_CHECKLIST_UI_STRINGS.STATUS_LABEL}
            placeholder={QUALIFICATION_CHECKLIST_UI_STRINGS.STATUS_PLACEHOLDER}
            isDropdown={true}
            options={statusData?.data ?? []}
            value={formData.status_id ? String(formData.status_id) : null}
            onChange={(value: string) => onChange(QUALIFICATION_CHECKLIST_FIELD_NAMES.STATUS_ID, value)}
            error={errors.status_id}
            keyField={QUALIFICATION_CHECKLIST_FIELD_NAMES.STATUS_ID}
            valueField={QUALIFICATION_CHECKLIST_FIELD_NAMES.STATUS_NAME}
          />
        </Grid2>
      </Grid2>
    </ContentWrapper>
  )
}

export default AddInfrastructureQualificationChecklistModal