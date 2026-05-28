"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Grid2, Box, useTheme, IconButton } from "@mui/material";
import { InputField, DataTable, Label, showActionAlert } from "@/components/ui";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { NUMBERMAP, DATE_FORMATS, BUTTON_LABEL, PERMISSION_ACTIONS, FINALFILEINITIALDATA } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import { ButtonContainer } from "@/styles/components/ui/button";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import DatePicker from '@/components/ui/data-picker/DataPicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { DocumentDownload } from 'iconsax-react';
import { getfileURL, useOrganizationStatus } from "@/hooks/useCommonDropdown";
import { handleFileDownloadByUrl, formatDate, formatDateForAPI, mergeFinalFileData, FinalFileData, INITIALFILE, COMMON_CONSTANTS, mapFileResponse, mapDocumentsByCategory } from "@/lib/utils/common";
import { validateAndFocusFirstEmptyField } from "@/lib/utils/formUtils";
import { downloadStyles } from "@/styles/components/ui/datatable";
import {
  useOrderAcknowledgementById,
  useUpsertOrderAcknowledgement,
  useAllOrderApprovalModes,
  useAllQuotations,
  useQuotationById
} from "@/hooks/modules/sales/useOrderAcknowledgement";
import {
  ORDER_ACKNOWLEDGEMENT_FIELD_LABELS,
  ORDER_ACKNOWLEDGEMENT_CONSTANTS,
  DOCUMENT_COLUMNS,
  UPLOADED_DOCUMENTS_LABEL,
  ERROR_MESSAGES,
  FIELD_ORDER,
  FIELD_LABEL_MAP,
  DROPDOWN_FIELDS,
} from "@/constants/modules/sales/orderAcknowledgement";
import { FUNCTIONAL_BLOCK_CONSTANTS } from "@/constants/modules/dnd/functionBlock";
import {
  OrderAcknowledgementFormData,
  OrderAcknowledgementSupportingFileDocument
} from "@/types/modules/sales/orderAcknowledgement";
import type { QuotationWithFiles, SupportingFile } from "@/types/modules/sales/quotation";
import SalesReviewerModalManager from '@/components/modules/sales/reviewer-modal/SalesReviewerModalManager';
import { SALES_CONTEXT_TYPE } from '@/constants/commonContextType';
import CommentsHistory from '@/components/ui/comments-history/Comments';
import { useDraftSave } from '@/hooks/common/useDraftSave';
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon';
import { processDraftPreparation, removeFieldsFromFormData, appendFileMetadataToFormData, createFileMetadataGenerator } from '@/lib/utils/modules/sales/draftSaveCommon';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import { FileData } from "@/types/components/ui/fileUploadV3";
/**
 * Classification : Confidential
 **/

