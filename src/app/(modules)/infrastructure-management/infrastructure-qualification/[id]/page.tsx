'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Box, Grid2 } from '@mui/material'
import {
  RichTextEditor,
  InputField,
  DataTable,
  Label,
  showActionAlert,
  RadioButtonGroup,
} from '@/components/ui'
import SalesReviewerModalManager from '@/components/modules/sales/reviewer-modal/SalesReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { INFRASTRUCTURE_CONTEXT_TYPE } from '@/constants/commonContextType'
import { GridColDef } from '@mui/x-data-grid'
import { NUMBERMAP, STATUS ,PERMISSION_ACTIONS} from '@/constants/common'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import { ButtonContainer } from '@/styles/components/ui/button'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { useParams, useRouter } from 'next/navigation'
import dayjs, { Dayjs } from 'dayjs'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { removeFieldsFromFormData } from '@/lib/utils/modules/sales/draftSaveCommon'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import {
  useInfrastructureQualificationById,
  useUpsertInfrastructureQualification,
  useQualificationChecklistByInfrastructureId,
} from '@/hooks/modules/infrastructure-management/useInfrastructureQualification'
import {
  useInfrastructureCategories,
  useInfrastructureTypes,
  useInfrastructureSerialNumbers,
  useMaintenancePlans,
} from '@/hooks/modules/infrastructure-management/useCommonDropdown'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import {
  INFRASTRUCTURE_QUALIFICATION,
  ERROR_MESSAGES,
  INITIAL_FORM_DATA,
  INITIAL_ERRORS,
  VERIFICATION_RESULT_VALUES,
  BUTTON_LABELS,
  PAGE_TITLES,
  PLACEHOLDERS,
  FORM_LABELS,
  TABLE_COLUMN_HEADERS,
  FORM_FIELD_NAMES,
  KEY_FIELDS,
  VALUE_FIELDS,
  ROUTES,
  TABLE_COLUMN_FIELDS,
  Error_Style,
} from '@/constants/modules/infrastructure-management/infrastructureQualification'
import { ErrorText, GRID_STYLES } from '@/styles/common'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { CREATE } from '@/constants/modules/hr/candidateEvaluation'
import { InfrastructureQualificationTableData } from '@/types/modules/infrastructure-management/infrastructureQualification'
import { stripHtml } from '@/lib/utils/common'

/**
    Classification : Confidential
**/

