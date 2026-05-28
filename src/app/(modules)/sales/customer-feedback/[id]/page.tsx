"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Grid2, Box,  } from "@mui/material";
import {
  RichTextEditor,
  InputField,
  DataGridTable,
  Label,
  RadioButtonGroup,
  ActionButton,
  showActionAlert
} from "@/components/ui";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { NUMBERMAP, STATUS, FINALFILEINITIALDATA, BUTTON_LABEL, PERMISSION_ACTIONS } from "@/constants/common";
import { CUSTOMER_FEEDBACK_VALIDATION, CUSTOMER_FEEDBACK_FIELDS, CUSTOMER_FEEDBACK_PAGE, CUSTOMER_FEEDBACK_TABLE_CONFIG, CUSTOMER_FEEDBACK_MODALS, CUSTOMER_FEEDBACK_ROUTES, DEFAULT_CUSTOMER_FEEDBACK_FORM, CUSTOMER_FEEDBACK_DETAIL_TABLE_COLUMNS, CUSTOMER_FEEDBACK_DETAIL_TABLE_HEADERS, CUSTOMER_FEEDBACK_TABLE_ALIGNMENT, CUSTOMER_FEEDBACK_MODE } from '@/constants/modules/sales/customerFeedback';
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { ButtonContainer } from "@/styles/components/ui/button";
import {
  RatingCellStyles,
  RatingColumnConfig,
  CriteriaStyles,
  SubHeaderStyles,
  ErrorStyles,
  ButtonContainerStyles
} from '@/styles/modules/sales/customerFeedback';
import SubHeader from "@/components/modules/regulation/executive-summary/SubHeader";
import DatePicker from '@/components/ui/data-picker/DataPicker';
import GlobalLoader from '@/components/shared/LoadingSpinner';
import dayjs, { Dayjs } from 'dayjs';
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { COMMON_CONSTANTS, mergeFinalFileData, FinalFileData, formatDateForAPI } from '@/lib/utils/common';
import ProductDetailsModal from '@/components/modules/sales/customer-feedback/ProductDetailsModal';
import { 
  CustomerFeedbackFormData, 
  ProductDetailData, 
  FeedbackCriteriaData,
  OrderApprovalModeData,
  CustomerFeedbackPersonDetail,
  CustomerFeedbackCriteria,
} from '@/types/modules/sales/customerFeedback';
import { FileData, FileDocument } from '@/types/components/ui/fileUploadV3';
import { transformCriteriaToFlat, flattenCriteriaDetails, flattenCriteriaList, transformDetailCriteriaToCriteriaDetail } from '@/lib/modules/sales/customerFeedbackUtils';
import { useGetOrderAcknowledgementList, useGetOrderApprovalModeList, useGetCustomerList, useGetCustomerFeedbackById, useGetProductGroupList, useGetProductCategoryList, useGetProductTypeList, useGetProductSubTypeList, useGetProductList, useGetCustomerFeedbackCriteria, useGetRatingList, useUpsertCustomerFeedback } from '@/hooks/modules/sales/useCustomerFeedback';
import { useAllEmployees } from '@/hooks/modules/hr/useEmployeeList';
import { useOrganizationStatus } from '@/hooks/useCommonDropdown';
import SalesReviewerModalManager from '@/components/modules/sales/reviewer-modal/SalesReviewerModalManager';
import { SALES_CONTEXT_TYPE } from '@/constants/commonContextType';
import CommentsHistory from '@/components/ui/comments-history/Comments';
/**
 * Classification : Confidential
 **/

const productDetailsData: ProductDetailData[] = [];
const CustomerFeedbackCriteriaForm: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const customerFeedbackIdParam = params?.id as string;
  const customerFeedbackId = customerFeedbackIdParam ? parseInt(customerFeedbackIdParam) : null;
  const formRef = useRef(null);
  const [form, setForm] = useState<CustomerFeedbackFormData>(DEFAULT_CUSTOMER_FEEDBACK_FORM);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [criteriaRatings, setCriteriaRatings] = useState<Record<string, string>>({});
  const [criteriaResponseIds, setCriteriaResponseIds] = useState<Record<string, number>>({});
  const [criteriaErrors, setCriteriaErrors] = useState<Record<string, string>>({});
  const [productDetails, setProductDetails] = useState<ProductDetailData[]>(productDetailsData);
  const [feedbackCriteriaData, setFeedbackCriteriaData] = useState<FeedbackCriteriaData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<{ name: string; role: string; document: (FileData | FileDocument)[]; fileData?: FinalFileData }>({ name: '', role: '', document: [] });
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const [personFileMetadata, setPersonFileMetadata] = useState<Record<string, FinalFileData>>({});
  // Track original person IDs loaded from API to identify existing vs new persons
  const [originalPersonIdsMap, setOriginalPersonIdsMap] = useState<Map<string, number>>(new Map());
  // Track deleted person IDs to mark with status = 0
  const [deletedPersonIds, setDeletedPersonIds] = useState<Set<number>>(new Set());
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(true);
  const isCreateMode = !customerFeedbackId || customerFeedbackIdParam === CUSTOMER_FEEDBACK_MODE.CREATE;

  const { data: orderAcknowledgementResponse } = useGetOrderAcknowledgementList();
  const { data: orderApprovalModeResponse } = useGetOrderApprovalModeList();
  const { data: customerResponse } = useGetCustomerList();
  const { data: employeeResponse, refetch: refetchEmployees } = useAllEmployees(NUMBERMAP.ONE);
  const { data: customerFeedbackDetailResponse, isLoading: isCustomerFeedbackDetailLoading, refetch: refetchCustomerFeedback } = useGetCustomerFeedbackById(customerFeedbackId ?? NUMBERMAP.ZERO);
  const { data: productGroupResponse } = useGetProductGroupList();
  const { data: productCategoryResponse } = useGetProductCategoryList();
  const { data: productTypeResponse } = useGetProductTypeList();
  const { data: productSubTypeResponse } = useGetProductSubTypeList(form.productType);
  const { data: productListResponse } = useGetProductList();
  const { data: customerFeedbackCriteriaResponse, isLoading: isCriteriaLoading } = useGetCustomerFeedbackCriteria(form.productName, !customerFeedbackId);
  const { data: ratingResponse } = useGetRatingList();
  const { data: statusData } = useOrganizationStatus();

  // Fetch employees on mount
  useEffect(() => {
    refetchEmployees();
  }, [refetchEmployees]);



