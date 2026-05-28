"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Grid2, Box, IconButton, Checkbox, FormControlLabel, InputBase, Typography, Link } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { InputField, Label, RadioButtonGroup, Description, RichTextEditor, showActionAlert, DataGridTable } from "@/components/ui";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import { FINALFILEINITIALDATA, NUMBERMAP, STATUS } from "@/constants/common";
import CommentsHistory from "@/components/ui/comments-history/Comments";
import { CommentsHistoryContainer } from "@/styles/modules/dnd/dir";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import DatePicker from "@/components/ui/data-picker/DataPicker";
import { useInitiateInspectionSave, useInitiateInspectionViewWithSlug } from '@/hooks/modules/quality-control-management/useIncomingInspection';
import { mergeFinalFileData, numberValidation, FinalFileData, INITIALFILE, stripHtml } from "@/lib/utils/common";
import type { FileData } from "@/types/components/ui/fileUploadV3";
import { useDraftSave } from '@/hooks/common/useDraftSave';
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon';
import {
  processDraftPreparation,
  removeFieldsFromFormData,
  appendFileMetadataToFormData,
  createFileMetadataGenerator
} from '@/lib/utils/modules/sales/draftSaveCommon';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import {
  HeaderSection,
  HeaderTitle,
  CostLabelContainer,
  CostItemContainer,
  CostLabel,
  CostItemsWrapper,
  CostInputContainer,
  InputContainer,
  grid2Container,
} from '@/styles/modules/dnd/feasibilityStudy';
import {
  getDeviationNoteValueBoxStyles,
  getBatchHeaderEditContainerSx,
  getBatchHeaderViewContainerSx,
  getBatchHeaderInputSx,
  getBatchHeaderTextSx,
  getBatchHeaderEditIconSx,
  getFullWidthBoxSx,
} from '@/styles/modules/quality-control-management/incomingInspection';
import {
  INCOMING_INSPECTION_COPY,
  INCOMING_INSPECTION_UI,
  INCOMING_INSPECTION_BATCH_HEADER,
} from '@/constants/modules/quality-control-management/incomingInspection';
import type {
  InspectionSpecificationDetail,
  InitiateInspectionRecord,
  SpecificationObservation,
  IncomingInspectionInitiateFormErrors as FormErrors,
  IncomingInspectionInitiateFormState as FormState,
} from '@/types/modules/quality-control-management/incomingInspection';
import { VendorSelectionTable } from "@/components/shared";
import { type Sample } from "@/components/shared/VendorSelectionTable";
import { STATUS_LABELS } from "@/constants/components/shared/vendorSelectionTable";
import { Download } from "@mui/icons-material";
import { Edit } from "iconsax-react";
import { InputLabel } from "@/styles/components/ui/input";
import { StatusChip, EditIconButton } from "@/styles/components/shared/vendorSelectionTable";
import { ErrorText } from "@/styles/common";
import dayjs, { Dayjs } from 'dayjs';
import UploadedFilesList from "@/components/ui/file-upload-section/UploadedFilesList";
import { LabelValue } from '@/styles/components/modules/prototypeForm';
import { FAILED_ALERT } from "@/constants/modules/dnd/formTeam";
import ObservationDetailsModal from "@/components/modules/quality-control-management/incoming-inspection/ObservationDetailsModal";
import { useGetEquipmentItems } from "@/hooks/modules/infrastructure-management/useMaintenanceReport";
import { useAllEmployees } from "@/hooks/modules/hr/useEmployeeList";
import QCReviewerModalManager from "../reviewer-modal/QCReviewerModalManager";

const DISPLAY_PLACEHOLDER = INCOMING_INSPECTION_UI.PLACEHOLDERS.DEFAULT_VALUE;
const PASS_VALUE = NUMBERMAP.ONE;
const FAIL_VALUE = NUMBERMAP.TWO;
const FORM_TEXT = INCOMING_INSPECTION_UI.FORM_TEXT;

type Props = {
  goodsInwardDetailId?: number;
  slug?: 'unit' | 'batch';
  onDone: () => void;
  onSaved?: () => void;
};

