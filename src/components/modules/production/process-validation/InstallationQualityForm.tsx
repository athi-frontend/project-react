'use client'

import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import { useRouter } from 'next/navigation'
import {
  RadioButtonGroup,
  InputField,
  Description,
  DataGridTable,
  ActionButton,
  ButtonGroup,
  showActionAlert,
} from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import {
  useFetchAllInstallationQualification,
  useUpsertInstallationQualification,
  useDeleteInstallationQualification,
  useFetchAllIqcGroup,
  useFetchInstallationQualificationById
} from '@/hooks/modules/production/useProcessValidation'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import {
  InstallationQualificationDetail,
  InstallationQualificationFormData,
  InstallationQualityFormProps,
  FormErrors,
  ModalFormErrors,
  InstallationQualificationUpsertPayload,
} from '@/types/modules/production/process-validation'
import {
  PROCESS_VALIDATION_FORM_LABELS,
  PROCESS_VALIDATION_FORM_PLACEHOLDERS,
  PROCESS_VALIDATION_ERROR_MESSAGES,
  PROCESS_VALIDATION_BUTTON_LABELS,
  REPORT_BY_OPTIONS,
  REPORT_BY_VALUES,
  INSTALLATION_QUALIFICATION_FIELD_NAMES,
  COMMON_FIELDS,
  IN_HOUSE_OPTIONS,
  TEMP_ID_PREFIX,
  INSTALLATION_QUALIFICATION_FIELDS,
  INSTALLATION_QUALIFICATION_HEADERS
} from '@/constants/modules/production/process-validation'
import { DELETE, SUCCESS, FAILED } from '@/constants/modules/dnd/pnd'
import { ButtonContainer } from '@/styles/modules/production/process-validation'
import InstallationQualificationResultAndStatusFields from './ResultAndStatusFields'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'

/**
 * Classification: Confidential
 * Installation Quality Form Component
 */

