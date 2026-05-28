"use client";
import React, { useEffect, useState, useRef } from "react";
import { Grid2 } from "@mui/material";
import { RichTextEditor, Label, ButtonGroup, showActionAlert } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { ButtonContainer } from "@/styles/components/ui/button";
import { PRODUCT_LIFE_DECLARATION } from "@/constants/modules/dnd/productLifeDeclaration";
import StorageInfo from "@/components/modules/regulation/storageInfo";
import { STORAGE_LABELS } from "@/constants/modules/regulation/storage";
import { useParams } from "next/navigation";
import { useSaveStorage, useStorage } from "@/hooks/modules/regulation/useStorage";
import { COMMON_CONSTANTS } from "@/lib/utils/common";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const StorageForm: React.FC = () => {
  const params = useParams();
  const orgId = Number(params.id);

  const { data, refetch: refetchStorage } = useStorage(orgId, false);
  const saveMutation = useSaveStorage(orgId);
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
    context_type: 'organization_site'
  })

  const [formData, setFormData] = useState({
    organization_site_id: orgId,
    storage: "",
  });
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchStorage();
  }, [refetchStorage]);

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
      storage: (next ?? formData).storage,
    }
    if (type === 'draft') {
      draftSave({
        project_id: Number(orgId),
        form_type: 'storage',
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
    { label: STORAGE_LABELS.CANCEL, onClick: handleCancel },
    { label: STORAGE_LABELS.SAVE, onClick: () => handleSave('final') }
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={STORAGE_LABELS.FORM_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={STORAGE_LABELS.POLICY_LABEL}
                value={formData.storage}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, storage: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder={PRODUCT_LIFE_DECLARATION.INPUT_TEXT}
                infoText={StorageInfo}
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

export default StorageForm;
