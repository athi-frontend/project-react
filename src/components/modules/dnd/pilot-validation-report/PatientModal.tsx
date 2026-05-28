import React, { useState, useEffect } from 'react';
import { InputField, Description, RadioButtonGroup, RichTextEditor } from '@/components/ui';
import { Grid2, Box } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { PATIENT_MODAL, PATIENT_FIELD_ORDER, PATIENT_FIELD_LABEL_MAP } from '@/constants/modules/dnd/pilotValidationReport';
import { NUMBERMAP } from '@/constants/common';
import { popup_style } from '@/styles/common';
import { format, parseISO } from 'date-fns';
import { PatientModalProps } from '@/types/modules/dnd/pilotValidationReport';
import { numberValidation } from '@/lib/utils/common';
import { 
  dateTimeBoxSx,
  dateTimeLabelSx,
  dateTimePickerSx,
} from '@/styles/modules/dnd/pilotValidationReport';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';
import { useSelector } from 'react-redux';
import { selectProfileData } from '@/store/slices/menuSlice';
/**
    Classification : Confidential
**/
const PatientModal: React.FC<PatientModalProps> = ({
  open,
  onClose,
  onSave,
  patientForm,
  handlePatientChange,
  editPatientId,
  hasEditPermission = true,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const profileData = useSelector(selectProfileData) as any;

  useEffect(() => {
    setErrors({});
  }, [open, editPatientId]);

  const validate = () => {
     /**
     * Function Name: validate
     * Params: none
     * Description: use to validate the patient popup form,
     * Modified By : Savitri K,
     * Modified : 11-09-2025,
     * Classification : Confidential
    **/
    const newErrors: { [key: string]: string } = {};
    if (!patientForm[PATIENT_MODAL.FIELDS.PATIENT_NAME]?.trim()) newErrors[PATIENT_MODAL.FIELDS.PATIENT_NAME] = PATIENT_MODAL.ERRORS.PATIENT_NAME;
    if (!patientForm[PATIENT_MODAL.FIELDS.DATE_TIME]) newErrors[PATIENT_MODAL.FIELDS.DATE_TIME] = PATIENT_MODAL.ERRORS.DATE_TIME;
    if (!patientForm[PATIENT_MODAL.FIELDS.AGE]) newErrors[PATIENT_MODAL.FIELDS.AGE] = PATIENT_MODAL.ERRORS.AGE;
    if (!patientForm[PATIENT_MODAL.FIELDS.GENDER]) newErrors[PATIENT_MODAL.FIELDS.GENDER] = PATIENT_MODAL.ERRORS.GENDER;
    if (!patientForm[PATIENT_MODAL.FIELDS.PARAMETERS_MEASURED]?.trim()) newErrors[PATIENT_MODAL.FIELDS.PARAMETERS_MEASURED] = PATIENT_MODAL.ERRORS.PARAMETERS_MEASURED;
    if (!patientForm[PATIENT_MODAL.FIELDS.MEASURED_VALUE]?.trim()) newErrors[PATIENT_MODAL.FIELDS.MEASURED_VALUE] = PATIENT_MODAL.ERRORS.MEASURED_VALUES;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      validateAndFocusFirstEmptyField(patientForm, Array.from(PATIENT_FIELD_ORDER), PATIENT_FIELD_LABEL_MAP);
    }
    return Object.keys(newErrors).length === NUMBERMAP.ZERO;
  };

  const handleSave = () => {
    if(!hasEditPermission) return;
    if (validate()) {
      onSave();
    }
  };

  const handleFieldChange  = (field: string, value: any) => {
    if(!hasEditPermission) return;
    const formattedValue = field === PATIENT_MODAL.FIELDS.DATE_TIME && value ? format(value, PATIENT_MODAL.DATE_FORMAT) : value;
    handlePatientChange(field, formattedValue);
    setErrors((prev) => ({ ...prev, [field]: PATIENT_MODAL.MISC.EMPTY_STRING }));
  };

  const handleAgeChange = (value: string) => {
    if(!hasEditPermission) return;
    if (value === '' || numberValidation.test(value)) {
      handlePatientChange(PATIENT_MODAL.FIELDS.AGE, value ? Number(value) : "");
      setErrors((prev) => ({
        ...prev,
        [PATIENT_MODAL.FIELDS.AGE]: PATIENT_MODAL.MISC.EMPTY_STRING,
      }));
    }
  };

  const parsedDateTime = patientForm[PATIENT_MODAL.FIELDS.DATE_TIME] ? parseISO(patientForm[PATIENT_MODAL.FIELDS.DATE_TIME]) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CommonModal
        title={editPatientId ? PATIENT_MODAL.TITLE_EDIT : PATIENT_MODAL.TITLE_ADD}
        open={open}
        buttonRequired
        onClose={onClose}
        onSave={handleSave}
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={PATIENT_MODAL.LABELS.PATIENT_NAME}
              placeholder={PATIENT_MODAL.PLACEHOLDERS.PATIENT_NAME}
              value={patientForm[PATIENT_MODAL.FIELDS.PATIENT_NAME]}
              onChange={(value) => handleFieldChange(PATIENT_MODAL.FIELDS.PATIENT_NAME, value)}
              error={errors[PATIENT_MODAL.FIELDS.PATIENT_NAME]}
              hasEditable={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE} id={PATIENT_FIELD_LABEL_MAP.dateTime}>
            <Box sx={dateTimeBoxSx}>
              <Box sx={dateTimeLabelSx}>
                {PATIENT_MODAL.LABELS.DATE_TIME}
              </Box>
              <DateTimePicker
                value={parsedDateTime}
                onChange={(newValue) => handleFieldChange(PATIENT_MODAL.FIELDS.DATE_TIME, newValue)}
                disabled={!hasEditPermission}
                format={`${profileData?.organization_date_format} ${profileData?.organization_time_format}`}
                slotProps={{
                  textField: {
                    placeholder: PATIENT_MODAL.PLACEHOLDERS.DATE_TIME,
                    error: !!errors[PATIENT_MODAL.FIELDS.DATE_TIME],
                    helperText: errors[PATIENT_MODAL.FIELDS.DATE_TIME],
                    fullWidth: true,
                    sx: dateTimePickerSx,
                  },
                }}
              />
            </Box>
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={PATIENT_MODAL.LABELS.AGE}
              placeholder={PATIENT_MODAL.PLACEHOLDERS.AGE}
              value={patientForm[PATIENT_MODAL.FIELDS.AGE]?.toString() ?? ''}
              onChange={handleAgeChange}
              error={errors[PATIENT_MODAL.FIELDS.AGE]}
              hasEditable={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
  <RadioButtonGroup
    label={PATIENT_MODAL.LABELS.GENDER}
    name={PATIENT_MODAL.FIELDS.GENDER}
    value={patientForm[PATIENT_MODAL.FIELDS.GENDER] ?? PATIENT_MODAL.MISC.EMPTY_STRING}
    onChange={(value) => handleFieldChange(PATIENT_MODAL.FIELDS.GENDER, value)}
    options={[
      { value: PATIENT_MODAL.GENDER_OPTIONS.MALE, label: PATIENT_MODAL.GENDER_OPTIONS.MALE },
      { value: PATIENT_MODAL.GENDER_OPTIONS.FEMALE, label: PATIENT_MODAL.GENDER_OPTIONS.FEMALE },
      { value: PATIENT_MODAL.GENDER_OPTIONS.OTHERS, label: PATIENT_MODAL.GENDER_OPTIONS.OTHERS },
    ]}
    error={errors[PATIENT_MODAL.FIELDS.GENDER]}
    disabled={!hasEditPermission}
  />
</Grid2>

          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={PATIENT_MODAL.LABELS.PARAMETERS_MEASURED}
              placeholder={PATIENT_MODAL.PLACEHOLDERS.PARAMETERS_MEASURED}
              value={patientForm[PATIENT_MODAL.FIELDS.PARAMETERS_MEASURED]}
              onChange={(value) => handleFieldChange(PATIENT_MODAL.FIELDS.PARAMETERS_MEASURED, value)}
              error={errors[PATIENT_MODAL.FIELDS.PARAMETERS_MEASURED]}
              disabled={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={PATIENT_MODAL.LABELS.MEASURED_VALUES}
              placeholder={PATIENT_MODAL.PLACEHOLDERS.MEASURED_VALUES}
              value={patientForm[PATIENT_MODAL.FIELDS.MEASURED_VALUE]}
              onChange={(value) => handleFieldChange(PATIENT_MODAL.FIELDS.MEASURED_VALUE, value)}
              error={errors[PATIENT_MODAL.FIELDS.MEASURED_VALUE]}
              disabled={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PATIENT_MODAL.LABELS.COMMENTS}
              placeholder={PATIENT_MODAL.PLACEHOLDERS.COMMENTS}
              value={patientForm[PATIENT_MODAL.FIELDS.COMMENTS]}
              onChange={(value) => handleFieldChange(PATIENT_MODAL.FIELDS.COMMENTS, value)}
            />
          </Grid2>
        </Grid2>
      </CommonModal>
    </LocalizationProvider>
  );
};

export default PatientModal;