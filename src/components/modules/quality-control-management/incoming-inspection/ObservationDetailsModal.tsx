"use client";

import React from "react";
import { Grid2 } from "@mui/material";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import { InputField, RadioButtonGroup, RichTextEditor } from "@/components/ui";
import { NUMBERMAP } from "@/constants/common";
import { POPUP_STYLE } from "@/styles/modules/dnd/designReviewReport";

export interface ObservationDetailsModalFormData {
  unitNumber: string;
  serialNumber: string;
  testObservation: string;
  testResult: string;
}

export interface ObservationDetailsModalErrors {
  unitNumber: string;
  serialNumber: string;
  testObservation: string;
  testResult: string;
}

interface ObservationDetailsModalProps {
  open: boolean;
  hasEditPermission: boolean;
  formData: ObservationDetailsModalFormData;
  errors: ObservationDetailsModalErrors;
  onClose: () => void;
  onSave: () => void;
  onChange: (next: ObservationDetailsModalFormData) => void;
  onErrorsChange: (next: ObservationDetailsModalErrors) => void;
}

const ObservationDetailsModal: React.FC<ObservationDetailsModalProps> = ({
  open,
  hasEditPermission,
  formData,
  errors,
  onClose,
  onSave,
  onChange,
  onErrorsChange,
}) => {
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Observation Details"
      buttonRequired={true}
      modalMaxWidth="800px"
      onSave={onSave}
    >
      <Grid2 spacing={NUMBERMAP.TWO} container sx={POPUP_STYLE}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label="Unit Number"
            placeholder="Enter Unit Number"
            value={formData.unitNumber}
            onChange={(value: string) => {
              onChange({ ...formData, unitNumber: value });
              if (value && value.trim() !== "") {
                onErrorsChange({ ...errors, unitNumber: "" });
              }
            }}
            error={errors.unitNumber}
            hasEditable={!hasEditPermission}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label="Serial Number"
            placeholder="Enter Serial Number"
            value={formData.serialNumber}
            onChange={(value: string) => {
              onChange({ ...formData, serialNumber: value });
              if (value && value.trim() !== "") {
                onErrorsChange({ ...errors, serialNumber: "" });
              }
            }}
            error={errors.serialNumber}
            hasEditable={!hasEditPermission}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <RichTextEditor
            label="Test Observation"
            value={formData.testObservation}
            onChange={(value: string) => {
              onChange({ ...formData, testObservation: value });
              if (value && value.trim() !== "") {
                onErrorsChange({ ...errors, testObservation: "" });
              }
            }}
            error={errors.testObservation}
            placeholder="Enter Test Observation"
            disabled={!hasEditPermission}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <RadioButtonGroup
            label="Test Result"
            name="testResult"
            options={[
              { value: "pass", label: "Pass" },
              { value: "fail", label: "Fail" },
            ]}
            value={formData.testResult}
            onChange={(value: string | number) => {
              onChange({ ...formData, testResult: String(value) });
              if (value) {
                onErrorsChange({ ...errors, testResult: "" });
              }
            }}
            error={errors.testResult}
            disabled={!hasEditPermission}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  );
};

export default ObservationDetailsModal;
