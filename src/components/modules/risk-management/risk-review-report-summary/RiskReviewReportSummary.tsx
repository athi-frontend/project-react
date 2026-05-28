'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Grid2 } from '@mui/material'
import {
  ButtonGroup,
  RadioButtonGroup,
  RichTextEditor,
  Label,
} from '@/components/ui'
import {
  BUTTON_LABEL,
  NUMBERMAP,
  FINALFILEINITIALDATA,
  KEY,
  DRAFT,
} from '@/constants/common'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import { FormRow } from '@/styles/modules/dnd/hld'
import {
  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS,
  RISK_REVIEW_REPORT_SUMMARY_FIELD_ORDER,
} from '@/constants/modules/risk-management/riskReviewReportSummary'

const { FILE_FIELDS, FIELD_NAMES } = RISK_REVIEW_REPORT_SUMMARY_CONSTANTS
import {
  useRiskReviewReportSummary,
  useUpsertRiskReviewReportSummary,
} from '@/hooks/modules/risk-management/useRiskReviewReportSummary'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import { mergeFinalFileData, FinalFileData } from '@/lib/utils/common'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { processDraftPreparation, removeFieldsFromFormData, appendFileMetadataToFormData, createFileMetadataGenerator } from '@/lib/utils/modules/sales/draftSaveCommon'

/**
 * Classification: Confidential
 */

