"use client";

import React, { useState } from "react";
import { Grid2 } from "@mui/material";
import { InputField, ButtonGroup } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { 
  MAINTENANCE_PLAN_ERROR_MESSAGES as ERROR_MESSAGES,
  MAINTENANCE_PLAN_FORM_LABELS as FORM_LABELS,
  MAINTENANCE_PLAN_FORM_PLACEHOLDERS as FORM_PLACEHOLDERS,
  MAINTENANCE_PLAN_FORM_KEY_FIELDS as FORM_KEY_FIELDS,
  MAINTENANCE_PLAN_FORM_VALUE_FIELDS as FORM_VALUE_FIELDS,
  MAINTENANCE_PLAN_FORM_BUTTON_LABELS as FORM_BUTTON_LABELS,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";
import { EquipmentFormData, EquipmentModalProps } from "@/types/modules/infrastructure-management/infrastructureOnboardingTabs";

/**
 * Classification : Confidential
 **/

const EquipmentModal: React.FC<EquipmentModalProps> = ({
  onSave,
  onCancel,
  initialData = {},
  equipmentData,
  statusData,
}) => {
  const [formData, setFormData] = useState<EquipmentFormData>({
    equipmentType: initialData.equipmentType ?? "",
    status: initialData.status ?? "",
  });

  const [errors, setErrors] = useState<Partial<EquipmentFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<EquipmentFormData> = {};

    if (!formData.equipmentType) {
      newErrors.equipmentType = ERROR_MESSAGES.EQUIPMENT_TYPE_REQUIRED;
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

  const handleFieldChange = (field: keyof EquipmentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEquipmentTypeChange = (value: string) => {
    handleFieldChange("equipmentType", value);
  };

  const handleEquipmentStatusChange = (value: string) => {
    handleFieldChange("status", value);
  };

  const equipmentButtonConfig = [
    { label: FORM_BUTTON_LABELS.CANCEL, onClick: handleCancel },
    { label: FORM_BUTTON_LABELS.SAVE, onClick: handleSave },
  ];

  return (
    <Grid2 container spacing={NUMBERMAP.TWO}>
      <Grid2 size={NUMBERMAP.TWELVE}>
        <InputField
          label={FORM_LABELS.EQUIPMENT_TYPE}
          placeholder={FORM_PLACEHOLDERS.SELECT_EQUIPMENT_TYPE}
          isDropdown
          value={formData.equipmentType}
          onChange={handleEquipmentTypeChange}
          options={equipmentData?.data ?? []}
          keyField={FORM_KEY_FIELDS.EQUIPMENT_ID}
          valueField={FORM_VALUE_FIELDS.EQUIPMENT_NAME}
          error={errors.equipmentType}
        />
      </Grid2>

      <Grid2 size={NUMBERMAP.TWELVE}>
        <InputField
          label={FORM_LABELS.STATUS}
          placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
          isDropdown
          value={formData.status}
          onChange={handleEquipmentStatusChange}
          options={statusData?.data ?? []}
          keyField={FORM_KEY_FIELDS.STATUS_ID}
          valueField={FORM_VALUE_FIELDS.STATUS_NAME}
          error={errors.status}
        />
      </Grid2>

      <Grid2 size={NUMBERMAP.TWELVE}>
        <ButtonGroup buttons={equipmentButtonConfig} />
      </Grid2>
    </Grid2>
  );
};

export default EquipmentModal;