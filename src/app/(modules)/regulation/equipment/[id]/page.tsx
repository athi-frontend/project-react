'use client'
import React, { useEffect, useState, useRef } from 'react'
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
  EQUIPMENT_FORM_TITLE,
  EQUIPMENT_FORM_FIELDS_CONFIG,
  EQUIPMENT_FIELD_NAMES,
} from '@/constants/modules/regulation/equipment'
import {
  useEquipment,
  useCreateEquipment,
} from '@/hooks/modules/regulation/useEquipment'
import { useParams } from 'next/navigation'
import { ButtonContainer } from '@/styles/components/ui/button'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const Equipment: React.FC = () => {
  const params = useParams()
  const organizationSiteId = Number(params.id)
  const { data, refetch: refetchEquipment } = useEquipment(organizationSiteId, false)
  const { mutate: createEquipment, isPending } = useCreateEquipment()
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
     context_type: 'organization_site',
  })

  const [formData, setFormData] = useState({
    [EQUIPMENT_FIELD_NAMES.EQUIPMENT_DESCRIPTION]: '',
    [EQUIPMENT_FIELD_NAMES.MAINTENANCE_DESCRIPTION]: '',
    [EQUIPMENT_FIELD_NAMES.CALIBRATION_DESCRIPTION]: '',
  })
  const isInitialDataLoad = useRef(true)

  // Trigger API call on component mount
  useEffect(() => {
    refetchEquipment();
  }, [refetchEquipment]);

  useEffect(() => {
    if (data?.data) {
      if(data?.data[NUMBERMAP.ZERO]){
        setFormData(data.data[NUMBERMAP.ZERO]);
      }
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [data]);

  const handleCancel = () => {
    // Implement cancel logic here
  }

  function handleSave(type: SaveType, next?: typeof formData) {
    const payload = {
      [EQUIPMENT_FIELD_NAMES.ORGANIZATION_SITE_ID]: organizationSiteId,
      ...(next ?? formData),
    }
    if (type === 'draft') {
      draftSave({
        project_id: Number(organizationSiteId),
        form_type: 'equipment',
        form_data: payload,
        timestamp: new Date().toISOString(),
      })
      return
    }
    clearDraftSave()
    createEquipment(payload)
  }

  const buttonConfig = [
    { label: BUTTON_LABEL.CANCEL, onClick: handleCancel },
    { label: BUTTON_LABEL.SAVE, onClick: () => handleSave('final'), disabled: isPending },
  ]

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={EQUIPMENT_FORM_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={EQUIPMENT_FORM_FIELDS_CONFIG.EQUIPMENT_DESCRIPTION.label}
                value={
                  formData[EQUIPMENT_FIELD_NAMES.EQUIPMENT_DESCRIPTION] ?? ''
                }
                onChange={(value) =>
                  setFormData((prev) => { const updated = ({
                    ...prev,
                    [EQUIPMENT_FIELD_NAMES.EQUIPMENT_DESCRIPTION]: value,
                  }); if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })
                }
                placeholder={
                  EQUIPMENT_FORM_FIELDS_CONFIG.EQUIPMENT_DESCRIPTION.placeholder
                }
                infoText={
                  EQUIPMENT_FORM_FIELDS_CONFIG.EQUIPMENT_DESCRIPTION.infoText
                }
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[
                    { label: 'Annexure', fileUrl: '/files/annexure1.pdf' },
                  ]}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={
                  EQUIPMENT_FORM_FIELDS_CONFIG.MAINTENANCE_DESCRIPTION.label
                }
                value={
                  formData[EQUIPMENT_FIELD_NAMES.MAINTENANCE_DESCRIPTION] ?? ''
                }
                onChange={(value) =>
                  setFormData((prev) => { const updated = ({
                    ...prev,
                    [EQUIPMENT_FIELD_NAMES.MAINTENANCE_DESCRIPTION]: value,
                  }); if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })
                }
                placeholder={
                  EQUIPMENT_FORM_FIELDS_CONFIG.MAINTENANCE_DESCRIPTION
                    .placeholder
                }
                infoText={
                  EQUIPMENT_FORM_FIELDS_CONFIG.MAINTENANCE_DESCRIPTION.infoText
                }
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[
                    { label: 'Annexure', fileUrl: '/files/annexure2.pdf' },
                  ]}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={
                  EQUIPMENT_FORM_FIELDS_CONFIG.CALIBRATION_DESCRIPTION.label
                }
                value={
                  formData[EQUIPMENT_FIELD_NAMES.CALIBRATION_DESCRIPTION] ?? ''
                }
                onChange={(value) =>
                  setFormData((prev) => { const updated = ({
                    ...prev,
                    [EQUIPMENT_FIELD_NAMES.CALIBRATION_DESCRIPTION]: value,
                  }); if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })
                }
                placeholder={
                  EQUIPMENT_FORM_FIELDS_CONFIG.CALIBRATION_DESCRIPTION
                    .placeholder
                }
                infoText={
                  EQUIPMENT_FORM_FIELDS_CONFIG.CALIBRATION_DESCRIPTION.infoText
                }
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[
                    { label: 'Annexure', fileUrl: '/files/annexure3.pdf' },
                  ]}
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

export default Equipment
