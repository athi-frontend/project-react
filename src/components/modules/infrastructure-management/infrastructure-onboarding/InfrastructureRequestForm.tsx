"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Grid2 } from "@mui/material";
import {
  InputField,
  ButtonGroup,
  Description,
  Label,
} from "@/components/ui";
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from "@/styles/modules/user/userOnboard";
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import { NUMBERMAP, FINALFILEINITIALDATA, radioOptions } from "@/constants/common";
import {
  ERROR_MESSAGES,
  INITIAL_FORM_DATA,
  INITIAL_ERRORS,
  API_FIELD_NAMES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_FIELD_KEYS,
  FORM_FIELD_NAMES,
  RADIO_OPTIONS,
  FILE_UPLOAD,
  BUTTON_LABELS,
  ROUTE_PATHS,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import RadioButtonGroup from "@/components/ui/radiobutton-group/RadioButtonGroup";
import { FileData } from "@/types/components/ui/fileUploadV3";
import { FileData2 } from "@/components/ui/file-upload-v2/fileUploadTypes";
import SubHeader from "../../regulation/executive-summary/SubHeader";
import DatePicker from "@/components/ui/data-picker/DataPicker";
import dayjs, { Dayjs } from "dayjs";
import { useDepartment } from "@/hooks/modules/user/useUserOnboard";
import { usePowerSupply, useInfrastructureOnboardingById, useSaveInfrastructureOnboarding, usePurchaseOrderDetails, useFrequency } from "@/hooks/modules/infrastructure-management/infrastructureOnboardingTabs";
import { useInfrastructureCategories, useInfrastructureTypes } from "@/hooks/modules/infrastructure-management/useInfrastructureRequest";
import { useOrganizationStatus } from "@/hooks/useCommonDropdown";
import { COMMON_CONSTANTS, FinalFileData, mergeFinalFileData, formatDateForAPI, formatDate } from "@/lib/utils/common";
import { ERROR_MESSAGES as FILE_UPLOAD_ERROR_MESSAGES } from "@/constants/components/ui/fileUpload";
import {
  InfrastructureFormData,
  InfrastructureRequestFormProps,
  InfrastructurePurchaseOrderDetails,
} from "@/types/modules/infrastructure-management/infrastructureOnboardingTabs";
import { useRouter } from 'next/navigation';
import { useGetPurchaseOrdersList } from "@/hooks/modules/purchase/usePurchaseOrder";

/**
 * Classification : Confidential
 **/

const InfrastructureRequestForm: React.FC<InfrastructureRequestFormProps> = ({
  infrastructureId = null,
  onSaveSuccess
}) => {
  // State for model number dropdown (still needed for PO details)
  const [modelNoOptions, setModelNoOptions] = useState<any[]>([]);
  // for the new po details hook
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState<string | number>("");
  const { data: poDetailsData } = usePurchaseOrderDetails(selectedPurchaseOrderId);

  const handlePurchaseOrderChange = (value: string) => {
    setSelectedPurchaseOrderId(value);
    setFormData((prev) => ({
      ...prev,
      purchaseOrderNumber: value,
      infrastructureCategory: "",
      infrastructureType: "",
      modelNo: "",
    }));
    setErrors((prev) => ({ ...prev, purchaseOrderNumber: "" }));
    setModelNoOptions([]);
  };

  // When PO details data loads, set model number options and prefill form
  useEffect(() => {
    if (poDetailsData?.data && poDetailsData.data.length > NUMBERMAP.ZERO) {
      const po = poDetailsData.data[NUMBERMAP.ZERO] as InfrastructurePurchaseOrderDetails;
      setModelNoOptions(
        (po.infrastructure_details ?? [])
      );
      // Prefill the form fields with the IDs from the PO (string type)
      setFormData((prev) => ({
        ...prev,
        infrastructureCategory: String(po.infrastructure_category_id ?? ""),
        infrastructureType: String(po.infrastructure_type_id ?? "")
      }));
    }
  }, [poDetailsData]);

  const [formData, setFormData] = useState<InfrastructureFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<typeof INITIAL_ERRORS>(INITIAL_ERRORS);
  const [maintenanceDate, setMaintenanceDate] = useState<Dayjs | null>(null);
  const [imageFinalFileData, setImageFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const [documentFinalFileData, setDocumentFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const router = useRouter();

  const { data: departmentData } = useDepartment();
  const { data: powerSupplyData } = usePowerSupply(NUMBERMAP.ONE);
  const { data: frequencyData } = useFrequency(NUMBERMAP.ONE);
    const { data: purchaseOrdersData, refetch: refetchPurchaseOrders } =
      useGetPurchaseOrdersList();
  const { data: statusData } = useOrganizationStatus();
  const { data: infrastructureData } = useInfrastructureOnboardingById(infrastructureId);
  const { mutate: saveInfrastructure, isPending: isSaving } = useSaveInfrastructureOnboarding();

  // Fetch infrastructure categories and types (dependent dropdown)
  const { data: categoriesData } = useInfrastructureCategories(NUMBERMAP.ONE);
  const categoryId = formData.infrastructureCategory
    ? Number(formData.infrastructureCategory)
    : undefined;
  const { data: typesData } = useInfrastructureTypes(categoryId, !!categoryId);

  const handleInputChange = (field: keyof InfrastructureFormData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when parent field changes
      if (field === "infrastructureCategory") {
        newData.infrastructureType = "";
        newData.modelNo = "";
        setModelNoOptions([]);
      }
      if (field === "infrastructureType") {
        newData.modelNo = "";
        setModelNoOptions([]);
      }
      
      return newData;
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Process file data for a specific file type
  const processInfrastructureFileData = (infrastructureFileData: FinalFileData, fileType: "upload_image" | "upload_document") => {
    const infrastructureUpdatedCreateMetaData: Record<string, any> = {};
    const infrastructureUpdatedDocumentsToCreate: File[] = [];

    function getInfrastructureFileExtension(object: File) {
      const fileName = object.name;
      return fileName.split(".").pop();
    }

    // Process documents_to_create
    infrastructureFileData.documents_to_create.forEach((fileObj) => {
      const infrastructureUuid = crypto.randomUUID();
      const infrastructureMeta = infrastructureFileData.create_meta_data[fileObj.name];
      const extension = getInfrastructureFileExtension(fileObj);
      if (infrastructureMeta) {
        const newFileName = `${infrastructureUuid}.${extension}`;
        infrastructureUpdatedCreateMetaData[newFileName] = {
          ...infrastructureMeta,
        };
        const newFile = new File([fileObj], newFileName, {
          type: fileObj.type,
        });
        infrastructureUpdatedDocumentsToCreate.push(newFile);
      }
    });

    return {
      infrastructureUpdatedCreateMetaData,
      infrastructureUpdatedDocumentsToCreate,
    };
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Process image files
    const {
      infrastructureUpdatedCreateMetaData: imageCreateMetaData,
      infrastructureUpdatedDocumentsToCreate: imageDocumentsToCreate,
    } = processInfrastructureFileData(imageFinalFileData, "upload_image");

    // Process document files
    const {
      infrastructureUpdatedCreateMetaData: documentCreateMetaData,
      infrastructureUpdatedDocumentsToCreate: documentDocumentsToCreate,
    } = processInfrastructureFileData(documentFinalFileData, "upload_document");

    // Create nested create_meta_data structure
    const createMetaData = {
      upload_image: imageCreateMetaData,
      upload_document: documentCreateMetaData,
    };

    // Create nested documents_to_delete structure
    const documentsToDelete = {
      upload_image: imageFinalFileData.documents_to_delete ?? [],
      upload_document: documentFinalFileData.documents_to_delete ?? [],
    };

    // Convert radio button values from "yes"/"no" to 1/2
    let installationProcedureValue: string | number = "";
    if (formData.installationProcedure === RADIO_OPTIONS.YES) {
      installationProcedureValue = NUMBERMAP.ONE;
    } else if (formData.installationProcedure === RADIO_OPTIONS.NO) {
      installationProcedureValue = NUMBERMAP.TWO;
    }
    let processEquipmentValue: string | number = "";
    if (formData.processEquipment === RADIO_OPTIONS.YES) {
      processEquipmentValue = NUMBERMAP.ONE;
    } else if (formData.processEquipment === RADIO_OPTIONS.NO) {
      processEquipmentValue = NUMBERMAP.TWO;
    }

    // Create FormData
    const saveFormData = new FormData();

    // Append all files to create
    [...imageDocumentsToCreate, ...documentDocumentsToCreate].forEach((file: File) => {
      if (file instanceof File) {
        saveFormData.append(API_FIELD_NAMES.DOCUMENTS_TO_CREATE, file, file.name);
      }
    });

    // Append form fields
    if (infrastructureId) {
      saveFormData.append(API_FIELD_NAMES.INFRASTRUCTURE_ID, infrastructureId.toString());
    }
    saveFormData.append(API_FIELD_NAMES.PURCHASE_ORDER_NUMBER_ID, formData.purchaseOrderNumber ?? "");
    saveFormData.append(API_FIELD_NAMES.INFRASTRUCTURE_CATEGORY_ID, formData.infrastructureCategory ?? "");
    saveFormData.append(API_FIELD_NAMES.INFRASTRUCTURE_TYPE_ID, formData.infrastructureType ?? "");
    saveFormData.append(API_FIELD_NAMES.NAME_OF_INFRASTRUCTURE, formData.infrastructureName ?? "");
    saveFormData.append(API_FIELD_NAMES.MODEL_NO_ID, formData.modelNo ?? "");
    saveFormData.append(API_FIELD_NAMES.SERIAL_NO, formData.serialNo ?? "");
    saveFormData.append(API_FIELD_NAMES.DEPARTMENT_FUNCTION_ID, formData.departmentFunction ?? "");
    saveFormData.append(API_FIELD_NAMES.DESCRIPTION_OF_PRODUCT, formData.productDescription ?? "");
    saveFormData.append(API_FIELD_NAMES.POWER_SUPPLY_ID, formData.powerSupply ?? "");
    saveFormData.append(API_FIELD_NAMES.INSTALLATION_PROCEDURE_AVAILABLE, installationProcedureValue.toString());
    saveFormData.append(API_FIELD_NAMES.PROCESS_EQUIPMENT, processEquipmentValue.toString());
    saveFormData.append(API_FIELD_NAMES.MAINTENANCE_START_DATE, formatDateForAPI(maintenanceDate) ?? "");
    saveFormData.append(API_FIELD_NAMES.SET_NOTIFICATION_ID, formData.setNotifications ?? "");
    saveFormData.append(API_FIELD_NAMES.STATUS, formData.status ?? "");

    // Append file metadata
    saveFormData.append(API_FIELD_NAMES.CREATE_META_DATA, JSON.stringify(createMetaData));
    saveFormData.append(API_FIELD_NAMES.DOCUMENTS_TO_DELETE, JSON.stringify(documentsToDelete));

    // Merge update_meta_data from both image and document (similar to clinical evaluation)
    const mergedUpdateMetaData = {
      ...imageFinalFileData.update_meta_data,
      ...documentFinalFileData.update_meta_data,
    };

    // Filter out files that are being deleted from update_meta_data
    const allDeletedFileIds = [
      ...(imageFinalFileData.documents_to_delete ?? []),
      ...(documentFinalFileData.documents_to_delete ?? []),
    ].map(id => String(id)); // Convert to strings for comparison

    // Remove deleted files from update_meta_data
    const filteredUpdateMetaData: Record<string, any> = {};
    Object.keys(mergedUpdateMetaData).forEach((fileId) => {
      if (!allDeletedFileIds.includes(fileId)) {
        const metaData = mergedUpdateMetaData[fileId];
        // Ensure metadata is a valid object
        if (metaData && typeof metaData === 'object') {
          filteredUpdateMetaData[fileId] = metaData;
        }
      }
    });

    saveFormData.append(API_FIELD_NAMES.UPDATE_META_DATA, JSON.stringify(filteredUpdateMetaData));

    // Call the mutation
    saveInfrastructure(saveFormData, {
      onSuccess: (response: any) => {
        // Reset file data
        setImageFinalFileData(FINALFILEINITIALDATA);
        setDocumentFinalFileData(FINALFILEINITIALDATA);

        // Extract infrastructure_id from response
        const savedInfrastructureId = response?.data?.[NUMBERMAP.ZERO]?.infrastructure_id;
        const savedStatus = formData.status ? Number(formData.status) : NUMBERMAP.ONE;

        // Call onSaveSuccess callback if provided
        if (onSaveSuccess && savedInfrastructureId) {
          onSaveSuccess(savedInfrastructureId, savedStatus);
        }
      },
    });
  };

  const handleCancel = () => {
    router.push(ROUTE_PATHS.INFRA_ONBOARDING);
  };

  const handleRadioChange = (field: keyof InfrastructureFormData, value: string | number) => {
    handleInputChange(field, String(value));
  };

  // Populate form data from API response
  useEffect(() => {
    if (infrastructureData?.data && infrastructureData.data.length > COMMON_CONSTANTS.EMPTY_ARRAY_LENGTH) {
      const data = infrastructureData.data[COMMON_CONSTANTS.EMPTY_ARRAY_LENGTH];

      // Extract installation procedure logic
      let installationProcedure = "";
      if (data.installation_procedure_available === NUMBERMAP.ONE) {
        installationProcedure = RADIO_OPTIONS.YES;
      } else if (data.installation_procedure_available === NUMBERMAP.TWO) {
        installationProcedure = RADIO_OPTIONS.NO;
      }

      // Extract process equipment logic
      let processEquipment = "";
      if (data.process_equipment === NUMBERMAP.ONE) {
        processEquipment = RADIO_OPTIONS.YES;
      } else if (data.process_equipment === NUMBERMAP.TWO) {
        processEquipment = RADIO_OPTIONS.NO;
      }

      // Set model number options based on fetched data
      setModelNoOptions([
        { infrastructure_detail_id: data.model_no_id, model_no: data.model_no ?? "" }
      ]);

      // Map API response to form data
      setFormData((prev) => ({
        ...prev,
        purchaseOrderNumber: data.purchase_order_number_id?.toString() ?? "",
        infrastructureCategory: data.infrastructure_category_id?.toString() ?? "",
        infrastructureType: data.infrastructure_type_id?.toString() ?? "",
        infrastructureName: data.name_of_infrastructure ?? "",
        modelNo: data.model_no_id?.toString() ?? "",
        serialNo: data.serial_number ?? "",
        departmentFunction: data.department_function_id?.toString() ?? "",
        productDescription: data.description_of_product ?? "",
        powerSupply: data.power_supply_id?.toString() ?? "",
        installationProcedure: installationProcedure,
        processEquipment: processEquipment,
        maintenanceStartDate: formatDateForAPI(data.maintenance_start_date) ?? "",
        setNotifications: data.set_notification_id?.toString() ?? "",
        status: data.status_id?.toString() ?? "",
        uploadImage: (data.upload_image ?? []) as unknown as File[],
        uploadDocument: (data.upload_document ?? []) as unknown as File[],
      }));

      // Set maintenance date
      if (data.maintenance_start_date) {
        const formattedDate = formatDateForAPI(data.maintenance_start_date);
        setMaintenanceDate(formattedDate ? dayjs(formattedDate) : null);
      }

      // Reset file final data when data is refetched (after save/delete)
      setImageFinalFileData(FINALFILEINITIALDATA);
      setDocumentFinalFileData(FINALFILEINITIALDATA);
    }
  }, [infrastructureData]);

  const handleImageFileUpload = (newFile: File | FileData) => {
    setFormData((prev: InfrastructureFormData) => ({
      ...prev,
      uploadImage: [...prev.uploadImage, newFile] as File[],
    }));
    setErrors((prev) => ({
      ...prev,
      uploadImage: "",
    }));
  };

  const handleImageFileEdit = useCallback(
    (updatedFile: File | FileData | FileData2) => {
      setFormData((prev: InfrastructureFormData) => {
        const updatedImages = prev.uploadImage.map((file: any) => {
          const currentId = file.id ?? file.file_id;
          const fileData = updatedFile as FileData2;
          const updatedId = fileData.document_id ?? fileData.id;

          return currentId === updatedId ? { ...file, ...fileData } : file;
        });

        return {
          ...prev,
          uploadImage: updatedImages as File[],
        };
      });
    },
    []
  );

  const handleDocumentFileUpload = (newFile: File | FileData) => {
    setFormData((prev: InfrastructureFormData) => ({
      ...prev,
      uploadDocument: [...prev.uploadDocument, newFile] as File[],
    }));
    setErrors((prev) => ({
      ...prev,
      uploadDocument: "",
    }));
  };

  const handleDocumentFileEdit = useCallback(
    (updatedFile: File | FileData | FileData2) => {
      setFormData((prev: InfrastructureFormData) => {
        const updatedDocuments = prev.uploadDocument.map((file: any) => {
          const currentId = file.id ?? file.file_id;
          const fileData = updatedFile as FileData2;
          const updatedId = fileData.document_id ?? fileData.id;

          return currentId === updatedId ? { ...file, ...fileData } : file;
        });

        return {
          ...prev,
          uploadDocument: updatedDocuments as File[],
        };
      });
    },
    []
  );

  // Handle file removal for both image and document
  const handleFileRemove = (data: any, fileType: "image" | "document") => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const fieldName = fileType === FILE_UPLOAD.IMAGE ? "uploadImage" : "uploadDocument";
        const updatedDocs = prev[fieldName].filter((file) => {
          const fileData = file as FileData2;
          const fileName = fileData.file?.name?.split(".")[NUMBERMAP.ZERO];
          return !data.local_files_to_delete.includes(fileName);
        });
        return {
          ...prev,
          [fieldName]: updatedDocs as File[],
        };
      });
    }
  };

  useEffect(()=>{
    refetchPurchaseOrders()
  },[])
  // Handle file deletion from database
  useEffect(() => {
    // Handle image files deletion (database files only)
    if (imageFinalFileData.documents_to_delete?.length > COMMON_CONSTANTS.EMPTY_ARRAY_LENGTH) {
      setFormData((prev) => {
        const prevData = { ...prev };
        prevData.uploadImage = (prevData.uploadImage as File[]).filter(
          (file: any) => {
            const fileId = file.file_id ?? file.id;
            return !imageFinalFileData.documents_to_delete.includes(fileId);
          }
        );
        return prevData;
      });
    }

    // Handle document files deletion (database files only)
    if (documentFinalFileData.documents_to_delete?.length > COMMON_CONSTANTS.EMPTY_ARRAY_LENGTH) {
      setFormData((prev) => {
        const prevData = { ...prev };
        prevData.uploadDocument = (prevData.uploadDocument as File[]).filter(
          (file: any) => {
            const fileId = file.file_id ?? file.id;
            return !documentFinalFileData.documents_to_delete.includes(fileId);
          }
        );
        return prevData;
      });
    }
  }, [imageFinalFileData, documentFinalFileData]);

  const handleMaintenanceDateChange = (date: Dayjs | null) => {
    setMaintenanceDate(date);
    const formattedDate = formatDate(date);
    handleInputChange("maintenanceStartDate", formattedDate ?? "");
  };

  const validateForm = () => {
    const newErrors = { ...INITIAL_ERRORS };
    let isValid = true;

    if (!formData.purchaseOrderNumber) {
      newErrors.purchaseOrderNumber = ERROR_MESSAGES.PURCHASE_ORDER_NUMBER_REQUIRED;
      isValid = false;
    }
    if (!formData.infrastructureCategory) {
      newErrors.infrastructureCategory = ERROR_MESSAGES.INFRASTRUCTURE_CATEGORY_REQUIRED;
      isValid = false;
    }
    if (!formData.infrastructureType) {
      newErrors.infrastructureType = ERROR_MESSAGES.INFRASTRUCTURE_TYPE_REQUIRED;
      isValid = false;
    }
    if (!formData.infrastructureName) {
      newErrors.infrastructureName = ERROR_MESSAGES.INFRASTRUCTURE_NAME_REQUIRED;
      isValid = false;
    }
    if (!formData.modelNo) {
      newErrors.modelNo = ERROR_MESSAGES.MODEL_NUMBER_REQUIRED;
      isValid = false;
    }
    if (!formData.serialNo) {
      newErrors.serialNo = ERROR_MESSAGES.SERIAL_NUMBER_REQUIRED;
      isValid = false;
    }
    if (!formData.departmentFunction) {
      newErrors.departmentFunction = ERROR_MESSAGES.DEPARTMENT_REQUIRED;
      isValid = false;
    }
    if (!formData.productDescription) {
      newErrors.productDescription = ERROR_MESSAGES.PRODUCT_DESCRIPTION_REQUIRED;
      isValid = false;
    }
    if (!formData.powerSupply) {
      newErrors.powerSupply = ERROR_MESSAGES.POWER_SUPPLY_REQUIRED;
      isValid = false;
    }
    newErrors.installationProcedure = "";
    newErrors.processEquipment = "";
    if (!formData.maintenanceStartDate) {
      newErrors.maintenanceStartDate = ERROR_MESSAGES.MAINTENANCE_START_DATE_REQUIRED;
      isValid = false;
    }
    if (!formData.setNotifications) {
      newErrors.setNotifications = ERROR_MESSAGES.NOTIFICATION_REQUIRED;
      isValid = false;
    }
    if (!formData.status) {
      newErrors.status = ERROR_MESSAGES.STATUS_REQUIRED;
      isValid = false;
    }

    // Validate file upload required
    if (!formData.uploadImage || formData.uploadImage.length === NUMBERMAP.ZERO) {
      newErrors.uploadImage = ERROR_MESSAGES.UPLOAD_IMAGE_REQUIRED;
      isValid = false;
    }
    if (!formData.uploadDocument || formData.uploadDocument.length === NUMBERMAP.ZERO) {
      newErrors.uploadDocument = ERROR_MESSAGES.UPLOAD_DOCUMENT_REQUIRED;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <FormContainer>
      <FormWrapper>
        <Label title={FORM_LABELS.INFRASTRUCTURE_REQUEST_DETAILS} />

        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.PURCHASE_ORDER_NUMBER}
                placeholder={FORM_PLACEHOLDERS.SELECT_PURCHASE_ORDER_NUMBER}
                isDropdown
                value={formData.purchaseOrderNumber}
                onChange={(value: string) => handlePurchaseOrderChange(value)}
                options={purchaseOrdersData?.data ?? []}
                keyField={FORM_FIELD_KEYS.PURCHASE_ORDER_ID}
                valueField={FORM_FIELD_KEYS.PURCHASE_ORDER_NUMBER}
                error={errors.purchaseOrderNumber}
              />
            </Grid2>
          </Grid2>

          <Grid2 sx={STYLE5}>
            <SubHeader title={FORM_LABELS.INFRASTRUCTURE_DETAILS} />
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_CATEGORY}
                placeholder={FORM_PLACEHOLDERS.SELECT_INFRASTRUCTURE_CATEGORY}
                isDropdown
                value={formData.infrastructureCategory}
                onChange={(value: string) => handleInputChange("infrastructureCategory", value)}
                options={categoriesData?.data ?? []}
                keyField={FORM_FIELD_KEYS.INFRASTRUCTURE_CATEGORY_ID}
                valueField={FORM_FIELD_KEYS.INFRASTRUCTURE_CATEGORY_NAME}
                error={errors.infrastructureCategory}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_TYPE}
                placeholder={FORM_PLACEHOLDERS.SELECT_INFRASTRUCTURE_TYPE}
                isDropdown
                value={formData.infrastructureType}
                onChange={(value: string) => handleInputChange("infrastructureType", value)}
                options={typesData?.data ?? []}
                keyField={FORM_FIELD_KEYS.INFRASTRUCTURE_TYPE_ID}
                valueField={FORM_FIELD_KEYS.INFRASTRUCTURE_TYPE_NAME}
                error={errors.infrastructureType}
                disabled={!formData.infrastructureCategory}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.NAME_OF_INFRASTRUCTURE}
                placeholder={FORM_PLACEHOLDERS.ENTER_NAME_OF_INFRASTRUCTURE}
                value={formData.infrastructureName}
                onChange={(value: string) => handleInputChange("infrastructureName", value)}
                error={errors.infrastructureName}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.MODEL_NO}
                placeholder={FORM_PLACEHOLDERS.SELECT_MODEL_NO}
                isDropdown
                value={formData.modelNo}
                onChange={(value: string) => handleInputChange("modelNo", value)}
                options={modelNoOptions}
                keyField={FORM_FIELD_KEYS.KEY}
                valueField={FORM_FIELD_KEYS.VALUE}
                error={errors.modelNo}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.SERIAL_NO}
                placeholder={FORM_PLACEHOLDERS.ENTER_SERIAL_NO}
                value={formData.serialNo}
                onChange={(value: string) => handleInputChange("serialNo", value)}
                error={errors.serialNo}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.DEPARTMENT_FUNCTION_NAME}
                placeholder={FORM_PLACEHOLDERS.SELECT_DEPARTMENT_FUNCTION_NAME}
                isDropdown
                keyField={FORM_FIELD_KEYS.DEPARTMENT_ID}
                valueField={FORM_FIELD_KEYS.DEPARTMENT_NAME}
                value={formData.departmentFunction}
                onChange={(value: string) => handleInputChange("departmentFunction", value)}
                options={departmentData?.data ?? []}
                error={errors.departmentFunction}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Description
                label={FORM_LABELS.DESCRIPTION_OF_PRODUCT}
                placeholder={FORM_PLACEHOLDERS.INPUT_TEXT}
                value={formData.productDescription}
                onChange={(value: string) => handleInputChange("productDescription", value)}
                error={errors.productDescription}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.POWER_SUPPLY}
                placeholder={FORM_PLACEHOLDERS.SELECT_POWER_SUPPLY}
                isDropdown
                value={formData.powerSupply}
                onChange={(value: string) => handleInputChange("powerSupply", value)}
                options={powerSupplyData?.data ?? []}
                keyField={FORM_FIELD_KEYS.ID}
                valueField={FORM_FIELD_KEYS.POWER_SUPPLY_NAME}
                error={errors.powerSupply}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RadioButtonGroup
                label={FORM_LABELS.INSTALLATION_PROCEDURE_AVAILABLE}
                name={FORM_FIELD_NAMES.INSTALLATION_PROCEDURE}
                options={radioOptions}
                value={formData.installationProcedure}
                onChange={(value: string | number) => handleRadioChange("installationProcedure", value)}
                error={errors.installationProcedure}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RadioButtonGroup
                label={FORM_LABELS.PROCESS_EQUIPMENT}
                name={FORM_FIELD_NAMES.PROCESS_EQUIPMENT}
                options={radioOptions}
                value={formData.processEquipment}
                onChange={(value: string | number) => handleRadioChange("processEquipment", value)}
                error={errors.processEquipment}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={FORM_LABELS.MAINTENANCE_START_DATE}
                value={maintenanceDate}
                onChange={handleMaintenanceDateChange}
                error={errors.maintenanceStartDate}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.SET_NOTIFICATIONS}
                placeholder={FORM_PLACEHOLDERS.SELECT_SET_NOTIFICATIONS}
                isDropdown
                value={formData.setNotifications}
                onChange={(value: string) => handleInputChange("setNotifications", value)}
                options={frequencyData?.data ?? []}
                keyField={FORM_FIELD_KEYS.ID}
                valueField={FORM_FIELD_KEYS.FREQUENCY_NAME}
                error={errors.setNotifications}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                isDropdown
                value={formData.status}
                onChange={(value: string) => handleInputChange("status", value)}
                options={statusData?.data ?? []}
                keyField={FORM_FIELD_KEYS.STATUS_ID}
                valueField={FORM_FIELD_KEYS.STATUS_NAME}
                error={errors.status}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <FileUploadManager
                initialFiles={formData.uploadImage}
                size={NUMBERMAP.SIX}
                onSubmit={(data) => {
                  setImageFinalFileData((prev) => mergeFinalFileData(prev, data));
                  handleFileRemove(data, FILE_UPLOAD.IMAGE);
                }}
                onFileEdit={handleImageFileEdit}
                onFileUpload={handleImageFileUpload}
                subHeader={FORM_LABELS.UPLOAD_IMAGE}
                allowedFileTypes={FILE_UPLOAD.IMAGE_ALLOWED_TYPES}
                supportedFormats={FILE_UPLOAD.SUPPORTED_FORMATS}
                fileTypeErrorMessage={FILE_UPLOAD_ERROR_MESSAGES.FILE_TYPE_IMAGE_NOT_SUPPORTED}
                isEditPopupOpen={true}
                uploadMandError={errors.uploadImage}
              />
            </Grid2>

            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <FileUploadManager
                initialFiles={formData.uploadDocument}
                onSubmit={(data) => {
                  setDocumentFinalFileData((prev) => mergeFinalFileData(prev, data));
                  handleFileRemove(data, FILE_UPLOAD.DOCUMENT);
                }}
                onFileEdit={handleDocumentFileEdit}
                onFileUpload={handleDocumentFileUpload}
                subHeader={FORM_LABELS.UPLOAD_DOCUMENT}
                allowedFileTypes={FILE_UPLOAD.DOCUMENT_ALLOWED_TYPES.join(',')}
                supportedFormats={FILE_UPLOAD.SUPPORTED_FORMATS}
                isEditPopupOpen={true}
                uploadMandError={errors.uploadDocument}
              />
            </Grid2>
          </Grid2>

          <ButtonGroup
            buttons={[
              { label: BUTTON_LABELS.CANCEL, onClick: handleCancel, disabled: isSaving },
              { label: BUTTON_LABELS.SAVE, onClick: handleSave, disabled: isSaving },
            ]}
          />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default InfrastructureRequestForm;