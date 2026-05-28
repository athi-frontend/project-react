"use client";
import React, { useEffect, useState, useRef } from "react";
import { Grid2 } from "@mui/material";
import { ButtonGroup, RichTextEditor, Label, showActionAlert } from "@/components/ui";
import { InputLabel } from '@/styles/components/ui/input';
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import AnnexureDropdown from "@/components/modules/regulation/annexure-dropdown/AnnexureDropdown";
import { useParams } from 'next/navigation';
import { useRegulationLabelling, useUpsertRegulationLabelling } from '@/hooks/modules/regulation/useRegulationLabelling';
import { useDraftSave } from '@/hooks/common/useDraftSave';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import { LABELLING_API_FIELDS, INITIAL_LABELLING_FORM_DATA, LabellingFormData, LABELLING_PAGE_TEXT } from '@/constants/modules/regulation/labelling';
import { STATUS, NUMBERMAP } from '@/constants/common';
import { Value } from "@/styles/components/modules/projectInfo";

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final';

const LabellingForm: React.FC = () => {
  const params = useParams();
  const projectId = params.id as string;

  const { data, refetch: refetchLabelling } = useRegulationLabelling(projectId, false);
  const upsertMutation = useUpsertRegulationLabelling();
  
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave();

  const [formData, setFormData] = useState<LabellingFormData>(INITIAL_LABELLING_FORM_DATA);
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchLabelling();
  }, [refetchLabelling]);

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

  const buildPayload = (fd: LabellingFormData) => ({
    [LABELLING_API_FIELDS.PROJECT_ID]: Number(projectId),
    [LABELLING_API_FIELDS.PRODUCT_LABELS]: fd.product_labels,
    [LABELLING_API_FIELDS.UTILITY_TYPE_LABELS]: fd.utility_type_lables,
    [LABELLING_API_FIELDS.PRODUCT_BROCHURE]: fd.product_brochure,
  });

  const handleSave = (type: SaveType, nextFormData?: LabellingFormData) => {
    if (type === 'draft') {
      const payload = buildPayload(nextFormData ?? formData);
      draftSave({
        project_id: Number(projectId),
        form_type: 'labelling',
        form_data: payload,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    clearDraftSave();
    const payload = buildPayload(nextFormData ?? formData);
    upsertMutation.mutate(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS);
      },
      onError: () => {
        showActionAlert(STATUS.FAILED);
      },
    });
  };

  const handleFormDataChange = (patch: Partial<LabellingFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...patch } as LabellingFormData;
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated);
      }
      return updated;
    });
  };

  const handleCancel = () => {};

  const actionButtons = [
    { label: LABELLING_PAGE_TEXT.cancel, onClick: handleCancel },
    { label: LABELLING_PAGE_TEXT.save, onClick: () => handleSave('final') },
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={LABELLING_PAGE_TEXT.title} />
        <FormContent>
          <InputLabel>{LABELLING_PAGE_TEXT.copyOfOriginalLabel}</InputLabel>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={LABELLING_PAGE_TEXT.productLabels}
                value={formData.product_labels}
                onChange={(value) => handleFormDataChange({ product_labels: value })}
                placeholder={LABELLING_PAGE_TEXT.inputText}
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[{ label: LABELLING_PAGE_TEXT.annexureLabel, fileUrl: LABELLING_PAGE_TEXT.annexureFileUrl }]}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={LABELLING_PAGE_TEXT.accessoryLabels}
                value={formData.utility_type_lables}
                onChange={(value) => handleFormDataChange({ utility_type_lables: value })}
                placeholder={LABELLING_PAGE_TEXT.inputText}
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[{ label: LABELLING_PAGE_TEXT.annexureLabel, fileUrl: LABELLING_PAGE_TEXT.annexureFileUrl }]}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={LABELLING_PAGE_TEXT.productBrochure}
                value={formData.product_brochure}
                onChange={(value) => handleFormDataChange({ product_brochure: value })}
                placeholder={LABELLING_PAGE_TEXT.inputText}
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown
                  items={[{ label: LABELLING_PAGE_TEXT.annexureLabel, fileUrl: LABELLING_PAGE_TEXT.annexureFileUrl }]}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
               <InputLabel>{LABELLING_PAGE_TEXT.instructionsForUse}</InputLabel>
                <Value variant="body1">{formData.instruction_of_use?.trim() ? formData.instruction_of_use : '-'}</Value>
            </Grid2>
          </Grid2>
          <ButtonGroup buttons={actionButtons} />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default LabellingForm;
