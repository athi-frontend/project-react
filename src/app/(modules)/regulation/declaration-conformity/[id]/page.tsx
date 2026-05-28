"use client";
import React, { useEffect, useState, useRef } from "react";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { Grid2, InputLabel as CheckboxLabel, Checkbox } from "@mui/material";
import { InputLabel } from '@/styles/components/ui/input';
import { ErrorText } from '@/styles/common'
import { NUMBERMAP} from "@/constants/common";
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import { InputField, Description, ButtonGroup, Label, showActionAlert } from "@/components/ui";
import DatePicker from "@/components/ui/data-picker/DataPicker";
import dayjs from 'dayjs';
import { ListContainer } from "@/styles/modules/regulation/executiveSummary";
import { useParams } from 'next/navigation';
import { useRegulationConformity, useUpsertRegulationConformity } from '@/hooks/modules/regulation/useDeclarationOfConformity';
import { INITIAL_DECLARATION_CONFORMITY_FORM_DATA, FormErrors, DECLARATION_CONFORMITY_FORM_ERRORS, DECLARATION_CONFORMITY_LABELS, DECLARATION_CONFORMITY_PLACEHOLDERS, DECLARATION_CONFORMITY_DATA_IS_AUTOCOMPLETE, DECLARATION_CONFORMITY_FIELDS, DECLARATION_CONFORMITY_DATE_FORMAT, DECLARATION_CONFORMITY_PAYLOAD_DATE_FORMAT, INITIAL_DECLARATION_CONFORMITY_FORM_ERRORS, DeclarationConformityFormData, DECLARATION_CONFORMITY_VALIDATION_SCHEMA, DECLARATION_CONFORMITY_FIELD_TYPES, DECLARATION_CONFORMITY_UNWANTED_FIELDS } from '@/constants/modules/regulation/declarationOfConformity';
import { FAILED_ALERT, SUCCESS_ALERT } from "@/constants/modules/dnd/formTeam";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import { getHypen } from "@/lib/utils/common";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const DeclarationConformityForm: React.FC = () => {
  const params = useParams();
  const projectId = params.id as string;
  const { data, isLoading, refetch: refetchConformity } = useRegulationConformity(projectId, false);
  const upsertMutation = useUpsertRegulationConformity();
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave()

  const [formData, setFormData] = useState<DeclarationConformityFormData>(INITIAL_DECLARATION_CONFORMITY_FORM_DATA);
  const [formErrors, setFormErrors] = useState<FormErrors>(INITIAL_DECLARATION_CONFORMITY_FORM_ERRORS);
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchConformity();
  }, [refetchConformity]);

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      // Trigger draft save on change only after initial load
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated)
      }
      return updated
    });
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = { ...INITIAL_DECLARATION_CONFORMITY_FORM_ERRORS };
    let isValid = true;

    for (const rule of DECLARATION_CONFORMITY_VALIDATION_SCHEMA) {
      const value = formData[rule.field as keyof DeclarationConformityFormData];
      if (rule.type === DECLARATION_CONFORMITY_FIELD_TYPES.STRING) {
        if (!value || !(value as string).trim()) {
          newErrors[rule.field as keyof FormErrors] = DECLARATION_CONFORMITY_FORM_ERRORS[rule.errorKey as keyof typeof DECLARATION_CONFORMITY_FORM_ERRORS];
          isValid = false;
        }
      } else if (rule.type === DECLARATION_CONFORMITY_FIELD_TYPES.BOOLEAN) {
        if (!value) {
          newErrors[rule.field as keyof FormErrors] = DECLARATION_CONFORMITY_FORM_ERRORS[rule.errorKey as keyof typeof DECLARATION_CONFORMITY_FORM_ERRORS];
          isValid = false;
        }
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };



  const resetForm = () => {
    setFormData(INITIAL_DECLARATION_CONFORMITY_FORM_DATA);
    setFormErrors(INITIAL_DECLARATION_CONFORMITY_FORM_ERRORS);
  };

  const buildPayload = (fd: DeclarationConformityFormData) => {
    const filteredFormData = Object.fromEntries(
      Object.entries(fd).filter(([key]) => !DECLARATION_CONFORMITY_UNWANTED_FIELDS.includes(key))
    ) as any
    return {
      ...filteredFormData,
      project_id: Number(projectId),
      conformity_declaration_date: fd.conformity_declaration_date
        ? dayjs(fd.conformity_declaration_date, DECLARATION_CONFORMITY_DATE_FORMAT).format(DECLARATION_CONFORMITY_PAYLOAD_DATE_FORMAT)
        : "",
    }
  }

  function handleSave(type: SaveType, next?: DeclarationConformityFormData) {
    if (type === 'draft') {
      const payload = buildPayload(next ?? formData)
      draftSave({
        project_id: Number(projectId),
        form_type: 'declaration_of_conformity',
        form_data: payload,
        timestamp: new Date().toISOString(),
      })
      return
    }
    if (!validateForm()) {
      return
    }
    clearDraftSave()
    const payload = buildPayload(next ?? formData)
    upsertMutation.mutate(payload, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT)
      },
      onError: () => {
        showActionAlert(FAILED_ALERT)
      },
    })
  }

  const handleCancel = () => {
    resetForm();
  };

  const buttonConfig = [
    { label: DECLARATION_CONFORMITY_LABELS.CANCEL, onClick: handleCancel },
    { label: DECLARATION_CONFORMITY_LABELS.SAVE, onClick: () => handleSave('final') }
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={DECLARATION_CONFORMITY_LABELS.PAGE_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                label={DECLARATION_CONFORMITY_LABELS.NAME_OF_MANUFACTURER}
                value={getHypen(formData.manufacturer_name)}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                label={DECLARATION_CONFORMITY_LABELS.PRODUCT_GENERIC_NAME}
                value={getHypen(formData.product_generic_name)}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Description
                value={formData.manufacture_contact_details ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.MANUFACTURER_ADDRESS, value)}
                label={DECLARATION_CONFORMITY_LABELS.MANUFACTURER_ADDRESS}
                error={formErrors.manufacture_contact_details}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.MANUFACTURER_ADDRESS}
                disabled={isLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.TRADE_NAME_MANUFACTURER}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.TRADE_NAME_MANUFACTURER}
                value={formData.manufacture_trade_name ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.TRADE_NAME_MANUFACTURER, value)}
                error={formErrors.manufacture_trade_name}
                disabled={isLoading}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.PRODUCT_BRAND_NAME}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.PRODUCT_BRAND_NAME}
                value={formData.product_brand_name ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.PRODUCT_BRAND_NAME, value)}
                error={formErrors.product_brand_name}
                disabled={isLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                label={DECLARATION_CONFORMITY_LABELS.PRODUCT_MODEL_NUMBER}
                value={getHypen(formData.model_name)}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.PRODUCT_CODE}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.PRODUCT_CODE}
                value={formData.product_code ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.PRODUCT_CODE, value)}
                error={formErrors.product_code}
                disabled={isLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.PRODUCT_CATALOGUE_NUMBER}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.PRODUCT_CATALOGUE_NUMBER}
                value={formData.product_catalogue_number ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.PRODUCT_CATALOGUE_NUMBER, value)}
                error={formErrors.product_catalogue_number}
                disabled={isLoading}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                label={DECLARATION_CONFORMITY_LABELS.INTENDED_USE}
                value={getHypen(formData.product_intended_use)}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                label={DECLARATION_CONFORMITY_LABELS.BASIC_UDI_DI}
                value={getHypen(formData.basic_udi_di)}
              />
            </Grid2>
          </Grid2>
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <InputLabel>{DECLARATION_CONFORMITY_LABELS.CONFORMITY_TO_REGULATION}</InputLabel>
              <Grid2 sx={ListContainer}>
                <Checkbox
                  checked={!!formData.regulation_conformity}
                  onChange={(_, checked) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.CONFORMITY_REGULATION, checked)}
                  name="Conformity to Regulation"
                  color="primary"
                  disabled={isLoading}
                />
                <CheckboxLabel>{DECLARATION_CONFORMITY_LABELS.CONFORMITY_TO_REGULATION_LABEL}</CheckboxLabel>
              </Grid2>
              <ErrorText>{formErrors.regulation_conformity}</ErrorText>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                label={DECLARATION_CONFORMITY_LABELS.CLASSIFICATION_PRODUCT}
                value={getHypen(formData.product_classification)}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.CONFORMITY_ASSESSMENT_ROUTE}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.CONFORMITY_ASSESSMENT_ROUTE}
                value={formData.conformity_assessment_route ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.CONFORMITY_ASSESSMENT_ROUTE, value)}
                error={formErrors.conformity_assessment_route}
                disabled={isLoading}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.GENERAL_APPLICABLE_DIRECTIVES}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.GENERAL_APPLICABLE_DIRECTIVES}
                value={formData.general_applicable_directives ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.GENERAL_APPLICABLE_DIRECTIVES, value)}
                error={formErrors.general_applicable_directives}
                disabled={isLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.NOTIFIED_BODY_NAME}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.NOTIFIED_BODY_NAME}
                value={formData.notified_body_name ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.NOTIFIED_BODY_NAME, value)}
                error={formErrors.notified_body_name}
                disabled={isLoading}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Description
                value={formData.appliable_common_specification ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.APPLICABLE_COMMON_SPECIFICATION, value)}
                label={DECLARATION_CONFORMITY_LABELS.APPLICABLE_COMMON_SPECIFICATION}
                error={formErrors.appliable_common_specification}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.APPLICABLE_COMMON_SPECIFICATION}
                disabled={isLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Description
                value={formData.applied_standard ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.APPLIED_STANDARDS, value)}
                label={DECLARATION_CONFORMITY_LABELS.APPLIED_STANDARDS}
                error={formErrors.applied_standard}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.APPLIED_STANDARDS}
                disabled={isLoading}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.NOTIFIED_BODY_NUMBER}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.NOTIFIED_BODY_NUMBER}
                value={formData.notified_body_number ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.NOTIFIED_BODY_NUMBER, value)}
                error={formErrors.notified_body_number}
                disabled={isLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.COMPETENT_AUTHORITY}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.COMPETENT_AUTHORITY}
                value={formData.competent_authority ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.COMPETENT_AUTHORITY, value)}
                error={formErrors.competent_authority}
                disabled={isLoading}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.AUTHORIZED_REPRESENTATIVE}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.AUTHORIZED_REPRESENTATIVE}
                value={formData.authorized_representative ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.AUTHORIZED_REPRESENTATIVE, value)}
                error={formErrors.authorized_representative}
                disabled={isLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={DECLARATION_CONFORMITY_LABELS.PLACE}
                placeholder={DECLARATION_CONFORMITY_PLACEHOLDERS.PLACE}
                value={formData.place ?? ""}
                onChange={(value: string) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.PLACE, value)}
                error={formErrors.place}
                disabled={isLoading}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={DECLARATION_CONFORMITY_LABELS.DATE}
                value={formData.conformity_declaration_date ? dayjs(formData.conformity_declaration_date, DECLARATION_CONFORMITY_DATE_FORMAT) : null}
                onChange={(value) => handleInputChange(DECLARATION_CONFORMITY_FIELDS.DATE, value ? value.format(DECLARATION_CONFORMITY_DATE_FORMAT) : '')}
                error={formErrors.conformity_declaration_date}
                dataIsAutocomplete={DECLARATION_CONFORMITY_DATA_IS_AUTOCOMPLETE}
              />
            </Grid2>
          </Grid2>
          <ButtonGroup buttons={buttonConfig} />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default DeclarationConformityForm;
