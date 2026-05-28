"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Grid2 } from "@mui/material";
import { InputField, Label, RadioButtonGroup, Description, RichTextEditor, showActionAlert } from "@/components/ui";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import { NUMBERMAP } from "@/constants/common";
import CommentsHistory from "@/components/ui/comments-history/Comments";
import { CommentsHistoryContainer } from "@/styles/modules/dnd/dir";
import VendorReviewerModalManager from "@/components/modules/vendor-management/reviewer-modal/VendorReviewerModalManager";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import { useSampleOrderParts, useSampleInspection, usePostSampleInspection } from "@/hooks/modules/vendor-management/useSampleInspection";
import { useGetSampleOrder } from "@/hooks/modules/vendor-management/useSampleOrders";
import { VendorSelectionTable } from "@/components/shared";
import { getSampleStatus, type Sample } from "@/components/shared/VendorSelectionTable";
import { mergeFinalFileData, numberValidation } from "@/lib/utils/common";
import { POPUP_STYLE } from "@/styles/modules/dnd/designReviewReport";
import {
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  ERROR_MESSAGES,
  ALERT_MESSAGES,
  QC_RESULT_OPTIONS,
  TABLE_COLUMNS,
  FIELD_LABELS,
  DEFAULT_VALUES,
  BUTTONSTYLE,
  FORM_FIELD_NAMES
} from "@/constants/modules/vendor-management/sampleInspection";
import { StatusChip } from "@/styles/components/shared/vendorSelectionTable";
import { InputLabel } from "@/styles/components/ui/input";
import { ErrorText } from "@/styles/common";
import UploadedFilesList from "@/components/ui/file-upload-section/UploadedFilesList";
import { FAILED_ALERT } from "@/constants/modules/dnd/formTeam";
import { InitialFormData } from "@/lib/modules/auth/passwordPinValidation";

/**
    Classification : Confidential
**/


interface FormErrors {
  partNumber?: string;
  supplyReferenceNumber?: string;
  supplyReceived?: string;
  quantityReceived?: string;
  inspectionQuantity?: string;
  inspectionProcedure?: string;
  qcResult?: number | null;
  remarks?: string;
}


interface FormState {
  partNumber: string;
  partType: string;
  partCategorySubType: string;
  partSubClass: string;
  partCategory: string;
  orderQuantity: number | null;
  poReferenceNumber: string;
  safetyCritical: string;
  aql: string;
  supplyReferenceNumber: string;
  supplyReceived: string;
  quantityReceived: number | null;
  inspectionQuantity: number | null;
  inspectionProcedure: string;
}

