'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Grid2 } from '@mui/material'
import { RichTextEditor, Label, ButtonGroup } from '@/components/ui'
import { NUMBERMAP, BUTTON_LABEL } from '@/constants/common'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import AnnexureDropdown from '@/components/modules/regulation/annexure-dropdown/AnnexureDropdown'
import {
  INFO_TEXT,
  PERSONNEL_FORM_LABELS,
  PERSONNEL_FIELD_KEYS,
  PERSONNEL_ANNEXURE,
} from '@/constants/modules/regulation/personnel'
import { useParams } from 'next/navigation'
import { useFetchPersonnel, usePostPersonnel } from '@/hooks/modules/regulation/usePersonnel'
import { ButtonContainer } from '@/styles/components/ui/button'
import PersonnelInfo from '@/components/modules/regulation/PersonnelInfoText'
import { PersonnelData } from '@/types/modules/regulation/personnel'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const PersonnelForm: React.FC = () => {
  const params = useParams()
  const organizationSiteId = Number(params.id)
  const { data, refetch: refetchPersonnel } = useFetchPersonnel(organizationSiteId, false)
  const { mutate: submitPersonnel } = usePostPersonnel()
  const { draftSave, clearDraftSave ,isDraftSaving} = useDraftSave({
    context_type: 'organization_site',
  })

  const [personnelData, setPersonnelData] = useState<PersonnelData | null>(null)
  const isInitialDataLoad = useRef(true)

  // Trigger API call on component mount
  useEffect(() => {
    refetchPersonnel();
  }, [refetchPersonnel]);
  
  useEffect(() => {
    if (data?.data) {
      setPersonnelData(data?.data[NUMBERMAP.ZERO])
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false
      }, NUMBERMAP.THOUSAND);
    }
  }, [data])
  const handleCancel = () => {
    // Implement cancel logic here
  }

  function handleSave(type: SaveType, next?: PersonnelData | null) {
    const payload = {
      organization_site_id: organizationSiteId,
      ...(next ?? personnelData),
    }
    if (type === 'draft') {
      draftSave({
        project_id: Number(organizationSiteId),
        form_type: 'personnel',
        form_data: payload,
        timestamp: new Date().toISOString(),
      })
      return
    }
    clearDraftSave()
    submitPersonnel(payload)
  }

  const handleInputChange = (
    name: string,
    value: string | null
  ) => {
    setPersonnelData((prev: PersonnelData | null) => {
      const updated = { ...(prev ?? {} as any), [name]: value } as PersonnelData
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated)
      }
      return updated
    })
  }

  const buttonConfig = [
    { label: BUTTON_LABEL.CANCEL, onClick: handleCancel },
    { label: BUTTON_LABEL.SAVE, onClick: () => handleSave('final') },
  ]

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={PERSONNEL_FORM_LABELS.TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PERSONNEL_FORM_LABELS.ORGANIZATION_CHART_LABEL}
                value={personnelData?.organization_chart ?? ''}
                onChange={(value) =>
                  handleInputChange(PERSONNEL_FIELD_KEYS.ORGANIZATION_CHART, value)
                }
                placeholder={
                  PERSONNEL_FORM_LABELS.ORGANIZATION_CHART_PLACEHOLDER
                }
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PERSONNEL_FORM_LABELS.QUALIFICATION_EXPERIENCE_LABEL}
                value={personnelData?.personnel_profile_summary ?? ''}
                onChange={(value) =>
                  handleInputChange(PERSONNEL_FIELD_KEYS.PERSONNEL_PROFILE_SUMMARY, value)
                }
                placeholder={
                  PERSONNEL_FORM_LABELS.QUALIFICATION_EXPERIENCE_PLACEHOLDER
                }
                infoText={INFO_TEXT.KEY_PERSONNEL}
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[PERSONNEL_ANNEXURE.QUALIFICATION_EXPERIENCE]}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PERSONNEL_FORM_LABELS.TRAINING_ARRANGEMENT_LABEL}
                value={personnelData?.training_arragement_outline ?? ''}
                onChange={(value) =>
                  handleInputChange(PERSONNEL_FIELD_KEYS.TRAINING_ARRANGEMENT_OUTLINE, value)
                }
                placeholder={
                  PERSONNEL_FORM_LABELS.TRAINING_ARRANGEMENT_PLACEHOLDER
                }
                infoText={PersonnelInfo}
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[PERSONNEL_ANNEXURE.TRAINING_ARRANGEMENT]}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PERSONNEL_FORM_LABELS.HEALTH_REQUIREMENTS_LABEL}
                value={personnelData?.health_requirements ?? ''}
                onChange={(value) =>
                  handleInputChange(PERSONNEL_FIELD_KEYS.HEALTH_REQUIREMENTS, value)
                }
                placeholder={
                  PERSONNEL_FORM_LABELS.HEALTH_REQUIREMENTS_PLACEHOLDER
                }
                infoText={INFO_TEXT.HEALTH_REQUIREMENTS}
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[PERSONNEL_ANNEXURE.HEALTH_REQUIREMENTS]}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PERSONNEL_FORM_LABELS.HYGIENE_REQUIREMENTS_LABEL}
                value={personnelData?.personnel_hygeine_requirement ?? ''}
                onChange={(value) =>
                  handleInputChange(PERSONNEL_FIELD_KEYS.PERSONNEL_HYGIENE_REQUIREMENT, value)
                }
                placeholder={
                  PERSONNEL_FORM_LABELS.HYGIENE_REQUIREMENTS_PLACEHOLDER
                }
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[PERSONNEL_ANNEXURE.HYGIENE_REQUIREMENTS]}
                />
              </Grid2>
            </Grid2>
          </Grid2>
          <ButtonContainer>
            <ButtonGroup buttons={buttonConfig} />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default PersonnelForm
