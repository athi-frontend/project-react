"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Grid2, Box, Typography } from "@mui/material";
import { RichTextEditor, InputField, DataTable, ButtonGroup, Label, RadioButtonGroup, DataGridTable, Description, showActionAlert, ActionButton } from "@/components/ui";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FINALFILEINITIALDATA, NUMBERMAP } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import { ButtonContainer } from "@/styles/components/ui/button";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import QualityIssueModal from "@/components/modules/vendor-management/vendor-re-evaluation/QualityIssueModal";
import UploadDocumentModal from "@/components/modules/vendor-management/vendor-re-evaluation/UploadDocumentModal";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import { useAllVendorTypes, useAllVendors } from "@/hooks/modules/vendor-management/useCommonDropdown";
import { useVendorReEvaluationById, useUpsertVendorReEvaluation, useVendorReEvaluationCriteriaDetails } from "@/hooks/modules/vendor-management/useVendorReEvaluation";
import { useVendorById } from "@/hooks/modules/vendor-management/useVendorList";
import { useOrganizationStatus } from "@/hooks/useCommonDropdown";
import { convertUtcToLocal, FinalFileData, mergeFinalFileData, stripHtml } from "@/lib/utils/common";
import { calculateEvaluationToDate } from "@/lib/modules/vendor-management/vendorReEvaluation";
import { FileData, FileDocument } from "@/types/components/ui/fileUploadV3";
import { useParams, useRouter } from "next/navigation";
import { VendorReEvaluationFormData, ReEvaluationCriteriaItem, QualityIssueData, ExtendedFinalFileData } from "@/types/modules/vendor-management/vendorReEvaluation";
import {
  INITIAL_FORM_DATA,
  STATUS_OPTIONS,
  RATING_OPTIONS,
  OBSERVATION_TYPE_MAP,
  VENDOR_VISIT_AREAS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORMDATA_FIELDS,
  DOCUMENT_METADATA_KEYS,
  STATUS_VALUES,
  ID_PREFIXES,
  BUTTON_LABELS,
  COLUMN_HEADERS,
  VENDOR_RE_EVALUATION_CONSTANTS,
  TABLE_FIELD_NAMES,
  DROPDOWN_FIELDS,
  VALIDATION_ERROR_MESSAGES,
  VENDOR_REEVALUATION_HINTS,
  CRITERIA_COLUMNS,
  fieldsToValidation
} from "@/constants/modules/vendor-management/vendorReEvaluation";
import { downloadStyles } from "@/styles/components/ui/datatable";
import { ErrorText } from "@/styles/common";
import { EmptyTableCell, SnoTableCell } from "@/styles/modules/vendor-management/vendorSelectionCriteria";
import { RATING_CELL_STYLE, OVERALL_RATING_CELL_STYLE } from "@/styles/modules/vendor-management/vendorReEvaluationCriteria";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import VendorSelectionCriteriaCommonTable from "@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaCommonTable";
import { VendorCriteria } from "@/components/modules/vendor-management/vendor-selection-criteria/types";
import VendorReviewerModalManager from "@/components/modules/vendor-management/reviewer-modal/VendorReviewerModalManager";
import CommentsHistory from '@/components/ui/comments-history/Comments';
import { transformNestedHierarchicalData } from "@/lib/modules/vendor-management/transformNestedHierarchicalData";

/**
 * Classification : Confidential
 **/

