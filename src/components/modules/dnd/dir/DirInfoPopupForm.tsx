'use client';
import React, { useState, useEffect } from 'react';
import { Grid2 } from '@mui/material';
import { Description, MultiSelect, RadioButtonGroup } from '@/components/ui';
import {
  FormSection,
  ContentWrapper,
} from '@/styles/components/modules/designInput';
import {
  useDIRList
} from '@/hooks/modules/dnd/useDir';
import { DIR_INFO, FIELD_LABELS, FORM_TITLES, PLACEHOLDERS, POPUP_FIELD_ORDER, POPUP_FIELD_LABEL_MAP } from '@/constants/modules/dnd/dir';
import { NUMBERMAP } from '@/constants/common';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { radioOptions } from '@/lib/modules/dnd/dir';
import { PopupFormProps, DesignInputFormData } from '@/types/modules/dnd/dir';
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';

/**
    Classification : Confidential
**/
const DirInfoPopupForm: React.FC<PopupFormProps> = ({
  onSave,
  onClose,
  open,
  initialData,
  projectId,
}) => {
  const { data: dirList } = useDIRList(projectId);

  const [formData, setFormData] = useState<DesignInputFormData>(
    initialData ?? {
      isUnambiguous: '',
      isverified: '',
      isRetested: '',
      isCompleted: '',
      dirConfict: [],
      conflictRemarks: '',
      verifiableRemarks: '',
      completeRemarks: '',
    }
  );

  const [errors, setErrors] = useState<Partial<DesignInputFormData>>({});
  const [dirOptions, setDirOptions] = useState<{ id: string; value: string }[]>([]);

  useEffect(() => {
    // Processing dirList to create options for MultiSelect
    if (Array.isArray(dirList?.data)) {
      const options = dirList.data
        .filter(item => item.design_input_requirement_id && item.dir_id) 
        .map(item => ({
          id: item.design_input_requirement_id.toString(),
          value: item.dir_id + (item.dir_name ? ` - ${item.dir_name}` : '')
        }))
        .filter((option, index, self) => 
          index === self.findIndex(o => o.id === option.id) 
        );
      setDirOptions(options);
    }
  }, [dirList]);

  useEffect(() => {
    /**
     * Description: added initial data to form if available,
     * Author: Prithiviraj,
     * modified: 23-08-2025,
     * Classification : Confidential
    **/
    if (initialData) {
      // Map conflicting_dir_id (dir_id) to design_input_requirement_id for MultiSelect
      let mappedDirConfict = initialData.dirConfict;
      const dirListData = (dirList as any)?.data;
      if (Array.isArray(dirListData) && initialData.dirConfict && initialData.dirConfict.length > NUMBERMAP.ZERO) {
        mappedDirConfict = initialData.dirConfict
          .map((conflictId: string) => {
            // Find the item in dirList where dir_id matches conflictId
            const matchedItem = dirListData.find(
              (item: any) => item.dir_id?.toString() === conflictId || item.design_input_requirement_id?.toString() === conflictId
            );
            // Return design_input_requirement_id if found, otherwise return original conflictId
            return matchedItem?.design_input_requirement_id?.toString() ?? conflictId;
          })
          .filter(Boolean); // Remove any undefined/null values
      }
      setFormData({
        ...initialData,
        dirConfict: mappedDirConfict,
      });
    }
  }, [initialData, dirList]);

  const handleInputChange = (
    field: keyof DesignInputFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Partial<DesignInputFormData> = {};
    const { VALIDATION } = DIR_INFO;
    let isValid = true;

    if (!formData.isUnambiguous) {
      newErrors.isUnambiguous = VALIDATION.UNAMBIGUOUS;
      isValid = false;
    }
    if (!formData.isverified) {
      newErrors.isverified = VALIDATION.VERIFIED;
      isValid = false;
    }
    if (!formData.isRetested) {
      newErrors.isRetested = VALIDATION.RETESTED;
      isValid = false;
    }
    if (!formData.isCompleted) {
      newErrors.isCompleted = VALIDATION.COMPLETED;
      isValid = false;
    }

    setErrors(newErrors);
    
    // Use validateAndFocusFirstEmptyField for better UX
    if (!isValid) {
      validateAndFocusFirstEmptyField(formData, POPUP_FIELD_ORDER, POPUP_FIELD_LABEL_MAP);
    }
    
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <CommonModal
      title={FORM_TITLES.MAIN_TITLE}
      open={open}
      onClose={onClose}
      onSave={handleSubmit}
      buttonRequired
    >
      <ContentWrapper>
      
          <FormSection >
            <Grid2 sx={POPUP_STYLE} container spacing={NUMBERMAP.ONE}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <MultiSelect
                  idField={DIR_INFO.DIR.DIRID}
                  valueField={DIR_INFO.DIR.DIRVALUE}
                  label={FIELD_LABELS.CONFLICT_WITH_OTHER}
                  options={dirOptions}
                  placeholder={PLACEHOLDERS.SELECT_DIR}
                  value={formData.dirConfict}
                  onChange={(value) => handleInputChange(DIR_INFO.FORM_FIELDS.CONFLICT_DIR, value as string[])}
                  error={errors.dirConfict ?? ''}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <RadioButtonGroup
                  label={FIELD_LABELS.UNAMBIGUOUS}
                  name={DIR_INFO.FORM_FIELDS.UNAMBIGUOUS}
                  options={radioOptions}
                  value={formData.isUnambiguous}
                  onChange={(value) => handleInputChange(DIR_INFO.FORM_FIELDS.UNAMBIGUOUS, value)}
                  error={errors.isUnambiguous}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <Description
                  label={FIELD_LABELS.CONFLICT_REMARKS}
                  value={formData.conflictRemarks}
                  placeholder={PLACEHOLDERS.REMARKS}
                  onChange={(value) => handleInputChange(DIR_INFO.FORM_FIELDS.CONFLICT_REMARKS, value)}
                  error={errors.conflictRemarks}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <RadioButtonGroup
                  label={FIELD_LABELS.VERIFIABLE}
                  options={radioOptions}
                  name={DIR_INFO.FORM_FIELDS.VERIFIED}
                  value={formData.isverified}
                  onChange={(value) =>
                    handleInputChange(DIR_INFO.FORM_FIELDS.VERIFIED, value)
                  }
                  error={errors.isverified}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <Description
                  label={FIELD_LABELS.VERIFIABLE_REMARKS}
                  value={formData.verifiableRemarks}
                  placeholder={PLACEHOLDERS.REMARKS}
                  onChange={(value) => handleInputChange(DIR_INFO.FORM_FIELDS.VERIFIABLE_REMARKS, value)}
                  error={errors.verifiableRemarks}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <RadioButtonGroup
                  label={FIELD_LABELS.RETESTED}
                  name={DIR_INFO.FORM_FIELDS.RETESTED}
                  options={radioOptions}
                  value={formData.isRetested}
                  onChange={(value) => handleInputChange(DIR_INFO.FORM_FIELDS.RETESTED, value)}
                  error={errors.isRetested}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <RadioButtonGroup
                  label={FIELD_LABELS.COMPLETED}
                  name={DIR_INFO.FORM_FIELDS.COMPLETED}
                  options={radioOptions}
                  value={formData.isCompleted}
                  onChange={(value) => handleInputChange(DIR_INFO.FORM_FIELDS.COMPLETED, value)}
                  error={errors.isCompleted}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <Description
                  label={FIELD_LABELS.COMPLETE_REMARKS}
                  value={formData.completeRemarks}
                  placeholder={PLACEHOLDERS.REMARKS}
                  onChange={(value) => handleInputChange(DIR_INFO.FORM_FIELDS.COMPLETE_REMARKS, value)}
                  error={errors.completeRemarks}
                />
              </Grid2>
            </Grid2>
          </FormSection>
      </ContentWrapper>
    </CommonModal>
  );
};

export default DirInfoPopupForm;