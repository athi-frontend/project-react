"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Grid2, Box, Typography } from "@mui/material";
import { RichTextEditor, InputField, DataTable,Label, Description, showActionAlert } from "@/components/ui";
import { GridColDef } from "@mui/x-data-grid";
import { NUMBERMAP, DATE_FORMATS, STATUS, BUTTON_LABEL, PERMISSION_ACTIONS, FINALFILEINITIALDATA } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5, STYLE7 } from "@/styles/modules/hr/candidateEvaluation";
import { GRID_STYLES } from "@/styles/common";
import { ButtonContainer } from "@/styles/components/ui/button";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import DatePicker from "@/components/ui/data-picker/DataPicker";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import SubHeader from "@/components/modules/regulation/executive-summary/SubHeader";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { formatDate, formatDateForAPI, mergeFinalFileData, FinalFileData, INITIALFILE, mapFileResponse, mapDocumentsByCategory } from "@/lib/utils/common";
import type { FileData } from "@/types/components/ui/fileUploadV3";
import {
  useDeliveryDispatchById,
  useSaveDeliveryDispatch,
} from "@/hooks/modules/sales/useDeliveryDispatch";
import { useAllQuotations } from "@/hooks/modules/sales/useOrderAcknowledgement";
import { useOrganizationStatus } from '@/hooks/useCommonDropdown';
import {
  DELIVERY_DISPATCH_FIELD_LABELS,
  DELIVERY_DISPATCH_CONSTANTS,
  VALIDATION_MESSAGES,
  INITIAL_DELIVERY_DISPATCH,
  DELIVERY_DISPATCH_FORM_TABLE_COLUMNS,
  DELIVERY_DISPATCH_FORM_LABELS,
  DELIVERY_DISPATCH_FORM_FIELDS,
  STATUS_DROPDOWN_CONFIG,
  DROPDOWN_FIELDS,
} from "@/constants/modules/sales/deliveryDispatch";
import { FUNCTIONAL_BLOCK_CONSTANTS } from "@/constants/modules/dnd/functionBlock";
import { 
  DeliveryDispatchFormData, 
  ProductDetailResponse, 
  SiteRequirement,
  DeliveryDispatch
} from "@/types/modules/sales/deliveryDispatch";
import SalesReviewerModalManager from '@/components/modules/sales/reviewer-modal/SalesReviewerModalManager';
import { SALES_CONTEXT_TYPE } from '@/constants/commonContextType';
import CommentsHistory from '@/components/ui/comments-history/Comments';
import { useDraftSave } from '@/hooks/common/useDraftSave';
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon';
import { processDraftPreparation, removeFieldsFromFormData, appendFileMetadataToFormData, createFileMetadataGenerator } from '@/lib/utils/modules/sales/draftSaveCommon';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import { unitError } from "@/styles/modules/sales/customerFeedback";
/**
    Classification : Confidential
**/

const DeliveryDispatchForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const deliveryDispatchId = params?.id as string;
  const isCreateMode = deliveryDispatchId === 'create';
  const initialDraftLoading = useRef(true);

  const [formData, setFormData] = useState<DeliveryDispatchFormData>(INITIAL_DELIVERY_DISPATCH);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
  const [productDetailsData, setProductDetailsData] = useState<ProductDetailResponse[]>([]);
  const [siteRequirementData, setSiteRequirementData] = useState<SiteRequirement[]>([]);
  const [invoiceCustomerName, setInvoiceCustomerName] = useState<string>(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
  const [invoiceContactPerson, setInvoiceContactPerson] = useState<string>(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
  const [invoiceAddress, setInvoiceAddress] = useState<string>(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
  
  // Derive ship-to customer name from form data (same as invoice customer name)
  const shipToCustomerName = formData.customer_name ?? FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING;
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(INITIALFILE);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(true);
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({});
  const [draftDelete, setDraftDelete] = useState<string[]>([]);

  // Draft save hook
  const deliveryDispatchIdForDraft = isCreateMode
    ? (formData.quotation_id ?? null)
    : Number(deliveryDispatchId);
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type:'quotation',
    context_instance_id: deliveryDispatchIdForDraft,
    enableFetch: false
  });

  // Fetch delivery dispatch data (only for edit mode)
  const {
    data: deliveryDispatchData,
    refetch: refetchDeliveryDispatch,
    isLoading: isLoadingDeliveryDispatch
  } = useDeliveryDispatchById(isCreateMode ? "" : deliveryDispatchId,!isCreateMode);

  // Fetch delivery dispatch by quotation_id when quotation is selected (for create mode)
  const {
    data: deliveryDispatchByQuotationData
  } = useDeliveryDispatchById(
    isCreateMode && formData?.quotation_id?.toString(),
      isCreateMode && Boolean(formData.quotation_id)
  );

  // Fetch quotations
  const { data: quotationsData } = useAllQuotations();

  // Fetch status options
  const { data: statusData } = useOrganizationStatus();

  // Save mutation
  const {mutate: saveMutation} = useSaveDeliveryDispatch();

  // Helper function to load form data from API response
  const loadFormDataFromApi = useCallback((data: DeliveryDispatch) => {
    if (!data) return;
    // Ensure all form fields have proper defaults to prevent null values in inputs
    setFormData({
      ...data,
      customer_name: data.customer_name ?? '',
      order_number: data.order_number ?? '',
      invoice_location: data.invoice_location ?? '',
      ship_to_contact_person: data.ship_to_contact_person ?? '',
      ship_to_address: data.ship_to_address ?? '',
      ship_to_location: data.ship_to_location ?? '',
      remarks_special_instruction: data.remarks_special_instruction ?? '',
      product_configuration: data.product_configuration ?? '',
      expected_shipping_date: data.expected_shipping_date ?? '',
      status_id: data.status_id ?? data.status ?? null,
    } as DeliveryDispatchFormData);

    setExpectedDeliveryDate(data.expected_delivery_date ?? FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
    setInvoiceCustomerName(data.customer_name ?? FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
    setInvoiceAddress(data.address ?? FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
    setInvoiceContactPerson(data.invoice_contact_person ?? FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
    setProductDetailsData(data.product_details ?? []);
    setSiteRequirementData(data.site_requirements ?? []);
    
    // Load documents for file upload manager
    if (data.documents && data.documents.length > NUMBERMAP.ZERO) {
      setUploadedFiles(data.documents);
    } else {
      setUploadedFiles([]);
    }
  }, [formData?.quotation_id]);

  // Fetch draft on mount
  useEffect(() => {
    if(!isCreateMode){
      refetchDeliveryDispatch()
    }
    setFormData(INITIAL_DELIVERY_DISPATCH)
    setUploadedFiles([])
    setTimeout(() => {
      initialDraftLoading.current = false;
    }, NUMBERMAP.THREETHOUSANDFIVEHUNDRED);
  }, [deliveryDispatchId]);

  const loadDraftData = (data: any) => {
    setFormData({
      ...data,
    });
    if (data.product_details && Array.isArray(data.product_details)) {
      setProductDetailsData(data.product_details);
    }
    if (data.site_requirements && Array.isArray(data.site_requirements)) {
      setSiteRequirementData(data.site_requirements);
    }
    setUploadedFiles([...(data?.draftDocuments?.documents ?? []), ...(data?.documents ?? [])]);
    setDraftDocuments(data?.draftDocuments ?? {});
    setDraftDelete(Array.isArray(data?.draftDelete) ? data.draftDelete : []);
  }

  // Update form data when API data is loaded for edit mode
  useEffect(() => {
    if (!isCreateMode && deliveryDispatchData?.data) {
      // Handle both array and object responses
      if (Array.isArray(deliveryDispatchData.data) && deliveryDispatchData.data.length > NUMBERMAP.ZERO) {
        loadFormDataFromApi(deliveryDispatchData.data[NUMBERMAP.ZERO]);
      } else if (!Array.isArray(deliveryDispatchData.data)) {
        loadDraftData(deliveryDispatchData.data);
      }
    }
  }, [deliveryDispatchData]);

  // Update form data when quotation is selected in create mode
  useEffect(() => {
    const responseData = deliveryDispatchByQuotationData?.data;
    if (responseData) {
      // Handle array response
      if (Array.isArray(responseData) && responseData.length > NUMBERMAP.ZERO) {
      
        loadFormDataFromApi(responseData[NUMBERMAP.ZERO]);
        return;
      }

      // Handle draft object response
      if (!Array.isArray(responseData) && typeof responseData === 'object') {
        let partCategoryDraftedData = deliveryDispatchByQuotationData
        if (partCategoryDraftedData?.data?.documents) {
            partCategoryDraftedData.data.documents = mapFileResponse(partCategoryDraftedData.data.documents ?? []);
            partCategoryDraftedData.data.draftDocuments = mapDocumentsByCategory(partCategoryDraftedData.data?.draftDocuments ?? {});
        }  
          loadDraftData(partCategoryDraftedData.data);
        return;
      }
    }
  }, [deliveryDispatchByQuotationData, formData.quotation_id, isCreateMode, loadFormDataFromApi]);

  const handleDraftSave = (formDataToSave: DeliveryDispatchFormData, productsToSave?: ProductDetailResponse[], fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    const productsToUse = productsToSave ?? productDetailsData
    let draftDatas = isCreateMode ? deliveryDispatchByQuotationData : deliveryDispatchData

    const draftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, documents: uploadedFiles ?? [] },
      { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )

    processDraftPreparation(draftPreparation, setDraftDocuments, setDraftDelete);

    const fieldsToRemove = ['documents']
    const cleaned = removeFieldsFromFormData(formDataToSave, fieldsToRemove)

    const payload = {
      id: deliveryDispatchIdForDraft ?? new Date().getTime(),
      ...cleaned,
      product_details: productsToUse,
      site_requirements: siteRequirementData,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      type: 'draft',
    }

    draftSave({
      form_data: payload,
      upload_documents: {
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: draftPreparation.updateMetaData,
        documents_to_delete: [],
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }

  const handleInputChange = (field: keyof DeliveryDispatchFormData, value: string | number | null): void => {
    // Check edit permission for all fields in edit mode
    if (!isCreateMode && !hasEditPermission) {
      return;
    }
    if (field === "quotation_id") {
      setErrors([]);
      setInvoiceCustomerName("");
      setInvoiceAddress("");
      setInvoiceContactPerson("");
      setFormData(INITIAL_DELIVERY_DISPATCH);  
      setProductDetailsData([]);
      setUploadedFiles([]);
    }
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (!initialDraftLoading.current) {
        handleDraftSave(updated);
      }
      return updated;
    });

    // Clear error when user inputs a value
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING }));
    }
  };

  const handleDateChange = (field: keyof DeliveryDispatchFormData, date: Dayjs | null): void => {
    if (!hasEditPermission) return;
    const dateString = date ? formatDateForAPI(date, 'yyyy-MM-dd') : FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING;
    
    // Validate shipping date is not after delivery date
    if (field === DELIVERY_DISPATCH_FORM_FIELDS.EXPECTED_SHIPPING_DATE && date && expectedDeliveryDate) {
      const shippingDate = date;
      const deliveryDate = dayjs(expectedDeliveryDate);
      if (shippingDate.isAfter(deliveryDate)) {
        setErrors(prev => ({ ...prev, [DELIVERY_DISPATCH_FORM_FIELDS.EXPECTED_SHIPPING_DATE]: VALIDATION_MESSAGES.SHIPPING_DATE_AFTER_DELIVERY_DATE }));
        return;
      }
    }
    
    setFormData(prev => {
      const updated = { ...prev, [field]: dateString };
      if (!initialDraftLoading.current) {
        handleDraftSave(updated);
      }
      return updated;
    });

    // Clear error when user selects a date
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const isRichTextEmpty = (value: string) => {
      const strippedValue = value.trim();
      return !strippedValue;
    };

    if (!formData.quotation_id) {
      newErrors.quotation_id = VALIDATION_MESSAGES.QUOTATION_NUMBER;
    }
    if (!formData.invoice_location?.trim()) {
      newErrors.invoice_location = VALIDATION_MESSAGES.INVOICE_LOCATION;
    }
    if (!formData.ship_to_contact_person?.trim()) {
      newErrors.ship_to_contact_person = VALIDATION_MESSAGES.SHIP_TO_CONTACT_PERSON;
    }
    if (!formData.ship_to_address?.trim()) {
      newErrors.ship_to_address = VALIDATION_MESSAGES.SHIP_TO_ADDRESS;
    }
    if (!formData.ship_to_location?.trim()) {
      newErrors.ship_to_location = VALIDATION_MESSAGES.SHIP_TO_LOCATION;
    }
    if (isRichTextEmpty(formData.remarks_special_instruction)) {
      newErrors.remarks_special_instruction = VALIDATION_MESSAGES.REMARKS_SPECIAL_INSTRUCTION;
    }
    if (isRichTextEmpty(formData.product_configuration)) {
      newErrors.product_configuration = VALIDATION_MESSAGES.PRODUCT_CONFIGURATION;
    }
    if (!formData.expected_shipping_date?.trim()) {
      newErrors[DELIVERY_DISPATCH_FORM_FIELDS.EXPECTED_SHIPPING_DATE] = VALIDATION_MESSAGES.EXPECTED_SHIPPING_DATE;
    } else if (expectedDeliveryDate && formData.expected_shipping_date) {
      // Validate shipping date is not after delivery date
      const shippingDate = dayjs(formData.expected_shipping_date);
      const deliveryDate = dayjs(expectedDeliveryDate);
      if (shippingDate.isAfter(deliveryDate)) {
        newErrors[DELIVERY_DISPATCH_FORM_FIELDS.EXPECTED_SHIPPING_DATE] = VALIDATION_MESSAGES.SHIPPING_DATE_AFTER_DELIVERY_DATE;
      }
    }
    if (!formData.status_id) {
      newErrors[DROPDOWN_FIELDS.STATUS] = VALIDATION_MESSAGES.STATUS;
    }
    const hasZeroOrMissingUnits = productDetailsData.some(
      (product) =>
        product.number_of_units == null ||
        product.number_of_units === NUMBERMAP.ZERO
    );
    if (productDetailsData.length > NUMBERMAP.ZERO && hasZeroOrMissingUnits) {
      newErrors.product_details = VALIDATION_MESSAGES.NUMBER_OF_UNITS_ZERO;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleCancel = async (): Promise<void> => {
    if (hasEditPermission) {
      await checkUnsavedDraftBeforeLeave();
    }else{
      clearDraftSave();
    }
    router.push(DELIVERY_DISPATCH_CONSTANTS.PATH_NAME);
  };

  const handleFileUpload = (fileData: FileData) => {
    if (!isCreateMode && !hasEditPermission) return;
    // Handle new file upload - add to uploadedFiles for display purposes
    // FileUploadManager will handle the actual file state via onSubmit
    setUploadedFiles((prev) => [...prev, fileData]);
  };

  const handleDocumentFileEdit = useCallback((updatedFile: any) => {
    if (!isCreateMode && !hasEditPermission) return;
    // Handle file edit - update the file in uploadedFiles for display
    if (updatedFile?.id || updatedFile?.file_id || updatedFile?.document_id) {
      const fileId = updatedFile.document_id ?? updatedFile.file_id ?? updatedFile.id;
      setUploadedFiles((prev) => {
        const updatedFiles = prev.map((file) => {
          const currentId = typeof file === 'object' && file !== null
            ? file.id ?? file.file_id ?? file.document_id
            : undefined;
          const updatedId = fileId;
          return currentId === updatedId ? { ...file, ...updatedFile } : file;
        });
        return updatedFiles;
      });
    }
  }, []);

  const handleFileUploadSubmit = (fileData: any) => {
    // Check edit permission before processing file upload submit in edit mode
    if (!isCreateMode && !hasEditPermission) {
      return;
    }
    // Merge file data from FileUploadManager using the utility function
    // This is the single source of truth for file operations (upload, edit, delete)
    setFinalFileData((prev) => mergeFinalFileData(prev, fileData));
    if (!initialDraftLoading.current) {
      handleDraftSave(formData, productDetailsData, mergeFinalFileData(finalFileData, fileData));
    }
  };

  const createFileMetadata = createFileMetadataGenerator({
    isEditMode: !isCreateMode,
    draftData: isCreateMode ? deliveryDispatchByQuotationData : deliveryDispatchData,
    existingData: deliveryDispatchData,
    finalFileData,
    dataPath: 'documents',
  });

  const siteRequirementRows = useMemo(() => (
    siteRequirementData.map((requirement, index) => ({
      ...requirement,
      id: index + NUMBERMAP.ONE}))
  ), [siteRequirementData]);

  const handleSave = (): void => {
    // Check edit permission before saving in edit mode
    if (!isCreateMode && !hasEditPermission) {
      return;
    }

    if (!validateForm()) return;

    // Clear draft on successful save
    clearDraftSave();

    // Validate required fields before sending
    if (!formData.quotation_id) {
      return;
    }

    // Map product details to API format
    const productDetails = productDetailsData.map(product => ({
      quotation_product_id: product.quotation_product_id,
      units: product.number_of_units ?? NUMBERMAP.ZERO,
    }));

    // Use FormData to properly handle File objects (files can't be serialized in JSON)
    const formDataPayload = new FormData();
    formDataPayload.append('quotation_id', formData.quotation_id.toString());
    
    if (formData.delivery_dispatch_id && formData.delivery_dispatch_id > NUMBERMAP.ZERO) {
      formDataPayload.append('delivery_dispatch_id', formData.delivery_dispatch_id.toString());
    }
    
    formDataPayload.append('invoice_location', formData.invoice_location ?? '');
    formDataPayload.append('ship_to_contact_person', formData.ship_to_contact_person ?? '');
    formDataPayload.append('ship_to_address', formData.ship_to_address ?? '');
    formDataPayload.append('ship_to_location', formData.ship_to_location ?? '');
    formDataPayload.append('remarks', formData.remarks_special_instruction ?? '');
    formDataPayload.append('product_configuration', formData.product_configuration ?? '');
    
    if (formData.expected_shipping_date) {
      const shippingDate = formatDateForAPI(formData.expected_shipping_date, 'yyyy-MM-dd');
      if (shippingDate) {
        formDataPayload.append('shipping_date', shippingDate);
      }
    }
    
    if (formData.status_id) {
      formDataPayload.append('status_id', formData.status_id.toString());
    }
    
    if (productDetails.length > NUMBERMAP.ZERO) {
      formDataPayload.append('product_details', JSON.stringify(productDetails));
    }
    
    // Handle file uploads and append file metadata
    appendFileMetadataToFormData(formDataPayload, finalFileData, createFileMetadata);

    saveMutation(formDataPayload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS);
        // Redirect to delivery dispatch list after successful save
        router.push(DELIVERY_DISPATCH_CONSTANTS.PATH_NAME);
      },
      onError: () => {
        showActionAlert(STATUS.FAILED);
      },
    });
  };


  // Handler to update product units
  const handleProductUnitsChange = useCallback((productId: string, value: string) => {
    if (!isCreateMode && !hasEditPermission) return;
    setErrors((prev) => (prev.product_details ? { ...prev, product_details: '' } : prev));
    setProductDetailsData((prev) => {
      const updated = prev.map((product, index) => {
        const currentId = product.quotation_product_id?.toString() ?? `product-${index + NUMBERMAP.ONE}`;
        if (currentId !== productId) {
          return product;
        }

        const trimmedValue = value.trim();
        if (trimmedValue === FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING) {
          return { ...product, number_of_units: null };
        }

        const parsedValue = parseInt(trimmedValue, NUMBERMAP.TEN);
        return {
          ...product,
          number_of_units: Number.isNaN(parsedValue) ? product.number_of_units : parsedValue,
        };
      });
      if (!initialDraftLoading.current) {
        handleDraftSave(formData, updated);
      }
      return updated;
    });
  }, [isCreateMode, hasEditPermission, formData]);

  const productDetailsColumns: GridColDef[] = [
    { field: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.SNO.FIELD, headerName: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.SNO.HEADER, flex: NUMBERMAP.ONE },
    { field: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.PRODUCT_NAME.FIELD, headerName: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.PRODUCT_NAME.HEADER, flex: NUMBERMAP.TWO },
    { field: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.MODEL.FIELD, headerName: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.MODEL.HEADER, flex: NUMBERMAP.ONE },
    {
      field: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.NUMBER_OF_UNITS.FIELD,
      headerName: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.NUMBER_OF_UNITS.HEADER,
      flex: NUMBERMAP.TWO,
      renderCell: (params) => (
        <Box
          sx={GRID_STYLES.CELL_ALIGNMENT}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <InputField
            label=""
            placeholder={DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.NUMBER_OF_UNITS.PLACEHOLDER}
            value={params.row.number_of_units?.toString() ?? ""}
            onChange={(value: string) => {
              handleProductUnitsChange(params.row.quotation_product_id?.toString() ?? "", value);
            }}
            disabled={!hasEditPermission}
          />
        </Box>
      ),
    },
  ];

  const siteRequirementColumns: GridColDef[] = [
    { field: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.SNO.FIELD, headerName: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.SNO.HEADER, flex: NUMBERMAP.ONE },
    { field: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.FACTORS.FIELD, headerName: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.FACTORS.HEADER, flex: NUMBERMAP.TWO },
    { field: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.DETAILS.FIELD, headerName: DELIVERY_DISPATCH_FORM_TABLE_COLUMNS.DETAILS.HEADER, flex: NUMBERMAP.TWO },
  ];

 const buttonConfig = useMemo(() => 
    isCreateMode ? [{action: BUTTON_LABEL.SAVE}, {action: PERMISSION_ACTIONS.VIEW}, {action: BUTTON_LABEL.CANCEL}] : [],
    [isCreateMode]
  );

  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <Box>
          <Label title={`${isCreateMode ? DELIVERY_DISPATCH_FORM_LABELS.CREATE : DELIVERY_DISPATCH_FORM_LABELS.EDIT} ${DELIVERY_DISPATCH_CONSTANTS.TITLE}`} />

          <FormContent>
            {/* Delivery/Dispatch Section */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField 
                  value={!isCreateMode && formData.delivery_dispatch_id ? formData.delivery_dispatch_id.toString() : ""} 
                  label={DELIVERY_DISPATCH_FIELD_LABELS.DELIVERY_INSTRUCTION_ID.LABEL} 
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InputField
                  label={DELIVERY_DISPATCH_FIELD_LABELS.QUOTATION_NUMBER.LABEL}
                  placeholder={DELIVERY_DISPATCH_FIELD_LABELS.QUOTATION_NUMBER.PLACEHOLDER}
                  isDropdown
                  value={formData.quotation_id?.toString() ?? ""}
                  onChange={(value: string) => handleInputChange('quotation_id', value ? Number(value) : null)}
                  options={quotationsData?.data ?? []}
                  keyField={DELIVERY_DISPATCH_FIELD_LABELS.QUOTATION_NUMBER.keyField}
                  valueField={DELIVERY_DISPATCH_FIELD_LABELS.QUOTATION_NUMBER.valueField}
                  error={errors.quotation_id ?? ''}
                  disabled={!isCreateMode && !hasEditPermission}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField value={formData.order_number} label={DELIVERY_DISPATCH_FIELD_LABELS.ORDER_NUMBER.LABEL} />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField value={formData.customer_name} label={DELIVERY_DISPATCH_FIELD_LABELS.CUSTOMER_NAME.LABEL} />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField 
                  value={formatDate(expectedDeliveryDate, DATE_FORMATS.DD_MM_YYYY) ?? ''} 
                  label={DELIVERY_DISPATCH_FIELD_LABELS.EXPECTED_DELIVERY_DATE.LABEL} 
                />
              </Grid2>
            </Grid2>

            {/* Invoice Details Section */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE7}>
              <SubHeader title={DELIVERY_DISPATCH_FORM_LABELS.INVOICE_DETAILS} />
            </Grid2>
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField value={invoiceCustomerName} label={DELIVERY_DISPATCH_FIELD_LABELS.CUSTOMER_NAME.LABEL} />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField value={invoiceContactPerson} label={DELIVERY_DISPATCH_FORM_FIELDS.CONTACT_PERSON} />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField value={invoiceAddress} label={DELIVERY_DISPATCH_FORM_FIELDS.ADDRESS} />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InputField
                  label={DELIVERY_DISPATCH_FIELD_LABELS.INVOICE_LOCATION.LABEL}
                  placeholder={DELIVERY_DISPATCH_FIELD_LABELS.INVOICE_LOCATION.PLACEHOLDER}
                  value={formData.invoice_location}
                  onChange={(value: string) => handleInputChange('invoice_location', value)}
                  error={errors.invoice_location ?? ''}
                  disabled={!hasEditPermission}
                />
              </Grid2>
            </Grid2>

            {/* Ship To Section */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE7}>
              <SubHeader title={DELIVERY_DISPATCH_FORM_LABELS.SHIP_TO} />
            </Grid2>
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField value={shipToCustomerName} label={DELIVERY_DISPATCH_FIELD_LABELS.CUSTOMER_NAME.LABEL} />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InputField
                  label={DELIVERY_DISPATCH_FIELD_LABELS.SHIP_TO_CONTACT_PERSON.LABEL}
                  placeholder={DELIVERY_DISPATCH_FIELD_LABELS.SHIP_TO_CONTACT_PERSON.PLACEHOLDER}
                  value={formData.ship_to_contact_person}
                  onChange={(value: string) => handleInputChange('ship_to_contact_person', value)}
                  error={errors.ship_to_contact_person ?? ''}
                  disabled={!hasEditPermission}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <Description
                  label={DELIVERY_DISPATCH_FIELD_LABELS.SHIP_TO_ADDRESS.LABEL}
                  placeholder={DELIVERY_DISPATCH_FIELD_LABELS.SHIP_TO_ADDRESS.PLACEHOLDER}
                  value={formData.ship_to_address}
                  onChange={(value: string) => handleInputChange('ship_to_address', value)}
                  error={errors.ship_to_address ?? ''}
                  disabled={!hasEditPermission}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InputField
                  label={DELIVERY_DISPATCH_FIELD_LABELS.SHIP_TO_LOCATION.LABEL}
                  placeholder={DELIVERY_DISPATCH_FIELD_LABELS.SHIP_TO_LOCATION.PLACEHOLDER}
                  value={formData.ship_to_location}
                  onChange={(value: string) => handleInputChange('ship_to_location', value)}
                  error={errors.ship_to_location ?? ''}
                  disabled={!hasEditPermission}
                />
              </Grid2>
            </Grid2>
            </FormContent>
            {/* Product Details Section */}
            <Grid2 container sx={STYLE5}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <Label title={DELIVERY_DISPATCH_FORM_LABELS.PRODUCT_DETAILS} />
                <DataTable
                  rows={productDetailsData ?? []}
                  columns={productDetailsColumns}
                  IdField={DELIVERY_DISPATCH_FORM_FIELDS.PRODUCT_ID}
                  checkbox={false}
                />
                {errors.product_details ? (
                  <Typography sx={unitError}>
                    {errors.product_details}
                  </Typography>
                ) : null}
              </Grid2>
            </Grid2>
            <FormContent>
            {/* Rich Text Editors Section */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={DELIVERY_DISPATCH_FIELD_LABELS.REMARKS_SPECIAL_INSTRUCTION.LABEL}
                  value={formData.remarks_special_instruction}
                  onChange={(value) => handleInputChange('remarks_special_instruction', value)}
                  placeholder={DELIVERY_DISPATCH_FIELD_LABELS.REMARKS_SPECIAL_INSTRUCTION.PLACEHOLDER}
                  error={errors.remarks_special_instruction ?? ''}
                  disabled={ !hasEditPermission}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={DELIVERY_DISPATCH_FIELD_LABELS.PRODUCT_CONFIGURATION.LABEL}
                  value={formData.product_configuration}
                  onChange={(value) => handleInputChange('product_configuration', value)}
                  placeholder={DELIVERY_DISPATCH_FIELD_LABELS.PRODUCT_CONFIGURATION.PLACEHOLDER}
                  error={errors.product_configuration ?? ''}
                  disabled={!hasEditPermission}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <DatePicker
                  label={DELIVERY_DISPATCH_FIELD_LABELS.EXPECTED_SHIPPING_DATE.LABEL}
                  value={formData.expected_shipping_date ? dayjs(formData.expected_shipping_date) : null}
                  onChange={(date) => {
                    handleDateChange(DELIVERY_DISPATCH_FORM_FIELDS.EXPECTED_SHIPPING_DATE as keyof DeliveryDispatchFormData, date)
                  }}
                  error={errors[DELIVERY_DISPATCH_FORM_FIELDS.EXPECTED_SHIPPING_DATE] ?? ''}
                  readOnly={!hasEditPermission}
                />
              </Grid2>
              <Grid2 size={{  md: NUMBERMAP.SIX }}>
                <InputField
                  label={DELIVERY_DISPATCH_FIELD_LABELS.STATUS.LABEL}
                  placeholder={DELIVERY_DISPATCH_FIELD_LABELS.STATUS.PLACEHOLDER}
                  isDropdown
                  value={formData.status_id?.toString() ?? ""}
                  onChange={(value: string) => handleInputChange(DROPDOWN_FIELDS.STATUS, value ? Number(value) : null)}
                  error={errors[DROPDOWN_FIELDS.STATUS] ?? ''}
                  options={statusData?.data ?? []}
                  keyField={STATUS_DROPDOWN_CONFIG.KEY_FIELD}
                  valueField={STATUS_DROPDOWN_CONFIG.VALUE_FIELD}
                  disabled={!hasEditPermission}
                />
              </Grid2>
            </Grid2>
            </FormContent>
            {/* Site Requirement Specifications */}
            <Grid2 container sx={STYLE5}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <Label title={DELIVERY_DISPATCH_FORM_LABELS.SITE_REQUIREMENT_SPECIFICATIONS} />
                <DataTable
                  rows={siteRequirementRows}
                  columns={siteRequirementColumns}
                  IdField={DELIVERY_DISPATCH_FORM_FIELDS.ID}
                  checkbox={false}
                />
              </Grid2>
            </Grid2>
            <FormContent>
            {/* File Upload Section */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <FileUploadManager
                  initialFiles={uploadedFiles}
                  onFileUpload={handleFileUpload}
                  onFileEdit={handleDocumentFileEdit}
                  onSubmit={handleFileUploadSubmit}
                  subHeader={DELIVERY_DISPATCH_FORM_LABELS.UPLOAD}
                  hasEditable={ !hasEditPermission}
                />
              </Grid2>
            </Grid2>
             {/* Comments History */}
             {!isCreateMode && (
              <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <CommentsHistory 
                    comments={(deliveryDispatchData?.meta_info?.task_info?.task_comments ?? []) as any} 
                  />
                </Grid2>
              </Grid2>
            )}
            </FormContent>
            <FormContent>
            {/* Action Buttons */}
            <ButtonContainer>
             
            <SalesReviewerModalManager
                  isLoading={isCreateMode ? true : isLoadingDeliveryDispatch}
                  permissions={deliveryDispatchData?.meta_info?.action_control?.permissions ?? deliveryDispatchByQuotationData?.meta_info?.action_control?.permissions ?? buttonConfig}
                  taskInfo={deliveryDispatchData?.meta_info?.task_info ?? { task_comments: [], reviewer_list: [], task_id: undefined }}
                  menuId={deliveryDispatchData?.meta_info?.action_control?.menuId}
                  menuName={deliveryDispatchData?.meta_info?.action_control?.formName}
                  contextType={SALES_CONTEXT_TYPE.QUOTATION}
                  contextId={Number(deliveryDispatchId)}
                  customHandlers={{
                    handleCancel: handleCancel,
                    handleSave: handleSave,
                  }}
                  onPermissionChange={setHasEditPermission}
                  refetch={refetchDeliveryDispatch}
                  hideSaveButton={false}
                />
              
            </ButtonContainer>
          </FormContent>
        </Box>
      </FormWrapper>
    </FormContainer>
  );
};

export default DeliveryDispatchForm;
