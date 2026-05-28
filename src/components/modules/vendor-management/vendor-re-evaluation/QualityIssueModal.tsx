'use client'
import React, { useState, useEffect } from 'react'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { Box, Grid2 } from '@mui/material'
import { InputField, RichTextEditor } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import { popup_style } from '@/styles/common'


interface QualityIssueModalProps {
  open: boolean
  onClose: () => void
  onSave: (formData: any) => void
  initialData?: {
    serial_number?: string
    issue_raised?: string
    resolution?: string
    effectiveness?: string
  }
}

const QualityIssueModal: React.FC<QualityIssueModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  // Fetch data for dropdowns
  const [formData, setFormData] = useState({
    sl_no_of_part_product: '',
    issue_raised_and_data: '',
    resolution_and_data: '',
    effectiveness: ''
  });
  const [errors, setErrors] = useState<{ sl_no_of_part_product?: string, issue_raised_and_data?: string, resolution_and_data?: string, effectiveness?: string }>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        sl_no_of_part_product: initialData.serial_number ?? '',
        issue_raised_and_data: initialData.issue_raised ?? '',
        resolution_and_data: initialData.resolution ?? '',
        effectiveness: initialData.effectiveness ?? ''
      });
    } else {
      setFormData({
        sl_no_of_part_product: '',
        issue_raised_and_data: '',
        resolution_and_data: '',
        effectiveness: ''
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => {
      return {
        ...prev,
        [field]: value
      }
    })
    if(errors[field as keyof typeof errors]) {
      setErrors((prev) => {
        const newErrors = { ...prev, [field]: '' };
        return newErrors;
      });
    }
  }
  const handleSave = () => {
   if (validateForm()) return;
   onSave(formData);
  }
  const validateForm = () => {
    const errors = {};
    if(!formData.sl_no_of_part_product) errors.sl_no_of_part_product = 'SL No. of Part/Product is required';
    if(!formData.issue_raised_and_data) errors.issue_raised_and_data = 'Issue Raised and Data is required';
    if(!formData.resolution_and_data) errors.resolution_and_data = 'Resolution and Data is required';
    if(!formData.effectiveness) errors.effectiveness = 'Effectiveness is required';
    setErrors(errors);
    return Object.keys(errors).length > NUMBERMAP.ZERO;
  }
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Response to Quality Issues Raised During the Period"
      onSave={handleSave}
      buttonRequired
    >
      <Box sx={popup_style}>
        <Grid2 container spacing={NUMBERMAP.ONE} >
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'SL No. of Part/Product*'}
              placeholder={'Enter SL No. of Part/Product'}
              value={formData.sl_no_of_part_product}
              onChange={(value: string) => handleFormChange('sl_no_of_part_product', value)}
              error={errors.sl_no_of_part_product}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Issue Raised and Data*'}
              placeholder={'Enter Issue Raised and Data'}
              value={formData.issue_raised_and_data}
              onChange={(value: string) => handleFormChange('issue_raised_and_data', value)}
              error={errors.issue_raised_and_data}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Resolution and Data*'}
              placeholder={'Enter Resolution and Data'}
              value={formData.resolution_and_data}
              onChange={(value: string) => handleFormChange('resolution_and_data', value)}
              error={errors.resolution_and_data}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Effectiveness*'}
              placeholder={'Enter Effectiveness'}
              value={formData.effectiveness}
              onChange={(value: string) => handleFormChange('effectiveness', value)}
              error={errors.effectiveness}
            />
          </Grid2>
        </Grid2>
      </Box>
    </CommonModal>
  )
}

export default QualityIssueModal


