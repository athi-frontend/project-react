"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { Grid2, Box, Button } from "@mui/material";
import { RichTextEditor, InputField, DataGridTable, Label, ActionButton } from "@/components/ui";
import { GridColDef } from "@mui/x-data-grid";
import { NUMBERMAP, WORKFLOW_ACTIONS } from "@/constants/common";
import { InputLabel } from '@/styles/components/ui/input';
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import InfoHover from "@/components/ui/info-hover/InfoHover";
import AnnexureDropdown from "@/components/modules/regulation/annexure-dropdown/AnnexureDropdown";
import AddIcon from '@mui/icons-material/Add';
import { ICON_SIZE } from '@/styles/common';
import SubHeader from "@/components/modules/regulation/executive-summary/SubHeader";
import { ButtonContainer } from "@/styles/components/ui/button";
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
import { INFO_TEXT, SECTION_TITLES, ModalType, UI_STRINGS, STATUS_SUCCESS, STATUS_FAILED, DIRECT_CONTACT_VERIFICATION, INDIRECT_CONTACT_VERIFICATION, BIOCOMPATIBLE_TEST_RESULTS, MATERIAL_CONTACT, MATERIAL_NON_CONTACT, BIOCOMPATIBILITY_TEST, FIELD_KEYS, FORM_FIELDS, BUTTON_VARIANT_OUTLINED, DATA_GRID_ID_FIELD, INITIAL_VERIFICATION_VALIDATION_DATA, PLACEHOLDER_BIOCOMPATIBILITY, VALIDATION_ERRORS, MODAL_TITLES } from '@/constants/modules/regulation/verificationValidation';
import { MaterialEditData, BiocompatibilityTestEditData, VerificationValidationData } from '@/types/modules/regulation/verificationValidation';
import { BoxContainer } from "@/styles/modules/regulation/executiveSummary";
import CommonModal from '@/components/ui/common-modal/CommonModal';
import MaterialContactModal from "@/components/modules/regulation/material-contact-modal/MaterialContactModal";
import MaterialNonContactModal from "@/components/modules/regulation/material-non-contact-modal/MaterialNonContactModal";
import BiocompatibilityTestModal from "@/components/modules/regulation/biocompatibility-test-modal/BiocompatibilityTestModal";
import { usePostVerificationValidation, useVerificationValidation } from "@/hooks/modules/regulation/useVerificationValidation";
import { useDraftSave } from '@/hooks/common/useDraftSave';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import { RegulationReviewerModalManager } from "@/components/modules/regulation/reviewer-modal";

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final';

type EditingItem = (MaterialEditData & { type: ModalType }) | (BiocompatibilityTestEditData & { type: ModalType }) | null;

