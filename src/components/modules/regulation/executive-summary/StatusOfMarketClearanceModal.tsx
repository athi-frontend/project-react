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
import { useFetchAgencies } from '@/hooks/modules/regulation/useExecutiveSummary';
import { 
  StatusOfMarketClearanceModalData, 
  StatusOfMarketClearanceFormErrors, 
  StatusOfMarketClearanceModalProps 
} from '@/types/modules/regulation/executiveSummary';
import { 
  MODAL_TITLES, 
  MARKET_CLEARANCE 
} from '@/constants/modules/regulation/executiveSummary';



const INITIAL_FORM_DATA: StatusOfMarketClearanceModalData = {
  regulatoryAgency: '',
  regulatoryAgencyId: '',
  indicationForUse: '',
  registrationStatus: '',
  date: '',
};

const INITIAL_ERRORS: StatusOfMarketClearanceFormErrors = {
  regulatoryAgency: '',
  regulatoryAgencyId: '',
  indicationForUse: '',
  registrationStatus: '',
  date: '',
};



const StatusOfMarketClearanceModal: React.FC<StatusOfMarketClearanceModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
}) => {
  const [marketClearanceData, setMarketClearanceData] = useState<StatusOfMarketClearanceModalData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<StatusOfMarketClearanceFormErrors>(INITIAL_ERRORS);

  // Fetch agency options
  const { data: agencyOptions = [], isLoading: agencyLoading, error: agencyError } = useFetchAgencies();

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setMarketClearanceData(initialData);
    } else {
      setMarketClearanceData(INITIAL_FORM_DATA);
    }
  }, [initialData]);

  const handleChange = (field: keyof StatusOfMarketClearanceModalData) => (value: string) => {
    setMarketClearanceData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegulatoryAgencyChange = (value: string) => {
    // Find the selected agency to get both ID and name
    const selectedAgency = agencyOptions.find(agency => agency.id.toString() === value);
    
    setMarketClearanceData((prev) => ({
      ...prev,
      regulatoryAgency: selectedAgency?.agency_name,
      regulatoryAgencyId: value,
    }));

    if (formErrors.regulatoryAgency) {
      setFormErrors((prev) => ({ ...prev, regulatoryAgency: '' }));
    }
    if (formErrors.regulatoryAgencyId) {
      setFormErrors((prev) => ({ ...prev, regulatoryAgencyId: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors = { ...INITIAL_ERRORS };
    let valid = true;

    if (!marketClearanceData.regulatoryAgencyId.trim()) {
      errors.regulatoryAgency = MARKET_CLEARANCE.FORM_ERRORS.REGULATORY_AGENCY_ERROR;
      valid = false;
    }

    if (!marketClearanceData.indicationForUse.trim()) {
      errors.indicationForUse = MARKET_CLEARANCE.FORM_ERRORS.INDICATION_FOR_USE_ERROR;
      valid = false;
    }

    if (!marketClearanceData.registrationStatus.trim()) {
      errors.registrationStatus = MARKET_CLEARANCE.FORM_ERRORS.REGISTRATION_STATUS_ERROR;
      valid = false;
    }

    if (!marketClearanceData.date.trim()) {
      errors.date = MARKET_CLEARANCE.FORM_ERRORS.DATE_ERROR;
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const resetForm = () => {
    setMarketClearanceData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_ERRORS);
  };

  const handleModalSave = () => {
    if (!validateForm()) return;
    onSave?.(marketClearanceData);
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
      title={MODAL_TITLES.MARKET_CLEARANCE}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={MARKET_CLEARANCE.FORM_LABELS.REGULATORY_AGENCY}
            placeholder={MARKET_CLEARANCE.FORM_PLACEHOLDERS.REGULATORY_AGENCY}
            isDropdown={true}
            value={marketClearanceData.regulatoryAgencyId}
            onChange={handleRegulatoryAgencyChange}
            options={agencyLoading || agencyError ? [] : agencyOptions}
            keyField={MARKET_CLEARANCE.KEY_FIELD.REGULATORY_AGENCY}
            valueField={MARKET_CLEARANCE.VALUE_FIELD.REGULATORY_AGENCY}
            dataSourceName={MARKET_CLEARANCE.DATA_TABLE_NAME.MARKET_CLEARANCE}
            dataFieldName={MARKET_CLEARANCE.DATA_FIELD_NAME.REGULATORY_AGENCY}
            dataIsAutocomplete={marketClearanceData.regulatoryAgencyId}
            error={formErrors.regulatoryAgency}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={MARKET_CLEARANCE.FORM_LABELS.INDICATION_FOR_USE}
            placeholder={MARKET_CLEARANCE.FORM_PLACEHOLDERS.INDICATION_FOR_USE}
            value={marketClearanceData.indicationForUse}
            onChange={handleChange(MARKET_CLEARANCE.DATA_CHANGE.INDICATION_FOR_USE)}
            error={formErrors.indicationForUse}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={MARKET_CLEARANCE.FORM_LABELS.REGISTRATION_STATUS}
            placeholder={MARKET_CLEARANCE.FORM_PLACEHOLDERS.REGISTRATION_STATUS}
            value={marketClearanceData.registrationStatus}
            onChange={handleChange(MARKET_CLEARANCE.DATA_CHANGE.REGISTRATION_STATUS)}
            error={formErrors.registrationStatus}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <DatePicker
            label={MARKET_CLEARANCE.FORM_LABELS.DATE}
            value={marketClearanceData.date ? dayjs(marketClearanceData.date) : null}
            onChange={(date: Dayjs | null) => {
              const stringValue = date?.format('YYYY-MM-DD') ?? '';
              setMarketClearanceData((prev: StatusOfMarketClearanceModalData) => ({
                ...prev,
                date: stringValue,
              }));
              if (formErrors.date) {
                setFormErrors((prev: StatusOfMarketClearanceFormErrors) => ({ ...prev, date: '' }));
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

export default StatusOfMarketClearanceModal;
