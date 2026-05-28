"use client"
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useParams, useRouter } from 'next/navigation';
import { StyledTabs, StyledTab } from '@/styles/modules/risk-management/riskLevelDefinition';
import { InputField, Label, showActionAlert, ButtonGroup } from '@/components/ui';
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import AssemblyTreeView from '@/components/modules/dnd/bill-of-material/AssemblyTreeView';
import { useBillOfMaterial, useModelOptions, useVersionOptions, usePublishBillOfMaterial } from '@/hooks/modules/dnd/useBOM';
import {
  bomTabsContainerSx,
  bomButtonContainerSx,
  bomTreeContainerSx,
} from '@/styles/modules/dnd/billOfMaterial';
import { NUMBERMAP, STATUS, BUTTON_LABEL } from '@/constants/common';
import {
  PAGE_TITLES,
  TAB_LABELS,
  BOM_PAGE_FORM_LABELS,
  BOM_PAGE_FORM_PLACEHOLDERS,
  BOM_PAGE_BUTTON_LABELS,
  BOM_PAGE_ARIA_LABELS,
  BOM_PAGE_TAB_IDS,
  BOM_PAGE_TAB_PANEL_IDS,
  BOM_PAGE_FORM_FIELDS,
  BOM_PAGE_FIELD_LABEL_MAP,
  BOM_PAGE_FIELD_ORDER,
  VALIDATION_MESSAGES,
} from '@/constants/modules/dnd/bom';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';
import TabPanel from '@/components/modules/dnd/bill-of-material/TabPanel';
import UploadBomDetail from '@/components/modules/dnd/bill-of-material/UploadBomDetail';
import ManagePartsDetail from '@/components/modules/dnd/bill-of-material/ManagePartsDetail';
import GlobalLoader from '@/components/shared/LoadingSpinner';
import { ROUTE_PATHS } from '@/constants/modules/dnd/project';

const BillOfMaterialPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);
  const { data: modelsResp, isLoading: isModelsLoading } = useModelOptions(projectId);
  const { data: versionsResp, isLoading: isVersionsLoading } = useVersionOptions(projectId);
  const { mutate: publishMutation, isPending: isPublishing } = usePublishBillOfMaterial();
  const [activeTab, setActiveTab] = useState(NUMBERMAP.ZERO);
  const [modelNo, setModelNo] = useState('');
  const [versionNo, setVersionNo] = useState('');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productId, setProductId] = useState<number | undefined>(undefined);
  
  // Update productId when modelNo changes
  useEffect(() => {
    if (modelNo && modelsResp?.data) {
      const selectedModel = modelsResp.data.find((m: any) => m.product_variant_id?.toString() === modelNo);
      setProductId(selectedModel?.product_id);
    } else {
      setProductId(undefined);
    }
  }, [modelNo]);
  
  // Only fetch BOM data when a model is selected and productId is available
  const { data: bomApi, isLoading: isBomLoading } = useBillOfMaterial(productId, !!productId);
  
  // Comprehensive loading state function
  const isLoading = () => {
    if (isModelsLoading) return true;
    if (isVersionsLoading) return true;
    if (isBomLoading) return true;
    if (isPublishing) return true;
    return false;
  };


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue !== NUMBERMAP.TWO) {
      setSelectedPartId(null);
    }
  };

  const handlePartClick = (partId: string) => {
    setSelectedPartId(partId);
    setActiveTab(NUMBERMAP.TWO);
  };
  const handleBack = () => { router.push(ROUTE_PATHS.DND_PROJECT_LIST); };
  
  const validateForm = (): boolean => {
    const formValues = {
      modelNo,
      versionNo,
    };
    
    const isValid = validateAndFocusFirstEmptyField(
      formValues,
      BOM_PAGE_FIELD_ORDER,
      BOM_PAGE_FIELD_LABEL_MAP
    );
    
    if (!isValid) {
      // Set errors for empty fields
      const newErrors: Record<string, string> = {};
      if (!modelNo) {
        newErrors.modelNo = VALIDATION_MESSAGES.FIELD_REQUIRED(BOM_PAGE_FORM_LABELS.MODEL_NO);
      }
      if (!versionNo) {
        newErrors.versionNo = VALIDATION_MESSAGES.FIELD_REQUIRED(BOM_PAGE_FORM_LABELS.VERSION_NO);
      }
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };
  
  const handlePublish = () => {
    if (!validateForm()) {
      return;
    }
    
    publishMutation({
      product_id: productId,
      project_id: projectId
    }, {
      onSuccess: () => showActionAlert(STATUS.SUCCESS),
      onError: () => showActionAlert(STATUS.FAILED),
    });
  };

  return (
    <FormContainer sx={{ padding: NUMBERMAP.ZERO }}>
      <GlobalLoader loading={isLoading()} />
      <FormWrapper>
        <Label title={PAGE_TITLES.BILL_OF_MATERIAL} />
        <FormContent>
          {/* Tabs Navigation */}
          <Box sx={bomTabsContainerSx}>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label={BOM_PAGE_ARIA_LABELS.BILL_OF_MATERIAL_TABS}
            >
              <StyledTab label={TAB_LABELS.ASSEMBLY_TREE} id={BOM_PAGE_TAB_IDS.ASSEMBLY_TREE} aria-controls={BOM_PAGE_TAB_PANEL_IDS.ASSEMBLY_TREE} />
              <StyledTab label={TAB_LABELS.UPLOAD_BOM} id={BOM_PAGE_TAB_IDS.UPLOAD_BOM} aria-controls={BOM_PAGE_TAB_PANEL_IDS.UPLOAD_BOM} />
              <StyledTab label={TAB_LABELS.MANAGE_PARTS} id={BOM_PAGE_TAB_IDS.MANAGE_PARTS} aria-controls={BOM_PAGE_TAB_PANEL_IDS.MANAGE_PARTS} />
            </StyledTabs>
          </Box>
          <TabPanel value={activeTab} index={NUMBERMAP.ZERO}>
            <Grid2 container spacing={NUMBERMAP.TWO} sx={{ mb: NUMBERMAP.TWO }}>
              <Grid2 size={{ md: NUMBERMAP.SIX }}>
                <InputField
                  label={BOM_PAGE_FORM_LABELS.MODEL_NO}
                  placeholder={BOM_PAGE_FORM_PLACEHOLDERS.SELECT_MODEL_NO}
                  isDropdown
                  keyField={BOM_PAGE_FORM_FIELDS.PRODUCT_VARIANT_ID}
                  valueField={BOM_PAGE_FORM_FIELDS.MODEL_NAME}
                  value={modelNo}
                  onChange={(value: string) => setModelNo(value)}
                  options={modelsResp?.data ?? []}
                  error={errors.modelNo ?? ''}
                />
              </Grid2>
              <Grid2 size={{ md: NUMBERMAP.SIX }}>
                <InputField
                  label={BOM_PAGE_FORM_LABELS.VERSION_NO}
                  placeholder={BOM_PAGE_FORM_PLACEHOLDERS.SELECT_VERSION_NO}
                  isDropdown
                  keyField={BOM_PAGE_FORM_FIELDS.ID}
                  valueField={BOM_PAGE_FORM_FIELDS.VALUE}
                  value={versionNo}
                  onChange={(value: string) => setVersionNo(value)}
                  options={(versionsResp?.data ?? []).map((v: string) => ({ id: v, value: v }))}
                  error={errors.versionNo ?? ''}
                />
              </Grid2>
            </Grid2>
            {productId && bomApi?.data?.[NUMBERMAP.ZERO]?.parts && (
              <Box sx={bomTreeContainerSx}>
                <AssemblyTreeView apiData={bomApi} onPartClick={handlePartClick} />
              </Box>
            )}
            <Box sx={bomButtonContainerSx}>
              <ButtonGroup
                buttons={[
                  {
                    label: BUTTON_LABEL.BACK,
                    onClick: handleBack,
                    variant: 'outlined',
                  },
                  {
                    label: BOM_PAGE_BUTTON_LABELS.PUBLISH,
                    onClick: handlePublish,
                    variant: 'contained',
                  },
                ]}
              />
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={NUMBERMAP.ONE}>
            <UploadBomDetail
              projectId={projectId}
            />
          </TabPanel>
          <TabPanel value={activeTab} index={NUMBERMAP.TWO}>
            <ManagePartsDetail
              projectId={projectId}
              productId={Number(productId)}
              initialPartId={selectedPartId}
              onCancel={() => {
                setSelectedPartId(null);
              }}
            />
          </TabPanel>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default BillOfMaterialPage;
