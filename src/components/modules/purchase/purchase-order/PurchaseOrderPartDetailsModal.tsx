'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Grid2 } from '@mui/material';
import { InputField } from '@/components/ui';
import { NUMBERMAP } from '@/constants/common';
import { numberValidation } from '@/lib/utils/common';
import { MODAL_MAX_WIDTH } from '@/styles/modules/vendor-management/sampleOrders';
import {
  VALIDATION_MESSAGES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  FORM_FIELD_KEYS,
  PAGE_TITLES,
} from '@/constants/modules/purchase/purchaseOrder';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
import { FAILED_ALERT } from '@/constants/modules/dnd/formTeam';
import { PartNumberData } from '@/types/modules/vendor-management/sampleOrders';
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport';
import { useOrganizationStatus } from '@/hooks/useCommonDropdown';

/**
 * Classification : Confidential
 */

export interface PartDetailsModalFormData {
  part_number_id: string;
  part_number?: string;
  quantity: string;
  unit_rate: string;
  price: string;
  status: string;
  model_number?: string;
}

export interface PartDetailsModalValidationErrors {
  part_number_id: string;
  quantity: string;
  unit_rate: string;
  price: string;
  status: string;
}

export interface PurchaseOrderPartDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PartDetailsModalFormData) => void;
  initialData?: PartDetailsModalFormData;
  partNumbersData?: { data: PartNumberData[] };
  editingPartId?: string | null;
  orderType?: string;
}

