"use client";
import React, { useState, useEffect } from "react";
import { Grid2, Box } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { InputField, DataTable, ButtonGroup, Label, ActionButton, showActionAlert } from "@/components/ui";
import GlobalLoader from "@/components/shared/LoadingSpinner";
import SamplePurchaseOrderModal from "@/components/modules/vendor-management/sample-orders/SamplePurchaseOrderModal";
import { GridColDef } from "@mui/x-data-grid";
import { NUMBERMAP, FINALFILEINITIALDATA } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { GRID_CONTAINER_STYLE, PART_DETAILS_ERROR_STYLE } from '@/styles/modules/vendor-management/sampleOrders';
import { ButtonContainer } from "@/styles/components/ui/button";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import DatePicker from "@/components/ui/data-picker/DataPicker";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { PartDetailsData, PartNumberData, RawPartDetail, DataGridParams, FileUploadData, FileManagerSubmitData, DocumentData } from "@/types/modules/vendor-management/sampleOrders";
import { FileDocument, FileData } from "@/types/components/ui/fileUploadV3";
import { usePartNumbers, usePostSampleOrder, useGetSampleOrder } from "@/hooks/modules/vendor-management/useSampleOrders";
import { useAllVendorTypes, useAllVendors } from '@/hooks/modules/vendor-management/useCommonDropdown'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import dayjs from "dayjs";
import { SUCCESS_ALERT, FAILED_ALERT, DELETE_ALERT, } from "@/constants/modules/dnd/formTeam";
import {
  DOCUMENTS_TO_CREATE, DOCUMENTS_TO_DELETE, CREATE_META_DATA, UPDATE_META_DATA, VALIDATION_MESSAGES, FORM_DATA_FIELDS,
  PART_DETAILS_FIELDS, PART_DETAILS_HEADERS, FORM_LABELS, FORM_PLACEHOLDERS, FORM_FIELD_NAMES, FORM_FIELD_KEYS,
  PAGE_TITLES, COMMON_STRINGS, ROUTES, STATUS_DROPDOWN_CONFIG,
} from "@/constants/modules/vendor-management/sampleOrders";
import { mergeFinalFileData, FinalFileData, formatDateForAPI, numberValidation, mapFileResponse, mapDocumentsByCategory, hasFileData } from '@/lib/utils/common';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'
import { prepareDraftDocumentsGeneric } from "@/lib/utils/modules/hr/draftDocumentsCommon";
/**
*Classification : Confidential
**/

