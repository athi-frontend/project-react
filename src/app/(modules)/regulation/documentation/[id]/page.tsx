"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Grid2 } from "@mui/material";
import { RichTextEditor, Label, ButtonGroup, showActionAlert } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { ButtonContainer } from "@/styles/components/ui/button";
import { DOCUMENTATION_LABEL, DOCUMENTATION_LABELS, DOCUMENTATION_PLACEHOLDER } from "@/constants/modules/regulation/documentation";
import { DocumentationPayload, useDocumentation, useSaveDocumentation } from "@/hooks/modules/regulation/useDocumentation";
import { COMMON_CONSTANTS } from '@/lib/utils/common';
import DocumentationInfo from "@/components/modules/regulation/documentationInfo";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const DocumentationForm: React.FC = () => {
  const params = useParams();
  const orgId = Number(params.id);

  const { data, refetch: refetchDocumentation } = useDocumentation(orgId, false);
  const saveMutation = useSaveDocumentation(orgId);
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
    context_type: 'organization_site'
  })

  const [formData, setFormData] = useState<DocumentationPayload>({
    organization_site_id: orgId,
    documentation: "",
  });
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchDocumentation();
  }, [refetchDocumentation]);
  
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

  function handleSave(type: SaveType, next?: DocumentationPayload) {
    const payload = {
      organization_site_id: (next ?? formData).organization_site_id,
      documentation: (next ?? formData).documentation,
    }
    if (type === 'draft') {
      draftSave({
        project_id: Number(orgId),
        form_type: 'documentation',
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
    { label: DOCUMENTATION_LABELS.CANCEL, onClick: handleCancel },
    { label: DOCUMENTATION_LABELS.SAVE, onClick: () => handleSave('final') }
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={DOCUMENTATION_LABELS.FORM_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={DOCUMENTATION_LABEL.ARRANGEMENT_LABEL}
                value={formData.documentation}
                onChange={(value) => setFormData((prev: any) => { const updated = { ...prev, documentation: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder={DOCUMENTATION_PLACEHOLDER}
                infoText={DocumentationInfo}
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

export default DocumentationForm;
