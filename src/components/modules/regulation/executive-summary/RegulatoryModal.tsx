"use client";
import React, { useState } from 'react';
import Grid2 from '@mui/material/Grid2';
import { InputField } from '@/components/ui';
import { useFetchCountries } from '@/hooks/modules/regulation/useExecutiveSummary';
import DatePicker from "@/components/ui/data-picker/DataPicker";
import { NUMBERMAP } from '@/constants/common';
import { GRID_SIZE } from '@/styles/modules/dnd/verification';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import dayjs, { Dayjs } from 'dayjs';
import { popup_style } from '@/styles/common';
import { 
  RegulatoryModalData, 
  RegulatoryFormErrors, 
  RegulatoryModalProps 
} from '@/types/modules/regulation/executiveSummary';
import { 
  MODAL_TITLES, 
  REGULATORY 
} from '@/constants/modules/regulation/executiveSummary';



const INITIAL_FORM_DATA: RegulatoryModalData = {
  country: '',
  approvedIndication: '',
  approvedShelfLife: '',
  classOfDevice: '',
  date: '',
};

const INITIAL_ERRORS: RegulatoryFormErrors = {
  country: '',
  approvedIndication: '',
  approvedShelfLife: '',
  classOfDevice: '',
  date: '',
};



const RegulatoryModal: React.FC<RegulatoryModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
}) => {
  const [regulatoryData, setRegulatoryData] = useState<RegulatoryModalData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<RegulatoryFormErrors>(INITIAL_ERRORS);

  // Fetch country options
  const { data: countryOptions = [], isLoading: countryLoading, error: countryError } = useFetchCountries();

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setRegulatoryData(initialData);
    } else {
      setRegulatoryData(INITIAL_FORM_DATA);
    }
  }, [initialData]);

  const handleChange = (field: keyof RegulatoryModalData) => (value: string | Dayjs | null) => {
    const stringValue = typeof value === 'string' ? value : value?.format('YYYY-MM-DD') ?? '';
    
    setRegulatoryData((prev) => ({
      ...prev,
      [field]: stringValue,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors = { ...INITIAL_ERRORS };
    let valid = true;

    if (!regulatoryData.country.trim()) {
      errors.country = REGULATORY.FORM_ERRORS.COUNTRY_ERROR;
      valid = false;
    }

    if (!regulatoryData.approvedIndication.trim()) {
      errors.approvedIndication = REGULATORY.FORM_ERRORS.APPROVED_INDICATION_ERROR;
      valid = false;
    }

    if (!regulatoryData.approvedShelfLife.trim()) {
      errors.approvedShelfLife = REGULATORY.FORM_ERRORS.APPROVED_SHELF_LIFE_ERROR;
      valid = false;
    }

    if (!regulatoryData.classOfDevice.trim()) {
      errors.classOfDevice = REGULATORY.FORM_ERRORS.CLASS_OF_DEVICE_ERROR;
      valid = false;
    }

    if (!regulatoryData.date.trim()) {
      errors.date = REGULATORY.FORM_ERRORS.DATE_ERROR;
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const resetForm = () => {
    setRegulatoryData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_ERRORS);
  };

  const handleModalSave = () => {
    if (!validateForm()) return;
    onSave?.(regulatoryData);
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
      title={MODAL_TITLES.REGULATORY_APPROVALS}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={REGULATORY.FORM_LABELS.COUNTRY}
            placeholder={REGULATORY.FORM_PLACEHOLDERS.COUNTRY}
            isDropdown={true}
            value={regulatoryData.country}
            onChange={handleChange(REGULATORY.DATA_CHANGE.COUNTRY)}
            options={countryLoading || countryError ? [] : countryOptions}
            keyField={REGULATORY.KEY_FIELD.COUNTRY}
            valueField={REGULATORY.VALUE_FIELD.COUNTRY}
            dataSourceName={REGULATORY.DATA_TABLE_NAME.REGULATORY_APPROVALS}
            dataFieldName={REGULATORY.DATA_FIELD_NAME.COUNTRY}
            dataIsAutocomplete={regulatoryData.country}
            error={formErrors.country}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={REGULATORY.FORM_LABELS.APPROVED_INDICATION}
            placeholder={REGULATORY.FORM_PLACEHOLDERS.APPROVED_INDICATION}
            value={regulatoryData.approvedIndication}
            onChange={handleChange(REGULATORY.DATA_CHANGE.APPROVED_INDICATION)}
            error={formErrors.approvedIndication}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={REGULATORY.FORM_LABELS.APPROVED_SHELF_LIFE}
            placeholder={REGULATORY.FORM_PLACEHOLDERS.APPROVED_SHELF_LIFE}
            value={regulatoryData.approvedShelfLife}
            onChange={handleChange(REGULATORY.DATA_CHANGE.APPROVED_SHELF_LIFE)}
            error={formErrors.approvedShelfLife}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={REGULATORY.FORM_LABELS.CLASS_OF_DEVICE}
            placeholder={REGULATORY.FORM_PLACEHOLDERS.CLASS_OF_DEVICE}
            value={regulatoryData.classOfDevice}
            onChange={handleChange(REGULATORY.DATA_CHANGE.CLASS_OF_DEVICE)}
            error={formErrors.classOfDevice}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <DatePicker
            label={REGULATORY.FORM_LABELS.DATE}
            value={regulatoryData.date ? dayjs(regulatoryData.date) : null}
            onChange={(date: Dayjs | null) => {
              const stringValue = date?.format('YYYY-MM-DD') ?? '';
              setRegulatoryData((prev: RegulatoryModalData) => ({
                ...prev,
                date: stringValue,
              }));
              if (formErrors.date) {
                setFormErrors((prev: RegulatoryFormErrors) => ({ ...prev, date: '' }));
              }
            }}
            dataIsAutocomplete=""
            error={formErrors.date}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  );
};

export default RegulatoryModal;