const PerformInspectionForm: React.FC = () => {

  const [hasEditPermission, setHasEditPermission] = useState(true);
  const paramsslug = useParams();
  const params =  paramsslug?.slug?.[NUMBERMAP.ZERO] ?? null
  const partId = paramsslug?.slug?.[NUMBERMAP.ONE] ?? null
  const sampleOrderId = params ? Number(params) : null;
  const router = useRouter()

  // Fetch sample order details
  const { data: sampleOrderData } = useGetSampleOrder(
    sampleOrderId ?? null
  );

  // Fetch sample order parts for dropdown
  const { data: sampleOrderPartsResponse, isLoading: isPartsLoading } = useSampleOrderParts(
    sampleOrderId
  );

  // Fetch inspection data when part number is selected
  const [selectedPartNumber, setSelectedPartNumber] = useState<number | null>(null);
  const { data: inspectionResponse, refetch } = useSampleInspection(
    sampleOrderId,
    selectedPartNumber
  );

  const [formData, setFormData] = useState<FormState>({
    partNumber: "",
    partType: "",
    partCategorySubType: "",
    partSubClass: "",
    partCategory: "",
    orderQuantity: '',
    poReferenceNumber: "",
    safetyCritical: "",
    aql: "",
    supplyReferenceNumber: "",
    supplyReceived: "",
    quantityReceived: '',
    inspectionQuantity: '',
    inspectionProcedure: "",
    drawingNumber: "",
    qcResult: '',
    remarks: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileUploadError, setFileUploadError] = useState<string>('');

  // Modal state for Add Specification
  const [specificationModal, setSpecificationModal] = useState(false);
  // Sample modal state
  const [sampleModalData, setSampleModalData] = useState<{
    specificationId: number;
    columnKey: string;
    sample: Sample | null;
    sampleIndex: number;
  } | null>(null);

  // Sample data state - stores all sample data for API submission
  const [samplesData, setSamplesData] = useState<any[]>([]);

  // Modal form state
  const [modalFormData, setModalFormData] = useState({
    batchSerialNo: "",
    testObservation: "",
    testResult: "",
  });

  const [modalErrors, setModalErrors] = useState({
    batchSerialNo: "",
    testObservation: "",
    testResult: "",
  });

  useEffect(()=>{
    if(Number(partId)){
        setSelectedPartNumber(partId)
        setFormData({...InitialFormData,partNumber:partId})
    }
  },[partId])
  // Initial files from API response for FileUploadManager
  const [initialFiles, setInitialFiles] = useState<any[]>([]);

  // Drawing numbers from API response
  const [drawingNumbers, setDrawingNumbers] = useState<{ label: string; fileUrl: string }[]>([]);
  // File upload manager data
  const [fileUploadData, setFileUploadData] = useState<{
    documents_to_create: File[];
    create_meta_data: Record<string, any>;
    update_meta_data: Record<string, any>;
    documents_to_delete: string[];
    local_files_to_delete: string[];
  }>({
    documents_to_create: [],
    create_meta_data: {},
    update_meta_data: {},
    documents_to_delete: [],
    local_files_to_delete: [],
  });

  // Track inspection ID for update
  const [inspectionId, setInspectionId] = useState<number | null>(null);

  // Mutation hook
  const postSampleInspectionMutation = usePostSampleInspection();


  // Column configuration for VendorSelectionTable
  const tableColumns = useMemo(() => {
    return [
      { field: "sno", headerName: TABLE_COLUMNS.SNO, flex: NUMBERMAP.ONE },
      { field: "title", headerName: TABLE_COLUMNS.SPECIFICATION, flex: NUMBERMAP.ONE },
      {
        field: "samples",
        headerName: "Samples",
        flex: NUMBERMAP.ONE,
        child: true,
        keyField: "samples",
        childColumns: {
          field: "sample_number",
          keyField: "samples"
        }
      }
    ];
  }, []);

  // Transform inspection data for VendorSelectionTable
  const tableData = useMemo(() => {
    // If we have updated samplesData, use that; otherwise use API response
    if (samplesData.length > NUMBERMAP.ZERO) {
      return samplesData.map((spec: any, index: number) => ({
        sno: index + NUMBERMAP.ONE,
        description: spec.description ?? "",
        title: spec.title ?? spec.description ?? `${DEFAULT_VALUES.SPECIFICATION_PREFIX} ${index + NUMBERMAP.ONE}`,
        specification_id: spec.specification_id,
        samples: Array.isArray(spec.samples) ? spec.samples : []
      }));
    }

    if (!inspectionResponse?.data || !Array.isArray(inspectionResponse.data) || inspectionResponse.data.length === NUMBERMAP.ZERO) {
      return [];
    }

    const firstItem = inspectionResponse.data[NUMBERMAP.ZERO];
    if (!firstItem.specification_details || !Array.isArray(firstItem.specification_details)) {
      return [];
    }

    // Transform API response to table format
    return firstItem.specification_details.map((spec: any, index: number) => ({
      sno: index + NUMBERMAP.ONE,
      description: spec.description ?? "",
      title: spec.title ?? spec.description ?? `Specification ${index + 1}`,
      specification_id: spec.specification_id,
      samples: Array.isArray(spec.samples) ? spec.samples : []
    }));
  }, [inspectionResponse, samplesData]);


  // Combine inspection procedure files from API and create_meta_data for dropdown
  const inspectionProcedureOptions = useMemo(() => {
    const options: Array<{ inspection_procedure_id: string; file_name: string }> = [];

    // documents_to_delete contains file_ids of saved files that are deleted
    const deletedFileIds = fileUploadData.documents_to_delete?.map((id) => String(id)) ?? [];
    // local_files_to_delete contains cryptoIds of newly uploaded files that are deleted locally
    const deletedLocalFileIds = fileUploadData.local_files_to_delete ?? [];

    // Track file IDs to avoid duplicates (by ID, not just name)
    const existingFileIds = new Set<string>();
    const existingCryptoIds = new Set<string>();

    // Add files from API response (initialFiles - saved files), excluding deleted ones
    initialFiles.forEach((file) => {
      const fileId = file.file_id ? String(file.file_id) : null;

      // Skip if this saved file's ID is in the deleted files list
      if (fileId !== null && deletedFileIds.includes(fileId)) {
        return;
      }

      // Use file_id as the procedure ID (this is the UUID that should match in payload)
      const procedureId = file.file_id?.toString() ?? '';
      const fileName = file.file_name ?? file.name ?? DEFAULT_VALUES.UNKNOWN_FILE_NAME;

      if (procedureId && !existingFileIds.has(procedureId)) {
        options.push({
          inspection_procedure_id: procedureId,
          file_name: fileName,
        });
        existingFileIds.add(procedureId);
      }
    });

    // Add files from create_meta_data (newly uploaded files), excluding deleted ones and duplicates
    if (fileUploadData.create_meta_data) {
      Object.entries(fileUploadData.create_meta_data).forEach(([cryptoId, metadata]: [string, any]) => {
        // Skip if this newly uploaded file's cryptoId is in the deleted local files list
        if (deletedLocalFileIds.includes(cryptoId)) {
          return;
        }

        // Skip if already added (avoid duplicates)
        if (existingCryptoIds.has(cryptoId)) {
          return;
        }

        const fileName = metadata?.fileName ?? cryptoId;
        // Check if a file with the same name already exists in initialFiles (not deleted)
        // This prevents duplicates after save when the file appears in both places
        const fileExistsInInitial = initialFiles.some((file) => {
          const fileId = file.file_id ? String(file.file_id) : null;
          // Only consider it a duplicate if the file exists and is NOT deleted
          return fileId !== null && !deletedFileIds.includes(fileId);
        });

        if (!fileExistsInInitial) {
          options.push({
            inspection_procedure_id: cryptoId, // Pass the crypto ID to API
            file_name: fileName, // Show the fileName in dropdown
          });
          existingCryptoIds.add(cryptoId);
        }
      });
    }

    return options;
  }, [initialFiles, fileUploadData.create_meta_data, fileUploadData.documents_to_delete, fileUploadData.local_files_to_delete]);

  const RESULT_LABELS = {
    [NUMBERMAP.ONE]: "pass",
    [NUMBERMAP.TWO]: "fail",
  };
  const getTestResult = (result: number) => {
    return RESULT_LABELS[result] ?? ""
  }
  // Handle cell click - receives row data from VendorSelectionTable
  const handleCellClick = (
    row: any,
    columnKey: string,
    sample: Sample | null,
    sampleIndex: number
  ) => {
    const specificationId = row?.specification_id ?? NUMBERMAP.ZERO;
    // Set modal data and open modal
    setSampleModalData({
      specificationId,
      columnKey,
      sample: sample,
      sampleIndex,
    });
    // Prefill modal form data if sample exists
    if (sample) {
      setModalFormData({
        batchSerialNo: sample.sample_number?.toString() ?? "",
        testObservation: sample.test_observation ?? "",
        testResult: getTestResult(sample.sample_result),
      });
    } else {
      // Reset form for new sample
      setModalFormData({
        batchSerialNo: "",
        testObservation: "",
        testResult: "",
      });
    }

    setModalErrors({
      batchSerialNo: "",
      testObservation: "",
      testResult: "",
    });

    setSpecificationModal(true);
  };

  // Initialize samplesData from inspection response (for tracking user edits)
  useEffect(() => {
    if (inspectionResponse?.data && Array.isArray(inspectionResponse.data) && inspectionResponse.data.length > NUMBERMAP.ZERO) {
      const firstItem = inspectionResponse.data[NUMBERMAP.ZERO];
      if (firstItem.specification_details && Array.isArray(firstItem.specification_details)) {
        // Store the original data structure for tracking edits
        // Transform to match our structure with samples as array
        const transformedData = firstItem.specification_details.map((spec: any) => ({
          specification_id: spec.specification_id,
          title: spec.title ?? spec.description,
          description: spec.description,
          samples: Array.isArray(spec.samples) ? spec.samples : []
        }));
        setSamplesData(transformedData);
      }
    } else {
      // Clear samplesData if no inspection response
      setSamplesData([]);
    }
  }, [inspectionResponse]);

  // Update inspection ID and prefill form data when inspection response is loaded
  useEffect(() => {
    if (inspectionResponse?.data && Array.isArray(inspectionResponse.data) && inspectionResponse.data.length > 0) {
      const firstItem = inspectionResponse.data[NUMBERMAP.ZERO];

      // Set inspection ID
      if (firstItem.sample_order_inspection_id) {
        setInspectionId(Number(firstItem.sample_order_inspection_id));
      }

      // Prefill all form fields from API response
      setFormData((prev) => ({
        ...prev,
        partNumber: firstItem.part_number_id?.toString() ?? prev.partNumber,
        partType: firstItem.part_type ?? prev.partType,
        partCategorySubType: firstItem.part_category_sub_type ?? prev.partCategorySubType,
        partSubClass: firstItem.part_sub_class ?? prev.partSubClass,
        partCategory: firstItem.part_category ?? prev.partCategory,
        orderQuantity: firstItem.order_quantity?.toString() ?? prev.orderQuantity,
        poReferenceNumber: firstItem.po_reference_number ?? prev.poReferenceNumber,
        safetyCritical: firstItem.safety_critical ?? prev.safetyCritical,
        aql: firstItem.aql ?? prev.aql,
        supplyReferenceNumber: firstItem.supply_reference_number ?? prev.supplyReferenceNumber,
        supplyReceived: firstItem.supply_received?.toString() ?? prev.supplyReceived,
        quantityReceived: firstItem.quality_received?.toString() ?? prev.quantityReceived,
        inspectionQuantity: firstItem.inspection_quantity?.toString() ?? prev.inspectionQuantity,
        remarks: firstItem.remarks ?? prev.remarks,
        qcResult: firstItem.qc_result,
        // Handle drawing_numbers array - join if multiple
        drawingNumber: Array.isArray(firstItem.drawing_numbers) && firstItem.drawing_numbers.length > NUMBERMAP.ZERO
          ? firstItem.drawing_numbers.join(", ")
          : prev.drawingNumber,
        inspectionProcedure: firstItem.inspection_procedure ?? null
      }));

      // Clear validation errors when data is loaded from API
      setErrors({});
      // Also clear file upload error when data is loaded (files will be populated from API)
      setFileUploadError('');

      // Set selected part number to trigger any dependent logic
      if (firstItem.part_number_id) {
        setSelectedPartNumber(Number(firstItem.part_number_id));
      }

      // Handle documents for file upload
      if (Array.isArray(firstItem.documents) && firstItem.documents.length > NUMBERMAP.ZERO) {

        setInitialFiles(firstItem.documents);
      }

      // Handle inspection procedure files - store for dropdown option


      setDrawingNumbers(firstItem.drawing_number_documents ?? []);

    } else {
      // Clear form data and files when no inspection data is available
      setInitialFiles([]);
      setDrawingNumbers([]);
    }
  }, [inspectionResponse]);

  // Update form data when sample order data is loaded
  useEffect(() => {
    if (sampleOrderData?.data) {
      const order = sampleOrderData.data;
      setFormData((prev) => ({
        ...prev,
        poReferenceNumber: order.purchase_order_number ?? "",
      }));
    }
  }, [sampleOrderData]);

  // Update form data when part is selected
  useEffect(() => {
    if (selectedPartNumber && sampleOrderPartsResponse?.data) {
      const selectedPart = sampleOrderPartsResponse.data?.find(
        (part) => part.part_number_id === selectedPartNumber
      );
      if (selectedPart) {
        setFormData((prev) => ({
          ...prev,
          orderQuantity: selectedPart.order_quantity?.toString() ?? "",
        }));
      }
    }
  }, [selectedPartNumber, sampleOrderPartsResponse]);

  // Auto-update QC Result based on sample results
  useEffect(() => {
    if (!samplesData || samplesData.length === NUMBERMAP.ZERO) {
      return;
    }

    // Collect all samples from all specifications
    const allSamples: Sample[] = [];
    samplesData.forEach((spec) => {
      if (spec.samples && Array.isArray(spec.samples)) {
        allSamples.push(...spec.samples);
      }
    });

    // Filter samples that have a result (not null/undefined)
    const samplesWithResults = allSamples.filter(
      (sample) => sample.sample_result !== null && sample.sample_result !== undefined
    );

    // Only auto-update if there are samples with results
    if (samplesWithResults.length > 0) {
      const hasFailed = samplesWithResults.some((sample) => 
        sample.sample_result === NUMBERMAP.TWO
      );

      // Check if all samples passed (sample_result === 1)
      const allPassed = samplesWithResults.every((sample) => sample.sample_result === NUMBERMAP.ONE);

      if (hasFailed) {
        // If any sample failed, set QC Result to "fail" (2)
        setFormData((prev) => ({
          ...prev,
          qcResult: NUMBERMAP.TWO,
        }));
      } else if (allPassed) {
        // If all samples passed, set QC Result to "pass"
        setFormData((prev) => ({
          ...prev,
          qcResult: NUMBERMAP.ONE,
        }));
      }
    }
  }, [samplesData]);

  // Helper function to validate quantity fields
  const validateQuantityFields = (field: string, value: string) => {
    if (field !== 'inspectionQuantity' && field !== 'quantityReceived') {
      return;
    }

    const inspectionQty = field === 'inspectionQuantity' ? Number(value) : Number(formData.inspectionQuantity);
    const qtyReceived = field === 'quantityReceived' ? Number(value) : Number(formData.quantityReceived);

    if (inspectionQty && qtyReceived && inspectionQty > qtyReceived) {
      setErrors(prev => ({
        ...prev,
        inspectionQuantity: ERROR_MESSAGES.INSPECTION_QUANTITY_GREATER_THAN_RECEIVED
      }));
    } else if (field === 'inspectionQuantity' && inspectionQty && qtyReceived && inspectionQty <= qtyReceived) {
      setErrors(prev => ({ ...prev, inspectionQuantity: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Handle part number removal - clear all associated data
    if (field === 'partNumber' && (!value || value.trim() === '')) {
      setFormData(prev => ({
        ...prev,
        partNumber: "",
        partType: "",
        partCategorySubType: "",
        partSubClass: "",
        partCategory: "",
        orderQuantity: "",
        supplyReferenceNumber: "",
        supplyReceived: "",
        quantityReceived: "",
        inspectionQuantity: "",
        inspectionProcedure: "",
        drawingNumber: "",
        uploadedFiles: [],
        aql: "",
        safetyCritical: "",
        poReferenceNumber: "",
        qcResult: "",
        remarks: "",
      }));
      setSelectedPartNumber(null);
      setInitialFiles([]);
      setFileUploadData({
        documents_to_create: [],
        create_meta_data: {},
        update_meta_data: {},
        documents_to_delete: [],
        local_files_to_delete: [],
      });
      setSamplesData([]);
      setInspectionId(null);
      return;
    }
    if(!hasEditPermission && field !== 'partNumber') return
    setFormData(prev => ({ ...prev, [field]: value }));

    // Handle part number selection
    if (field === 'partNumber') {
      const partId = Number(value);
      setSelectedPartNumber(partId ?? null);
      // Clear all errors when part number is selected (data will be filled)
      if (partId) {
        setErrors({});
        // Also clear file upload error when part number is selected (same as other fields)
        setFileUploadError('');
      }
    }

    // Validate Inspection Quantity <= Quantity Received
    validateQuantityFields(field, value);

    // Clear error for the field if it has a value
    if (value && value.trim() !== '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Helper function to validate file upload
  const validateFileUpload = (): boolean => {
    const hasExistingFiles = initialFiles && initialFiles.length > NUMBERMAP.ZERO;
    const hasNewFiles = fileUploadData.documents_to_create && fileUploadData.documents_to_create.length > NUMBERMAP.ZERO;
    const filesToDelete = fileUploadData.documents_to_delete?.length ?? NUMBERMAP.ZERO;
    const localFilesToDelete = fileUploadData.local_files_to_delete?.length ?? NUMBERMAP.ZERO;
    const totalExistingFiles = initialFiles?.length ?? NUMBERMAP.ZERO;

    const remainingFiles = totalExistingFiles - filesToDelete - localFilesToDelete;

    const hasNoFiles = !hasNewFiles && (remainingFiles <= NUMBERMAP.ZERO || !hasExistingFiles);

    if (hasNoFiles) {
      setFileUploadError(ERROR_MESSAGES.FILE_UPLOAD_REQUIRED);
      return true;
    }

    setFileUploadError('');
    return false;
  };

  function noNullsInSpecifickey(data) {
    return !data.some(item =>
      item.samples?.some(inner => inner.sample_result === null)
    );
  }

  // Helper function to validate QC Result
  const validateQcResult = (value: any): string => {
    if (value === null || value === undefined || value === '' || (typeof value === 'number' && (value !== NUMBERMAP.ONE && value !== NUMBERMAP.TWO))) {
      return ERROR_MESSAGES.QC_RESULT_REQUIRED;
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const requiredFields = [
      'partNumber',
      'supplyReceived',
      'quantityReceived',
      'inspectionQuantity',
      'inspectionProcedure',
      'qcResult',
    ];

    // Check each required field
    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      // Special handling for qcResult - it can be a number (1 or 2) or null/undefined/empty
      if (field === FORM_FIELD_NAMES.QC_RESULT) {
        const error = validateQcResult(value);
        if (error) {
          newErrors.qcResult = error;
        }
      } else if (!value || (typeof value === 'string' && value?.trim() === '')) {
        const fieldLabels: { [key: string]: string } = {
          partNumber: FIELD_LABELS.PART_NUMBER,
          supplyReceived: FIELD_LABELS.SUPPLY_RECEIVED,
          quantityReceived: FIELD_LABELS.QUANTITY_RECEIVED,
          inspectionQuantity: FIELD_LABELS.INSPECTION_QUANTITY,
          qcResult: FIELD_LABELS.QC_RESULT,
          inspectionProcedure: FIELD_LABELS.INSPECTION_PROCEDURE
        };
        const fieldLabel = fieldLabels[field] || field;
        (newErrors as any)[field] = `${fieldLabel} is required`;
      }
    });

    // Validate Inspection Quantity <= Quantity Received
    const inspectionQty = Number(formData.inspectionQuantity);
    const qtyReceived = Number(formData.quantityReceived);
    if (inspectionQty && qtyReceived && inspectionQty > qtyReceived) {
      newErrors.inspectionQuantity = ERROR_MESSAGES.INSPECTION_QUANTITY_GREATER_THAN_RECEIVED;
    }

    setErrors(newErrors);
    const hasFileUploadError = validateFileUpload();

    // Check if there are any non-empty error messages
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (!noNullsInSpecifickey(samplesData)) {
      showActionAlert('customAlert', {
        title: ALERT_MESSAGES.ERROR_TITLE,
        text: 'Please fill all the specification samples',
        icon: "error",
        cancelButton: false,
        confirmButton: false,
      });
    }
    return !hasErrors && !hasFileUploadError && noNullsInSpecifickey(samplesData);
  };

  const validateModalForm = (): boolean => {
    const newErrors = {
      batchSerialNo: "",
      testObservation: "",
      testResult: "",
    };

    if (!modalFormData.batchSerialNo || modalFormData.batchSerialNo?.trim() === '') {
      newErrors.batchSerialNo = ERROR_MESSAGES.BATCH_SERIAL_NO_REQUIRED;
    }

    if (!modalFormData.testObservation || modalFormData.testObservation?.trim() === '') {
      newErrors.testObservation = ERROR_MESSAGES.TEST_OBSERVATION_REQUIRED;
    }

    if (!modalFormData.testResult || modalFormData.testResult?.trim() === '') {
      newErrors.testResult = ERROR_MESSAGES.TEST_RESULT_REQUIRED;
    }

    setModalErrors(newErrors);
    return !newErrors.batchSerialNo && !newErrors.testObservation && !newErrors.testResult;
  };

  const handleFileUpload = (file: any) => {
    // FileUploadManager passes a single FileData object
    if (file?.file) {
      setUploadedFiles(prev => [...prev, ...(Array.isArray(file.file) ? file.file : [file.file])]);
    }
  };

  // Handle file upload manager submit
  const handleFileUploadSubmit = (data: any) => {
    setFileUploadData((prev) => {
      const merged = mergeFinalFileData(prev, data);

      // Check if files exist (same logic as validateFileUpload, but to clear error)
      const hasExistingFiles = initialFiles && initialFiles.length > NUMBERMAP.ZERO;
      const hasNewFiles = merged.documents_to_create && merged.documents_to_create.length > NUMBERMAP.ZERO;
      const filesToDelete = merged.documents_to_delete?.length ?? NUMBERMAP.ZERO;
      const localFilesToDelete = merged.local_files_to_delete?.length ?? NUMBERMAP.ZERO;
      const totalExistingFiles = initialFiles?.length ?? NUMBERMAP.ZERO;
      const remainingFiles = totalExistingFiles - filesToDelete - localFilesToDelete;
      const hasFiles = hasNewFiles || (hasExistingFiles && remainingFiles > NUMBERMAP.ZERO);

      // Clear file upload error when files are present (same pattern as handleInputChange clears errors for other fields)
      if (hasFiles) {
        setFileUploadError('');
      }

      return merged;
    });
  };

  // Clear inspectionProcedure if it matches a deleted file or is not in available options
  useEffect(() => {
    if (!formData.inspectionProcedure) {
      return;
    }

    const deletedFileIds = fileUploadData.documents_to_delete?.map((id) => String(id)) ?? [];
    const deletedLocalFileIds = fileUploadData.local_files_to_delete ?? [];
    const currentProcedureId = String(formData.inspectionProcedure);

    // Clear if current inspection procedure matches any deleted file ID
    if (deletedFileIds.includes(currentProcedureId) || deletedLocalFileIds.includes(currentProcedureId)) {
      setFormData((prev) => ({
        ...prev,
        inspectionProcedure: "",
      }));
      return;
    }

    // Also clear if the selected procedure ID is not in the available options
    const availableProcedureIds = inspectionProcedureOptions.map(opt => opt.inspection_procedure_id);
    if (!availableProcedureIds.includes(currentProcedureId)) {
      setFormData((prev) => ({
        ...prev,
        inspectionProcedure: "",
      }));
    }
  }, [fileUploadData.documents_to_delete, fileUploadData.local_files_to_delete, inspectionProcedureOptions]);

  const handleCancel = () => {
    setFormData({
      partNumber: "",
      partType: "",
      partCategorySubType: "",
      partSubClass: "",
      partCategory: "",
      orderQuantity: null,
      poReferenceNumber: "",
      safetyCritical: "",
      aql: "",
      supplyReferenceNumber: "",
      supplyReceived: "",
      quantityReceived: null,
      inspectionQuantity: null,
      inspectionProcedure: "",
      drawingNumber: "",
      qcResult: null,
      remarks: "",
      uploadedFiles: uploadedFiles,
    });
    setUploadedFiles([]);
    setInitialFiles([]);
    setDrawingNumbers([]);
    setSelectedPartNumber(null);
    setInspectionId(null);
    router.push("/vendor-management/sample-inspection")
  };

  const getSpecificationData = () => {
    if (samplesData && Array.isArray(samplesData) && samplesData.length > NUMBERMAP.ZERO) {
      const specificationsPayload = samplesData.map((spec) => {
        // Transform samples to API format
        const samples = (spec.samples ?? []).map((sample: Sample) => {
          // For new samples (sample_id is 0 or doesn't exist), set to null
          // For existing samples, include the sample_id
          const sampleId = sample.sample_id && sample.sample_id !== NUMBERMAP.ZERO ? sample.sample_id : null;

          return {
            sample_id: sampleId,
            serial_number: sample.sample_number ?? null,
            sample_result: sample.sample_result ?? null,
            test_observation: sample.test_observation ?? "",
          };
        });

        return {
          specification_id: spec.specification_id,
          samples: samples,
        };
      });
      return specificationsPayload
    } else {
      return []
    }
  }

  // Helper function to validate and append inspection procedure
  const appendInspectionProcedureIfValid = (formDataToSend: FormData) => {
    const deletedFileIds = fileUploadData.documents_to_delete?.map((id) => String(id)) ?? [];
    const deletedLocalFileIds = fileUploadData.local_files_to_delete ?? [];
    const isDeletedFile =
      (formData?.inspectionProcedure && deletedFileIds.includes(String(formData.inspectionProcedure))) ||
      (formData?.inspectionProcedure && deletedLocalFileIds.includes(formData.inspectionProcedure));

    const availableProcedureIds = inspectionProcedureOptions.map(opt => opt.inspection_procedure_id);
    const isValidProcedure = formData?.inspectionProcedure &&
      availableProcedureIds.includes(formData.inspectionProcedure) &&
      !isDeletedFile;

    if (isValidProcedure) {
      formDataToSend.append("inspection_procedure", formData.inspectionProcedure);
    }
  };

  // Helper function to append file upload data to FormData
  const appendFileUploadData = (formDataToSend: FormData) => {
    if (fileUploadData?.documents_to_create && fileUploadData.documents_to_create.length > 0) {
      fileUploadData.documents_to_create.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("documents_to_create", file, file.name);
        }
      });
    }
    if (fileUploadData.create_meta_data && Object.keys(fileUploadData.create_meta_data).length > 0) {
      formDataToSend.append("create_meta_data", JSON.stringify(fileUploadData.create_meta_data));
    }
    if (fileUploadData.update_meta_data && Object.keys(fileUploadData.update_meta_data).length > 0) {
      formDataToSend.append("update_meta_data", JSON.stringify(fileUploadData.update_meta_data));
    }
    if (fileUploadData.documents_to_delete && fileUploadData.documents_to_delete.length > 0) {
      formDataToSend.append("documents_to_delete", JSON.stringify(fileUploadData.documents_to_delete));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!sampleOrderId || !formData.partNumber) {
      showActionAlert('customAlert', {
        title: ALERT_MESSAGES.ERROR_TITLE,
        text: ERROR_MESSAGES.SAMPLE_ORDER_ID_AND_PART_NUMBER_REQUIRED,
        icon: "error",
        cancelButton: false,
        confirmButton: false,
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      // Mandatory fields
      formDataToSend.append("sample_order_id", sampleOrderId?.toString());
      if (inspectionId) {
        formDataToSend.append("sample_order_inspection_id", inspectionId?.toString())
      }

      formDataToSend.append("part_number_id", formData.partNumber);
      formDataToSend.append("supply_reference_number", formData.supplyReferenceNumber);
      formDataToSend.append("supply_received", formData.supplyReceived);
      formDataToSend.append("quantity_received", formData?.quantityReceived);
      formDataToSend.append("inspection_quantity", formData?.inspectionQuantity);

      // Use helper function to append inspection procedure
      appendInspectionProcedureIfValid(formDataToSend);

      // Specifications - transform from samplesData to required API format
      formDataToSend.append("specifications", JSON.stringify(getSpecificationData()));
      // QC Result and status
      if (formData.qcResult) {
        formDataToSend.append("qc_result", formData.qcResult);
      }
      formDataToSend.append("remarks", formData?.remarks);
      formDataToSend.append("status", DEFAULT_VALUES.STATUS); // Default status

      // Use helper function to append file upload data
      appendFileUploadData(formDataToSend);

      // Submit the form
      postSampleInspectionMutation.mutate(formDataToSend, {
        onSuccess: () => {
          showActionAlert('customAlert', {
            title: ALERT_MESSAGES.SUCCESS_TITLE,
            text: ALERT_MESSAGES.SAMPLE_INSPECTION_SAVED_SUCCESS,
            icon: "success",
            cancelButton: false,
            confirmButton: false,
          });
          router.push("/vendor-management/sample-inspection")

        },
        onError: () => {
          showActionAlert(FAILED_ALERT);
        }
      });


    } catch (error: any) {
      showActionAlert('customAlert', {
        title: ALERT_MESSAGES.ERROR_TITLE,
        text: error?.response?.data?.message ?? ALERT_MESSAGES.FAILED_TO_SAVE_SAMPLE_INSPECTION,
        icon: "error",
        cancelButton: false,
        confirmButton: false,
      });
    }
  };

  // Handle closing specification modal
  const handleCloseSpecificationModal = () => {
    setSpecificationModal(false);
    setSampleModalData(null);
    setModalFormData({
      batchSerialNo: "",
      testObservation: "",
      testResult: "",
    });
    setModalErrors({
      batchSerialNo: "",
      testObservation: "",
      testResult: "",
    });
  };

  const TEST_RESULT_MAP = {
    pass: NUMBERMAP.ONE,
    fail: NUMBERMAP.TWO,
  };

  const setTestResult = (modalFormData) => {
    return TEST_RESULT_MAP[modalFormData.testResult] ?? null;
  };
  // Handle modal form save
  const handleModalSave = () => {
    if (!validateModalForm() || !sampleModalData) {
      return;
    }
    if(errors.qcResult){
      const resultError = { ...errors };
      const { qcResult, ...remaining } = resultError;
      setErrors(remaining)
    }
    const { specificationId, sample, sampleIndex } = sampleModalData;
    // Generate unique sample_number if not provided
    const sampleNumber = modalFormData.batchSerialNo ?? null;
    // Create/update sample data
    // Note: sample_id can be null for new samples, but Sample interface requires number
    // We'll use 0 as placeholder and handle null in API payload
    const updatedSample: Sample = {
      sample_id: sample?.sample_id ?? NUMBERMAP.ZERO, // Will be set to null in API payload if 0
      sample_number: sampleNumber ?? undefined,
      sample_result: setTestResult(modalFormData),
      test_observation: modalFormData.testObservation,
    };

    // Update samplesData state (array structure)
    setSamplesData((prev) => {
      const newData = [...prev];

      // Find the specification in the array
      const specIndex = newData.findIndex(item => item.specification_id === specificationId);

      if (specIndex !== -1) {
        // Specification exists, update it
        const spec = { ...newData[specIndex] };

        // Ensure samples is an array
        if (!spec.samples || !Array.isArray(spec.samples)) {
          spec.samples = [];
        }

        // Update or add sample at the correct index
        const samples = [...spec.samples];

        // If sample exists at this index, update it; otherwise add/insert at index
        if (sampleIndex < samples.length && samples[sampleIndex]) {
          // Update existing sample
          samples[sampleIndex] = updatedSample;
        } else {
          // Ensure array is large enough, fill with null if needed
          while (samples.length < sampleIndex) {
            samples.push(null as any);
          }
          // Add or replace at index
          samples[sampleIndex] = updatedSample;
        }

        spec.samples = samples.filter(s => s !== null);
        newData[specIndex] = spec;
      } else {
        // Specification doesn't exist, create new one
        newData.push({
          specification_id: specificationId,
          samples: [updatedSample]
        });
      }

      return newData;
    });

    // Close modal
    handleCloseSpecificationModal();
  };
  return (
    <FormContainer>
      <FormWrapper>
        <Label title={FORM_LABELS.PERFORM_INSPECTION} />
        <FormContent>
          {/* Part Information */}
          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                isCompleted
                label={FORM_LABELS.PART_NUMBER}
                placeholder={FORM_PLACEHOLDERS.SELECT_PART_NUMBER}
                value={formData.partNumber}
                onChange={(value: string) => handleInputChange('partNumber', value)}
                isDropdown={true}
                keyField="id"
                valueField="part_number"
                options={sampleOrderPartsResponse?.data}
                error={errors.partNumber}
                disabled={isPartsLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formData.partType} label={FORM_LABELS.PART_TYPE} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formData.partCategorySubType} label={FORM_LABELS.PART_CATEGORY_SUB_TYPE} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formData.partSubClass} label={FORM_LABELS.PART_SUB_CLASS} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formData.partCategory} label={FORM_LABELS.PART_CATEGORY} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formData.orderQuantity} label={FORM_LABELS.ORDER_QUANTITY} />
            </Grid2>
            {/* Order and Supply Information */}
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formData.poReferenceNumber} label={FORM_LABELS.PO_REFERENCE_NUMBER} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formData.safetyCritical} label={FORM_LABELS.SAFETY_CRITICAL} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={formData.aql} label={FORM_LABELS.AQL} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.SUPPLY_REFERENCE_NUMBER}
                placeholder={FORM_PLACEHOLDERS.ENTER_SUPPLY_REFERENCE_NUMBER}
                value={formData.supplyReferenceNumber}
                onChange={(value: string) => handleInputChange('supplyReferenceNumber', value)}
                error={errors.supplyReferenceNumber}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.SUPPLY_RECEIVED}
                placeholder={FORM_PLACEHOLDERS.ENTER_SUPPLY_RECEIVED}
                value={formData.supplyReceived}
                onChange={(value: string) => {
                  if (numberValidation.test(value) || value == '') {
                    handleInputChange('supplyReceived', value);
                  }
                }}
                error={errors.supplyReceived}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.QUANTITY_RECEIVED}
                placeholder={FORM_PLACEHOLDERS.ENTER_QUANTITY_RECEIVED}
                value={formData.quantityReceived}
                onChange={(value: string) => {
                  if (numberValidation.test(value) || value == '') {
                    handleInputChange('quantityReceived', value);
                  }
                }}
                error={errors.quantityReceived}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INSPECTION_QUANTITY}
                placeholder={FORM_PLACEHOLDERS.ENTER_INSPECTION_QUANTITY}
                value={formData.inspectionQuantity}
                onChange={(value: string) => {
                  if (numberValidation.test(value) || value == '') {
                    handleInputChange('inspectionQuantity', value);
                  }
                }
                }
                error={errors.inspectionQuantity}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX} >
              <UploadedFilesList
                label={FORM_LABELS.DRAWING_NUMBER}
                files={drawingNumbers}
                onDelete={() => { }}
              />
            </Grid2>
          </Grid2>
          {/* Specifications Table */}
          <Grid2 size={NUMBERMAP.TWELVE} sx={STYLE5}>
            <VendorSelectionTable
              data={tableData}
              columns={tableColumns}
              sampleCount={Number(formData.inspectionQuantity) || NUMBERMAP.ZERO}
              onCellClick={handleCellClick}
            />

          </Grid2>

          {/* Results and Remarks */}
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputLabel>{FORM_LABELS.SAMPLE_ORDER_QC_RESULT}</InputLabel>
              <StatusChip label={getSampleStatus(formData.qcResult)} status={getSampleStatus(formData.qcResult)} size="small" />
              <ErrorText>{errors?.qcResult ?? ''}</ErrorText>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Description
                label={FORM_LABELS.REMARKS}
                value={formData.remarks}
                onChange={(value: string) => handleInputChange('remarks', value)}
                placeholder={FORM_PLACEHOLDERS.ENTER_REMARKS}
                error={errors.remarks}
              />
            </Grid2>
          </Grid2>

          {/* File Upload Section */}
          <Grid2 size={NUMBERMAP.TWELVE} sx={STYLE5}>
            <FileUploadManager
              initialFiles={initialFiles}
              uploadMandError={fileUploadError}
              onFileEdit={() => { }}
              hasEditable={!hasEditPermission}
              onFileUpload={handleFileUpload}
              onSubmit={handleFileUploadSubmit}
              subHeader={FORM_LABELS.FILE_UPLOAD}
            />
          </Grid2>
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
            <InputField
              label={FORM_LABELS.INSPECTION_PROCEDURE}
              placeholder={FORM_PLACEHOLDERS.SELECT_INSPECTION_PROCEDURE}
              value={formData.inspectionProcedure}
              onChange={(value: string) => handleInputChange('inspectionProcedure', value)}
              error={errors.inspectionProcedure}
              isDropdown={true}
              keyField="inspection_procedure_id"
              valueField="file_name"
              options={inspectionProcedureOptions}
              hasEditable={!hasEditPermission}
            />
          </Grid2>
        </FormContent>
          <CommentsHistoryContainer>
            <CommentsHistory comments={inspectionResponse?.meta_info?.task_info?.task_comments} />
          </CommentsHistoryContainer>
          <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
            <VendorReviewerModalManager
              isLoading={true}
              permissions={inspectionResponse?.meta_info?.action_control?.permissions ?? []}
              taskInfo={{
                task_comments: inspectionResponse?.meta_info?.task_info?.task_comments ?? [],
                reviewer_list: inspectionResponse?.meta_info?.task_info?.reviewer_list ?? [],
              }}
              refetch={refetch}
              taskId={inspectionResponse?.meta_info?.task_info?.task_id}
              menuId={inspectionResponse?.meta_info?.action_control?.menuId}
              menuName={inspectionResponse?.meta_info?.action_control?.formName}
              contextType="sample_inspection"
              contextId={sampleOrderId}
              onPermissionChange={setHasEditPermission}
              customHandlers={{
                handleCancel,
                handleSave,
              }}
            /> 
          </Grid2>
      </FormWrapper>

      {/* Sample Details Modal */}
      <CommonModal
        open={specificationModal}
        onClose={handleCloseSpecificationModal}
        title={FORM_LABELS.SAMPLE_DETAILS}
        buttonRequired={true}
        modalMaxWidth="800px"
        onSave={handleModalSave}
      >
        <Grid2 spacing={NUMBERMAP.TWO} container sx={POPUP_STYLE}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={FORM_LABELS.BATCH_SERIAL_NO}
              placeholder={FORM_PLACEHOLDERS.ENTER_BATCH_SERIAL_NO}
              value={modalFormData.batchSerialNo}
              onChange={(value: string) => {
                if(!hasEditPermission) return
                setModalFormData(prev => ({ ...prev, batchSerialNo: value }));
                // Clear error when data is entered (same pattern as main form)
                if (value && value.trim() !== '') {
                  setModalErrors(prev => ({ ...prev, batchSerialNo: '' }));
                }
                
              }}
              error={modalErrors.batchSerialNo}
              hasEditable={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              disabled={!hasEditPermission}
              label={FORM_LABELS.TEST_OBSERVATION}
              value={modalFormData.testObservation}
              onChange={(value: string) => {
                if(!hasEditPermission) return
                setModalFormData(prev => ({ ...prev, testObservation: value }));
                // Clear error when data is entered (same pattern as main form)
                if (value && value.trim() !== '') {
                  setModalErrors(prev => ({ ...prev, testObservation: '' }));
                }
              }}
              error={modalErrors.testObservation}
              placeholder={FORM_PLACEHOLDERS.ENTER_TEST_OBSERVATION}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RadioButtonGroup
              label={FORM_LABELS.TEST_RESULT}
              name="testResult"
              options={QC_RESULT_OPTIONS}
              value={modalFormData.testResult}
              onChange={(value: string | number) => {
                if(!hasEditPermission) return
                setModalFormData(prev => ({ ...prev, testResult: String(value) }));
                // Clear error when data is entered (same pattern as main form)
                if (value) {
                  setModalErrors(prev => ({ ...prev, testResult: '' }));
                }
              }}
              error={modalErrors.testResult}
            />
          </Grid2>
        </Grid2>
      </CommonModal>
    </FormContainer>
  );
};

export default PerformInspectionForm;

