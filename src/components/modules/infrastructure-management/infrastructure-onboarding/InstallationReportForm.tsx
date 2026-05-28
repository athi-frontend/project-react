"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Grid2 } from "@mui/material";
import {
  InputField,
  ButtonGroup,
  Label,
} from "@/components/ui";
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from "@/styles/modules/user/userOnboard";
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import { NUMBERMAP, FINALFILEINITIALDATA } from "@/constants/common";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import { FileDocument } from "@/types/components/ui/fileUploadV3";
import DatePicker from "@/components/ui/data-picker/DataPicker";
import dayjs, { Dayjs } from "dayjs";
import InfoField from "../../dnd/project-info/InfoField";
import { useParams, useRouter } from "next/navigation";
import {
  useGetInstallationReport,
  useGetServiceTypes,
  useUpsertInstallationReport,
} from "@/hooks/modules/infrastructure-management/infrastructureOnboardingTabs";
import {
  InstallationReportFormData,
  InstallationReportFormErrors,
  InstallationReportFormProps,
} from "@/types/modules/infrastructure-management/infrastructureOnboardingTabs";
import {
  INSTALLATION_REPORT_ERROR_MESSAGES,
  INSTALLATION_REPORT_FIELD_KEYS,
  INSTALLATION_REPORT_LABELS,
  INSTALLATION_REPORT_INITIAL_FORM_DATA,
  INSTALLATION_REPORT_INITIAL_ERRORS,
  INSTALLATION_REPORT_ROUTES,
  INSTALLATION_REPORT_DROPDOWN_FIELDS,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";
import {
  convertMuiDayjsToUTC,
  mergeFinalFileData,
  FinalFileData,
  convertUtcToLocal,
  isDocumentUploadValid,
} from "@/lib/utils/common";
import GlobalLoader from "@/components/shared/LoadingSpinner";
import { FileData2 } from "@/components/ui/file-upload-v2/fileUploadTypes";
import { UploadedFileData } from "@/types/modules/dnd/hld";

/**
 * Classification : Confidential
 **/


const InstallationReportForm: React.FC<InstallationReportFormProps> = ({ 
  infrastructureId: propInfrastructureId = null,
  status: propStatus = null,
  onSaveSuccess
}) => {
  const params = useParams();
  const router = useRouter();
  const isCreateMode = params.id === 'create';
  const isEditMode = !!params.id && !isCreateMode;
  const infrastructureId = propInfrastructureId ?? (isEditMode && params.id ? Number(params.id) : null);

  const { data: installationReportData, isLoading: isDataLoading, isFetching: isDataFetching } =
    useGetInstallationReport( infrastructureId ?? null);
  const { data: serviceTypesData, isLoading: isServiceTypesLoading } =
    useGetServiceTypes();
  const { mutate: upsertInstallationReport, isPending: isSavePending } =
    useUpsertInstallationReport();

  const [formData, setFormData] =
    useState<InstallationReportFormData>({
      ...INSTALLATION_REPORT_INITIAL_FORM_DATA,
      infrastructure_id: infrastructureId,
      documents: [],
    });
  const [errors, setErrors] = useState<InstallationReportFormErrors>({
    ...INSTALLATION_REPORT_INITIAL_ERRORS,
  });
  const [dateOfInstallation, setDateOfInstallation] = useState<Dayjs | null>(null);
  const [dateOfReceipt, setDateOfReceipt] = useState<Dayjs | null>(null);
  const [finalFileData, setFinalFileData] =
    useState<FinalFileData>(FINALFILEINITIALDATA);

  const installationReport = installationReportData?.data?.[NUMBERMAP.ZERO] ?? null;

  useEffect(() => {
    if (installationReport) {
      setFormData({
        ...installationReport,
        infrastructure_id: infrastructureId,
        status: installationReport.status_id ?? null,
        location: installationReport.location ?? '',
        documents: (installationReport.documents ?? []) as unknown as File[] | FileDocument[],
      });

      if (installationReport.date_of_installation) {
        const installationDate = dayjs(installationReport.date_of_installation);
        setDateOfInstallation(installationDate.isValid() ? installationDate : null);
      }

      if (installationReport.date_of_receipt) {
        const receiptDate = dayjs(installationReport.date_of_receipt);
        setDateOfReceipt(receiptDate.isValid() ? receiptDate : null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        infrastructure_id: infrastructureId,
      }));
    }
  }, [installationReport, infrastructureId]);

  const handleInputChange = (
    field: keyof InstallationReportFormData,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDateOfInstallationChange = (date: Dayjs | null) => {
    setDateOfInstallation(date);
    const utcDate = convertMuiDayjsToUTC(date);
    handleInputChange(
      INSTALLATION_REPORT_FIELD_KEYS.DATE_OF_INSTALLATION,
      utcDate ?? ""
    );
  };

  const handleDateOfReceiptChange = (date: Dayjs | null) => {
    setDateOfReceipt(date);
    const utcDate = convertMuiDayjsToUTC(date);
    handleInputChange(
      INSTALLATION_REPORT_FIELD_KEYS.DATE_OF_RECEIPT,
      utcDate ?? ""
    );
  };

  const handleInstalledByChange = (value: string) => {
    const installedById = value ? Number(value) : null;
    handleInputChange(
      INSTALLATION_REPORT_FIELD_KEYS.INSTALLED_BY_ID,
      installedById
    );
  };

  const handleFileUpload = (newFile: File | FileData2) => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newFile] as File[] | FileDocument[],
    }));
  };

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      setFormData((prev) => {
        const updatedFiles = prev.documents.map((file) => {
          const currentId =
            typeof file === "object" && "file_id" in file
              ? file.file_id
              : undefined;
          const updatedId = updatedFile.document_id ?? updatedFile.id;

          return currentId === updatedId ? { ...file, ...updatedFile } : file;
        });

        return {
          ...prev,
          documents: updatedFiles as File[] | FileDocument[],
        };
      });
    },
    []
  );

  const validateForm = () => {
    const newErrors = { ...INSTALLATION_REPORT_INITIAL_ERRORS } as InstallationReportFormErrors;
    let isValid = true;

    if (!formData.date_of_installation) {
      newErrors.date_of_installation =
        INSTALLATION_REPORT_ERROR_MESSAGES.DATE_OF_INSTALLATION_REQUIRED;
      isValid = false;
    }
    if (!formData.installed_by_id) {
      newErrors.installed_by_id =
        INSTALLATION_REPORT_ERROR_MESSAGES.INSTALLED_BY_REQUIRED;
      isValid = false;
    }
    if (!formData.date_of_receipt) {
      newErrors.date_of_receipt =
        INSTALLATION_REPORT_ERROR_MESSAGES.DATE_OF_RECEIPT_REQUIRED;
      isValid = false;
    }
    if (!formData.location?.trim()) {
      newErrors.location = INSTALLATION_REPORT_ERROR_MESSAGES.LOCATION_REQUIRED;
      isValid = false;
    }
     if (!isDocumentUploadValid(finalFileData,formData.documents)) {
      newErrors.fileUpload = INSTALLATION_REPORT_ERROR_MESSAGES.FILE_UPLOAD_REQUIRED;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm() || !infrastructureId) return;

    const form = new FormData();
    form.append(
      INSTALLATION_REPORT_FIELD_KEYS.INFRASTRUCTURE_ID,
      infrastructureId.toString()
    );

    if (formData.date_of_installation) {
      form.append(
        INSTALLATION_REPORT_FIELD_KEYS.DATE_OF_INSTALLATION,
        formData.date_of_installation
      );
    }

    if (formData.installed_by_id) {
      form.append(
        INSTALLATION_REPORT_FIELD_KEYS.INSTALLED_BY_ID,
        formData.installed_by_id.toString()
      );
    }

    if (formData.date_of_receipt) {
      form.append(
        INSTALLATION_REPORT_FIELD_KEYS.DATE_OF_RECEIPT,
        formData.date_of_receipt
      );
    }

    if (formData.location) {
      form.append(INSTALLATION_REPORT_FIELD_KEYS.LOCATION, formData.location);
    }

    const statusToUse = propStatus ?? NUMBERMAP.ONE;
    form.append(INSTALLATION_REPORT_FIELD_KEYS.STATUS, statusToUse.toString());

    if (finalFileData?.documents_to_delete) {
      form.append(
        INSTALLATION_REPORT_FIELD_KEYS.DOCUMENTS_TO_DELETE,
        JSON.stringify(finalFileData.documents_to_delete)
      );
    }

    if (finalFileData?.create_meta_data) {
      form.append(
        INSTALLATION_REPORT_FIELD_KEYS.CREATE_META_DATA,
        JSON.stringify(finalFileData.create_meta_data)
      );
    }

    if (finalFileData?.update_meta_data) {
      form.append(
        INSTALLATION_REPORT_FIELD_KEYS.UPDATE_META_DATA,
        JSON.stringify(finalFileData.update_meta_data)
      );
    }

    if (finalFileData.documents_to_create && finalFileData.documents_to_create.length > NUMBERMAP.ZERO) {
      finalFileData.documents_to_create.forEach((fileData: any) => {
        if (fileData instanceof File) {
          form.append(
            INSTALLATION_REPORT_FIELD_KEYS.DOCUMENTS_TO_CREATE,
            fileData,
            fileData.name
          );
        }
      });
    }

    upsertInstallationReport(
      { formData: form },
      {
        onSuccess: () => {
          setFinalFileData(FINALFILEINITIALDATA);
          onSaveSuccess?.();
          if (!propInfrastructureId && (isCreateMode || isEditMode)) {
            router.push(INSTALLATION_REPORT_ROUTES.GRID_PAGE);
          }
        },
      }
    );
  };

  const handleCancel = () => {
    router.push(INSTALLATION_REPORT_ROUTES.GRID_PAGE);
  };

  const isAnyLoading = () => {
    if (isDataLoading) return true;
    if (isDataFetching) return true;
    if (isServiceTypesLoading) return true;
    if (isSavePending) return true;
    return false;
  };

  return (
    <FormContainer>
      <GlobalLoader loading={isAnyLoading()} />
      <FormWrapper>
        <Label title={INSTALLATION_REPORT_LABELS.INSTALLATION_REPORT} />

        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={installationReport?.infrastructure_name ?? ""}
                label={INSTALLATION_REPORT_LABELS.INFRASTRUCTURE_NAME}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={installationReport?.serial_no ?? ""}
                label={INSTALLATION_REPORT_LABELS.SERIAL_NO}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value="" label={INSTALLATION_REPORT_LABELS.MANUFACTURER} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField value={installationReport?.supplier ?? ""} label={INSTALLATION_REPORT_LABELS.SUPPLIER} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={installationReport?.po_number ?? ""}
                label={INSTALLATION_REPORT_LABELS.PO_NO}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={
                  installationReport?.po_date
                    ? convertUtcToLocal(installationReport.po_date)
                    : ""
                }
                label={INSTALLATION_REPORT_LABELS.PO_DATE}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={installationReport?.invoice_no ?? ""}
                label={INSTALLATION_REPORT_LABELS.INVOICE_NO}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={
                  installationReport?.invoice_date
                    ? convertUtcToLocal(installationReport.invoice_date)
                    : ""
                }
                label={INSTALLATION_REPORT_LABELS.INVOICE_DATE}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={installationReport?.model_no ?? ""}
                label={INSTALLATION_REPORT_LABELS.MODEL_NO}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={installationReport?.function ?? ""}
                label={INSTALLATION_REPORT_LABELS.FUNCTION}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={INSTALLATION_REPORT_LABELS.DATE_OF_INSTALLATION}
                value={dateOfInstallation}
                onChange={handleDateOfInstallationChange}
                error={errors.date_of_installation}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={INSTALLATION_REPORT_LABELS.INSTALLED_BY}
                placeholder={INSTALLATION_REPORT_LABELS.SELECT_INSTALLED_BY}
                isDropdown
                value={
                  formData.installed_by_id
                    ? formData.installed_by_id.toString()
                    : ""
                }
                onChange={handleInstalledByChange}
                options={serviceTypesData?.data ?? []}
                error={errors.installed_by_id}
                keyField={INSTALLATION_REPORT_DROPDOWN_FIELDS.INSTALLED_BY.KEY_FIELD}
                valueField={INSTALLATION_REPORT_DROPDOWN_FIELDS.INSTALLED_BY.VALUE_FIELD}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={INSTALLATION_REPORT_LABELS.DATE_OF_RECEIPT}
                value={dateOfReceipt}
                onChange={handleDateOfReceiptChange}
                error={errors.date_of_receipt}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={INSTALLATION_REPORT_LABELS.LOCATION}
                placeholder={INSTALLATION_REPORT_LABELS.ENTER_LOCATION}
                value={formData.location ?? ''}
                onChange={(value: string) =>
                  handleInputChange(INSTALLATION_REPORT_FIELD_KEYS.LOCATION, value)
                }
                error={errors.location}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
              <FileUploadManager
                initialFiles={formData?.documents ?? []}
                onFileUpload={handleFileUpload as any}
                onFileEdit={handleFileEdit as any}
                onSubmit={(data) => {
                  setFinalFileData((prev) => mergeFinalFileData(prev, data));
                  if(errors.fileUpload){
                  setErrors((prev) => ({ ...prev, fileUpload: "" }));
                  }
                }}
                subHeader={INSTALLATION_REPORT_LABELS.UPLOAD}
                uploadMandError={errors?.fileUpload ?? ''}
              />
            </Grid2>
          </Grid2>

          <ButtonGroup
            buttons={[
              { label: INSTALLATION_REPORT_LABELS.CANCEL, onClick: handleCancel },
              { label: INSTALLATION_REPORT_LABELS.SAVE, onClick: handleSave, disabled: isSavePending },
            ]}
          />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default InstallationReportForm;