const PurchaseOrderPartDetailsModal: React.FC<PurchaseOrderPartDetailsModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  partNumbersData,
  editingPartId,
  orderType,
}) => {
  const isInfrastructure = orderType === 'infrastructure'
  const { data: statusData, isLoading: isStatusLoading } = useOrganizationStatus();
  
  const statusOptions = useMemo(
    () => statusData?.data ?? [],
    [statusData?.data]
  );

  const [modalFormData, setModalFormData] = useState<PartDetailsModalFormData>({
    part_number_id: "",
    quantity: "",
    unit_rate: "",
    price: "",
    status: "",
    model_number: "",
  });
  
  const [modalValidationErrors, setModalValidationErrors] = useState<PartDetailsModalValidationErrors>({
    part_number_id: '',
    quantity: '',
    unit_rate: '',
    price: '',
    status: '',
  });

  // Reset form data when modal opens/closes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setModalFormData(initialData);
      } else {
        setModalFormData({
          part_number_id: "",
          quantity: "",
          unit_rate: "",
          price: "",
          status: "",
          model_number: "",
        });
      }
      setModalValidationErrors({
        part_number_id: '',
        quantity: '',
        unit_rate: '',
        price: '',
        status: '',
      });
    }
  }, [open, initialData]);

  const handleModalInputChange = (field: string, value: string) => {
    // Only allow numbers for numeric fields
    if (field === FORM_FIELD_KEYS.QUANTITY || 
        field === FORM_FIELD_KEYS.UNIT_RATE || 
        field === FORM_FIELD_KEYS.PRICE) {
      if (!numberValidation.test(value) && value !== '') return;
    }
    // Map form field keys to modal form data keys
    let dataField = field;
    if (field === FORM_FIELD_KEYS.PART_NUMBER) {
      dataField = 'part_number_id';
    } else if (field === FORM_FIELD_KEYS.STATUS) {
      dataField = 'status';
    }

    const updatedData = { ...modalFormData, [dataField]: value };
  
    setModalFormData(updatedData);
    // Clear validation error when user starts typing
    setModalValidationErrors(prev => ({ ...prev, [dataField]: '' }));
  };

  const validateModal = () => {
    const errors = {
      part_number_id: '',
      quantity: '',
      unit_rate: '',
      price: '',
      status: '',
    };

    if (!modalFormData.part_number_id) {
      errors.part_number_id = VALIDATION_MESSAGES.PART_NUMBER_REQUIRED;
    }

    if (!modalFormData.quantity) {
      errors.quantity = VALIDATION_MESSAGES.QUANTITY_REQUIRED;
    } else if (isNaN(Number(modalFormData.quantity)) || Number(modalFormData.quantity) <= NUMBERMAP.ZERO) {
      errors.quantity = VALIDATION_MESSAGES.QUANTITY_INVALID;
    }

    if (!modalFormData.unit_rate) {
      errors.unit_rate = VALIDATION_MESSAGES.UNIT_RATE_REQUIRED;
    } else if (isNaN(Number(modalFormData.unit_rate)) || Number(modalFormData.unit_rate) <= NUMBERMAP.ZERO) {
      errors.unit_rate = VALIDATION_MESSAGES.UNIT_RATE_INVALID;
    }

    if (!modalFormData.price) {
      errors.price = VALIDATION_MESSAGES.PRICE_REQUIRED;
    } else if (isNaN(Number(modalFormData.price)) || Number(modalFormData.price) <= NUMBERMAP.ZERO) {
      errors.price = VALIDATION_MESSAGES.PRICE_INVALID;
    }

    if (!modalFormData.status) {
      errors.status = VALIDATION_MESSAGES.status;
    }

    setModalValidationErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

    const handleModalSave = () => {
    // Validate modal form data
    if (!validateModal()) {
      return;
    }

    if (isInfrastructure) {
      // Find the selected infrastructure type details
      const selectedInfraType = partNumbersData?.data?.find(
        (type: any) => type.infrastructure_type_id?.toString() === modalFormData.part_number_id
      );

      if (!selectedInfraType) {
        showActionAlert(FAILED_ALERT);
        return;
      }

      // Call the parent's save handler
      onSave({...modalFormData, part_number: selectedInfraType?.infrastructure_type_name ?? '-'});
    } else {
      // Find the selected part number details
      const selectedPart = partNumbersData?.data?.find(
        (part: PartNumberData) => part.id.toString() === modalFormData.part_number_id
      );

      if (!selectedPart) {
        showActionAlert(FAILED_ALERT);
        return;
      }

      // Call the parent's save handler
      onSave({...modalFormData, part_number:selectedPart?.part_number ?? '-'});
    }
  };

  const handleModalCancel = () => {
    onClose();
  };
const getTitle = () => {
  if (editingPartId) {
    return isInfrastructure
      ? 'Edit Infrastructure Details'
      : PAGE_TITLES.EDIT_PART_DETAILS;
  }
  return isInfrastructure
    ? 'Add Infrastructure Details'
    : PAGE_TITLES.ADD_PART_DETAILS;
};

  return (
    <CommonModal
      open={open}
      onClose={handleModalCancel}
      title={getTitle()}
      onSave={handleModalSave}
      buttonRequired={true}
      modalMaxWidth={MODAL_MAX_WIDTH}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={POPUP_STYLE}> 
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <InputField
            label={isInfrastructure ? 'Infrastructure Type*' : FORM_LABELS.PART_NUMBER}
            placeholder={isInfrastructure ? 'Select Infrastructure Type' : FORM_PLACEHOLDERS.SELECT_PART_NUMBER}
            isDropdown
            options={partNumbersData?.data ?? []}
            valueField={isInfrastructure ? 'infrastructure_type_name' : FORM_FIELD_NAMES.PART_NUMBER}
            keyField={isInfrastructure ? 'infrastructure_type_id' : FORM_FIELD_NAMES.ID}
            value={modalFormData.part_number_id}
            onChange={(value: string) => handleModalInputChange(FORM_FIELD_KEYS.PART_NUMBER, value)}
            error={modalValidationErrors.part_number_id}
          />
        </Grid2>
        {isInfrastructure && (
          <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
            <InputField
              label="Model Number*"
              placeholder="Enter Model Number"
              value={modalFormData.model_number ?? ''}
              onChange={(value: string) => handleModalInputChange('model_number', value)}
            />
          </Grid2>
        )}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <InputField
            label={FORM_LABELS.QUANTITY}
            placeholder={FORM_PLACEHOLDERS.ENTER_QUANTITY}
            value={modalFormData.quantity}
            onChange={(value: string) => handleModalInputChange(FORM_FIELD_KEYS.QUANTITY, value)}
            error={modalValidationErrors.quantity}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <InputField
            label={FORM_LABELS.UNIT_RATE}
            placeholder={FORM_PLACEHOLDERS.ENTER_UNIT_RATE}
            value={modalFormData.unit_rate}
            onChange={(value: string) => handleModalInputChange(FORM_FIELD_KEYS.UNIT_RATE, value)}
            error={modalValidationErrors.unit_rate}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <InputField
            label={FORM_LABELS.PRICE}
            placeholder={FORM_PLACEHOLDERS.ENTER_PRICE}
            value={modalFormData.price}
            onChange={(value: string) => handleModalInputChange(FORM_FIELD_KEYS.PRICE, value)}
            error={modalValidationErrors.price}
            // disabled
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <InputField
            label={FORM_LABELS.STATUS}
            placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
            isDropdown
            options={statusOptions}
            valueField={FORM_FIELD_NAMES.STATUS_NAME}
            keyField={FORM_FIELD_NAMES.STATUS_ID}
            value={modalFormData.status}
            onChange={(value: string) => handleModalInputChange(FORM_FIELD_KEYS.STATUS, value)}
            error={modalValidationErrors.status}
            disabled={isStatusLoading}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  );
};

export default PurchaseOrderPartDetailsModal;

