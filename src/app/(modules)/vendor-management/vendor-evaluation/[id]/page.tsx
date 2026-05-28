"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Grid2, Box, Typography } from "@mui/material";
import { RichTextEditor, InputField, ButtonGroup, Label, RadioButtonGroup, DataGridTable, Description, showActionAlert } from "@/components/ui";
import { GridColDef } from "@mui/x-data-grid";
import { NUMBERMAP, FILE_UPLOAD_SUB_HEADER, BUTTON_LABEL, BUTTONSTYLE } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import { useUpsertVendorEvaluation, useVendorEvaluationById } from "@/hooks/modules/vendor-management/useVendorEvaluation";
import { VendorEvaluationFormData, CriteriaEvaluationItem } from "@/types/modules/vendor-management/vendorEvaluation";
import { FORM_LABELS, INITIAL_VENDOR_EVALUATION, OBSERVATION_AREAS, VENDOR_EVALUATION_CONSTANTS } from "@/constants/modules/vendor-management/vendorEvaluation";
import { FinalFileData, mergeFinalFileData, processButtonsWithPermissions } from "@/lib/utils/common";
import { FileData, FileDocument } from "@/types/components/ui/fileUploadV3";
import { useParams, useRouter } from "next/navigation";
import VendorSelectionCriteriaTable, { VendorCriteria } from "@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaTable";
import { ErrorText, CommonModalScroll } from "@/styles/common";
import { transformHierarchicalData, TransformConfig } from '@/lib/modules/vendor-management/transformHierarchicalData';
import { COMMON_COLUMNS } from "@/constants/modules/vendor-management/common";
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { downloadStyles } from '@/styles/components/ui/datatable';
import CommentsHistory from '@/components/ui/comments-history/Comments';
import { CommentsHistoryContainer } from '@/styles/modules/dnd/dir';
import VendorReviewerModalManager from "@/components/modules/vendor-management/reviewer-modal/VendorReviewerModalManager";

/**
 * Classification : Confidential
 * Updated to handle string observations
 **/


interface VendorEvaluationFormProps {
  params: Promise<{
    id: string;
  }>;
}

const FINALFILEINITIALDATA: FinalFileData = {
  documents_to_create: [],
  documents_to_delete: [],
  create_meta_data: {},
  update_meta_data: {},
  local_files_to_delete: [],
}

