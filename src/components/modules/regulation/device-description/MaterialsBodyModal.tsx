import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import { InputField } from '@/components/ui';
import { NUMBERMAP } from '@/constants/common';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { MaterialsBodyFormData, MaterialsBodyModalProps } from '@/types/modules/regulation/deviceDescriptionTypes';

const INITIAL_FORM_DATA: MaterialsBodyFormData = { part_name: '', material: '' };
const INITIAL_ERRORS = { part_name: '', material: '' };

const FORM_ERRORS = {
  PART_NAME_ERROR: 'Part Name is required',
  MATERIAL_ERROR: 'Material is required',
};

const MaterialsBodyModal: React.FC<MaterialsBodyModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  defaultValues,
  title,
}) => {
  const [materialsData, setMaterialsData] = useState<MaterialsBodyFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_ERRORS);

  useEffect(() => {
    if (open && defaultValues) {
      setMaterialsData(defaultValues);
    } else if (!open) {
      setMaterialsData(INITIAL_FORM_DATA);
      setFormErrors(INITIAL_ERRORS);
    }
  }, [open, defaultValues]);

  const handleChange = (field: keyof MaterialsBodyFormData) => (value: string) => {
    setMaterialsData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = { ...INITIAL_ERRORS };
    let valid = true;
    if (!materialsData.part_name.trim()) {
      errors.part_name = FORM_ERRORS.PART_NAME_ERROR;
      valid = false;
    }
    if (!materialsData.material.trim()) {
      errors.material = FORM_ERRORS.MATERIAL_ERROR;
      valid = false;
    }
    setFormErrors(errors);
    return valid;
  };

  const resetForm = () => {
    setMaterialsData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_ERRORS);
  };

  const handleModalSave = () => {
    if (!validateForm()) return;
    // Trim part_name and material before saving
    const trimmedData = {
      part_name: materialsData.part_name.trim(),
      material: materialsData.material.trim(),
    };
    onSave?.(trimmedData);
    resetForm();
    onClose?.();
  };

  const handleModalClose = () => {
    resetForm();
    onCancel?.();
    onClose?.();
  };

  return (
    <CommonModal
      open={open}
      onClose={handleModalClose}
      onSave={handleModalSave}
      buttonRequired
      title={title}
    >
      <Grid2 container spacing={NUMBERMAP.TWO}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label="Part Name*"
            placeholder="Enter Part Name"
            value={materialsData.part_name}
            onChange={handleChange('part_name')}
            error={formErrors.part_name}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label="Material*"
            placeholder="Enter Material"
            value={materialsData.material}
            onChange={handleChange('material')}
            error={formErrors.material}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  );
};

export default MaterialsBodyModal;