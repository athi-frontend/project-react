/**
 * Add Risk Modal Component
 * Classification: Confidential
 */
'use client';
import React, { useState, useEffect } from 'react';
import { Grid2 } from '@mui/material';
import { InputField, RichTextEditor } from '@/components/ui';
import GlobalLoader from '@/components/shared/LoadingSpinner';
import { AddRiskModalProps, RiskFormData } from '@/types/modules/risk-management/riskAnalysisControl';
import { ADD_RISK_MODAL_CONSTANTS, RISK_FIELD_LABEL_MAP, RISK_FIELD_ORDER } from '@/constants/modules/risk-management/riskAnalysisControl';
import { NUMBERMAP } from '@/constants/common';
import RiskManagementModalBase, { 
  useProbabilitySeverity, 
  ProbabilitySeverityFields, 
  AcceptabilityField 
} from './RiskManagementModalBase';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';

const AddRiskModal: React.FC<AddRiskModalProps> = ({
  open,
  onClose,
  onSave,
  hazardId,
  projectId,
  isPending = false,
  initialData,
}) => {
  const [formData, setFormData] = useState<RiskFormData>({
    title: '',
    description: '',
    probability: '',
    severity: '',
    acceptability: '',
  });

  const [errors, setErrors] = useState<Partial<RiskFormData> & { acceptabilityError?: string }>({});
  
  // Use shared probability/severity hook
  const {
    probabilityOptions,
    severityOptions,
    probabilityLoading,
    severityLoading,
    acceptabilityValue,
    acceptabilityLoading,
    setProbabilityId,
    setSeverityId,
  } = useProbabilitySeverity(projectId, open, initialData?.probability, initialData?.severity);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field: keyof RiskFormData) => (value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value.toString() }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear acceptability error when probability or severity changes
    if (field === ADD_RISK_MODAL_CONSTANTS.FIELD_NAMES.PROBABILITY || 
        field === ADD_RISK_MODAL_CONSTANTS.FIELD_NAMES.SEVERITY) {
      if (errors.acceptabilityError) {
        setErrors(prev => ({ ...prev, acceptabilityError: '' }));
      }
    }
    
    // Update probability and severity IDs for API calls
    if (field === ADD_RISK_MODAL_CONSTANTS.FIELD_NAMES.PROBABILITY) {
      setProbabilityId(value ? parseInt(value.toString()) : null);
    } else if (field === ADD_RISK_MODAL_CONSTANTS.FIELD_NAMES.SEVERITY) {
      setSeverityId(value ? parseInt(value.toString()) : null);
    }
  };

  const handleProbabilityChange = (value: string) => {
    handleChange(ADD_RISK_MODAL_CONSTANTS.FIELD_NAMES.PROBABILITY)(value);
  };

  const handleSeverityChange = (value: string) => {
    handleChange(ADD_RISK_MODAL_CONSTANTS.FIELD_NAMES.SEVERITY)(value);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RiskFormData> & { acceptabilityError?: string } = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = ADD_RISK_MODAL_CONSTANTS.VALIDATION_MESSAGES.RISK_TITLE_REQUIRED;
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = ADD_RISK_MODAL_CONSTANTS.VALIDATION_MESSAGES.RISK_DESCRIPTION_REQUIRED;
      isValid = false;
    }

    if (!formData.probability) {
      newErrors.probability = ADD_RISK_MODAL_CONSTANTS.VALIDATION_MESSAGES.PROBABILITY_REQUIRED;
      isValid = false;
    }

    if (!formData.severity) {
      newErrors.severity = ADD_RISK_MODAL_CONSTANTS.VALIDATION_MESSAGES.SEVERITY_REQUIRED;
      isValid = false;
    }

    // Risk assessment matrix validation (block save and show error)
    if (
      formData.probability &&
      formData.severity &&
      !acceptabilityLoading &&
      acceptabilityValue === null
    ) {
      newErrors.acceptabilityError = ADD_RISK_MODAL_CONSTANTS.VALIDATION_MESSAGES.RISK_ASSESSMENT_MATRIX_NOT_DEFINED;
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) {
      validateAndFocusFirstEmptyField(formData, Array.from(RISK_FIELD_ORDER), RISK_FIELD_LABEL_MAP);
    }
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      probability: '',
      severity: '',
      acceptability: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <>
      <GlobalLoader loading={isPending} />
      <RiskManagementModalBase
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        isPending={isPending}
        title={initialData ? ADD_RISK_MODAL_CONSTANTS.MODAL_TITLE_EDIT : ADD_RISK_MODAL_CONSTANTS.MODAL_TITLE}
        modalMaxWidth={ADD_RISK_MODAL_CONSTANTS.MODAL_MAX_WIDTH}
        projectId={projectId}
        cancelButtonLabel={ADD_RISK_MODAL_CONSTANTS.BUTTONS.CANCEL}
        saveButtonLabel={ADD_RISK_MODAL_CONSTANTS.BUTTONS.SAVE}
      >
      <Grid2 size={NUMBERMAP.TWELVE}>
        <InputField
          label={ADD_RISK_MODAL_CONSTANTS.FORM_LABELS.RISK_TITLE}
          placeholder={ADD_RISK_MODAL_CONSTANTS.PLACEHOLDERS.ENTER_TITLE}
          value={formData.title}
          onChange={handleChange(ADD_RISK_MODAL_CONSTANTS.FIELD_NAMES.TITLE)}
          error={errors.title}
        />
      </Grid2>

      <Grid2 size={NUMBERMAP.TWELVE}>
        <RichTextEditor
          id={ADD_RISK_MODAL_CONSTANTS.FIELD_NAMES.DESCRIPTION}
          label={ADD_RISK_MODAL_CONSTANTS.FORM_LABELS.RISK_DESCRIPTION}
          placeholder={ADD_RISK_MODAL_CONSTANTS.PLACEHOLDERS.ENTER_RISK_DESCRIPTION}
          value={formData.description}
          onChange={handleChange(ADD_RISK_MODAL_CONSTANTS.FIELD_NAMES.DESCRIPTION)}
          error={errors.description}
        />
      </Grid2>

      <ProbabilitySeverityFields
        probabilityOptions={probabilityOptions}
        severityOptions={severityOptions}
        probabilityLoading={probabilityLoading}
        severityLoading={severityLoading}
        probabilityValue={formData.probability}
        severityValue={formData.severity}
        onProbabilityChange={handleProbabilityChange}
        onSeverityChange={handleSeverityChange}
        probabilityError={errors.probability}
        severityError={errors.severity}
        probabilityLabel={ADD_RISK_MODAL_CONSTANTS.FORM_LABELS.PROBABILITY}
        severityLabel={ADD_RISK_MODAL_CONSTANTS.FORM_LABELS.SEVERITY}
        probabilityPlaceholder={ADD_RISK_MODAL_CONSTANTS.PLACEHOLDERS.SELECT_PROBABILITY}
        severityPlaceholder={ADD_RISK_MODAL_CONSTANTS.PLACEHOLDERS.SELECT_SEVERITY}
      />

      <AcceptabilityField
        acceptabilityValue={acceptabilityValue}
        acceptableButtonText={ADD_RISK_MODAL_CONSTANTS.BUTTONS.ACCEPTABLE}
        notAcceptableButtonText={ADD_RISK_MODAL_CONSTANTS.BUTTONS.NOT_ACCEPTABLE}
        error={
          formData.probability &&
          formData.severity &&
          !acceptabilityLoading &&
          acceptabilityValue === null
            ? ADD_RISK_MODAL_CONSTANTS.VALIDATION_MESSAGES.RISK_ASSESSMENT_MATRIX_NOT_DEFINED
            : errors.acceptabilityError
        }
      />
      </RiskManagementModalBase>
    </>
  );
};

export default AddRiskModal;