const InfrastructureQualificationForm: React.FC = () => {
  const { id } = useParams()
  const qualification_id = !isNaN(Number(id)) ? Number(id) : null
  const isAddMode = id === CREATE
  const isCreateMode = isAddMode
  const initialDraftLoading = useRef(true)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const router = useRouter()
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false)
  const {
    data: infraQualificationData,
    isLoading: isInfraQualificationLoading,
    refetch: refetchInfrastructureQualification,
  } = useInfrastructureQualificationById(qualification_id)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [qualificationTableData, setQualificationTableData] = useState<InfrastructureQualificationTableData[]>([])
  const [qualificationTableError, setQualificationTableError] = useState<string>('')
  const { data: maintenancePlansData, isLoading: isMaintenancePlansLoading } = useMaintenancePlans()
  const { data: statusData, isLoading: isStatusLoading } = useOrganizationStatus()
  const { mutate: upsertInfrastructureQualification } = useUpsertInfrastructureQualification()

  // Draft save hook
  const qualificationIdForDraft = isAddMode ? null : qualification_id
  const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: INFRASTRUCTURE_QUALIFICATION.CONTEXT_TYPE,
    context_instance_id: qualificationIdForDraft,
    enableFetch: false
  })

  // Fetch qualification checklist by infrastructure ID
  const infrastructureId = formData.infrastructure_id ? Number(formData.infrastructure_id) : null
  const { data: qualificationChecklistData,  isLoading: isQualificationChecklistLoading} = useQualificationChecklistByInfrastructureId(infrastructureId, isAddMode)

  // Fetch infrastructure categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useInfrastructureCategories()

  // Fetch infrastructure types based on selected category
  const selectedCategoryId = formData.infrastructure_category_id ? Number(formData.infrastructure_category_id) : undefined
  const { data: typesData, isLoading: isTypesLoading } = useInfrastructureTypes(selectedCategoryId)

  // Fetch serial numbers based on selected type
  const selectedTypeId = formData.infrastructure_type_id ? Number(formData.infrastructure_type_id) : undefined
  const { data: serialNumbersData, isLoading: isSerialNumbersLoading } = useInfrastructureSerialNumbers(selectedTypeId)

  // Helper function to load form data from API response
  const loadFormDataFromApi = (data: any) => {
    if (!data) return
    setFormData({
      ...data,
      inspection_done_by: data.maintenance_service_type_lk_id ?? '',
      infrastructure_id: data.infrastructure_id ?? '',
      inspection_date: data.inspection_date
        ? dayjs(data.inspection_date)
        : null,
    })
    setQualificationTableData(data.infrastructure_qualification ?? [])
  }

  // Fetch draft on mount
  useEffect(() => {
    fetchDraft()
  }, [qualification_id, fetchDraft])

  const loadDraftData = (data: any) => {
    setFormData({
      ...data,
      inspection_date: data.inspection_date ? dayjs(data.inspection_date) : null,
    })
    if (data.qualificationTableData && Array.isArray(data.qualificationTableData) && data.qualificationTableData.length > NUMBERMAP.ZERO) {
      setQualificationTableData(data.qualificationTableData)
    } else if ((data.infrastructure_qualification && Array.isArray(data.infrastructure_qualification) && data.infrastructure_qualification.length > NUMBERMAP.ZERO)) {
      setQualificationTableData(data.qualificationTableData ?? data.infrastructure_qualification)
    }
  }

  // Update form data when API data is loaded (for edit mode)
  useEffect(() => {
    if (infraQualificationData?.data) {
      if (Array.isArray(infraQualificationData.data) && infraQualificationData?.data?.length > NUMBERMAP.ZERO) {
        loadFormDataFromApi(infraQualificationData?.data[NUMBERMAP.ZERO])
       
      } else if (!Array.isArray(infraQualificationData?.data)) {
        loadDraftData(infraQualificationData?.data)
       
      }
    }
 
  }, [infraQualificationData])

  // Load draft data
  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData])

  // Initialize hasEditPermission based on mode
  // In create mode, user has edit permission by default
  // In edit mode, wait for workflow permissions to be loaded via onPermissionChange
  useEffect(() => {
    // Only set permission in create mode - in edit mode, let workflow manager set it via onPermissionChange
    if (isCreateMode) {
      setHasEditPermission(true)
    }
    setTimeout(()=>{
      initialDraftLoading.current = false
    },NUMBERMAP.THREETHOUSAND)
    // In edit mode, don't override - workflow manager will set it based on actual permissions
  }, [isCreateMode])

  //set qualification table data in create
  useEffect(() => {
    if(qualificationChecklistData?.data && Array.isArray(qualificationChecklistData?.data)){
      const data = qualificationChecklistData?.data[NUMBERMAP.ZERO]
      setFormData((prev) => ({
        ...prev,
        infrastructure_qualification_checklist_id: data?.qualification_checklist_id,
        infrastructure_name: data?.infrastructure_name ?? '',
      }))
      setQualificationTableData(data?.qualification_checklist ?? [])
    }
  }, [qualificationChecklistData])

  const handleDraftSave = (formDataToSave: typeof INITIAL_FORM_DATA, tableDataToSave?: InfrastructureQualificationTableData[]) => {
    const tableDataToUse = tableDataToSave ?? qualificationTableData

    const cleaned = removeFieldsFromFormData(formDataToSave, [])

    const payload = {
      id: qualificationIdForDraft ?? Date.now(),
      ...cleaned,
      qualificationTableData: tableDataToUse,
      type: 'draft',
    }

    draftSave({
      form_type: INFRASTRUCTURE_QUALIFICATION.CONTEXT_TYPE,
      form_data: payload,
    })
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (!isCreateMode && !hasEditPermission) return
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // Reset dependent fields when parent field changes
      if (field === FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY_ID) {
        updated.infrastructure_type_id = ''
        updated.serial_number = ''
      } else if (field === FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE_ID) {
        updated.serial_number = ''
      }
      if (!initialDraftLoading.current) {
        handleDraftSave(updated)
      }
      return updated
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleDateChange = (date: Dayjs | null) => {
    if (!isCreateMode && !hasEditPermission) return
    setFormData((prev) => {
      const updated = { ...prev, [FORM_FIELD_NAMES.INSPECTION_DATE]: date }
      if (!initialDraftLoading.current) {
        handleDraftSave(updated)
      }
      return updated
    })
    setErrors((prev) => ({ ...prev, [FORM_FIELD_NAMES.INSPECTION_DATE]: '' }))
  }

  const updateTestObservation = (
    checklistItemId: number,
    observation: string
  ) => {
    if (!isCreateMode && !hasEditPermission) return
    setQualificationTableData((prev) => {
      const updatedData = prev.map((item) => {
        if (item.qualification_checklist_items_id === checklistItemId) {
          return { ...item, test_observation: observation }
        }
        return item
      })
      if (!initialDraftLoading.current) {
        handleDraftSave(formData, updatedData)
      }
      return updatedData
    })
    if (observation && observation.trim() !== '') {
      setQualificationTableError('')
    }
  }

  const updateVerificationResult = (
    checklistItemId: number,
    result: string | number
  ) => {
    if (!isCreateMode && !hasEditPermission) return
    setQualificationTableData((prev) => {
      const updatedData = prev.map((item) => {
        if (item.qualification_checklist_items_id === checklistItemId) {
          return { ...item, verification_result: String(result) }
        }
        return item
      })
      if (!initialDraftLoading.current) {
        handleDraftSave(formData, updatedData)
      }
      return updatedData
    })
    if (result) {
      setQualificationTableError('')
    }
  }

  const validateForm = () => {
    const newErrors = { ...INITIAL_ERRORS }
    let isValid = true

    const isRichTextEmpty = (value: string) => {
      const strippedValue = value?.trim() ?? ''
      return !strippedValue
    }

    if (!formData.infrastructure_category_id) {
      newErrors.infrastructure_category_id =
        ERROR_MESSAGES.INFRASTRUCTURE_CATEGORY
      isValid = false
    }

    if (!formData.infrastructure_type_id) {
      newErrors.infrastructure_type_id = ERROR_MESSAGES.INFRASTRUCTURE_TYPE
      isValid = false
    }

    if (!formData.infrastructure_id) {
      newErrors.infrastructure_id = ERROR_MESSAGES.SERIAL_NO
      isValid = false
    }

    if (isRichTextEmpty(formData.application_of_infrastructure ?? '')) {
      newErrors.application_of_infrastructure =
        ERROR_MESSAGES.APPLICATION_OF_INFRASTRUCTURE
      isValid = false
    }

    if ( isRichTextEmpty( formData.qualification_procedure_and_acceptance_criteria ?? '' )) {
      newErrors.qualification_procedure_and_acceptance_criteria =
        ERROR_MESSAGES.QUALIFICATION_PROCEDURE
      isValid = false
    }

    if (!formData.inspection_done_by) {
      newErrors.inspection_done_by = ERROR_MESSAGES.INSPECTION_DONE_BY
      isValid = false
    }

    if (!formData.inspection_date) {
      newErrors.inspection_date = ERROR_MESSAGES.INSPECTION_DATE
      isValid = false
    }

    if (!formData.status) {
      newErrors.status = ERROR_MESSAGES.STATUS
      isValid = false
    }

    // Validate qualification table data
    setQualificationTableError('')

    // Check if all results are selected
    const hasUnselectedResults = qualificationTableData.some(
      (item) =>
        !item.verification_result || item.verification_result.trim() === ''
    )

    if (hasUnselectedResults) {
      setQualificationTableError(ERROR_MESSAGES.QUALIFICATION_RESULT_REQUIRED)
      isValid = false
    } else {
      // Check if failed tests have observations
      const failedTestsWithoutObservation = qualificationTableData.filter(
        (item) =>
          item.verification_result === VERIFICATION_RESULT_VALUES.FAIL &&
          (!item.test_observation || item.test_observation.trim() === '')
      )

      if (failedTestsWithoutObservation.length > NUMBERMAP.ZERO) {
        setQualificationTableError(ERROR_MESSAGES.TEST_OBSERVATION_REQUIRED)
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    // Clear draft on successful save
    clearDraftSave()

    const payload = {
      infrastructure_qualification_id: formData.infrastructure_qualification_id,
      infrastructure_id: formData.infrastructure_id
        ? Number(formData.infrastructure_id)
        : '',
      infrastructure_qualification_checklist_id:  formData.infrastructure_qualification_checklist_id,
      application_of_infrastructure: formData.application_of_infrastructure,
      qualification_procedure_and_acceptance_criteria:
        formData.qualification_procedure_and_acceptance_criteria,
      maintenance_service_type_lk_id: formData.inspection_done_by
        ? Number(formData.inspection_done_by)
        : '',
      inspection_date: formData.inspection_date,
      status: formData.status ? Number(formData.status) : '',
      infrastructure_qualification: qualificationTableData.map((ele) => {
        return {
          qualification_test_id : ele.qualification_test_id ?? '',
          qualification_checklist_items_id: ele.qualification_checklist_items_id,
          test_observation: ele.test_observation ?? '',
          verification_result: ele.verification_result?.toLocaleLowerCase() ?? '',
        }
      }),
    }

    upsertInfrastructureQualification(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
        // Refetch infrastructure qualification data if in edit mode
        if (qualification_id) {
          refetchInfrastructureQualification()
        }
        // Redirect to infrastructure qualification list page after successful save
        router.push(ROUTES.LIST)
      },
      onError: () => showActionAlert(STATUS.FAILED),
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave();
    router.push(ROUTES.LIST);
  }

  const isLoading = () => {
    if (
      isQualificationChecklistLoading ||
      isTypesLoading ||
      isSerialNumbersLoading ||
      isCategoriesLoading ||
      isMaintenancePlansLoading ||
      isStatusLoading ||
      isInfraQualificationLoading
    ) {
      return true
    } else {
      return false
    }
  }

  const qualificationColumns: GridColDef[] = [
    {
      field: TABLE_COLUMN_FIELDS.SNO,
      headerName: TABLE_COLUMN_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_COLUMN_FIELDS.TEST_PERFORMED,
      headerName: TABLE_COLUMN_HEADERS.TEST_PERFORMED,
      flex: NUMBERMAP.ONE,
    },
    {
      field: TABLE_COLUMN_FIELDS.ACCEPTANCE_CRITERIA,
      headerName: TABLE_COLUMN_HEADERS.ACCEPTANCE_CRITERIA,
      flex: NUMBERMAP.ONE,
      renderCell:(params)=>{
        return params.value ? stripHtml(params.value):"-"
      }
    },
    {
      field: TABLE_COLUMN_FIELDS.TEST_OBSERVATION,
      headerName: TABLE_COLUMN_HEADERS.TEST_OBSERVATION,
      flex: NUMBERMAP.ONE_HALF,
            renderCell: (params) => (
        <Box
          sx={GRID_STYLES.CELL_ALIGNMENT}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <InputField
            label=""
            placeholder={PLACEHOLDERS.OBSERVATION}
            value={params.row.test_observation ?? ''}
            onChange={(value: string) => {
              updateTestObservation(
                params.row.qualification_checklist_items_id,
                value
              )
            }}
            disabled={!isCreateMode && !hasEditPermission}
          />
        </Box>
      ),
    },
    {
      field: TABLE_COLUMN_FIELDS.VERIFICATION_RESULT,
      headerName: TABLE_COLUMN_HEADERS.RESULT,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => {
        return (
          <RadioButtonGroup
            label=""
            name={`${params.row.qualification_checklist_items_id}`}
            options={[
              {
                value: VERIFICATION_RESULT_VALUES.PASS,
                label: VERIFICATION_RESULT_VALUES.PASS,
              },
              {
                value: VERIFICATION_RESULT_VALUES.FAIL,
                label: VERIFICATION_RESULT_VALUES.FAIL,
              },
            ]}
            value={params.row.verification_result ?? ''}
            onChange={(value: string | number) => {
              updateVerificationResult(
                params.row.qualification_checklist_items_id,
                value
              )
            }}
            disabled={!isCreateMode && !hasEditPermission}
          />
        )
      },
    },
  ]


  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <GlobalLoader loading={isLoading()} />
        <Label title={PAGE_TITLES.INFRASTRUCTURE_QUALIFICATION} />

        <FormContent>
          {/* Infrastructure Basic Details Section */}
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={
                  INFRASTRUCTURE_QUALIFICATION.FORM_CONSTANTS
                    .INFRASTRURE_CATEGORY.LABELS
                }
                placeholder={PLACEHOLDERS.SELECT_INFRASTRUCTURE_CATEGORY}
                value={formData.infrastructure_category_id}
                onChange={(value: string) =>
                  handleInputChange(
                    FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY_ID as keyof typeof formData,
                    value
                  )
                }
                isDropdown={true}
                error={errors.infrastructure_category_id}
                options={categoriesData?.data ?? []}
                keyField={KEY_FIELDS.INFRASTRUCTURE_CATEGORY_ID}
                valueField={VALUE_FIELDS.INFRASTRUCTURE_CATEGORY_NAME}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_TYPE}
                placeholder={PLACEHOLDERS.SELECT_INFRASTRUCTURE_TYPE}
                value={formData.infrastructure_type_id}
                onChange={(value: string) =>
                  handleInputChange(
                    FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE_ID as keyof typeof formData,
                    value
                  )
                }
                isDropdown={true}
                error={errors.infrastructure_type_id}
                options={typesData?.data ?? []}
                disabled={(!formData.infrastructure_category_id || !isCreateMode) && !hasEditPermission}
                keyField={KEY_FIELDS.INFRASTRUCTURE_TYPE_ID}
                valueField={VALUE_FIELDS.INFRASTRUCTURE_TYPE_NAME}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.SERIAL_NO}
                placeholder={PLACEHOLDERS.SELECT_SERIAL_NO}
                value={formData.infrastructure_id}
                onChange={(value: string) => {
                  handleInputChange(
                    FORM_FIELD_NAMES.INFRASTRUCTURE_ID as keyof typeof formData,
                    value
                  )
                  if (!value) {
                    setQualificationTableData([])
                  }
                }}
                isDropdown={true}
                error={errors.infrastructure_id}
                options={serialNumbersData?.data ?? []}
                disabled={(!formData.infrastructure_type_id || !isCreateMode) && !hasEditPermission}
                keyField={KEY_FIELDS.INFRASTRUCTURE_ID}
                valueField={VALUE_FIELDS.SERIAL_NUMBER}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={formData.infrastructure_name}
                label={FORM_LABELS.INFRASTRUCTURE_NAME}
              />
            </Grid2>
          </Grid2>

          {/* Rich Text Editors Section */}
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={FORM_LABELS.APPLICATION_OF_INFRASTRUCTURE}
                value={formData.application_of_infrastructure}
                onChange={(value) =>
                  handleInputChange(
                    FORM_FIELD_NAMES.APPLICATION_OF_INFRASTRUCTURE as keyof typeof formData,
                    value
                  )
                }
                placeholder={PLACEHOLDERS.INPUT_TEXT}
                error={errors.application_of_infrastructure}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={
                  FORM_LABELS.QUALIFICATION_PROCEDURE_AND_ACCEPTANCE_CRITERIA
                }
                value={formData.qualification_procedure_and_acceptance_criteria}
                onChange={(value) =>
                  handleInputChange(
                    FORM_FIELD_NAMES.QUALIFICATION_PROCEDURE_AND_ACCEPTANCE_CRITERIA as keyof typeof formData,
                    value
                  )
                }
                placeholder={PLACEHOLDERS.INPUT_TEXT}
                error={errors.qualification_procedure_and_acceptance_criteria}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
          </Grid2>
        </FormContent>

        {/* Infrastructure Qualification Table Section */}
        <Grid2 container sx={STYLE5}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Label title={PAGE_TITLES.INFRASTRUCTURE_QUALIFICATION} />

            <DataTable
              rows={qualificationTableData ?? []}
              columns={qualificationColumns}
              IdField={KEY_FIELDS.QUALIFICATION_TEST_ID}
              checkbox={false}
            />
            {qualificationTableError && (
              <ErrorText style={Error_Style}>
                {qualificationTableError}
              </ErrorText>
            )}
          </Grid2>
        </Grid2>
        <FormContent>
          {/* Inspection Details Section */}
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INSPECTION_DONE_BY}
                placeholder={PLACEHOLDERS.SELECT_INSPECTION_DONE_BY}
                value={formData.inspection_done_by}
                options={maintenancePlansData?.data ?? []}
                onChange={(value: string) =>
                  handleInputChange(
                    FORM_FIELD_NAMES.INSPECTION_DONE_BY as keyof typeof formData,
                    value
                  )
                }
                isDropdown={true}
                error={errors.inspection_done_by}
                keyField={KEY_FIELDS.ID}
                valueField={VALUE_FIELDS.MAINTENANCE_SERVICE_TYPE}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={FORM_LABELS.INSPECTION_DATE}
                value={formData.inspection_date}
                onChange={handleDateChange}
                error={errors.inspection_date}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={PLACEHOLDERS.SELECT_STATUS}
                value={formData.status}
                onChange={(value: string) =>
                  handleInputChange(
                    FORM_FIELD_NAMES.STATUS as keyof typeof formData,
                    value
                  )
                }
                isDropdown={true}
                error={errors.status}
                options={statusData?.data ?? []}
                keyField={KEY_FIELDS.STATUS_ID}
                valueField={VALUE_FIELDS.STATUS_NAME}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
          </Grid2>

          {/* Comments History */}
          {!!qualification_id && (
            <Grid2 container spacing={NUMBERMAP.TWO} sx={{ mt: 2 }}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <CommentsHistory 
                  comments={((infraQualificationData as any)?.meta_info?.task_info?.task_comments ?? [])} 
                />
              </Grid2>
            </Grid2>
          )}

          {/* Action Buttons */}
          <ButtonContainer>
            <SalesReviewerModalManager
              module = 'infrastructure'
              isLoading={isInfraQualificationLoading}
              permissions={((infraQualificationData as any)?.meta_info?.action_control?.permissions ?? (isCreateMode ? [{action: BUTTON_LABELS.SAVE}, {action: BUTTON_LABELS.CANCEL}, {action: PERMISSION_ACTIONS.VIEW}] : []))}
              taskInfo={((infraQualificationData as any)?.meta_info?.task_info ?? { task_comments: [], reviewer_list: [], task_id: undefined })}
              menuId={(infraQualificationData as any)?.meta_info?.action_control?.menuId}
              menuName={(infraQualificationData as any)?.meta_info?.action_control?.formName}
              contextType={INFRASTRUCTURE_CONTEXT_TYPE.INFRASTRUCTURE_QUALIFICATION}
              contextId={qualification_id ?? NUMBERMAP.ZERO}
              customHandlers={{
                handleCancel: handleCancel,
                handleSave: handleSave,
              }}
              onPermissionChange={setHasEditPermission}
              refetch={refetchInfrastructureQualification}
              hideSaveButton={false}
            />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default InfrastructureQualificationForm