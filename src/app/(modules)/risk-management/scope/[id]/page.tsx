'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Box, Grid2 } from '@mui/material'
import {
  Description,
  InputField,
  DataTable,
  Label,
  ActionButton,
  showActionAlert,
  MultiSelect,
} from '@/components/ui'
import { GridColDef } from '@mui/x-data-grid'
import { KEY, NUMBERMAP, STATUS, DRAFT } from '@/constants/common'
import { COMMON_CONSTANTS, processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import { FormWrapper, FormContent } from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import SubHeader from '@/components/modules/regulation/executive-summary/SubHeader'
import PatientPopulationModal from '@/components/modules/risk-management/scope/PatientPopulationModal'
import AnatomicalScopeModal from '@/components/modules/risk-management/scope/AnatomicalScopeModal'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { useParams, useRouter } from 'next/navigation'
import {
  useGetScopeById,
  usePostScope,
  useGetRiskStages
} from '@/hooks/modules/risk-management/useScope'
import { useGetGenders, useGetUserProfiles } from "@/hooks/useCommonDropdown";
import {
  FIELD_IS_REQUIRED,
  TITLE,
  BASIC_INFORMATION_TITLE,
  PATIENT_POPULATION_TITLE,
  ANATOMICAL_SCOPE_TITLE,
  USER_PROFILES_TITLE,
  OPERATING_PRINCIPLE_TITLE,
  APPLICABLE_STAGES_TITLE,
  LABEL,
  ONCHANGE_VALUE,
  PLACEHOLDER,
  FIELD_COLUMN,
  FIELD_VALUE,
  SAVE,
  CANCEL,
  FIELD_NAMES,
  VALIDATION_FIELD_NAMES,
  STRING_TYPE,
  TEMP_ID_PREFIX,
  ID_FIELD,
  VALIDATION_FIELD_LABEL_MAP,
  SCOPE_FIELD_ORDER,
} from '@/constants/modules/risk-management/scope'
import {
  PatientPopulationData,
  AnatomicalScopeData,
  ScopeFormData,
  ScopeFormErrors,
  ScopePayload,
  GenderData,
  UserProfileData,
  UserProfileOptionData,
  PatientPopulationModalData,
  AnatomicalScopeModalData,
  RiskStageData,
} from '@/types/modules/risk-management/scope'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'

/**
 * Classification: Confidential
 */

const ScopeForm: React.FC = () => {
  const params = useParams()
  const project_id = Number(params.id)
  const router = useRouter()
  const [isPatientPopulationModalOpen, setIsPatientPopulationModalOpen] =
    useState(false)
  const [isAnatomicalScopeModalOpen, setIsAnatomicalScopeModalOpen] =
    useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isModalReadOnly, setIsModalReadOnly] = useState(false);
  const isInitialDataLoad = useRef(true)

  // State for editing
  const [editingPatientPopulation, setEditingPatientPopulation] =
    useState<PatientPopulationData | null>(null)
  const [editingAnatomicalScope, setEditingAnatomicalScope] =
    useState<AnatomicalScopeData | null>(null)

  const [formData, setFormData] = useState<ScopeFormData>({
    planTitle: '',
    medicalDeviceDescription: '',
    intendedUse: '',
    userProfiles: [],
    operatingPrincipleDescription: '',
    applicableStages: [],
  })

  const [errors, setErrors] = useState<ScopeFormErrors>({})

  // State for tables
  const [patientPopulationData, setPatientPopulationData] = useState<
    PatientPopulationData[]
  >([])
  const [anatomicalScopeData, setAnatomicalScopeData] = useState<
    AnatomicalScopeData[]
  >([])

  // API hooks
  const { data: scopeData, isLoading } = useGetScopeById(project_id)
  const { data: riskStagesData } = useGetRiskStages(NUMBERMAP.ONE)
  const {
    data: genderData,
    isLoading: genderLoading,
    error: genderError,
  } = useGetGenders(NUMBERMAP.ONE)
  const {
    data: userProfilesData,
    isLoading: userProfilesLoading
  } = useGetUserProfiles(NUMBERMAP.ONE)

  const { mutate: saveScope, isPending: isSaving } = usePostScope()
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave()
  
  const isAnyLoading = () => {
    if (isLoading) return true
    if (isSaving) return true
    return false
  }

  /**
   * Function Name: getScopeInfo
   * Params: None
   * Description: Extracts scope info from the API response data array
   * Author: Harsithiga
   * Created: 22-11-2025
   * Modified:
   * Classification: Confidential
   */
  const getScopeInfo = () => {
    if (!scopeData?.data) return null
    const data = scopeData.data
    if (data && typeof data === 'object' && (data as any).type === DRAFT) {
      return data
    } else if (Array.isArray(data) && data.length > NUMBERMAP.ZERO) {
      return data[NUMBERMAP.ZERO]
    }
    return null
  }

  const isUserProfilesDisabled = () => {
    // Nullish check ensures undefined loading flags don't disable the field
    if ((userProfilesLoading ?? false) === true) return true
    if (!hasEditPermission) return true
    return false
  }


  /**
   * Function Name: validateScopeForm
   * Params: data (ScopeFormData)
   * Description: Validates the scope form data and returns validation errors
   * Author: Madhumitha
   * Created: 01-09-2025
   * Modified:
   * Classification: Confidential
   */
  const validateScopeForm = (data: ScopeFormData): ScopeFormErrors => {
    const errors: ScopeFormErrors = {}

    // Common validation for required fields
    const requiredFields = [
      {
        field: VALIDATION_FIELD_NAMES.PLAN_TITLE,
        error: FIELD_IS_REQUIRED.PLAN_TITLE,
        isArray: false,
      },
      {
        field: VALIDATION_FIELD_NAMES.MEDICAL_DEVICE_DESCRIPTION,
        error: FIELD_IS_REQUIRED.MEDICAL_DEVICE_DESCRIPTION,
        isArray: false,
      },
      {
        field: VALIDATION_FIELD_NAMES.INTENDED_USE,
        error: FIELD_IS_REQUIRED.INTENDED_USE,
        isArray: false,
      },
      {
        field: VALIDATION_FIELD_NAMES.USER_PROFILES,
        error: FIELD_IS_REQUIRED.USER_PROFILES,
        isArray: true,
      },
      {
        field: VALIDATION_FIELD_NAMES.OPERATING_PRINCIPLE_DESCRIPTION,
        error: FIELD_IS_REQUIRED.OPERATING_PRINCIPLE,
        isArray: false,
      },
      {
        field: VALIDATION_FIELD_NAMES.APPLICABLE_STAGES,
        error: FIELD_IS_REQUIRED.APPLICABLE_STAGES,
        isArray: true,
      },
    ]

    requiredFields.forEach(({ field, error, isArray }) => {
      const value = data[field as keyof ScopeFormData]

      if (isArray) {
        // For array fields, check if array is empty
        if (!Array.isArray(value) || value.length === NUMBERMAP.ZERO) {
          errors[field as keyof ScopeFormErrors] = error
        }
      } else if (typeof value === STRING_TYPE && !(value as string).trim()) {
        // For string fields, check if trimmed value is empty
        errors[field as keyof ScopeFormErrors] = error
      }
    })

    return errors
  }

  /**
   * Function Name: handleInputChange
   * Params: field (string), value (string | string[])
   * Description: Handles input changes for form fields and clears validation errors
   * Author: Madhumitha
   * Created: 01-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleInputChange = (field: string, value: string | string[] | number[]) => {
    // Ensure userProfiles is always an array
    const processedValue =
      field === ONCHANGE_VALUE.USER_PROFILES && !Array.isArray(value)
        ? []
        : value

    setFormData((prev) => {
      const updated = { ...prev, [field]: processedValue }
      if (!isInitialDataLoad.current) {
        handleDraftSave(updated, patientPopulationData, anatomicalScopeData)
      }
      return updated
    })

    // Clear error when user starts typing or selects
    if (
      typeof processedValue === 'string'
        ? processedValue.trim()
        : processedValue.length > NUMBERMAP.ZERO
    ) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDraftSave = (
    formData: ScopeFormData,
    patientPopulationData: PatientPopulationData[],
    anatomicalScopeData: AnatomicalScopeData[]
  ) => {
    const scopeInfo = getScopeInfo()
    
    const payload: ScopePayload = {
      type : DRAFT,
      risk_management_plan_id: scopeInfo?.risk_management_plan_id,
      project_id: project_id,
      plan_title: formData.planTitle,
      medical_device_description: formData.medicalDeviceDescription,
      intended_use: formData.intendedUse,
      operating_principle: formData.operatingPrincipleDescription,
      patient_population: patientPopulationData,
      anatomical_scope: anatomicalScopeData,
      user_profiles: (Array.isArray(formData.userProfiles)
        ? formData.userProfiles
        : []
      )
        .map((id) => {
          const profile = userProfilesData?.data?.find(
            (p: UserProfileOptionData) => p.id === id
          )
          return {
            user_type_id: profile?.id,
            user_type_name: profile?.user_type_name,
          }
        })
        .filter((p) => p.user_type_id && p.user_type_name),
      applicable_stages: (Array.isArray(formData.applicableStages)
        ? formData.applicableStages
        : []
      ).map((stageId) => {
        const stage = riskStagesData?.data?.find(
          (s: RiskStageData) => s.stage_id === stageId
        );
        return {
          stage_id: stageId,
          stage_name: stage?.stage_name,
          slug: stage?.slug,
          status: stage?.status,
        }
      }),
    }
    draftSave({
      project_id: project_id,
      form_type: KEY,
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }
  /**
   * Function Name: handleSave
   * Params: None
   * Description: Validates and saves the scope form data to the API
   * Author: Madhumitha
   * Created: 01-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleSave = () => {
    // Trim extra spaces from form data before validation
    const trimmedFormData: ScopeFormData = {
      planTitle: formData.planTitle.trim(),
      medicalDeviceDescription: formData.medicalDeviceDescription.trim(),
      intendedUse: formData.intendedUse.trim(),
      userProfiles: Array.isArray(formData.userProfiles)
        ? formData.userProfiles
        : [],
      operatingPrincipleDescription:
        formData.operatingPrincipleDescription.trim(),
      applicableStages: Array.isArray(formData.applicableStages)
        ? formData.applicableStages
        : [],
    }

    const newErrors = validateScopeForm(trimmedFormData)

    setErrors(newErrors)

    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      validateAndFocusFirstEmptyField(trimmedFormData, Array.from(SCOPE_FIELD_ORDER), VALIDATION_FIELD_LABEL_MAP);
      return
    }

    setIsDisabled(true)
    // Prepare payload for API
    const scopeInfo = getScopeInfo()
    
    const payload: ScopePayload = {
      risk_management_plan_id: scopeInfo?.risk_management_plan_id,
      project_id: project_id,
      plan_title: trimmedFormData.planTitle,
      medical_device_description: trimmedFormData.medicalDeviceDescription,
      intended_use: trimmedFormData.intendedUse,
      operating_principle: trimmedFormData.operatingPrincipleDescription,
      patient_population: patientPopulationData,
      anatomical_scope: anatomicalScopeData,
      user_profiles: trimmedFormData.userProfiles
        .map((id) => {
          const profile = userProfilesData?.data?.find(
            (p: UserProfileOptionData) => p.id === id
          )
          return {
            user_type_id: profile?.id,
            user_type_name: profile?.user_type_name,
          }
        })
        .filter((p) => p.user_type_id && p.user_type_name),
      applicable_stages: trimmedFormData.applicableStages.map((stageId) => {
        const stage = riskStagesData?.data?.find(
          (s: RiskStageData) => s.stage_id === stageId
        );
        return {
          stage_id: stageId,
          stage_name: stage?.stage_name,
          slug: stage?.slug,
          status: stage?.status,
        }
      }),
    }

    clearDraftSave();
    saveScope(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
        setIsDisabled(false)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
        setIsDisabled(false)
      },
    })
  }

  /**
   * Function Name: handleCancel
   * Params: None
   * Description: Resets all form data and clears errors
   * Author: Madhumitha
   * Created: 01-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleCancel = async() => {
    await checkUnsavedDraftBeforeLeave()
    router.push(APPLICABILITY_ROUTES.RISK_MANAGEMENT)
  }

  /**
   * Function Name: handleAddPatientPopulation
   * Params: None
   * Description: Opens the patient population modal for adding new entries
   * Author: Madhumitha
   * Created: 01-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleAddPatientPopulation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if(!hasEditPermission) return;
    setIsPatientPopulationModalOpen(true)
  }

  // Opens the anatomical scope modal for adding new entries
  const handleAddAnatomicalScope = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if(!hasEditPermission) return;
    setIsAnatomicalScopeModalOpen(true)
  }

  // Opens the patient population modal for editing existing entries
  const handleEditPatientPopulation = (row: PatientPopulationData) => {
    setEditingPatientPopulation(row)
    setIsPatientPopulationModalOpen(true)
    setIsModalReadOnly(!hasEditPermission)
  }

  // Deletes a patient population entry from the table
  const handleDeletePatientPopulation = async (id: string) => {
    const result = await showActionAlert(COMMON_CONSTANTS.DELETE_ALERT)
    if (result.isConfirmed) {
      setPatientPopulationData((prev) => {
        const filtered = prev.filter((item, index) => {
          const itemId =
            item.patient_population_id?.toString() ??
            `${TEMP_ID_PREFIX}${index}`
          return itemId !== id
        })
        handleDraftSave(formData, filtered, anatomicalScopeData)
        return filtered
      })
    }
  }

  // Opens the anatomical scope modal for editing existing entries
  const handleEditAnatomicalScope = (row: AnatomicalScopeData) => {
    setEditingAnatomicalScope(row)
    setIsAnatomicalScopeModalOpen(true)
    setIsModalReadOnly(!hasEditPermission)
  }

  // Deletes an anatomical scope entry from the table
  const handleDeleteAnatomicalScope = async (id: string) => {
    const result = await showActionAlert(COMMON_CONSTANTS.DELETE_ALERT)
    if (result.isConfirmed) {
      setAnatomicalScopeData((prev) => {
        const filtered = prev.filter((item, index) => {
          const itemId =
            item.anatomical_scope_id?.toString() ?? `${TEMP_ID_PREFIX}${index}`
          return itemId !== id
        })
        handleDraftSave(formData, patientPopulationData, filtered)
        return filtered
      })
    }
  }

  // Helper function to transform patient population data for modal
  const getPatientPopulationInitialData = (
    editingData: PatientPopulationData | null
  ) => {
    if (!editingData) return undefined

    const { age_range, gender_id, gender, disease_state } = editingData

    return {
      ageRange: age_range,
      gender: gender_id?.toString() ?? gender,
      diseaseState: disease_state,
    }
  }

  // Helper function to transform anatomical scope data for modal
  const getAnatomicalScopeInitialData = (
    editingData: AnatomicalScopeData | null
  ) => {
    if (!editingData) return undefined

    const { body_part, type_of_tissue } = editingData

    return {
      bodyPart: body_part,
      typeOfTissue: type_of_tissue,
    }
  }

  // Handle patient population modal save
  const handlePatientPopulationModalSave = (
    data: PatientPopulationModalData
  ) => {
    // Convert from modal format to API format
    const selectedGender = genderData?.data?.find(
      (gender: GenderData) => gender.id.toString() === data.gender
    )

    const apiData: PatientPopulationData = {
      age_range: data.ageRange,
      gender: selectedGender?.gender_name ?? data.gender, // Convert ID to name
      gender_id: selectedGender?.id, // Store the ID as well
      disease_state: data.diseaseState,
      patient_population_id:
        editingPatientPopulation?.patient_population_id ?? Date.now(), // Keep existing ID or create new
    }

    // Check if patient_population_id exists in the current data
    const hasExistingId = apiData.patient_population_id && 
      patientPopulationData.some(
        (item) => item.patient_population_id?.toString() === apiData.patient_population_id?.toString()
      )

    let updatedPatientPopulationData: PatientPopulationData[]
    
    if (hasExistingId) {
      // Replace the existing object with the same patient_population_id
      updatedPatientPopulationData = patientPopulationData.map((item) => {
        if (item.patient_population_id?.toString() === apiData.patient_population_id?.toString()) {
          // Preserve the same patient_population_id from the existing object
          return {
            ...apiData,
            patient_population_id: item.patient_population_id
          }
        }
        return item
      })
    } else if (editingPatientPopulation) {
      // Update existing record by matching the editing item
      updatedPatientPopulationData = patientPopulationData.map((item, index) => {
        const itemId =
          item.patient_population_id?.toString() ??
          `${TEMP_ID_PREFIX}${index}`
        const editingId =
          editingPatientPopulation.patient_population_id?.toString() ??
          (editingPatientPopulation as any).id?.toString()
        return itemId === editingId ? apiData : item
      })
    } else {
      // Add new record
      updatedPatientPopulationData = [...patientPopulationData, apiData]
    }

    handleDraftSave(formData, updatedPatientPopulationData, anatomicalScopeData)
    setPatientPopulationData(updatedPatientPopulationData)

    setEditingPatientPopulation(null)
    setIsPatientPopulationModalOpen(false)
  }

  // Handle anatomical scope modal save
  const handleAnatomicalScopeModalSave = (data: AnatomicalScopeModalData) => {
    // Convert from modal format to API format
    const apiData: AnatomicalScopeData = {
      body_part: data.bodyPart,
      type_of_tissue: data.typeOfTissue,
      anatomical_scope_id:
        editingAnatomicalScope?.anatomical_scope_id ?? Date.now(), // Keep existing ID or create new
    }

    // Check if anatomical_scope_id exists in the current data
    const hasExistingId = apiData.anatomical_scope_id && 
      anatomicalScopeData.some(
        (item) => item.anatomical_scope_id?.toString() === apiData.anatomical_scope_id?.toString()
      )

    let updatedAnatomicalScopeData: AnatomicalScopeData[]
    
    if (hasExistingId) {
      // Replace the existing object with the same anatomical_scope_id
      updatedAnatomicalScopeData = anatomicalScopeData.map((item) => {
        if (item.anatomical_scope_id?.toString() === apiData.anatomical_scope_id?.toString()) {
          // Preserve the same anatomical_scope_id from the existing object
          return {
            ...apiData,
            anatomical_scope_id: item.anatomical_scope_id
          }
        }
        return item
      })
    } else if (editingAnatomicalScope) {
      // Update existing record by matching the editing item
      updatedAnatomicalScopeData = anatomicalScopeData.map((item, index) => {
        const itemId =
          item.anatomical_scope_id?.toString() ?? `${TEMP_ID_PREFIX}${index}`
        const editingId =
          editingAnatomicalScope.anatomical_scope_id?.toString() ??
          (editingAnatomicalScope as any).id?.toString()
        return itemId === editingId ? apiData : item
      })
    } else {
      // Add new record
      updatedAnatomicalScopeData = [...anatomicalScopeData, apiData]
    }

    handleDraftSave(formData, patientPopulationData, updatedAnatomicalScopeData)
    setAnatomicalScopeData(updatedAnatomicalScopeData)

    setEditingAnatomicalScope(null)
    setIsAnatomicalScopeModalOpen(false)
  }

  //Closes the patient population modal and resets editing state
  const handlePatientPopulationModalClose = () => {
    setIsPatientPopulationModalOpen(false)
    setEditingPatientPopulation(null)
    setIsModalReadOnly(false)
  }

  // Closes the anatomical scope modal and resets editing state
  const handleAnatomicalScopeModalClose = () => {
    setIsAnatomicalScopeModalOpen(false)
    setEditingAnatomicalScope(null)
    setIsModalReadOnly(false)
  }

  /**
   * Function Name: useEffect
   * Params: None
   * Description: Loads data from API and populates form when scope data is available
   * Author: Madhumitha
   * Created: 01-09-2025
   * Modified:
   * Classification: Confidential
   */
  useEffect(() => {
    // Extract existing data: handle array structure
    const scopeInfo = getScopeInfo()
    if (
      scopeInfo &&
      userProfilesData?.data
    ) {
      // Handle multiple selected stages
      const selectedStageIds =
        scopeInfo.applicable_stages?.map((stage: RiskStageData) =>
          stage.stage_id
        ) ?? []

      setFormData({
        planTitle: scopeInfo.plan_title,
        medicalDeviceDescription: scopeInfo.medical_device_description,
        intendedUse: scopeInfo.intended_use,
        userProfiles:
          scopeInfo.user_profiles?.map((profile: UserProfileData) => {
            const matchingProfile = userProfilesData?.data?.find(
              (option: UserProfileOptionData) =>
                option.id === profile.user_type_id ||
                option.user_type_name === profile.user_type_name
            )
            return matchingProfile?.id ?? profile.user_type_id;
          }) ?? [],
        operatingPrincipleDescription: scopeInfo.operating_principle ?? '',
        applicableStages: selectedStageIds,
      })

      setPatientPopulationData(scopeInfo.patient_population ?? [])
      setAnatomicalScopeData(scopeInfo.anatomical_scope ?? [])

    }
    isInitialDataLoad.current = false
  }, [scopeData, userProfilesData])

  // Extract permissions from meta_info
  const permissions = scopeData?.meta_info?.action_control?.permissions ?? []

  // Create action handlers for buttons
  const actionHandlers: Record<string, (id: number) => void> = {
    [CANCEL]: (_id: number) => {
      handleCancel()
    },
    [SAVE]: (_id: number) => handleSave(),
  }

  // Process permissions to get dynamic buttons
  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, actionHandlers, isDisabled)

  // Patient Population table columns
  const patientPopulationColumns: GridColDef[] = [
    {
      field: FIELD_COLUMN.SNO,
      headerName: FIELD_VALUE.SNO,
    },
    {
      field: FIELD_COLUMN.AGE_RANGE,
      headerName: FIELD_VALUE.AGE_RANGE,
      flex: NUMBERMAP.ONE,
    },
    {
      field: FIELD_COLUMN.GENDER,
      headerName: FIELD_VALUE.GENDER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: FIELD_COLUMN.DISEASE_STATE,
      headerName: FIELD_VALUE.DISEASE_STATE,
      flex: NUMBERMAP.ONE,
    },
    {
      field: FIELD_COLUMN.ACTION,
      headerName: FIELD_VALUE.ACTION,
      renderCell: (params) => (
        <ActionButton
          onEdit={() => handleEditPatientPopulation(params.row)}
          onDelete={() =>
            handleDeletePatientPopulation(
              params.row.patient_population_id?.toString() ??
                params.id.toString()
            )
          }
          deleteDisabled={!hasEditPermission}
        />
      ),
    },
  ]

  // Anatomical Scope table columns
  const anatomicalScopeColumns: GridColDef[] = [
    {
      field: FIELD_COLUMN.SNO,
      headerName: FIELD_VALUE.SNO,
      flex: NUMBERMAP.ONE,
    },
    {
      field: FIELD_COLUMN.BODY_PART,
      headerName: FIELD_VALUE.BODY_PART,
      flex: NUMBERMAP.TWO,
    },
    {
      field: FIELD_COLUMN.TYPE_OF_TISSUE,
      headerName: FIELD_VALUE.TYPE_OF_TISSUE,
      flex: NUMBERMAP.TWO,
    },
    {
      field: FIELD_COLUMN.ACTION,
      headerName: FIELD_VALUE.ACTION,
      renderCell: (params) => (
        <ActionButton
          onEdit={() => handleEditAnatomicalScope(params.row)}
          onDelete={() =>
            handleDeleteAnatomicalScope(
              params.row.anatomical_scope_id?.toString() ?? params.id.toString()
            )
          }
          deleteDisabled={!hasEditPermission}
        />
      ),
    },
  ]

  // Permission access denied logic - only show after API has responded
  useEffect(() => {
    if (!isLoading && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: 'error' as const,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [isLoading, buttonDetails])

  return (
    <FormWrapper>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isAnyLoading()} />
      <Label title={TITLE} />
      <Label title={BASIC_INFORMATION_TITLE} />
      <FormContent>
        <Grid2 container spacing={NUMBERMAP.TWO}>
          <Grid2 size={NUMBERMAP.SIX}>
            <InputField
              label={LABEL.PLAN_TITLE}
              placeholder={PLACEHOLDER.PLAN_TITLE}
              value={formData.planTitle}
              onChange={(value: string) =>
                handleInputChange(ONCHANGE_VALUE.PLAN_TITLE, value)
              }
              error={errors.planTitle}
              disabled={!hasEditPermission}
            />
          </Grid2>
        </Grid2>

        <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
          <Grid2 size={NUMBERMAP.SIX}>
            <Description
              label={LABEL.MEDICAL_DEVICE_DESCRIPTION}
              value={formData.medicalDeviceDescription}
              onChange={(value) =>
                handleInputChange(
                  ONCHANGE_VALUE.MEDICAL_DEVICE_DESCRIPTION,
                  value
                )
              }
              placeholder={PLACEHOLDER.MEDICAL_DEVICE_DESCRIPTION}
              error={errors.medicalDeviceDescription}
              disabled={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <Description
              label={LABEL.INTENDED_USE}
              value={formData.intendedUse}
              onChange={(value) =>
                handleInputChange(ONCHANGE_VALUE.INTENDED_USE, value)
              }
              placeholder={PLACEHOLDER.INTENDED_USE}
              error={errors.intendedUse}
              disabled={!hasEditPermission}
            />
          </Grid2>
        </Grid2>
      </FormContent>

      {/* Patient Population Section */}
      <Box>
        <CommonSharedTale
          pathName="#"
          hanldeClick={(e: React.MouseEvent<HTMLButtonElement>) => handleAddPatientPopulation(e)}
          title={PATIENT_POPULATION_TITLE}
          Table={
            <DataTable
              rows={patientPopulationData.map((row, index) => ({
                ...row,
                id:
                  row.patient_population_id?.toString() ??
                  `${TEMP_ID_PREFIX}${index}`,
              }))}
              columns={patientPopulationColumns}
              IdField={ID_FIELD}
            />
          }
        />
      </Box>

      {/* Anatomical Scope Section */}
      <Box>
        <CommonSharedTale
          pathName="#"
          hanldeClick={(e: React.MouseEvent<HTMLButtonElement>) => handleAddAnatomicalScope(e)}
          title={ANATOMICAL_SCOPE_TITLE}
          Table={
            <DataTable
              rows={anatomicalScopeData.map((row, index) => ({
                ...row,
                id:
                  row.anatomical_scope_id?.toString() ??
                  `${TEMP_ID_PREFIX}${index}`,
              }))}
              columns={anatomicalScopeColumns}
              IdField={ID_FIELD}
            />
          }
        />
      </Box>

      <FormContent>
        {/* User Profiles Section */}
        <Grid2 spacing={NUMBERMAP.TWO}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <SubHeader title={USER_PROFILES_TITLE} />
          </Grid2>
        </Grid2>

        <Grid2 container spacing={NUMBERMAP.TWO}>
          <Grid2 size={NUMBERMAP.SIX} sx={STYLE5}>
             <MultiSelect
               label={LABEL.USER_PROFILES}
               placeholder={userProfilesLoading ? PLACEHOLDER.USER_PROFILES_LOADING : PLACEHOLDER.USER_PROFILES}
               value={formData.userProfiles}
               onChange={(value: (string | number)[]) => handleInputChange(ONCHANGE_VALUE.USER_PROFILES, value as number[])}
               options={userProfilesData?.data ?? []}
               error={errors.userProfiles ?? []}
               idField={FIELD_NAMES.ID}
               valueField={FIELD_NAMES.USER_TYPE_NAME}
               disabled={isUserProfilesDisabled()}
             />
          </Grid2>
        </Grid2>

        {/* Operating Principle Section */}
        <Grid2 spacing={NUMBERMAP.TWO} sx={STYLE5}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <SubHeader title={OPERATING_PRINCIPLE_TITLE} />
          </Grid2>
        </Grid2>

        <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
          <Grid2 size={NUMBERMAP.SIX}>
            <Description
              label={LABEL.OPERATING_PRINCIPLE}
              value={formData.operatingPrincipleDescription}
              onChange={(value) =>
                handleInputChange(ONCHANGE_VALUE.OPERATING_PRINCIPLE, value)
              }
              placeholder={PLACEHOLDER.OPERATING_PRINCIPLE}
              error={errors.operatingPrincipleDescription}
              disabled={!hasEditPermission}
            />
          </Grid2>
        </Grid2>

        {/* Applicable Stages Section */}
        <Grid2 spacing={NUMBERMAP.TWO} sx={STYLE5}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <SubHeader title={APPLICABLE_STAGES_TITLE} />
          </Grid2>
        </Grid2>

        <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
          <Grid2 size={NUMBERMAP.SIX}>
            <MultiSelect
               label={LABEL.APPLICABLE_STAGES}
               placeholder={PLACEHOLDER.APPLICABLE_STAGES}
               value={formData.applicableStages}
               onChange={(value: (string | number)[]) => handleInputChange(ONCHANGE_VALUE.APPLICABLE_STAGES, value as number[])}
               options={riskStagesData?.data ?? []}
               idField={FIELD_NAMES.RISK_STAGE_ID}
               valueField={FIELD_NAMES.RISK_STAGE_NAME}
               error={errors.applicableStages ?? []}
               disabled={!hasEditPermission}
             />
          </Grid2>
        </Grid2>

        <RiskNavigationButtonGroup
          projectId={project_id}
          buttons={buttonDetails ?? []}
          showPrevious={false}
        />
        <PatientPopulationModal
          open={isPatientPopulationModalOpen}
          onClose={handlePatientPopulationModalClose}
          genderData={genderData?.data}
          genderLoading={genderLoading}
          genderError={genderError}
          initialData={getPatientPopulationInitialData(editingPatientPopulation)}
          onSave={handlePatientPopulationModalSave}
          readOnly={isModalReadOnly}
        />
        <AnatomicalScopeModal
          open={isAnatomicalScopeModalOpen}
          onClose={handleAnatomicalScopeModalClose}
          initialData={getAnatomicalScopeInitialData(editingAnatomicalScope)}
          onSave={handleAnatomicalScopeModalSave}
          readOnly={isModalReadOnly}
        />
      </FormContent>
    </FormWrapper>
  )
}

export default ScopeForm