// Transform API criteria data to FeedbackCriteriaData structure
const setCriteriaFromDetails = useCallback((details?: FeedbackCriteriaData[]) => {
  if (!details || details.length <= NUMBERMAP.ZERO) {
    return;
  }
  const transformedData = transformCriteriaToFlat(details);
  if (transformedData.length > NUMBERMAP.ZERO) {
    setFeedbackCriteriaData(transformedData);
  }
}, []);

useEffect(() => {
  const loadCreateModeCriteria = () => {
    const criteriaDetails = customerFeedbackCriteriaResponse?.data?.[NUMBERMAP.ZERO]?.criteria_details;
    if (!criteriaDetails?.length) {
      return;
    }
    setCriteriaFromDetails(flattenCriteriaDetails(criteriaDetails));
  };

  const loadEditModeCriteria = () => {
    const criteriaList = customerFeedbackDetailResponse?.data?.[NUMBERMAP.ZERO]?.customer_feedback_criteria;
    if (!criteriaList?.length) {
      return;
    }
    const criteriaDetails = transformDetailCriteriaToCriteriaDetail(criteriaList);
    setCriteriaFromDetails(criteriaDetails);
  };

  if (!customerFeedbackId) {
    loadCreateModeCriteria();
    return;
  }

  loadEditModeCriteria();
}, [customerFeedbackCriteriaResponse, customerFeedbackDetailResponse, customerFeedbackId, setCriteriaFromDetails]);

  // Initialize hasEditPermission based on mode
  // In create mode, user has edit permission by default
  // In edit mode, wait for workflow permissions to be loaded via onPermissionChange
  useEffect(() => {
    // Only set permission in create mode - in edit mode, let workflow manager set it via onPermissionChange
    if (isCreateMode) {
      setHasEditPermission(true);
    }
    // In edit mode, don't override - workflow manager will set it based on actual permissions
  }, [isCreateMode]);

  // Helper function to get source ID from source name
  const getSourceId = useCallback((sourceName: string | undefined, orderApprovalModeData: OrderApprovalModeData[] | undefined): string => {
    if (!sourceName || !orderApprovalModeData) {
      return '';
    }
    const sourceMatch = orderApprovalModeData.find(
      (item: OrderApprovalModeData) => item.approval_mode_name === sourceName
    );
    return sourceMatch?.approval_mode_id?.toString() ?? '';
  }, []);

  // Helper function to process persons detail
  const processPersonsDetail = useCallback((personsDetail: CustomerFeedbackPersonDetail[] | undefined) => {
    if (!personsDetail || personsDetail.length === NUMBERMAP.ZERO) {
      setProductDetails([]);
      setOriginalPersonIdsMap(new Map());
      setDeletedPersonIds(new Set());
      setPersonFileMetadata({});
      return;
    }

    // Filter to only active persons (status = NUMBERMAP.ONE)
    // Also exclude persons with empty name AND empty role (deleted persons pattern)
    const activePersons = personsDetail.filter((p: CustomerFeedbackPersonDetail) => {
      if (p.status === NUMBERMAP.ZERO) {
        return false;
      }
      const hasName = p.person_name && p.person_name.trim() !== '';
      const hasRole = p.person_role && p.person_role.trim() !== '';
      if (!hasName && !hasRole) {
        return false;
      }
      return p.status === NUMBERMAP.ONE;
    });
    
    // Deduplicate persons by customer_feedback_person_id - keep only the latest entry for each unique ID
    const uniquePersonsMap = new Map<number, CustomerFeedbackPersonDetail>();
    activePersons.forEach((person: CustomerFeedbackPersonDetail) => {
      if (person.customer_feedback_person_id) {
        const existing = uniquePersonsMap.get(person.customer_feedback_person_id);
        if (!existing || person.customer_feedback_person_id >= existing.customer_feedback_person_id) {
          uniquePersonsMap.set(person.customer_feedback_person_id, person);
        }
      }
    });
    
    // Store original person IDs map (id string -> customer_feedback_person_id number) for tracking
    const personIdsMap = new Map<string, number>();
    uniquePersonsMap.forEach((person: CustomerFeedbackPersonDetail, personId: number) => {
      personIdsMap.set(personId.toString(), personId);
    });
    setOriginalPersonIdsMap(personIdsMap);
    
    // Transform only unique active persons for display
    const uniquePersonsArray = Array.from(uniquePersonsMap.values());
    const transformedProductDetails = uniquePersonsArray.map((person: CustomerFeedbackPersonDetail, index: number) => ({
      id: person.customer_feedback_person_id.toString(),
      serialNo: (index + NUMBERMAP.ONE).toString(),
      name: person.person_name,
      role: person.person_role,
      document: person.documents ?? [],
    }));
    setProductDetails(transformedProductDetails);
    setDeletedPersonIds(new Set());
  }, []);

  // Helper function to process criteria ratings
  const processCriteriaRatings = useCallback((criteriaList: CustomerFeedbackCriteria[] | undefined) => {
    if (!criteriaList || criteriaList.length === NUMBERMAP.ZERO) {
      return;
    }

    const ratings: Record<string, string> = {};
    const responseIds: Record<string, number> = {};
    
    // Deduplicate: Group by feedback_criteria_detail_id and take the latest entry (highest customer_feedback_response_id)
    const criteriaMap = new Map<number, CustomerFeedbackCriteria>();
    criteriaList.forEach((criteria: CustomerFeedbackCriteria) => {
      const mapperId = criteria.feedback_criteria_detail_id;
      if (mapperId && criteria.rating_name) {
        const existing = criteriaMap.get(mapperId);
        if (!existing || (criteria.customer_feedback_response_id ?? NUMBERMAP.ZERO) > (existing.customer_feedback_response_id ?? NUMBERMAP.ZERO)) {
          criteriaMap.set(mapperId, criteria);
        }
      }
    });
    
    // Populate ratings from deduplicated criteria
    criteriaMap.forEach((criteria) => {
      const mapperId = criteria.feedback_criteria_detail_id;
      if (mapperId && criteria.rating_name) {
        const key = `mapper-${mapperId}`;
        ratings[key] = criteria.rating_name.toLowerCase();
        if (criteria.customer_feedback_response_id) {
          responseIds[key] = criteria.customer_feedback_response_id;
        }
      }
    });
    
    setCriteriaRatings(ratings);
    setCriteriaResponseIds(responseIds);
  }, []);

  // Populate form with fetched data in edit mode
  useEffect(() => {
    if (!customerFeedbackDetailResponse?.data?.[NUMBERMAP.ZERO] || !customerFeedbackId) {
      return;
    }

    const feedbackData = customerFeedbackDetailResponse.data[NUMBERMAP.ZERO];
    const sourceId = getSourceId(feedbackData.source, orderApprovalModeResponse?.data);
    const documents = feedbackData.documents ?? [];
    
    // Handle grouped structure from API - flatten it first
    const criteriaList = feedbackData.customer_feedback_criteria;
    const flattenedCriteria = flattenCriteriaList(criteriaList);
    
    // Transform to CustomerFeedbackCriteriaDetail format
    const criteriaDetails = transformDetailCriteriaToCriteriaDetail(flattenedCriteria);
    const transformedData = transformCriteriaToFlat(criteriaDetails);
    setFeedbackCriteriaData(transformedData);
    
    setForm({
      productGroup: feedbackData.product_group_id?.toString() ?? '',
      productCategory: feedbackData.product_category_id?.toString() ?? '',
      productType: feedbackData.product_type_id?.toString() ?? '',
      productSubtype: feedbackData.product_sub_type_id?.toString() ?? '',
      productName: feedbackData.product_id?.toString() ?? '',
      customerName: feedbackData.customer_id?.toString() ?? '',
      orderNo: feedbackData.order_id?.toString() ?? '',
      productSerialNo: feedbackData.product_serial ?? '',
      dateOfInstallation: formatDateForAPI(feedbackData.date_of_installation) ?? '',
      source: sourceId,
      feedbackDate: formatDateForAPI(feedbackData.feedback_date) ?? '',
      capturedBy: feedbackData.captured_by_id?.toString() ?? '',
      feedback: feedbackData.feedback ?? '',
      documents: documents,
      status_id: feedbackData.status_id ?? null,
    });
    
    setFinalFileData(FINALFILEINITIALDATA);
    processPersonsDetail(feedbackData.persons_detail);
    // Use flattened criteria for ratings processing
    processCriteriaRatings(flattenedCriteria);
  }, [customerFeedbackDetailResponse, customerFeedbackId, orderApprovalModeResponse, getSourceId, processPersonsDetail, processCriteriaRatings]);

  // Clear criteria errors when ratings are populated and all criteria have ratings
  useEffect(() => {
    if (feedbackCriteriaData.length > NUMBERMAP.ZERO && Object.keys(criteriaRatings).length > NUMBERMAP.ZERO) {
      // Check if all criteria rows have ratings
      const criteriaRows = feedbackCriteriaData.filter(
        (c) => c.id?.startsWith('mapper-') && (!c.serialNo || c.serialNo === '')
      );
      
      const allHaveRatings = criteriaRows.every(
        (c) => criteriaRatings[c.id] && criteriaRatings[c.id].trim() !== ''
      );
      
      if (allHaveRatings) {
        setCriteriaErrors({});
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.criteriaRating;
          return updated;
        });
      }
    }
  }, [criteriaRatings, feedbackCriteriaData]);

  const handleChange = (field: keyof CustomerFeedbackFormData, value: string | number | null | undefined) => {
    if (!isCreateMode && !hasEditPermission) return;
    setForm((prev) => ({ ...prev, [field]: value ?? '' }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    // Reset criteria data and ratings when product name changes (unless in edit mode with same product)
    if (field === 'productName') {
      setFeedbackCriteriaData([]);
      setCriteriaRatings({});
      setCriteriaResponseIds({});
      setCriteriaErrors({});
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.criteriaRating;
        return updated;
      });
    }
  };

  const handleDateChange = (field: keyof CustomerFeedbackFormData, value: Dayjs | null) => {
    if (!isCreateMode && !hasEditPermission) return;
    const formattedDate = formatDateForAPI(value, 'yyyy-MM-dd');
    handleChange(field, formattedDate);
  };

  const handleCriteriaRatingChange = useCallback((itemId: string, rating: string) => {
    if (!isCreateMode && !hasEditPermission) return;
    setCriteriaRatings(prev => ({ ...prev, [itemId]: rating }));
    // Clear error for this criteria when rating is selected
    setCriteriaErrors(prev => {
      const updated = { ...prev };
      if (updated[itemId]) {
        delete updated[itemId];
      }
      // Clear general criteria error if all criteria now have ratings
      if (Object.keys(updated).length === NUMBERMAP.ZERO) {
        setErrors(prevErrors => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.criteriaRating;
          return updatedErrors;
        });
      }
      return updated;
    });
  }, []);

  // File upload handlers
  const handleFileUpload = (newFile: File | FileData | FileDocument) => {
    if (!isCreateMode && !hasEditPermission) return;
    setForm((prev) => ({
      ...prev,
      documents: [...(prev.documents ?? []), newFile],
    }));
    setErrors((prev) => ({
      ...prev,
      fileUpload: '',
    }));
  };

  const handleFileEdit = useCallback((updatedFile: FileData) => {
    if (!isCreateMode && !hasEditPermission) return;
    setForm((prev) => {
      const updatedFiles = (prev.documents ?? []).map((file: any) => {
        const currentId =
          typeof file === 'object'
            ? (file.file_id ?? file.id)
            : undefined;
        const updatedId = (updatedFile as any).document_id ?? updatedFile.id;

        return currentId === updatedId ? { ...file, ...updatedFile } : file;
      });

      return {
        ...prev,
        documents: updatedFiles,
      };
    });
  }, []);

  const handleFileSubmit = useCallback((data: any) => {
    // Merge file data
    setFinalFileData((prev) => mergeFinalFileData(prev, data));
  }, []);


  // Helper function to validate required text fields
  const validateRequiredFields = (errors: { [key: string]: string }) => {
    if (!form.productGroup?.trim()) {
      errors.productGroup = CUSTOMER_FEEDBACK_VALIDATION.PRODUCT_GROUP_REQUIRED;
    }
    if (!form.productCategory?.trim()) {
      errors.productCategory = CUSTOMER_FEEDBACK_VALIDATION.PRODUCT_CATEGORY_REQUIRED;
    }
    if (!form.productType?.trim()) {
      errors.productType = CUSTOMER_FEEDBACK_VALIDATION.PRODUCT_TYPE_REQUIRED;
    }
    if (!form.productSubtype?.trim()) {
      errors.productSubtype = CUSTOMER_FEEDBACK_VALIDATION.PRODUCT_SUBTYPE_REQUIRED;
    }
    if (!form.productName?.trim()) {
      errors.productName = CUSTOMER_FEEDBACK_VALIDATION.PRODUCT_NAME_REQUIRED;
    }
    if (!form.customerName?.trim()) {
      errors.customerName = CUSTOMER_FEEDBACK_VALIDATION.CUSTOMER_NAME_REQUIRED;
    }
    if (!form.orderNo?.trim()) {
      errors.orderNo = CUSTOMER_FEEDBACK_VALIDATION.ORDER_NO_REQUIRED;
    }
    if (!form.productSerialNo?.trim()) {
      errors.productSerialNo = CUSTOMER_FEEDBACK_VALIDATION.PRODUCT_SERIAL_REQUIRED;
    }
    if (!form.source?.trim()) {
      errors.source = CUSTOMER_FEEDBACK_VALIDATION.SOURCE_REQUIRED;
    }
    if (!form.capturedBy?.trim()) {
      errors.capturedBy = CUSTOMER_FEEDBACK_VALIDATION.CAPTURED_BY_REQUIRED;
    }
    if (!form.status_id) {
      errors.status_id = CUSTOMER_FEEDBACK_VALIDATION.STATUS_REQUIRED;
    }
  };

  // Helper function to validate dates
  const validateDates = (errors: { [key: string]: string }) => {
    if (!form.dateOfInstallation) {
      errors.dateOfInstallation = CUSTOMER_FEEDBACK_VALIDATION.INSTALLATION_DATE_REQUIRED;
    }
    if (!form.feedbackDate) {
      errors.feedbackDate = CUSTOMER_FEEDBACK_VALIDATION.FEEDBACK_DATE_REQUIRED;
    }
    // Date consistency: Feedback Date ≥ Installation Date
    if (form.dateOfInstallation && form.feedbackDate) {
      const install = dayjs(form.dateOfInstallation);
      const feedback = dayjs(form.feedbackDate);
      if (feedback.isBefore(install, 'day')) {
        errors.feedbackDate = CUSTOMER_FEEDBACK_VALIDATION.FEEDBACK_DATE_BEFORE_INSTALL;
      }
    }
  };

  // Helper function to validate criteria ratings
  const validateCriteriaRatings = (): Record<string, string> => {
    const criteriaErrors: Record<string, string> = {};
    if (feedbackCriteriaData.length === NUMBERMAP.ZERO) {
      return criteriaErrors;
    }

    feedbackCriteriaData.forEach((criteria) => {
      const isCriteriaRow = criteria.id?.startsWith('mapper-') && (!criteria.serialNo || criteria.serialNo === '');
      if (!isCriteriaRow) {
        return;
      }
      const hasRating = criteriaRatings[criteria.id] && criteriaRatings[criteria.id].trim() !== '';
      if (!hasRating) {
        criteriaErrors[criteria.id] = CUSTOMER_FEEDBACK_VALIDATION.CRITERIA_RATING_REQUIRED;
      }
    });

    return criteriaErrors;
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    validateRequiredFields(newErrors);
    validateDates(newErrors);

    // Validate file upload required
    if (!form.documents || form.documents.length === NUMBERMAP.ZERO) {
      newErrors.fileUpload = CUSTOMER_FEEDBACK_VALIDATION.FILE_UPLOAD_REQUIRED;
    }

    // Validate Product Details Feedback table - at least one entry is required
    if (!productDetails || productDetails.length === NUMBERMAP.ZERO) {
      newErrors.productDetails = CUSTOMER_FEEDBACK_VALIDATION.PRODUCT_DETAILS_REQUIRED;
    }

    // Validate that all criteria have ratings selected
    const newCriteriaErrors = validateCriteriaRatings();
    if (Object.keys(newCriteriaErrors).length > NUMBERMAP.ZERO) {
      newErrors.criteriaRating = CUSTOMER_FEEDBACK_VALIDATION.CRITERIA_RATING_REQUIRED;
    }

    setErrors(newErrors);
    setCriteriaErrors(newCriteriaErrors);
    return Object.keys(newErrors).length === NUMBERMAP.ZERO && Object.keys(newCriteriaErrors).length === NUMBERMAP.ZERO;
  };

  const { mutate: upsertCustomerFeedback } = useUpsertCustomerFeedback();

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const fd = new FormData();
    
    // Group create_meta_data by person_name (backend uses this to look up files)
    const transformedCreateMetaData: Record<string, Record<string, unknown>> = {};
    
    // Add files from each person - use person_name as key
    productDetails.forEach((person) => {
      const personFileData = personFileMetadata[person.id];
      const personName = (person.name ?? '').trim();
      if (personFileData?.create_meta_data && Object.keys(personFileData.create_meta_data).length > NUMBERMAP.ZERO && personName) {
        // Use person_name as key (backend looks up files using this)
        const key = personName;
        
        // If multiple persons have the same name, merge their files
        if (transformedCreateMetaData[key]) {
          // Merge file metadata if key already exists (multiple persons with same name)
          transformedCreateMetaData[key] = {
            ...transformedCreateMetaData[key],
            ...personFileData.create_meta_data
          };
        } else {
          transformedCreateMetaData[key] = personFileData.create_meta_data;
        }
      }
    });
    
    // Add files from main FileUploadManager under "customer_feedback"
    if (finalFileData.create_meta_data && Object.keys(finalFileData.create_meta_data).length > NUMBERMAP.ZERO) {
      transformedCreateMetaData['customer_feedback'] = finalFileData.create_meta_data;
    }
    
    // Merge update_meta_data from all sources
    const mergedUpdateMetaData: Record<string, Record<string, unknown>> = {};
    
    // Process update_meta_data from main FileUploadManager
    if (finalFileData.update_meta_data && Object.keys(finalFileData.update_meta_data).length > NUMBERMAP.ZERO) {
      // Merge directly without "customer_feedback" wrapper
      Object.assign(mergedUpdateMetaData, finalFileData.update_meta_data);
    }
    
    // Process update_meta_data from person file metadata - use file_id directly as key (not nested under customer_feedback_person_id)
    productDetails.forEach((person) => {
      const personFileData = personFileMetadata[person.id];
      if (personFileData?.update_meta_data && Object.keys(personFileData.update_meta_data).length > NUMBERMAP.ZERO) {
        // FileUploadManager already structures update_meta_data as { [file_id]: { metadata } }
        // So we can directly merge it into mergedUpdateMetaData using file_id as key
        Object.keys(personFileData.update_meta_data).forEach((fileId) => {
          mergedUpdateMetaData[fileId] = personFileData.update_meta_data[fileId];
        });
      }
    });
    
    // Merge all file data using mergeFinalFileData (similar to clinical-evaluation page)
    const mergedFileData: FinalFileData = Object.values(personFileMetadata).reduce(
      (acc, personFileData) => {
        return personFileData ? mergeFinalFileData(acc, personFileData) : acc;
      },
      finalFileData
    );

    // Extract merged data
    const mergedDocumentsToDelete = mergedFileData.documents_to_delete ?? [];
    const allFilesToCreate = mergedFileData.documents_to_create ?? [];
    
    // Create rating map from API response: rating_name (lowercase) -> rating_id
    const ratingMap: Record<string, number> = {};
    if (ratingResponse?.data) {
      ratingResponse.data.forEach((rating) => {
        ratingMap[rating.rating_name.toLowerCase()] = rating.id;
      });
    }

    const criteria = feedbackCriteriaData
      .filter((c) => !c.serialNo && c.id.startsWith('mapper-'))
      .map((c) => {
        const selected = criteriaRatings[c.id];
        const rating_id = ratingMap[selected] ?? NUMBERMAP.ZERO;
        // Extract criteria_mapper_id from id string (format: "mapper-{criteria_mapper_id}")
        const criteria_mapper_id = (parseInt(c.id.replace('mapper-', ''), NUMBERMAP.TEN) || c.criteria_mapper_id) ?? NUMBERMAP.ZERO;
        const existingResponseId = criteriaResponseIds[c.id];
        return {
          customer_feedback_response_id: existingResponseId ? existingResponseId.toString() : '',
          criteria_detail_id: criteria_mapper_id ?? NUMBERMAP.ZERO,
          rating_id: typeof rating_id === 'number' ? rating_id : parseInt(String(rating_id), NUMBERMAP.TEN) ?? NUMBERMAP.ZERO,
        };
      })
      .filter((c) => c.criteria_detail_id > NUMBERMAP.ZERO && c.rating_id > NUMBERMAP.ZERO); // Only include valid entries

    // Deduplicate by customer_feedback_person_id OR by name+role combination to prevent sending duplicates
    const activePersonsMap = new Map<string, any>();
    productDetails.forEach((p) => {
      // Check if this is an existing person (has customer_feedback_person_id in original map)
      const originalPersonId = originalPersonIdsMap.get(p.id);
      // For new persons, use name+role combination as key to prevent duplicates
      let key: string;
      let customer_feedback_person_id: number;
      
      if (originalPersonId !== undefined) {
        // Existing person - use ID as key
        key = originalPersonId.toString();
        customer_feedback_person_id = originalPersonId; // Send as number
      } else {
        // New person - use name+role as key to prevent duplicates
        key = `${(p.name ?? '').trim()}_${(p.role ?? '').trim()}`.toLowerCase();
        customer_feedback_person_id = NUMBERMAP.ZERO; // Use 0 for new persons (backend expects number)
      }
      
      // Only add if not already in map (prevents duplicates)
      if (!activePersonsMap.has(key)) {
        activePersonsMap.set(key, {
          customer_feedback_person_id: customer_feedback_person_id,
          person_name: p.name ?? '',
          person_role: p.role ?? '',
          status: NUMBERMAP.ONE,
        });
      }
    });
    
    const activePersons = Array.from(activePersonsMap.values());
    
    // Add deleted persons with status = 0 (persons that were originally loaded but are now deleted)
    // Only include valid person IDs
    const deletedPersons = Array.from(deletedPersonIds)
      .filter((personId) => personId && personId > NUMBERMAP.ZERO)
      .map((personId) => ({
        customer_feedback_person_id: personId, // Send as number
        person_name: '',
        person_role: '',
        status: NUMBERMAP.ZERO,
      }));
    
    // Combine active and deleted persons
    const allPersonsDetail = [...activePersons, ...deletedPersons];

    fd.append('product_group_id', form.productGroup ?? '');
    fd.append('product_category_id', form.productCategory ?? '');
    fd.append('product_type_id', form.productType ?? '');
    fd.append('product_sub_type_id', form.productSubtype ?? '');
    fd.append('product_id', form.productName ?? '');
    fd.append('customer_id', form.customerName ?? '');
    fd.append('order_id', form.orderNo ?? '');
    fd.append('product_serial', form.productSerialNo ?? '');
    fd.append('date_of_installation', formatDateForAPI(form.dateOfInstallation) ?? '');
    fd.append('source_id', form.source ?? '');
    fd.append('feedback_date', formatDateForAPI(form.feedbackDate) ?? '');
    fd.append('status_id', form.status_id.toString());
    fd.append('create_meta_data', JSON.stringify(transformedCreateMetaData));
    fd.append('update_meta_data', JSON.stringify(mergedUpdateMetaData));
    
    // Append files
    allFilesToCreate.forEach((file: File) => {
      if (file instanceof File) {
        fd.append('documents_to_create', file, file.name);
      }
    });
    
    fd.append('documents_to_delete', JSON.stringify(mergedDocumentsToDelete));
    // Append remaining fields
    fd.append('persons_detail', JSON.stringify(allPersonsDetail));
    fd.append('customer_feedback_criteria', JSON.stringify(criteria));
    fd.append('captured_by_id', form.capturedBy ?? '');
    fd.append('feedback', form.feedback ?? '');
    
    if (customerFeedbackId) {
      fd.append('customer_feedback_id', customerFeedbackId.toString());
    }
    upsertCustomerFeedback(fd, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS);
        // Refetch customer feedback data if in edit mode
        if (customerFeedbackId) {
          refetchCustomerFeedback();
        }
        // Redirect to customer feedback list page after successful save
        if(isCreateMode){router.push(CUSTOMER_FEEDBACK_ROUTES.LIST);}
      },
      onError: () => {
        showActionAlert(STATUS.FAILED);
      },
    });
  };

  const handleCancel = () => {
    router.push(CUSTOMER_FEEDBACK_ROUTES.LIST);
  };

  const handleOpenProductModal = () => {
    if (!isCreateMode && !hasEditPermission) return;
    setProductForm({ name: '', role: '', document: [] });
    setEditProductId(null);
    setModalOpen(true);
  };

  const handleEditProduct = (row: ProductDetailData) => {
    if (!isCreateMode && !hasEditPermission) return;
    setProductForm({
      name: row.name,
      role: row.role,
      document: row.document ?? [],
      fileData: personFileMetadata[row.id],
    });
    setEditProductId(row.id);
    setModalOpen(true);
  };

  // Helper to filter and update product details after deletion
  const filterAndUpdateProducts = useCallback((prevProducts: ProductDetailData[], personIdStr: string): ProductDetailData[] => {
    const filtered = prevProducts.filter((p) => String(p.id) !== personIdStr);
    return filtered.map((p, index) => ({
      ...p,
      serialNo: String(index + NUMBERMAP.ONE)
    }));
  }, []);

  // Helper to clear product details validation error
  const clearProductDetailsError = useCallback(() => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.productDetails;
      return updated;
    });
  }, []);

  // Helper to update originalPersonIdsMap when deleting
  const updateOriginalPersonIdsMapOnDelete = useCallback((personIdStr: string) => {
    setOriginalPersonIdsMap((prevMap) => {
      const originalPersonId = prevMap.get(personIdStr);
      if (originalPersonId === undefined) {
        return prevMap;
      }
      setDeletedPersonIds((prev) => new Set(prev).add(originalPersonId));
      const updated = new Map(prevMap);
      updated.delete(personIdStr);
      return updated;
    });
  }, []);

  const handleDeleteProduct = (id: string | number) => {
    if (!isCreateMode && !hasEditPermission) return;
    showActionAlert(COMMON_CONSTANTS.DELETE_ALERT).then((result) => {
      if (!result.isConfirmed) return;
      
      const personIdStr = String(id);
      updateOriginalPersonIdsMapOnDelete(personIdStr);
      
      setProductDetails((prevProducts) => {
        const updatedProducts = filterAndUpdateProducts(prevProducts, personIdStr);
        if (updatedProducts.length > NUMBERMAP.ZERO) {
          clearProductDetailsError();
        }
        return updatedProducts;
      });
      
      setPersonFileMetadata((prev) => {
        const updated = { ...prev };
        delete updated[personIdStr];
        return updated;
      });
    });
  };

  const handleSaveProduct = (data: { name: string; role: string; document: (FileData | FileDocument)[]; fileData?: FinalFileData }) => {
    if (!isCreateMode && !hasEditPermission) return;
    const personId = editProductId ?? Date.now().toString();
    
    if (editProductId !== null) {
      // Edit existing product
      const updatedProducts = [...productDetails];
      const index = updatedProducts.findIndex((p) => p.id === editProductId);
      if (index !== -1) {
        updatedProducts[index] = {
          id: editProductId,
          name: data.name,
          role: data.role,
          document: data.document,
          serialNo: String(index + NUMBERMAP.ONE)
        };
        setProductDetails(updatedProducts);
        // Update file metadata for this person
        if (data.fileData) {
          setPersonFileMetadata(prev => ({ ...prev, [editProductId]: data.fileData! }));
        }
      }
    } else {
      // Add new product
      const newProduct: ProductDetailData = {
        id: personId,
        name: data.name,
        role: data.role,
        document: data.document,
        serialNo: String(productDetails.length + NUMBERMAP.ONE),
      };
      const updatedProducts = [...productDetails, newProduct];
      setProductDetails(updatedProducts);
      // Store file metadata for this person
      if (data.fileData) {
        setPersonFileMetadata(prev => ({ ...prev, [personId]: data.fileData! }));
      }
    }

    // Clear product details validation error when product is added/edited
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.productDetails;
      return updated;
    });

    // Reset form state
    setProductForm({ name: '', role: '', document: [] });
    setEditProductId(null);
    setModalOpen(false);
  };

  // Helper function to create rating change handler
  const createRatingChangeHandler = useCallback((rowId: string, ratingValue: string) => {
    return () => handleCriteriaRatingChange(rowId, ratingValue);
  }, [handleCriteriaRatingChange]);

  // Generate rating columns dynamically from API response
  const ratingColumns: GridColDef[] = React.useMemo(() => {
    if (!ratingResponse?.data || ratingResponse.data.length === NUMBERMAP.ZERO) {
      return [];
    }

    // Sort ratings by ID in ascending order (Excellent=1, Satisfied=2, Poor=3)
    const sortedRatings = [...ratingResponse.data].sort((a, b) => a.id - b.id);

    return sortedRatings.map((rating) => {
      const ratingValue = rating.rating_name.toLowerCase();
      return {
        field: ratingValue,
        headerName: rating.rating_name,
        ...RatingColumnConfig,
        renderCell: (params: GridRenderCellParams<FeedbackCriteriaData>) => {
          if (params.row.serialNo) return null;
          const rowId = params.row.id;
          const hasError = Boolean(criteriaErrors[rowId]);
          return (
            <Box sx={RatingCellStyles(hasError)}>
              <RadioButtonGroup
                name={`criteria-${rowId}`}
                label=""
                options={[{ value: ratingValue, label: "" }]}
                value={criteriaRatings[rowId] === ratingValue ? ratingValue : ""}
                onChange={createRatingChangeHandler(rowId, ratingValue)}
                disabled={!hasEditPermission}
              />
            </Box>
          );
        }
      };
    });
  }, [ratingResponse, criteriaRatings, criteriaErrors, createRatingChangeHandler, isCreateMode, hasEditPermission]);

  const feedbackCriteriaColumns: GridColDef[] = React.useMemo(() => [
    {
      field: CUSTOMER_FEEDBACK_DETAIL_TABLE_COLUMNS.SERIAL_NO,
      headerName: CUSTOMER_FEEDBACK_DETAIL_TABLE_HEADERS.SERIAL_NO,
      flex: NUMBERMAP.ONE,
      headerAlign: CUSTOMER_FEEDBACK_TABLE_ALIGNMENT.CENTER,
      renderCell: (params) => (
        <Box>
          {params.row.serialNo}
        </Box>
      )
    },
    {
      field: CUSTOMER_FEEDBACK_DETAIL_TABLE_COLUMNS.CRITERIA,
      headerName: CUSTOMER_FEEDBACK_DETAIL_TABLE_HEADERS.CRITERIA,
      flex: NUMBERMAP.FOUR,
      headerAlign: CUSTOMER_FEEDBACK_TABLE_ALIGNMENT.CENTER,
      renderCell: (params) => (
        <Box sx={CriteriaStyles(!!params.row.serialNo)}>
          {params.row.criteria}
        </Box>
      )
    },
    ...ratingColumns
  ], [ratingColumns]);

  const productDetailsColumns: GridColDef[] = React.useMemo(() => [
    { field: CUSTOMER_FEEDBACK_DETAIL_TABLE_COLUMNS.SERIAL_NO, headerName: CUSTOMER_FEEDBACK_DETAIL_TABLE_HEADERS.SERIAL_NO, flex: NUMBERMAP.ONE },
    { field: CUSTOMER_FEEDBACK_DETAIL_TABLE_COLUMNS.NAME, headerName: CUSTOMER_FEEDBACK_DETAIL_TABLE_HEADERS.NAME, flex: NUMBERMAP.TWO },
    { field: CUSTOMER_FEEDBACK_DETAIL_TABLE_COLUMNS.ROLE, headerName: CUSTOMER_FEEDBACK_DETAIL_TABLE_HEADERS.ROLE, flex: NUMBERMAP.TWO },
    {
      field: CUSTOMER_FEEDBACK_DETAIL_TABLE_COLUMNS.ACTIONS,
      headerName: CUSTOMER_FEEDBACK_DETAIL_TABLE_HEADERS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton
          onEdit={() => {
            handleEditProduct(params.row)
          }}
          onDelete={() => {
            handleDeleteProduct(params.id)
          }}
        />
      ),
    },
  ], [isCreateMode, hasEditPermission]);

  // Default action buttons - only used as fallback in create mode
  const actionButtons = isCreateMode ? [
   {action: BUTTON_LABEL.SAVE}, {action: BUTTON_LABEL.CANCEL}, {action: PERMISSION_ACTIONS.VIEW}
  ] : [];

  // Comprehensive loading state function
  const isLoading = () => {
    if (isCustomerFeedbackDetailLoading) return true
    if (isCriteriaLoading) return true
    return false
  }

  return (
    <FormContainer ref={formRef}>
      <GlobalLoader loading={isLoading()} />
      <FormWrapper>
        <Label title={customerFeedbackId ? CUSTOMER_FEEDBACK_PAGE.EDIT_TITLE : CUSTOMER_FEEDBACK_PAGE.ADD_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE_QUARTER}>
            {/* Product Selection Section */}
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.PRODUCT_GROUP}
                isDropdown
                value={form.productGroup}
                onChange={(v: string) => handleChange('productGroup', v)}
                options={productGroupResponse?.data ?? []}
                error={errors.productGroup}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.PRODUCT_CATEGORY}
                isDropdown
                value={form.productCategory}
                onChange={(v: string) => handleChange('productCategory', v)}
                options={productCategoryResponse?.data ?? []}
                error={errors.productCategory}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.PRODUCT_TYPE}
                isDropdown
                value={form.productType}
                onChange={(v: string) => handleChange('productType', v)}
                options={productTypeResponse?.data ?? []}
                error={errors.productType}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.PRODUCT_SUBTYPE}
                isDropdown
                value={form.productSubtype}
                onChange={(v: string) => handleChange('productSubtype', v)}
                options={productSubTypeResponse?.data ?? []}
                error={errors.productSubtype}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.PRODUCT_NAME}
                isDropdown
                value={form.productName}
                onChange={(v: string) => handleChange('productName', v)}
                options={productListResponse?.data ?? []}
                error={errors.productName}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.CUSTOMER_NAME}
                isDropdown
                value={form.customerName}
                onChange={(v: string) => handleChange('customerName', v)}
                options={customerResponse?.data ?? []}
                error={errors.customerName}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.ORDER_NO}
                isDropdown
                value={form.orderNo}
                onChange={(v: string) => handleChange('orderNo', v)}
                options={orderAcknowledgementResponse?.data ?? []}
                error={errors.orderNo}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              {/* Empty field for layout alignment */}
            </Grid2>

            {/* Installation Details Section */}
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.PRODUCT_SERIAL_NO}
                value={form.productSerialNo}
                onChange={(v: string) => handleChange('productSerialNo', v)}
                error={errors.productSerialNo}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={CUSTOMER_FEEDBACK_FIELDS.DATE_OF_INSTALLATION.label}
                value={form.dateOfInstallation ? dayjs(form.dateOfInstallation) : null}
                onChange={(date) => {
                  handleDateChange('dateOfInstallation', date)
                }}
                error={errors.dateOfInstallation ?? ''}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.SOURCE}
                isDropdown
                value={form.source}
                onChange={(v: string) => handleChange('source', v)}
                options={orderApprovalModeResponse?.data ?? []}
                error={errors.source}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={CUSTOMER_FEEDBACK_FIELDS.FEEDBACK_DATE.label}
                value={form.feedbackDate ? dayjs(form.feedbackDate) : null}
                onChange={(date) => {
                  handleDateChange('feedbackDate', date)
                }}
                error={errors.feedbackDate ?? ''}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.STATUS}
                isDropdown
                value={form.status_id?.toString() ?? ""}
                onChange={(value: string) => handleChange('status_id', value ? Number(value) : null)}
                error={errors.status_id ?? ''}
                options={statusData?.data ?? []}
                disabled={!hasEditPermission}
              />
            </Grid2>

            {/* Customer Feedback Criteria Section */}
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box sx={SubHeaderStyles}>
                <SubHeader title={CUSTOMER_FEEDBACK_FIELDS.SUBHEADER_CRITERIA} />
              </Box>
              {errors.criteriaRating && (
                <Box sx={ErrorStyles}>
                  {errors.criteriaRating}
                </Box>
              )}
              <DataGridTable
                rows={feedbackCriteriaData}
                columns={feedbackCriteriaColumns}
                idField={CUSTOMER_FEEDBACK_TABLE_CONFIG.FEEDBACK_CRITERIA.ID_FIELD}
                hideFooter
              />
            </Grid2>

              <DataGridTable
                showAddButton={isCreateMode || hasEditPermission}
                onAddRow={handleOpenProductModal}
                columns={productDetailsColumns}
                idField={CUSTOMER_FEEDBACK_TABLE_CONFIG.PRODUCT_DETAILS.ID_FIELD}
                rows={productDetails}
                hideFooter
                title={CUSTOMER_FEEDBACK_TABLE_CONFIG.PRODUCT_DETAILS.TITLE}
              />
               {/* Product Details Section */}
               <Grid2 size={NUMBERMAP.TWELVE}>
                  {errors.productDetails && (
                   <Box sx={ErrorStyles}>
                  {errors.productDetails}
                </Box>
              )}
            </Grid2>

            {/* Feedback Section */}
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                {...CUSTOMER_FEEDBACK_FIELDS.CAPTURED_BY}
                isDropdown
                value={form.capturedBy}
                onChange={(v: string) => handleChange('capturedBy', v)}
                options={employeeResponse?.data ?? []}
                error={errors.capturedBy}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={CUSTOMER_FEEDBACK_FIELDS.FEEDBACK.label}
                value={form.feedback}
                onChange={(value) => {
                  handleChange('feedback', value)
                }}
                placeholder={CUSTOMER_FEEDBACK_FIELDS.FEEDBACK.placeholder}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>

            {/* File Upload Section */}
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                subHeader={CUSTOMER_FEEDBACK_FIELDS.SUBHEADER_UPLOAD}
                initialFiles={(form.documents as any) ?? []}
                onFileUpload={handleFileUpload}
                onFileEdit={handleFileEdit}
                onSubmit={handleFileSubmit}
                uploadMandError={errors.fileUpload}
                hasEditable={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
          </Grid2>

          {/* Comments History */}
          {!!customerFeedbackId && (
            <Grid2 container spacing={NUMBERMAP.ONE_QUARTER} sx={ButtonContainerStyles}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <CommentsHistory 
                  comments={(customerFeedbackDetailResponse?.meta_info?.task_info?.task_comments ?? []) as any} 
                />
              </Grid2>
            </Grid2>
          )}

          <ButtonContainer sx={ButtonContainerStyles}>
            
              <SalesReviewerModalManager
                isLoading={isCustomerFeedbackDetailLoading}
                permissions={customerFeedbackDetailResponse?.meta_info?.action_control?.permissions ?? actionButtons}
                taskInfo={customerFeedbackDetailResponse?.meta_info?.task_info ?? { task_comments: [], reviewer_list: [], task_id: undefined }}
                menuId={customerFeedbackDetailResponse?.meta_info?.action_control?.menuId}
                menuName={customerFeedbackDetailResponse?.meta_info?.action_control?.formName}
                contextType={SALES_CONTEXT_TYPE.CUSTOMER_FEEDBACK}
                contextId={customerFeedbackId ?? NUMBERMAP.ZERO}
                customHandlers={{
                  handleCancel: handleCancel,
                  handleSave: handleSave,
                }}
                onPermissionChange={setHasEditPermission}
                refetch={refetchCustomerFeedback}
                hideSaveButton={false}
              /> 
           
          </ButtonContainer>
        </FormContent>

        {/* Product Details Modal */}
        <CommonModal
          onClose={() => setModalOpen(false)}
          open={modalOpen}
          title={editProductId ? CUSTOMER_FEEDBACK_MODALS.PRODUCT_DETAILS.EDIT_TITLE : CUSTOMER_FEEDBACK_MODALS.PRODUCT_DETAILS.ADD_TITLE}
        >
          <ProductDetailsModal
            onClose={() => setModalOpen(false)}
            onSave={handleSaveProduct}
            mode={editProductId ? 'edit' : 'add'}
            productId={editProductId ?? undefined}
            initialData={editProductId ? productForm : undefined}
          />
        </CommonModal>
      </FormWrapper>
    </FormContainer>
  );
};

export default CustomerFeedbackCriteriaForm;