const VerificationValidationPage: React.FC = () => {
  const params = useParams();
  const project_id = Number(params.id);
  const { data, refetch: refetchVerificationValidation } = useVerificationValidation(project_id, false);
  const { mutate: postVerificationValidation } = usePostVerificationValidation();
  
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave();

  const [formData, setFormData] = useState<VerificationValidationData>(INITIAL_VERIFICATION_VALIDATION_DATA);
  const isInitialDataLoad = useRef(true);
  const [materialContactModal, setMaterialContactModal] = useState(false);
  const [materialNonContactModal, setMaterialNonContactModal] = useState(false);

  // Trigger API call on component mount
  useEffect(() => {
    refetchVerificationValidation();
  }, [refetchVerificationValidation]);
  const [biocompatibilityTestModal, setBiocompatibilityTestModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem>(null);

  const [materialContactForm, setMaterialContactForm] = useState({ partName: '', material: '' });
  const [materialContactErrors, setMaterialContactErrors] = useState<Record<string, string>>({});
  const [materialNonContactForm, setMaterialNonContactForm] = useState({ partName: '', material: '' });
  const [materialNonContactErrors, setMaterialNonContactErrors] = useState<Record<string, string>>({});
  const [biocompatibilityForm, setBiocompatibilityForm] = useState({ stdRef: '', scopeOfStudy: '', result: '' });
  const [biocompatibilityErrors, setBiocompatibilityErrors] = useState<Record<string, string>>({});
  const [hasEditPermission, setHasEditPermission] = useState(false);

  function ensureIds<T extends { id?: string }>(arr: T[] = []): T[] {
    return (arr || []).map((item) => ({ ...item, id: item.id || crypto.randomUUID() }));
  }

  useEffect(() => {
    if (data?.data) {
      if (data?.data[NUMBERMAP.ZERO] && formData === INITIAL_VERIFICATION_VALIDATION_DATA) {
        const apiData = data.data[NUMBERMAP.ZERO];
        const patchedData = {
          ...apiData,
          general: apiData.general ?? '',
          biocompatibility: apiData.biocompatibility ?? '',
          biocompatibility_test_report: apiData.biocompatibility_test_report ?? '',
          biological_evaluation: apiData.biological_evaluation ?? '',
          medicinal_substances: apiData.medicinal_substances ?? '',
          biological_safety: apiData.biological_safety ?? '',
          sterile_eto_method: apiData.sterile_eto_method ?? '',
          software_verification: apiData.software_verification ?? '',
          animal_studies: apiData.animal_studies ?? '',
          stability_data: apiData.stability_data ?? '',
          main_unit: apiData.main_unit ?? '',
          utility_type_details: apiData.utility_type_details ?? '',
          accelerated_study_report: apiData.accelerated_study_report ?? '',
          clinical_evidance: apiData.clinical_evidance ?? '',
          post_market_surveilance_data: apiData.post_market_surveilance_data ?? '',
          direct_contact_verification: ensureIds(apiData.direct_contact_verification),
          indirect_contact_verification: ensureIds(apiData.indirect_contact_verification),
          biocompatible_test_results: ensureIds(apiData.biocompatible_test_results),
        };
        setFormData(patchedData);
      }
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [data]);

  useEffect(() => {
    if (materialContactModal) {
      if (editingItem && editingItem.type === MATERIAL_CONTACT) {
        const item = editingItem as MaterialEditData;
        setMaterialContactForm({ partName: item.partName ?? '', material: item.material ?? '' });
      } else {
        setMaterialContactForm({ partName: '', material: '' });
      }
      setMaterialContactErrors({});
    }
    if (materialNonContactModal) {
      if (editingItem && editingItem.type === MATERIAL_NON_CONTACT) {
        const item = editingItem as MaterialEditData;
        setMaterialNonContactForm({ partName: item.partName ?? '', material: item.material ?? '' });
      } else {
        setMaterialNonContactForm({ partName: '', material: '' });
      }
      setMaterialNonContactErrors({});
    }
    if (biocompatibilityTestModal) {
      if (editingItem && editingItem.type === BIOCOMPATIBILITY_TEST) {
        const item = editingItem as BiocompatibilityTestEditData;
        setBiocompatibilityForm({
          stdRef: item.stdRef ?? '',
          scopeOfStudy: item.scopeOfStudy ?? '',
          result: item.result ?? ''
        });
      } else {
        setBiocompatibilityForm({ stdRef: '', scopeOfStudy: '', result: '' });
      }
      setBiocompatibilityErrors({});
    }
  }, [materialContactModal, materialNonContactModal, biocompatibilityTestModal, editingItem]);

  const stripIds = (arr: any[] = []) => (arr || []).map(({ id, ...rest }) => rest);
  const buildPayload = (data: VerificationValidationData) => {
    const { device_master_id, verification_id, ...rest } = data;
    return {
      project_id,
      ...rest,
      direct_contact_verification: stripIds(rest.direct_contact_verification),
      indirect_contact_verification: stripIds(rest.indirect_contact_verification),
      biocompatible_test_results: stripIds(rest.biocompatible_test_results),
    };
  };

  const handleSave = (type: SaveType, nextFormData?: VerificationValidationData) => {
    if (!hasEditPermission) return; // Prevent updates if no edit permission
    if (type === 'draft') {
      const payload = buildPayload(nextFormData ?? formData);
      draftSave({
        project_id,
        form_type: 'verification_validation',
        form_data: payload,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!formData) return false;
    clearDraftSave();

    const payload = buildPayload(nextFormData ?? formData);
    postVerificationValidation(payload, {
      onSuccess: () => {
        showActionAlert(STATUS_SUCCESS);
        refetchVerificationValidation();
      },
      onError: () => {
        showActionAlert(STATUS_FAILED);
      },
    });
    return true;
  };

  const updateField = (field: string, value: any) => {
    if (!hasEditPermission) return; // Prevent updates if no edit permission
    setFormData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value ?? '' } as VerificationValidationData;
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated);
      }
      return updated;
    });
  };

  const handleEdit = (row: any, type: ModalType) => {
    if (!hasEditPermission) return; // Prevent edit if no edit permission
    if (type === MATERIAL_CONTACT || type === MATERIAL_NON_CONTACT) {
      setEditingItem({
        id: row.id,
        partName: row.part_name,
        material: row.material,
        type,
      });
    } else if (type === BIOCOMPATIBILITY_TEST) {
      setEditingItem({
        id: row.id,
        stdRef: row.std_ref,
        scopeOfStudy: row.scope_of_plan,
        result: row.result,
        type,
      });
    }
    switch (type) {
      case MATERIAL_CONTACT:
        setMaterialContactModal(true);
        break;
      case MATERIAL_NON_CONTACT:
        setMaterialNonContactModal(true);
        break;
      case BIOCOMPATIBILITY_TEST:
        setBiocompatibilityTestModal(true);
        break;
    }
  };

  const handleDelete = (id: string, type: ModalType) => {
    if (!formData || !hasEditPermission) return; // Prevent delete if no edit permission
    let updatedArray;
    switch (type) {
      case MATERIAL_CONTACT:
        updatedArray = formData[DIRECT_CONTACT_VERIFICATION].filter((_item) => _item.id !== id);
        updateField(DIRECT_CONTACT_VERIFICATION, updatedArray);
        break;
      case MATERIAL_NON_CONTACT:
        updatedArray = formData[INDIRECT_CONTACT_VERIFICATION].filter((_item) => _item.id !== id);
        updateField(INDIRECT_CONTACT_VERIFICATION, updatedArray);
        break;
      case BIOCOMPATIBILITY_TEST:
        updatedArray = formData[BIOCOMPATIBLE_TEST_RESULTS].filter((_item) => _item.id !== id);
        updateField(BIOCOMPATIBLE_TEST_RESULTS, updatedArray);
        break;
    }
  };

  const handleMaterialContactSave = (data: { partName: string; material: string }) => {
    if (!formData) return;
    if (editingItem && editingItem.type === MATERIAL_CONTACT) {
      const updatedItems = formData[DIRECT_CONTACT_VERIFICATION].map((item) =>
        item.id === editingItem.id ? { ...item, part_name: data.partName, material: data.material } : item
      );
      updateField(DIRECT_CONTACT_VERIFICATION, updatedItems);
    } else {
      const newItem = { id: crypto.randomUUID(), part_name: data.partName, material: data.material };
      updateField(DIRECT_CONTACT_VERIFICATION, [...formData[DIRECT_CONTACT_VERIFICATION], newItem]);
    }
    setMaterialContactModal(false);
    setEditingItem(null);
  };

  const handleMaterialNonContactSave = (data: { partName: string; material: string }) => {
    if (!formData) return;
    if (editingItem && editingItem.type === MATERIAL_NON_CONTACT) {
      const updatedItems = formData[INDIRECT_CONTACT_VERIFICATION].map((item) =>
        item.id === editingItem.id ? { ...item, part_name: data.partName, material: data.material } : item
      );
      updateField(INDIRECT_CONTACT_VERIFICATION, updatedItems);
    } else {
      const newItem = { id: crypto.randomUUID(), part_name: data.partName, material: data.material };
      updateField(INDIRECT_CONTACT_VERIFICATION, [...formData[INDIRECT_CONTACT_VERIFICATION], newItem]);
    }
    setMaterialNonContactModal(false);
    setEditingItem(null);
  };

  const handleBiocompatibilityTestSave = (data: { stdRef: string; scopeOfStudy: string; result: string }) => {
    if (!formData) return;
    if (editingItem && editingItem.type === BIOCOMPATIBILITY_TEST) {
      const updatedItems = formData[BIOCOMPATIBLE_TEST_RESULTS].map((item) =>
        item.id === editingItem.id ? { ...item, std_ref: data.stdRef, scope_of_plan: data.scopeOfStudy, result: data.result } : item
      );
      updateField(BIOCOMPATIBLE_TEST_RESULTS, updatedItems);
    } else {
      const newItem = { id: crypto.randomUUID(), std_ref: data.stdRef, scope_of_plan: data.scopeOfStudy, result: data.result };
      updateField(BIOCOMPATIBLE_TEST_RESULTS, [...formData[BIOCOMPATIBLE_TEST_RESULTS], newItem]);
    }
    setBiocompatibilityTestModal(false);
    setEditingItem(null);
  };

  const handleModalClose = (type: ModalType) => {
    switch (type) {
      case MATERIAL_CONTACT:
        setMaterialContactModal(false);
        break;
      case MATERIAL_NON_CONTACT:
        setMaterialNonContactModal(false);
        break;
      case BIOCOMPATIBILITY_TEST:
        setBiocompatibilityTestModal(false);
        break;
    }
    setEditingItem(null);
  };

  const handleCancel = () => {
    if (data?.data?.[NUMBERMAP.ZERO]) {
      setFormData(data.data[NUMBERMAP.ZERO]);
    }
  };

  const materialContactColumns: GridColDef[] = [
    { field: FIELD_KEYS.SNO, headerName: UI_STRINGS.S_NO, flex: NUMBERMAP.ONE,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + NUMBERMAP.ONE
     },
    { field: FIELD_KEYS.PART_NAME, headerName: UI_STRINGS.PART_NAME, flex: NUMBERMAP.TWO },
    { field: FIELD_KEYS.MATERIAL, headerName: UI_STRINGS.MATERIAL, flex: NUMBERMAP.TWO },
    {
      field: FIELD_KEYS.ACTIONS,
      headerName: UI_STRINGS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton onEdit={() => handleEdit(params.row, MATERIAL_CONTACT)} onDelete={() => handleDelete(params.id.toString(), MATERIAL_CONTACT)} disabled={!hasEditPermission} />
      ),
    },
  ];

  const materialNonContactColumns: GridColDef[] = [
    { field: FIELD_KEYS.SERIAL_NUMBER, headerName: UI_STRINGS.S_NO, flex: NUMBERMAP.ONE, 
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + NUMBERMAP.ONE
     },
    { field: FIELD_KEYS.PART_NAME, headerName: UI_STRINGS.PART_NAME, flex: NUMBERMAP.TWO },
    { field: FIELD_KEYS.MATERIAL, headerName: UI_STRINGS.MATERIAL, flex: NUMBERMAP.TWO },
    {
      field: FIELD_KEYS.ACTIONS,
      headerName: UI_STRINGS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton onEdit={() => handleEdit(params.row, MATERIAL_NON_CONTACT)} onDelete={() => handleDelete(params.id.toString(), MATERIAL_NON_CONTACT)} disabled={!hasEditPermission} />
      ),
    },
  ];

  const biocompatibilityTestColumns: GridColDef[] = [
    { field: FIELD_KEYS.SERIAL_NUMBER, headerName: UI_STRINGS.S_NO, flex: NUMBERMAP.ONE, 
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + NUMBERMAP.ONE
     },
    { field: FIELD_KEYS.STD_REF, headerName: UI_STRINGS.STD_REF, flex: NUMBERMAP.ONE },
    { field: FIELD_KEYS.SCOPE_OF_PLAN, headerName: UI_STRINGS.SCOPE_OF_STUDY, flex: NUMBERMAP.THREE },
    { field: FIELD_KEYS.RESULT, headerName: UI_STRINGS.RESULT, flex: NUMBERMAP.ONE },
    {
      field: FIELD_KEYS.ACTIONS,
      headerName: UI_STRINGS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton onEdit={() => handleEdit(params.row, BIOCOMPATIBILITY_TEST)} onDelete={() => handleDelete(params.id.toString(), BIOCOMPATIBILITY_TEST)} disabled={!hasEditPermission} />
      ),
    },
  ];

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

  const annexureItems = [
    { label: UI_STRINGS.FILE_ANNEXURE_1, fileUrl: '/files/annexure1.pdf' },
    { label: UI_STRINGS.FILE_ANNEXURE_2, fileUrl: '/files/annexure2.pdf' },
  ];

  const validateMaterialContact = () => {
    const errors: Record<string, string> = {};
    if (!materialContactForm.partName.trim()) errors.partName = VALIDATION_ERRORS.PART_NAME_REQUIRED;
    if (!materialContactForm.material.trim()) errors.material = VALIDATION_ERRORS.MATERIAL_REQUIRED;
    setMaterialContactErrors(errors);
    return Object.keys(errors).length === NUMBERMAP.ZERO;
  };
  const validateMaterialNonContact = () => {
    const errors: Record<string, string> = {};
    if (!materialNonContactForm.partName.trim()) errors.partName = VALIDATION_ERRORS.PART_NAME_REQUIRED;
    if (!materialNonContactForm.material.trim()) errors.material = VALIDATION_ERRORS.MATERIAL_REQUIRED;
    setMaterialNonContactErrors(errors);
    return Object.keys(errors).length === NUMBERMAP.ZERO;
  };
  const validateBiocompatibility = () => {
    const errors: Record<string, string> = {};
    if (!biocompatibilityForm.stdRef.trim()) errors.stdRef = VALIDATION_ERRORS.STD_REF_REQUIRED;
    if (!biocompatibilityForm.scopeOfStudy.trim()) errors.scopeOfStudy = VALIDATION_ERRORS.SCOPE_OF_STUDY_REQUIRED;
    if (!biocompatibilityForm.result.trim()) errors.result = VALIDATION_ERRORS.RESULT_REQUIRED;
    setBiocompatibilityErrors(errors);
    return Object.keys(errors).length === NUMBERMAP.ZERO;
  };

  const handleMaterialContactChange = (field: string, value: string) => {
    setMaterialContactForm(prev => ({ ...prev, [field]: value }));
    if (materialContactErrors[field]) {
      setMaterialContactErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  };
  const handleMaterialNonContactChange = (field: string, value: string) => {
    setMaterialNonContactForm(prev => ({ ...prev, [field]: value }));
    if (materialNonContactErrors[field]) {
      setMaterialNonContactErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  };
  const handleBiocompatibilityChange = (field: string, value: string) => {
    setBiocompatibilityForm(prev => ({ ...prev, [field]: value }));
    if (biocompatibilityErrors[field]) {
      setBiocompatibilityErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  };

  const handleMaterialContactModalSave = () => {
    if (!validateMaterialContact()) return;
    handleMaterialContactSave(materialContactForm);
  };
  const handleMaterialNonContactModalSave = () => {
    if (!validateMaterialNonContact()) return;
    handleMaterialNonContactSave(materialNonContactForm);
  };
  const handleBiocompatibilityModalSave = () => {
    if (!validateBiocompatibility()) return;
    handleBiocompatibilityTestSave(biocompatibilityForm);
  };

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={SECTION_TITLES.VERIFICATION_VALIDATION} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={UI_STRINGS.GENERAL}
                placeholder={UI_STRINGS.ENTER_GENERAL}
                value={formData.general}
                onChange={(value: string) => updateField(FORM_FIELDS.GENERAL, value)}
                infoText={INFO_TEXT.GENERAL}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.BIOCOMPATIBILITY}
                value={formData.biocompatibility}
                onChange={(value) => updateField(FORM_FIELDS.BIOCOMPATIBILITY, value)}
                placeholder={PLACEHOLDER_BIOCOMPATIBILITY}
                infoText={INFO_TEXT.BIOCOMPATIBILITY}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <SubHeader title={SECTION_TITLES.LIST_OF_MATERIALS} />
            </Grid2>
          </Grid2>

          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box sx={BoxContainer}>
                <InputLabel>{SECTION_TITLES.MATERIALS_CONTACT}</InputLabel>
                <InfoHover infoText={INFO_TEXT.MATERIALS_CONTACT} />
                <Button variant={BUTTON_VARIANT_OUTLINED} onClick={() => setMaterialContactModal(true)} disabled={!hasEditPermission}>
                  <AddIcon sx={ICON_SIZE} />
                  {UI_STRINGS.ADD_NEW}
                </Button>
              </Box>
              <DataGridTable
                showAddButton
                rows={ensureIds(formData[DIRECT_CONTACT_VERIFICATION])}
                columns={materialContactColumns}
                idField={DATA_GRID_ID_FIELD}
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>

          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box sx={BoxContainer}>
                <InputLabel>{SECTION_TITLES.MATERIALS_NON_CONTACT}</InputLabel>
                <InfoHover infoText={INFO_TEXT.MATERIALS_NON_CONTACT} />
                <Button variant={BUTTON_VARIANT_OUTLINED} onClick={() => setMaterialNonContactModal(true)} disabled={!hasEditPermission}>
                  <AddIcon sx={ICON_SIZE} />
                  {UI_STRINGS.ADD_NEW}
                </Button>
              </Box>
              <DataGridTable
                showAddButton
                rows={ensureIds(formData[INDIRECT_CONTACT_VERIFICATION])}
                columns={materialNonContactColumns}
                idField={DATA_GRID_ID_FIELD}
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.BIOCOMPATIBLE_TESTS_REPORTS}
                value={formData.biocompatibility_test_report}
                onChange={(value) => updateField(FORM_FIELDS.BIOCOMPATIBILITY_TEST_REPORT, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                disabled={!hasEditPermission}
              />
              <AnnexureDropdown items={annexureItems} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.BIOLOGICAL_EVALUATION}
                value={formData.biological_evaluation}
                onChange={(value) => updateField(FORM_FIELDS.BIOLOGICAL_EVALUATION, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                disabled={!hasEditPermission}
              />
              <AnnexureDropdown items={annexureItems} />
            </Grid2>
          </Grid2>

          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box sx={BoxContainer}>
                <InputLabel>{SECTION_TITLES.BIOCOMPATIBLE_TESTS}</InputLabel>
                <InfoHover infoText={INFO_TEXT.BIOCOMPATIBLE_TESTS} />
                <Button variant={BUTTON_VARIANT_OUTLINED} onClick={() => setBiocompatibilityTestModal(true)} disabled={!hasEditPermission}>
                  <AddIcon sx={ICON_SIZE} />
                  {UI_STRINGS.ADD_NEW}
                </Button>
              </Box>
              <DataGridTable
                showAddButton
                rows={ensureIds(formData[BIOCOMPATIBLE_TEST_RESULTS])}
                columns={biocompatibilityTestColumns}
                idField={DATA_GRID_ID_FIELD}
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.MEDICINAL_SUBSTANCES}
                value={formData.medicinal_substances}
                onChange={(value) => updateField(FORM_FIELDS.MEDICINAL_SUBSTANCES, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.MEDICINAL_SUBSTANCES}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.BIOLOGICAL_SAFETY}
                value={formData.biological_safety}
                onChange={(value) => updateField(FORM_FIELDS.BIOLOGICAL_SAFETY, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.BIOLOGICAL_SAFETY}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.STERILE_ETO_METHOD}
                value={formData.sterile_eto_method}
                onChange={(value) => updateField(FORM_FIELDS.STERILE_ETO_METHOD, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.STERILE_ETO}
                disabled={!hasEditPermission}
              />
              <AnnexureDropdown items={annexureItems} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.SOFTWARE_VERIFICATION}
                value={formData.software_verification}
                onChange={(value) => updateField(FORM_FIELDS.SOFTWARE_VERIFICATION, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.SOFTWARE_VERIFICATION}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.ANIMAL_STUDIES}
                value={formData.animal_studies}
                onChange={(value) => updateField(FORM_FIELDS.ANIMAL_STUDIES, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.ANIMAL_STUDIES}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.STABILITY_DATA}
                value={formData.stability_data}
                onChange={(value) => updateField(FORM_FIELDS.STABILITY_DATA, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.STABILITY_DATA}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.FOR_MAIN_UNIT}
                value={formData.main_unit}
                onChange={(value) => updateField(FORM_FIELDS.MAIN_UNIT, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.MAIN_UNIT}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.FOR_ACCESSORIES}
                value={formData.utility_type_details}
                onChange={(value) => updateField(FORM_FIELDS.UTILITY_TYPE_DETAILS, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.ACCESSORIES}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.ACCELERATED_STABILITY}
                value={formData.accelerated_study_report}
                onChange={(value) => updateField(FORM_FIELDS.ACCELERATED_STUDY_REPORT, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.ACCELERATED_STABILITY}
                disabled={!hasEditPermission}
              />
              <AnnexureDropdown items={annexureItems} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.CLINICAL_EVIDENCE}
                value={formData.clinical_evidance}
                onChange={(value) => updateField(FORM_FIELDS.CLINICAL_EVIDANCE, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.CLINICAL_EVIDENCE}
                disabled={!hasEditPermission}
              />
              <AnnexureDropdown items={annexureItems} />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={UI_STRINGS.POST_MARKET_SURVEILLANCE}
                value={formData.post_market_surveilance_data}
                onChange={(value) => updateField(FORM_FIELDS.POST_MARKET_SURVEILANCE_DATA, value)}
                placeholder={UI_STRINGS.INPUT_TEXT}
                infoText={INFO_TEXT.POST_MARKET}
                disabled={!hasEditPermission}
              />
              <AnnexureDropdown items={annexureItems} />
            </Grid2>
          </Grid2>

          <ButtonContainer>
            <RegulationReviewerModalManager
              isLoading={!data}
              permissions={permissions}
              taskInfo={taskInfo}
              menuId={data?.meta_info?.action_control?.menuId}
              menuName={data?.meta_info?.action_control?.formName}
              contextType="device_master"
              contextId={project_id}
              userId={project_id.toString()}
              organizationSiteId={project_id.toString()}
              onPermissionChange={(permission) => {
                // If only Cancel button is available, user should not be allowed to edit
                setHasEditPermission(permission && !hasOnlyCancelButton);
              }}
              refetch={refetchVerificationValidation}
              customHandlers={{
                handleSave: () => handleSave('final'),
                handleCancel: handleCancel,
                isDisabled: !hasEditPermission
              }}
            />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>

      {/* Modals */}
      <CommonModal
        open={materialContactModal}
        onClose={() => handleModalClose(MATERIAL_CONTACT)}
        onSave={handleMaterialContactModalSave}
        buttonRequired
        title={editingItem && editingItem.type === MATERIAL_CONTACT ? MODAL_TITLES.EDIT_MATERIAL_CONTACT : MODAL_TITLES.ADD_MATERIAL_CONTACT}
      >
        <MaterialContactModal
          formData={materialContactForm}
          errors={materialContactErrors}
          onChange={handleMaterialContactChange}
        />
      </CommonModal>
      <CommonModal
        open={materialNonContactModal}
        onClose={() => handleModalClose(MATERIAL_NON_CONTACT)}
        onSave={handleMaterialNonContactModalSave}
        buttonRequired
        title={editingItem && editingItem.type === MATERIAL_NON_CONTACT ? MODAL_TITLES.EDIT_MATERIAL_NON_CONTACT : MODAL_TITLES.ADD_MATERIAL_NON_CONTACT}
      >
        <MaterialNonContactModal
          formData={materialNonContactForm}
          errors={materialNonContactErrors}
          onChange={handleMaterialNonContactChange}
        />
      </CommonModal>
      <CommonModal
        open={biocompatibilityTestModal}
        onClose={() => handleModalClose(BIOCOMPATIBILITY_TEST)}
        onSave={handleBiocompatibilityModalSave}
        buttonRequired
        title={editingItem && editingItem.type === BIOCOMPATIBILITY_TEST ? MODAL_TITLES.EDIT_BIOCOMPATIBILITY_TEST : MODAL_TITLES.ADD_BIOCOMPATIBILITY_TEST}
      >
        <BiocompatibilityTestModal
          formData={biocompatibilityForm}
          errors={biocompatibilityErrors}
          onChange={handleBiocompatibilityChange}
        />
      </CommonModal>
    </FormContainer>
  );
};

export default VerificationValidationPage;
