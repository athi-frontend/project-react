'use client';
import React, { useState, useEffect } from 'react';
import { Grid2 } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { InputField, DataGridTable } from '@/components/ui';
import { NUMBERMAP } from '@/constants/common';
import { numberValidation } from '@/lib/utils/common';
import { MODAL_MAX_WIDTH } from '@/styles/modules/vendor-management/sampleOrders';
import { 
  PartNumberData, 
  ModalFormData, 
  ModalValidationErrors, 
  SamplePurchaseOrderModalProps 
} from '@/types/modules/vendor-management/sampleOrders';
import {
  VALIDATION_MESSAGES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  FORM_FIELD_KEYS,
  PAGE_TITLES,
  PRODUCTS_HEADERS,
  PRODUCTS_FIELDS,
} from '@/constants/modules/vendor-management/sampleOrders';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
import { FAILED_ALERT } from '@/constants/modules/dnd/formTeam';
import { useProductsByPart } from '@/hooks/modules/vendor-management/useSampleOrders';

/**
 * Classification : Confidential
 */
const SamplePurchaseOrderModal: React.FC<SamplePurchaseOrderModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  partNumbersData,
  editingPartId,
}) => {
  const [modalFormData, setModalFormData] = useState<ModalFormData>({
    partNumber: "",
    orderQuantity: ""
  });
  
  const [modalValidationErrors, setModalValidationErrors] = useState<ModalValidationErrors>({
    partNumber: '',
    orderQuantity: ''
  });

  // Get part ID from selected part number
  const partId = modalFormData.partNumber ? Number(modalFormData.partNumber) : null;

  // Fetch products by part number using API
  const { data: productsResponse } = useProductsByPart(partId);

  // Reset form data when modal opens/closes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setModalFormData(initialData);
      } else {
        setModalFormData({
          partNumber: "",
          orderQuantity: ""
        });
      }
      setModalValidationErrors({
        partNumber: '',
        orderQuantity: ''
      });
    }
  }, [open, initialData]);

  const handleModalInputChange = (field: string, value: string) => {
    // Only allow numbers for Order Quantity field
    if (field === FORM_FIELD_KEYS.ORDER_QUANTITY) {
      // Use numberValidation.test like other pages
      if (!numberValidation.test(value) && value !== '') return;
    }

    setModalFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    setModalValidationErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateModal = () => {
    const errors = {
      partNumber: '',
      orderQuantity: ''
    };

    if (!modalFormData.partNumber) {
      errors.partNumber = VALIDATION_MESSAGES.PART_NUMBER_REQUIRED;
    }

    if (!modalFormData.orderQuantity.trim()) {
      errors.orderQuantity = VALIDATION_MESSAGES.ORDER_QUANTITY_REQUIRED;
    } else if (isNaN(Number(modalFormData.orderQuantity)) || Number(modalFormData.orderQuantity) <= NUMBERMAP.ZERO) {
      errors.orderQuantity = VALIDATION_MESSAGES.ORDER_QUANTITY_INVALID;
    }

    setModalValidationErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleModalSave = () => {
    // Validate modal form data
    if (!validateModal()) {
      return;
    }

    // Find the selected part number details
    const selectedPart = partNumbersData?.data?.find(
      (part: PartNumberData) => part.id.toString() === modalFormData.partNumber
    );

    if (!selectedPart) {
      showActionAlert(FAILED_ALERT);
      return;
    }

    // Call the parent's save handler
    onSave(modalFormData);
  };

  const handleModalCancel = () => {
    onClose();
  };

  // Products table columns
  const productsColumns: GridColDef[] = [
    {
      headerName: PRODUCTS_HEADERS.SNO,
      field: PRODUCTS_FIELDS.SNO,
      sortable: false,
      disableColumnMenu: true,
      flex: NUMBERMAP.HALF,
    },
    {
      headerName: PRODUCTS_HEADERS.PRODUCT_NAME,
      field: PRODUCTS_FIELDS.PRODUCT_NAME,
      flex: NUMBERMAP.ONE,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleModalCancel}
      title={editingPartId ? PAGE_TITLES.EDIT_PART_DETAILS : PAGE_TITLES.ADD_PART_DETAILS}
      onSave={handleModalSave}
      buttonRequired={true}
      modalMaxWidth={MODAL_MAX_WIDTH}
    >
      <Grid2 container spacing={NUMBERMAP.TWO}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <InputField
            label={FORM_LABELS.PART_NUMBER}
            placeholder={FORM_PLACEHOLDERS.SELECT_PART_NUMBER}
            isDropdown
            options={partNumbersData?.data ?? []}
            valueField={FORM_FIELD_NAMES.PART_NUMBER}
            keyField={FORM_FIELD_NAMES.ID}
            value={modalFormData.partNumber}
            onChange={(value: string) => handleModalInputChange(FORM_FIELD_KEYS.PART_NUMBER, value)}
            error={modalValidationErrors.partNumber}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <InputField
            label={FORM_LABELS.ORDER_QUANTITY}
            placeholder={FORM_PLACEHOLDERS.ENTER_ORDER_QUANTITY}
            value={modalFormData.orderQuantity}
            onChange={(value: string) => handleModalInputChange(FORM_FIELD_KEYS.ORDER_QUANTITY, value)}
            error={modalValidationErrors.orderQuantity}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title={PAGE_TITLES.PRODUCTS}
            columns={productsColumns}
            rows={productsResponse?.data ?? []}
            idField="product_id"
            hideFooter
            hideHeader={false}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  );
};

export default SamplePurchaseOrderModal;