const OrderAcknowledgement: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const orderAcknowledgementId = params?.id as string;
  const isCreateMode = orderAcknowledgementId === 'create';

  const [formData, setFormData] = useState<OrderAcknowledgementFormData>({
    quotation_id: null,
    order_acknowledgement_id: NUMBERMAP.ZERO,
    customer_name: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
    order_number: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
    approval_mode_id: null,
    order_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
    expected_delivery_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
    status_id: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quotationDate, setQuotationDate] = useState<string>(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
  const [documentRows, setDocumentRows] = useState<SupportingFile[]>([]);
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(INITIALFILE);
  const [uploadedFiles, setUploadedFiles] = useState<OrderAcknowledgementSupportingFileDocument[]>([]);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(true);
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({});
  const [draftDelete, setDraftDelete] = useState<string[]>([]);

  // Draft save hook
  const orderAcknowledgementIdForDraft = isCreateMode ? null : Number(orderAcknowledgementId);
  const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'order_acknowledgement',
    context_instance_id: orderAcknowledgementIdForDraft,
    enableFetch: false
  });

  // Fetch order acknowledgement data (only for edit mode)
  const {
    data: orderAcknowledgementData,
    refetch: refetchOrderAcknowledgement,
  } = useOrderAcknowledgementById(orderAcknowledgementId, !isCreateMode);

  // Fetch order approval modes
  const {
    data: orderApprovalModesData
  } = useAllOrderApprovalModes(NUMBERMAP.ONE);

  // Fetch quotations
  const {
    data: quotationsData
  } = useAllQuotations();

  // Fetch quotation by id when a quotation is selected
  const {
    data: quotationByIdData,
  } = useQuotationById((formData.quotation_id ?? "").toString(), !!formData.quotation_id);

  // Fetch status options
  const { data: statusData } = useOrganizationStatus();

  // Upsert mutation
  const upsertMutation = useUpsertOrderAcknowledgement();

  // Refetch data when navigating back to the page (edit mode only)
  useEffect(() => {
    if (!isCreateMode && orderAcknowledgementId) {
      refetchOrderAcknowledgement();
    } else {
      fetchDraft();
    }
    // Fetch draft on mount
  }, [orderAcknowledgementId, isCreateMode, fetchDraft]);

  // Update form data when API data is loaded (only for edit mode)
  useEffect(() => {
    if (!isCreateMode && orderAcknowledgementData?.data) {

      // Handle both array and object responses
      if (Array.isArray(orderAcknowledgementData.data) && orderAcknowledgementData.data.length === NUMBERMAP.ZERO) {
        return; // No data in array
      } else {
        let orderAcknowledgementDraftData = orderAcknowledgementData
        if (orderAcknowledgementDraftData?.data?.documents) {
          orderAcknowledgementDraftData.data.documents = mapFileResponse(orderAcknowledgementDraftData.data.documents ?? []);
          orderAcknowledgementDraftData.data.draftDocuments = mapDocumentsByCategory(orderAcknowledgementDraftData.data?.draftDocuments ?? {})
        }
        draftLoading(orderAcknowledgementDraftData?.data);
      }

      const data = Array.isArray(orderAcknowledgementData.data)
        ? orderAcknowledgementData.data[NUMBERMAP.ZERO]
        : orderAcknowledgementData.data;

      // Load data for edit mode
      setFormData(data);
      // Load documents for file upload manager
      const orderAcknowledgementDocuments = data.order_acknowledgement_supporting_file_documents;
      if (orderAcknowledgementDocuments && orderAcknowledgementDocuments.length > NUMBERMAP.ZERO) {
        setUploadedFiles(orderAcknowledgementDocuments);
      }
    }
  }, [orderAcknowledgementData, isCreateMode]);

  const draftLoading = (data) => {
    setFormData(data);
    setUploadedFiles([...(data?.draftDocuments?.order_acknowledgement_supporting_file_documents ?? []), ...(data?.documents ?? [])]);
    setDraftDocuments(data?.draftDocuments ?? {});
    setDraftDelete(Array.isArray(data?.draftDelete) ? data.draftDelete : []);
  }
  // Load draft data
  useEffect(() => {
    if (draftData?.data) {
      draftLoading(draftData.data);
    }
  }, [draftData]);

  // When quotation is selected, populate customer name, quotation date and documents
  useEffect(() => {
    // If quotation_id is null, clear all derived fields
    if (!formData.quotation_id) {
      setFormData(prev => ({
        ...prev,
        customer_name: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        approval_mode_id: null,
        order_number: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        order_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        expected_delivery_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
      }));
      setQuotationDate(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
      setDocumentRows([]);
      setUploadedFiles([]);
      setFinalFileData(INITIALFILE);
      // Clear errors for cleared fields
      setErrors(prev => ({
        ...prev,
        approval_mode_id: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        order_number: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        order_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        expected_delivery_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
      }));
      return;
    }

    const quotation = quotationByIdData?.data?.[NUMBERMAP.ZERO];
    if (!quotation) return;

    // Update derived fields from quotation
    setFormData(prev => ({
      ...prev,
      customer_name: quotation.customer_name ?? FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
    }));

    setQuotationDate(quotation.quotation_date ?? FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);

    // Set documents directly from supporting_files structure
    const quotationWithFiles = quotation as QuotationWithFiles;
    const rawDocs: SupportingFile[] = quotationWithFiles?.supporting_files ?? [];

    setDocumentRows(rawDocs);
  }, [quotationByIdData, formData.quotation_id]);

  const handleDraftSave = (formDataToSave: OrderAcknowledgementFormData, fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = isCreateMode ? draftData : orderAcknowledgementData

    const draftConfig = {
      fileFieldToSectionMap: { 'order_acknowledgement_supporting_file_documents': 'order_acknowledgement_supporting_file_documents' },
      sectionTypeToNameMap: { 'order_acknowledgement_supporting_file_documents': 'order_acknowledgement_supporting_file_documents' },
      responseDataKeyMap: { 'order_acknowledgement_supporting_file_documents': 'order_acknowledgement_supporting_file_documents' },
    }

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, order_acknowledgement_supporting_file_documents: uploadedFiles ?? [] },
      { order_acknowledgement_supporting_file_documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )

    processDraftPreparation(draftPreparation, setDraftDocuments, setDraftDelete);

    const fieldsToRemove = ['order_acknowledgement_supporting_file_documents']
    const cleaned = removeFieldsFromFormData(formDataToSave, fieldsToRemove)

    const payload = {
      id: orderAcknowledgementIdForDraft ?? new Date().getTime(),
      ...cleaned,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      type: 'draft',
    }

    draftSave({
      form_type: 'order_acknowledgement',
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

  const handleInputChange = (field: keyof OrderAcknowledgementFormData, value: string | number | null): void => {
    // Check edit permission for dropdown fields
    if (!isCreateMode && !hasEditPermission && (field === DROPDOWN_FIELDS.QUOTATION_ID || field === DROPDOWN_FIELDS.APPROVAL_MODE_ID || field === DROPDOWN_FIELDS.STATUS_ID)) {
      return;
    }

    // Check if quotation_id is changing to a different value
    const isQuotationChanging = field === 'quotation_id' && formData.quotation_id !== value;

    // If quotation_id is being cleared, also clear derived fields
    if (field === 'quotation_id' && !value) {
      setFormData(prev => {
        const updated = { 
          ...prev, 
          [field]: value,
          customer_name: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
          approval_mode_id: null,
          order_number: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
          order_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
          expected_delivery_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        };
        handleDraftSave(updated);
        return updated;
      });
      setQuotationDate(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING);
      setDocumentRows([]);
      setUploadedFiles([]);
      setFinalFileData(INITIALFILE);
      // Clear errors for cleared fields
      setErrors(prev => ({
        ...prev,
        approval_mode_id: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        order_number: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        order_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
        expected_delivery_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING,
      }));
    } else {
      setFormData(prev => {
        const updated = { ...prev, [field]: value };
        handleDraftSave(updated);
        return updated;
      });

      // Clear local file uploads when quotation_id changes to a different value
      if (isQuotationChanging) {
        setUploadedFiles([]);
        setFinalFileData(INITIALFILE);
      }
    }

    // Clear error when user inputs a value
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING }));
    }
  };

  const handleDateChange = (field: keyof OrderAcknowledgementFormData, date: Dayjs | null): void => {
    if (!isCreateMode && !hasEditPermission) return;

    const dateString = date ? formatDateForAPI(date, 'yyyy-MM-dd') : FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING;
    
    // Clear error when user selects a date for expected_delivery_date (before validation)
    if (field === 'expected_delivery_date' && date) {
      setErrors(prev => ({ 
        ...prev, 
        expected_delivery_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING 
      }));
    }
    
    // Clear error when user selects a date for order_date (before validation)
    if (field === 'order_date' && date) {
      setErrors(prev => ({ 
        ...prev, 
        order_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING 
      }));
    }
    
    setFormData(prev => {
      const updated = { ...prev, [field]: dateString };
      
      // Validate Order Date is not before Quotation Date
      if (field === 'order_date' && date && quotationDate) {
        const quotationDateValue = dayjs(quotationDate);
        const orderDateValue = dayjs(dateString);
        
        if (orderDateValue.isBefore(quotationDateValue)) {
          setErrors(prev => ({ 
            ...prev, 
            order_date: ERROR_MESSAGES.ORDER_DATE_BEFORE_QUOTATION_DATE 
          }));
        } else {
          // Clear error if validation passes
          setErrors(prev => ({ 
            ...prev, 
            order_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING 
          }));
        }
      }
      
      // Validate Expected Delivery Date is after Order Date
      if (field === 'expected_delivery_date' && date && updated.order_date) {
        const orderDate = dayjs(updated.order_date);
        const expectedDeliveryDate = dayjs(dateString);
        
        if (expectedDeliveryDate.isBefore(orderDate) || expectedDeliveryDate.isSame(orderDate)) {
          setErrors(prev => ({ 
            ...prev, 
            expected_delivery_date: ERROR_MESSAGES.EXPECTED_DELIVERY_DATE_BEFORE_ORDER_DATE 
          }));
        } else {
          // Clear error if validation passes
          setErrors(prev => ({ 
            ...prev, 
            expected_delivery_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING 
          }));
        }
      }
      
      // Validate Expected Delivery Date when Order Date changes
      if (field === 'order_date' && updated.expected_delivery_date) {
        const orderDate = dayjs(dateString);
        const expectedDeliveryDate = dayjs(updated.expected_delivery_date);
        
        if (expectedDeliveryDate.isBefore(orderDate) || expectedDeliveryDate.isSame(orderDate)) {
          setErrors(prev => ({ 
            ...prev, 
            expected_delivery_date: ERROR_MESSAGES.EXPECTED_DELIVERY_DATE_BEFORE_ORDER_DATE 
          }));
        } else {
          // Clear error if validation passes
          setErrors(prev => ({ 
            ...prev, 
            expected_delivery_date: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING 
          }));
        }
      }
      
      handleDraftSave(updated);
      return updated;
    });

    // Clear error when user selects a date (for other date fields)
    if (errors[field] && field !== 'expected_delivery_date' && field !== 'order_date') {
      setErrors(prev => ({ ...prev, [field]: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.EMPTY_STRING }));
    }
  };

  const validate = () => {

    const newErrors: { [key: string]: string } = {};
    if (!formData.quotation_id) newErrors.quotation_id = ERROR_MESSAGES.QUOTATION_ID;
    if (!formData.approval_mode_id) newErrors.approval_mode_id = ERROR_MESSAGES.APPROVAL_MODE_ID;
    if (!formData.expected_delivery_date?.trim()) newErrors.expected_delivery_date = ERROR_MESSAGES.EXPECTED_DELIVERY_DATE;
    if (!formData.status_id) newErrors.status_id = ERROR_MESSAGES.STATUS_ID;
    
    // Validate that Expected Delivery Date is after Order Date
    if (formData.order_date && formData.expected_delivery_date) {
      const orderDate = dayjs(formData.order_date);
      const expectedDeliveryDate = dayjs(formData.expected_delivery_date);
      
      if (expectedDeliveryDate.isBefore(orderDate) || expectedDeliveryDate.isSame(orderDate)) {
        newErrors.expected_delivery_date = ERROR_MESSAGES.EXPECTED_DELIVERY_DATE_BEFORE_ORDER_DATE;
      }
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > COMMON_CONSTANTS.EMPTY_ARRAY_LENGTH) {
      validateAndFocusFirstEmptyField(formData, Array.from(FIELD_ORDER), FIELD_LABEL_MAP);
    }
    return Object.keys(newErrors).length === COMMON_CONSTANTS.EMPTY_ARRAY_LENGTH;
  };

  const handleCancel = async (): Promise<void> => {
    await checkUnsavedDraftBeforeLeave();
    setFormData({
      quotation_id: null,
      order_acknowledgement_id: NUMBERMAP.ZERO,
      customer_name: "",
      order_number: "",
      approval_mode_id: null,
      order_date: "",
      expected_delivery_date: "",
      status_id: null,
    });
    setFinalFileData(INITIALFILE);
    setUploadedFiles([]);
    // Redirect to order acknowledgement list on cancel
    router.push(ORDER_ACKNOWLEDGEMENT_CONSTANTS.PATH_NAME);
  };

  const handleFileEdit = useCallback((updatedFile: any) => {
    setUploadedFiles((prev) => {
      const updatedFiles = prev?.map((file) => {
        const currentId = typeof file === 'object' && 'id' in file
          ? (file as Record<string, unknown>).id
          : undefined;
        const updatedId = updatedFile.document_id ?? updatedFile.id;
        return currentId === updatedId ? { ...file, ...updatedFile } : file;
      });
      return updatedFiles
    });
  }, []);

  const handleFileUploadSubmit = (fileData: Partial<FinalFileData>) => {
    // Merge file data from FileUploadManager using the utility function
    // This is the single source of truth for file operations (upload, edit, delete)
    setFinalFileData((prev) => mergeFinalFileData(prev, fileData));
    handleDraftSave(formData, mergeFinalFileData(finalFileData, fileData));
  };

  const handleFileUpload = (fileData: FileData) => {
    setUploadedFiles((prev) => [...prev, fileData]);
  };

  const createFileMetadata = createFileMetadataGenerator({
    isEditMode: !isCreateMode,
    draftData,
    existingData: orderAcknowledgementData,
    finalFileData,
    dataPath: 'order_acknowledgement_supporting_file_documents',
  });

  function handleSave(next?: OrderAcknowledgementFormData) {
    const currentFormData = next ?? formData;
    if (!validate()) {
      return;
    }

    // Clear draft on successful save
    clearDraftSave();

    // Use FormData to properly handle File objects (files can't be serialized in JSON)
    const formDataPayload = new FormData();
    formDataPayload.append('quotation_id', currentFormData.quotation_id!.toString());

    if (currentFormData.order_acknowledgement_id && currentFormData.order_acknowledgement_id > NUMBERMAP.ZERO) {
      formDataPayload.append('order_acknowledgement_id', currentFormData.order_acknowledgement_id.toString());
    }

    formDataPayload.append('order_number', currentFormData.order_number ?? '');
    formDataPayload.append('approval_mode_id', currentFormData.approval_mode_id!.toString());

    if (currentFormData.order_date) {
      const orderDate = formatDateForAPI(currentFormData.order_date, 'yyyy-MM-dd');
      if (orderDate) {
        formDataPayload.append('order_date', orderDate);
      }
    }

    if (currentFormData.expected_delivery_date) {
      const deliveryDate = formatDateForAPI(currentFormData.expected_delivery_date, 'yyyy-MM-dd');
      if (deliveryDate) {
        formDataPayload.append('expected_delivery_date', deliveryDate);
      }
    }

    if (currentFormData?.status_id) {
      formDataPayload.append('status_id', currentFormData?.status_id?.toString());
    }

    // Handle file uploads and append file metadata
    appendFileMetadataToFormData(formDataPayload, finalFileData, createFileMetadata);

    upsertMutation.mutateAsync(formDataPayload)
      .then(() => {
        showActionAlert('success');
        router.push(ORDER_ACKNOWLEDGEMENT_CONSTANTS.PATH_NAME);
      })
      .catch(async (error) => {
        await showActionAlert('failed');
      });
  }

  // No local mapping: use API arrays directly in component props to match module pattern

  // Use quotations API data directly in options prop

  // Debug logs removed

  // Documents table rows populated from quotation-by-id
  const documentData: SupportingFile[] = documentRows;

  const handleDownload = async (row: SupportingFile): Promise<void> => {
    if (!row?.file_id) return;
    const response = await getfileURL(String(row.file_id));
    const assetUrl = response?.data?.[NUMBERMAP.ZERO]?.assetUrl;
    const fileName = `${row.file_name ?? 'document'}${row.extension ?? ''}`;
    handleFileDownloadByUrl(assetUrl, fileName);
  };

  const documentColumns: GridColDef[] = (DOCUMENT_COLUMNS as GridColDef[])
    .map((col: GridColDef) => {
      if (col.field === "actions") {
        return {
          ...col,
          renderCell: (params: GridRenderCellParams<SupportingFile>) => (
            <IconButton sx={downloadStyles.title} onClick={() => handleDownload(params.row)}>
              <DocumentDownload
                size={NUMBERMAP.TWENTYFOUR}
                color={theme.palette.primary.main}
              />
            </IconButton>
          ),
        } as GridColDef;
      }
      if (col.field === "file_status") {
        return {
          ...col,
          renderCell: (params: GridRenderCellParams<SupportingFile>) => {
            const statusValue = Number(params.row.status) === NUMBERMAP.ONE ? NUMBERMAP.ONE : NUMBERMAP.ZERO;
            return <StatusTypography value={statusValue} />;
          },
        } as GridColDef;
      }
      return col;
    });

  const buttonConfig = [{ action: BUTTON_LABEL.SAVE }, { action: BUTTON_LABEL.CANCEL }, { action: PERMISSION_ACTIONS.VIEW }];

  // minDate for Expected Date
  // Should not be earlier than Order Date or current date (whichever is later)
  const expectedDeliveryDateMinDate = useMemo(() => {
    const currentDate = dayjs();
    const orderDate = formData.order_date ? dayjs(formData.order_date) : null;

    if (orderDate) {
      // Return the later of order date or current date
      return orderDate.isAfter(currentDate) ? orderDate : currentDate;
    }
    // If no order date, use current date
    return currentDate;
  }, [formData.order_date]);

  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <Box>
          <Label title={`${isCreateMode ? 'Create' : 'Edit'} ${ORDER_ACKNOWLEDGEMENT_CONSTANTS.TITLE}`} />
        </Box>

        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.QUOTATION_NUMBER.LABEL}
                placeholder={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.QUOTATION_NUMBER.PLACEHOLDER}
                isDropdown
                value={formData.quotation_id?.toString() ?? ""}
                onChange={(value: string) => handleInputChange('quotation_id', value ? parseInt(value) : null)}
                options={quotationsData?.data ?? []}
                keyField={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.QUOTATION_NUMBER.keyField}
                valueField={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.QUOTATION_NUMBER.valueField}
                error={errors.quotation_id ?? ''}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formatDate(quotationDate, DATE_FORMATS.DD_MM_YYYY) ?? ''} label={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.QUOTATION_DATE.LABEL} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formData.customer_name} label={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.CUSTOMER_NAME.LABEL} />
            </Grid2>

            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.ORDER_APPROVAL_MODE.LABEL}
                placeholder={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.ORDER_APPROVAL_MODE.PLACEHOLDER}
                isDropdown
                value={formData.approval_mode_id?.toString() ?? ""}
                onChange={(value: string) => handleInputChange('approval_mode_id', value ? parseInt(value) : null)}
                options={orderApprovalModesData?.data ?? []}
                keyField={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.ORDER_APPROVAL_MODE.keyField}
                valueField={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.ORDER_APPROVAL_MODE.valueField}
                error={errors.approval_mode_id ?? ''}
              />
            </Grid2>

            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.ORDER_NUMBER.LABEL}
                placeholder={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.ORDER_NUMBER.PLACEHOLDER}
                value={formData.order_number}
                onChange={(value: string) => handleInputChange('order_number', value)}
                error={errors.order_number ?? ''}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>

            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.ORDER_DATE.LABEL}
                value={formData.order_date ? dayjs(formData.order_date) : null}
                onChange={(date) => handleDateChange('order_date', date)}
                error={errors.order_date ?? ''}
                minDate={quotationDate ? dayjs(quotationDate) : undefined}
                readOnly={true}
              />
            </Grid2>

            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.EXPECTED_DELIVERY_DATE.LABEL}
                value={formData.expected_delivery_date ? dayjs(formData.expected_delivery_date) : null}
                onChange={(date) => handleDateChange('expected_delivery_date', date)}
                error={errors.expected_delivery_date ?? ''}
                minDate={expectedDeliveryDateMinDate}
                readOnly={true}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.STATUS.LABEL}
                placeholder={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.STATUS.PLACEHOLDER}
                keyField={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.STATUS.keyField}
                valueField={ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.STATUS.valueField}
                isDropdown
                value={formData.status_id?.toString() ?? ""}
                onChange={(value: string) => handleInputChange('status_id', value ? Number(value) : null)}
                error={errors.status_id ?? ''}
                options={statusData?.data ?? []}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>
        </FormContent>
        <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Box>
              <Label title={UPLOADED_DOCUMENTS_LABEL} />
            </Box>
            <DataTable
              rows={documentData}
              columns={documentColumns}
              IdField="file_id"
            />
          </Grid2>
        </Grid2>
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            {/* File Upload Section */}
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                initialFiles={uploadedFiles as any}
                onFileEdit={handleFileEdit}
                onFileUpload={handleFileUpload}
                onSubmit={(data) => {
                  handleFileUploadSubmit(data)
                }}
                subHeader="Upload"
                hasEditable={!isCreateMode && !hasEditPermission}
              />
            </Grid2>

            {/* Comments History */}
            {!isCreateMode && (
              <Grid2 size={NUMBERMAP.TWELVE}>
                <CommentsHistory
                  comments={(orderAcknowledgementData?.meta_info?.task_info?.task_comments ?? []) as any}
                />
              </Grid2>
            )}
          </Grid2>

          <ButtonContainer>

            <SalesReviewerModalManager
              isLoading={false}
              permissions={orderAcknowledgementData?.meta_info?.action_control?.permissions ?? buttonConfig}
              taskInfo={orderAcknowledgementData?.meta_info?.task_info ?? { task_comments: [], reviewer_list: [], task_id: undefined }}
              menuId={orderAcknowledgementData?.meta_info?.action_control?.menuId}
              menuName={orderAcknowledgementData?.meta_info?.action_control?.formName}
              contextType={SALES_CONTEXT_TYPE.ORDER_ACKNOWLEDGEMENT}
              contextId={isCreateMode ? NUMBERMAP.ZERO : (formData.order_acknowledgement_id ?? NUMBERMAP.ZERO)}
              customHandlers={{
                handleCancel: handleCancel,
                handleSave: () => handleSave(),
                isDisabled: upsertMutation.isPending,
              }}
              onPermissionChange={setHasEditPermission}
              refetch={refetchOrderAcknowledgement}
              hideSaveButton={false}
            />

          </ButtonContainer>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default OrderAcknowledgement;
