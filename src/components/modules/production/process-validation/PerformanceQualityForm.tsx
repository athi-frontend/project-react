'use client'

import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import {
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
import { useRouter } from 'next/navigation'
import {
  useFetchAllPerformanceQualification,
  useUpsertPerformanceQualification,
  useDeletePerformanceQualification,
} from '@/hooks/modules/production/useProcessValidation'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import {
  PerformanceQualificationDetail,
  FinalResultDetail,
  FinalResultItem,
  PerformanceQualityFormData,
  PerformanceQualityFormProps,
  PerformanceModalErrors,
  PerformanceQualificationUpsertPayload,
} from '@/types/modules/production/process-validation'
import {
  PROCESS_VALIDATION_FORM_LABELS,
  PROCESS_VALIDATION_FORM_PLACEHOLDERS,
  PROCESS_VALIDATION_ERROR_MESSAGES,
  PROCESS_VALIDATION_BUTTON_LABELS,
  TEMP_ID_PREFIX,
  PERFORMANCE_QUALIFICATION_FIELDS,
  PERFORMANCE_QUALIFICATION_HEADERS
} from '@/constants/modules/production/process-validation'
import { DELETE, SUCCESS, FAILED } from '@/constants/modules/dnd/pnd'
import { ButtonContainer } from '@/styles/modules/production/process-validation'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import ResultAndStatusFields from './ResultAndStatusFields'
import { MarginTop } from '@/styles/components/modules/prototypeModal'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'

/**
 * Classification: Confidential
 * Performance Quality Form Component
 */

const PerformanceQualityForm: React.FC<PerformanceQualityFormProps> = ({
  processChecklistDetailId,
  processChecklistId,
  formData,
  onFormDataChange,
}) => {
  const router = useRouter()
  const { draftSave, clearDraftSave, isDraftSaving, draftData, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'performance_qualification',
    context_instance_id: processChecklistId,
    enableFetch: false,
  })

  const handleDraftSave = (override?: Partial<PerformanceQualityFormData>) => {
    draftSave({
      form_data: {
        id: processChecklistId ?? new Date().getTime(),
        ...formData,
        ...override,
        type: 'draft',
      },
    })
  }

  const [openModal, setOpenModal] = useState(false)
  const [editingDetail, setEditingDetail] = useState<PerformanceQualificationDetail | null>(null)
  const [modalErrors, setModalErrors] = useState<PerformanceModalErrors>({})
  const [finalResultErrors, setFinalResultErrors] = useState<Record<number | string, { min?: string; max?: string }>>({})

  // Modal form state
  const [criticalParameters, setCriticalParameters] = useState('')
  const [optimumRange, setOptimumRange] = useState('')
  const [valueSet, setValueSet] = useState('')
  const [result, setResult] = useState('')
  const [status, setStatus] = useState<string>('')
  const [verificationId, setVerificationId] = useState<number>(NUMBERMAP.ONE)

  // API Hooks
  const { data: performanceQualificationList, isLoading: isLoadingList } =
    useFetchAllPerformanceQualification(processChecklistId)
  const { data: statusData } = useOrganizationStatus()
  const { mutate: upsertPerformanceQualification, isPending: isUpsertPending } =
    useUpsertPerformanceQualification()
  const { mutate: deletePerformanceQualification } = useDeletePerformanceQualification()

  // Comprehensive loading state function
  const isLoading = () => {
    if (isLoadingList) return true
    if (isUpsertPending) return true
    return false
  }

  // Transform API response to form data (handles both array [{}] and object {} response after draft save)
  useEffect(() => {
    const rawData = performanceQualificationList?.data
    if (!rawData) return

    // Normalize: API returns [{}] initially and {} after draft save
    let responseData: any
    if (Array.isArray(rawData)) {
      responseData = rawData.length > NUMBERMAP.ZERO ? rawData[NUMBERMAP.ZERO] : null
    } else {
      responseData = rawData
    }

    if (!responseData) return

    // Draft/object shape: performanceQualificationDetails & finalResultDetails (camelCase)
    const draftDetails = responseData.performanceQualificationDetails
    const draftFinalResults = responseData.finalResultDetails

    if (Array.isArray(draftDetails) && Array.isArray(draftFinalResults)) {
      const finalResultByTempId = new Map<string, any>()
      draftFinalResults.forEach((fr: any) => {
        const key = fr.id ?? fr.temp_id
        if (key != null) finalResultByTempId.set(String(key), fr)
      })

      const transformedDetails: PerformanceQualificationDetail[] = draftDetails.map((item: any, index: number) => {
        const key = item.temp_id ?? item.perf_qualification_id
        const finalResult = key != null ? finalResultByTempId.get(String(key)) : undefined
        return {
          ...item,
          critical_parameter: item.critical_parameters ?? item.critical_parameter ?? '',
          critical_parameters: item.critical_parameters,
          status: item.status_id ?? item.status,
          verification_id: item.verification_id ?? item.verification_result_id,
          min_value: finalResult?.min ?? finalResult?.min_value ?? '',
          max_value: finalResult?.max ?? finalResult?.max_value ?? '',
          sno: item.sno ?? index + NUMBERMAP.ONE,
        }
      })

      const finalResultDetails: FinalResultDetail[] = draftFinalResults.map((fr: any, index: number) => ({
        id: fr.id ?? fr.final_result_id ?? index,
        sno: fr.sno ?? index + NUMBERMAP.ONE,
        critical_parameter: fr.critical_parameters ?? fr.critical_parameter ?? '',
        critical_parameters: fr.critical_parameters ?? fr.critical_parameter,
        min: fr.min ?? fr.min_value ?? '',
        max: fr.max ?? fr.max_value ?? '',
        perf_qualification_id: fr.perf_qualification_id,
        final_result_id: fr.final_result_id,
      }))

      onFormDataChange({
        performanceQualificationDetails: transformedDetails,
        finalResultDetails: finalResultDetails,
      })
      handleDraftSave({ performanceQualificationDetails: transformedDetails, finalResultDetails: finalResultDetails })
      return
    }

    // List/array shape: performance_qualification & final_result (snake_case)
    const performanceQualificationArray = responseData.performance_qualification ?? []
    const finalResultArray = responseData.final_result ?? []

    if (performanceQualificationArray.length === NUMBERMAP.ZERO && finalResultArray.length === NUMBERMAP.ZERO) return

    const finalResultMap = new Map<number, any>()
    finalResultArray.forEach((fr: any) => {
      finalResultMap.set(fr.perf_qualification_id, fr)
    })

    const transformedDetails: PerformanceQualificationDetail[] =
      performanceQualificationArray.map((item: any, index: number) => {
        const finalResult = finalResultMap.get(item.perf_qualification_id)
        return {
          ...item,
          critical_parameter: item.critical_parameters ?? item.critical_parameter,
          status: item.status_id ?? item.status,
          verification_id: item.verification_result_id,
          min_value: finalResult?.min_value ?? '',
          max_value: finalResult?.max_value ?? '',
          sno: index + NUMBERMAP.ONE,
        }
      })

    const finalResultDetails: FinalResultDetail[] = transformedDetails.map((item, index) => ({
      id: item.perf_qualification_id ?? index,
      sno: index + NUMBERMAP.ONE,
      critical_parameter: item.critical_parameter ?? item.critical_parameters ?? '',
      critical_parameters: item.critical_parameters,
      min: item.min_value ?? '',
      max: item.max_value ?? '',
      perf_qualification_id: item.perf_qualification_id,
      final_result_id: item.perf_qualification_id ? finalResultMap.get(item.perf_qualification_id)?.final_result_id : undefined,
    }))

    onFormDataChange({
      performanceQualificationDetails: transformedDetails,
      finalResultDetails: finalResultDetails,
    })
    handleDraftSave({ performanceQualificationDetails: transformedDetails, finalResultDetails: finalResultDetails })
  }, [performanceQualificationList, draftData])

  // Modal field change handlers with error clearing
  const handleCriticalParametersChange = (value: string) => {
    setCriticalParameters(value)
    if (modalErrors.criticalParameters) {
      setModalErrors((prev) => ({ ...prev, criticalParameters: '' }))
    }
  }

  const handleOptimumRangeChange = (value: string) => {
    setOptimumRange(value)
    if (modalErrors.optimumRange) {
      setModalErrors((prev) => ({ ...prev, optimumRange: '' }))
    }
  }

  const handleValueSetChange = (value: string) => {
    setValueSet(value)
    if (modalErrors.valueSet) {
      setModalErrors((prev) => ({ ...prev, valueSet: '' }))
    }
  }

  const handleResultChange = (value: string | number) => {
    setResult(value as string)
    if (modalErrors.result) {
      setModalErrors((prev) => ({ ...prev, result: '' }))
    }
  }


  // Performance Qualification columns
  const performanceQualificationColumns = [
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.SNO,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.SNO,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.CRITICAL_PARAMETER,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.CRITICAL_PARAMETER,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.OPTIMUM_RANGE,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.OPTIMUM_RANGE,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.VALUE_SET,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.VALUE_SET,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.RESULT,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.RESULT,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.STATUS,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <StatusTypography value={params.row.status} />
      ),
    },
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.ACTION,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.ACTION,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        const isInactive = params.row.status_id === NUMBERMAP.TWO || params.row.status === NUMBERMAP.TWO
        return (
          <ActionButton
            onDelete={() =>
              handleDeleteDetail(params.row.perf_qualification_id ?? params.row.temp_id)
            }
            onEdit={() => handleEditDetail(params.row)}
            deleteDisabled={isInactive}
          />
        )
      },
    },
  ]

  // Final Result handlers
  const handleFinalResultChange = (id: number, field: 'min' | 'max', value: string) => {
    // Only allow numeric input (integers and decimals)
    if (value === '' || /^\d+(\.\d+)?$/.test(value)) {
      const updatedDetails = formData.finalResultDetails.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
      const nextFormData = { ...formData, finalResultDetails: updatedDetails }
      onFormDataChange(nextFormData)
      setTimeout(() => handleDraftSave(nextFormData), 0)

      // Clear error when user enters value
      if (finalResultErrors[id]?.[field]) {
        setFinalResultErrors((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            [field]: undefined,
          },
        }))
      }
    }
  }

  // Final Result columns
  const finalResultColumns = [
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.SNO,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.SNO,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.CRITICAL_PARAMETER,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.CRITICAL_PARAMETER,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.MIN,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.MIN,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => (
        <InputField
          placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_MIN}
          value={params.row.min ?? ''}
          onChange={(value: string) => handleFinalResultChange(params.row.id, 'min', value)}
          label=""
          error={finalResultErrors[params.row.id]?.min}
        />
      ),
    },
    {
      field: PERFORMANCE_QUALIFICATION_FIELDS.MAX,
      headerName: PERFORMANCE_QUALIFICATION_HEADERS.MAX,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => (
        <InputField
          placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_MAX}
          value={params.row.max ?? ''}
          onChange={(value: string) => handleFinalResultChange(params.row.id, 'max', value)}
          label=""
          error={finalResultErrors[params.row.id]?.max}
        />
      ),
    },
  ]

  const handleDeleteDetail = async (id?: number | string) => {
    if (!id) return

    // If it's a temp_id, soft delete by setting status to inactive (2)
    if (typeof id === 'string' && id.startsWith(TEMP_ID_PREFIX)) {
      const updatedDetails = formData.performanceQualificationDetails.map((item) =>
        item.temp_id === id
          ? { ...item, status: NUMBERMAP.TWO, status_id: NUMBERMAP.TWO }
          : item
      )
      const updatedFinalResultDetails = updatedDetails.map((item, index) => ({
        id: item.perf_qualification_id ?? item.temp_id ?? index,
        sno: index + NUMBERMAP.ONE,
        critical_parameter: item.critical_parameter ?? item.critical_parameters ?? '',
        critical_parameters: item.critical_parameters,
        min: item.min_value ?? '',
        max: item.max_value ?? '',
        perf_qualification_id: item.perf_qualification_id,
      }))
      const nextFormData = { performanceQualificationDetails: updatedDetails, finalResultDetails: updatedFinalResultDetails }
      onFormDataChange(nextFormData)
      setTimeout(() => handleDraftSave(nextFormData), 0)
      return
    }

    // If it's a real ID, call delete API
    const result = await showActionAlert(DELETE)
    if (!result.isConfirmed) return
    deletePerformanceQualification(id as number)
  }

  const handleEditDetail = (row: PerformanceQualificationDetail) => {
    setEditingDetail(row)
    setCriticalParameters(row.critical_parameter ?? row.critical_parameters ?? '')
    setOptimumRange(row.optimum_range)
    setValueSet(row.value_set)
    setResult(row.verification_result_id ? 'pass' : 'fail')
    setStatus(row.status?.toString() ?? row.status_id?.toString() ?? '')
    setVerificationId(row.verification_id ?? row.verification_result_id ?? NUMBERMAP.ONE)
    setModalErrors({})
    setOpenModal(true)
  }

  const handleAddDetail = () => {
    setEditingDetail(null)
    setCriticalParameters('')
    setOptimumRange('')
    setValueSet('')
    setResult('')
    setStatus('')
    setVerificationId(NUMBERMAP.ONE)
    setModalErrors({})
    setOpenModal(true)
  }

  const validateModalForm = (): boolean => {
    const newErrors: PerformanceModalErrors = {}
    let isValid = true

    // Validate Critical Parameters
    if (!criticalParameters || criticalParameters.trim() === '') {
      newErrors.criticalParameters = PROCESS_VALIDATION_ERROR_MESSAGES.CRITICAL_PARAMETER_REQUIRED
      isValid = false
    }

    // Validate Optimum Range
    if (!optimumRange || optimumRange.trim() === '') {
      newErrors.optimumRange = PROCESS_VALIDATION_ERROR_MESSAGES.OPTIMUM_RANGE_REQUIRED
      isValid = false
    }

    // Validate Value Set
    if (!valueSet || valueSet.trim() === '') {
      newErrors.valueSet = PROCESS_VALIDATION_ERROR_MESSAGES.VALUE_SET_REQUIRED
      isValid = false
    }

    // Validate Result
    if (!result || (typeof result === 'string' && result.trim() === '')) {
      newErrors.result = PROCESS_VALIDATION_ERROR_MESSAGES.RESULT_REQUIRED
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

    const detailData: PerformanceQualificationDetail = {
      ...(editingDetail?.perf_qualification_id && { perf_qualification_id: editingDetail.perf_qualification_id }),
      ...(editingDetail?.temp_id && { temp_id: editingDetail.temp_id }),
      sno: editingDetail
        ? editingDetail.sno
        : formData.performanceQualificationDetails.length + NUMBERMAP.ONE,
      critical_parameter: criticalParameters.trim(),
      critical_parameters: criticalParameters.trim(),
      optimum_range: optimumRange.trim(),
      value_set: valueSet.trim(),
      result: result,
      status: status ? Number(status) : NUMBERMAP.ONE,
      status_id: status ? Number(status) : NUMBERMAP.ONE,
      verification_id: verificationId,
      verification_result_id: verificationId,
    }

    if (editingDetail) {
      // Edit mode - update existing detail
      const updatedDetails = formData.performanceQualificationDetails.map((item) =>
        (item.perf_qualification_id && item.perf_qualification_id === editingDetail.perf_qualification_id) ||
          (item.temp_id && item.temp_id === editingDetail.temp_id)
          ? detailData
          : item
      )
      // Preserve existing min/max values from finalResultDetails
      const updatedFinalResultDetails = updatedDetails.map((item, index) => {
        const existingFinalResult = formData.finalResultDetails.find(
          (fr) => fr.id === (item.perf_qualification_id ?? item.temp_id ?? index)
        )
        return {
          id: item.perf_qualification_id ?? item.temp_id ?? index,
          sno: index + NUMBERMAP.ONE,
          critical_parameter: item.critical_parameter ?? item.critical_parameters ?? '',
          critical_parameters: item.critical_parameters,
          min: existingFinalResult?.min ?? '',
          max: existingFinalResult?.max ?? '',
          perf_qualification_id: item.perf_qualification_id,
        }
      })
      const nextFormData = { performanceQualificationDetails: updatedDetails, finalResultDetails: updatedFinalResultDetails }
      onFormDataChange(nextFormData)
      handleDraftSave(nextFormData)
    } else {
      // Add mode - add new detail with temporary ID
      const tempId = `${TEMP_ID_PREFIX}${Date.now()}_${crypto.randomUUID()}`
      const newDetails = [...formData.performanceQualificationDetails, { ...detailData, temp_id: tempId }]
      const updatedFinalResultDetails = newDetails.map((item, index) => {
        const existingFinalResult = formData.finalResultDetails.find(
          (fr) => fr.id === (item.perf_qualification_id ?? item.temp_id ?? index)
        )
        return {
          id: item.perf_qualification_id ?? item.temp_id ?? index,
          sno: index + NUMBERMAP.ONE,
          critical_parameter: item.critical_parameter ?? item.critical_parameters ?? '',
          critical_parameters: item.critical_parameters,
          min: existingFinalResult?.min ?? '',
          max: existingFinalResult?.max ?? '',
          perf_qualification_id: item.perf_qualification_id,
        }
      })
      const nextFormData = { performanceQualificationDetails: newDetails, finalResultDetails: updatedFinalResultDetails }
      onFormDataChange(nextFormData)
      handleDraftSave(nextFormData)
    }

    handleModalClose()
  }

  const handleModalClose = () => {
    setOpenModal(false)
    setEditingDetail(null)
    setCriticalParameters('')
    setOptimumRange('')
    setValueSet('')
    setResult('')
    setStatus('')
    setVerificationId(NUMBERMAP.ONE)
    setModalErrors({})
  }

  const validateFinalResult = (): boolean => {
    const newErrors: Record<number | string, { min?: string; max?: string }> = {}
    let isValid = true

    formData.finalResultDetails.forEach((item) => {
      const itemErrors: { min?: string; max?: string } = {}

      if (!item.min || item.min.trim() === '') {
        itemErrors.min = PROCESS_VALIDATION_ERROR_MESSAGES.MIN_REQUIRED
        isValid = false
      }

      if (!item.max || item.max.trim() === '') {
        itemErrors.max = PROCESS_VALIDATION_ERROR_MESSAGES.MAX_REQUIRED
        isValid = false
      }

      if (Object.keys(itemErrors).length > NUMBERMAP.ZERO) {
        newErrors[item.id] = itemErrors
      }
    })

    setFinalResultErrors(newErrors)
    return isValid
  }

  const handleSave = async () => {
    // Validate Final Result min/max fields
    if (!validateFinalResult()) {
      return
    }
    clearDraftSave()
    // Prepare performance_qualification array
    const performanceQualificationItems = formData.performanceQualificationDetails.map((detail) => {
      const { temp_id, sno, status_id, critical_parameters, verification_result_id, min_value, max_value, result, ...rest } = detail

      return {
        ...rest,
        critical_parameter: detail.critical_parameter ?? detail.critical_parameters ?? '',
        verification_id: detail.verification_id ?? detail.verification_result_id ?? NUMBERMAP.ONE,
        status: typeof detail.status === 'number' ? detail.status : (detail.status_id ?? NUMBERMAP.ONE),
        ...(detail.perf_qualification_id && !detail.temp_id ? { perf_qualification_id: detail.perf_qualification_id } : {}),
      }
    })

    // Prepare final_result array - include entries for both existing and new records
    // Match by index: final_result[i] corresponds to performance_qualification[i]
    const finalResultItems = formData.performanceQualificationDetails
      .map((perfQualDetail, index) => {
        const fr = formData.finalResultDetails[index]
        // Skip if no final result data or if min/max are empty
        if (!fr?.min?.trim() || !fr?.max?.trim()) return null

        // For existing records, use actual perf_qualification_id
        // For new records (temp_id without perf_qualification_id), use 0 as placeholder
        // Backend will match by index position: final_result[i] matches performance_qualification[i]
        const perfQualificationId = perfQualDetail.perf_qualification_id ?? NUMBERMAP.ZERO

        return {
          perf_qualification_id: perfQualificationId,
          critical_parameter: fr.critical_parameter ?? fr.critical_parameters ?? perfQualDetail.critical_parameter ?? perfQualDetail.critical_parameters ?? '',
          min_value: fr.min,
          max_value: fr.max,
          ...(fr.final_result_id ? { final_result_id: fr.final_result_id } : {}),
        }
      })
      .filter((item): item is FinalResultItem => item !== null)

    // Prepare payload
    const payload: PerformanceQualificationUpsertPayload = {
      process_checklist_id: processChecklistId,
      performance_qualification: performanceQualificationItems,
      final_result: finalResultItems,
    }

    try {
      await new Promise<void>((resolve, reject) => {
        upsertPerformanceQualification(payload, {
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
      <Grid2 container spacing={NUMBERMAP.ONE} sx={P20P40}>
        {/* Performance Qualification DataTable */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title={PERFORMANCE_QUALIFICATION_HEADERS.TABLE_TITLE}
            rows={formData.performanceQualificationDetails.map((row) => ({
              ...row,
              id: row.perf_qualification_id ?? row.temp_id ?? `row-${row.sno}`,
            }))}
            showAddButton
            onAddRow={handleAddDetail}
            columns={performanceQualificationColumns}
            idField="id"
            loading={isLoading()}
            hideFooter={true}
          />
        </Grid2>

        {/* Final Result Section */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }} sx={MarginTop}>
          <DataGridTable
            title={PERFORMANCE_QUALIFICATION_HEADERS.FINAL_RESULT}
            rows={formData.finalResultDetails}
            columns={finalResultColumns}
            idField="id"
            loading={isLoading()}
            hideFooter={true}
            showAddButton={false}
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

      {/* CommonModal for Add/Edit Performance Qualification Detail */}
      <CommonModal
        open={openModal}
        title={editingDetail ? PERFORMANCE_QUALIFICATION_HEADERS.EDIT_TITLE : PERFORMANCE_QUALIFICATION_HEADERS.ADD_TITLE}
        onClose={handleModalClose}
        onSave={handleSaveDetail}
        buttonRequired={true}
        modalMaxWidth="800px"
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={POPUP_STYLE}>
          {/* Critical Parameters */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.CRITICAL_PARAMETER}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_CRITICAL_PARAMETER}
              value={criticalParameters}
              onChange={handleCriticalParametersChange}
              error={modalErrors.criticalParameters}
            />
          </Grid2>

          {/* Optimum Range */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.OPTIMUM_RANGE}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_OPTIMUM_RANGE}
              value={optimumRange}
              onChange={handleOptimumRangeChange}
              error={modalErrors.optimumRange}
            />
          </Grid2>

          {/* Value Set */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.VALUE_SET}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_VALUE_SET}
              value={valueSet}
              onChange={handleValueSetChange}
              error={modalErrors.valueSet}
            />
          </Grid2>

          <ResultAndStatusFields
            result={result}
            status={status}
            resultError={modalErrors.result}
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

export default PerformanceQualityForm
