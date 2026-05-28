"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Grid2 } from "@mui/material";
import { RichTextEditor, Label, ButtonGroup, showActionAlert } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { ButtonContainer } from "@/styles/components/ui/button";
import { RISK_ANALYSIS_INFO_TEXT, RISK_ANALYSIS_LABELS } from "@/constants/modules/regulation/riskAnalysis";
import { RiskAnalysisPayload, useRiskAnalysis, useSaveRiskAnalysis } from "@/hooks/modules/regulation/useRiskAnalysis";
import { useDraftSave } from '@/hooks/common/useDraftSave';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import { COMMON_CONSTANTS } from '@/lib/utils/common';

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final';

const RiskAnalysisForm: React.FC = () => {
  const params = useParams();
  const projectId = Number(params.id);  

  const { data, refetch: refetchRiskAnalysis } = useRiskAnalysis(projectId, false);
  const saveMutation = useSaveRiskAnalysis(projectId);
  
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave();

  const [formData, setFormData] = useState<RiskAnalysisPayload>({
    project_id: projectId,
    risk_analysis: "",
  });
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchRiskAnalysis();
  }, [refetchRiskAnalysis]);

  useEffect(() => {
    if (data?.data?.[NUMBERMAP.ZERO]) {
      setFormData(
        data.data[NUMBERMAP.ZERO]);
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [data]);

  const handleSave = (type: SaveType, nextFormData?: RiskAnalysisPayload) => {
    if (type === 'draft') {
      const payload = nextFormData ?? formData;
      draftSave({
        project_id: projectId,
        form_type: 'risk_analysis',
        form_data: payload,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    clearDraftSave();
    saveMutation.mutate(
      {
        project_id: projectId,
        risk_analysis: (nextFormData ?? formData).risk_analysis,
      },
      {
        onSuccess: () => {
          showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT);
        },
        onError: () => {
          showActionAlert(COMMON_CONSTANTS.FAILED_ALERT);
        },
      }
    );
  };

  const handleFormDataChange = (patch: Partial<RiskAnalysisPayload>) => {
    setFormData(prev => {
      const updated = { ...prev, ...patch } as RiskAnalysisPayload;
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated);
      }
      return updated;
    });
  };

  const handleCancel = () => {
  };

  const buttonConfig = [
    { label: RISK_ANALYSIS_LABELS.CANCEL, onClick: handleCancel },
    { label: RISK_ANALYSIS_LABELS.SAVE, onClick: () => handleSave('final') }
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={RISK_ANALYSIS_LABELS.FORM_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={RISK_ANALYSIS_INFO_TEXT.SUMMARY_LABEL}
                value={formData?.risk_analysis ?? ""}
                onChange={(value) => handleFormDataChange({ risk_analysis: value })}
                placeholder={RISK_ANALYSIS_INFO_TEXT.PLACEHOLDER}
                infoText={RISK_ANALYSIS_INFO_TEXT.INFO}
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

export default RiskAnalysisForm;