const VendorEvaluationForm: React.FC<VendorEvaluationFormProps> = () => {
  const { id } = useParams<{ id?: string }>();
  const resolvedParams = Number(id);
  const router = useRouter();
  if (isNaN(resolvedParams)) {
    showActionAlert('customAlert', {
      title: 'Invalid Route Parameter',
      text: 'The route parameter must be a number',
      icon: 'error',
      cancelButton: false,
      confirmButton: false,
    });
  }
  const [formData, setFormData] = useState<VendorEvaluationFormData>(INITIAL_VENDOR_EVALUATION);
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [criteriaStatuses, setCriteriaStatuses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[] | FileDocument[]>([]);
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const [flatCriteriaData, setFlatCriteriaData] = useState<VendorCriteria[]>([]);
  const [errors, setErrors] = useState<{ criteriaStatuses?: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentRowId, setSelectedParentRowId] = useState<string | null>(null);
  const [parentRowFiles, setParentRowFiles] = useState<Record<string, File[] | FileDocument[]>>({});
  const [parentRowFileData, setParentRowFileData] = useState<Record<string, FinalFileData>>({});
  const [currentParentRowFileData, setCurrentParentRowFileData] = useState([]);
  const [currentFinalFileData, setCurrentFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(true);

  const statusOptions = useMemo(() => [
    { label: 'Yes', value: NUMBERMAP.ONE },
    { label: 'No', value: NUMBERMAP.ZERO }
  ], []);

  // API hooks
  const upsertVendorEvaluationMutation = useUpsertVendorEvaluation();
  const { data: vendorEvaluationData, isLoading: isDataLoading, refetch: refetchEvaluation } = useVendorEvaluationById(String(resolvedParams), !!resolvedParams);
  const isCreateMode = !resolvedParams || isNaN(resolvedParams);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      return { ...prev, [field]: value };
    });
  };

  const handleObservationChange = (observationType: string, value: string) => {
    setFormData(prev => {
      return { ...prev, [observationType]: value };
    });
  };

  const updateCriteriaEvaluationStatus = useCallback((
    evaluations: CriteriaEvaluationItem[],
    numericId: number | null,
    status: string
  ): CriteriaEvaluationItem[] => {
    if (numericId === null) return evaluations;
    return evaluations.map(item =>
      item.vendor_group_criteria_mapper_id == numericId
        ? { ...item, selection_status: parseInt(status) }
        : item
    );
  }, []);

  const handleCriteriaStatusChange = (itemId: string, status: string) => {
    setCriteriaStatuses(prev => {
      const updated = { ...prev, [itemId]: status };

      // Update form data criteria_evaluations
      let numericId: number | null = null;
      if (itemId.startsWith('child__')) {
        numericId = Number(itemId.slice('child__'.length));
      } else if (itemId.startsWith('parent__')) {
        numericId = Number(itemId.slice('parent__'.length));
      }
      if (errors.criteriaStatuses) {
        setErrors((prev) => ({
          ...prev,
          criteriaStatuses: ''
        }))
      }
      setFormData(formDataPrev => ({
        ...formDataPrev,
        criteria_evaluations: updateCriteriaEvaluationStatus(
          formDataPrev.criteria_evaluations,
          numericId,
          status
        )
      }));

      return updated;
    });
  };


  const validateForm = useCallback(() => {

    if (formData.criteria_evaluations.some((criteria) => criteria.selection_status == null)) {
      setErrors({
        criteriaStatuses: 'Please select a status for all criteria',
      })
      showActionAlert('customAlert', {
        title: 'Error',
        text: 'Please select a status for all criteria',
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      })
      return false
    }
    return true
  }, [criteriaStatuses, flatCriteriaData])

  // Helper function to extract mapper ID from child item
  const getMapperIdFromChildItem = useCallback((childItem: VendorCriteria): number | null => {
    if (childItem.vendor_group_criteria_mapper_id !== undefined && childItem.vendor_group_criteria_mapper_id !== null) {
      return Number(childItem.vendor_group_criteria_mapper_id);
    }

    const childId = String(childItem.id);
    if (childId.startsWith('child_')) {
      return Number(childId.slice('child_'.length));
    }

    return null;
  }, []);

  // Helper function to filter child items by group ID
  const getChildItemsByGroup = useCallback((flatData: VendorCriteria[], groupId: number): VendorCriteria[] => {
    return flatData.filter(c => c.group === groupId && !c.isParent);
  }, []);

  // Helper function to find matching entry in criteria evaluations
  const findMatchingCriteriaEntry = useCallback((
    criteriaEvaluations: CriteriaEvaluationItem[]
  ): CriteriaEvaluationItem | undefined => {
    return criteriaEvaluations.find(() => false);
  }, []);

  // Helper function to get mapper ID from parent row
  const getMapperIdFromParentRow = useCallback((
    flatData: VendorCriteria[],
    criteriaEvaluations: CriteriaEvaluationItem[],
    itemId: string,
    groupId: number
  ): number | null => {
    const groupItems = getChildItemsByGroup(flatData, groupId);

    if (groupItems.length === NUMBERMAP.ONE) {
      return getMapperIdFromChildItem(groupItems[NUMBERMAP.ZERO]);
    }

    if (groupItems.length === NUMBERMAP.ZERO) {
      // True single-item group where parent IS the item
      // Try to find in criteria_evaluations by matching group
      const matchingEntry = findMatchingCriteriaEntry(criteriaEvaluations);
      return matchingEntry ? matchingEntry.vendor_group_criteria_mapper_id : null;
    }

    return null;
  }, [getMapperIdFromChildItem, getChildItemsByGroup, findMatchingCriteriaEntry]);

  // Helper function to extract vendor_group_criteria_mapper_id from item
  const getVendorGroupCriteriaMapperId = useCallback((
    flatData: VendorCriteria[],
    criteriaEvaluations: CriteriaEvaluationItem[],
    item: VendorCriteria,
    itemId: string
  ): number | null => {
    // First, try to get it from the item's vendor_group_criteria_mapper_id field
    if (item.vendor_group_criteria_mapper_id !== undefined && item.vendor_group_criteria_mapper_id !== null) {
      return Number(item.vendor_group_criteria_mapper_id);
    }

    // For child rows, extract from ID (format: child_${vendor_group_criteria_mapper_id})
    if (!item.isParent && itemId.startsWith('child_')) {
      return Number(itemId.slice('child_'.length));
    }

    // For parent rows, extract from group
    if (item.isParent && itemId.startsWith('parent_')) {
      const groupId = Number(itemId.slice('parent_'.length));
      if (!isNaN(groupId)) {
        return getMapperIdFromParentRow(flatData, criteriaEvaluations, itemId, groupId);
      }
    }

    return null;
  }, [getMapperIdFromParentRow]);

  // Helper function to process a single item and add to evaluations
  const processItem = useCallback((
    flatData: VendorCriteria[],
    criteriaEvaluations: CriteriaEvaluationItem[],
    statuses: Record<string, string>,
    item: VendorCriteria,
    evaluations: CriteriaEvaluationItem[],
    processedIds: Set<number>
  ): void => {
    const itemId = String(item.id);
    const status = statuses[itemId];

    if (!status) {
      return;
    }

    const vendorGroupCriteriaMapperId = getVendorGroupCriteriaMapperId(flatData, criteriaEvaluations, item, itemId);

    if (!vendorGroupCriteriaMapperId || isNaN(vendorGroupCriteriaMapperId) || processedIds.has(vendorGroupCriteriaMapperId)) {
      return;
    }

    const rowWithRemarks = item as VendorCriteria & { remarks?: string };
    const remarks = rowWithRemarks.remarks ?? "";

    evaluations.push({
      vendor_group_criteria_mapper_id: vendorGroupCriteriaMapperId,
      selection_status: parseInt(status),
      remarks: remarks
    });

    processedIds.add(vendorGroupCriteriaMapperId);
  }, [getVendorGroupCriteriaMapperId]);

  // Build complete criteria_evaluations array from flatCriteriaData and criteriaStatuses
  const buildCriteriaEvaluations = useCallback((
    flatData: VendorCriteria[],
    statuses: Record<string, string>,
    criteriaEvaluations: CriteriaEvaluationItem[]
  ): CriteriaEvaluationItem[] => {
    const evaluations: CriteriaEvaluationItem[] = [];
    const processedIds = new Set<number>();

    flatData.forEach((item) => {
      processItem(flatData, criteriaEvaluations, statuses, item, evaluations, processedIds);
    });

    return evaluations;
  }, [processItem]);

  // Helper function to extract groupId from parent row ID
  const extractGroupIdFromParentRow = useCallback((
    parentRowId: string,
    flatCriteriaData: VendorCriteria[]
  ): number | null => {
    if (parentRowId.startsWith('parent_')) {
      const groupId = Number(parentRowId.slice('parent_'.length));
      if (!isNaN(groupId)) {
        return groupId;
      }
    }

    // Fallback: try to find group from flatCriteriaData
    const parentItem = flatCriteriaData.find(item => String(item.id) === parentRowId && item.isParent);
    return parentItem?.group ?? null;
  }, []);

  // Helper function to merge parent file data
  const mergeParentFileData = useCallback((
    parentFileData: FinalFileData,
    groupId: number,
    allDocumentsToCreate: File[],
    allDocumentsToDelete: string[],
    allUpdateMetaData: Record<string, any>,
    structuredCreateMetaData: any
  ): void => {
    // Append parent row files to documents_to_create

    // Merge parent row create_meta_data under applicable_group_supporting_files
    if (parentFileData.create_meta_data && Object.keys(parentFileData.create_meta_data).length > NUMBERMAP.ZERO) {
      structuredCreateMetaData.applicable_group_supporting_files[String(groupId)] = parentFileData.create_meta_data;
    }

    // Merge parent row update_meta_data
    if (parentFileData.update_meta_data && Object.keys(parentFileData.update_meta_data).length > NUMBERMAP.ZERO) {
      Object.assign(allUpdateMetaData, parentFileData.update_meta_data);
    }

    // Merge parent row documents_to_delete
    if (parentFileData.documents_to_delete && parentFileData.documents_to_delete.length > NUMBERMAP.ZERO) {
      allDocumentsToDelete.push(...parentFileData.documents_to_delete);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return
    setIsLoading(true);
    const { create_meta_data: updatedCreateMetaData, documents_to_create: updatedDocumentsToCreate } = finalFileData;

    const criteriaEvaluationsToSend = buildCriteriaEvaluations(flatCriteriaData, criteriaStatuses, formData.criteria_evaluations);
    // Merge parent row files into the main file data
    let allDocumentsToCreate = [...updatedDocumentsToCreate];
    let allDocumentsToDelete = [...(finalFileData.documents_to_delete ?? [])];
    let allUpdateMetaData = { ...(finalFileData.update_meta_data ?? {}) };

    // Structure create_meta_data with vendor_evaluation_supporting_files and applicable_group_supporting_files
    const structuredCreateMetaData: any = {
      vendor_evaluation_supporting_files: updatedCreateMetaData ?? {},
      applicable_group_supporting_files: {}
    };

    Object.keys(parentRowFileData).forEach((parentRowId) => {
      const groupId = extractGroupIdFromParentRow(parentRowId, flatCriteriaData);
      allDocumentsToCreate = [...allDocumentsToCreate, ...parentRowFileData[parentRowId].documents_to_create]
      if (groupId !== null) {
        mergeParentFileData(
          parentRowFileData[parentRowId],
          groupId,
          allDocumentsToCreate,
          allDocumentsToDelete,
          allUpdateMetaData,
          structuredCreateMetaData
        );
      }
    });
    const formDataToSend = new FormData();

    // Append documents to create if any
    if (allDocumentsToCreate.length > 0) {
      allDocumentsToCreate?.forEach((file) => {
        formDataToSend.append('documents_to_create', file, file.name);
      });
    }
    formDataToSend.append('create_meta_data', JSON.stringify(structuredCreateMetaData));
    if (Object.keys(allUpdateMetaData).length > NUMBERMAP.ZERO) {
      formDataToSend.append('update_meta_data', JSON.stringify(allUpdateMetaData));
    }

    if (allDocumentsToDelete.length > NUMBERMAP.ZERO) {
      formDataToSend.append('documents_to_delete', JSON.stringify(allDocumentsToDelete));
    }

    // Always append these fields
    if (vendorId !== null && vendorId !== undefined) {
      formDataToSend.append('vendor_id', String(vendorId));
    }
    formDataToSend.append('audit_conclusion', formData.audit_conclusion);
    formDataToSend.append('customer_support_observation', formData.customer_support_observation);
    formDataToSend.append('logistics_observation', formData.logistics_observation);
    formDataToSend.append('quality_control_observation', formData.quality_control_observation);
    formDataToSend.append('manufacturing_observation', formData.manufacturing_observation);
    formDataToSend.append('design_observation', formData.design_observation);
    formDataToSend.append('vendor_part_category_mapper_id', String(formData.vendor_part_category_mapper_id ?? ''));
    formDataToSend.append('criteria_evaluation', JSON.stringify(criteriaEvaluationsToSend));

    upsertVendorEvaluationMutation.mutate(formDataToSend as any, {
      onSuccess: () => {
        showActionAlert('success')
        router.push(VENDOR_EVALUATION_CONSTANTS.PATH_NAME);
      },
      onError: () => {
        showActionAlert('failed')
      }
    })
    setIsLoading(false);

  }, [finalFileData, formData, flatCriteriaData, criteriaStatuses, parentRowFileData, vendorEvaluationData, vendorId, upsertVendorEvaluationMutation, router, validateForm]);

  const handleCancel = useCallback(() => {
    setFormData(INITIAL_VENDOR_EVALUATION);
    setCriteriaStatuses({});
    setFinalFileData(FINALFILEINITIALDATA);
    setUploadedDocuments([]);
    router.push(VENDOR_EVALUATION_CONSTANTS.PATH_NAME);
  }, []);

  const handleFileUpload = useCallback((newFile: File | FileData) => {
    setUploadedDocuments((prev) => [...prev, newFile] as File[] | FileDocument[]);
  }, []);

  const handleFileEdit = useCallback((updatedFile: File | FileData) => {
    setUploadedDocuments((prev) =>
      prev.map((file: any) => {
        const fileId = file.file_id ?? file.id;
        const updatedId = (updatedFile as any).file_id ?? (updatedFile as any).id;
        return fileId === updatedId ? { ...file, ...updatedFile } : file;
      }) as File[] | FileDocument[]
    );
  }, []);

  const handleCriteriaChange = (updatedCriteria: VendorCriteria[]) => {
    setFlatCriteriaData(updatedCriteria);
  };


  // Create criteria evaluations form data from flat API structure
  const createCriteriaEvaluationsFormData = useCallback((criteriaData: any[]): CriteriaEvaluationItem[] => {
    const formData: CriteriaEvaluationItem[] = [];
    if (!criteriaData || !Array.isArray(criteriaData)) {
      return formData;
    }
    // Process each item in the flat array

    criteriaData?.forEach((item: any) => {
      item?.criteria.map((cri) => {
        formData.push({
          vendor_group_criteria_mapper_id: cri.vendor_group_criteria_mapper_id,
          selection_status: cri.selection_status,
          remarks: cri.remarks ?? ""
        });
      })
    });

    return formData;
  }, []);

  // Transform flat criteria data into hierarchical structure for the table
  const transformCriteriaToFlat = useCallback((criteriaData: any[]): VendorCriteria[] => {
    const config: TransformConfig<VendorCriteria> = {
      groupIdField: 'group_id',
      groupNameField: 'group_value',
      subGroupIdField: 'sub_group_id',
      subGroupNameField: 'sub_group_value',
      orderField: 'display_order',
      parentIdPrefix: 'parent_',
      childIdPrefix: 'child_',
      childIdField: 'vendor_group_criteria_mapper_id',
      fieldMappings: {
        criteria: 'group_value',
        requirement: 'requirement_type_name',
        category: 'group_value',
        status: 'selection_status',
        remarks: 'remarks',
      },
    };

    return transformHierarchicalData(criteriaData as any, config);
  }, []);

  // Update flat data to use applicable_group_id for file mapping consistency
  // Preserves vendor_group_criteria_mapper_id when updating
  const updateFlatDataWithApplicableGroupId = useCallback((
    flatData: VendorCriteria[],
    groupIdToApplicableGroupIdMap: Record<number, number>
  ): VendorCriteria[] => {
    return flatData.map((item: VendorCriteria) => {
      if (!item.group) {
        return item;
      }

      const applicableGroupId = groupIdToApplicableGroupIdMap[item.group];
      if (!applicableGroupId) {
        return item;
      }

      // Update parent rows: change ID and group
      if (item.isParent) {
        return {
          ...item,
          id: `parent_${applicableGroupId}`,
          group: applicableGroupId,
          vendor_group_criteria_mapper_id: item.vendor_group_criteria_mapper_id
        };
      }

      // Update child rows: change group only
      return {
        ...item,
        group: applicableGroupId,
        vendor_group_criteria_mapper_id: item.vendor_group_criteria_mapper_id
      };
    });
  }, []);

  // Helper function to normalize data array
  const normalizeDataArray = useCallback((data: any): any[] => {
    if (Array.isArray(data)) {
      return data;
    }
    if (typeof data === 'object' && data !== null) {
      return [data];
    }
    return [];
  }, []);

  // Helper function to extract vendor ID from data
  const extractVendorId = useCallback((data: any, dataArray: any[], vendorEvaluationData: any): number | null => {
    const vendorIdValue = data.vendor_id ??
      dataArray[NUMBERMAP.ZERO]?.vendor_id ??
      vendorEvaluationData?.data?.vendor_id;
    if (vendorIdValue !== undefined && vendorIdValue !== null) {
      return Number(vendorIdValue);
    }
    return null;
  }, []);

  // Helper function to create initial form data
  const createInitialFormData = useCallback((data: any): VendorEvaluationFormData => {
    return {
      create_meta_data: "",
      update_meta_data: "",
      documents_to_create: "",
      documents_to_delete: "",
      audit_conclusion: data.audit_conclusion ?? "",
      customer_support_observation: data.customer_support_observation ?? "",
      logistics_observation: data.logistics_observation ?? "",
      quality_control_observation: data.quality_control_observation ?? "",
      manufacturing_observation: data.manufacturing_observation ?? "",
      design_observation: data.design_observation ?? "",
      vendor_part_category_mapper_id: data.vendor_part_category_mapper_id ?? null,
      criteria_evaluations: []
    };
  }, []);

  // Helper function to load parent row files
  const loadParentRowFiles = useCallback((criteriaEvaluations: any[]): Record<string, File[] | FileDocument[]> => {
    const parentRowFilesMap: Record<string, File[] | FileDocument[]> = {};

    if (Array.isArray(criteriaEvaluations)) {
      criteriaEvaluations.forEach((group: any) => {
        if (group.applicable_group_id && group.applicable_group_files && Array.isArray(group.applicable_group_files)) {
          const parentRowId = `parent_${group.applicable_group_id}`;
          parentRowFilesMap[parentRowId] = group.applicable_group_files as unknown as FileDocument[];
        }
      });
    }

    return parentRowFilesMap;
  }, []);

  // Helper function to flatten criteria evaluations (reusable)
  const flattenCriteriaEvaluations = useCallback((
    criteriaEvaluations: any[]
  ): { flattenedCriteria: any[], groupIdToApplicableGroupIdMap: Record<number, number> } => {
    const groupIdToApplicableGroupIdMap: Record<number, number> = {};
    const flattenedCriteria: any[] = [];

    criteriaEvaluations.forEach((group: any) => {
      if (group.applicable_group_id && group.group_id) {
        groupIdToApplicableGroupIdMap[group.group_id] = group.applicable_group_id;
      }

      if (group.criteria && Array.isArray(group.criteria)) {
        group.criteria.forEach((criteria: any) => {
          flattenedCriteria.push({
            ...criteria,
            group_id: group.group_id,
            group_value: group.group_value,
            applicable_group_id: group.applicable_group_id
          });
        });
      }
    });

    return { flattenedCriteria, groupIdToApplicableGroupIdMap };
  }, []);

  // Combined function to process criteria evaluations: flatten → transform → update
  // This eliminates duplication between loadCriteriaEvaluations and loadCriteriaStatuses
  const processCriteriaEvaluationsToFlatData = useCallback((
    criteriaEvaluations: any[]
  ): VendorCriteria[] => {
    const { flattenedCriteria, groupIdToApplicableGroupIdMap } = flattenCriteriaEvaluations(criteriaEvaluations);
    const flatData = transformCriteriaToFlat(flattenedCriteria);
    return updateFlatDataWithApplicableGroupId(flatData, groupIdToApplicableGroupIdMap);
  }, [flattenCriteriaEvaluations, transformCriteriaToFlat, updateFlatDataWithApplicableGroupId]);

  // Helper function to load criteria evaluations
  const loadCriteriaEvaluations = useCallback((data: any): void => {
    if (data.flat_criteria_data && Array.isArray(data.flat_criteria_data) && data.flat_criteria_data.length > NUMBERMAP.ZERO) {
      setFlatCriteriaData(data.flat_criteria_data);
      return;
    }

    const criteriaEvaluations = data.criteria_evaluations;
    if (!criteriaEvaluations || !Array.isArray(criteriaEvaluations) || criteriaEvaluations.length === NUMBERMAP.ZERO) {
      return;
    }

    const updatedFlatData = processCriteriaEvaluationsToFlatData(criteriaEvaluations);
    setFlatCriteriaData(updatedFlatData);
  }, [processCriteriaEvaluationsToFlatData]);

  // Helper function to load criteria statuses
  const loadCriteriaStatuses = useCallback((data: any, criteriaEvaluations: any[]): void => {
    if (data.criteria_statuses && typeof data.criteria_statuses === 'object') {
      const initialStatuses: Record<string, string> = {};
      Object.keys(data.criteria_statuses).forEach(key => {
        const value = data.criteria_statuses[key];
        if (value !== null && value !== undefined) {
          initialStatuses[key] = String(value);
        }
      });
      setCriteriaStatuses(initialStatuses);
      return;
    }

    if (!criteriaEvaluations || !Array.isArray(criteriaEvaluations) || criteriaEvaluations.length === NUMBERMAP.ZERO) {
      return;
    }

    const updatedFlatDataForStatus = processCriteriaEvaluationsToFlatData(criteriaEvaluations);

    const initialStatuses: Record<string, string> = {};
    updatedFlatDataForStatus.forEach((item: VendorCriteria) => {
      if (item.status !== null && item.status !== undefined) {
        initialStatuses[item.id] = String(item.status);
      }
    });

    setCriteriaStatuses(initialStatuses);
  }, [processCriteriaEvaluationsToFlatData]);

  // Load data when component mounts or data changes
  useEffect(() => {
    if (!vendorEvaluationData?.data) {
      return;
    }

    const dataArray = normalizeDataArray(vendorEvaluationData.data);
    if (dataArray.length === NUMBERMAP.ZERO) {
      return;
    }

    const data = dataArray[NUMBERMAP.ZERO];
    const vendorIdValue = extractVendorId(data, dataArray, vendorEvaluationData);
    if (vendorIdValue !== null) {
      setVendorId(vendorIdValue);
    }

    setFormData(createInitialFormData(data));

    const documents = data.documents ?? data.vendor_evaluation_supporting_files;
    if (documents && Array.isArray(documents)) {
      setUploadedDocuments(documents as unknown as FileDocument[]);
    }

    const parentRowFilesMap = loadParentRowFiles(data.criteria_evaluations);
    if (Object.keys(parentRowFilesMap).length > NUMBERMAP.ZERO) {
      setParentRowFiles(parentRowFilesMap);
    }

    const criteriaEvaluations = data.criteria_evaluations;
    loadCriteriaEvaluations(data);
    loadCriteriaStatuses(data, criteriaEvaluations);

    if (criteriaEvaluations && Array.isArray(criteriaEvaluations) && criteriaEvaluations.length > NUMBERMAP.ZERO) {
      const criteriaEvaluationsFormData = createCriteriaEvaluationsFormData(criteriaEvaluations);
      setFormData(prev => ({
        ...prev,
        criteria_evaluations: criteriaEvaluationsFormData
      }));
    }
  }, [vendorEvaluationData, createCriteriaEvaluationsFormData, normalizeDataArray, extractVendorId, createInitialFormData, loadParentRowFiles, loadCriteriaEvaluations, loadCriteriaStatuses]);

  // Update hasEditPermission based on isCreateMode and permissions
  useEffect(() => {
    const permissions = vendorEvaluationData?.meta_info?.action_control?.permissions ?? [];
    if (isCreateMode) {
      setHasEditPermission(true);
    } else {
      // Use standard permission check utility function
      const { hasEditPermission: editPermission } = processButtonsWithPermissions(permissions, {});
      setHasEditPermission(editPermission);
    }
  }, [isCreateMode, vendorEvaluationData]);

  // Create vendor visit data from form data observations
  const getVendorVisitData = useMemo(() => {
    const allObservations = [
      { id: 'design-1', area: OBSERVATION_AREAS.DESIGN, observation: formData.design_observation },
      { id: 'manufacturing-1', area: OBSERVATION_AREAS.MANUFACTURING, observation: formData.manufacturing_observation },
      { id: 'quality-1', area: OBSERVATION_AREAS.QUALITY_CONTROL, observation: formData.quality_control_observation },
      { id: 'logistics-1', area: OBSERVATION_AREAS.LOGISTICS, observation: formData.logistics_observation },
      { id: 'support-1', area: OBSERVATION_AREAS.CUSTOMER_SUPPORT, observation: formData.customer_support_observation }
    ];
    return allObservations;
  }, [formData.design_observation, formData.manufacturing_observation, formData.quality_control_observation, formData.logistics_observation, formData.customer_support_observation]);

  const vendorVisitColumns: GridColDef[] = useMemo(() => [
    { field: "area", headerName: "Areas", flex: NUMBERMAP.ONE },
    {
      field: "observation",
      headerName: "Observation",
      flex: NUMBERMAP.FOUR,
      renderCell: (params) => (
        <Box sx={{ width: "100%", marginBottom: "10px" }}>
          <Description
            label=""
            placeholder={"Observation"}
            value={params.row.observation ?? ""}
            onChange={(value: string) => {
              const id = params.row.id;
              const [type] = id.split('-');

              // Map the parsed type to the correct form field name
              let observationType: string;
              switch (type) {
                case 'design':
                  observationType = 'design_observation';
                  break;
                case 'manufacturing':
                  observationType = 'manufacturing_observation';
                  break;
                case 'quality':
                  observationType = 'quality_control_observation';
                  break;
                case 'logistics':
                  observationType = 'logistics_observation';
                  break;
                case 'support':
                  observationType = 'customer_support_observation';
                  break;
                default:
                  observationType = `${type}_observation`;
              }

              handleObservationChange(observationType, value);
            }}
            disabled={!hasEditPermission}
          />
        </Box>
      )
    }
  ], [handleObservationChange, hasEditPermission]);

  const buttonConfig = useMemo(() => [
    { label: 'Cancel', onClick: handleCancel },
    { label: 'Save', onClick: handleSave, disabled: isLoading ?? isDataLoading }
  ], [handleCancel, handleSave, isLoading, isDataLoading]);

  const updateCriteriaEvaluations = useCallback((prev: CriteriaEvaluationItem[], numericId: number, value: string) => {
    return prev.map(item =>
      item.vendor_group_criteria_mapper_id === numericId
        ? { ...item, remarks: value }
        : item
    )
  }, [])

  const handleOpenModal = useCallback((parentRowId: string) => {
    setSelectedParentRowId(parentRowId);
    setCurrentFinalFileData(parentRowFileData[parentRowId])
    setCurrentParentRowFileData([...(parentRowFiles[parentRowId] ?? [])])
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedParentRowId(null);
    setIsModalOpen(false);
  }, []);

  const commonRemarkField = (row: VendorCriteria, isParent: boolean) => {
    const rowWithRemarks = row as VendorCriteria & { remarks?: string };
    return (<InputField
      label=""
      value={rowWithRemarks.remarks ?? ''}
      onChange={(value: string) => {
        const updatedData = flatCriteriaData.map(item =>
          item.id === row.id
            ? { ...item, remarks: value } as VendorCriteria & { remarks?: string }
            : item
        );
        setFlatCriteriaData(updatedData);

        // Update form data criteria_evaluations for parent rows
        const numericId = parseInt((row.id as string).replace(isParent ? 'parent_' : 'child_', ''));
        setFormData(prev => {
          return {
            ...prev,
            criteria_evaluations: updateCriteriaEvaluations(prev.criteria_evaluations, numericId, value)
          };
        });
      }}
      placeholder="Enter remarks..."
      disabled={!hasEditPermission}
    />)
  };

  const handleParentRowFileUpload = useCallback((newFile: File | FileData) => {
    if (!selectedParentRowId) return;
    setCurrentParentRowFileData((prev) => ([...(prev ?? []), newFile]))
  }, [selectedParentRowId]);

  const handleParentRowFileEdit = useCallback((updatedFile: File | FileData) => {
    if (!selectedParentRowId) return;
    setCurrentParentRowFileData((prev) => {
      let updatedFiles = [...(prev ?? [])].map((file: any) => {
        const fileId = file.file_id ?? file.id;
        const updatedId = (updatedFile as any).file_id ?? (updatedFile as any).id;
        return fileId === updatedId ? { ...file, ...updatedFile } : file;
      }) as File[] | FileDocument[]
      return updatedFiles
    })
  }, [selectedParentRowId]);

  const handleParentRowFileSave = () => {
    if (!selectedParentRowId) return;
    // The file data is already updated via onSubmit callback
    let parentRow = [...currentParentRowFileData]
    parentRow = parentRow?.filter((refile) => !currentFinalFileData?.local_files_to_delete?.includes(refile?.file?.name.split('.')[NUMBERMAP.ZERO]))
    setParentRowFileData((prev) => ({ ...prev, [selectedParentRowId]: currentFinalFileData }))
    setParentRowFiles((prev) => ({ ...prev, [selectedParentRowId]: parentRow }))
    // Here we can add any additional save logic if needed
    handleCloseModal();
  };

  const renderCellRemarks = useCallback((isParent: boolean, row: VendorCriteria) => {

    if (isParent) {
      // Show "View/Upload Files" link for parent rows
      return (
        <Typography
          sx={{
            ...downloadStyles.title,
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
          onClick={(e) => {
            if (!hasEditPermission) return;
            e.preventDefault();
            handleOpenModal(row.id as string);
          }}
        >
          View/Upload Files
        </Typography>
      );
    }

    return commonRemarkField(row, false);
  }, [commonRemarkField, handleOpenModal, hasEditPermission])
  const criteriaColumnRenderCell = useCallback((params: any) => {
    const row = params.row as VendorCriteria;
    const isParent = (row as any).isParent;
    return <Box sx={{
      pl: isParent ? NUMBERMAP.ZERO : NUMBERMAP.TWO
    }}>
      {params.value}
    </Box>;
  }, [])
  const columns = useMemo(() => [
    ...COMMON_COLUMNS(criteriaColumnRenderCell),
    {
      field: 'status',
      headerName: 'Status',
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        const row = params.row as VendorCriteria;
        const isParent = (row as any).isParent;
        if (isParent) {
          // If parent has status data, show radio buttons, otherwise show empty
          if (row.status !== undefined && row.status !== null) {
            return (
              <RadioButtonGroup
                name={`criteria-${params.row.id}`}
                label=""
                options={statusOptions}
                value={criteriaStatuses[params.row.id] ?? row.status ?? ""}
                onChange={(value: string | number) => handleCriteriaStatusChange(params.row.id, String(value))}
                disabled={!hasEditPermission}
              />
            );
          }
          return ''
        }

        return (
          <RadioButtonGroup
            name={`criteria-${params.row.id}`}
            label=""
            options={statusOptions}
            value={criteriaStatuses[params.row.id] ?? ""}
            onChange={(value: string | number) => handleCriteriaStatusChange(params.row.id, String(value))}
            disabled={!hasEditPermission}
          />
        );
      },
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        const row = params.row as VendorCriteria;
        const isParent = (row as any).isParent;
        return renderCellRemarks(isParent, row);
      },
    }
  ], [statusOptions, criteriaStatuses, handleCriteriaStatusChange, renderCellRemarks, hasEditPermission])

  return (
    <FormContainer>
      <FormWrapper>
        <Box>
          <Label title="Vendor Evaluation" />
        </Box>
        <FormContent>
          <>
            {/* Basic Information Section */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField
                  value={(vendorEvaluationData?.data as any)?.[NUMBERMAP.ZERO]?.vendor_name ?? "Vendor Name"}
                  label={'Vendor Name'}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField
                  value={(vendorEvaluationData?.data as any)?.[NUMBERMAP.ZERO]?.part_category_name ?? "Product Generic Name"}
                  label={'Product Generic Name'}
                />
              </Grid2>
            </Grid2>
            {/* Vendor Criteria Evaluation Section - Updated */}
            <Grid2 container sx={STYLE5}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <VendorSelectionCriteriaTable
                  criteria={flatCriteriaData ?? []}
                  onCriteriaReorder={handleCriteriaChange}
                  title="Vendor Criteria Evaluation"
                  showAddButton={false}
                  loading={isLoading}
                  enableDragDrop={false}
                  orderField="order"
                  columns={columns}
                />
              </Grid2>
              <ErrorText>{errors?.criteriaStatuses ?? ''}</ErrorText>
            </Grid2>
            {/* Vendor Visit Section */}

            <Grid2 container sx={STYLE5}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <DataGridTable
                  title="Vendor List"
                  rows={getVendorVisitData}
                  columns={vendorVisitColumns}
                  idField="id"
                  hideFooter
                />
              </Grid2>
            </Grid2>

            {/* Audit Conclusion Section */}
            <Grid2 container sx={STYLE5}>
              <Grid2 size={NUMBERMAP.SIX}>
                <RichTextEditor
                  label={FORM_LABELS.AUDIT_CONCLUSION}
                  value={formData.audit_conclusion}
                  onChange={(value) => handleInputChange('audit_conclusion', value)}
                  placeholder="Input Text"
                  disabled={!hasEditPermission}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <FileUploadManager
                  initialFiles={uploadedDocuments}
                  onFileUpload={handleFileUpload}
                  onFileEdit={handleFileEdit}
                  onSubmit={(data) => setFinalFileData((prev) => mergeFinalFileData(prev, data))}
                  subHeader={FILE_UPLOAD_SUB_HEADER}
                  hasEditable={!hasEditPermission}
                />
              </Grid2>
            </Grid2>
          </>
        </FormContent>
        <CommentsHistoryContainer>
              <CommentsHistory
                comments={vendorEvaluationData?.meta_info?.task_info?.task_comments}
              />
            </CommentsHistoryContainer>

            <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
              {resolvedParams ? (
                <VendorReviewerModalManager
                  isLoading={isDataLoading}
                  permissions={vendorEvaluationData?.meta_info?.action_control?.permissions ?? []}
                  taskInfo={{
                    task_comments: vendorEvaluationData?.meta_info?.task_info?.task_comments ?? [],
                    reviewer_list: vendorEvaluationData?.meta_info?.task_info?.reviewer_list ?? []
                  }}
                  refetch = {refetchEvaluation}
                  menuId={vendorEvaluationData?.meta_info?.action_control?.menuId}
                  menuName={vendorEvaluationData?.meta_info?.action_control?.formName}
                  contextType="vendor_evaluation"
                  contextId={resolvedParams}
                  customHandlers={{
                    handleCancel: handleCancel,
                    handleSave: handleSave,
                    isDisabled: isLoading ?? isDataLoading
                  }}
                  onPermissionChange={setHasEditPermission}
                />
              ) : (
                <ButtonGroup buttons={buttonConfig} />
              )}
            </Grid2>
      </FormWrapper>
      {/* Modal for parent row file upload */}
      <CommonModal
        open={isModalOpen}
        title="View/Upload Files"
        onClose={handleCloseModal}
      >
        <CommonModalScroll>
          <FileUploadManager
            initialFiles={selectedParentRowId ? (parentRowFiles[selectedParentRowId] ?? []) : []}
            onFileUpload={handleParentRowFileUpload}
            onFileEdit={handleParentRowFileEdit}
            onSubmit={(data) => {
              setCurrentFinalFileData((prev) => mergeFinalFileData({ ...(prev ?? FINALFILEINITIALDATA) }, data))
            }}
            subHeader={FILE_UPLOAD_SUB_HEADER}
            hasEditable={!hasEditPermission}
          />
          <ButtonGroup
            buttons={[
              {
                label: BUTTON_LABEL.CANCEL,
                onClick: handleCloseModal,
              },
              {
                label: BUTTON_LABEL.SAVE,
                onClick: handleParentRowFileSave,
              },
            ]}
          />
        </CommonModalScroll>
      </CommonModal>
    </FormContainer>
  );
};

export default VendorEvaluationForm;
