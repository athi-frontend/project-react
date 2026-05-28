"use client";
import React, { useState } from 'react';
import Grid2 from '@mui/material/Grid2';
import { InputField, Description } from '@/components/ui';
import DatePicker from "@/components/ui/data-picker/DataPicker";
import { NUMBERMAP } from '@/constants/common';
import { GRID_SIZE } from '@/styles/modules/dnd/verification';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import dayjs, { Dayjs } from 'dayjs';
import { popup_style } from '@/styles/common';
import { useFetchCountries } from '@/hooks/modules/regulation/useExecutiveSummary';
import { 
  FscaModalData, 
  FscaFormErrors, 
  FscaModalProps,
} from '@/types/modules/regulation/executiveSummary';
import { 
  MODAL_TITLES, 
  FSCA 
} from '@/constants/modules/regulation/executiveSummary';



const INITIAL_FORM_DATA: FscaModalData = {
  date: '',
  reasonForFsca: '',
  countries: [],
  actionDescription: '',
};

const INITIAL_ERRORS: FscaFormErrors = {
  date: '',
  reasonForFsca: '',
  countries: '',
  actionDescription: '',
};



const FscaModal: React.FC<FscaModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
}) => {
  const [fscaFormData, setFscaFormData] = useState<FscaModalData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<FscaFormErrors>(INITIAL_ERRORS);
  const { data: countryOptions = [] } = useFetchCountries();
  
  // Helper function to get selected country ID for dropdown display
  const getSelectedCountryId = (): string => {
    if (fscaFormData.countries.length === NUMBERMAP.ZERO) return '';
    return fscaFormData.countries[0].id.toString();
  };
  

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      // If editing and countries is an array of numbers (IDs), fetch the names from countryOptions
      if (initialData.countries && initialData.countries.length > NUMBERMAP.ZERO && typeof initialData.countries[0] === 'number') {
        const countriesWithNames = (initialData.countries as number[]).map((countryId: number) => {
          const countryOption = countryOptions.find((option: any) => option.id === countryId);
          return {
            id: countryId,
            country_name: countryOption?.country_name ?? ''
          };
        });
        setFscaFormData({
          ...initialData,
          countries: countriesWithNames
        } as FscaModalData);
      } else {
        setFscaFormData(initialData as FscaModalData);
      }
    } else {
      setFscaFormData(INITIAL_FORM_DATA);
    }
  }, [initialData, countryOptions]);

  const handleInputChange = (field: keyof FscaModalData, value: string) => {
    setFscaFormData((prev) => ({
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

    if (!fscaFormData.date.trim()) {
      errors.date = FSCA.FORM_ERRORS.DATE_ERROR;
      valid = false;
    }

    if (!fscaFormData.reasonForFsca.trim()) {
      errors.reasonForFsca = FSCA.FORM_ERRORS.REASON_FOR_FSCA_ERROR;
      valid = false;
    }

    if (!fscaFormData.actionDescription.trim()) {
      errors.actionDescription = FSCA.FORM_ERRORS.ACTION_DESCRIPTION_ERROR;
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const resetForm = () => {
    setFscaFormData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_ERRORS);
  };

  const handleModalSave = () => {
    if (!validateForm()) return;
    onSave?.(fscaFormData);
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
      title={MODAL_TITLES.FIELD_SAFETY_CORRECTIVE_ACTION}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <DatePicker
            label={FSCA.FORM_LABELS.DATE}
            value={fscaFormData.date ? dayjs(fscaFormData.date) : null}
            onChange={(date: Dayjs | null) => {
              const stringValue = date?.format('YYYY-MM-DD') ?? '';
              setFscaFormData((prev: FscaModalData) => ({
                ...prev,
                date: stringValue,
              }));
              if (formErrors.date) {
                setFormErrors((prev: FscaFormErrors) => ({ ...prev, date: '' }));
              }
            }}
            dataIsAutocomplete=""
            error={formErrors.date}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <Description
            {...FSCA.FORM_FIELDS_CONFIG.REASON_FOR_FSCA}
            label={FSCA.FORM_LABELS.REASON_FOR_FSCA}
            placeholder={FSCA.FORM_PLACEHOLDERS.REASON_FOR_FSCA}
            value={fscaFormData.reasonForFsca ?? ''}
            onChange={(value) =>
              handleInputChange(
                FSCA.FORM_FIELDS_CONFIG.REASON_FOR_FSCA.onChange,
                value
              )
            }
            error={formErrors.reasonForFsca}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={FSCA.FORM_LABELS.COUNTRIES}
            placeholder={FSCA.FORM_PLACEHOLDERS.COUNTRIES}
            value={getSelectedCountryId()}
            onChange={(selectedCountryId: string) => {
              if (selectedCountryId) {
                const selectedCountry = countryOptions.find(country => country.id.toString() === selectedCountryId);
                if (selectedCountry) {
                  setFscaFormData(prev => ({
                    ...prev,
                    countries: [{ id: selectedCountry.id, country_name: selectedCountry.country_name }]
                  }));
                }
              } else {
                setFscaFormData(prev => ({
                  ...prev,
                  countries: []
                }));
              }
              if (formErrors.countries) {
                setFormErrors(prev => ({ ...prev, countries: '' }));
              }
            }}
            dataSourceName={FSCA.DATA_TABLE_NAME.FSCA}
            dataFieldName={FSCA.DATA_FIELD_NAME.COUNTRIES}
            error={formErrors.countries}
            
              keyField={"id"}
            valueField={"country_name"}
            isDropdown={true}
            options={countryOptions}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <Description
            {...FSCA.FORM_FIELDS_CONFIG.ACTION_DESCRIPTION}
             label={FSCA.FORM_LABELS.ACTION_DESCRIPTION}
            placeholder={FSCA.FORM_PLACEHOLDERS.ACTION_DESCRIPTION}
            value={fscaFormData.actionDescription ?? ''}
            onChange={(value) =>
              handleInputChange(
                FSCA.FORM_FIELDS_CONFIG.ACTION_DESCRIPTION.onChange,
                value
              )
            }
            error={formErrors.actionDescription}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  );
};

export default FscaModal;