const VendorReEvaluationForm: React.FC = () => {
  const { id } = useParams();
  const resolvedParams = Number(id);
  const router = useRouter();


  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null)
  const [selectedVendorTypeId, setSelectedVendorTypeId] = useState<number | null>(null)
  const [selectedPartCategoryId, setSelectedPartCategoryId] = useState<number | null>(null)
  const { data: vendorTypes } = useAllVendorTypes()
  const { data: statusData } = useOrganizationStatus()
  const [hasEditPermission, setHasEditPermission] = useState(true);
  const { data: vendors, refetch } = useAllVendors(
    NUMBERMAP.ONE,
    selectedVendorTypeId && selectedVendorTypeId > NUMBERMAP.ZERO ? selectedVendorTypeId : undefined,
    !!selectedVendorTypeId && selectedVendorTypeId > NUMBERMAP.ZERO
  )
  const { data: vendorData } = useVendorById(selectedVendorId?.toString() ?? "", !!selectedVendorId && selectedVendorId > NUMBERMAP.ZERO)

  const partCategoryData = useMemo(() => {
    if (vendorData?.data && Array.isArray(vendorData.data) && vendorData.data.length > NUMBERMAP.ZERO) {
      return vendorData.data[NUMBERMAP.ZERO]?.part_categories ?? []
    }
    return []
  }, [vendorData])
  const { data: vendorReEvaluationData, isLoading: isDataLoading, refetch: refetchReEvaluation } = useVendorReEvaluationById(String(resolvedParams), !!resolvedParams);
  const upsertVendorReEvaluationMutation = useUpsertVendorReEvaluation();
  useEffect(() => {
    if (selectedVendorTypeId) {
      refetch();
    }
  }, [selectedVendorTypeId, refetch]);
  const [formData, setFormData] = useState<VendorReEvaluationFormData>(INITIAL_FORM_DATA);


  const [criteriaStatuses, setCriteriaStatuses] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isQualityIssueModalOpen, setIsQualityIssueModalOpen] = useState(false);
  const [editingQualityIssue, setEditingQualityIssue] = useState<QualityIssueData | null>(null);
  const [qualityIssues, setQualityIssues] = useState<QualityIssueData[]>([]);
  const [isUploadDocumentModalOpen, setIsUploadDocumentModalOpen] = useState(false);
  const [flatCriteriaData, setFlatCriteriaData] = useState<VendorCriteria[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[] | FileDocument[]>([]);
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const [groupFileData, setGroupFileData] = useState<Record<number, ExtendedFinalFileData>>({});
  // Map group_id to the correct mapper ID for payload
  const [selectedGroupFiles, setSelectedGroupFiles] = useState<File[] | FileDocument[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  //part category mapper id for the page
  const [mapperId, setMapperId] = useState<number | undefined>()
  const [showFileValidationError, setShowFileValidationError] = useState(false);

  // Fetch vendor details when vendor is selected
  const { data: vendorDetailsData } = useVendorById(
    selectedVendorId?.toString() ?? "",
    !!selectedVendorId && selectedVendorId > NUMBERMAP.ZERO
  );

  // Fetch vendor re-evaluation criteria when part category is selected
  const { data: criteriaDetailsData } = useVendorReEvaluationCriteriaDetails(
    selectedPartCategoryId, !!selectedPartCategoryId
  );

  const transformConfig = useMemo(() => ({
    groupIdField: 'group_id',
    groupNameField: 'group_name',
    groupOrderField: 'applicable_group_display_order',
    criteriaArrayField: 'criteria',
    childIdField: 'criteria_mapper_id',
    childNameField: 'sub_group_value',
    childOrderField: 'display_order',
    parentIdPrefix: 'parent_',
    childIdPrefix: 'child_',
    fieldMappings: {
      criteria: 'criteria_name',
      requirement: 'requirement_type_name',
      requirementId: 'requirement_type',
      category: 'group_value',
      status: 'status',
      remarks: 'remarks',
    },
  }), [])

  // Load data when component mounts or data changes (only once)
  useEffect(() => {
    if (vendorReEvaluationData?.data && Array.isArray(vendorReEvaluationData.data) && vendorReEvaluationData.data.length > NUMBERMAP.ZERO) {
      const data = vendorReEvaluationData.data[NUMBERMAP.ZERO];

      const vendorTypeId = data.vendor_type_id ?? NUMBERMAP.ZERO;
      const vendorId = data.vendor_id ?? NUMBERMAP.ZERO;
      // part_category_mapper_id might not be in the API response, use vendor_id as fallback or check if it exists
      const partCategoryMapperId = (data as any).part_category_id ?? data.vendor_id ?? NUMBERMAP.ZERO;

      setFormData({
        vendor_reevaluation_id: data.vendor_reevaluation_id,
        vendor_type_id: vendorTypeId,
        vendor_id: vendorId,
        part_category_mapper_id: partCategoryMapperId,
        re_evaluated_date: data.last_reevaluation,
        evaluation_from_date: data.from_date,
        evaluation_to_date:data.to_date,
        reevaluation_criteria: [],
        quality_rating: data.quality_rating ?? NUMBERMAP.ZERO,
        delivery_rating: data.delivery_rating ?? NUMBERMAP.ZERO,
        supporting_rating: data.support_rating ?? NUMBERMAP.ZERO,
        overall_rating: data.overall_rating ?? NUMBERMAP.ZERO,
        design_observation: data.design_observation ?? "",
        manufacturing_observation: data.manufacturing_observation ?? "",
        quality_control_observation: data.quality_control_observation ?? "",
        logistics_observation: data.logistics_observation ?? "",
        customer_support_observation: data.customer_support_observation ?? "",
        conculation: data.conclusion ?? "",
        response_quality_issues: data.response_quality_issues?.map((issue: any) => ({
          evaluation_issue_response_id: issue.evaluation_issue_response_id,
          serial_number: issue.serial_number ?? "",
          issue_raised: issue.issues_raised ?? "",
          resolution: issue.resolution ?? "",
          effectiveness: issue.effectiveness ?? "",
          status: issue.status,
        })) ?? [],
        re_evaluation_conclusion: data.conclusion_audit ?? "",
        status: data.status ?? NUMBERMAP.ONE,
      });

      // Set selected IDs for cascading dropdowns
      setSelectedVendorTypeId(vendorTypeId);
      setSelectedVendorId(vendorId);
      setSelectedPartCategoryId(partCategoryMapperId);


      // Set quality issues
      if (data.response_quality_issues && Array.isArray(data.response_quality_issues)) {
        const issues = data.response_quality_issues.map((issue: any, index: number) => ({
          id: `${ID_PREFIXES.QUALITY_ISSUE}${index}`,
          serial_number: issue.serial_number ?? "",
          issue_raised: issue.issues_raised ?? "",
          resolution: issue.resolution ?? "",
          effectiveness: issue.effectiveness ?? "",
          status: issue.status,
          evaluation_issue_response_id: issue.evaluation_issue_response_id,
        }));
        setQualityIssues(issues);
      }

      const criteriadatas = [...data.vendor_reevaluation_criteria]
      let criteriaStatusUpdate = {}
      criteriadatas?.forEach((childs) => {
        childs?.criteria_details?.forEach((criteria) => {
          criteriaStatusUpdate ={...criteriaStatusUpdate,[criteria?.re_evaluation_group_criteria_mapper_id]: criteria?.selection_status}
        })
      })
      setCriteriaStatuses(criteriaStatusUpdate)

      setFlatCriteriaData([...data.vendor_reevaluation_criteria]);

      // Initialize criteriaStatuses from loaded data
      // Handle both nested and flat structures
      const initialStatuses: Record<string, string> = {};
      const processCriteriaData = (items: any[]) => {
        items.forEach((item: any) => {
          // Check if item has criteria_id and status/selection_status
          if (item.criteria_id) {
            const status = item.status ?? item.selection_status;
            if (status !== undefined && status !== null) {
              initialStatuses[item.criteria_id] = status;
            }
          }
          // Recursively process nested structures
          if (item.criteria_details && Array.isArray(item.criteria_details)) {
            processCriteriaData(item.criteria_details);
          }
          if (item.criteria && Array.isArray(item.criteria)) {
            processCriteriaData(item.criteria);
          }
        });
      };

      if (data.vendor_reevaluation_criteria && Array.isArray(data.vendor_reevaluation_criteria)) {
        processCriteriaData(data.vendor_reevaluation_criteria);
      }
    }
  }, [vendorReEvaluationData]);

  // Handle uploaded documents 
  useEffect(() => {
    if (vendorReEvaluationData?.data && Array.isArray(vendorReEvaluationData.data) && vendorReEvaluationData.data.length > NUMBERMAP.ZERO) {
      const data = vendorReEvaluationData.data[NUMBERMAP.ZERO];
      // Set uploaded documents if available
      if (data.documents && Array.isArray(data.documents)) {
        setUploadedDocuments(data.documents as unknown as FileDocument[]);
      }
    }
  }, [vendorReEvaluationData]);

  // Transform criteria data to flat structure for new API response format
  // cons = useCallback((criteriaGroups: any[], supportingFiles: any[] = []) => {
  //   return transformCriteriaToFlat(criteriaGroups, supportingFiles);
  // }, []);

  // Load criteria when part category changes
  useEffect(() => {
    if (criteriaDetailsData?.data && Array.isArray(criteriaDetailsData.data) && criteriaDetailsData.data.length > NUMBERMAP.ZERO && formData.vendor_reevaluation_id === 0) {
      const data = criteriaDetailsData.data[NUMBERMAP.ZERO];
      // Transform criteria_details to the format expected by the table
      // New API structure: criteria_details is an array of groups, each group has a criteria array
      if (data.criteria_details && Array.isArray(data.criteria_details) && data.criteria_details.length > NUMBERMAP.ZERO) {

        setFlatCriteriaData([...data.criteria_details]);

        // Don't initialize criteriaStatuses for new records - radio buttons should be empty
        // setCriteriaStatuses({});

        // Initialize group file data - store applicable_group_files per group


        // Initialize reevaluation_criteria with all child criteria items
        // Set selection_status to null if not selected
        const initialCriteria: ReEvaluationCriteriaItem[] = [];

        setFormData(prev => ({
          ...prev,
          reevaluation_criteria: initialCriteria,
        }));
      } else {
        // If criteria_details is empty, clear the table
        setFlatCriteriaData([]);
        setCriteriaStatuses({});
        setGroupFileData({});
        setFormData(prev => ({
          ...prev,
          reevaluation_criteria: [],
        }));
      }
    }
  }, [criteriaDetailsData]);


  // Load vendor details and populate dates when part category is selected
  useEffect(() => {
    // Only update date when a part category is specifically selected
    if (vendorDetailsData?.data && Array.isArray(vendorDetailsData.data) && vendorDetailsData.data.length > NUMBERMAP.ZERO && selectedPartCategoryId) {
      const vendorData = vendorDetailsData.data[NUMBERMAP.ZERO];
      const partCategories = (vendorData as any)?.part_categories ?? [];

      // Find the matching part category based on the selected part category ID
      // The dropdown uses keyField="part_category_id", so selectedPartCategoryId matches cat.part_category_id
      const matchingCategory = partCategories.find((cat: any) =>
        cat.part_category_id === selectedPartCategoryId
      );

      if (matchingCategory?.last_evaluated_date) {
        const lastReevaluation = matchingCategory.last_evaluated_date;
        const frequencyName = (vendorData as any)?.vendor_reevaluation_frequency_name;

        // Update the last reevaluation date and calculate the evaluation to date
        setFormData(prev => ({
          ...prev,
          re_evaluated_date: lastReevaluation,
          evaluation_from_date: lastReevaluation,
          evaluation_to_date: frequencyName
            ? calculateEvaluationToDate(lastReevaluation, frequencyName)
            : prev.evaluation_to_date
        }));
      }
    }
  }, [vendorDetailsData, selectedPartCategoryId]);

  useEffect(() => {

    if (!Array.isArray(vendorData?.data) || !vendorData.data.length || !selectedPartCategoryId) {
      return;
    }

    const vendor = vendorData.data[0];
    if (!Array.isArray(vendor?.part_categories)) {
      return;
    }

    const matchedPartCategory = vendor.part_categories.find(
      (cat: any) => cat.part_category_id === selectedPartCategoryId
    );

    if (!matchedPartCategory?.id) {
      return;
    }

    const mapperIdValue = typeof matchedPartCategory.id === 'number'
      ? matchedPartCategory.id
      : Number(matchedPartCategory.id);

    if (!isNaN(mapperIdValue)) {
      setMapperId(mapperIdValue);
    }
  }, [vendorData, selectedPartCategoryId])

  const handleInputChange = (field: string, value: string | number) => {
    // Clear error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof typeof errors];
        return newErrors;
      });
    }

    // Clear performance_ratings error when any rating is changed
    if ((field === 'quality_rating' || field === 'delivery_rating' || field === 'supporting_rating') && errors.performance_ratings) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.performance_ratings;
        return newErrors;
      });
    }

    // Clear overall_score error when any rating is changed
    if ((field === FORMDATA_FIELDS.QUALITY_RATING || field === FORMDATA_FIELDS.DELIVERY_RATING || field === FORMDATA_FIELDS.SUPPORTING_RATING) && errors.overall_score) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.overall_score;
        return newErrors;
      });
    }

    if (field === 'vendor_type_id') {
      const numValue = typeof value === 'string' ? parseInt(value) ?? NUMBERMAP.ZERO : value;
      setSelectedVendorTypeId(numValue > NUMBERMAP.ZERO ? numValue : null)
      // Reset vendor_id and part_category when vendor_type_id changes
      setFormData(prev => ({
        ...prev,
        [field]: numValue,

      }));
      setSelectedVendorId(null);
      setSelectedPartCategoryId(null);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (field === 'part_category_mapper_id') {
        setSelectedPartCategoryId(Number(value))
      }
      if (field === 'vendor_id') {
        setSelectedVendorId(Number(value))
      }
    }
  };

  const handleCriteriaStatusChange = (itemId: string, status: string) => {
    setCriteriaStatuses(prev => ({ ...prev, [itemId]: status }));

    // Clear QMS criteria group error when user selects a response
    if (errors.qms_criteria_group || errors.criteria_table) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.qms_criteria_group;
        delete newErrors.criteria_table;
        return newErrors;
      });
    }
  };



  const handleViewFiles = (groupId: number, files: any[]) => {
    setSelectedGroupId(groupId);

    // Get existing files from applicable_group_files only (passed from renderCell)
    const existingFiles = files ?? [];

    // Get group file data (includes existing files and local files)
    const groupData: ExtendedFinalFileData = groupFileData[groupId] ?? { ...FINALFILEINITIALDATA };
    const existingFilesFromGroup = groupData.existingFiles ?? [];

    // Merge existing files from API and from groupFileData (both should be applicable_group_files only)
    let allExistingFiles = [...existingFiles, ...existingFilesFromGroup];
    
    // Filter out deleted server files
    if (groupData.documents_to_delete && groupData.documents_to_delete.length > NUMBERMAP.ZERO) {
      allExistingFiles = allExistingFiles.filter((file: any) => {
        const fileId = (file as FileDocument)?.file_id ?? (file as FileDocument)?.id;
        return !groupData.documents_to_delete.includes(fileId);
      });
    }
    
    // Get local FileData objects (already have all properties)
    let localFileDataArray = groupData.fileDataArray ?? [];
    
    // Filter out deleted local files
    if (groupData.local_files_to_delete && groupData.local_files_to_delete.length > NUMBERMAP.ZERO) {
      localFileDataArray = localFileDataArray.filter((fileItem: FileData) => {
        const fileName = fileItem?.file?.name?.split('.')[NUMBERMAP.ZERO];
        return !groupData.local_files_to_delete.includes(fileName);
      });
    }
    
    // FileData objects already have: id, name, created_date, uploaded_date, etc.
    // Just ensure structure is correct
    const localFilesWithIds = localFileDataArray.map((fileItem: FileData) => ({
      ...fileItem,
    }));

    // Combine existing files and local FileData objects
    // Only applicable_group_files should be included, no documents fallback
    const allFiles = [...allExistingFiles, ...localFilesWithIds];
    setSelectedGroupFiles(allFiles as unknown as File[] | FileDocument[]);
    // Set current group file data for tracking deletions
    setIsUploadDocumentModalOpen(true);
  };

  const handleCloseUploadDocumentModal = () => {
    setIsUploadDocumentModalOpen(false);
    setSelectedGroupFiles([]);
    setSelectedGroupId(null);
  };



  const handleQualityIssueSave = (formData: any) => {
    // Clear response_quality_issues error when a quality issue is added/updated
    if (errors.response_quality_issues) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.response_quality_issues;
        return newErrors;
      });
    }

    if (editingQualityIssue) {
      // Update existing issue
      setQualityIssues(prev =>
        prev.map(issue =>
          issue.id === editingQualityIssue.id
            ? {
              ...issue,
              serial_number: formData.sl_no_of_part_product,
              issue_raised: formData.issue_raised_and_data,
              resolution: formData.resolution_and_data,
              effectiveness: formData.effectiveness,
            }
            : issue
        )
      );
    } else {
      // Add new issue
      const newIssue: QualityIssueData = {
        id: `${ID_PREFIXES.QUALITY_ISSUE}${Date.now()}`,
        serial_number: formData.sl_no_of_part_product,
        issue_raised: formData.issue_raised_and_data,
        resolution: formData.resolution_and_data,
        effectiveness: formData.effectiveness,
        status: STATUS_VALUES.ACTIVE,
      };
      setQualityIssues(prev => [...prev, newIssue]);
    }

    setIsQualityIssueModalOpen(false);
    setEditingQualityIssue(null);
  };

  const handleAddQualityIssue = () => {
    setEditingQualityIssue(null);
    setIsQualityIssueModalOpen(true);
  };

  const handleQualityIssueDelete = async (issueId: string) => {

    const result = await showActionAlert('delete');
    if (!result.isConfirmed) return;
    // Find the issue to check if it's local or existing
    const issueToDelete = qualityIssues.find(issue => issue.id === issueId);

    if (issueToDelete) {
      // If it's a local/new issue (not yet saved), remove it completely
      if (!issueToDelete.evaluation_issue_response_id) {
        setQualityIssues(prev =>
          prev.filter(issue => issue.id !== issueId)
        );
      } else {
        // For existing records, set status to 0
        setQualityIssues(prev =>
          prev.map(issue =>
            issue.id === issueId
              ? { ...issue, status: STATUS_VALUES.INACTIVE }
              : issue
          )
        );

        // Update formData for existing records
        setFormData(prev => ({
          ...prev,
          response_quality_issues: prev.response_quality_issues.map(issue =>
            issue.evaluation_issue_response_id === issueToDelete.evaluation_issue_response_id
              ? { ...issue, status: STATUS_VALUES.INACTIVE }
              : issue
          )
        }));
      }
    }
  };

  const handleQualityIssueEdit = (issueId: string) => {
    const issueToEdit = qualityIssues.find(issue => issue.id === issueId);
    if (issueToEdit) {
      setEditingQualityIssue(issueToEdit);
      setIsQualityIssueModalOpen(true);
    }
  };


  const handleUploadDocumentSave = (fileData: FinalFileData & { fileDataArray?: FileData[] }, groupId?: number | null) => {
    if (groupId !== null && groupId !== undefined) {
      // Filter out deleted files from selectedGroupFiles (similar to vendor-evaluation pattern)
      let updatedGroupFiles = [...selectedGroupFiles];
      
      // Filter out local files that are marked for deletion
      if (fileData?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
        updatedGroupFiles = updatedGroupFiles.filter((refile: any) => {
          const fileName = refile?.file?.name?.split('.')[NUMBERMAP.ZERO];
          return !fileData.local_files_to_delete.includes(fileName);
        });
      }
      
      // Filter out server files that are marked for deletion
      if (fileData?.documents_to_delete?.length > NUMBERMAP.ZERO) {
        updatedGroupFiles = updatedGroupFiles.filter((refile: any) => {
          const fileId = (refile as FileDocument)?.file_id ?? (refile as FileDocument)?.id;
          return !fileData.documents_to_delete.includes(fileId);
        });
      }
      
      // Store files for a specific group
      setGroupFileData((prev) => {
        return {
          ...prev,
          [groupId]: fileData,
        };
      });
      
      // Update selectedGroupFiles with filtered files
      setSelectedGroupFiles(updatedGroupFiles);
    } else {
      // Store files for evaluation_supporting_files
      setFinalFileData((prev) => mergeFinalFileData(prev, fileData));
    }
  };

  const handleFileUpload = (newFile: File | FileData) => {
    setUploadedDocuments((prev) => [...prev, newFile] as File[] | FileDocument[]);
    // Clear error when file is uploaded (following clinical-evaluation pattern)
    setErrors((prev) => ({
      ...prev,
      documents: '',
    }));
  };

  const handleFileEdit = (updatedFile: File | FileData) => {
    setUploadedDocuments((prev) =>
      prev.map((file: any) => {
        const fileId = file.file_id ?? file.id;
        const updatedId = (updatedFile as any).file_id ?? (updatedFile as any).id;
        return fileId === updatedId ? { ...file, ...updatedFile } : file;
      }) as File[] | FileDocument[]
    );
  };

  // Handle file removal (following clinical-evaluation pattern)
  const handleFileRemove = (data: any) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setUploadedDocuments((prev) => {
        const updatedDocs = prev.filter((file) => {
          const fileName = (file)?.file?.name?.split('.')[NUMBERMAP.ZERO];
          return !data.local_files_to_delete.includes(fileName);
        });
        return updatedDocs;
      });
    }
   
    if (data?.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setUploadedDocuments((prev) => {
        const updatedDocs = prev.filter((file) => {
          const fileId = (file as FileDocument)?.file_id ?? (file as FileDocument)?.id;
          return !data.documents_to_delete.includes(fileId);
        });
        return updatedDocs;
      });
    }
  };

  const hasValidGroup = (criteria) =>
    criteria.group_mapper_id ?? criteria?.re_evaluation_applicable_group_id;
  
  const getCriteriaList = (criteria) =>
    criteria?.[id === 'create' ? 'criteria' : 'criteria_details'] ?? [];
  
  const hasCriteriaData = (criteria) =>
    criteria?.criteria?.length > NUMBERMAP.ZERO ||
    criteria?.criteria_details?.length > NUMBERMAP.ZERO;
  
  const isStatusMissing = (key) =>
    !Object.keys(criteriaStatuses).some((criId) => criId == key);
  
  const getCriteriaKey = (element) =>
    element.criteria_id ?? element.re_evaluation_group_criteria_mapper_id;
  
  const criteriaValidation = () => {
    const criteriaError = [];
  
    flatCriteriaData?.forEach((criteria) => {
      if (!hasValidGroup(criteria) || !hasCriteriaData(criteria)) return;
      getCriteriaList(criteria).forEach((element) => {
        const key = getCriteriaKey(element);
        if (isStatusMissing(key)) {
          criteriaError.push(key);
        }
      });
    });
    return criteriaError;
  };
  

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Vendor Type, Vendor Name, Part Category are mandatory
    if (!formData.vendor_type_id || formData.vendor_type_id === NUMBERMAP.ZERO) {
      newErrors.vendor_type_id = VALIDATION_ERROR_MESSAGES.VENDOR_TYPE_REQUIRED;
    }
    if (!formData.vendor_id || formData.vendor_id === NUMBERMAP.ZERO) {
      newErrors.vendor_id = VALIDATION_ERROR_MESSAGES.VENDOR_NAME_REQUIRED;
    }
    if (!formData.part_category_mapper_id || formData.part_category_mapper_id === NUMBERMAP.ZERO) {
      newErrors.part_category_mapper_id = VALIDATION_ERROR_MESSAGES.PART_CATEGORY_REQUIRED;
    }

    // 2. Status is mandatory
    if (!formData.status || formData.status === NUMBERMAP.ZERO) {
      newErrors.status = VALIDATION_ERROR_MESSAGES.STATUS_REQUIRED;
    }

    // 3. Performance Ratings must be selected before submission
    const hasAllRatings = formData.quality_rating && formData.quality_rating !== NUMBERMAP.ZERO &&
      formData.delivery_rating && formData.delivery_rating !== NUMBERMAP.ZERO &&
      formData.supporting_rating && formData.supporting_rating !== NUMBERMAP.ZERO;
    
    if (!hasAllRatings) {
      newErrors.performance_ratings = VALIDATION_ERROR_MESSAGES.PERFORMANCE_RATINGS_REQUIRED;
    }

    // 3.1. Validate minimum score requirement (10 out of 15) - only if all ratings are selected
    if (hasAllRatings) {
      const overallScore = formData.overall_rating ?? NUMBERMAP.ZERO;
      if (overallScore < NUMBERMAP.TEN) {
        newErrors.overall_score = VALIDATION_ERROR_MESSAGES.MINIMUM_SCORE_REQUIRED;
      }
    }

    // 4. All observations and conclusion fields must contain text before submission for review
    fieldsToValidation.forEach((field) => {
      const value = formData[field as keyof typeof formData]
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = VALIDATION_ERROR_MESSAGES[field as keyof typeof VALIDATION_ERROR_MESSAGES]
      }
    })
   

    // 5. Response to Quality Issues Raised During the Period is mandatory
    const activeQualityIssues = qualityIssues.filter(issue => issue.status === STATUS_VALUES.ACTIVE);
    if (activeQualityIssues.length === NUMBERMAP.ZERO) {
      newErrors.response_quality_issues = VALIDATION_ERROR_MESSAGES.RESPONSE_QUALITY_ISSUES_REQUIRED;
    }

    // Validate file upload (following clinical-evaluation pattern)
    if (
      !uploadedDocuments ||
      uploadedDocuments.length === NUMBERMAP.ZERO
    ) {
      newErrors.documents = VALIDATION_ERROR_MESSAGES.FILE_UPLOAD_REQUIRED;
    }
    if(criteriaValidation().length>NUMBERMAP.ZERO || flatCriteriaData.length==NUMBERMAP.ZERO){
        newErrors.criteria_table =flatCriteriaData.length==NUMBERMAP.ZERO?'Vendor Re-Evaluation Criteria is required':'Please select all statuses of the Vendor Re-evaluation criteria.';
    }
    setErrors(newErrors);

    setShowFileValidationError(true);

    return Object.keys(newErrors).length==NUMBERMAP.ZERO;
  };

  const handleSave = async () => {
    // Validate form before saving
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { create_meta_data: updatedCreateMetaData, documents_to_create: updatedDocumentsToCreate } = finalFileData;

    const formDataToSend = new FormData();

    // Collect all documents_to_create from groups and evaluation_supporting_files
    const allDocumentsToCreate: File[] = [...updatedDocumentsToCreate];

    // Add group files to documents_to_create
    Object.keys(groupFileData).forEach((groupId) => {
      const groupIdNum = Number(groupId);
      const groupData = groupFileData[groupIdNum];

      // Extract File objects from FileData objects
      const fileDataArray = groupData.fileDataArray ?? [];
      const filesFromFileData = fileDataArray
        .map((fileData: FileData) => fileData.file)
        .filter((file: File | null | undefined): file is File => file instanceof File);
      allDocumentsToCreate.push(...filesFromFileData);

      // Also check documents_to_create for backward compatibility
      if (groupData.documents_to_create && groupData.documents_to_create.length > 0) {
        allDocumentsToCreate.push(...groupData.documents_to_create);
      }
    });

    // Deduplicate files based on name, size, and lastModified
    const uniqueFiles = new Map<string, File>();
    allDocumentsToCreate.forEach((file) => {
      const fileKey = `${file.name}_${file.size}_${file.lastModified}`;
      if (!uniqueFiles.has(fileKey)) {
        uniqueFiles.set(fileKey, file);
      }
    });

    // Append all unique documents to create
    uniqueFiles.forEach((file) => {
      formDataToSend.append(FORMDATA_FIELDS.DOCUMENTS_TO_CREATE, file, file.name);
    });

    // Build create_meta_data with group files and overall files
    const createMetaData: any = {};

    // Add group files - use correct mapper ID based on whether it's existing or new record
    Object.keys(groupFileData).forEach((groupId) => {
      const groupIdNum = Number(groupId);
      const groupData = groupFileData[groupIdNum];
      if (groupData.create_meta_data && Object.keys(groupData.create_meta_data).length > 0) {
        // For existing records (fetch by id): use re_evaluation_applicable_group_id
        // For new records (criteriaDetails): use group_mapper_id (re_evaluation_applicable_group_id from criteriaDetails)
        // Both are stored in groupMapperIdMap, but the source differs

        // Use mapperId if available, otherwise fall back to groupId
        const keyToUse = groupIdNum;
        createMetaData[keyToUse] = groupData.create_meta_data;
      }
    });

    // Add overall evaluation files
    if (updatedCreateMetaData && Object.keys(updatedCreateMetaData).length > 0) {
      createMetaData[DOCUMENT_METADATA_KEYS.EVALUATION_SUPPORTING_FILES] = updatedCreateMetaData;
    }

    if (Object.keys(createMetaData).length > 0) {
      formDataToSend.append(FORMDATA_FIELDS.CREATE_META_DATA, JSON.stringify(createMetaData));
    }

    // Merge update_meta_data from groups and evaluation_supporting_files
    const allUpdateMetaData: any = { ...finalFileData.update_meta_data };
    Object.keys(groupFileData).forEach((groupId) => {
      const groupIdNum = Number(groupId);
      const groupData = groupFileData[groupIdNum];
      if (groupData.update_meta_data && Object.keys(groupData.update_meta_data).length > 0) {
        // Merge group update_meta_data into allUpdateMetaData
        Object.assign(allUpdateMetaData, groupData.update_meta_data);
      }
    });

    if (Object.keys(allUpdateMetaData).length > 0) {
      formDataToSend.append(FORMDATA_FIELDS.UPDATE_META_DATA, JSON.stringify(allUpdateMetaData));
    }

    // Structure documents_to_delete by groups_support and reevaluation_support
    const documentsToDelete: Record<string, number[]> = {
      [DOCUMENT_METADATA_KEYS.GROUPS_SUPPORT]: [],
      [DOCUMENT_METADATA_KEYS.REEVALUATION_SUPPORT]: [],
    };

    // Collect group file deletions
    Object.keys(groupFileData).forEach((groupId) => {
      const groupIdNum = Number(groupId);
      const groupData = groupFileData[groupIdNum];
      if (groupData.documents_to_delete && groupData.documents_to_delete.length > 0) {
        const groupDeleteIds = groupData.documents_to_delete
          .map((id: any) => Number(id))
          .filter((id: number) => !isNaN(id));
        documentsToDelete[DOCUMENT_METADATA_KEYS.GROUPS_SUPPORT].push(...groupDeleteIds);
      }
    });

    // Collect reevaluation supporting files deletions
    if (finalFileData.documents_to_delete && finalFileData.documents_to_delete.length > 0) {
      const reevaluationDeleteIds = finalFileData.documents_to_delete
        .map((id: any) => Number(id))
        .filter((id: number) => !isNaN(id));
      documentsToDelete[DOCUMENT_METADATA_KEYS.REEVALUATION_SUPPORT].push(...reevaluationDeleteIds);
    }

    // Only append if there are any deletions
    if (documentsToDelete[DOCUMENT_METADATA_KEYS.GROUPS_SUPPORT].length > 0 || documentsToDelete[DOCUMENT_METADATA_KEYS.REEVALUATION_SUPPORT].length > 0) {
      formDataToSend.append(FORMDATA_FIELDS.DOCUMENTS_TO_DELETE, JSON.stringify(documentsToDelete));
    }

    // Append form fields
    if (formData.vendor_reevaluation_id) {
      formDataToSend.append(FORMDATA_FIELDS.VENDOR_RE_EVALUATION_ID, formData.vendor_reevaluation_id.toString());
    }
    let criTeriadata = []
    flatCriteriaData.forEach((criteria) => {
      if (criteria.group_mapper_id || criteria?.re_evaluation_applicable_group_id) {
        if (criteria?.criteria?.length > NUMBERMAP.ZERO || criteria?.criteria_details?.length>NUMBERMAP.ZERO) {
          criteria?.[id=='create'?'criteria':'criteria_details']?.forEach((element) => {
            const key = element.criteria_id ?? element.re_evaluation_group_criteria_mapper_id;
            const statusValue = criteriaStatuses[key] != null ? Number(criteriaStatuses[key]) : null;
            // Convert status: 1 (Yes/Active) -> 1, 2 (No/Inactive) -> 0
            const selectionStatus = statusValue === NUMBERMAP.TWO ? STATUS_VALUES.INACTIVE : statusValue;
            criTeriadata.push({
              vendor_selection_criteria_re_evaluation_id: id=='create'?null:Number(element.vendor_selection_criteria_re_evaluation_id),
              vendor_reevaluation_criteria_id: element.criteria_id ?? element.re_evaluation_group_criteria_mapper_id,
              selection_status: selectionStatus
            })
          });

        }

      }
    })
    formDataToSend.append(FORMDATA_FIELDS.PART_CATEGORY_MAPPER_ID, mapperId?.toString() ?? '');
    formDataToSend.append(FORMDATA_FIELDS.RE_EVALUATED_DATE, formData.re_evaluated_date);
    formDataToSend.append(FORMDATA_FIELDS.EVALUATION_FROM_DATE, formData.evaluation_from_date);
    formDataToSend.append(FORMDATA_FIELDS.EVALUATION_TO_DATE, formData.evaluation_to_date);
    formDataToSend.append(FORMDATA_FIELDS.REEVALUATION_CRITERIA, JSON.stringify(criTeriadata));
    formDataToSend.append(FORMDATA_FIELDS.QUALITY_RATING, formData.quality_rating.toString());
    formDataToSend.append(FORMDATA_FIELDS.DELIVERY_RATING, formData.delivery_rating.toString());
    formDataToSend.append(FORMDATA_FIELDS.SUPPORTING_RATING, formData.supporting_rating.toString());
    formDataToSend.append(FORMDATA_FIELDS.OVERALL_RATING, formData.overall_rating.toString());
    formDataToSend.append(FORMDATA_FIELDS.DESIGN_OBSERVATION, formData.design_observation);
    formDataToSend.append(FORMDATA_FIELDS.MANUFACTURING_OBSERVATION, formData.manufacturing_observation);
    formDataToSend.append(FORMDATA_FIELDS.QUALITY_CONTROL_OBSERVATION, formData.quality_control_observation);
    formDataToSend.append(FORMDATA_FIELDS.LOGISTICS_OBSERVATION, formData.logistics_observation);
    formDataToSend.append(FORMDATA_FIELDS.CUSTOMER_SUPPORT_OBSERVATION, formData.customer_support_observation);
    formDataToSend.append(FORMDATA_FIELDS.CONCULATION, formData.conculation);
    formDataToSend.append(FORMDATA_FIELDS.RESPONSE_QUALITY_ISSUES, JSON.stringify(qualityIssues.map(issue => ({
      evaluation_issue_response_id: issue.evaluation_issue_response_id ?? "",
      serial_number: issue.serial_number,
      issue_raised: issue.issue_raised,
      resolution: issue.resolution,
      effectiveness: issue.effectiveness,
      status: issue.status ?? STATUS_VALUES.ACTIVE,
    }))));
    formDataToSend.append(FORMDATA_FIELDS.RE_EVALUATION_CONCLUSION, formData.re_evaluation_conclusion);
    formDataToSend.append(FORMDATA_FIELDS.STATUS, formData.status.toString());




    upsertVendorReEvaluationMutation.mutate(formDataToSend, {
      onSuccess: () => {
        showActionAlert('success');
        if (!resolvedParams){
        router.push(VENDOR_RE_EVALUATION_CONSTANTS.ROUTES.LIST);}
      },
      onError: () => {
        showActionAlert('failed');
      },
    });
    setIsLoading(false);
  }

  const handleCancel = () => {
    router.push(VENDOR_RE_EVALUATION_CONSTANTS.ROUTES.LIST);
    setFormData(INITIAL_FORM_DATA);
    setCriteriaStatuses({});
    setQualityIssues([]);
    setFinalFileData(FINALFILEINITIALDATA);
    setGroupFileData({});
    setUploadedDocuments([]);
  };


  const criteriaColumnRenderCell = (params: any) => {
    const row = params.row as VendorCriteria;
    const isParent = (row as any).isParent;
    return <Box sx={{
      pl: isParent ? NUMBERMAP.ZERO : NUMBERMAP.TWO
    }}>
      {params.value}
    </Box>;
  };

  const columns = [
    {
      field: TABLE_FIELD_NAMES.SNO,
      headerName: COLUMN_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const rowData = params.row as VendorCriteria;
        const isParentRow = rowData.isParent;

        // Skip serial number for child rows in re-evaluation criteria
        if (!isParentRow) {
          return <EmptyTableCell />;
        }

        // Transform criteria data for serial number calculation
        const config = !resolvedParams ? transformConfig : editTransformConfig;
        const transformedCriteria = flatCriteriaData && flatCriteriaData.length > NUMBERMAP.ZERO
          ? transformNestedHierarchicalData(flatCriteriaData as any[], config)
          : [];

        // Calculate serial number for parent rows in re-evaluation criteria table
        const activeParentRows = transformedCriteria.filter(
          item => item.isParent && item.status !== NUMBERMAP.TWO
        );
        const currentParentIndex = activeParentRows.findIndex(item => item.id === rowData.id);
        const serialNumber = currentParentIndex + NUMBERMAP.ONE;

        return (
          <SnoTableCell>
            {String(serialNumber)}
          </SnoTableCell>
        );
      },
    },
    ...CRITERIA_COLUMNS(criteriaColumnRenderCell),
    {
      field: TABLE_FIELD_NAMES.STATUS,
      headerName: COLUMN_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        const row = params.row as VendorCriteria;
        const isParent = (row as any).isParent;
        if (isParent) {
          // Check if parent has documents (supporting_files from criteriaDetailsData)
          // Get group_id from the row (extracted by component from parent data)
          const groupId =(row as any).group?? (row as any).group_mapper_id ??  row?.group_id
          
          // Get existing files from groupFileData (keyed by groupId)
          const existingFiles = params.row?.supporting_files ?? params.row?.applicable_group_files ?? [];
          return (
            <Typography
              sx={{
                ...downloadStyles.title,
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}
              onClick={(e) => {
                e.preventDefault();
                handleViewFiles(groupId, existingFiles)
              }}
            >
              {BUTTON_LABELS.VIEW_FILES}
            </Typography>
          );
        }
        return (
          <RadioButtonGroup
            name={`criteria-${params.row.id}`}
            label=""
            options={STATUS_OPTIONS}
            value={criteriaStatuses[params?.row?.criteria_id??params.row?.group_criteria_mapper_id ?? params.row?.criteriaId] ?? (params.value !== undefined && params.value !== null ? String(params.value) : "")}
            onChange={(value: string | number) => handleCriteriaStatusChange(params?.row?.criteria_id??params.row?.group_criteria_mapper_id ?? params.row?.criteriaId, String(value))}
          />
        );
      },
    },
  ];

  const VendorListColum: GridColDef[] = [
    { field: TABLE_FIELD_NAMES.AREA, headerName: COLUMN_HEADERS.AREAS, flex: NUMBERMAP.ONE },
    {
      field: TABLE_FIELD_NAMES.OBSERVATION,
      headerName: COLUMN_HEADERS.OBSERVATION,
      flex: NUMBERMAP.FOUR,
      renderCell: (params) => {
        const id = params.row.id;
        const [type] = id.split('-');
        const observationType = OBSERVATION_TYPE_MAP[type] ?? `${type}_observation`;
        const errorKey = observationType as keyof typeof errors;

        return (
          <Box sx={{ width: "100%", marginBottom: "10px" }}>
            <Description
              label=""
              placeholder={FORM_PLACEHOLDERS.OBSERVATION}
              value={params.row.observation ?? ""}
              onChange={(value: string) => {
                handleInputChange(observationType, value);
              }}
              error={errors[errorKey]}
            />
          </Box>
        );
      }
    }
  ];

  const radingCell = (key: string, placeholder: string, value: number, handleInputChange: (key: string, value: number) => void) => {
    return (
      <Box sx={RATING_CELL_STYLE} key={key}>
        <InputField
          label=""
          isDropdown
          placeholder={placeholder}
          value={value.toString()}
          onChange={(value: string) => {
            const parsedValue = value ? parseInt(value) : NUMBERMAP.ZERO;
            handleInputChange(key, isNaN(parsedValue) ? NUMBERMAP.ZERO : parsedValue);
          }}
          options={RATING_OPTIONS}
          keyField={DROPDOWN_FIELDS.KEY.RATING}
          valueField={DROPDOWN_FIELDS.VALUE.RATING}
        />
      </Box>
    );
  };
  const performanceColumns: GridColDef[] = [
    { field: TABLE_FIELD_NAMES.PERIOD, headerName: COLUMN_HEADERS.PERIOD, flex: NUMBERMAP.ONE },
    {
      field: TABLE_FIELD_NAMES.QUALITY_RATING,
      headerName: COLUMN_HEADERS.QUALITY_RATING_A,
      flex: NUMBERMAP.TWO,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const ratingValue = formData.quality_rating ?? NUMBERMAP.ZERO;
        const safeValue = isNaN(ratingValue) || ratingValue === null || ratingValue === undefined ? NUMBERMAP.ZERO : ratingValue;
        return radingCell('quality_rating', FORM_PLACEHOLDERS.RATING, safeValue, handleInputChange);
      }
    },
    {
      field: TABLE_FIELD_NAMES.DELIVERY_RATING,
      headerName: COLUMN_HEADERS.DELIVERY_RATING_B,
      flex: NUMBERMAP.TWO,
      sortable: false, filterable: false,
      renderCell: (params) => {
        const ratingValue = formData.delivery_rating ?? NUMBERMAP.ZERO;
        const safeValue = isNaN(ratingValue) || ratingValue === null || ratingValue === undefined ? NUMBERMAP.ZERO : ratingValue;
        return radingCell('delivery_rating', FORM_PLACEHOLDERS.RATING, safeValue, handleInputChange);
      }
    },
    {
      field: TABLE_FIELD_NAMES.SUPPORT_RATING,
      headerName: COLUMN_HEADERS.SUPPORT_RATING_C,
      flex: NUMBERMAP.TWO,
      sortable: false, filterable: false,
      renderCell: (params) => {
        const ratingValue = formData.supporting_rating ?? NUMBERMAP.ZERO;
        const safeValue = isNaN(ratingValue) || ratingValue === null || ratingValue === undefined ? NUMBERMAP.ZERO : ratingValue;
        return radingCell('supporting_rating', FORM_PLACEHOLDERS.RATING, safeValue, handleInputChange);
      }
    },
    {
      field: TABLE_FIELD_NAMES.OVERALL_RATING,
      headerName: COLUMN_HEADERS.OVERALL_RATING,
      flex: NUMBERMAP.TWO,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const quality = formData.quality_rating ?? NUMBERMAP.ZERO;
        const delivery = formData.delivery_rating ?? NUMBERMAP.ZERO;
        const support = formData.supporting_rating ?? NUMBERMAP.ZERO;
        const overall = (isNaN(quality) ? NUMBERMAP.ZERO : quality) + (isNaN(delivery) ? NUMBERMAP.ZERO : delivery) + (isNaN(support) ? NUMBERMAP.ZERO : support);
        return (
          <Box sx={OVERALL_RATING_CELL_STYLE}>
            {overall}
          </Box>
        );
      }
    }
  ]
  const qualityIssueColumns: GridColDef[] = [
    { field: TABLE_FIELD_NAMES.SNO, headerName: COLUMN_HEADERS.SNO, flex: NUMBERMAP.HALF },
    { field: TABLE_FIELD_NAMES.SERIAL_NUMBER, headerName: COLUMN_HEADERS.SL_NO_OF_PART_PRODUCT, flex: NUMBERMAP.ONE, sortable: false, filterable: false },
    {
      field: TABLE_FIELD_NAMES.ISSUE_RAISED,
      headerName: COLUMN_HEADERS.ISSUE_RAISED_AND_DATA,
      flex: NUMBERMAP.ONE_HALF,
      sortable: false,
      filterable: false,
      renderCell: (params) => stripHtml(params.value ?? '')
    },
    {
      field: TABLE_FIELD_NAMES.RESOLUTION,
      headerName: COLUMN_HEADERS.RESOLUTION_AND_DATA,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params) => stripHtml(params.value ?? '')
    },
    {
      field: TABLE_FIELD_NAMES.EFFECTIVENESS,
      headerName: COLUMN_HEADERS.EFFECTIVENESS,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params) => stripHtml(params.value ?? '')
    },
    {
      field: TABLE_FIELD_NAMES.STATUS,
      headerName: COLUMN_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.value} />
      ),
    },
    {
      field: TABLE_FIELD_NAMES.ACTIONS,
      headerName: COLUMN_HEADERS.ACTIONS,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <ActionButton
          onDelete={() => handleQualityIssueDelete(params.row.id)}
          onEdit={() => handleQualityIssueEdit(params.row.id)}
          disabled={!params.row.status}
        />
      ),
    }

  ];

  const performanceData = useMemo(() => {
    const quality = formData.quality_rating ?? 0;
    const delivery = formData.delivery_rating ?? 0;
    const support = formData.supporting_rating ?? 0;
    const overall = (quality) + (delivery) + (support);
    return [
      {
        id: "1",
        period: `${formData.evaluation_to_date} - ${formData.evaluation_from_date}`,
        qualityRating: quality,
        deliveryRating: delivery,
        supportRating: support,
        overallRating: overall
      }
    ];
  }, [formData.quality_rating, formData.delivery_rating, formData.supporting_rating, formData.evaluation_to_date, formData.evaluation_from_date]);

  // Update overall rating when ratings change
  useEffect(() => {
    const quality = formData.quality_rating ?? NUMBERMAP.ZERO;
    const delivery = formData.delivery_rating ?? NUMBERMAP.ZERO;
    const support = formData.supporting_rating ?? NUMBERMAP.ZERO;
    const overall = (isNaN(quality) ? NUMBERMAP.ZERO : quality) + (isNaN(delivery) ? NUMBERMAP.ZERO : delivery) + (isNaN(support) ? NUMBERMAP.ZERO : support);
    if (formData.overall_rating !== overall) {
      setFormData(prev => ({ ...prev, overall_rating: overall }));
    }
  }, [formData.quality_rating, formData.delivery_rating, formData.supporting_rating, formData.overall_rating]);

  const vendorVisitData = useMemo(() => VENDOR_VISIT_AREAS.map(area => ({
    id: area.id,
    area: area.area,
    observation: formData[area.field as keyof VendorReEvaluationFormData] as string
  })), [formData]);

  const buttonConfig = [
    { label: BUTTON_LABELS.CANCEL, onClick: handleCancel },
    { label: BUTTON_LABELS.SAVE, onClick: handleSave, disabled: isLoading ?? isDataLoading }
  ];

  const editTransformConfig = {
    groupIdField: 'group_id',
    groupNameField: 'group_name',
    groupOrderField: 're_evaluation_applicable_group_id',
    criteriaArrayField: 'criteria_details',
    childIdField: 're_evaluation_group_criteria_mapper_id',
    childNameField: 'sub_group_value',
    childOrderField: 'display_order',
    parentIdPrefix: 'parent_',
    childIdPrefix: 'child_',
    fieldMappings: {
      criteria: 'group_criteria_name',
      requirement: 'requirement_type_name',
      requirementId: 'requirement_type',
      category: 'group_value',
      status: 'status',
      remarks: 'remarks',
    },
  }

  const findInvalidDate  = (date)=>{
    if(date == 'Invalid DateTime'){
      return '-'
    }else{
      return date
    }
  }
  return (
    <FormContainer>
      <FormWrapper>
        <Box>
          <Label title={VENDOR_RE_EVALUATION_CONSTANTS.PAGE_TITLE} />
        </Box>

        <FormContent>
          {/* Basic Information Section */}
          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.SIX, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.VENDOR_TYPE}
                placeholder={FORM_PLACEHOLDERS.SELECT_VENDOR_TYPE}
                isDropdown
                options={vendorTypes?.data ?? []}
                valueField={DROPDOWN_FIELDS.VALUE.VENDOR_TYPE}
                keyField={DROPDOWN_FIELDS.KEY.VENDOR_TYPE}
                value={formData.vendor_type_id?.toString() ?? ""}
                onChange={(value: string) => {
                  handleInputChange('vendor_type_id', parseInt(value) ?? NUMBERMAP.ZERO);
                }}
                error={errors.vendor_type_id}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.SIX, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.VENDOR_NAME}
                placeholder={FORM_PLACEHOLDERS.SELECT_VENDOR_NAME}
                isDropdown
                options={vendors?.data ?? []}
                valueField={DROPDOWN_FIELDS.VALUE.VENDOR}
                keyField={DROPDOWN_FIELDS.KEY.VENDOR}
                value={formData.vendor_id?.toString() ?? ""}
                onChange={(value: string) => {
                  handleInputChange('vendor_id', parseInt(value) ?? NUMBERMAP.ZERO);
                  // Reset part_category when vendor changes
                  setFormData(prev => ({
                    ...prev,
                    part_category_mapper_id: NUMBERMAP.ZERO
                  }));
                  setSelectedPartCategoryId(null);
                }}
                error={errors.vendor_id}
                disabled={!formData.vendor_type_id || formData.vendor_type_id === NUMBERMAP.ZERO}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.SIX, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.PART_CATEGORY}
                placeholder={FORM_PLACEHOLDERS.SELECT_PART_CATEGORY}
                isDropdown
                options={partCategoryData}
                valueField={DROPDOWN_FIELDS.VALUE.PART_CATEGORY}
                keyField={DROPDOWN_FIELDS.KEY.PART_CATEGORY}
                value={formData.part_category_mapper_id?.toString() ?? ""}
                onChange={(value: string) => {
                  handleInputChange('part_category_mapper_id', parseInt(value) ?? null);
                  // Reset criteria details when part category changes
                  setFlatCriteriaData([]);
                  setCriteriaStatuses({});
                  setGroupFileData({});
                }}
                error={errors.part_category_mapper_id}
                disabled={!formData.vendor_id || formData.vendor_id === NUMBERMAP.ZERO}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.SIX, md: NUMBERMAP.SIX }}>
              <InfoField
                value={findInvalidDate(convertUtcToLocal(formData.re_evaluated_date) ?? "")}
                label={FORM_LABELS.LAST_RE_EVALUATION_ON}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.SIX, md: NUMBERMAP.SIX }}>
              <InfoField
                value={findInvalidDate(convertUtcToLocal(formData.evaluation_from_date) ?? "")}
                label={FORM_LABELS.FROM_DATE}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InfoField
                value={findInvalidDate(convertUtcToLocal(formData.evaluation_to_date) ?? "")}
                label={FORM_LABELS.TO_DATE}
              />
            </Grid2>
          </Grid2>

          {/* Vendor Selection Criteria Section */}
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              {errors.qms_criteria_group && (
                <ErrorText >
                  {errors.qms_criteria_group}
                </ErrorText>
              )}
              <VendorSelectionCriteriaCommonTable
                onCriteriaReorder={() => { }}
                transformConfig={!resolvedParams ? transformConfig : editTransformConfig}
                rawData={flatCriteriaData}
                title={FORM_LABELS.VENDOR_RE_EVALUATION_CRITERIA}
                showAddButton={false}
                loading={isLoading ?? isDataLoading}
                enableDragDrop={false}
                orderField="order"
                columns={columns}
              />
            </Grid2>
             {errors.criteria_table && (
                <ErrorText >
                  {errors.criteria_table}
                </ErrorText>
              )}
          </Grid2>
        </FormContent>

        {/* Performance Section */}
        <Grid2 container sx={STYLE5}>
          <Grid2 size={NUMBERMAP.TWELVE}>

            <CommonSharedTale
              title={FORM_LABELS.PERFORMANCE}
              Table={
                <>
                  <DataTable
                    rows={performanceData}
                    columns={performanceColumns}
                    IdField="id"
                    checkbox={false}
                  />
                  <FormContent>
                    <Typography>{VENDOR_REEVALUATION_HINTS.PERFORMANCE_HINT}</Typography>
                      {errors.performance_ratings && (
                <ErrorText>
                  {errors.performance_ratings}
                </ErrorText>
              )}
                      {errors.overall_score && (
                <ErrorText>
                  {errors.overall_score}
                </ErrorText>
              )}
                  </FormContent>

                </>
              }

            />
          </Grid2>
        </Grid2>

        <FormContent>
          {/* Vendor Visit Section */}
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <DataGridTable
                rows={vendorVisitData}
                title={FORM_LABELS.VENDOR_VISIT}
                columns={VendorListColum}
                idField="id"
                hideFooter
              />
            </Grid2>
          </Grid2>

          <Grid2 container sx={STYLE5} spacing={NUMBERMAP.ONE}>
            <Grid2 size={NUMBERMAP.SIX}>
              <RichTextEditor
                label={FORM_LABELS.CONCLUSION_OF_AUDIT_VISIT}
                value={formData.conculation}
                onChange={(value) => handleInputChange('conculation', value)}
                placeholder={FORM_PLACEHOLDERS.INPUT_TEXT}
                error={errors.conculation}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                isDropdown
                options={statusData?.data ?? []}
                valueField={DROPDOWN_FIELDS.VALUE.STATUS}
                keyField={DROPDOWN_FIELDS.KEY.STATUS}
                value={formData.status?.toString() ?? ""}
                onChange={(value: string) => {
                  handleInputChange('status', parseInt(value));
                }}
                error={errors.status}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
          </Grid2>
        </FormContent>


        {/* Response to Quality Issues Section */}
        <Grid2 container sx={STYLE5}>
          <Grid2 size={NUMBERMAP.SIX}>
            <QualityIssueModal
              open={isQualityIssueModalOpen}
              onClose={() => {
                setIsQualityIssueModalOpen(false);
                setEditingQualityIssue(null);
              }}
              onSave={handleQualityIssueSave}
              initialData={editingQualityIssue ? {
                serial_number: editingQualityIssue.serial_number,
                issue_raised: editingQualityIssue.issue_raised,
                resolution: editingQualityIssue.resolution,
                effectiveness: editingQualityIssue.effectiveness,
              } : undefined}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <CommonSharedTale
              title={FORM_LABELS.RESPONSE_TO_QUALITY_ISSUES}
              pathName="#"
              hanldeClick={handleAddQualityIssue}
              Table={
                <DataTable
                  rows={qualityIssues}
                  columns={qualityIssueColumns}
                  IdField="id"
                  checkbox={false}
                />
              }
            />
            <FormContent>
              {errors.response_quality_issues && (
                <ErrorText>
                  {errors.response_quality_issues}
                </ErrorText>
              )}
             </FormContent>
          </Grid2>
        </Grid2>
        <FormContent>
          {/* Conclusion Section */}
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <RichTextEditor
                label={FORM_LABELS.CONCLUSION_OF_RE_EVALUATION}
                value={formData.re_evaluation_conclusion}
                onChange={(value) => handleInputChange('re_evaluation_conclusion', value)}
                placeholder={FORM_PLACEHOLDERS.INPUT_TEXT}
                error={errors.re_evaluation_conclusion}
                disabled={!hasEditPermission}
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                initialFiles={uploadedDocuments}
                onFileUpload={handleFileUpload}
                onFileEdit={handleFileEdit}
                onSubmit={(data) => {
                  setFinalFileData((prev) => mergeFinalFileData(prev, data));
                  handleFileRemove(data);
                }}
                subHeader={FORM_LABELS.FILE_UPLOAD}
                uploadMandError={errors.documents}
                isRequired={true}
                requiredErrorMessage={VALIDATION_ERROR_MESSAGES.FILE_UPLOAD_REQUIRED}
                showValidationError={showFileValidationError}
                onValidationChange={(isValid) => {
                  // Only clear validation error display when file becomes valid (has files)
                  // Keep it true if invalid (no files) so error shows on next save attempt
                  if (isValid) {
                    setShowFileValidationError(false)
                  }
                }}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

            <CommentsHistory
              comments={vendorReEvaluationData?.meta_info?.task_info?.task_comments}
            />

          <ButtonContainer>
            {resolvedParams ? (
              <VendorReviewerModalManager
                isLoading={isDataLoading}
                permissions={vendorReEvaluationData?.meta_info?.action_control?.permissions ?? []}
                taskInfo={{
                  task_comments: vendorReEvaluationData?.meta_info?.task_info?.task_comments ?? [],
                  reviewer_list: vendorReEvaluationData?.meta_info?.task_info?.reviewer_list ?? []
                }}
                menuId={vendorReEvaluationData?.meta_info?.action_control?.menuId}
                menuName={vendorReEvaluationData?.meta_info?.action_control?.formName}
                contextType="vendor_re_evaluation"
                contextId={formData.vendor_reevaluation_id}
                onPermissionChange={setHasEditPermission}
                customHandlers={{
                  handleCancel: handleCancel,
                  handleSave: handleSave,
                  isDisabled: isLoading ?? isDataLoading
                }}
                refetch = {refetchReEvaluation}
              />
            ) : (
              <ButtonGroup buttons={buttonConfig} />
            )}
          </ButtonContainer>
        </FormContent>
      </FormWrapper>



      {/* Upload Document Modal */}
      <UploadDocumentModal
        open={isUploadDocumentModalOpen}
        onClose={handleCloseUploadDocumentModal}
        onSave={handleUploadDocumentSave}
        initialFiles={selectedGroupId !== null ? selectedGroupFiles : []}
        groupId={selectedGroupId}
        groupFiles = {selectedGroupId !== null ? groupFileData[selectedGroupId ?? NUMBERMAP.ZERO]:null}
      />
    </FormContainer>
  );
};

export default VendorReEvaluationForm;