const IncomingInspectionForm: React.FC<Props> = ({ goodsInwardDetailId, slug = 'unit', onDone, onSaved }) => {
  const [hasEditPermission, setHasEditPermission] = useState(true);
  const initialDraftLoading = useRef(true);
  const isUnitQuantityType = slug === 'unit';

  const { data: initiateResponse, refetch } =
    useInitiateInspectionViewWithSlug(goodsInwardDetailId, slug);
  const saveInspectionMutation = useInitiateInspectionSave();
  const { data: employeeResponse, refetch: refetchEmployees } = useAllEmployees(NUMBERMAP.ONE, 'Approved');

  const [formData, setFormData] = useState<FormState>({
    numberOfBatches: '',
    unitsPerBatch: '',
    unitsToTest: '',
    inspectionQuantity: '',
    rejectionsPerBatch: '',
    confirmAQL: false,
    equipmentUsed: '',
    inspectedBy: '',
    inspectionDate: null,
    inspectionResult: PASS_VALUE,
    remarks: '',
    deviationApproval: NUMBERMAP.ONE,
    reasonForDecision: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [viewRecord, setViewRecord] = useState<InitiateInspectionRecord | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [drawingNumbers, setDrawingNumbers] = useState<{ label: string; fileUrl: string }[]>([]);
  const [inspectionProcedures, setInspectionProcedures] = useState<{ label: string; fileUrl: string }[]>([]);
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(INITIALFILE);
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({});
  const [draftDelete, setDraftDelete] = useState<string[]>([]);

  const [specificationModal, setSpecificationModal] = useState(false);
  const [observationModalData, setObservationModalData] = useState<{
    specificationId: number;
    columnKey: string;
    observation: Sample | null;
    observationIndex: number;
  } | null>(null);

  const [observationsData, setObservationsData] = useState<any[]>([]);
  const [batchHeaderValues, setBatchHeaderValues] = useState<string[]>([]);
  const [editingBatchIndex, setEditingBatchIndex] = useState<number | null>(null);
  const [showLocationDetailsTable, setShowLocationDetailsTable] = useState(false);

  useEffect(() => {
    refetchEmployees();
  }, [refetchEmployees]);

  const { draftSave, clearDraftSave, isDraftSaving, draftData, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'initiate_inspection',
    context_instance_id: goodsInwardDetailId ?? null,
    enableFetch: false,
  });

  const [modalFormData, setModalFormData] = useState({
    unitNumber: "",
    serialNumber: "",
    testObservation: "",
    testResult: "",
  });

  const [modalErrors, setModalErrors] = useState({
    unitNumber: "",
    serialNumber: "",
    testObservation: "",
    testResult: "",
  });

  const tableColumns = useMemo(() => {
    return [
      {
        field: FORM_TEXT.SPEC_TABLE.FIELDS.SNO,
        headerName: FORM_TEXT.SPEC_TABLE.HEADERS.SNO,
        flex: NUMBERMAP.ONE
      },
      {
        field: FORM_TEXT.SPEC_TABLE.FIELDS.DESCRIPTION,
        headerName: FORM_TEXT.SPEC_TABLE.HEADERS.DESCRIPTION,
        flex: NUMBERMAP.TWO
      },
      {
        field: FORM_TEXT.SPEC_TABLE.FIELDS.OBSERVATIONS,
        headerName: FORM_TEXT.SPEC_TABLE.HEADERS.OBSERVATIONS,
        flex: NUMBERMAP.FIVE,
        child: true,
        keyField: FORM_TEXT.SPEC_TABLE.FIELDS.CHILD_KEY,
        childColumns: {
          field: FORM_TEXT.SPEC_TABLE.FIELDS.CHILD_SAMPLE_NUMBER,
          keyField: FORM_TEXT.SPEC_TABLE.FIELDS.CHILD_KEY
        }
      }
    ];
  }, []);

  const tableData = useMemo(() => {
    if (observationsData.length > NUMBERMAP.ZERO) {
      return observationsData.map((spec: any, index: number) => ({
        sno: index + NUMBERMAP.ONE,
        description: `Criteria ${spec.specification_criteria_id}`,
        title: `Criteria ${spec.specification_criteria_id}`,
        specification_criteria_id: spec.specification_criteria_id,
        samples: Array.isArray(spec.samples) ? spec.samples : []
      }));
    }

    if (!initiateResponse?.data || !Array.isArray(initiateResponse?.data) || initiateResponse?.data?.length === NUMBERMAP.ZERO) {
      return [];
    }

    const record = initiateResponse?.data[NUMBERMAP.ZERO];
    if (!record.inspection_specification_details || !Array.isArray(record.inspection_specification_details)) {
      return [];
    }

    return record.inspection_specification_details.map((spec: InspectionSpecificationDetail, index: number) => ({
      sno: index + NUMBERMAP.ONE,
      description: `Criteria ${spec.specification_criteria_id}`,
      title: `Criteria ${spec.specification_criteria_id}`,
      specification_criteria_id: spec.specification_criteria_id,
        samples: (spec.observation ?? []).map((obs: SpecificationObservation) => ({
        sample_id: obs.specification_result_id,
        sample_number: obs.unit_number,
        sample_result: (obs.test_result === NUMBERMAP.ONE ? NUMBERMAP.ONE : NUMBERMAP.ZERO),
        test_observation: obs.test_observation,
        serial_number: obs.serial_number,
        batch_number: obs.batch_number ?? '',
      }))
    }));
  }, [initiateResponse, observationsData]);

  useEffect(() => {
    setTimeout(() => {
      initialDraftLoading.current = false;
    }, NUMBERMAP.THREETHOUSANDFIVEHUNDRED);
  }, [goodsInwardDetailId]);

  const loadDraftData = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      inspectionQuantity: data?.inspectionQuantity ?? prev.inspectionQuantity,
      inspectionDate: typeof data?.inspectionDate === 'string'
        ? dayjs(data.inspectionDate)
        : (data?.inspectionDate ?? prev.inspectionDate),
    }));

    if (Array.isArray(data?.observationsData)) {
      setObservationsData(data.observationsData);
    }
    if (Array.isArray(data?.batchHeaderValues)) {
      setBatchHeaderValues(data.batchHeaderValues);
    }

    setUploadedFiles([...(data?.draftDocuments?.documents ?? []), ...(data?.documents ?? [])]);
    setDraftDocuments(data?.draftDocuments ?? {});
    setDraftDelete(Array.isArray(data?.draftDelete) ? data.draftDelete : []);

    if (data?.locationDetails && typeof data.locationDetails === 'object') {
      const loc = data.locationDetails as Record<string, unknown>;
      setViewRecord((prev) => (prev ? ({ ...prev, ...loc } as InitiateInspectionRecord) : prev));
    }
  }

  useEffect(() => {
    const responseData = initiateResponse?.data;
    if (!responseData) return;

    if (Array.isArray(responseData) && responseData.length > NUMBERMAP.ZERO) {
      const record = responseData[NUMBERMAP.ZERO];
    setViewRecord(record);
    setUploadedFiles(record.documents ?? []);

    setFormData((prev) => ({
      ...prev,
      numberOfBatches: record.no_of_batch_received?.toString() ?? '',
      unitsPerBatch: record.unit_per_batch?.toString() ?? '',
      unitsToTest: record.unit_test_per_batch?.toString() ?? '',
        inspectionQuantity: record.inspection_quantity?.toString() ?? '',
      rejectionsPerBatch: record.rejection_per_batch?.toString() ?? '',
      confirmAQL: record.rejection_confirmation === NUMBERMAP.ONE,
      equipmentUsed: record.equipment_item_id ? String(record.equipment_item_id) : '',
      inspectedBy: record.inspected_by ? String(record.inspected_by) : '',
      inspectionDate: record.inspection_date ? dayjs(record.inspection_date) : null,
      inspectionResult: record.inspection_result === NUMBERMAP.TWO ? FAIL_VALUE : PASS_VALUE,
      remarks: record.remarks ?? '',
      deviationApproval: record.deviation_note?.[NUMBERMAP.ZERO]?.deviation_approval ?? NUMBERMAP.ONE,
      reasonForDecision: record.deviation_note?.[NUMBERMAP.ZERO]?.reason_decision ?? '',
    }));

    if (record.inspection_specification_details && Array.isArray(record.inspection_specification_details)) {
      const transformedData = record.inspection_specification_details.map((spec: InspectionSpecificationDetail) => ({
        specification_criteria_id: spec.specification_criteria_id,
        samples: (spec.observation ?? []).map((obs: SpecificationObservation) => ({
          sample_id: obs.specification_result_id,
          sample_number: obs.unit_number,
          sample_result: (obs.test_result === NUMBERMAP.ONE ? NUMBERMAP.ONE : NUMBERMAP.ZERO),
          test_observation: obs.test_observation,
          serial_number: obs.serial_number,
          batch_number: obs.batch_number ?? '',
        }))
      }));
      setObservationsData(transformedData);
    }

    if (record.drawing_number) {
      const drawingNumbersArray = record.drawing_number.split(',').map((drawing: string) => ({
        label: drawing.trim(),
        fileUrl: '',
      }));
      setDrawingNumbers(drawingNumbersArray);
    }

    if (record.inspection_procedure) {
      const inspectionProceduresArray = record.inspection_procedure.split(',').map((procedure: string) => ({
        label: procedure.trim(),
        fileUrl: '',
      }));
      setInspectionProcedures(inspectionProceduresArray);
    }
    } else if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
      const draftResponse = responseData as Record<string, unknown>;
      loadDraftData(draftResponse);
      setViewRecord((prev) => {
        if (prev) return prev;
        const draftId = draftResponse.initiate_inspection_result_id ?? draftResponse.id;
        if (draftId == null) return null;
        const minimal = {
          initiate_inspection_result_id: Number(draftResponse.initiate_inspection_result_id ?? draftId),
          goods_inward_detail_id: Number(draftResponse.goods_inward_detail_id ?? draftResponse.id ?? goodsInwardDetailId),
        } as InitiateInspectionRecord;
        const locationDetails = draftResponse.locationDetails && typeof draftResponse.locationDetails === 'object'
          ? (draftResponse.locationDetails as Record<string, unknown>)
          : {};
        return { ...minimal, ...locationDetails } as InitiateInspectionRecord;
      });
    }
  }, [initiateResponse, goodsInwardDetailId]);

  const handleDraftSave = (formDataToSave: FormState, observationsToSave?: any[], batchHeadersToSave?: string[], fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData;
    const observationsToUse = observationsToSave ?? observationsData;
    const batchHeadersToUse = batchHeadersToSave ?? batchHeaderValues;
    const draftDatas = initiateResponse;

    const draftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    };

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, documents: uploadedFiles ?? [] },
      { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    );

    processDraftPreparation(draftPreparation, setDraftDocuments, setDraftDelete);

    const fieldsToRemove = ['documents'];
    const cleaned = removeFieldsFromFormData(formDataToSave as any, fieldsToRemove);

    const record = viewRecord as Record<string, unknown> | null;
    const locationDetails = record
      ? {
          floor: record.floor ?? null,
          room: record.room ?? null,
          shelf_details: record.shelf_details ?? record.shelfDetails ?? null,
          bin_number: record.bin_number ?? record.binNumber ?? null,
          unit_name: record.unit_name ?? record.unitName ?? null,
          address: record.address ?? null,
        }
      : null;

    const payload = {
      id: goodsInwardDetailId ?? Date.now(),
      ...cleaned,
      observationsData: observationsToUse,
      batchHeaderValues: batchHeadersToUse,
      locationDetails,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      type: 'draft',
    };

    draftSave({
      form_type: 'initiate_inspection',
      form_data: payload,
      upload_documents: {
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: draftPreparation.updateMetaData,
        documents_to_delete: [],
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
    });
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (!initialDraftLoading.current) {
        handleDraftSave(updated);
      }
      return updated;
    });
    if (value && value.trim() !== '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData((prev) => {
      const updated = { ...prev, inspectionDate: date };
      if (!initialDraftLoading.current) {
        handleDraftSave(updated);
      }
      return updated;
    });
  };

  const handleFileUpload = (fileData: FileData) => {
    if (!hasEditPermission) return;
    setUploadedFiles((prev) => [...prev, fileData]);
  };

  const handleFileEdit = (updatedFile: any) => {
    if (!hasEditPermission) return;
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
  };

  const handleFileRemove = (data: any) => {
    setUploadedFiles((prev) => {
      let next = prev;
      if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
        next = next.filter((file) => {
          const fileName = file?.file?.name?.split('.')[NUMBERMAP.ZERO] ?? file?.name?.split('.')[NUMBERMAP.ZERO];
          return !data.local_files_to_delete.includes(fileName);
        });
      }
      if (data?.documents_to_delete?.length > NUMBERMAP.ZERO) {
        next = next.filter((file) => {
          const fileId = file?.file_id ?? file?.id ?? file?.document_id;
          return !data.documents_to_delete.includes(fileId);
        });
      }
      return next;
    });
  };

  const handleFileUploadSubmit = (fileData: any) => {
    if (!hasEditPermission) return;
    const mergedFileData = mergeFinalFileData(finalFileData, fileData);
    setFinalFileData(mergedFileData);
    if (!initialDraftLoading.current) {
      handleDraftSave(formData, observationsData, batchHeaderValues, mergedFileData);
    }
    handleFileRemove(fileData);
  };

  const createFileMetadata = createFileMetadataGenerator({
    isEditMode: true,
    draftData,
    existingData: initiateResponse,
    finalFileData,
    dataPath: 'documents',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const requiredSuffix = FORM_TEXT.VALIDATION.REQUIRED_SUFFIX;

    const requireString = (field: keyof FormErrors, value: string | undefined) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        (newErrors as Record<string, string>)[field] = `${field}${requiredSuffix}`;
      }
    };

    if (isUnitQuantityType) {
      requireString('inspectionQuantity', formData.inspectionQuantity);
    } else {
      requireString('numberOfBatches', formData.numberOfBatches);
      requireString('unitsPerBatch', formData.unitsPerBatch);
      requireString('unitsToTest', formData.unitsToTest);
    }

    requireString('equipmentUsed', formData.equipmentUsed);
    requireString('inspectedBy', formData.inspectedBy);

    if (!formData.inspectionDate) {
      newErrors.inspectionDate = FORM_TEXT.VALIDATION.INSPECTION_DATE;
    }

    if (!formData.confirmAQL) {
      newErrors.confirmAQL = FORM_TEXT.VALIDATION.CONFIRM_AQL;
    }

    setErrors(newErrors);

    return Object.values(newErrors).every(error => error === '');
  };

  const validateModalForm = (): boolean => {
    const newErrors = {
      unitNumber: "",
      serialNumber: "",
      testObservation: "",
      testResult: "",
    };

    if (!modalFormData.unitNumber || modalFormData.unitNumber?.trim() === '') {
      newErrors.unitNumber = FORM_TEXT.MODAL_ERRORS.UNIT_NUMBER;
    }

    if (!modalFormData.serialNumber || modalFormData.serialNumber?.trim() === '') {
      newErrors.serialNumber = FORM_TEXT.MODAL_ERRORS.SERIAL_NUMBER;
    }

    if (!modalFormData.testObservation || modalFormData.testObservation?.trim() === '') {
      newErrors.testObservation = FORM_TEXT.MODAL_ERRORS.TEST_OBSERVATION;
    }

    if (!modalFormData.testResult || modalFormData.testResult?.trim() === '') {
      newErrors.testResult = FORM_TEXT.MODAL_ERRORS.TEST_RESULT;
    }

    setModalErrors(newErrors);
    return !newErrors.unitNumber && !newErrors.serialNumber && !newErrors.testObservation && !newErrors.testResult;
  };

  const handleCellClick = (
    row: any,
    columnKey: string,
    observation: Sample | null,
    observationIndex: number
  ) => {
    const specificationId = row?.specification_criteria_id ?? NUMBERMAP.ZERO;
    setObservationModalData({
      specificationId,
      columnKey,
      observation: observation,
      observationIndex,
    });

    if (observation) {
      setModalFormData({
        unitNumber: observation.sample_number?.toString() ?? "",
        serialNumber: (observation as any).serial_number ?? "",
        testObservation: observation.test_observation ?? "",
        testResult: observation.sample_result === NUMBERMAP.ONE
          ? FORM_TEXT.TEST_RESULT_OPTIONS.PASS
          : FORM_TEXT.TEST_RESULT_OPTIONS.FAIL,
      });
    } else {
      setModalFormData({
        unitNumber: "",
        serialNumber: "",
        testObservation: "",
        testResult: "",
      });
    }

    setModalErrors({
      unitNumber: "",
      serialNumber: "",
      testObservation: "",
      testResult: "",
    });

    setSpecificationModal(true);
  };

  const handleCloseSpecificationModal = () => {
    setSpecificationModal(false);
    setObservationModalData(null);
    setModalFormData({
      unitNumber: "",
      serialNumber: "",
      testObservation: "",
      testResult: "",
    });
    setModalErrors({
      unitNumber: "",
      serialNumber: "",
      testObservation: "",
      testResult: "",
    });
  };

  const TEST_RESULT_MAP: Record<string, number> = {
    pass: NUMBERMAP.ONE,
    fail: NUMBERMAP.TWO,
  };

  const setTestResult = (testResult: string) => {
    return TEST_RESULT_MAP[testResult] ?? null;
  };

  const batchCount = Number(formData.numberOfBatches) || NUMBERMAP.ZERO;
  const unitsPerBatchCount = Number(formData.unitsPerBatch) || NUMBERMAP.ZERO;
  const inspectionQuantityCount = Number(formData.inspectionQuantity) || NUMBERMAP.ZERO;

  const resolvedBatchCount =
    batchCount > NUMBERMAP.ZERO ? batchCount : batchHeaderValues.length;
  const effectiveBatchCount = isUnitQuantityType ? NUMBERMAP.ONE : resolvedBatchCount;
  const tableSampleCount = isUnitQuantityType ? inspectionQuantityCount : unitsPerBatchCount;
  const tableGroupCount = isUnitQuantityType ? NUMBERMAP.ONE : resolvedBatchCount;

  const batchNames = Array.from({ length: effectiveBatchCount }, (_, index) => {
    const currentName = batchHeaderValues[index] ?? "";
    const trimmed = currentName.trim();
    if (trimmed) {
      return trimmed;
    }
    return `${INCOMING_INSPECTION_BATCH_HEADER.LABEL_PREFIX} ${index + NUMBERMAP.ONE}`;
  });

  const deriveBatchIndex = (sample: Sample) => {
    if (batchNames.length === NUMBERMAP.ZERO) {
      return null;
    }
    if (isUnitQuantityType) {
      return NUMBERMAP.ZERO;
    }

    const sampleBatchName = (sample?.batch_number ?? "").toString().trim().toLowerCase();
    if (sampleBatchName) {
      const matchedIndex = batchNames.findIndex(
        (name) => name.trim().toLowerCase() === sampleBatchName
      );
      if (matchedIndex !== NUMBERMAP.NEGATIVE_ONE) {
        return matchedIndex;
      }
    }

    const sampleNumberValue = typeof sample?.sample_number === "number"
      ? sample.sample_number
      : Number(sample?.sample_number ?? NUMBERMAP.ZERO);

    if (unitsPerBatchCount > NUMBERMAP.ZERO && !Number.isNaN(sampleNumberValue) && sampleNumberValue > NUMBERMAP.ZERO) {
      return Math.floor((sampleNumberValue - NUMBERMAP.ONE) / unitsPerBatchCount);
    }

    return null;
  };

  const batchFailCounts = batchNames.map(() => NUMBERMAP.ZERO);

  observationsData.forEach((spec) => {
    (spec.samples ?? []).forEach((sample: Sample) => {
      const batchIndex = deriveBatchIndex(sample);
      if (batchIndex !== null && batchIndex >= NUMBERMAP.ZERO && batchIndex < batchFailCounts.length) {
        if (sample.sample_result === FAIL_VALUE || sample.sample_result === NUMBERMAP.ZERO) {
          batchFailCounts[batchIndex] += NUMBERMAP.ONE;
        }
      }
    });
  });

  const unitsTestedPerBatchValue = formData.unitsToTest?.trim() ?? "";
  const rejectionsPerBatchValue = formData.rejectionsPerBatch?.trim() ?? "";

  const batchInspectionRows = batchNames.map((name, index) => {
    const failedUnits = batchFailCounts[index] ?? NUMBERMAP.ZERO;
    const status = failedUnits > NUMBERMAP.ZERO ? STATUS_LABELS.FAIL : STATUS_LABELS.PASS;

    return {
      id: index + NUMBERMAP.ONE,
      batchNumber: name,
      unitsTested: unitsTestedPerBatchValue,
      rejectionsPerAql: rejectionsPerBatchValue,
      unitsFailed: failedUnits,
      status,
    };
  });

  const locationDetailsData = useMemo(() => {
    const record = viewRecord as Record<string, unknown> | null;
    return [
      { id: 'floor', area: 'Floor', observation: record?.floor ?? DISPLAY_PLACEHOLDER },
      { id: 'room', area: 'Room', observation: record?.room ?? DISPLAY_PLACEHOLDER },
      { id: 'shelfDetails', area: 'Shelf Details', observation: record?.shelf_details ?? record?.shelfDetails ?? DISPLAY_PLACEHOLDER },
      { id: 'binNumber', area: 'Bin Number', observation: record?.bin_number ?? record?.binNumber ?? DISPLAY_PLACEHOLDER },
      { id: 'unitName', area: 'Unit Name', observation: record?.unit_name ?? record?.unitName ?? DISPLAY_PLACEHOLDER },
      { id: 'address', area: 'Address', observation: record?.address ?? DISPLAY_PLACEHOLDER },
    ];
  }, [viewRecord]);

  const locationDetailColumns: GridColDef[] = useMemo(() => [
    { field: 'area', headerName: 'Areas', flex: NUMBERMAP.ONE, sortable: false },
    {
      field: 'observation',
      headerName: 'Observation',
      flex: NUMBERMAP.FOUR,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <LabelValue>{params.row.observation ?? DISPLAY_PLACEHOLDER}</LabelValue>
      ),
    },
  ], []);

  const batchInspectionColumns: GridColDef[] = [
    {
      field: FORM_TEXT.FIELDS.BATCH_TABLE.SNO,
      headerName: INCOMING_INSPECTION_UI.TABLES.BATCH_INSPECTION_RESULTS.COLUMNS.SNO,
      flex: NUMBERMAP.ONE,
      sortable: false,
    },
    {
      field: FORM_TEXT.FIELDS.BATCH_TABLE.BATCH_NUMBER,
      headerName: INCOMING_INSPECTION_UI.TABLES.BATCH_INSPECTION_RESULTS.COLUMNS.BATCH_NUMBER,
      flex: NUMBERMAP.TWO,
      sortable: false,
    },
    {
      field: FORM_TEXT.FIELDS.BATCH_TABLE.UNITS_TESTED,
      headerName: INCOMING_INSPECTION_UI.TABLES.BATCH_INSPECTION_RESULTS.COLUMNS.UNITS_TESTED,
      flex: NUMBERMAP.TWO,
      sortable: false,
    },
    {
      field: FORM_TEXT.FIELDS.BATCH_TABLE.REJECTIONS_AQL,
      headerName: INCOMING_INSPECTION_UI.TABLES.BATCH_INSPECTION_RESULTS.COLUMNS.REJECTIONS_AQL,
      flex: NUMBERMAP.THREE,
      sortable: false,
    },
    {
      field: FORM_TEXT.FIELDS.BATCH_TABLE.UNITS_FAILED,
      headerName: INCOMING_INSPECTION_UI.TABLES.BATCH_INSPECTION_RESULTS.COLUMNS.UNITS_FAILED,
      flex: NUMBERMAP.TWO,
      sortable: false,
    },
    {
      field: FORM_TEXT.FIELDS.BATCH_TABLE.STATUS,
      headerName: INCOMING_INSPECTION_UI.TABLES.BATCH_INSPECTION_RESULTS.COLUMNS.STATUS,
      flex: NUMBERMAP.ONE_HALF,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <StatusChip
          label={params.value}
          status={params.value}
          size="small"
          clickable={false}
        />
      ),
    },
  ];

  const handleModalSave = () => {
    if (!validateModalForm() || !observationModalData) {
      return;
    }
    const { specificationId, observation, observationIndex } = observationModalData;

    const unitNumber = modalFormData.unitNumber ? Number(modalFormData.unitNumber) : null;

    const batchIndexWhenBatch =
      unitsPerBatchCount > NUMBERMAP.ZERO ? Math.floor(observationIndex / unitsPerBatchCount) : NUMBERMAP.ZERO;
    const batchIndex = isUnitQuantityType ? NUMBERMAP.ZERO : batchIndexWhenBatch;
    const batchNumberValue = isUnitQuantityType ? '' : (batchHeaderValues[batchIndex] ?? '');

    const updatedObservation: Sample = {
      sample_id: observation?.sample_id ?? NUMBERMAP.ZERO,
      sample_number: unitNumber ?? undefined,
      sample_result: (setTestResult(modalFormData.testResult) ?? null) as any,
      test_observation: modalFormData.testObservation,
      serial_number: modalFormData.serialNumber,
      batch_number: batchNumberValue,
    };

    const computeNextObservations = (prev: any[]) => {
      const newData = [...prev];

      const specIndex = newData.findIndex(item => item.specification_criteria_id === specificationId);

      if (specIndex === NUMBERMAP.NEGATIVE_ONE) {
        newData.push({
          specification_criteria_id: specificationId,
          samples: [updatedObservation]
        });
      } else {
        const spec = { ...newData[specIndex] };

        if (!spec.samples || !Array.isArray(spec.samples)) {
          spec.samples = [];
        }

        const samples = [...spec.samples];

        if (observationIndex < samples.length && samples[observationIndex]) {
          samples[observationIndex] = updatedObservation;
        } else {
          while (samples.length < observationIndex) {
            samples.push(null as any);
          }
          samples[observationIndex] = updatedObservation;
        }

        spec.samples = samples.filter(s => s !== null);
        newData[specIndex] = spec;
      }

      return newData;
    };

    setObservationsData((prev) => {
      return computeNextObservations(prev);
    });

    if (!initialDraftLoading.current) {
      handleDraftSave(formData, computeNextObservations(observationsData), batchHeaderValues);
    }

    handleCloseSpecificationModal();
  };

  const mapObservationItem = (sample: Sample) => {
    const base = {
      specification_result_id: sample.sample_id ?? '',
      test_observation: sample.test_observation ?? '',
      test_result: sample.sample_result ?? NUMBERMAP.ZERO,
    };
    const numericSampleNumber = Number(sample.sample_number) || NUMBERMAP.ZERO;
    return isUnitQuantityType
      ? { ...base, unit_number: numericSampleNumber, unit_serial_no: sample.serial_number ?? '' }
      : { ...base, batch_number: sample.batch_number ?? '', batch_unit_number: numericSampleNumber };
  };

  const mapSpecificationPayload = (specifications: any[]) =>
    specifications.map((spec) => ({
      specification_criteria_id: spec.specification_criteria_id,
      observation: (spec.samples ?? []).map((sample: Sample) => mapObservationItem(sample)),
    }));

  const mapDeviationNotePayload = (
    record: InitiateInspectionRecord | null,
    formState: FormState
  ) => {
    const deviationNote = record?.deviation_note?.[NUMBERMAP.ZERO];
    return {
      deviation_note_id: deviationNote?.deviation_note_id ?? '',
      deviation_approval: formState.deviationApproval,
      reason_for_deviation: deviationNote?.reason_for_deviation ?? '',
      deviation_comments: deviationNote?.deviation_comments ?? '',
      reason_decision: formState.reasonForDecision ?? deviationNote?.reason_decision ?? '',
    };
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (!viewRecord || !goodsInwardDetailId) {
      return;
    }

    clearDraftSave();

    const inspection_specification_details = mapSpecificationPayload(observationsData.length > NUMBERMAP.ZERO ? observationsData : []);
    const deviation_note = mapDeviationNotePayload(viewRecord, formData);

    const formDataPayload = new FormData();
    const incomingInspectionResultId = viewRecord?.initiate_inspection_result_id ?? '';
    formDataPayload.append('incoming_inspection_result_id', String(incomingInspectionResultId));
    formDataPayload.append('goods_inward_detail_id', String(viewRecord.goods_inward_detail_id ?? goodsInwardDetailId));
    const batchInspectionQty =
      viewRecord.inspection_quantity ?? Number(formData.numberOfBatches) * Number(formData.unitsToTest);
    const inspectionQty = isUnitQuantityType ? formData.inspectionQuantity : (batchInspectionQty ?? '');
    formDataPayload.append('inspection_quantity', String(inspectionQty));
    formDataPayload.append('equipment_item_id', String(formData.equipmentUsed));
    formDataPayload.append('batch_received', isUnitQuantityType ? '1' : String(formData.numberOfBatches));
    formDataPayload.append('unit_per_batch', isUnitQuantityType ? String(formData.inspectionQuantity) : String(formData.unitsPerBatch));
    formDataPayload.append('unit_tested_per_batch', isUnitQuantityType ? String(formData.inspectionQuantity) : String(formData.unitsToTest));
    formDataPayload.append('inspected_by', String(formData.inspectedBy));
    formDataPayload.append('inspected_date', formData.inspectionDate?.toISOString() ?? '');
    formDataPayload.append('remarks', formData.remarks ?? '');
    if (isUnitQuantityType) {
      formDataPayload.append('inspection_result', String(formData.inspectionResult));
    }
    formDataPayload.append('inspection_specification_details', JSON.stringify(inspection_specification_details));
    formDataPayload.append('deviation_note', JSON.stringify(deviation_note));
    formDataPayload.append('part_quantity_type_id', String(isUnitQuantityType ? NUMBERMAP.TWO : NUMBERMAP.ONE));
    formDataPayload.append('rejection_per_batch', String(formData.rejectionsPerBatch ?? viewRecord?.rejection_per_batch ?? ''));
    formDataPayload.append('rejection_confirmation', String(formData.confirmAQL ? NUMBERMAP.ONE : NUMBERMAP.ZERO));

    appendFileMetadataToFormData(formDataPayload, finalFileData, createFileMetadata);

    saveInspectionMutation.mutate(formDataPayload as any, {
      onSuccess: () => {
        setFinalFileData(INITIALFILE);
        showActionAlert(STATUS.SUCCESS);
        onSaved?.();
        onDone();
      },
      onError: () => {
        showActionAlert(FAILED_ALERT);
      }
    });
  };

  const handleCancel = async() => {
    await checkUnsavedDraftBeforeLeave();
    onDone()
  };

  const calibrationDetail = viewRecord?.calibration_details?.[NUMBERMAP.ZERO];
  const equipmentTypeId = viewRecord?.equipment_type_id ?? undefined;
  const { data: equipmentItemsResponse } = useGetEquipmentItems(equipmentTypeId, NUMBERMAP.ONE);

  useEffect(() => {
    setBatchHeaderValues((prev) => {
      return Array.from({ length: batchCount }, (_, i) => prev[i] ?? "");
    });
  }, [batchCount]);

  if (!goodsInwardDetailId) {
    return null;
  }

  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <Label title={INCOMING_INSPECTION_COPY.TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={viewRecord?.part_number ?? DISPLAY_PLACEHOLDER} label={INCOMING_INSPECTION_UI.FIELD_LABELS.PART_NUMBER} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={stripHtml(viewRecord?.part_description ?? DISPLAY_PLACEHOLDER)} label={INCOMING_INSPECTION_UI.FIELD_LABELS.PART_DESCRIPTION} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={viewRecord?.safety_critical ?? DISPLAY_PLACEHOLDER} label={INCOMING_INSPECTION_UI.FIELD_LABELS.SAFETY_CRITICAL} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={viewRecord?.aql ?? DISPLAY_PLACEHOLDER} label={INCOMING_INSPECTION_UI.FIELD_LABELS.AQL} />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <UploadedFilesList
                label={INCOMING_INSPECTION_UI.FIELD_LABELS.DRAWING_NUMBER}
                files={drawingNumbers as any}
                onDelete={() => { }}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <UploadedFilesList
                label={INCOMING_INSPECTION_UI.FIELD_LABELS.INSPECTION_PROCEDURE}
                files={inspectionProcedures as any}
                onDelete={() => { }}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={viewRecord?.po_reference_number ?? DISPLAY_PLACEHOLDER} label={INCOMING_INSPECTION_UI.FIELD_LABELS.PO_REFERENCE} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={viewRecord?.supply_reference_number ?? DISPLAY_PLACEHOLDER} label={INCOMING_INSPECTION_UI.FIELD_LABELS.SUPPLY_REFERENCE} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={viewRecord?.order_quantity ?? DISPLAY_PLACEHOLDER} label={INCOMING_INSPECTION_UI.FIELD_LABELS.ORDER_QUANTITY} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={viewRecord?.supply_received ?? DISPLAY_PLACEHOLDER} label={INCOMING_INSPECTION_UI.FIELD_LABELS.SUPPLY_RECEIVED} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={viewRecord?.quantity_received ?? DISPLAY_PLACEHOLDER} label={INCOMING_INSPECTION_UI.FIELD_LABELS.QUANTITY_RECEIVED} />
            </Grid2>
            {isUnitQuantityType ? (
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InputField
                  label={INCOMING_INSPECTION_UI.FIELD_LABELS.INSPECTION_QUANTITY}
                  placeholder={INCOMING_INSPECTION_UI.PLACEHOLDERS.INSPECTION_QUANTITY}
                  value={formData.inspectionQuantity}
                  onChange={(value: string) => {
                    if (numberValidation.test(value) || value == '') {
                      handleInputChange('inspectionQuantity', value);
                    }
                  }}
                  error={errors.inspectionQuantity}
                  hasEditable={!hasEditPermission}
                />
              </Grid2>
            ) : (
              <>
                <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InputField
                  label={INCOMING_INSPECTION_UI.FIELD_LABELS.BATCHES_RECEIVED}
                  placeholder={INCOMING_INSPECTION_UI.PLACEHOLDERS.BATCHES_RECEIVED}
                  value={formData.numberOfBatches}
                  onChange={(value: string) => {
                    if (numberValidation.test(value) || value == '') {
                      handleInputChange('numberOfBatches', value);
                    }
                  }}
                  error={errors.numberOfBatches}
                  hasEditable={!hasEditPermission}
                />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={INCOMING_INSPECTION_UI.FIELD_LABELS.UNITS_PER_BATCH}
                placeholder={INCOMING_INSPECTION_UI.PLACEHOLDERS.UNITS_PER_BATCH}
                value={formData.unitsPerBatch}
                onChange={(value: string) => {
                  if (numberValidation.test(value) || value == '') {
                    handleInputChange('unitsPerBatch', value);
                  }
                }}
                error={errors.unitsPerBatch}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={INCOMING_INSPECTION_UI.FIELD_LABELS.UNITS_TESTED_PER_BATCH}
                placeholder={INCOMING_INSPECTION_UI.PLACEHOLDERS.UNITS_TESTED_PER_BATCH}
                value={formData.unitsToTest}
                onChange={(value: string) => {
                  if (numberValidation.test(value) || value == '') {
                    handleInputChange('unitsToTest', value);
                  }
                }}
                error={errors.unitsToTest}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
              </>
            )}
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                  label={INCOMING_INSPECTION_UI.FIELD_LABELS.REJECTIONS_PER_BATCH}
                  placeholder={INCOMING_INSPECTION_UI.PLACEHOLDERS.REJECTIONS_PER_BATCH}
                  value={formData.rejectionsPerBatch}
                  onChange={(value: string) => {
                    if (numberValidation.test(value) || value == '') {
                      handleInputChange('rejectionsPerBatch', value);
                    }
                  }}
                  error={errors.rejectionsPerBatch}
                  hasEditable={!hasEditPermission}
                />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.confirmAQL}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => {
                            const updated = { ...prev, confirmAQL: checked };
                            if (!initialDraftLoading.current) {
                              handleDraftSave(updated);
                            }
                            return updated;
                          });
                          if (checked) setErrors((prev) => ({ ...prev, confirmAQL: '' }));
                        }}
                        disabled={!hasEditPermission}
                      />
                    }
                    label={INCOMING_INSPECTION_UI.FIELD_LABELS.CONFIRM_AQL}
                  />
                  {errors.confirmAQL && <ErrorText>{errors.confirmAQL}</ErrorText>}
                </>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={viewRecord?.equipment_type ?? DISPLAY_PLACEHOLDER} label={FORM_TEXT.LABELS.EQUIPMENT_TYPE} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_TEXT.LABELS.EQUIPMENT_USED}
                placeholder={FORM_TEXT.PLACEHOLDERS.EQUIPMENT_USED}
                isDropdown
                options={equipmentItemsResponse?.data ?? []}
                keyField="equipment_item_id"
                valueField="equipment_item"
                value={formData.equipmentUsed}
                onChange={(value: string) => handleInputChange('equipmentUsed', value)}
                error={errors.equipmentUsed}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

          {isUnitQuantityType && (
            <Box sx={FORM_TEXT.SX.SECTION_MARGIN_TOP}>
              <Typography>{INCOMING_INSPECTION_UI.TABLES.LOCATION_DETAILS.SECTION_TITLE}</Typography>
              <Link
                component="button"
                variant="body2"
                underline="always"
                onClick={() => setShowLocationDetailsTable(true)}
              >
                {INCOMING_INSPECTION_UI.TABLES.LOCATION_DETAILS.HYPERLINK}
              </Link>
              <CommonModal
                open={showLocationDetailsTable}
                onClose={() => setShowLocationDetailsTable(false)}
                title={INCOMING_INSPECTION_UI.TABLES.LOCATION_DETAILS.SECTION_TITLE}
                buttonRequired
              >
                <DataGridTable
                  rows={locationDetailsData}
                  columns={locationDetailColumns}
                  idField="id"
                  hideFooter
                />
              </CommonModal>
            </Box>
          )}

          <Box sx={FORM_TEXT.SX.SECTION_MARGIN_TOP}>
            <HeaderSection>
              <HeaderTitle>{INCOMING_INSPECTION_UI.SECTION_LABELS.CALIBRATION}</HeaderTitle>
            </HeaderSection>
            <CostItemsWrapper>
              <Grid2 container>
                <Grid2 sx={grid2Container}>
                  <CostLabelContainer>
                    {FORM_TEXT.CALIBRATION_LABELS.map((label, index) => (
                      <CostItemContainer key={label} isLast={index === NUMBERMAP.THREE}>
                        <CostLabel>{label}</CostLabel>
                      </CostItemContainer>
                    ))}
                  </CostLabelContainer>
                </Grid2>
                <Grid2 sx={grid2Container}>
                  <CostInputContainer>
                    {[
                      { key: 'status', value: calibrationDetail?.calibration_status },
                      { key: 'date', value: calibrationDetail?.calibration_date ? dayjs(calibrationDetail.calibration_date).format('DD/MM/YYYY') : DISPLAY_PLACEHOLDER },
                      { key: 'due', value: calibrationDetail?.calibration_due_date ? dayjs(calibrationDetail.calibration_due_date).format('DD/MM/YYYY') : DISPLAY_PLACEHOLDER },
                      { key: 'certificate', isDownload: true },
                    ].map((field, index) => (
                      <Box key={field.key} sx={getDeviationNoteValueBoxStyles(index, 4)}>
                        {field.isDownload ? (
                          <IconButton size="small" disabled={!calibrationDetail?.fk_eqms_file_id}>
                            <Download />
                          </IconButton>
                        ) : (
                          <InputContainer>
                            <LabelValue>{field.value ?? DISPLAY_PLACEHOLDER}</LabelValue>
                          </InputContainer>
                        )}
                      </Box>
                    ))}
                  </CostInputContainer>
                </Grid2>
              </Grid2>
            </CostItemsWrapper>
          </Box>

          <Grid2 size={NUMBERMAP.TWELVE} sx={STYLE5}>
            <VendorSelectionTable
              data={tableData}
              columns={tableColumns}
              sampleCount={tableSampleCount > NUMBERMAP.ZERO ? tableSampleCount : NUMBERMAP.ONE}
              groupCount={tableGroupCount}
              renderGroupHeader={isUnitQuantityType ? undefined : (groupIndex) =>
                editingBatchIndex === groupIndex ? (
                  <Box sx={getBatchHeaderEditContainerSx()}>
                    <InputBase
                      autoFocus
                      value={batchHeaderValues[groupIndex] ?? ""}
                      onChange={(e) => {
                        const next = [...batchHeaderValues];
                        next[groupIndex] = e.target.value;
                        setBatchHeaderValues(next);
                        if (!initialDraftLoading.current) {
                          handleDraftSave(formData, observationsData, next);
                        }
                      }}
                      placeholder={INCOMING_INSPECTION_BATCH_HEADER.INPUT_PLACEHOLDER}
                      disabled={!hasEditPermission}
                      onBlur={() => setEditingBatchIndex(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingBatchIndex(null);
                      }}
                      sx={getBatchHeaderInputSx()}
                      inputProps={{ "aria-label": `Batch ${groupIndex + NUMBERMAP.ONE}` }}
                    />
                  </Box>
                ) : (
                  <Box sx={getBatchHeaderViewContainerSx()}>
                    <EditIconButton
                      size="small"
                      disabled={!hasEditPermission}
                      onClick={() => {
                        if (!hasEditPermission) return;
                        setEditingBatchIndex(groupIndex);
                      }}
                      sx={getBatchHeaderEditIconSx()}
                    >
                      <Edit size={NUMBERMAP.EIGHTEEN} color="currentColor" />
                    </EditIconButton>
                    <Typography sx={getBatchHeaderTextSx()}>
                      {(batchHeaderValues[groupIndex] ?? "").trim() ??
                        `${INCOMING_INSPECTION_BATCH_HEADER.LABEL_PREFIX} ${groupIndex + NUMBERMAP.ONE}`}
                    </Typography>
                  </Box>
                )
              }
              onCellClick={handleCellClick}
            />
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={INCOMING_INSPECTION_UI.FIELD_LABELS.INSPECTED_BY}
                placeholder={INCOMING_INSPECTION_UI.PLACEHOLDERS.INSPECTED_BY}
                isDropdown
                options={employeeResponse?.data ?? []}
                keyField="id"
                valueField="employee_name"
                value={formData.inspectedBy}
                onChange={(value: string) => handleInputChange('inspectedBy', value)}
                error={errors.inspectedBy}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={INCOMING_INSPECTION_UI.FIELD_LABELS.INSPECTION_DATE}
                value={formData.inspectionDate}
                onChange={handleDateChange}
                error={errors.inspectionDate ?? ""}
                readOnly={!hasEditPermission}
              />
            </Grid2>
          {isUnitQuantityType && (
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputLabel>{INCOMING_INSPECTION_UI.SECTION_LABELS.INSPECTION_RESULTS}</InputLabel>
              <Box sx={FORM_TEXT.SX.RESULT_CHIP_ROW}>
                <StatusChip
                  label={STATUS_LABELS.PASS}
                  status={STATUS_LABELS.PASS}
                  clickable={hasEditPermission}
                  onClick={() => {
                    if (!hasEditPermission) return;
                    setFormData((prev) => {
                      const updated = { ...prev, inspectionResult: PASS_VALUE };
                      if (!initialDraftLoading.current) {
                        handleDraftSave(updated);
                      }
                      return updated;
                    });
                  }}
                  sx={(theme) => ({
                    ...(formData.inspectionResult !== PASS_VALUE && {
                      backgroundColor: theme.palette.grey[300],
                      color: theme.palette.text.primary,
                    }),
                  })}
                />
                <StatusChip
                  label={STATUS_LABELS.FAIL}
                  status={STATUS_LABELS.FAIL}
                  clickable={hasEditPermission}
                  onClick={() => {
                    if (!hasEditPermission) return;
                    setFormData((prev) => {
                      const updated = { ...prev, inspectionResult: FAIL_VALUE };
                      if (!initialDraftLoading.current) {
                        handleDraftSave(updated);
                      }
                      return updated;
                    });
                  }}
                  sx={(theme) => ({
                    ...(formData.inspectionResult !== FAIL_VALUE && {
                      backgroundColor: theme.palette.grey[300],
                      color: theme.palette.text.primary,
                    }),
                  })}
                />
              </Box>
              <ErrorText>{errors?.inspectionResult ?? ''}</ErrorText>
            </Grid2>
          )}
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Description
                label={INCOMING_INSPECTION_UI.SECTION_LABELS.REMARKS}
                placeholder={INCOMING_INSPECTION_UI.PLACEHOLDERS.REMARKS}
                value={formData.remarks}
                onChange={(value: string) => handleInputChange('remarks', value)}
                error={errors.remarks}
                disabled={!hasEditPermission}
              />
            </Grid2>
          {!isUnitQuantityType && (
            <Grid2 size={NUMBERMAP.TWELVE}>
              <InputLabel>{INCOMING_INSPECTION_UI.TABLES.BATCH_INSPECTION_RESULTS.TITLE}</InputLabel>
              <DataGridTable
                columns={batchInspectionColumns}
                rows={batchInspectionRows}
                hideFooter
                showColumnLines
              />
            </Grid2>
          )}
          </Grid2>

          <Grid2 size={NUMBERMAP.TWELVE} sx={STYLE5}>
            <FileUploadManager
              initialFiles={uploadedFiles}
              onFileUpload={handleFileUpload}
              onFileEdit={handleFileEdit}
              onSubmit={handleFileUploadSubmit}
              subHeader={INCOMING_INSPECTION_UI.SECTION_LABELS.FILE_UPLOAD}
              hasEditable={!hasEditPermission}
            />
          </Grid2>

          <Box sx={FORM_TEXT.SX.SECTION_MARGIN_TOP}>
            <HeaderSection>
              <HeaderTitle>{INCOMING_INSPECTION_UI.SECTION_LABELS.DEVIATION_NOTE}</HeaderTitle>
            </HeaderSection>
            <CostItemsWrapper>
              <Grid2 container>
                <Grid2 sx={grid2Container}>
                  <CostLabelContainer>
                    {FORM_TEXT.DEVIATION_LABELS.map((label, index) => (
                      <CostItemContainer key={label} isLast={index === 3}>
                        <CostLabel>{label}</CostLabel>
                      </CostItemContainer>
                    ))}
                  </CostLabelContainer>
                </Grid2>
                <Grid2 sx={grid2Container}>
                  <CostInputContainer>
                    <Box sx={getDeviationNoteValueBoxStyles(NUMBERMAP.ZERO, 4)}>
                      <InputContainer>
                        <LabelValue>
                          {viewRecord?.deviation_note?.[NUMBERMAP.ZERO]?.deviation_comments ?? DISPLAY_PLACEHOLDER}
                        </LabelValue>
                      </InputContainer>
                    </Box>
                    <Box sx={getDeviationNoteValueBoxStyles(NUMBERMAP.ONE, 4)}>
                      <InputContainer>
                        <LabelValue>
                          {viewRecord?.deviation_note?.[NUMBERMAP.ZERO]?.reason_for_deviation ?? DISPLAY_PLACEHOLDER}
                        </LabelValue>
                      </InputContainer>
                    </Box>
                    <Box sx={getDeviationNoteValueBoxStyles(NUMBERMAP.TWO, 4)}>
                      <RadioButtonGroup
                        label=""
                        name="deviationApproval"
                        options={[
                          { value: NUMBERMAP.ONE, label: 'Deviation Approved' },
                          { value: NUMBERMAP.TWO, label: 'Deviation Rejected' },
                        ]}
                        value={formData.deviationApproval}
                        onChange={(value) =>
                          setFormData((prev) => {
                            const updated = { ...prev, deviationApproval: Number(value) };
                            if (!initialDraftLoading.current) {
                              handleDraftSave(updated);
                            }
                            return updated;
                          })
                        }
                      />
                    </Box>
                    <Box sx={getDeviationNoteValueBoxStyles(NUMBERMAP.THREE, 4)}>
                      <Box sx={getFullWidthBoxSx()}>
                        <RichTextEditor
                          label=""
                          value={formData.reasonForDecision}
                          onChange={(value: string) => handleInputChange('reasonForDecision', value)}
                          placeholder={FORM_TEXT.PLACEHOLDERS.RICH_TEXT}
                        />
                      </Box>
                    </Box>
                  </CostInputContainer>
                </Grid2>
              </Grid2>
            </CostItemsWrapper>
          </Box>
        </FormContent>

        <CommentsHistoryContainer>
          <CommentsHistory comments={initiateResponse?.meta_info?.task_info?.task_comments} />
        </CommentsHistoryContainer>

        <Grid2 size={NUMBERMAP.TWELVE} sx={FORM_TEXT.SX.WRAPPER_MARGIN}>
          <QCReviewerModalManager
            isLoading={true}
            permissions={initiateResponse?.meta_info?.action_control?.permissions ?? []}
            taskInfo={{
              task_comments: initiateResponse?.meta_info?.task_info?.task_comments ?? [],
              reviewer_list: initiateResponse?.meta_info?.task_info?.reviewer_list ?? [],
              task_id: initiateResponse?.meta_info?.task_info?.task_id,
            }}
            refetch={refetch}
            menuId={initiateResponse?.meta_info?.action_control?.menuId}
            menuName={initiateResponse?.meta_info?.action_control?.formName}
            contextType="incoming_inspection"
            contextId={(viewRecord?.initiate_inspection_result_id) ?? NUMBERMAP.ZERO}
            uniqueId={viewRecord?.initiate_inspection_result_id}
            onPermissionChange={setHasEditPermission}
            customHandlers={{
              handleCancel,
              handleSave,
            }}
          />
        </Grid2>
      </FormWrapper>

      <ObservationDetailsModal
        open={specificationModal}
        hasEditPermission={hasEditPermission}
        formData={modalFormData}
        errors={modalErrors}
        onClose={handleCloseSpecificationModal}
        onSave={handleModalSave}
        onChange={setModalFormData}
        onErrorsChange={setModalErrors}
      />
    </FormContainer>
  );
};

export default IncomingInspectionForm;
