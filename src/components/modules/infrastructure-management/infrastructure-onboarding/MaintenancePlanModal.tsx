"use client";

import React, { useState } from "react";
import { Grid2 } from "@mui/material";
import { InputField, ButtonGroup, RichTextEditor } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { ContentWrapper, MODAL_STYLES } from "@/styles/modules/dnd/verification";
import { MaintenancePlanFormData, MaintenancePlanModalProps } from "@/types/modules/infrastructure-management/infrastructureOnboardingTabs";
import { 
  MAINTENANCE_PLAN_ERROR_MESSAGES as ERROR_MESSAGES,
  MAINTENANCE_PLAN_FORM_LABELS as FORM_LABELS,
  MAINTENANCE_PLAN_FORM_PLACEHOLDERS as FORM_PLACEHOLDERS,
  MAINTENANCE_PLAN_FORM_KEY_FIELDS as FORM_KEY_FIELDS,
  MAINTENANCE_PLAN_FORM_VALUE_FIELDS as FORM_VALUE_FIELDS,
  MAINTENANCE_PLAN_FORM_ID_FIELD as FORM_ID_FIELD,
  MAINTENANCE_PLAN_FORM_BUTTON_LABELS as FORM_BUTTON_LABELS,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";

/**
 * Classification : Confidential
 **/

const MaintenancePlanModal: React.FC<MaintenancePlanModalProps> = ({
  onSave,
  onCancel,
  initialData = {},
  frequencyData,
  serviceTypesData,
  statusData,
}) => {
  const [formData, setFormData] = useState<MaintenancePlanFormData>({
    maintenanceDescription: initialData.maintenanceDescription ?? "",
    toBeDoneBy: initialData.toBeDoneBy ?? "",
    frequency: initialData.frequency ?? "",
    status: initialData.status ?? "",
  });

  const [errors, setErrors] = useState<Partial<MaintenancePlanFormData>>({});
  const validateForm = (): boolean => {
    const newErrors: Partial<MaintenancePlanFormData> = {};

    if (!formData.maintenanceDescription?.trim()) {
      newErrors.maintenanceDescription = ERROR_MESSAGES.MAINTENANCE_DESCRIPTION_REQUIRED;
    }

    if (!formData.toBeDoneBy) {
      newErrors.toBeDoneBy = ERROR_MESSAGES.RESPONSIBLE_PERSON_REQUIRED;
    }

    if (!formData.frequency) {
      newErrors.frequency = ERROR_MESSAGES.FREQUENCY_REQUIRED;
    }

    if (!formData.status) {
      newErrors.status = ERROR_MESSAGES.STATUS_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === NUMBERMAP.ZERO;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave?.(formData);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleFieldChange = (field: keyof MaintenancePlanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const buttonConfig = [
    { label: FORM_BUTTON_LABELS.CANCEL, onClick: handleCancel },
    { label: FORM_BUTTON_LABELS.SAVE, onClick: handleSave },
  ];

  return (
    <ContentWrapper>
      <Grid2 container spacing={NUMBERMAP.TWO} sx={MODAL_STYLES.scrollableContainer}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <RichTextEditor
            label={FORM_LABELS.MAINTENANCE_DESCRIPTION}
            value={formData.maintenanceDescription}
            placeholder={FORM_PLACEHOLDERS.ENTER_MAINTENANCE_DESCRIPTION}
            onChange={(value: string) => handleFieldChange("maintenanceDescription", value)}
            error={errors.maintenanceDescription}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={FORM_LABELS.TO_BE_DONE_BY}
            placeholder={FORM_PLACEHOLDERS.SELECT_RESPONSIBLE_PERSON}
            isDropdown
            value={formData.toBeDoneBy}
            onChange={(value: string) => handleFieldChange("toBeDoneBy", value)}
            options={serviceTypesData?.data ?? []}
            keyField={FORM_ID_FIELD}
            valueField={FORM_VALUE_FIELDS.MAINTENANCE_SERVICE_TYPE}
            error={errors.toBeDoneBy}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={FORM_LABELS.FREQUENCY}
            placeholder={FORM_PLACEHOLDERS.SELECT_FREQUENCY}
            isDropdown
            value={formData.frequency}
            onChange={(value: string) => handleFieldChange("frequency", value)}
            options={frequencyData?.data ?? []}
            keyField={FORM_ID_FIELD}
            valueField={FORM_VALUE_FIELDS.FREQUENCY_NAME}
            error={errors.frequency}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={FORM_LABELS.STATUS}
            placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
            isDropdown
            value={formData.status}
            onChange={(value: string) => handleFieldChange("status", value)}
            options={statusData?.data ?? []}
            keyField={FORM_KEY_FIELDS.STATUS_ID}
            valueField={FORM_VALUE_FIELDS.STATUS_NAME}
            error={errors.status}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
            <ButtonGroup buttons={buttonConfig} />
        </Grid2>
      </Grid2>
    </ContentWrapper>
  );
};

export default MaintenancePlanModal;