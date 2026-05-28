'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Grid2, Typography, Box } from '@mui/material'
import {
  ButtonGroup,
  InputField,
  Description,
  DataGridTable,
  showActionAlert,
} from '@/components/ui'
import ReviewerModal from '@/components/modules/dnd/reviewer-modal/ReviewerModal'
import ProcurementProcess from '@/components/modules/dnd/procurement-process/ProcurementProcess'
import {
  listById,
  useSaveFeasibilityStudy,
  useCurrencies,
} from '@/hooks/modules/dnd/useFeasibilityStudy'
import { useParams, useRouter } from 'next/navigation'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import {
  Container,
  Title,
  ContentWrapper,
} from '@/styles/modules/dnd/feasibilityStudy'
import {
  INITIAL_ERRORS,
  FIELD_MAPPING,
  API_FIELDS_MAPPING,
  VALIDATION_MESSAGES,
  CLASS_NAMES,
  COMPONENT_TYPES,
  DESIGN_TEAM_ROLE_TITLE,
  MULTI_SELECT_ID_FIELD,
  MULTI_SELECT_VALUE_FIELD,
  FIELDS,
  REQUIRED_COST_FIELDS,
  COST_FIELD_MAP,
  LABELS,
  OBJECT,
  TYPOGRAPHY_PROPS,
  SUCCESS_ALERT,
  FIELD_KEYS,
  FORM_DATA_KEYS,
  MENU_NAME,
  ALERT_MESSAGES,
  FAILED_ALERT,
  FIELD_ORDER,
  FIELD_LABEL_MAP,
} from '@/constants/modules/dnd/feasibilityStudy'
import {
  FormDatas,
  FormErrors,
  StringFormField,
  FormFieldConfig,
  DesignTeamRoleData,
  ApiData,
  FileData2,
} from '@/types/modules/dnd/feasibilityStudy'
import { DocumentStructure } from '@/types/common'
import {
  mergeFinalFileData,
  numberValidation,
  processButtonsWithPermissions,
  QUERYCONSTANTS,
} from '@/lib/utils/common'
import {
  INITIAL_FORM_DATA,
  FORM_FIELDS,
  designTeamColumns,
} from '@/lib/modules/dnd/feasibilityStudy'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import DesignTeamRole from '@/components/modules/dnd/feasibility-study/DesignTeamModal'
import CostInputForm from '@/components/modules/dnd/feasibility-study/CostInputForm'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import {
  BUTTON_LABEL,
  FINALFILEINITIALDATA,
  getButtonConfig,
  NUMBERMAP,
} from '@/constants/common'
import { PROJECT_INFO_SCREEN_URL } from '@/lib/modules/dnd/projectScreen'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import CommentsHistory from '@/components/ui/comments-history/Comments'

