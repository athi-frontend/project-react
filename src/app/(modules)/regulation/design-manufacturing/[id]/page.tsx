"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Grid2 } from "@mui/material";
import { RichTextEditor, Label, ButtonGroup, showActionAlert } from "@/components/ui";
import { NUMBERMAP, STATUS } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import AnnexureDropdown from "@/components/modules/regulation/annexure-dropdown/AnnexureDropdown";
import { useDesignManufacturing, useUpsertDesignManufacturing } from '@/hooks/modules/regulation/useDesignManufacturing';
import { useDraftSave } from '@/hooks/common/useDraftSave';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import { DESIGN_MANUFACTURING_FIELDS, DESIGN_MANUFACTURING_LABELS, DESIGN_MANUFACTURING_PLACEHOLDERS, DESIGN_MANUFACTURING_ANNEXURE } from '@/constants/modules/regulation/designManufacturing';

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final';

const DesignManufacturingForm: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const { data, refetch: refetchDesignManufacturing } = useDesignManufacturing(id, false);
  const upsertMutation = useUpsertDesignManufacturing(Number(id));
  
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave();
  
  const [formData, setFormData] = useState({
    deviceDesign: "",
    manufacturingProcess: "",
  });
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchDesignManufacturing();
  }, [refetchDesignManufacturing]);

  useEffect(() => {
    if (data?.data) {
      if (data?.data[NUMBERMAP.ZERO]) {
        setFormData({
          ...data.data[NUMBERMAP.ZERO]
        });
      }
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [data]);

  const buildPayload = (fd: typeof formData) => ({
    [DESIGN_MANUFACTURING_FIELDS.PROJECT_ID]: id,
    [DESIGN_MANUFACTURING_FIELDS.DEVICE_DESIGN]: fd.deviceDesign,
    [DESIGN_MANUFACTURING_FIELDS.MANUFACTURING_PROCESS]: fd.manufacturingProcess,
  });

  const handleSave = (type: SaveType, nextFormData?: typeof formData) => {
    if (type === 'draft') {
      const payload = nextFormData ?? formData;
      draftSave({
        project_id: Number(id),
        form_type: 'design_manufacturing',
        form_data: payload,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    clearDraftSave();
    upsertMutation.mutate(buildPayload(nextFormData ?? formData), {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS);
      },
      onError: () => {
        showActionAlert(STATUS.FAILED);
      },
    });
  };

  const handleFormDataChange = (patch: Partial<typeof formData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...patch };
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated);
      }
      return updated;
    });
  };

  const handleCancel = () => {};

  const actionButtons = [
    { label: DESIGN_MANUFACTURING_LABELS.CANCEL, onClick: handleCancel },
    { label: DESIGN_MANUFACTURING_LABELS.SAVE, onClick: () => handleSave('final') },
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={DESIGN_MANUFACTURING_LABELS.TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.FIVE}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={DESIGN_MANUFACTURING_LABELS.DEVICE_DESIGN}
                value={formData.deviceDesign}
                onChange={(value) => handleFormDataChange({ deviceDesign: value })}
                placeholder={DESIGN_MANUFACTURING_PLACEHOLDERS.INPUT_TEXT}
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown items={[DESIGN_MANUFACTURING_ANNEXURE.DEVICE_DESIGN]} />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={DESIGN_MANUFACTURING_LABELS.MANUFACTURING_PROCESS}
                value={formData.manufacturingProcess}
                onChange={(value) => handleFormDataChange({ manufacturingProcess: value })}
                placeholder={DESIGN_MANUFACTURING_PLACEHOLDERS.INPUT_TEXT}
              />
              <Grid2 sx={STYLE5}>
                <AnnexureDropdown items={[DESIGN_MANUFACTURING_ANNEXURE.MANUFACTURING_PROCESS]} />
              </Grid2>
            </Grid2>
          </Grid2>
          <ButtonGroup buttons={actionButtons} />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default DesignManufacturingForm;
