"use client";
import React, { useState } from 'react';
import Grid2 from '@mui/material/Grid2';
import { InputField } from '@/components/ui';
import DatePicker from "@/components/ui/data-picker/DataPicker";
import { NUMBERMAP } from '@/constants/common';
import { GRID_SIZE } from '@/styles/modules/dnd/verification';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import dayjs, { Dayjs } from 'dayjs';
import { popup_style } from '@/styles/common';
import { numberValidation } from '@/lib/utils/common';
import {
  AdverseEventModalData,
  AdverseEventFormErrors,
  AdverseEventModalProps
} from '@/types/modules/regulation/executiveSummary';
import {
  MODAL_TITLES,
  ADVERSE_EVENT
} from '@/constants/modules/regulation/executiveSummary';



const INITIAL_FORM_DATA: AdverseEventModalData = {
  seriousAdverseEvent: '',
  startDate: '',
  endDate: '',
  numberOfSAE: '',
  totalUnitsSold: '',
};

const INITIAL_ERRORS: AdverseEventFormErrors = {
  seriousAdverseEvent: '',
  startDate: '',
  endDate: '',
  numberOfSAE: '',
  totalUnitsSold: '',
};



const AdverseEventModal: React.FC<AdverseEventModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
}) => {
  const [adverseEventData, setAdverseEventData] = useState<AdverseEventModalData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<AdverseEventFormErrors>(INITIAL_ERRORS);

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setAdverseEventData(initialData);
    } else {
      setAdverseEventData(INITIAL_FORM_DATA);
    }
  }, [initialData]);

  const handleChange = (field: keyof AdverseEventModalData) => (value: string) => {
    // Apply number validation for numberOfSAE and totalUnitsSold fields
    if ((field === 'numberOfSAE' || field === 'totalUnitsSold') && value && !numberValidation.test(value)) {
      return; // Don't update if not a valid number
    }

    setAdverseEventData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors = { ...INITIAL_ERRORS };
    let valid = true;

    if (!adverseEventData.seriousAdverseEvent.trim()) {
      errors.seriousAdverseEvent = ADVERSE_EVENT.FORM_ERRORS.SERIOUS_ADVERSE_EVENT_ERROR;
      valid = false;
    }

    if (!adverseEventData.startDate.trim()) {
      errors.startDate = ADVERSE_EVENT.FORM_ERRORS.START_DATE_ERROR;
      valid = false;
    }

    if (!adverseEventData.endDate.trim()) {
      errors.endDate = ADVERSE_EVENT.FORM_ERRORS.END_DATE_ERROR;
      valid = false;
    }

    // Validate date range if both dates are present
    if (adverseEventData.startDate.trim() && adverseEventData.endDate.trim()) {
      const dateRangeError = validateDateRange(adverseEventData.startDate, adverseEventData.endDate);
      if (dateRangeError) {
        errors.startDate = ADVERSE_EVENT.FORM_ERRORS.START_DATE_RANGE_ERROR;
        errors.endDate = ADVERSE_EVENT.FORM_ERRORS.END_DATE_RANGE_ERROR;
        valid = false;
      }
    }

    if (!adverseEventData.numberOfSAE.trim()) {
      errors.numberOfSAE = ADVERSE_EVENT.FORM_ERRORS.NUMBER_OF_SAE_ERROR;
      valid = false;
    }

    if (!adverseEventData.totalUnitsSold.trim()) {
      errors.totalUnitsSold = ADVERSE_EVENT.FORM_ERRORS.TOTAL_UNITS_SOLD_ERROR;
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const resetForm = () => {
    setAdverseEventData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_ERRORS);
  };

  const handleModalSave = () => {
    if (!validateForm()) return;
    onSave?.(adverseEventData);
    resetForm();
    onClose?.();
  };

  const handleModalClose = () => {
    resetForm();
    onCancel?.();
    onClose?.();
  };

  const validateDateRange = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      if (start.isAfter(end)) {
        return ADVERSE_EVENT.FORM_ERRORS.DATE_RANGE_ERROR;
      }
    }
    return '';
  };

  // Helper function to handle date change and validation
  const handleDateChange = (field: keyof Pick<AdverseEventModalData, 'startDate' | 'endDate'>, newValue: string) => {
    setAdverseEventData((prev) => ({ ...prev, [field]: newValue }));

    // Clear the current field's error
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // Get both dates for validation
    const startDate = field === ADVERSE_EVENT.DATA_CHANGE.START_DATE ? newValue : adverseEventData.startDate;
    const endDate = field === ADVERSE_EVENT.DATA_CHANGE.END_DATE ? newValue : adverseEventData.endDate;

    // If both dates are present, validate range and clear errors if valid
    if (startDate && endDate) {
      const dateRangeError = validateDateRange(startDate, endDate);
      if (!dateRangeError) {
        // Clear both date errors if range is valid
        setFormErrors((prev) => ({ 
          ...prev, 
          startDate: (prev.startDate === ADVERSE_EVENT.FORM_ERRORS.START_DATE_RANGE_ERROR) ? '' : prev.startDate,
          endDate: (prev.endDate === ADVERSE_EVENT.FORM_ERRORS.END_DATE_RANGE_ERROR) ? '' : prev.endDate
        }));
      }
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={handleModalClose}
      onSave={handleModalSave}
      buttonRequired
      title={MODAL_TITLES.SERIOUS_ADVERSE_EVENT}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={ADVERSE_EVENT.FORM_LABELS.SERIOUS_ADVERSE_EVENT}
            placeholder={ADVERSE_EVENT.FORM_PLACEHOLDERS.SERIOUS_ADVERSE_EVENT}
            value={adverseEventData.seriousAdverseEvent}
            onChange={handleChange(ADVERSE_EVENT.DATA_CHANGE.SERIOUS_ADVERSE_EVENT)}
            dataSourceName={ADVERSE_EVENT.DATA_TABLE_NAME.ADVERSE_EVENT}
            dataFieldName={ADVERSE_EVENT.DATA_FIELD_NAME.SERIOUS_ADVERSE_EVENT}
            error={formErrors.seriousAdverseEvent}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <DatePicker
            label={ADVERSE_EVENT.FORM_LABELS.START_DATE}
            value={adverseEventData.startDate ? dayjs(adverseEventData.startDate) : null}
            onChange={(date: Dayjs | null) => {
              const stringValue = date?.format('YYYY-MM-DD') ?? '';
              handleDateChange(ADVERSE_EVENT.DATA_CHANGE.START_DATE, stringValue);
            }}
            dataIsAutocomplete=""
            error={formErrors.startDate}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <DatePicker
            label={ADVERSE_EVENT.FORM_LABELS.END_DATE}
            value={adverseEventData.endDate ? dayjs(adverseEventData.endDate) : null}
            onChange={(date: Dayjs | null) => {
              const stringValue = date?.format('YYYY-MM-DD') ?? '';
              handleDateChange(ADVERSE_EVENT.DATA_CHANGE.END_DATE, stringValue);
            }}
            dataIsAutocomplete=""
            error={formErrors.endDate}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={ADVERSE_EVENT.FORM_LABELS.NUMBER_OF_SAE}
            placeholder={ADVERSE_EVENT.FORM_PLACEHOLDERS.NUMBER_OF_SAE}
            value={adverseEventData.numberOfSAE}
            onChange={handleChange(ADVERSE_EVENT.DATA_CHANGE.NUMBER_OF_SAE)}
            dataSourceName={ADVERSE_EVENT.DATA_TABLE_NAME.ADVERSE_EVENT}
            dataFieldName={ADVERSE_EVENT.DATA_FIELD_NAME.NUMBER_OF_SAE}
            error={formErrors.numberOfSAE}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={ADVERSE_EVENT.FORM_LABELS.TOTAL_UNITS_SOLD}
            placeholder={ADVERSE_EVENT.FORM_PLACEHOLDERS.TOTAL_UNITS_SOLD}
            value={adverseEventData.totalUnitsSold}
            onChange={handleChange(ADVERSE_EVENT.DATA_CHANGE.TOTAL_UNITS_SOLD)}
            dataSourceName={ADVERSE_EVENT.DATA_TABLE_NAME.ADVERSE_EVENT}
            dataFieldName={ADVERSE_EVENT.DATA_FIELD_NAME.TOTAL_UNITS_SOLD}
            error={formErrors.totalUnitsSold}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  );
};

export default AdverseEventModal;