/**
  Classification : Confidential
**/
const FeasibilityStudy: React.FC = () => {
  const [formData, setFormData] = useState<FormDatas>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS)
  const [openDesignTeam, setOpenDesignTeam] = useState<boolean>(false)
  const [openProcurementModal, setOpenProcurementModal] =
    useState<boolean>(false)
  const [hasData, setHasData] = useState(false)
  const [designTeamRows, setDesignTeamRows] = useState<DesignTeamRoleData[]>([])
  const [editingDesignTeam, setEditingDesignTeam] =
    useState<DesignTeamRoleData | null>(null)
  const [finalFileData, setFinalFileData] =
    useState<DocumentStructure>(FINALFILEINITIALDATA)
  const [isReviewerModal, setIsReviewerModal] = useState(false)
  const [buttonId, setButtonId] = useState<number | null>(null)
  const [buttonName, setButtonName] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [costData, setCostData] = useState({
    productCost: '',
    equipmentCost: '',
    developmentalCost: '',
    manufacturingCost: '',
    otherCost: '',
  })
  const [costIds, setCostIds] = useState<{ [key: string]: number }>({
    productCost: 0,
    equipmentCost: 0,
    developmentalCost: 0,
    manufacturingCost: 0,
    otherCost: 0,
  })

  const params = useParams()
  const router = useRouter()
  const Project_Id = Number(params.id)

  const { data: feasibilityStudyData, isLoading: isDataLoading, isFetching: isDataFetching } = listById(Project_Id)
  const { mutate: saveFeasibility, isPending: isSavePending } = useSaveFeasibilityStudy()
  const { data: currencyData, isFetching: isCurrencyFetching } = useCurrencies()

  const initialCostData = useMemo(
    () => ({
      productCost: costData.productCost,
      equipmentCost: costData.equipmentCost,
      developmentalCost: costData.developmentalCost,
      manufacturingCost: costData.manufacturingCost,
      otherCost: costData.otherCost,
    }),
    [costData]
  )

  const costErrors = useMemo(
    () => ({
      productCost: errors.productCost,
      equipmentCost: errors.equipmentCost,
      developmentalCost: errors.developmentalCost,
      manufacturingCost: errors.manufacturingCost,
      otherCost: errors.otherCost,
    }),
    [errors]
  )

  const handleStringChange = (field: StringFormField, value: string) => {
    if(!hasEditPermission) return
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const handleCurrencyChange = (field: StringFormField, value: string) => {
    if(!hasEditPermission) return
    setFormData((prev) => {
      const updatedFormData = { ...prev, [field]: value }

      if (errors[field]) {
        const updatedErrors = { ...errors, [field]: '' }
        setErrors(updatedErrors)
      }

      return updatedFormData
    })
  }

  const handleCostChange = (costType: string, value: string) => {
    if(!hasEditPermission) return
    if (!numberValidation.test(value) && value !== '') return

    setCostData((prev) => ({
      ...prev,
      [costType]: value,
    }))

    if (errors[costType as StringFormField]) {
      setErrors((prev) => ({
        ...prev,
        [costType]: '',
      }))
    }
  }

  const handleCostErrorChange = (costType: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [costType]: error,
    }))
  }

  const handleFileUpload = (newFile: File | FileData2) => {
    if (newFile instanceof File) {
      setFormData((prev) => ({
        ...prev,
        uploadedFile: [...prev.uploadedFile, newFile],
      }))

      if (errors.uploadedFile) {
        setErrors((prev) => ({
          ...prev,
          uploadedFile: '',
        }))
      }
    }
  }

  const handleFileEdit = useCallback((updatedFile: FileData2) => {
    setFormData((prev) => {
      const updatedFiles = prev.uploadedFile.map((file) => {
        const currentId =
          typeof file === OBJECT && file !== null
            ? ((file as FileData2).file_id ??
              (file as FileData2).id ??
              (file as FileData2).document_id)
            : undefined
        const updatedId =
          updatedFile.document_id ?? updatedFile.id ?? updatedFile.file_id

        return currentId === updatedId ? { ...file, ...updatedFile } : file
      })

      return {
        ...prev,
        documents: updatedFiles,
      }
    })
  }, [])

  const validateField = (
    field: keyof FormDatas,
    fieldName: string
  ): boolean => {
    if (
      field === FIELDS.OTHER_REQUIREMENT ||
      field === FIELDS.CONCLUSION ||
      field === FIELDS.DESIGN_TEAM ||
      field === FIELDS.CURRENCY
    ) {
      return true
    }

    const value = formData[field]
    const fieldConfig = FORM_FIELDS.find(
      (f: FormFieldConfig) => f.field === field
    )
    const validationLabel = fieldConfig?.validationLabel ?? fieldName

    if (fieldConfig?.type === COMPONENT_TYPES.DATA_GRID) {
      if (
        fieldConfig.label === DESIGN_TEAM_ROLE_TITLE &&
        designTeamRows.length === 0
      ) {
        setErrors((prev) => ({
          ...prev,
          [field]: VALIDATION_MESSAGES.FIELD_REQUIRED(validationLabel),
        }))
        return false
      }
      return true
    }

    if (fieldConfig?.type === COMPONENT_TYPES.MULTI_SELECT) {
      if (!value) {
        setErrors((prev) => ({
          ...prev,
          [field]: VALIDATION_MESSAGES.FIELD_REQUIRED(validationLabel),
        }))
        return false
      }
    } else if (fieldConfig && !Array.isArray(value) && !value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [field]: VALIDATION_MESSAGES.FIELD_REQUIRED(validationLabel),
      }))
      return false
    }

    let isValid = true
    REQUIRED_COST_FIELDS.forEach(({ id, label }) => {
      if (!costData[id as keyof typeof costData].trim()) {
        setErrors((prev) => ({
          ...prev,
          [id]: VALIDATION_MESSAGES.FIELD_REQUIRED(label),
        }))
        isValid = false
      }
    })
    return isValid
  }

  const fetchData = async (feasibilityStudyData: { data: ApiData[] }) => {
    try {
      if (
        !feasibilityStudyData?.data ||
        feasibilityStudyData.data.length === 0
      ) {
        setHasData(false)
        return
      }

      const apiData = feasibilityStudyData.data[0]
      const mappedFormData = mapApiDataToForm(apiData)

      const uploadedFiles: FileData2[] =
        apiData.documents?.map((doc, index) => ({
          id: `doc-${doc.file_id}-${index}`,
          file_id: doc.file_id,
          document_id: doc.file_id,
          name: doc.file_name,
          file_name: doc.file_name,
          file_size: doc.file_size,
          file_object_key: doc.file_object_key,
          file_extension: doc.file_extension,
          uploaded_date: doc.created_date ?? doc.uploaded_date,
          source: doc.source,
          purpose: doc.purpose,
          description: doc.file_description,
          file_description: doc.file_description,
          file_category: doc.file_category_id,
          categoryId: doc.file_category_id,
          file_tags: doc.file_tags ?? [],
        })) ?? []

      setFormData({
        ...mappedFormData,
        uploadedFile: uploadedFiles,
      })
      const newCostData = {
        productCost: '',
        equipmentCost: '',
        developmentalCost: '',
        manufacturingCost: '',
        otherCost: '',
      }
      const newCostIds = {
        productCost: 0,
        equipmentCost: 0,
        developmentalCost: 0,
        manufacturingCost: 0,
        otherCost: 0,
      }
      apiData.cost.forEach(
        (costItem: {
          cost_id: number
          cost_heading: string
          value: string
        }) => {
          const field = COST_FIELD_MAP[costItem.cost_heading]
          if (field) {
            newCostData[field] = costItem.value ?? ''
            newCostIds[field] = costItem.cost_id
          }
        }
      )
      setCostData(newCostData)
      setCostIds(newCostIds)
      if(apiData?.design_team_role){
      setDesignTeamRows(
        apiData?.design_team_role?.map((role: string, index: number) => ({
          id: `${role}-${index}`,
          sNo: index + 1,
          role,
          onEdit: handleEditDesignTeam,
          onDelete: handleDeleteDesignTeam,
        }))
      )
      }

      setHasData(true)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setHasData(false)
    }
  }

  const mapApiDataToForm = (apiData: ApiData): FormDatas => {
    const mappedData = Object.fromEntries(
      Object.entries(API_FIELDS_MAPPING).map(([key, value]) => [
        key,
        apiData[value as string] ?? '',
      ])
    ) as Partial<FormDatas>

    return {
      ...INITIAL_FORM_DATA,
      ...mappedData,
      currency: apiData.currency_id?.toString() ?? '',
      uploadedFile: [],
    }
  }

  useEffect(() => {
    if (feasibilityStudyData?.data?.length > 0) {
      fetchData(feasibilityStudyData)
    } else if (feasibilityStudyData?.data?.cost?.length > 0) {
      const apiData = feasibilityStudyData.data.cost
      const newCostData = {
        productCost: '',
        equipmentCost: '',
        developmentalCost: '',
        manufacturingCost: '',
        otherCost: '',
      }
      const newCostIds = {
        productCost: 0,
        equipmentCost: 0,
        developmentalCost: 0,
        manufacturingCost: 0,
        otherCost: 0,
      }

      apiData.forEach(
        (costItem: {
          cost_id: number
          cost_heading: string
          value: string
        }) => {
          const field = COST_FIELD_MAP[costItem.cost_heading]
          if (field) {
            newCostData[field] = costItem.value ?? ''
            newCostIds[field] = costItem.cost_id
          }
        }
      )
      setCostData(newCostData)
      setCostIds(newCostIds)
    }
  }, [feasibilityStudyData])

  const handleSubmit = async () => {
    if (!runValidation() || !hasEditPermission) {
      return
    }
    setIsDisabled(true)
    const submitData = buildSubmitData()
    const payload = buildFormData(submitData)
    /**
     * Function Name: handleSubmit
     * Description: description: since need to handle disabled button on response changed the logic,
     * Author: Prithiviraj,
     * Created: 12-08-2025,
     * Classification : Confidential
    **/
    saveFeasibility({ formData: payload, hasData }, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT)
        setIsDisabled(false)
        setHasData(true)
        setFinalFileData(FINALFILEINITIALDATA)
      },
      onError: () => {
        showActionAlert(FAILED_ALERT)
        setIsDisabled(false)
      },
    })
  }

  const isLoading = () => {
    if (isDataLoading) return true
    if (isDataFetching) return true
    if (isCurrencyFetching) return true
    if (isSavePending) return true
    return false
  }

  const runValidation = () => {
    let isValid = true

    FIELD_MAPPING.forEach(({ field, validationName }) => {
      if (field && !validateField(field, validationName)) {
        isValid = false
      }
    })

    if (!validateField(FIELD_KEYS.UPLOADED_FILE, FIELD_KEYS.DOCUMENTS)) {
      isValid = false
    }

    // Only check for empty fields if there are no validation errors
    const hasValidationErrors = !isValid
    
    // Create a combined data object that includes cost data for validation
    const combinedData = {
      ...formData,
      totalcost: REQUIRED_COST_FIELDS.every(({ id }) => 
        costData[id]?.trim()
      ) ? 'filled' : ''
    }
    
    const focusResult = hasValidationErrors
      ? validateAndFocusFirstEmptyField(
          combinedData,
          FIELD_ORDER,
          FIELD_LABEL_MAP
        )
      : true

    return isValid && focusResult
  }

  const buildSubmitData = () => ({
    project_id: Project_Id,
    scope: formData.scope,
    design_methodology: formData.designMethodology,
    project_duration: formData.projectDuration,
    technical_feasibility: formData.technicalFeasibility,
    training_requirement: formData.trainingRequirement,
    project_risk: formData.projectRisk,
    dependencies: formData.dependencies,
    project_impact: formData.impact,
    regulatory_implications: formData.regulatoryImplications,
    other_requirements: formData.otherRequirements,
    conclusion: formData.conclusion,
    status: 1,
    currency: formData.currency.toString(),
    cost: Object.entries(costIds).map(([key, cost_id]) => ({
      cost_id,
      value: costData[key],
    })),
    roles: designTeamRows.map((row) => row.role),
  })

  const buildFormData = (data: any) => {
    const payload = new FormData()

    for (let key in data) {
      if (key === FIELD_KEYS.ROLES || key === FIELD_KEYS.COST) {
        payload.append(key, JSON.stringify(data[key]))
      } else {
        payload.append(key, data[key])
      }
    }

    finalFileData?.documents_to_create?.forEach((fileData) => {
      if (fileData instanceof File) {
        payload.append(
          FORM_DATA_KEYS.DOCUMENTS_TO_CREATE,
          fileData,
          fileData.name
        )
      }
    })

    appendIfExists(
      payload,
      FORM_DATA_KEYS.DOCUMENTS_TO_DELETE,
      finalFileData?.documents_to_delete
    )
    appendIfExists(
      payload,
      FORM_DATA_KEYS.CREATE_META_DATA,
      finalFileData?.create_meta_data
    )
    appendIfExists(
      payload,
      FORM_DATA_KEYS.UPDATE_META_DATA,
      finalFileData?.update_meta_data
    )

    return payload
  }

  const appendIfExists = (form: FormData, key: string, value?: any[]) => {
    if (value) {
      form.append(key, JSON.stringify(value))
    }
  }

  const handleDesignTeamSave = (designTeamData: DesignTeamRoleData) => {
    if(!hasEditPermission) return
    setDesignTeamRows((prev) => {
      const updatedRows = editingDesignTeam
        ? prev.map((row) =>
            row.id === editingDesignTeam.id
              ? {
                  ...designTeamData,
                  id: row.id,
                  sNo: row.sNo,
                  onEdit: handleEditDesignTeam,
                  onDelete: handleDeleteDesignTeam,
                }
              : row
          )
        : [
            ...prev,
            {
              ...designTeamData,
              id: Date.now().toString(),
              sNo: prev.length + 1,
              onEdit: handleEditDesignTeam,
              onDelete: handleDeleteDesignTeam,
            },
          ]
      const newRows = updatedRows.map((row, index) => ({
        ...row,
        sNo: index + 1,
      }))
      setErrors((prev) => ({ ...prev, roles: '' }))
      return newRows
    })
    setOpenDesignTeam(false)
    setEditingDesignTeam(null)
  }

  const handleEditDesignTeam = (row: DesignTeamRoleData) => {
    setEditingDesignTeam(row)
    setOpenDesignTeam(true)
  }

  const handleDeleteDesignTeam = async (id: string) => {
    if(!hasEditPermission) return
    
    const result = await showActionAlert('customAlert', {
      title: ALERT_MESSAGES.DELETE_CONFIRMATION_TITLE,
      text: ALERT_MESSAGES.DELETE_CONFIRMATION_TEXT,
      icon: ALERT_MESSAGES.DELETE_CONFIRMATION_ICON,
      cancelButton: true,
      confirmButton: true,
    })
    
    if (result?.isConfirmed === true) {
      setDesignTeamRows((prev) =>
        prev
          .filter((row) => row.id !== id)
          .map((row, index) => ({ ...row, sNo: index + 1 }))
      )
    }
  }

  const handleDesignTeamCancel = () => {
    setOpenDesignTeam(false)
    setEditingDesignTeam(null)
  }

  const handleCloseReviewerModal = () => {
    setIsReviewerModal(false)
    setButtonId(null) // Reset button_id when modal closes
  }

  const handleButtonChange = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setButtonId(trigger_status_id || null)
    setButtonName(button_label)
    setIsReviewerModal(true)
  }

  // Update these handler functions to accept trigger_status_id parameter
  const handleSubmitReviewModal = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApprove = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleApproveByCEO = (trigger_status_id? : number) => {
    setButtonId(trigger_status_id || null)
    setOpenProcurementModal(true)
  }

  const handleReject = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleCancel = () => {
    router.push(PROJECT_INFO_SCREEN_URL)
  }

  const getButtons = getButtonConfig({
    handleSubmitForReview: handleSubmitReviewModal,
    handleApprove: handleApprove,
    handleCEODecision: handleApproveByCEO,
    handleReject: handleReject,
    handleCancel: handleCancel,
    handleSave: handleSubmit,
  })

  const permissions = feasibilityStudyData?.meta_info?.action_control?.permissions ?? []

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions ?? [], getButtons, isDisabled)

  useEffect(() => {
    if (feasibilityStudyData?.data && !buttonDetails) {
      showActionAlert(QUERYCONSTANTS.ALERT_TYPES.CUSTOM_ALERT, {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [buttonDetails, feasibilityStudyData?.data])

  return (
    <>
      <GlobalLoader loading={isLoading()} />
      {buttonDetails && (
        <Container className={CLASS_NAMES.CONTAINER}>
          <Title>Feasibility Study</Title>
          <ContentWrapper
          >
            <Grid2 container spacing={NUMBERMAP.ONE}>
              {FORM_FIELDS.map((fieldConfig: FormFieldConfig, index: number) => {
                let gridMdSize = NUMBERMAP.SIX;
                if (fieldConfig.type === COMPONENT_TYPES.DATA_GRID) {
                  gridMdSize = NUMBERMAP.TWELVE;
                }
                return (
                  <React.Fragment key={fieldConfig.label}>
                    <Grid2 size={{ md: gridMdSize }}>
                    {fieldConfig.type === COMPONENT_TYPES.DESCRIPTION && (
                      <Description
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        value={formData[fieldConfig.field] as string}
                        onChange={(value) =>
                          handleStringChange(
                            fieldConfig.field as StringFormField,
                            value
                          )
                        }
                        error={errors[fieldConfig.field]}
                      />
                    )}
                    {fieldConfig.type === COMPONENT_TYPES.INPUT_FIELD && (
                      <InputField
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        value={formData[fieldConfig.field] as string}
                        onChange={(value: string) => {
                          const selectedValue = value
                          if (
                            fieldConfig.numeric &&
                            !numberValidation.test(selectedValue)
                          )
                            return
                          handleStringChange(
                            fieldConfig.field as StringFormField,
                            selectedValue
                          )
                        }}
                        error={errors[fieldConfig.field]}
                      />
                    )}
                    {fieldConfig.type === COMPONENT_TYPES.MULTI_SELECT && (
                      <InputField
                        options={currencyData?.data ?? []}
                        keyField={MULTI_SELECT_ID_FIELD}
                        valueField={MULTI_SELECT_VALUE_FIELD}
                        label={fieldConfig.label}
                        isDropdown
                        placeholder={fieldConfig.placeholder}
                        value={formData[fieldConfig.field] as string}
                        onChange={(value: string) => {
                          handleCurrencyChange(FIELD_KEYS.CURRENCY, value)
                        }}
                        error={errors[fieldConfig.field]}
                      />
                    )}
                    {fieldConfig.type === COMPONENT_TYPES.DATA_GRID &&
                      fieldConfig.label === LABELS.DESIGN_TEAM && (
                        <>
                          <DataGridTable
                            onAddRow={() => {
                              if(!hasEditPermission) return
                              setEditingDesignTeam(null)
                              setOpenDesignTeam(true)
                            }}
                            showAddButton={true}
                            title={DESIGN_TEAM_ROLE_TITLE}
                            rows={designTeamRows}
                            columns={designTeamColumns}
                            hideFooter={true}
                            error={errors[fieldConfig.field]}
                          />
                          {errors[fieldConfig.field] && (
                            <Typography {...TYPOGRAPHY_PROPS.errorCaption}>
                              {errors[fieldConfig.field]}
                            </Typography>
                          )}
                        </>
                      )}
                    {fieldConfig.label === LABELS.COST && (
                      <>
                        <Box id={LABELS.COST}>
                        <CostInputForm
                          hasEditable = {!hasEditPermission}
                          initialData={initialCostData}
                          errors={costErrors}
                          onCostChange={handleCostChange}
                          onErrorChange={handleCostErrorChange}
                        />
                        </Box>
                        {errors[fieldConfig.field] && (
                          <Typography {...TYPOGRAPHY_PROPS.errorCaption}>
                            {errors[fieldConfig.field]}
                          </Typography>
                        )}
                      </>
                    )}
                  </Grid2>
                    {fieldConfig.field === FIELD_KEYS.CURRENCY && (
                      <Grid2 size={{ md: NUMBERMAP.SIX }} />
              )}
                  </React.Fragment>
                );
              })}
              <Grid2 size={NUMBERMAP.TWELVE}>
                <FileUploadManager
                  hasEditable={!hasEditPermission}
                  initialFiles={formData.uploadedFile}
                  onFileUpload={handleFileUpload}
                  onFileEdit={handleFileEdit}
                  onSubmit={(data) => {
                    setFinalFileData((prev) => mergeFinalFileData(prev, data))
                  }}
                  error={errors.uploadedFile}
                  data-file-upload-manager
                />
              </Grid2>
            </Grid2>
          </ContentWrapper>
           <CommentsHistory
            comments={feasibilityStudyData?.meta_info?.task_info?.task_comments}
          />
          <ButtonGroup buttons={buttonDetails} />

          <ReviewerModal
            open={isReviewerModal}
            onClose={handleCloseReviewerModal}
            project_id={Project_Id}
            button_id={buttonId}
            mode={buttonName}
            menu_id={feasibilityStudyData?.meta_info?.action_control?.menuId}
            menu_name={MENU_NAME}
            reviewerList={feasibilityStudyData?.meta_info?.task_info?.reviewer_list}
          />
          <ProcurementProcess
            open={openProcurementModal}
            buttonId={buttonId}
            modalToggle={() =>{
              setOpenProcurementModal(!openProcurementModal)
            }}
          />
          <CommonModal
            title={DESIGN_TEAM_ROLE_TITLE}
            onSave={() => {}}
            open={openDesignTeam}
            onClose={handleDesignTeamCancel}
          >
            <DesignTeamRole
              hasEditable = {!hasEditPermission}
              handleCancel={handleDesignTeamCancel}
              handleSave={handleDesignTeamSave}
              designTeamRole={editingDesignTeam ?? { role: '' }}
              designTeamRows={designTeamRows??[]}
            />
          </CommonModal>
        </Container>
      )}
    </>
  )
}

export default FeasibilityStudy