const RiskReviewReportSummary: React.FC = () => {
  const router = useRouter()
  const { id } = useParams()
  const projectId = Number(id)

  const { data: summaryData, isLoading } = useRiskReviewReportSummary(projectId)
  const upsertMutation = useUpsertRiskReviewReportSummary(projectId)

  const [formData, setFormData] = useState<{
    summary: string
    riskReviewed: string
    medicalBenefit: string
    medicalBenefitRequired: string
  }>({
    summary: '',
    riskReviewed: '',
    medicalBenefit: '',
    medicalBenefitRequired: '',
  })

  const [errors, setErrors] = useState<{
    summary?: string
    riskReviewed?: string
    medicalBenefit?: string
    medicalBenefitRequired?: string
  }>({})

  const [fileFinalData, setFileFinalData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  const [initialFiles, setInitialFiles] = useState<FileDocument[]>([])
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>(
    {}
  )
  const [draftDelete, setDraftDelete] = useState<string[]>([])
  const isInitialDataLoad = useRef(true)

  const {
    draftSave,
    clearDraftSave,
    isFetchingDraft,
    isDraftSaving,
    checkUnsavedDraftBeforeLeave,
  } = useDraftSave({
    context_instance_id: projectId,
    enableFetch: false,
  })

  const handleDraftSave = (formDataToSave: any, fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? fileFinalData
    let draftDatas =  summaryData
    const draftConfig = {
      fileFieldToSectionMap: { supporting_files: FILE_FIELDS.SUPPORTING_FILES },
      sectionTypeToNameMap: { supporting_files: FILE_FIELDS.SUPPORTING_FILES },
      responseDataKeyMap: { supporting_files: FILE_FIELDS.SUPPORTING_FILES },
    }

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      {
        ...formDataToSave,
        documents: initialFiles ?? [],
      },
      { supporting_files: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )
    setDraftDelete(draftPreparation?.draftDelete??[])
    setDraftDocuments(draftPreparation?.draftDocuments??[])
    processDraftPreparation(draftPreparation, setDraftDocuments, setDraftDelete)

    const fieldsToRemove = [FILE_FIELDS.SUPPORTING_FILES]
    const cleaned = removeFieldsFromFormData(formDataToSave, fieldsToRemove)

    const payload = {
      id: projectId,
      ...cleaned,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      type: DRAFT,
    }
    draftSave({
      form_type: KEY,
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

  const createFileMetadata = createFileMetadataGenerator({
    isEditMode: true,
    draftData: summaryData,
    existingData: summaryData,
    finalFileData: fileFinalData,
    dataPath:FILE_FIELDS.SUPPORTING_FILES,
  })

  const loadDraftData = (data: any) => {
    setFormData({
      summary: data?.summary ?? '',
      riskReviewed: data?.riskReviewed ?? data?.risk_reviewed ?? '',
      medicalBenefit: data?.medicalBenefit ?? data?.medical_benefit ?? '',
      medicalBenefitRequired:
        data?.medicalBenefitRequired ?? data?.medical_benefit_required ?? '',
    })
    setDraftDocuments(data?.draftDocuments ?? {})
    setDraftDelete( data?.draftDelete ?? [])
    const documents = [
      ...(data?.draftDocuments?.supporting_files ?? []),
      ...(data?.supporting_files ?? []),
      ...(data?.documents ?? []),
    ]
    setInitialFiles(documents)
  }

  useEffect(() => {
    if (summaryData?.data) {
      const data = summaryData.data;
      if (data && typeof data === 'object' && (data as any).type === DRAFT) {
        loadDraftData(data)
      } else if (data?.length > NUMBERMAP.ZERO) {
        const dataItem = data[NUMBERMAP.ZERO]
        setFormData({
          summary: dataItem?.summary ?? '',
          riskReviewed: dataItem?.risk_reviewed ?? '',
          medicalBenefit: dataItem?.medical_benefit ?? '',
          medicalBenefitRequired: dataItem?.medical_benefit_required ?? '',
        })

        const documents = Array.isArray(dataItem.supporting_files)
          ? dataItem.supporting_files
          : []
        setInitialFiles(documents)
      }
    }
    // Set initial load to false after all data is loaded
    setTimeout(() => {
      isInitialDataLoad.current = false
    }, NUMBERMAP.THREETHOUSAND)
  }, [summaryData])

  const resetFormState = () => {
    isInitialDataLoad.current = true
    setErrors({});
    setFileFinalData(FINALFILEINITIALDATA);
    setDraftDocuments({});
    setDraftDelete([]);
    setInitialFiles([]);
  }

  const handleFileRemove = (data: FinalFileData) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setInitialFiles((prev) =>
        prev.filter((file) => {
          const fileObj = Array.isArray(file.file)
            ? file.file[NUMBERMAP.ZERO]
            : file.file
          const fileName = fileObj?.name ?? file?.name ?? ''
          return !data.local_files_to_delete.includes(
            fileName.split('.')[NUMBERMAP.ZERO]
          )
        })
      )
    }
  }

  const handleFileUpload = (file: any) => {
    setInitialFiles((prev) => {
      const updated = [...prev, file]
      return updated
    })
  }

  const handleFileEdit = (file: any) => {
    setInitialFiles((prev) => {
      const updated = prev.map((f: any) => {
        const currentId =
          f?.file_id ??
          f?.id ??
          f?.document_id ??
          f?.fk_eqms_file_id
        const updatedId =
          file?.file_id ??
          file?.id ??
          file?.document_id ??
          file?.fk_eqms_file_id
        return currentId === updatedId ? { ...f, ...file } : f
      })
      return updated
    })
  }

  const handleFileUploadSubmit = (fileData: any) => {
    setFileFinalData((prev) => mergeFinalFileData(prev, fileData))
    if (!isInitialDataLoad.current) {
      handleDraftSave(formData, mergeFinalFileData(fileFinalData, fileData))
    }
    handleFileRemove(fileData)
  }

  const handleChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    const stringValue = String(value)
    setFormData((prev) => {
      const newData = { ...prev, [field]: stringValue }
      if (!isInitialDataLoad.current) {
        handleDraftSave(newData)
      }
      return newData
    })

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }

    if (
      field === FIELD_NAMES.RISK_REVIEWED &&
      stringValue !== RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.VALUES.ACCEPTABLE
    ) {
      setErrors((prev) => ({
        ...prev,
        medicalBenefit: '',
        medicalBenefitRequired: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {
      summary?: string
      riskReviewed?: string
      medicalBenefit?: string
      medicalBenefitRequired?: string
    } = {}

    if (!formData.summary.trim()) {
      newErrors.summary =
        RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.VALIDATION_MESSAGES.SUMMARY_REQUIRED
    }

    if (!formData.riskReviewed) {
      newErrors.riskReviewed =
        RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.VALIDATION_MESSAGES.RISK_REVIEWED_REQUIRED
    }

    if (
      formData.riskReviewed ===
      RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.VALUES.ACCEPTABLE
    ) {
      if (!formData.medicalBenefit.trim()) {
        newErrors.medicalBenefit =
          RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.VALIDATION_MESSAGES.MEDICAL_BENEFIT_REQUIRED
      }

      if (!formData.medicalBenefitRequired) {
        newErrors.medicalBenefitRequired =
          RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.VALIDATION_MESSAGES.MEDICAL_BENEFIT_REQUIRED_FIELD_REQUIRED
      }
    }

    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === NUMBERMAP.ZERO

    if (!isValid) {
      let fieldOrder = [...RISK_REVIEW_REPORT_SUMMARY_FIELD_ORDER]

      if (
        formData.riskReviewed !==
        RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.VALUES.ACCEPTABLE
      ) {
        fieldOrder = fieldOrder.filter(
          (field) =>
            field !==
              RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FIELD_NAMES
                .MEDICAL_BENEFIT &&
            field !==
              RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FIELD_NAMES
                .MEDICAL_BENEFIT_REQUIRED
        )
      }

      validateAndFocusFirstEmptyField(
        formData,
        fieldOrder,
        RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FIELD_LABEL_MAP
      )
    }

    return isValid
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }
    const saveFormData = new FormData()
    saveFormData.append(
      RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FORM_KEYS.PROJECT_ID,
      String(projectId)
    )
    saveFormData.append(
      RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FORM_KEYS.SUMMARY,
      formData.summary
    )
    saveFormData.append(
      RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FORM_KEYS.RISK_REVIEWED,
      formData.riskReviewed
    )
    saveFormData.append(
      RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FORM_KEYS.MEDICAL_BENEFIT,
      formData.medicalBenefit.trim()
    )
    saveFormData.append(
      RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FORM_KEYS.MEDICAL_BENEFIT_REQUIRED,
      formData.medicalBenefitRequired ?? String(null)
    )

    appendFileMetadataToFormData(saveFormData, fileFinalData, createFileMetadata)
    clearDraftSave()

    upsertMutation.mutate(saveFormData, {
      onSuccess: () => {
        resetFormState();
      },
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(APPLICABILITY_ROUTES.RISK_MANAGEMENT)
  }

  const buttons = [
    {
      label: BUTTON_LABEL.BACK,
      onClick: handleCancel,
    },
    {
      label: BUTTON_LABEL.SAVE,
      onClick: handleSave,
      disabled: upsertMutation.isPending,
    },
  ]

  const isAnyLoading = () => {
    if (isLoading) return true
    if (upsertMutation.isPending) return true
    if (isFetchingDraft) return true
    return false
  }

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isAnyLoading()} />
      <FormWrapper>
        <Label title={RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.LABELS.SUMMARY}
                placeholder={
                  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.PLACEHOLDERS.SUMMARY
                }
                value={formData.summary}
                onChange={(value) =>
                  handleChange(
                    FIELD_NAMES.SUMMARY as keyof typeof formData,
                    value
                  )
                }
                error={errors.summary}
                id={RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.LABELS.SUMMARY}
              />
            </Grid2>

            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RadioButtonGroup
                label={
                  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.LABELS.RISK_REVIEWED
                }
                name={
                  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FORM_KEYS.RISK_REVIEWED
                }
                options={
                  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.RADIO_OPTIONS.ACCEPTABLE
                }
                value={formData.riskReviewed}
                onChange={(value) =>
                  handleChange(
                    FIELD_NAMES.RISK_REVIEWED as keyof typeof formData,
                    value
                  )
                }
                error={errors?.riskReviewed ?? ''}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={
                  formData.riskReviewed ===
                  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.VALUES.ACCEPTABLE
                    ? `${RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.LABELS.MEDICAL_BENEFIT}*`
                    : RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.LABELS.MEDICAL_BENEFIT
                }
                placeholder={
                  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.PLACEHOLDERS
                    .MEDICAL_BENEFIT
                }
                value={formData.medicalBenefit}
                onChange={(value) =>
                  handleChange(
                    FIELD_NAMES.MEDICAL_BENEFIT as keyof typeof formData,
                    value
                  )
                }
                error={errors.medicalBenefit}
                id={RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.LABELS.MEDICAL_BENEFIT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RadioButtonGroup
                label={
                  formData.riskReviewed ===
                  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.VALUES.ACCEPTABLE
                    ? `${RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.LABELS.MEDICAL_BENEFIT_REQUIRED}*`
                    : RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.LABELS
                        .MEDICAL_BENEFIT_REQUIRED
                }
                name={
                  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FORM_KEYS
                    .MEDICAL_BENEFIT_REQUIRED
                }
                options={
                  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.RADIO_OPTIONS.YES_NO
                }
                value={formData.medicalBenefitRequired}
                onChange={(value) =>
                  handleChange(
                    FIELD_NAMES.MEDICAL_BENEFIT_REQUIRED as keyof typeof formData,
                    value
                  )
                }
                error={errors?.medicalBenefitRequired ?? ''}
              />
            </Grid2>
          </Grid2>
          <FormRow>
            <FileUploadManager
              subHeader={
                RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.LABELS.FILE_UPLOAD
              }
              initialFiles={initialFiles}
              onFileUpload={(file: any) => {
                if (file?.file instanceof File) {
                  handleFileUpload(file.file)
                } else {
                  handleFileUpload(file)
                }
              }}
              onFileEdit={handleFileEdit}
              onSubmit={handleFileUploadSubmit}
            />
          </FormRow>
          <ButtonGroup buttons={buttons} />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default RiskReviewReportSummary