const AddSamplePurchaseOrder: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const sampleOrderId = Array.isArray(params?.id) ? params.id[NUMBERMAP.ZERO] : params?.id;
  const isEditMode = sampleOrderId && sampleOrderId !== 'add' && sampleOrderId !== 'create';

  const [formData, setFormData] = useState({
    partCategory: "",
    partNumber: "",
    purchaseOrderDate: null as dayjs.Dayjs | null,
    purchaseOrderNumber: "",
    vendorName: "",
    status: null as number | null,
    documents: [] as (DocumentData | FileData)[]
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partDetailsData, setPartDetailsData] = useState<PartDetailsData[]>([]);
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const [fileManagerKey, setFileManagerKey] = useState(NUMBERMAP.ZERO);
  const [rawPartDetails, setRawPartDetails] = useState<RawPartDetail[]>([]);
  const [deletedPartIds, setDeletedPartIds] = useState<number[]>([]);
  const [selectedVendorTypeId, setSelectedVendorTypeId] = useState<number | null>(null)
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    partCategory: '',
    vendorName: '',
    purchaseOrderDate: '',
    purchaseOrderNumber: '',
    partDetails: '',
    fileUpload: '',
    status: ''
  });

  // Draft save configuration
  const { data: vendorTypes } = useAllVendorTypes()
  const { data: vendors } = useAllVendors(NUMBERMAP.ONE, selectedVendorTypeId ?? NUMBERMAP.ZERO)
  const { data: partNumbersData, refetch: refetchPartNumbers } = usePartNumbers();
  const { mutate: postSampleOrder, isPending: isSaving } = usePostSampleOrder();
  const { data: statusDropdownData } = useOrganizationStatus()

  // Fetch sample order data for edit mode
  const { data: sampleOrderData, isLoading: isLoadingSampleOrder, refetch: refetchSampleOrder } = useGetSampleOrder(
    isEditMode ? parseInt(sampleOrderId) : NUMBERMAP.ZERO
  );

  // Draft save hook
  const sampleOrderIdForDraft = isEditMode ? parseInt(sampleOrderId) : null
  const { draftSave, clearDraftSave, isFetchingDraft, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'sample_order',
    context_instance_id: sampleOrderIdForDraft,
    enableFetch: false
  })



  const loadDraftData = (data: any) => {
    const vendorTypeId = data.vendor_type_id ?? data.partCategory
    
    if (data?.documents) {
      data.documents = mapFileResponse(data.documents ?? []);
      data.draftDocuments = mapDocumentsByCategory(data?.draftDocuments ?? {});
    }
    if (data.draftDocuments) {
      setDraftDocuments(data.draftDocuments)
    }
    if (data?.draftDelete) {
      setDraftDelete(data?.draftDelete??[])
    }
    // Handle both 'status' and 'status_id' fields for backward compatibility
    const draftStatusValue = data.status;
    setFormData({
      ...data,
      purchaseOrderDate: data.purchaseOrderDate ? dayjs(data.purchaseOrderDate) : null,
      status: draftStatusValue !== null && draftStatusValue !== undefined ? Number(draftStatusValue) : null,
      documents: [...(data?.documents ?? []), ...(data?.draftDocuments?.documents ?? [])]
    })
    if (vendorTypeId) {
      setSelectedVendorTypeId(parseInt(vendorTypeId.toString()));
    }
    if (data.part_details?.length > NUMBERMAP.ZERO) {
      setPartDetailsData(data.part_details);
    } else {
      setRawPartDetails([]);
      setPartDetailsData([]);
    }
  }

  useEffect(() => {
    if (!isEditMode || !sampleOrderData?.data) return;

    const orderData = sampleOrderData?.data?.length > NUMBERMAP.ZERO ? sampleOrderData.data[NUMBERMAP.ZERO] : sampleOrderData.data;
    const vendorTypeId = orderData.vendor_type_id;

    // Only set form data if we haven't loaded it yet (check if formData is still in initial state)
    // This prevents overwriting data that was already loaded
    const shouldLoadData = !formData.purchaseOrderNumber ||
      formData.purchaseOrderNumber === "";

    if (!shouldLoadData) return;

    if (orderData?.type === 'draft') {
      loadDraftData(orderData)
    } else {
      // API returns 'status' field, but also check 'status_id' for backward compatibility
      const statusValue = orderData.status
      setFormData({
        partCategory: vendorTypeId?.toString() ?? "",
        partNumber: "",
        purchaseOrderDate: orderData.purchase_order_date ? dayjs(orderData.purchase_order_date) : null,
        purchaseOrderNumber: orderData.purchase_order_number ?? "",
        vendorName: orderData.vendor_id?.toString() ?? "",
        status: statusValue !== null && statusValue !== undefined ? Number(statusValue) : null,
        documents: orderData.documents ?? []
      });
      // Update selectedVendorTypeId to trigger vendor refetch
      if (vendorTypeId) {
        setSelectedVendorTypeId(parseInt(vendorTypeId.toString()));
      }
      setFileManagerKey(prev => prev + NUMBERMAP.ONE);

      if (orderData.part_details?.length > NUMBERMAP.ZERO) {
        setRawPartDetails(orderData.part_details);
      } else {
        setRawPartDetails([]);
        setPartDetailsData([]);
      }
    }

    setDeletedPartIds([]);
  }, [sampleOrderData]);
 
  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData])

  useEffect(() => {
    setFormData({
      partCategory: "",
      partNumber: "",
      purchaseOrderDate: null,
      purchaseOrderNumber: "",
      vendorName: "",
      status: null,
      documents: []
    })
    setPartDetailsData([])
    setFinalFileData(FINALFILEINITIALDATA)
    setDraftDocuments({})
    setDraftDelete([])
    if (!isEditMode) {
      fetchDraft()
    } else {
      refetchSampleOrder()
    }
  }, [sampleOrderId])

  // Helper function to check if part details can be processed
  const canProcessPartDetails = () => {
    return isEditMode && rawPartDetails.length > NUMBERMAP.ZERO && partNumbersData?.data;
  };

  // Helper function to find part number data
  const findPartNumberData = (partNumberId: number) => {
    return partNumbersData?.data?.find(
      (partData: PartNumberData) => partData.id === partNumberId
    );
  };

  // Helper function to create part detail object
  const createPartDetail = (part: RawPartDetail, index: number, partNumberData: PartNumberData) => {
    return {
      id: part.sample_order_part_mapper_id ? `existing_${part.sample_order_part_mapper_id}` : `temp_${index}`,
      partNumber: partNumberData.part_number,
      orderQuantity: part.order_quantity?.toString() ?? ""
    };
  };

  // Helper function to process a single part
  const processPart = (part: RawPartDetail, index: number, formattedPartDetails: PartDetailsData[]) => {
    if (part.status === NUMBERMAP.ONE) {
      const partNumberData = findPartNumberData(part.part_number_id);

      if (partNumberData) {
        const partDetail = createPartDetail(part, index, partNumberData);
        formattedPartDetails.push(partDetail);
      }
    }
  };

  // Effect to process part details when both raw part details and part numbers data are available
  useEffect(() => {
    if (!canProcessPartDetails()) {
      return;
    }

    const formattedPartDetails: PartDetailsData[] = [];

    for (let index = NUMBERMAP.ZERO; index < rawPartDetails.length; index++) {
      const part = rawPartDetails[index];
      processPart(part, index, formattedPartDetails);
    }

    setPartDetailsData(formattedPartDetails);
  }, [isEditMode, rawPartDetails, partNumbersData]);

  // Effect to trigger refetch if data is missing
  useEffect(() => {
    if (isEditMode && !isLoadingSampleOrder) {
      // If sample order data is not available, refetch it
      if (!sampleOrderData?.data) {
        refetchSampleOrder();
      }

      // If part numbers data is not available, refetch it
      if (!partNumbersData?.data) {
        refetchPartNumbers();
      }
    }
  }, [isEditMode, isLoadingSampleOrder, sampleOrderData?.data, partNumbersData?.data, refetchSampleOrder, refetchPartNumbers]);

  // Handle vendor selection
  type VendorChangeType = 'vendorId' | 'vendorTypeId';

  const sampleOrderhandleDraftSave = (formDataToSave: any, partDetailsToSave: PartDetailsData[], fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = !isEditMode ? draftData : sampleOrderData
    const sampleOrderDraftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }
    const sampleOrderDraftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      formDataToSave,
      { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      sampleOrderDraftConfig
    )

    if (sampleOrderDraftPreparation.draftDocuments) {
      setDraftDocuments(sampleOrderDraftPreparation.draftDocuments)
    }
    if (sampleOrderDraftPreparation?.draftDelete) {
      setDraftDelete(sampleOrderDraftPreparation?.draftDelete??[])
    }

    const fieldsToRemove = ['documents']
    const Obj = { ...formDataToSave }
    const cleaned = Object.fromEntries(
      Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key))
    )

    const payload = {
      id: sampleOrderIdForDraft ?? new Date().getTime(),
      ...cleaned,
      part_details: partDetailsToSave,
      draftDocuments: sampleOrderDraftPreparation.draftDocuments,
      draftDelete: sampleOrderDraftPreparation.draftDelete,
      type: 'draft',
    }

    draftSave({
      form_data: payload,
      upload_documents: {
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: sampleOrderDraftPreparation.createMetaData,
        update_meta_data: sampleOrderDraftPreparation.updateMetaData,
        documents_to_delete: [],
        documents_to_preserve: sampleOrderDraftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }

  const handleVendorChange = (vendorId: string, type: VendorChangeType) => {
    const id = Number(vendorId);
    if (type === 'vendorId') {
      setFormData(prev => {
        const newData = { ...prev, vendorName: vendorId };
        sampleOrderhandleDraftSave(newData, partDetailsData)
        return newData;
      });
      setValidationErrors(prev => ({ ...prev, vendorName: '' }));
    } else {
      setSelectedVendorTypeId(id);
      setFormData(prev => {
        const newData = { ...prev, partCategory: vendorId, vendorName: "" };
        sampleOrderhandleDraftSave(newData, partDetailsData)
        return newData;
      });
      setValidationErrors(prev => ({ ...prev, partCategory: '' }));
    }
  };

  const updatePartDetailsAndSaveDraft = (updater: (prev: PartDetailsData[]) => PartDetailsData[]) => {
    setPartDetailsData(prev => {
      const updatedParts = updater(prev);
      sampleOrderhandleDraftSave(formData, updatedParts)
      return updatedParts;
    });
  }

  const handleInputChange = (field: string, value: string | number) => {
    // Only allow numbers for Purchase Order Number field
    if (field === FORM_FIELD_KEYS.PURCHASE_ORDER_NUMBER) {
      // Use numberValidation.test like other pages
      if (!numberValidation.test(value as string) && value !== '') return;
    }

    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset vendor name when vendor type changes
      if (field === FORM_FIELD_KEYS.PART_CATEGORY) {
        newData.vendorName = "";
      }
      // Handle status conversion
      if (field === FORM_FIELD_KEYS.STATUS) {
        newData.status = value === '' ? null : Number(value);
      }
      sampleOrderhandleDraftSave(newData, partDetailsData)
      return newData;
    });

    // Clear validation error when user starts typing
    setValidationErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleDateChange = (value: dayjs.Dayjs | null) => {
    setFormData(prev => {
      const newData = { ...prev, purchaseOrderDate: value };
      sampleOrderhandleDraftSave(newData, partDetailsData)
      return newData;
    });

    // Clear validation error when user selects a date
    if (value) {
      setValidationErrors(prev => ({ ...prev, purchaseOrderDate: '' }));
    }
  };

  // Helper function to create file metadata
  const createFileMetadata = () => {
    if (!hasFileData(finalFileData) && (formData.documents.length == NUMBERMAP.ZERO)) return null
    
    return createFileMetadataUtil({
      isEditMode: !!isEditMode,
      draftData,
      existingData: sampleOrderData,
      finalFileData,
    })
  }

  // Validation functions
  const validateForm = () => {
    const errors = {
      partCategory: '',
      vendorName: '',
      purchaseOrderDate: '',
      purchaseOrderNumber: '',
      partDetails: '',
      fileUpload: '',
      status: ''
    };

    if (!formData.partCategory) {
      errors.partCategory = VALIDATION_MESSAGES.VENDOR_TYPE_REQUIRED;
    }
    if (!formData.vendorName) {
      errors.vendorName = VALIDATION_MESSAGES.VENDOR_NAME_REQUIRED;
    }
    if (!formData.purchaseOrderDate) {
      errors.purchaseOrderDate = VALIDATION_MESSAGES.PURCHASE_ORDER_DATE_REQUIRED;
    }
    if (!formData.purchaseOrderNumber.trim()) {
      errors.purchaseOrderNumber = VALIDATION_MESSAGES.PURCHASE_ORDER_NUMBER_REQUIRED;
    }
    if (!formData.status) {
      errors.status = VALIDATION_MESSAGES.STATUS_REQUIRED;
    }
    // Validate Part Details
    if (partDetailsData.filter(part => part?.status !== NUMBERMAP.ZERO).length === NUMBERMAP.ZERO) {
      errors.partDetails = VALIDATION_MESSAGES.PART_DETAILS_REQUIRED;
    }
    // Validate File Upload
    if (formData.documents.length === NUMBERMAP.ZERO) {
      errors.fileUpload = VALIDATION_MESSAGES.FILE_UPLOAD_REQUIRED;
    }

    setValidationErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSave = () => {
    // Final save - validate form fields
    if (!validateForm()) {
      return;
    }
    clearDraftSave()
    // Prepare part_details array - include both active and deleted parts
    const activePartDetails = partDetailsData.map((part, index) => {
      // Find the part number ID from the part number string
      const partNumberId = partNumbersData?.data?.find(
        (partData: PartNumberData) => partData.part_number === part.partNumber
      )?.id;

      // Validate that part number ID exists
      if (!partNumberId) {
        showActionAlert(FAILED_ALERT);
        return null;
      }

      const partDetail = {
        sample_order_part_mapper_id: part.id.startsWith('existing_') ? parseInt(part.id.replace('existing_', '')) : null, // Extract real ID from existing parts as number, null for new parts
        part_number_id: parseInt(partNumberId.toString()),
        order_quantity: parseInt(part.orderQuantity),
        status: part.status?? NUMBERMAP.ONE
      };

      return partDetail;
    }).filter(part => part !== null); // Remove any null entries

    // Add deleted parts with status = 0
    const deletedPartDetails = deletedPartIds.map(partMapperId => ({
      sample_order_part_mapper_id: partMapperId,
      part_number_id: null, // We don't need this for deleted parts
      order_quantity: null, // We don't need this for deleted parts
      status: NUMBERMAP.ZERO // Status = 0 for deleted parts
    }));

    // Combine active and deleted parts
    const partDetails = [...activePartDetails, ...deletedPartDetails];

    // Create FormData for the API
    const formDataPayload = new FormData();
    const formattedDate = formatDateForAPI(formData.purchaseOrderDate) ?? '';

    // Only append sample_order_id for edit mode
    if (isEditMode && sampleOrderId) {
      formDataPayload.append(FORM_DATA_FIELDS.SAMPLE_ORDER_ID, sampleOrderId);
    }

    formDataPayload.append(FORM_DATA_FIELDS.VENDOR_ID, formData.vendorName);
    formDataPayload.append(FORM_DATA_FIELDS.PURCHASE_ORDER_DATE, formattedDate);
    formDataPayload.append(FORM_DATA_FIELDS.PURCHASE_ORDER_NUMBER, formData.purchaseOrderNumber);

    const statusToSend = formData.status === NUMBERMAP.ONE ? NUMBERMAP.ONE : NUMBERMAP.TWO;
    formDataPayload.append(FORM_DATA_FIELDS.STATUS, statusToSend.toString());
    formDataPayload.append(FORM_DATA_FIELDS.PART_DETAILS, JSON.stringify(partDetails));

    // Prepare file metadata using createFileMetadata function
    const fileMetadata = createFileMetadata()
    if (fileMetadata) {
      formDataPayload.append(CREATE_META_DATA, JSON.stringify(fileMetadata.create_meta_data));
      formDataPayload.append(UPDATE_META_DATA, JSON.stringify(fileMetadata.update_meta_data));
      formDataPayload.append(DOCUMENTS_TO_DELETE, JSON.stringify(fileMetadata.documents_to_delete));
    }

    // Add files to create
    finalFileData.documents_to_create.forEach((file) => {
      formDataPayload.append(DOCUMENTS_TO_CREATE, file, file.name);
    });

    postSampleOrder(formDataPayload, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT);
        // For both create and edit modes, redirect to sample orders list
        router.push(ROUTES.SAMPLE_ORDERS_LIST);
      },
      onError: () => {
        showActionAlert(FAILED_ALERT);
      },
    });
  };

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    // Redirect to sample orders list page
    router.push(ROUTES.SAMPLE_ORDERS_LIST);
  };

  const partDetailsColumns: GridColDef[] = [
    { field: PART_DETAILS_FIELDS.SNO, headerName: PART_DETAILS_HEADERS.SNO, flex: NUMBERMAP.HALF },
    { field: PART_DETAILS_FIELDS.PART_NUMBER, headerName: PART_DETAILS_HEADERS.PART_NUMBER, flex: NUMBERMAP.TWO },
    { field: PART_DETAILS_FIELDS.ORDER_QUANTITY, headerName: PART_DETAILS_HEADERS.ORDER_QUANTITY, flex: NUMBERMAP.TWO },
    {
      field: PART_DETAILS_FIELDS.ACTION,
      headerName: PART_DETAILS_HEADERS.ACTION,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: DataGridParams) => (
        <ActionButton
          onDelete={() => handleDelete(params.row.id)}
          onEdit={() => handleEdit(params.row.id)}
        />
      ),
    },
  ];

  const handleEdit = (id: string) => {
    const partToEdit = partDetailsData.find(part => part.id === id);
    if (partToEdit) {
      setEditingPartId(id);
      setIsModalOpen(true);
    }
  };

  // Helper function to handle existing part deletion
  const handleExistingPartDeletion = (id: string) => {
    if (id.startsWith('existing_')) {
      const partMapperId = parseInt(id.replace('existing_', ''));
      setDeletedPartIds(prev => [...prev, partMapperId]);
    }
  };

  // Helper function to process deletion confirmation
  const processDeletion = (id: string) => {
    handleExistingPartDeletion(id);
    updatePartDetailsAndSaveDraft(prev => {
      if (id.startsWith('existing_')) {
        // Remove the part from the array if it starts with 'existing_'
        return prev.map(part => (
          part.id === id ? {
            ...part,
            status: NUMBERMAP.ZERO
          } : part
        ));
      } else {
        // Set status to NUMBERMAP.ZERO if it doesn't start with 'existing_'
        return prev.filter(part => part.id !== id);

      }
    });
    showActionAlert(SUCCESS_ALERT);
  };

  const handleDelete = (id: string) => {
    showActionAlert(DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        processDeletion(id);
      }
    });
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
    setEditingPartId(null);
  };

  // File upload handlers based on DND concept page reference
  const handleFileUpload = (newFile: FileData) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        documents: [...(prev.documents ?? []), newFile] as FileData[] | DocumentData[],
      };
      return updatedData;
    });
    // Clear file upload validation error when file is uploaded
    setValidationErrors(prev => ({ ...prev, fileUpload: '' }));
  };

  const handleFileEdit = (updatedFile: FileUploadData) => {
    setFormData((prev) => {
      const updatedFiles = prev.documents.map((file: any) => {
        const currentId = typeof file === COMMON_STRINGS.OBJECT && COMMON_STRINGS.ID in file
          ? (file as Record<string, unknown>)[COMMON_STRINGS.ID]
          : undefined;
        const updatedId = updatedFile.document_id ?? updatedFile.id;
        return currentId === updatedId ? { ...file, ...updatedFile } : file;
      });
      const updatedData = {
        ...prev,
        documents: updatedFiles,
      };
      return updatedData;
    });
  }

  // --- File remove logic copied from partCategory page
  const handleFileRemove = (data: any) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = prev.documents.filter((file) => {
          const fileName = file?.file?.name?.split('.')[NUMBERMAP.ZERO];
          return !data.local_files_to_delete.includes(fileName);
        });
        return {
          ...prev,
          documents: updatedDocs,
        };
      });
    }

    if (data?.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = prev.documents.filter((file) => {
          const fileId = (file as FileDocument)?.file_id ?? (file as FileDocument)?.id;
          return !data.documents_to_delete.includes(fileId);
        });
        return {
          ...prev,
          documents: updatedDocs,
        };
      });
    }
  }


  const handleModalSave = (modalData: { partNumber: string; orderQuantity: string }) => {
    // Find the selected part number details
    const selectedPart = partNumbersData?.data?.find(
      (part: PartNumberData) => part.id.toString() === modalData.partNumber
    );

    if (!selectedPart) {
      showActionAlert(FAILED_ALERT);
      return;
    }

    // Check for duplicate part number
    const isDuplicate = partDetailsData.some(part =>
      part.partNumber === selectedPart.part_number && part.id !== editingPartId
    );

    if (isDuplicate) {
      showActionAlert("customAlert",{'text':"This part number already exists. Please provide a different part number.",title:'Duplicate Part Number',icon:"error",cancelButton:false,confirmButton:false});
      return;
    }

    if (editingPartId) {
      // Edit existing part
      updatePartDetailsAndSaveDraft(prev =>
        prev.map(part =>
          part.id === editingPartId
            ? {
              ...part,
              partNumber: selectedPart.part_number,
              orderQuantity: modalData.orderQuantity
            }
            : part
        )
      );
      showActionAlert(SUCCESS_ALERT);
    } else {
      // Add new part
      const newPart: PartDetailsData = {
        id: Date.now().toString(),
        partNumber: selectedPart.part_number,
        orderQuantity: modalData.orderQuantity
      };
      updatePartDetailsAndSaveDraft(prev => [...prev, newPart]);
      showActionAlert(SUCCESS_ALERT);
    }
    // Clear part details validation error when part is added
    setValidationErrors(prev => ({ ...prev, partDetails: '' }));
    // Close modal and reset form
    setIsModalOpen(false);
    setEditingPartId(null);
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingPartId(null);
  };
  const buttonConfig = [
    { label: COMMON_STRINGS.CANCEL, onClick: handleCancel },
    { label: COMMON_STRINGS.SAVE, onClick: handleSave, loading: isSaving }
  ];
  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isSaving ?? isLoadingSampleOrder ?? isFetchingDraft} />
      <FormWrapper>
        <Box >
          <Label title={isEditMode ? PAGE_TITLES.EDIT_SAMPLE_PURCHASE_ORDER : PAGE_TITLES.ADD_SAMPLE_PURCHASE_ORDER} />
        </Box>
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.VENDOR_TYPE}
                placeholder={FORM_PLACEHOLDERS.SELECT_VENDOR_TYPE}
                isDropdown
                options={vendorTypes?.data ?? []}
                valueField={FORM_FIELD_NAMES.VENDOR_TYPE_NAME}
                keyField={FORM_FIELD_NAMES.ID}
                value={formData.partCategory}
                onChange={(value: string) => handleVendorChange(value, 'vendorTypeId')}
                error={validationErrors.partCategory}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.VENDOR_NAME}
                placeholder={formData.partCategory ? FORM_PLACEHOLDERS.SELECT_VENDOR_NAME : FORM_PLACEHOLDERS.SELECT_VENDOR_NAME_DISABLED}
                isDropdown
                valueField={FORM_FIELD_NAMES.VENDOR_NAME}
                keyField={FORM_FIELD_NAMES.ID}
                options={vendors?.data ?? []}
                value={formData.vendorName}
                onChange={(value: string) => handleVendorChange(value, 'vendorId')}
                disabled={!formData.partCategory}
                error={validationErrors.vendorName}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={GRID_CONTAINER_STYLE}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} >
              <DatePicker
                label={FORM_LABELS.PURCHASE_ORDER_DATE}
                value={formData.purchaseOrderDate ?? null}
                onChange={handleDateChange}
                error={validationErrors.purchaseOrderDate}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.PURCHASE_ORDER_NUMBER}
                placeholder={FORM_PLACEHOLDERS.ENTER_PURCHASE_ORDER_NUMBER}
                value={formData.purchaseOrderNumber}
                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.PURCHASE_ORDER_NUMBER, value)}
                error={validationErrors.purchaseOrderNumber}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={GRID_CONTAINER_STYLE}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                isDropdown
                value={formData.status ? String(formData.status) : ''}
                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.STATUS, value)}
                error={validationErrors.status}
                options={statusDropdownData?.data ?? []}
                keyField={STATUS_DROPDOWN_CONFIG.KEY_FIELD}
                valueField={STATUS_DROPDOWN_CONFIG.VALUE_FIELD}
              />
            </Grid2>
          </Grid2>
        </FormContent>

        <Grid2 container sx={GRID_CONTAINER_STYLE}>
          <Grid2 size={NUMBERMAP.TWELVE} >
            <CommonSharedTale
              title={PAGE_TITLES.PART_DETAILS}
              pathName="#"
              hanldeClick={handleAddNew}
              Table={
                <DataTable
                  rows={partDetailsData.filter(part => part?.partNumber?.trim() && (part?.status??NUMBERMAP.ONE))}
                  columns={partDetailsColumns}
                  IdField={COMMON_STRINGS.ID}
                />
              }
            />
          </Grid2>
        </Grid2>

        {/* Part Details Validation Error */}
        {validationErrors.partDetails && (
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Box sx={PART_DETAILS_ERROR_STYLE}>
              {validationErrors.partDetails}
            </Box>
          </Grid2>
        )}

        <FormContent>
          <Grid2 container sx={GRID_CONTAINER_STYLE}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                key={`file-manager-${fileManagerKey}`}
                uploadMandError={validationErrors.fileUpload}
                initialFiles={formData.documents as unknown as FileDocument[]}
                onFileUpload={handleFileUpload}
                onFileEdit={handleFileEdit}
                onSubmit={(data: FileManagerSubmitData) => {
                  setFinalFileData((prev) => {
                    const mergedData = mergeFinalFileData(prev, data);
                    sampleOrderhandleDraftSave(formData, partDetailsData, mergeFinalFileData(prev, data))
                    handleFileRemove(data);
                    return mergedData;
                  });
                  // Clear file upload validation error when files are submitted
                  setValidationErrors(prev => ({ ...prev, fileUpload: '' }));
                }}
                subHeader={PAGE_TITLES.FILE_UPLOAD}
              />
            </Grid2>
          </Grid2>


          <ButtonContainer>
            <ButtonGroup buttons={buttonConfig} />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>
      <SamplePurchaseOrderModal
        open={isModalOpen}
        onClose={handleModalCancel}
        onSave={handleModalSave}
        initialData={editingPartId ? (() => {
          const partToEdit = partDetailsData.find(part => part.id === editingPartId);
          if (partToEdit) {
            const partNumberId = partNumbersData?.data?.find(
              (part: PartNumberData) => part.part_number === partToEdit.partNumber
            )?.id?.toString() ?? "";
            return {
              partNumber: partNumberId,
              orderQuantity: partToEdit.orderQuantity
            };
          }
          return { partNumber: "", orderQuantity: "" };
        })() : undefined}
        partNumbersData={partNumbersData}
        editingPartId={editingPartId}
      />
    </FormContainer>
  );
};

export default AddSamplePurchaseOrder