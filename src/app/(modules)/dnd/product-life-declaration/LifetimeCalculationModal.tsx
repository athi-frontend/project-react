"use client";
import React, { useState, useEffect } from "react";
import { Grid2 } from "@mui/material";
import { ButtonGroup, InputField, Description } from "@/components/ui";
import { ContentWrapper } from "@/styles/modules/hr/addEmployee";
import { popup_style } from "@/styles/common";
import { LifeTimePopupFormProps } from "@/types/modules/dnd/productLifeDeclaration";
import { MODAL, PRODUCT_LIFE_DECLARATION } from "@/constants/modules/dnd/productLifeDeclaration";
import { NUMBERMAP } from "@/constants/common";
/**
 Classification : Confidential
**/

const LifeTimePopupForm: React.FC<LifeTimePopupFormProps> = ({
  onClose,
  onSave,
  editData,
  hasEditPermission = true,
}) => {
  const [partNo, setPartNo] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<{ partNo?: string }>({});

  // Centralized function to initialize form fields
  const initializeFormFields = (data: typeof editData) => {
    setPartNo(data?.partNo ?? "");
    setDescription(data?.description ?? "");
    setRemarks(data?.remarks ?? "");
  };

  // Use effect to handle editData changes
  useEffect(() => {
    initializeFormFields(editData);
  }, [editData]);

  const validateFields = () => {
    const newErrors: { partNo?: string } = {};

    setErrors(newErrors);
    return Object.keys(newErrors).length === NUMBERMAP.ZERO;
  };

  const handleInputChange = (field: string, value: string) => {
    if(!hasEditPermission) return;
    // Clear error for the field when user starts typing
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    switch (field) {
      case MODAL.PARTNO:
        setPartNo(value);
        break;
      case MODAL.DESCRIPTION:
        setDescription(value);
        break;
      case MODAL.REMARKS:
        setRemarks(value);
        break;
    }
  };

  const handleSave = () => {
    if (validateFields()) {
      if (onSave) {
        onSave({ partNo, description, remarks });
      }
    }
  };

  const buttons = [
    { label: PRODUCT_LIFE_DECLARATION.CANCEL, onClick: onClose },
    { label: PRODUCT_LIFE_DECLARATION.SAVE, onClick: handleSave, disabled: !hasEditPermission },
  ];

  return (
    <ContentWrapper>
      <Grid2 sx={popup_style}>
        <Grid2 container direction="column" spacing={1}>
          <Grid2>
            <InputField
              label={PRODUCT_LIFE_DECLARATION.PART_NO}
              placeholder={PRODUCT_LIFE_DECLARATION.ENTER_PART_NO}
              value={partNo}
              onChange={(val) => handleInputChange(MODAL.PARTNO, val as string)}
              error={errors.partNo}
              hasEditable={!hasEditPermission}
            />
          </Grid2>

          <Grid2>
            <Description
              label={PRODUCT_LIFE_DECLARATION.DESCRIPTION}
              value={description}
              onChange={(val) => handleInputChange(MODAL.DESCRIPTION, val)}
              placeholder={PRODUCT_LIFE_DECLARATION.INPUT_TEXT}
            />
          </Grid2>

          <Grid2>
            <Description
              label={PRODUCT_LIFE_DECLARATION.REMARKS}
              value={remarks}
              onChange={(val) => handleInputChange(MODAL.REMARKS, val)}
              placeholder={PRODUCT_LIFE_DECLARATION.INPUT_TEXT}
            />
          </Grid2>
        </Grid2>
      </Grid2>

      <ButtonGroup buttons={buttons} />
    </ContentWrapper>
  );
};

export default LifeTimePopupForm;