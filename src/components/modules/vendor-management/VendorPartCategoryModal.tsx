'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { Box, Grid2 } from '@mui/material'
import { InputField, showActionAlert } from '@/components/ui'
import { NUMBERMAP, POSITIVE_INTEGER_REGEX } from '@/constants/common'
import { popup_style } from '@/styles/common'
import {
  useAllPartCategories,
  useAllPartSubcategoryTypes,
  useAllPartCategorySubclasses,
  useVendorSelectionCriteria,
  useAllPartTypes
} from '@/hooks/modules/vendor-management/useCommonDropdown'
import { COMMON_COLUMNS } from '@/constants/modules/vendor-management/common'
import { VendorPartCategoryFormData, VendorPartCategory, StringOrNumberOrNull, NumberOrStringOrNull } from '@/types/modules/vendor-management/vendorList'
import { numberValidation } from '@/lib/utils/common'
import { PAGE_TITLE } from '@/constants/modules/vendor-management/partCategory'
import { VENDOR_PART_CATEGORY_MODAL } from '@/constants/modules/vendor-management/vendorList'
import VendorSelectionCriteriaCommonTable from './vendor-selection-criteria/VendorSelectionCriteriaCommonTable'
import { VendorCriteria } from './vendor-selection-criteria/types'

interface VendorPartCategoryModalProps {
  open: boolean
  onClose: () => void
  onSave: (formData: VendorPartCategoryFormData & { id?: number | string }) => void
  form: {
    part_category_type_id?: string;
    part_subcategory_type_id?: string;
    part_category_subclass_id?: string;
    part_category_id?: string;
    leadTimeDays?: StringOrNumberOrNull;
    moq_detail?: StringOrNumberOrNull;
  }
  existingPartCategories?: VendorPartCategory[]
  currentItemId?: NumberOrStringOrNull
}

