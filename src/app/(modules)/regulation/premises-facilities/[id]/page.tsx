"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Grid2 } from "@mui/material";
import { RichTextEditor, Label, ButtonGroup, showActionAlert } from "@/components/ui";
import { NUMBERMAP, STATUS } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import AnnexureDropdown from "@/components/modules/regulation/annexure-dropdown/AnnexureDropdown";
import {
  PREMISES_FACILITIES_FORM_LABELS,
  PREMISES_FACILITIES_FORM_PLACEHOLDERS,
} from "@/constants/modules/regulation/premisesFacilities";
import { usePremisesFacilities, useUpsertPremisesFacilities } from '@/hooks/modules/regulation/usePremisesFacilities';
import { PremisesFacilitiesData } from '@/types/modules/regulation/premisesFacilities';
import { MaintenanceProgram, NatureConstruction, VentilationSystem, WaterSystem } from "@/components/modules/regulation/PremisesInfoText";
import { ANNEXURE_LIST } from "@/constants/modules/regulation/annexure";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const PremisesFacilitiesForm: React.FC = () => {
  const params = useParams();
  const orgId = Number(params.id);
  const { data, refetch: refetchPremisesFacilities } = usePremisesFacilities(orgId, false);
  const upsertMutation = useUpsertPremisesFacilities(orgId);
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
    context_type: 'organization_site',
  })
  // Ensure all properties are correctly initialized with appropriate syntax
  const [formData, setFormData] = useState<PremisesFacilitiesData>({
    organization_site_id: orgId,
    premises_layout_with_scale: '',
    construction_finishes_fixtures: '',
    ventilation_system_description: '',
    hazardous_material_handling_areas: '',
    water_system_description: '',
    premises_preventive_maintenance_description: '',
    plant_master_file_id: undefined, // Optional
    status: undefined // Optional
  });
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchPremisesFacilities();
  }, [refetchPremisesFacilities]);

  // After setting formData, add a console log to check its state

  // Ensure data is set correctly
  useEffect(() => {
   if (data?.data){
    if(data.data.length>NUMBERMAP.ZERO){
      setFormData(data.data[NUMBERMAP.ZERO]);
    }
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    } 
  }, [data]);

  function handleSave(type: SaveType, next?: PremisesFacilitiesData) {
    const payload = next ?? formData
    if (type === 'draft') {
      draftSave({
        project_id: Number(orgId),
        form_type: 'premises_facilities',
        form_data: payload,
        timestamp: new Date().toISOString(),
      })
      return
    }
    clearDraftSave()
    upsertMutation.mutate(payload, {
      onSuccess: () => { showActionAlert(STATUS.SUCCESS); },
      onError: () => { showActionAlert(STATUS.FAILED); },
    })
  }

  useEffect(()=>{
    if(!isInitialDataLoad.current){
      handleSave('draft',formData)
    }
  },[formData])

  const handleCancel = () => {
   //cancel logic need to implemented 
  };

  // Helper function to render annexure dropdown (stubbed with static data)
  const renderAnnexureDropdown = () => (
    <Grid2 sx={STYLE5}>
      <AnnexureDropdown
        items={ANNEXURE_LIST}
      />
    </Grid2>
  )

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={PREMISES_FACILITIES_FORM_LABELS.TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PREMISES_FACILITIES_FORM_LABELS.LAYOUT_PREMISES}
                value={formData?.premises_layout_with_scale ?? ""}
                onChange={(value) => setFormData(prev =>{ const updated = { ...prev, premises_layout_with_scale: value }; return updated; })}
                placeholder={PREMISES_FACILITIES_FORM_PLACEHOLDERS.INPUT_TEXT}
              />
              {renderAnnexureDropdown()}
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PREMISES_FACILITIES_FORM_LABELS.NATURE_CONSTRUCTION}
                value={formData?.construction_finishes_fixtures ?? ""}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, construction_finishes_fixtures: value }; return updated; })}
                placeholder={PREMISES_FACILITIES_FORM_PLACEHOLDERS.INPUT_TEXT}
                infoText={NatureConstruction}
              />
              {renderAnnexureDropdown()}
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PREMISES_FACILITIES_FORM_LABELS.VENTILATION_SYSTEM}
                value={formData?.ventilation_system_description ?? ""}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, ventilation_system_description: value }; return updated; })}
                placeholder={PREMISES_FACILITIES_FORM_PLACEHOLDERS.INPUT_TEXT}
                infoText={VentilationSystem}
              />
              {renderAnnexureDropdown()}
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PREMISES_FACILITIES_FORM_LABELS.TOXIC_MATERIALS}
                value={formData?.hazardous_material_handling_areas ?? ""}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, hazardous_material_handling_areas: value }; return updated; })}
                placeholder={PREMISES_FACILITIES_FORM_PLACEHOLDERS.INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PREMISES_FACILITIES_FORM_LABELS.WATER_SYSTEM}
                value={formData?.water_system_description ?? ""}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, water_system_description: value }; return updated; })}
                placeholder={PREMISES_FACILITIES_FORM_PLACEHOLDERS.INPUT_TEXT}
                infoText={WaterSystem}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PREMISES_FACILITIES_FORM_LABELS.MAINTENANCE_PROGRAM}
                value={formData?.premises_preventive_maintenance_description ?? ""}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, premises_preventive_maintenance_description: value }; return updated; })}
                placeholder={PREMISES_FACILITIES_FORM_PLACEHOLDERS.INPUT_TEXT}
                infoText={MaintenanceProgram}
              />
            </Grid2>
          </Grid2>
          <ButtonGroup
            buttons={[
              {
                label: PREMISES_FACILITIES_FORM_LABELS.CANCEL,
                onClick: handleCancel,
              },
              {
                label: PREMISES_FACILITIES_FORM_LABELS.SAVE,
                onClick: () => handleSave('final'),
              },
            ]}
          />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default PremisesFacilitiesForm;
