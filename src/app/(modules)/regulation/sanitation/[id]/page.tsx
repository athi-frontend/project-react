"use client";
import React, { useEffect, useState, useRef } from "react";
import { Grid2 } from "@mui/material";
import { RichTextEditor, Label, ButtonGroup, showActionAlert } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { ButtonContainer } from "@/styles/components/ui/button";
import SanitationInfoText from "@/components/modules/regulation/SanitationInfoText";
import { useParams } from "next/navigation";
import { SANITATION_LABELS } from "@/constants/modules/regulation/sanitation";
import { useSanitation, useSaveSanitation } from "@/hooks/modules/regulation/useSanitation";
import { COMMON_CONSTANTS } from "@/lib/utils/common";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const SanitationForm: React.FC = () => {
  const params = useParams();
  const orgId = Number(params.id);

  const { data, refetch: refetchSanitation } = useSanitation(orgId, false);
  const saveMutation = useSaveSanitation(orgId);
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
    context_type: 'organization_site'
  })

  const [formData, setFormData] = useState({
    organization_site_id: orgId,
    sanitation: "",
  }); 
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchSanitation();
  }, [refetchSanitation]);

  useEffect(() => {
    if (data?.data) {
      if (data?.data[NUMBERMAP.ZERO]) {
        setFormData(data.data[NUMBERMAP.ZERO]);
      }
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [data]);

  function handleSave(type: SaveType, next?: typeof formData) {
    const payload = {
      organization_site_id: (next ?? formData).organization_site_id,
      sanitation: (next ?? formData).sanitation,
    }
    if (type === 'draft') {
      draftSave({
        project_id: Number(orgId),
        form_type: 'sanitation',
        form_data: payload,
        timestamp: new Date().toISOString(),
      })
      return
    }
    clearDraftSave()
    saveMutation.mutate(payload, {
      onSuccess: () => {
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
      },
      onError: () => {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      },
    })
  }
  
    const handleCancel = () => {
      // Implement cancel functionality
    };
  const buttonConfig = [
    { label: SANITATION_LABELS.CANCEL, onClick: handleCancel },
    { label: SANITATION_LABELS.SAVE, onClick: () => handleSave('final') }
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={SANITATION_LABELS.FORM_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={SANITATION_LABELS.FORM_TITLE}
                value={formData.sanitation}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, sanitation: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder="Input Text"
                infoText={SanitationInfoText}
              />
            </Grid2>
          </Grid2>
          <ButtonContainer>
            <ButtonGroup buttons={buttonConfig} />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default SanitationForm;