const InstallationQualityForm: React.FC<InstallationQualityFormProps> = ({
  processChecklistId,
  processChecklistDetailId,
}) => {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const [editingDetail, setEditingDetail] = useState<InstallationQualificationDetail | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [modalErrors, setModalErrors] = useState<ModalFormErrors>({})

  const [installationQualityData, setInstallationQualityData] =
    useState<InstallationQualificationFormData>({
      installationQualificationReportBy: '',
      installationQualificationReportByName: '',
      installationQualificationDoneInHouse: '',
      installationQualificationDetails: [],
    })

  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'installation_qualification',
    context_instance_id: processChecklistId,
    enableFetch: false,
  })
  // Modal form state
  const [iqGroupId, setIqGroupId] = useState<string>('')
  const [parameter, setParameter] = useState('')
  const [requirementSpecification, setRequirementSpecification] = useState('')
  const [measurement, setMeasurement] = useState('')
  const [installationQualificationResult, setInstallationQualificationResult] = useState('')
  const [status, setStatus] = useState<string>('')
  const [iqcDetailsId,setIQCDetailsId]=useState(null)
  // API Hooks
  const { data: installationQualificationList, isLoading: isLoadingList } =
    useFetchAllInstallationQualification(processChecklistId)
  const { data: iqcGroupData } = useFetchAllIqcGroup()
  const { data: statusData } = useOrganizationStatus()
  const { mutate: upsertInstallationQualification, isPending: isUpsertPending } =
    useUpsertInstallationQualification()
  const { mutate: deleteInstallationQualification } = useDeleteInstallationQualification()
  const {data:installationQualificationData} = useFetchInstallationQualificationById(iqcDetailsId)

  // Comprehensive loading state function
  const isLoading = () => {
    if (isLoadingList) return true
    if (isUpsertPending) return true
    return false
  }

  const loadDraftData = (data: any) => {
    if (!data) return
    const formData = data?.form_data ?? data
    setInstallationQualityData({
      installationQualificationReportBy: formData.installationQualificationReportBy ?? '',
      installationQualificationReportByName: formData.installationQualificationReportByName ?? '',
      installationQualificationDoneInHouse: formData.installationQualificationDoneInHouse ?? '',
      installationQualificationDetails: Array.isArray(formData.installationQualificationDetails) ? formData.installationQualificationDetails : [],
    })
  }

  const handleDraftSave = (formDataToSave: InstallationQualificationFormData) => {
    draftSave({
      form_data: {
        id: processChecklistId ?? new Date().getTime(),
        ...formDataToSave,
        type: 'draft',
      },
    })
  }

  // Transform API response to form data (skip when draft exists)
  useEffect(() => {
    if (installationQualificationList?.data && Array.isArray(installationQualificationList.data) && installationQualificationList.data.length > NUMBERMAP.ZERO) {
      const responseData = installationQualificationList.data[NUMBERMAP.ZERO]
      if (responseData?.type === 'draft') {
        loadDraftData(responseData)
        return
      }
          const transformedDetails: InstallationQualificationDetail[] =
          responseData?.installation_qualification?.map((item: any, index: number) => ({
            ...item,
            result: item.result_slug ?? item.result,
            status: item.status_id ?? item.status
          })) ?? []
        setInstallationQualityData((prev)=>({
          ...prev,
          installationQualificationReportBy: responseData.reported_by ?? '',
          installationQualificationReportByName: responseData.reported_by_name ?? '',
          installationQualificationDoneInHouse: responseData.iqc_done_in_house ?? NUMBERMAP.ONE,
          installationQualificationDetails: transformedDetails,

        }))
    }
  }, [installationQualificationList])

  // Modal field change handlers with error clearing
  const handleIqGroupNameChange = (value: string) => {
    setIqGroupId(value)
    if (modalErrors.iqGroupName) {
      setModalErrors((prev) => ({ ...prev, iqGroupName: '' }))
    }
  }

  const handleParameterChange = (value: string) => {
    setParameter(value)
    if (modalErrors.parameter) {
      setModalErrors((prev) => ({ ...prev, parameter: '' }))
    }
  }

  const handleRequirementSpecificationChange = (value: string) => {
    setRequirementSpecification(value)
    if (modalErrors.requirementSpecification) {
      setModalErrors((prev) => ({ ...prev, requirementSpecification: '' }))
    }
  }

  const handleMeasurementChange = (value: string) => {
    setMeasurement(value)
    if (modalErrors.measurement) {
      setModalErrors((prev) => ({ ...prev, measurement: '' }))
    }
  }

  const handleResultChange = (value: string | number) => {
    setInstallationQualificationResult(value as string)
    if (modalErrors.installationQualificationResult) {
      setModalErrors((prev) => ({ ...prev, installationQualificationResult: '' }))
    }
  }

  const updateFormData = (updates: Partial<InstallationQualificationFormData>) => {
    setInstallationQualityData((prev) => {
      const next = { ...prev, ...updates }
      // Clear the name field when Report By option changes
      if (updates.installationQualificationReportBy !== undefined && updates.installationQualificationReportBy !== prev.installationQualificationReportBy) {
        next.installationQualificationReportByName = ''
      }
      handleDraftSave(next)
      return next
    })
    // Clear errors when user makes changes
    if (updates.installationQualificationReportBy !== undefined) {
      setErrors((prev) => ({
        ...prev,
        installationQualificationReportBy: '',
        installationQualificationReportByName: '',
      }))
    }
    if (updates.installationQualificationReportByName !== undefined) {
      setErrors((prev) => ({ ...prev, installationQualificationReportByName: '' }))
    }
    if (updates.installationQualificationDoneInHouse !== undefined) {
      setErrors((prev) => ({ ...prev, installationQualificationDoneInHouse: '' }))
    }
  }

  // Get the label and placeholder for the name field based on selected option
  const getNameFieldConfig = () => {
    const selectedOption = installationQualityData.installationQualificationReportBy
    if (selectedOption === REPORT_BY_VALUES.MANUFACTURER) {
      return {
        label: PROCESS_VALIDATION_FORM_LABELS.MANUFACTURER_NAME,
        placeholder: PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_MANUFACTURER_NAME,
        errorMessage: PROCESS_VALIDATION_ERROR_MESSAGES.MANUFACTURER_NAME_REQUIRED,
      }
    }
    if (selectedOption === REPORT_BY_VALUES.AUTHORIZED_SUPPLIER) {
      return {
        label: PROCESS_VALIDATION_FORM_LABELS.AUTHORIZED_SUPPLIER_NAME,
        placeholder: PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_AUTHORIZED_SUPPLIER_NAME,
        errorMessage: PROCESS_VALIDATION_ERROR_MESSAGES.AUTHORIZED_SUPPLIER_NAME_REQUIRED,
      }
    }
    if (selectedOption === REPORT_BY_VALUES.AGENT) {
      return {
        label: PROCESS_VALIDATION_FORM_LABELS.AGENT_NAME,
        placeholder: PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_AGENT_NAME,
        errorMessage: PROCESS_VALIDATION_ERROR_MESSAGES.AGENT_NAME_REQUIRED,
      }
    }
    return null
  }

  const nameFieldConfig = getNameFieldConfig()
  const shouldShowNameField = !!nameFieldConfig

  // Installation Qualification columns
  const installationQualificationColumns = [
    {
      field: INSTALLATION_QUALIFICATION_FIELDS.SNO,
      headerName: INSTALLATION_QUALIFICATION_HEADERS.SNO,
      flex: NUMBERMAP.ONE,
    },
    {
      field: INSTALLATION_QUALIFICATION_FIELDS.PARAMETER,
      headerName: INSTALLATION_QUALIFICATION_HEADERS.PARAMETER,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: INSTALLATION_QUALIFICATION_FIELDS.REQUIREMENT_SPECIFICATION,
      headerName: INSTALLATION_QUALIFICATION_HEADERS.REQUIREMENT_SPECIFICATION,
      flex: NUMBERMAP.THREE,
    },
    {
      field: INSTALLATION_QUALIFICATION_FIELDS.MEASUREMENT,
      headerName: INSTALLATION_QUALIFICATION_HEADERS.MEASUREMENT,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: INSTALLATION_QUALIFICATION_FIELDS.RESULT,
      headerName: INSTALLATION_QUALIFICATION_HEADERS.RESULT,
      flex: NUMBERMAP.ONE,
    },
    {
      field: INSTALLATION_QUALIFICATION_FIELDS.STATUS,
      headerName: INSTALLATION_QUALIFICATION_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        return <StatusTypography value={params?.row?.status_id} />
      },
    },
    {
      field: INSTALLATION_QUALIFICATION_FIELDS.ACTION,
      headerName: INSTALLATION_QUALIFICATION_HEADERS.ACTION,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <ActionButton
          onDelete={() =>
            handleDeleteDetail(params.row.installation_qualification_id ?? params.row.temp_id)
          }
          onEdit={() => handleEditDetail(params.row)}
          deleteDisabled={params.row.status_id === NUMBERMAP.TWO || params.row.status === NUMBERMAP.TWO}
        />
      ),
    },
  ]

  const handleDeleteDetail = async (id?: number | string) => {
    if (!id) return

    // If it's a temp_id, just remove from local state
    if (typeof id === 'string' && id.startsWith(TEMP_ID_PREFIX)) {
      const updatedDetails = installationQualityData.installationQualificationDetails.filter(
        (item) => item.temp_id !== id
      )
      updateFormData({ installationQualificationDetails: updatedDetails })
      return
    }

    // If it's a real ID, call delete API
    const result = await showActionAlert(DELETE)
    if (!result.isConfirmed) return

    deleteInstallationQualification(id as number)
  }

  useEffect(()=>{
    if(installationQualificationData?.data?.length>0){
      const row = installationQualificationData?.data[NUMBERMAP.ZERO]
         setEditingDetail(row)
    setIqGroupId(row.iq_group_id?.toString() ?? '')
    setParameter(row.parameter)
    setRequirementSpecification(row.requirement_specification)
    setMeasurement(row.measurement)
    setInstallationQualificationResult(row.result_slug)
    setStatus(row.status?.toString() ?? row.status_id?.toString() ?? '')
    }
  },[installationQualificationData])
  const handleEditDetail = (row: InstallationQualificationDetail) => {
    setIQCDetailsId(row?.installation_qualification_id??null)
    setModalErrors({})
    setOpenModal(true)
  }

  const handleAddDetail = () => {
    setEditingDetail(null)
    setIqGroupId('')
    setParameter('')
    setRequirementSpecification('')
    setMeasurement('')
    setInstallationQualificationResult('')
    setStatus('')
    setModalErrors({})
    setOpenModal(true)
  }

  const validateModalForm = (): boolean => {
    const newErrors: ModalFormErrors = {}
    let isValid = true

    // Validate IQ Group Name
    if (!iqGroupId || iqGroupId.trim() === '') {
      newErrors.iqGroupName = PROCESS_VALIDATION_ERROR_MESSAGES.IQ_GROUP_NAME_REQUIRED
      isValid = false
    }

    // Validate Parameter
    if (!parameter || parameter.trim() === '') {
      newErrors.parameter = PROCESS_VALIDATION_ERROR_MESSAGES.PARAMETER_REQUIRED
      isValid = false
    }

    // Validate Requirement Specification
    if (!requirementSpecification || requirementSpecification.trim() === '') {
      newErrors.requirementSpecification =
        PROCESS_VALIDATION_ERROR_MESSAGES.REQUIREMENT_SPECIFICATION_REQUIRED
      isValid = false
    }

    // Validate Measurement
    if (!measurement || measurement.trim() === '') {
      newErrors.measurement = PROCESS_VALIDATION_ERROR_MESSAGES.MEASUREMENT_REQUIRED
      isValid = false
    }

    // Validate Result
    if (!installationQualificationResult || (typeof installationQualificationResult === 'string' && installationQualificationResult.trim() === '')) {
      newErrors.installationQualificationResult = PROCESS_VALIDATION_ERROR_MESSAGES.RESULT_REQUIRED
      isValid = false
    }

    // Validate Status
    if (!status || status.trim() === '') {
      newErrors.status = PROCESS_VALIDATION_ERROR_MESSAGES.STATUS_REQUIRED
      isValid = false
    }

    setModalErrors(newErrors)
    return isValid
  }

  const handleSaveDetail = () => {
    if (!validateModalForm()) {
      return
    }

    const selectedIqcGroup = iqcGroupData?.data?.find((opt: any) => opt.id.toString() === iqGroupId)
    const iqcGroupName = selectedIqcGroup?.iqc_group_name ?? ''

    const detailData: InstallationQualificationDetail = {
      ...(editingDetail?.installation_qualification_id && { installation_qualification_id: editingDetail.installation_qualification_id }),
      ...(editingDetail?.temp_id && { temp_id: editingDetail.temp_id }),
      sno: editingDetail
        ? editingDetail.sno
        : installationQualityData.installationQualificationDetails.length + NUMBERMAP.ONE,
      parameter: parameter.trim(),
      requirement_specification: requirementSpecification.trim(),
      measurement: measurement.trim(),
      result: installationQualificationResult,
      status: status ? Number(status) : NUMBERMAP.ONE,
      status_id: status ? Number(status) : NUMBERMAP.ONE,
      iq_group_id: Number(iqGroupId),
      iq_group_name: iqcGroupName,
    }

    if (editingDetail) {
      // Edit mode - update existing detail
      const updatedDetails = installationQualityData.installationQualificationDetails.map((item) =>
        (item.installation_qualification_id && item.installation_qualification_id === editingDetail.installation_qualification_id) ||
        (item.temp_id && item.temp_id === editingDetail.temp_id)
          ? detailData
          : item
      )
      updateFormData({ installationQualificationDetails: updatedDetails })
    } else {
      // Add mode - add new detail with temporary ID
      const tempId = `${TEMP_ID_PREFIX}${Date.now()}_${crypto.randomUUID()}`
      updateFormData({
        installationQualificationDetails: [
          ...installationQualityData.installationQualificationDetails,
          { ...detailData, temp_id: tempId , installation_qualification_id:tempId },
        ],
      })
    }

    handleModalClose()
  }

  const handleModalClose = () => {
    setOpenModal(false)
    setEditingDetail(null)
    setIqGroupId('')
    setParameter('')
    setRequirementSpecification('')
    setMeasurement('')
    setInstallationQualificationResult('')
    setStatus('')
    setModalErrors({})
  }


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Validate Installation Qualification Report By
    if (
      !installationQualityData.installationQualificationReportBy ||
      (typeof installationQualityData.installationQualificationReportBy === 'string' &&
        installationQualityData.installationQualificationReportBy.trim() === '')
    ) {
      newErrors.installationQualificationReportBy =
        PROCESS_VALIDATION_ERROR_MESSAGES.INSTALLATION_QUALIFICATION_REPORT_BY_REQUIRED
      isValid = false
    }

    // Validate Name field based on selected option
    if (shouldShowNameField) {
      if (
        !installationQualityData.installationQualificationReportByName ||
        installationQualityData.installationQualificationReportByName.trim() === ''
      ) {
        newErrors.installationQualificationReportByName = nameFieldConfig?.errorMessage ?? ''
        isValid = false
      }
    }

    // Validate Installation Qualification Done In - House
    if (
      !installationQualityData.installationQualificationDoneInHouse ||
      (typeof installationQualityData.installationQualificationDoneInHouse === 'string' &&
        installationQualityData.installationQualificationDoneInHouse.trim() === '')
    ) {
      newErrors.installationQualificationDoneInHouse =
        PROCESS_VALIDATION_ERROR_MESSAGES.INSTALLATION_QUALIFICATION_DONE_IN_HOUSE_REQUIRED
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }
    clearDraftSave()

    // Prepare installation_qualification array
    const installationQualificationItems = installationQualityData.installationQualificationDetails.map((detail) => {
      const { temp_id, sno, status, result_id, result_slug, installation_qualification_group, iq_group_id, iq_group_name, installation_qualification_id, ...rest } = detail
      
      // Convert result to lowercase slug ("Pass" -> "pass", "Fail" -> "fail")
      const resultSlug = detail.result ?? 'pass'
      
      const item: any = {
        ...rest,
        result: resultSlug,
        status_id: typeof detail.status === 'number' ? detail.status : (detail.status_id ?? NUMBERMAP.ONE),
        ...(detail.installation_qualification_id && !detail.temp_id ? { installation_qualification_id: detail.installation_qualification_id } : {}),
        ...(detail.iq_group_id ? { iq_group_id: detail.iq_group_id } : {}),
        ...(detail.iq_group_name ? { iq_group_name: detail.iq_group_name } : {}),
      }

      return item
    })

    // Prepare payload
    const reportedBy = typeof installationQualityData.installationQualificationReportBy === 'string'
      ? installationQualityData.installationQualificationReportBy
      : REPORT_BY_VALUES.MANUFACTURER

    const getIqcDoneInHouseValue = (value: string | number): number => {
      if (typeof value === 'number') {
        return value
      }
      return value === 'Yes' || value === NUMBERMAP.ONE.toString() ? NUMBERMAP.ONE : NUMBERMAP.TWO
    }

    const iqcDoneInHouse = getIqcDoneInHouseValue(installationQualityData.installationQualificationDoneInHouse)

    const payload: InstallationQualificationUpsertPayload = {
      process_checklist_id: processChecklistId,
      reported_by: reportedBy,
      reported_by_name: installationQualityData.installationQualificationReportByName ?? '',
      iqc_done_in_house: iqcDoneInHouse,
      installation_qualification: installationQualificationItems,
    }

    try {
      await new Promise<void>((resolve, reject) => {
        upsertInstallationQualification(payload, {
          onSuccess: () => resolve(),
          onError: () => reject(),
        })
      })
      showActionAlert(SUCCESS)
    } catch {
      showActionAlert(FAILED)
    }
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(`/production/process-validation/${processChecklistDetailId}`)
  }

  return (
    <>
      {isDraftSaving && <DraftLoading />}
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
        {/* Installation Qualification Report By */}
        <Grid2 size={{ xs: NUMBERMAP.SEVEN }}>
          <RadioButtonGroup
            label={PROCESS_VALIDATION_FORM_LABELS.INSTALLATION_QUALIFICATION_REPORT_BY}
            name={INSTALLATION_QUALIFICATION_FIELD_NAMES.INSTALLATION_QUALIFICATION_REPORT_BY}
            options={REPORT_BY_OPTIONS}
            value={installationQualityData.installationQualificationReportBy}
            onChange={(value: string | number) =>
              updateFormData({ installationQualificationReportBy: value })
            }
            error={errors.installationQualificationReportBy}
          />
        </Grid2>

        {/* Installation Qualification Done In - House */}
        <Grid2 size={{ xs: NUMBERMAP.FIVE }}>
          <RadioButtonGroup
            label={PROCESS_VALIDATION_FORM_LABELS.INSTALLATION_QUALIFICATION_DONE_IN_HOUSE}
            name={INSTALLATION_QUALIFICATION_FIELD_NAMES.INSTALLATION_QUALIFICATION_DONE_IN_HOUSE}
            options={IN_HOUSE_OPTIONS}
            value={installationQualityData.installationQualificationDoneInHouse}
            onChange={(value: string | number) =>
              updateFormData({ installationQualificationDoneInHouse: value })
            }
            error={errors.installationQualificationDoneInHouse}
          />
        </Grid2>

        {/* Conditional Name Field based on Report By selection */}
        {shouldShowNameField && (
          <Grid2 size={{ xs: NUMBERMAP.SEVEN }}>
            <InputField
              label={nameFieldConfig.label}
              placeholder={nameFieldConfig.placeholder}
              value={installationQualityData.installationQualificationReportByName ?? ''}
              onChange={(value: string) =>
                updateFormData({ installationQualificationReportByName: value })
              }
              error={errors.installationQualificationReportByName}
            />
          </Grid2>
        )}

        {/* Installation Qualification DataTable */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title={INSTALLATION_QUALIFICATION_HEADERS.TITLE}
            rows={installationQualityData?.installationQualificationDetails??[]}
            showAddButton
            onAddRow={handleAddDetail}
            columns={installationQualificationColumns}
            idField={'installation_qualification_id'}
            loading={isLoading()}
            hideFooter={true}
          />
        </Grid2>

        {/* Save and Cancel Buttons */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <ButtonContainer>
            <ButtonGroup
              buttons={[
                {
                  label: PROCESS_VALIDATION_BUTTON_LABELS.CANCEL,
                  onClick: handleCancel,
                },
                {
                  label: PROCESS_VALIDATION_BUTTON_LABELS.SAVE,
                  onClick: handleSave,
                },
              ]}
            />
          </ButtonContainer>
        </Grid2>
      </Grid2>

      {/* CommonModal for Add/Edit Installation Qualification Detail */}
      <CommonModal
        open={openModal}
        title={editingDetail ? INSTALLATION_QUALIFICATION_HEADERS.EDIT_TITLE : INSTALLATION_QUALIFICATION_HEADERS.ADD_TITLE}
        onClose={handleModalClose}
        onSave={handleSaveDetail}
        buttonRequired={true}
        modalMaxWidth="800px"
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={{ ...POPUP_STYLE }}>
          {/* IQ Group Name */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={PROCESS_VALIDATION_FORM_LABELS.IQ_GROUP_NAME}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.SELECT_IQ_GROUP_NAME}
              isDropdown
              options={iqcGroupData?.data ?? []}
              keyField={COMMON_FIELDS.ID}
              valueField={COMMON_FIELDS.IQC_GROUP_NAME}
              value={iqGroupId}
              onChange={handleIqGroupNameChange}
              error={modalErrors.iqGroupName}
            />
          </Grid2>

          {/* Parameter */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.PARAMETER}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_PARAMETER}
              value={parameter}
              onChange={handleParameterChange}
              error={modalErrors.parameter}
            />
          </Grid2>

          {/* Requirement Specification */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.REQUIREMENT_SPECIFICATION}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_REQUIREMENT_SPECIFICATION}
              value={requirementSpecification}
              onChange={handleRequirementSpecificationChange}
              error={modalErrors.requirementSpecification}
            />
          </Grid2>

          {/* Measurement */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.MEASUREMENT}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_MEASUREMENT}
              value={measurement}
              onChange={handleMeasurementChange}
              error={modalErrors.measurement}
            />
          </Grid2>

          <InstallationQualificationResultAndStatusFields
            result={installationQualificationResult}
            status={status}
            resultError={modalErrors.installationQualificationResult}
            statusError={modalErrors.status}
            statusOptions={statusData?.data ?? []}
            onResultChange={handleResultChange}
            onStatusChange={(value: string) => {
              setStatus(value)
              if (modalErrors.status) {
                setModalErrors((prev) => ({ ...prev, status: '' }))
              }
            }}
          />
        </Grid2>
      </CommonModal>
    </>
  )
}

export default InstallationQualityForm