const VendorPartCategoryModal: React.FC<VendorPartCategoryModalProps> = ({
  open,
  onClose,
  onSave,
  form,
  existingPartCategories = [],
  currentItemId = null,
}) => {
  // Fetch data for dropdowns
  const [formData, setFormData] = useState({
    part_type_id: '',
    part_sub_type_id: '',
    part_sub_class_id: '',
    part_category_id: '',
    leadTimeDays: '',
    minOrderQty: '',
    vendor_selection_criteria_id: ''
  });
  const [criteriaData, setCriteriaData] = useState<VendorCriteria[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { data: partTypesData } = useAllPartTypes(NUMBERMAP.ONE, open);
  const { data: partCategoriesData } = useAllPartCategories(NUMBERMAP.ONE, formData.part_sub_class_id ? parseInt(formData.part_sub_class_id) : undefined);
  const { data: partSubcategoryTypesData } = useAllPartSubcategoryTypes(
    formData.part_type_id ? parseInt(formData.part_type_id) : undefined,
    NUMBERMAP.ONE,
    open && !!formData.part_type_id
  );
  const { data: partCategorySubclassesData } = useAllPartCategorySubclasses(
    formData.part_sub_type_id ? parseInt(formData.part_sub_type_id) : undefined,
    NUMBERMAP.ONE,
    open && !!formData.part_sub_type_id
  );

    // Transform criteria data using hierarchical transformation
    const transformConfig = {
      groupIdField: 'group_id',
      groupNameField: 'group_value',
      groupOrderField: 'applicable_group_display_order',
      childIdField: 'group_criteria_mapper_id',
      childNameField: 'sub_group_value',
      childOrderField: 'criteria_display_order',
      criteriaArrayField : 'criteria',
      parentIdPrefix: 'parent_',
      childIdPrefix: 'child_',
      fieldMappings: {
        criteria: 'sub_group_value',
        requirement: 'requirement_type_name',
        requirementId: 'requirement_type',
        category: 'group_value',
        status: 'status',
      },
    };

  // Fetch vendor selection criteria based on all form selections
  const { data: vendorSelectionCriteriaData,isLoading } = useVendorSelectionCriteria(
    formData.part_type_id ? parseInt(formData.part_type_id) : undefined,
    formData.part_sub_type_id ? parseInt(formData.part_sub_type_id) : undefined,
    formData.part_sub_class_id ? parseInt(formData.part_sub_class_id) : undefined,
    formData.part_category_id ? parseInt(formData.part_category_id) : undefined,
    NUMBERMAP.ONE,
    open && !!(formData.part_type_id && formData.part_sub_type_id && formData.part_sub_class_id && formData.part_category_id)
  );

  // Handle form field changes with cascading logic
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => {
      if(field === 'part_type_id') {
        return {
          ...prev,
          part_type_id: value,
          part_sub_type_id: '',
          part_sub_class_id: '',
          part_category_id: ''
        }
      }
      if(field === 'part_sub_type_id') {
        return {
          ...prev,
          part_sub_type_id: value,
          part_sub_class_id: '',
          part_category_id: ''
        }
      }
      if(field === 'part_sub_class_id') {
        return {
          ...prev,
          part_sub_class_id: value,
          part_category_id: ''
        }
      }
      if(field === 'part_category_id') {
        return {
          ...prev,
          part_category_id: value
        }
      }
      if(field === 'leadTimeDays') {
        return {
          ...prev,
          leadTimeDays: value
        }
      }
      if(field === 'minOrderQty') {
        return {
          ...prev,
          minOrderQty: value
        }
      }
      return prev
    });
    setErrors({ ...errors, [field]: '' })
  };

  useEffect(() => {
    if (form && open) {
      setFormData({
        part_type_id: form.part_category_type_id ?? '',
        part_sub_type_id: form.part_subcategory_type_id ?? '',
        part_sub_class_id: form.part_category_subclass_id ?? '',
        part_category_id: form.part_category_id ?? '',
        leadTimeDays: form.leadTimeDays?.toString() ?? '',
        minOrderQty: form.moq_detail?.toString() ?? '',
        vendor_selection_criteria_id: ''
      });
    } else {
      // Reset form when modal closes
      setFormData({
        part_type_id: '',
        part_sub_type_id: '',
        part_sub_class_id: '',
        part_category_id: '',
        leadTimeDays: '',
        minOrderQty: '',
        vendor_selection_criteria_id: ''
      });
      setErrors({})
    }
  }, [form, open]);
  
  // Prepare criteria data for the table
  useEffect(() => {
    const criteriaRows = vendorSelectionCriteriaData?.data?.[NUMBERMAP.ZERO]?.criteria_details ?? []
    setCriteriaData(criteriaRows)
  }, [vendorSelectionCriteriaData])

  const vendorListColumnRenderCell = useCallback((params: { row: VendorCriteria }) => {
    const row = params.row;
    const isParent = row?.isParent;
    return <Box sx={{
      pl: isParent ? NUMBERMAP.ZERO : NUMBERMAP.TWO
    }}>
      {params.value}
    </Box>;
  }, [])
  const columns = useMemo(() => [
   ...COMMON_COLUMNS(vendorListColumnRenderCell),
 
  ], [])
  const getPartTypeName = (partTypeId: string) => {
    return partTypesData?.data?.find((item) => item.ref_id == partTypeId)?.part_category_type ?? ''
  }
  const getPartSubtypeName = (partSubtypeId: string) => {
    return partSubcategoryTypesData?.data?.find((item) => item.ref_id == partSubtypeId)?.part_subcategory_type ?? ''
  }
  const getPartSubclassName = (partSubclassId: string) => {
    return partCategorySubclassesData?.data?.find((item) => item.ref_id == partSubclassId)?.part_category_subclass ?? ''
  }
  const getPartCategoryName = (partCategoryId: string) => {
    return partCategoriesData?.data?.find((item) => item.part_category_id == partCategoryId)?.part_category_name ?? ''
  }
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.part_type_id) {
      newErrors.part_type_id = 'Part Type is required'
    }
    if (!formData.part_sub_type_id) {
      newErrors.part_sub_type_id = 'Part Sub Type is required'
    }
    if (!formData.part_sub_class_id) {
      newErrors.part_sub_class_id = 'Part Sub Class is required'
    }
    if (!formData.part_category_id) {
      newErrors.part_category_id = 'Part Category is required'
    }
    if (!formData.leadTimeDays || formData.leadTimeDays.trim() === '') {
      newErrors.leadTimeDays = 'Lead Time in Days is required'
    } else if (!numberValidation.test(formData.leadTimeDays)) {
      newErrors.leadTimeDays = 'Lead Time in Days must be a number'
    }
    if (!formData.minOrderQty || formData.minOrderQty.trim() === '') {
      newErrors.minOrderQty = VENDOR_PART_CATEGORY_MODAL.ERROR_MESSAGES.MIN_ORDER_QUANTITY_REQUIRED
    } else if (!POSITIVE_INTEGER_REGEX.test(formData.minOrderQty)) {
      newErrors.minOrderQty = VENDOR_PART_CATEGORY_MODAL.ERROR_MESSAGES.MIN_ORDER_QUANTITY_INVALID
    } else if (Number(formData.minOrderQty) <= NUMBERMAP.ZERO) {
      newErrors.minOrderQty = VENDOR_PART_CATEGORY_MODAL.ERROR_MESSAGES.MIN_ORDER_QUANTITY_GREATER_THAN_ZERO
    }
    setErrors(newErrors)
    return newErrors

  }

  // Check for duplicate combination
  const checkDuplicate = (): boolean => {
    if (!formData.part_type_id || !formData.part_sub_type_id || !formData.part_sub_class_id || !formData.part_category_id) {
      return false
    }

    return existingPartCategories.some((item) => {
      if (currentItemId !== null) {
        const isCurrentItem = 
          (item.id !== undefined && item.id === currentItemId) ||
          (item.tempId !== undefined && item.tempId === currentItemId)
        if (isCurrentItem) return false
      }

      // Check if the combination already exists
      const itemPartTypeId = item.part_category_type_id ?? item.part_type_id
      const itemPartSubTypeId = item.part_subcategory_type_id ?? item.part_sub_type_id
      const itemPartSubClassId = item.part_category_subclass_id ?? item.part_sub_class_id
      const itemPartCategoryId = item.part_category_id

      return (
        String(itemPartTypeId) === String(formData.part_type_id) &&
        String(itemPartSubTypeId) === String(formData.part_sub_type_id) &&
        String(itemPartSubClassId) === String(formData.part_sub_class_id) &&
        String(itemPartCategoryId) === String(formData.part_category_id)
      )
    })
  }
  const handleSave = () => {
    const errors = validateForm()
    if (Object.keys(errors).length > NUMBERMAP.ZERO) return

    // Check for duplicate combination and show pop-up alert
    if (checkDuplicate()) {
      showActionAlert('customAlert', {
        title: VENDOR_PART_CATEGORY_MODAL.ALERT.ERROR_TITLE,
        text: VENDOR_PART_CATEGORY_MODAL.ERROR_MESSAGES.DUPLICATE_COMBINATION,
        icon: VENDOR_PART_CATEGORY_MODAL.ALERT.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
      return
    }

    if (vendorSelectionCriteriaData?.data && vendorSelectionCriteriaData?.data?.length > NUMBERMAP.ZERO) {
      const criteriaData = (vendorSelectionCriteriaData?.data?.[NUMBERMAP.ZERO])
      onSave({
        part_category_id: criteriaData.part_category_id,
        part_category_subclass_id: criteriaData.part_sub_class_id,
        part_subcategory_type_id: criteriaData.part_sub_type_id,
        part_category_type_id: criteriaData.part_type_id,
        part_category_subclass_name: getPartSubclassName(criteriaData.part_sub_class_id),
        part_subcategory_type_name: getPartSubtypeName(criteriaData.part_sub_type_id),
        part_category_selection_criteria_id: criteriaData.vendor_selection_criteria_id,
        part_category_type_name: getPartTypeName(criteriaData.part_type_id),
        part_category_name: getPartCategoryName(criteriaData.part_category_id),
        leadTimeDays: formData.leadTimeDays,
        minOrderQty: formData.minOrderQty,
      })
    } else {
      onSave({
        part_category_id: formData.part_category_id,
        part_category_subclass_id: formData.part_sub_class_id,
        part_subcategory_type_id: formData.part_sub_type_id,
        part_category_type_id: formData.part_type_id,
        part_category_subclass_name: getPartSubclassName(formData.part_sub_class_id),
        part_subcategory_type_name: getPartSubtypeName(formData.part_sub_type_id),
        part_category_type_name: getPartTypeName(formData.part_type_id),
        part_category_name: getPartCategoryName(formData.part_category_id),
        vendor_selection_criteria_id: null,
        leadTimeDays: formData.leadTimeDays,
        minOrderQty: formData.minOrderQty,
      })
    }
  }
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={PAGE_TITLE}
      onSave={handleSave}
      buttonRequired
      modalMaxWidth="900px"
    >
      <Box sx={popup_style}>
        <Grid2 container spacing={NUMBERMAP.ONE} >
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Part Type*'}
              placeholder={'Select Part Type'}
              isDropdown
              value={formData.part_type_id}
              onChange={(value: string) => handleFormChange('part_type_id', value)}
              error={errors.part_type_id}
              options={partTypesData?.data ?? []}
              keyField="ref_id"
              valueField="part_category_type"
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Part Sub Type*'}
              placeholder={'Select Part Sub Type'}
              isDropdown
              value={formData.part_sub_type_id}
              onChange={(value: string) => handleFormChange('part_sub_type_id', value)}
              error={errors.part_sub_type_id}
              options={partSubcategoryTypesData?.data ?? []}
              keyField="ref_id"
              valueField="part_subcategory_type"
              dataSourceName={'vendor'}
              disabled={!formData.part_type_id}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Part Sub Class*'}
              placeholder={'Select Part Sub Class'}
              isDropdown
              value={formData.part_sub_class_id}
              onChange={(value: string) => handleFormChange('part_sub_class_id', value)}
              error={errors.part_sub_class_id}
              options={partCategorySubclassesData?.data ?? []}
              keyField="ref_id"
              valueField="part_category_subclass"
              disabled={!formData.part_sub_type_id}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Part Category*'}
              placeholder={'Select Part Category'}
              isDropdown
              value={formData.part_category_id?.toString()}
              onChange={(value: string) => handleFormChange('part_category_id', value)}
              error={errors.part_category_id}
              options={partCategoriesData?.data ?? []}
              keyField="part_category_id"
              valueField="part_category_name"
              disabled={!formData.part_sub_class_id}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Lead Time in Days*'}
              placeholder={'Enter Lead Time in Days'}
              value={formData.leadTimeDays}
              onChange={(value: string) => {
                if (numberValidation.test(value) || value === '') {
                  handleFormChange('leadTimeDays', value)
                }
              }}
              error={errors.leadTimeDays}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={VENDOR_PART_CATEGORY_MODAL.FORM_LABELS.MIN_ORDER_QUANTITY}
              placeholder={VENDOR_PART_CATEGORY_MODAL.FORM_PLACEHOLDERS.MIN_ORDER_QUANTITY}
              value={formData.minOrderQty}
              onChange={(value: string) => {
                // Only allow positive integers (no decimals, no negatives, no special characters)
                if (POSITIVE_INTEGER_REGEX.test(value) || value === '') {
                  handleFormChange('minOrderQty', value)
                }
              }}
              error={errors.minOrderQty}
            />
          </Grid2>
        </Grid2>

        <Grid2 container spacing={NUMBERMAP.TWO} sx={{ mt: NUMBERMAP.TWO }}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <VendorSelectionCriteriaCommonTable
              onCriteriaReorder={() => { }}
              transformConfig={ transformConfig }
              rawData={criteriaData}
              title=""
              showAddButton={false}
              loading={isLoading}
              enableDragDrop={false}
              orderField="order"
              columns={columns}
            />
          </Grid2>
        </Grid2>
      </Box>
    </CommonModal>
  )
}

export default VendorPartCategoryModal


