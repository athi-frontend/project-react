"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Grid2 } from "@mui/material";
import { RichTextEditor, Label, ButtonGroup, showActionAlert } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { ButtonContainer } from "@/styles/components/ui/button";
import {
  INTERNAL_AUDIT_SELF_INSPECTION_LABELS,
  INTERNAL_AUDIT_SELF_INSPECTION_LABEL,
  INTERNAL_AUDIT_SELF_INSPECTION_PLACEHOLDER
} from "@/constants/modules/regulation/internalAudit";
import { InternalAuditSelfInspectionPayload } from "@/types/modules/regulation/internalAudit";
import { useInternalAuditSelfInspection, useSaveInternalAuditSelfInspection } from "@/hooks/modules/regulation/useInternalAudit";
import { COMMON_CONSTANTS } from '@/lib/utils/common';
import InternalAuditInfo from "@/components/modules/regulation/internalAuditInfo";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const InternalAuditForm: React.FC = () => {
  const params = useParams();
  const orgId = Number(params.id);

  const { data, refetch: refetchInternalAudit } = useInternalAuditSelfInspection(orgId, false);
  const saveMutation = useSaveInternalAuditSelfInspection(orgId);
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
    context_type: 'organization_site'
  })

  const [formData, setFormData] = useState<InternalAuditSelfInspectionPayload>({
    organization_site_id: orgId,
    internal_audit_description: "",
  });
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchInternalAudit();
  }, [refetchInternalAudit]);

  useEffect(() => {
    if (data?.data) {
      if(data.data[NUMBERMAP.ZERO]){
      setFormData(data.data[NUMBERMAP.ZERO]);
      }
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [data]);

  function handleSave(type: SaveType, next?: InternalAuditSelfInspectionPayload) {
    const payload = {
      organization_site_id: (next ?? formData).organization_site_id,
      internal_audit_description: (next ?? formData).internal_audit_description,
    }
    if (type === 'draft') {
      draftSave({
        project_id: Number(orgId),
        form_type: 'internal_audit',
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
    //cancel need to be implemented
  };

  const buttonConfig = [
    { label: INTERNAL_AUDIT_SELF_INSPECTION_LABELS.CANCEL, onClick: handleCancel },
    { label: INTERNAL_AUDIT_SELF_INSPECTION_LABELS.SAVE, onClick: () => handleSave('final') }
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={INTERNAL_AUDIT_SELF_INSPECTION_LABELS.FORM_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={INTERNAL_AUDIT_SELF_INSPECTION_LABEL.DESCRIPTION_LABEL}
                value={formData.internal_audit_description}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, internal_audit_description: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder={INTERNAL_AUDIT_SELF_INSPECTION_PLACEHOLDER}
                infoText={InternalAuditInfo}
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

export default InternalAuditForm;
