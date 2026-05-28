"use client";
import React, { useState } from 'react';
import Grid2 from '@mui/material/Grid2';
import { InputField } from '@/components/ui';
import { NUMBERMAP } from '@/constants/common';
import { numberValidation } from '@/lib/utils/common';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { 
  MarketingHistoryModalData, 
  MarketingHistoryFormErrors, 
  MarketingHistoryModalProps 
} from '@/types/modules/regulation/executiveSummary';
import { 
  MODAL_TITLES, 
  MARKETING_HISTORY 
} from '@/constants/modules/regulation/executiveSummary';

const INITIAL_FORM_DATA: MarketingHistoryModalData = {
  year: '',
  quantity: '',
};

const INITIAL_ERRORS: MarketingHistoryFormErrors = {
  year: '',
  quantity: '',
};

const MarketingHistoryModal: React.FC<MarketingHistoryModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
}) => {
  const [marketingData, setMarketingData] = useState<MarketingHistoryModalData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<MarketingHistoryFormErrors>(INITIAL_ERRORS);

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setMarketingData(initialData);
    } else {
      setMarketingData(INITIAL_FORM_DATA);
    }
  }, [initialData]);

  const handleChange = (field: keyof MarketingHistoryModalData) => (value: string) => {
    // Apply number validation for year and quantity fields
    if ((field === 'year' || field === 'quantity') && value && !numberValidation.test(value)) {
      return; // Don't update if not a valid number
    }

    setMarketingData((prev: MarketingHistoryModalData) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev: MarketingHistoryFormErrors) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors = { ...INITIAL_ERRORS };
    let valid = true;

    if (!marketingData.year.trim()) {
      errors.year = MARKETING_HISTORY.FORM_ERRORS.YEAR_ERROR;
      valid = false;
    }

    if (!marketingData.quantity.trim()) {
      errors.quantity = MARKETING_HISTORY.FORM_ERRORS.QUANTITY_ERROR;
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const resetForm = () => {
    setMarketingData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_ERRORS);
  };

  const handleModalSave = () => {
    if (!validateForm()) return;
    onSave?.(marketingData);
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
      title={MODAL_TITLES.MARKETING_HISTORY}
    >
      <Grid2 container spacing={NUMBERMAP.ONE}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={MARKETING_HISTORY.FORM_LABELS.YEAR}
            placeholder={MARKETING_HISTORY.FORM_PLACEHOLDERS.YEAR}
            value={marketingData.year}
            onChange={handleChange('year')}
            error={formErrors.year}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={MARKETING_HISTORY.FORM_LABELS.QTY_MARKETED}
            placeholder={MARKETING_HISTORY.FORM_PLACEHOLDERS.QTY_MARKETED}
            value={marketingData.quantity}
            onChange={handleChange('quantity')}
            error={formErrors.quantity}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  );
};

export default MarketingHistoryModal;
