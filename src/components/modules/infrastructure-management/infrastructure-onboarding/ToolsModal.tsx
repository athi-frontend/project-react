"use client";
import React, { useState } from "react";
import { Grid2 } from "@mui/material";
import { InputField, ButtonGroup } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { ToolFormData, ToolsModalProps } from "@/types/modules/infrastructure-management/infrastructureOnboardingTabs";
import { 
    MAINTENANCE_PLAN_ERROR_MESSAGES as ERROR_MESSAGES,
    MAINTENANCE_PLAN_FORM_LABELS as FORM_LABELS,
    MAINTENANCE_PLAN_FORM_PLACEHOLDERS as FORM_PLACEHOLDERS,
    MAINTENANCE_PLAN_FORM_KEY_FIELDS as FORM_KEY_FIELDS,
    MAINTENANCE_PLAN_FORM_VALUE_FIELDS as FORM_VALUE_FIELDS,
    MAINTENANCE_PLAN_FORM_BUTTON_LABELS as FORM_BUTTON_LABELS,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";

/**
 * Classification : Confidential
 **/

const ToolsModal: React.FC<ToolsModalProps> = ({
    onSave,
    onCancel,
    onClose,
    initialData = {},
    toolsData,
    statusData
}) => {
    const [formData, setFormData] = useState<ToolFormData>({
        toolType: initialData.toolType ?? "",
        status: initialData.status ?? "",
    });

    const [errors, setErrors] = useState<Partial<ToolFormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<ToolFormData> = {};

        if (!formData.toolType) {
            newErrors.toolType = ERROR_MESSAGES.TOOL_TYPE_REQUIRED;
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

    const handleFieldChange = (field: keyof ToolFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleToolTypeChange = (value: string) => {
        handleFieldChange("toolType", value);
    };

    const handleToolStatusChange = (value: string) => {
        handleFieldChange("status", value);
    };

    const toolButtonConfig = [
        { label: FORM_BUTTON_LABELS.CANCEL, onClick: handleCancel },
        { label: FORM_BUTTON_LABELS.SAVE, onClick: handleSave },
    ];

    return (
        <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.TWELVE}>
                <InputField
                    label={FORM_LABELS.TOOL_TYPE}
                    placeholder={FORM_PLACEHOLDERS.SELECT_TOOL_CATEGORY}
                    isDropdown
                    value={formData.toolType}
                    onChange={handleToolTypeChange}
                    options={toolsData?.data ?? []}
                    keyField={FORM_KEY_FIELDS.TOOL_ID}
                    valueField={FORM_VALUE_FIELDS.TOOL_NAME}
                    error={errors.toolType}
                />
            </Grid2>

            <Grid2 size={NUMBERMAP.TWELVE}>
                <InputField
                    label={FORM_LABELS.STATUS}
                    placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                    isDropdown
                    value={formData.status}
                    onChange={handleToolStatusChange}
                    options={statusData?.data ?? []}
                    keyField={FORM_KEY_FIELDS.STATUS_ID}
                    valueField={FORM_VALUE_FIELDS.STATUS_NAME}
                    error={errors.status}
                />
            </Grid2>

            <Grid2 size={NUMBERMAP.TWELVE}>
                <ButtonGroup buttons={toolButtonConfig} />
            </Grid2>
        </Grid2>
    );
};

export default ToolsModal;