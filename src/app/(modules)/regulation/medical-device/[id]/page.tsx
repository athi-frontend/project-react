'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Box, Grid2 } from '@mui/material'
import { RichTextEditor, Label, ButtonGroup } from '@/components/ui'
import { NUMBERMAP, BUTTON_LABEL } from '@/constants/common'
import { ButtonContainer } from '@/styles/components/ui/button'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import {
  MEDICAL_LABEL,
  MEDICAL_PLACEHOLDER,
  MEDICAL_FORM_TITLE,
} from '@/constants/modules/regulation/medicalDevice'
import {
  useFetchMedicalDeviceComplaints,
  usePostMedicalDeviceComplaints,
} from '@/hooks/modules/regulation/useMedicalDevices'
import { useParams } from 'next/navigation'
import { MedicalDeviceFormData } from '@/types/modules/regulation/medicalDevice'
import MedicalDeviceHandleSafety from '@/components/modules/regulation/medicalDeviceHandleSafety'
import MedicalDeviceFieldSafety from '@/components/modules/regulation/medicalDeviceFieldSafety'
import { FLEX_ROW } from '@/styles/modules/regulation/executiveSummary'
import { InputLabel } from '@/styles/components/ui/input'
import InfoHover from '@/components/ui/info-hover/InfoHover'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const MedicalDeviceComplaintsForm: React.FC = () => {
  const params = useParams()
  const organizationSiteId = Number(params.id)
  const { data, refetch: refetchMedicalDevice } = useFetchMedicalDeviceComplaints(organizationSiteId, false)
  const { mutate: postMutation, isPending } = usePostMedicalDeviceComplaints()
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
    context_type: 'organization_site'
  })

  const [formData, setFormData] = useState<MedicalDeviceFormData>({
    handling_complaints: '',
    handling_field_safety_action: '',
  })
  const isInitialDataLoad = useRef(true)

  // Trigger API call on component mount
  useEffect(() => {
    refetchMedicalDevice();
  }, [refetchMedicalDevice]);

  useEffect(() => {
    if (data?.data) {
      setFormData(data.data[NUMBERMAP.ZERO])
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [data])

  function handleSave(type: SaveType, next?: MedicalDeviceFormData) {
    const fd = next ?? formData
    const payload = {
      organization_site_id: organizationSiteId,
      handling_complaints: fd.handling_complaints,
      handling_field_safety_action: fd.handling_field_safety_action,
    }
    if (type === 'draft') {
      draftSave({
        project_id: Number(organizationSiteId),
        form_type: 'medical_device_complaints',
        form_data: payload,
        timestamp: new Date().toISOString(),
      })
      return
    }
    clearDraftSave()
    postMutation(payload)
  }

  const handleCancel = () => {}

  const buttonConfig = [
    { label: BUTTON_LABEL.CANCEL, onClick: handleCancel },
    { label: BUTTON_LABEL.SAVE, onClick: () => handleSave('final'), disabled: isPending },
  ]

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={MEDICAL_FORM_TITLE} />
        <FormContent>
             <Grid2 container spacing={NUMBERMAP.TWO}>
            
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
               <Box sx={FLEX_ROW}>
                <InputLabel>{MEDICAL_LABEL.HANDLING_LABEL}</InputLabel><InfoHover infoText={MedicalDeviceHandleSafety}/>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
             <Box sx={FLEX_ROW}>
                <InputLabel>{MEDICAL_LABEL.SAFETY_LABEL}</InputLabel><InfoHover infoText={MedicalDeviceFieldSafety}/>
              </Box>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO}>

            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={''}
                value={formData?.handling_complaints ?? ''}
                onChange={(value) =>
                  setFormData((prev) => { const updated = ({
                    ...prev,
                    handling_complaints: value,
                  }); if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })
                }
                placeholder={MEDICAL_PLACEHOLDER.HANDLING}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={''}
                value={formData?.handling_field_safety_action ?? ''}
                onChange={(value) =>
                  setFormData((prev) => { const updated = ({
                    ...prev,
                    handling_field_safety_action: value,
                  }); if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })
                }
                placeholder={MEDICAL_PLACEHOLDER.SAFETY}
              />
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

export default MedicalDeviceComplaintsForm
