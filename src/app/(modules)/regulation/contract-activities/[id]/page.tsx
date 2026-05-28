"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Grid2 } from "@mui/material";
import { RichTextEditor, Label, showActionAlert } from "@/components/ui";
import { NUMBERMAP, WORKFLOW_ACTIONS } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { ButtonContainer } from "@/styles/components/ui/button";
import { CONTRACT_ACTIVITIES_LABEL, CONTRACT_ACTIVITIES_LABELS, CONTRACT_ACTIVITIES_PLACEHOLDER } from "@/constants/modules/regulation/contractActivities";
import { ContractActivitiesPayload, useContractActivities, useSaveContractActivities } from "@/hooks/modules/regulation/useContractActivities";
import { COMMON_CONSTANTS } from '@/lib/utils/common';
import ContractActivitiesInfo from "@/components/modules/regulation/contractActivitiesInfo";
import { RegulationReviewerModalManager } from "@/components/modules/regulation/reviewer-modal";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const ContractActivitiesForm: React.FC = () => {
  const params = useParams();
  const orgId = Number(params.id);

  const { data, refetch, error } = useContractActivities(orgId, false);
  const saveMutation = useSaveContractActivities(orgId);
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
     context_type: 'organization_site',
  })
  const [hasEditPermission, setHasEditPermission] = useState(false);

  const [formData, setFormData] = useState<ContractActivitiesPayload>({
    organization_site_id: orgId,
    contract_activities: "",
  });
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

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

  function handleSave(type: SaveType = 'final', next?: ContractActivitiesPayload) {
    const payload = {
      organization_site_id: (next ?? formData).organization_site_id,
      contract_activities: (next ?? formData).contract_activities,
    }
    if (type === 'draft') {
      draftSave({
        project_id: Number(orgId),
        form_type: 'contract_activities',
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
  };

  const handleCancel = () => {
    //cancel functionality need to be implemented
  };

  // Get permissions from API response and ensure view permission exists
  const apiPermissions = data?.meta_info?.action_control?.permissions ?? [];
  const permissions = apiPermissions.length > NUMBERMAP.ZERO && !apiPermissions.some(p => p.action === 'view') 
    ? [{ action: 'view' }, ...apiPermissions] 
    : apiPermissions;

  // Check if only Cancel button is available (no edit permissions)
  const hasOnlyCancelButton = permissions.length === NUMBERMAP.ONE && permissions.some(p => p.action === WORKFLOW_ACTIONS.CANCEL);
  const taskInfo = {
    task_comments: data?.meta_info?.task_info?.task_comments ?? [],
    reviewer_list: data?.meta_info?.task_info?.reviewer_list ?? []
  };

  // Simple error handling to prevent crash
  if (error) {
    return <div>API Error: {error.message}</div>;
  }

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={CONTRACT_ACTIVITIES_LABELS.FORM_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={CONTRACT_ACTIVITIES_LABEL.DESCRIPTION_LABEL}
                value={formData.contract_activities}
                onChange={(value) => {
                  if (hasEditPermission) {
                    setFormData((prev: any) => {
                      const updated = { ...prev, contract_activities: value };
                      if (!isInitialDataLoad.current) {
                        handleSave('draft', updated);
                      }
                      return updated;
                    });
                  }
                }}
                placeholder={CONTRACT_ACTIVITIES_PLACEHOLDER}
                infoText={ContractActivitiesInfo}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>
          <ButtonContainer>
            <RegulationReviewerModalManager
              isLoading={!data}
              permissions={permissions}
              taskInfo={taskInfo}
              menuId={data?.meta_info?.action_control?.menuId}
              menuName={data?.meta_info?.action_control?.formName}
                  contextType="plant_master"
              contextId={orgId}
              userId={orgId.toString()}
              organizationSiteId={orgId.toString()}
              onPermissionChange={(permission) => {
                // If only Cancel button is available, user should not be allowed to edit
                setHasEditPermission(permission && !hasOnlyCancelButton);
              }}
              refetch={refetch}
              customHandlers={{
                handleSave,
                handleCancel,
                isDisabled: !hasEditPermission
              }}
            />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default ContractActivitiesForm;
