"use client";
import React, { useEffect, useState, useRef } from "react";
import { Grid2 } from "@mui/material";
import { RichTextEditor, Label, ButtonGroup, showActionAlert } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { ButtonContainer } from "@/styles/components/ui/button";
import { PRODUCTION_LABELS } from "@/constants/modules/regulation/production";
import { useParams } from "next/navigation";
import { useProduction, useSaveProduction } from "@/hooks/modules/regulation/useProduction";
import { COMMON_CONSTANTS } from "@/lib/utils/common";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { ProductionHandlingMaterials, ProductionOperations, ProductionProcessValidation, ProductionRejectedMaterials, ProductionReproccessingArrangements, ProductionSterilizationFaciliy } from "@/components/modules/regulation/ProductionInfoText";

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const ProductionForm: React.FC = () => {
  const params = useParams();
  const orgId = Number(params.id);

  const { data, refetch: refetchProduction } = useProduction(orgId, false);
  const saveMutation = useSaveProduction(orgId);
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
    context_type: 'organization_site'
  })

  const [formData, setFormData] = useState({
    organization_site_id: orgId,
    production_operations_description: "",
    meterial_handling_arrangement: "",
    reprocessing_rework_arrangement: "",
    rejected_materials_handling: "",
    process_validation_policy: "",
    sterilization_facility_description: "",
  });
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchProduction();
  }, [refetchProduction]);

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

  function handleSave(type: SaveType, next?: typeof formData) {
    const fd = next ?? formData
    const payload = {
      organization_site_id: fd.organization_site_id,
      production_operations_description: fd.production_operations_description,
      meterial_handling_arrangement: fd.meterial_handling_arrangement,
      reprocessing_rework_arrangement: fd.reprocessing_rework_arrangement,
      rejected_materials_handling: fd.rejected_materials_handling,
      process_validation_policy: fd.process_validation_policy,
      sterilization_facility_description: fd.sterilization_facility_description,
    }
    if (type === 'draft') {
      draftSave({
        project_id: Number(orgId),
        form_type: 'production',
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
    { label: PRODUCTION_LABELS.CANCEL, onClick: handleCancel },
    { label: PRODUCTION_LABELS.SAVE, onClick: () => handleSave('final') }
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={PRODUCTION_LABELS.FORM_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PRODUCTION_LABELS.FIELD_ONE}
                value={formData.production_operations_description}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, production_operations_description: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder="Input Text"
                infoText={ProductionOperations}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PRODUCTION_LABELS.FIELD_TWO}
                value={formData.meterial_handling_arrangement}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, meterial_handling_arrangement: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder="Input Text"
                infoText={ProductionHandlingMaterials}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PRODUCTION_LABELS.FIELD_THREE}
                value={formData.reprocessing_rework_arrangement}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, reprocessing_rework_arrangement: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder="Input Text"
                infoText={ProductionReproccessingArrangements}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PRODUCTION_LABELS.FIELD_FOUR}
                value={formData.rejected_materials_handling}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, rejected_materials_handling: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder="Input Text"
                infoText={ProductionRejectedMaterials}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PRODUCTION_LABELS.FIELD_FIVE}
                value={formData.process_validation_policy}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, process_validation_policy: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder="Input Text"
                infoText={ProductionProcessValidation}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PRODUCTION_LABELS.FIELD_SIX}
                value={formData.sterilization_facility_description}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, sterilization_facility_description: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder="Input Text"
                infoText={ProductionSterilizationFaciliy}
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

export default ProductionForm;
