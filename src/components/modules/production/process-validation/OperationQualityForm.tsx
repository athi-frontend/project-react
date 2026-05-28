'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Grid2, Typography } from '@mui/material'
import {
  InputField,
  Description,
  DataGridTable,
  ActionButton,
  showActionAlert,
} from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import {
  useFetchAllOperationalQualification,
  useFetchOperationalQualificationById,
  useUpsertOperationalQualification,
  useDeleteOperationalQualification,
} from '@/hooks/modules/production/useProcessValidation'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import {
  OperationalQualificationDetail,
  OperationalQualificationUpsertPayload,
  OperationQualityFormProps,
  WorstCaseModalErrors,
  BestCaseModalErrors,
} from '@/types/modules/production/process-validation'
import {
  PROCESS_VALIDATION_FORM_LABELS,
  PROCESS_VALIDATION_FORM_PLACEHOLDERS,
  PROCESS_VALIDATION_ERROR_MESSAGES,
  OQC_TYPE,
  OQC_FIELDS,
  STATUS_DROPDOWN_CONFIG,
  OPERATIONAL_QUALIFICATION_FIELDS,
  OPERATIONAL_QUALIFICATION_HEADERS
} from '@/constants/modules/production/process-validation'
import { DELETE } from '@/constants/modules/dnd/pnd'
import { SectionTitle, SectionTitleTypography } from '@/styles/modules/production/process-validation'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { MarginTop } from '@/styles/components/modules/prototypeModal'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'

/**
 * Classification: Confidential
 * Operation Quality Form Component
 */

const OperationQualityForm: React.FC<OperationQualityFormProps> = ({
  processChecklistId,
  formData,
  onFormDataChange,
}) => {
  
  const [openWorstCaseModal, setOpenWorstCaseModal] = useState(false)
  const [openBestCaseModal, setOpenBestCaseModal] = useState(false)
  const [editingWorstCaseDetail, setEditingWorstCaseDetail] =
    useState<OperationalQualificationDetail | null>(null)
  const [editingBestCaseDetail, setEditingBestCaseDetail] =
    useState<OperationalQualificationDetail | null>(null)
  const [worstCaseErrors, setWorstCaseErrors] = useState<WorstCaseModalErrors>({})
  const [bestCaseErrors, setBestCaseErrors] = useState<BestCaseModalErrors>({})

  // Worst Case Modal form state
  const [worstCaseCriticalParameter, setWorstCaseCriticalParameter] = useState('')
  const [worstCaseSetting, setWorstCaseSetting] = useState('')
  const [worstCaseResultExpected, setWorstCaseResultExpected] = useState('')
  const [worstCaseResultMeasuredLater, setWorstCaseResultMeasuredLater] = useState<string>('')
  const [worstCaseStatus, setWorstCaseStatus] = useState<string>('')

  // Best Case Modal form state
  const [bestCaseCriticalParameter, setBestCaseCriticalParameter] = useState('')
  const [bestCaseSetting, setBestCaseSetting] = useState('')
  const [bestCaseResultExpected, setBestCaseResultExpected] = useState('')
  const [bestCaseResultMeasuredLater, setBestCaseResultMeasuredLater] = useState<string>('')
  const [bestCaseStatus, setBestCaseStatus] = useState<string>('')

  // API Hooks
  const { data: operationalQualificationList, isLoading: isLoadingList } =
    useFetchAllOperationalQualification(processChecklistId)
  const oqcDetailIdWorst = editingWorstCaseDetail?.oqc_detail_id 
  const oqcDetailIdBest = editingBestCaseDetail?.oqc_detail_id 
  const { data: oqcByIdWorst } = useFetchOperationalQualificationById(oqcDetailIdWorst)
  const { data: oqcByIdBest } = useFetchOperationalQualificationById(oqcDetailIdBest)
  const { data: statusData } = useOrganizationStatus()
  const { mutate: upsertOperationalQualification, isPending: isUpsertPending } =
    useUpsertOperationalQualification()
  const { mutate: deleteOperationalQualification } = useDeleteOperationalQualification()
  const { draftSave: draftSaveWorst, isDraftSaving: isDraftSavingWorst, draftData: draftDataWorst, fetchDraft: fetchDraftWorst, checkUnsavedDraftBeforeLeave: checkUnsavedDraftBeforeLeaveWorst } = useDraftSave({
    context_type: 'operational_qualification_worst',
    context_instance_id: editingWorstCaseDetail?.oqc_detail_id ?? null,
    enableFetch: false,
  })

  const { draftSave: draftSaveBest, isDraftSaving: isDraftSavingBest, draftData: draftDataBest, fetchDraft: fetchDraftBest, checkUnsavedDraftBeforeLeave: checkUnsavedDraftBeforeLeaveBest } = useDraftSave({
    context_type: 'operational_qualification_best',
    context_instance_id: editingBestCaseDetail?.oqc_detail_id ?? null,
    enableFetch: false,
  })

  type OqcDraftType = 'worst' | 'best'

  const loadDraftDataHandler = (type: OqcDraftType, data: any) => {
    if (!data) return
    const parsed = data?.form_data ?? data
    if (type === 'worst') {
      const worstCaseSettings = Array.isArray(parsed.worstCaseSettings) ? parsed.worstCaseSettings : []
      onFormDataChange({ ...formData, worstCaseSettings })
    } else {
      const bestCaseSettings = Array.isArray(parsed.bestCaseSettings) ? parsed.bestCaseSettings : []
      onFormDataChange({ ...formData, bestCaseSettings })
    }
  }

  const handleDraftSave = (type: OqcDraftType, settings?: OperationalQualificationDetail[]) => {
    const payload = {
      form_data: {
        id: processChecklistId ?? new Date().getTime(),
        type: 'draft' as const,
        ...(type === 'worst'
          ? { worstCaseSettings: settings ?? formData.worstCaseSettings }
          : { bestCaseSettings: settings ?? formData.bestCaseSettings }),
      },
    }
    type === 'worst' ? draftSaveWorst(payload) : draftSaveBest(payload)
  }

  // Comprehensive loading state function
  const isLoading = () => {
    if (isLoadingList) return true
    if (isUpsertPending) return true
    return false
  }

  const preferDraftOnceRef = useRef(true)
  const lastListDataRef = useRef<unknown>(undefined)
  useEffect(() => {
    if (!draftDataWorst?.data) return
    const raw = typeof draftDataWorst.data === 'string' ? JSON.parse(draftDataWorst.data) : draftDataWorst.data
    const payload = raw && typeof raw === 'object' && raw.data != null ? raw.data : raw
    loadDraftDataHandler('worst', payload)
  }, [draftDataWorst])

  useEffect(() => {
    if (!draftDataBest?.data) return
    const raw = typeof draftDataBest.data === 'string' ? JSON.parse(draftDataBest.data) : draftDataBest.data
    const payload = raw && typeof raw === 'object' && raw.data != null ? raw.data : raw
    loadDraftDataHandler('best', payload)
  }, [draftDataBest])

  // Resolve single item from fetch-by-ID response: API returns data as [{}] or {} (after draft save)
  const resolveOqcItem = (response: any): Record<string, unknown> | null => {
    const raw = response?.data ?? response
    if (raw == null || typeof raw !== 'object') return null
    if (Array.isArray(raw)) return raw.length > NUMBERMAP.ONE ? raw[NUMBERMAP.ZERO] : null
    return raw.critical_parameter !== undefined || raw.case_setting !== undefined ? raw : null
  }

  // When editing, fill modal from useFetchOperationalQualificationById response (worst case)
  useEffect(() => {
    if (!openWorstCaseModal || !editingWorstCaseDetail?.oqc_detail_id || !oqcByIdWorst) return
    const item = resolveOqcItem(oqcByIdWorst)
    if (!item) return
    setWorstCaseCriticalParameter(item.critical_parameter ?? '')
    setWorstCaseSetting(item.case_setting ?? '')
    setWorstCaseResultExpected(item.result_expected ?? '')
    setWorstCaseResultMeasuredLater(item.result_measured_later ?? '')
    setWorstCaseStatus(item.status_id ?? '')
  }, [openWorstCaseModal, editingWorstCaseDetail?.oqc_detail_id, oqcByIdWorst])

  // When editing, fill modal from useFetchOperationalQualificationById response (best case)
  useEffect(() => {
    if (!openBestCaseModal || !editingBestCaseDetail?.oqc_detail_id || !oqcByIdBest) return
    const item = resolveOqcItem(oqcByIdBest)
    if (!item) return
    setBestCaseCriticalParameter(item.critical_parameter ?? '')
    setBestCaseSetting(item.case_setting ?? '')
    setBestCaseResultExpected(item.result_expected ?? '')
    setBestCaseResultMeasuredLater(item.result_measured_later ?? '')
    setBestCaseStatus(item.status_id ?? '')
  }, [openBestCaseModal, editingBestCaseDetail?.oqc_detail_id, oqcByIdBest])

  // Transform API response to form data (prefer draft on first load only)
  useEffect(() => {
    const listData = operationalQualificationList?.data?.[NUMBERMAP.ZERO]
    if (!listData) return

    if ((draftDataWorst?.data || draftDataBest?.data) && preferDraftOnceRef.current) {
      preferDraftOnceRef.current = false
      return
    }

    const responseData = listData as Record<string, unknown>
    if (responseData?.type === 'draft') {
      if (responseData.worstCaseSettings != null) loadDraftDataHandler('worst', responseData)
      if (responseData.bestCaseSettings != null) loadDraftDataHandler('best', responseData)
      return
    }

    const listDataChanged = lastListDataRef.current !== listData
    if (!listDataChanged) return
    lastListDataRef.current = listData

    const worstCaseDetails: OperationalQualificationDetail[] =
      (responseData.worst_case as any[])?.map((item: any, index: number) => ({
        ...item,
        worst_case_setting: item.case_setting ?? '',
        status: item.status_id ?? item.status ?? '',
        oqc_type: OQC_TYPE.WORST,
      })) ?? []

    const bestCaseDetails: OperationalQualificationDetail[] =
      (responseData.best_case as any[])?.map((item: any, index: number) => ({
        ...item,
        best_case_setting: item.case_setting ?? '',
        result_measured_later: item.result_measured_later?.toString() ?? '',
        status: item.status_id ?? item.status ?? '',
        status_id: item.status_id,
        oqc_type: OQC_TYPE.BEST,
      })) ?? []

    onFormDataChange({
      worstCaseSettings: worstCaseDetails,
      bestCaseSettings: bestCaseDetails,
    })
    handleDraftSave('worst', worstCaseDetails)
    handleDraftSave('best', bestCaseDetails)
  }, [operationalQualificationList, draftDataWorst, draftDataBest])

  // Shared delete handler
  const handleDeleteDetail = async (oqcDetailId?: number) => {
    if (!oqcDetailId) return

    const result = await showActionAlert(DELETE)
    if (!result.isConfirmed) return

    deleteOperationalQualification(oqcDetailId)
  }

  // Worst Case Settings handlers
  const handleDeleteWorstCaseDetail = handleDeleteDetail

  const handleEditWorstCaseDetail = (row: OperationalQualificationDetail) => {
    setEditingWorstCaseDetail(row)
    setWorstCaseCriticalParameter(row.critical_parameter)
    setWorstCaseSetting(row.worst_case_setting ?? '')
    setWorstCaseResultExpected(row.result_expected)
    setWorstCaseResultMeasuredLater(row.result_measured_later?.toString() ?? '')
    setWorstCaseStatus(row.status_id?.toString() ?? row.status?.toString() ?? '')
    setWorstCaseErrors({})
    setOpenWorstCaseModal(true)
  }

  const handleAddWorstCaseDetail = () => {
    fetchDraftWorst()
    setOpenWorstCaseModal(true)
  }

  // Worst Case field change handlers with error clearing
  const handleWorstCaseCriticalParameterChange = (value: string) => {
    setWorstCaseCriticalParameter(value)
    if (worstCaseErrors.criticalParameter) {
      setWorstCaseErrors((prev) => ({ ...prev, criticalParameter: '' }))
    }
  }

  const handleWorstCaseSettingChange = (value: string) => {
    setWorstCaseSetting(value)
    if (worstCaseErrors.worstCaseSetting) {
      setWorstCaseErrors((prev) => ({ ...prev, worstCaseSetting: '' }))
    }
  }

  const handleWorstCaseResultExpectedChange = (value: string) => {
    setWorstCaseResultExpected(value)
    if (worstCaseErrors.resultExpected) {
      setWorstCaseErrors((prev) => ({ ...prev, resultExpected: '' }))
    }
  }

  const handleWorstCaseResultMeasuredLaterChange = (value: string) => {
    // Only allow numeric input (integers and decimals)
    if (value === '' || /^\d+(\.\d+)?$/.test(value)) {
      setWorstCaseResultMeasuredLater(value)
      if (worstCaseErrors.resultMeasuredLater) {
        setWorstCaseErrors((prev) => ({ ...prev, resultMeasuredLater: '' }))
      }
    }
  }

  const validateWorstCaseForm = (): boolean => {
    const newErrors: WorstCaseModalErrors = {}
    let isValid = true

    if (!worstCaseCriticalParameter || worstCaseCriticalParameter.trim() === '') {
      newErrors.criticalParameter = PROCESS_VALIDATION_ERROR_MESSAGES.CRITICAL_PARAMETER_REQUIRED
      isValid = false
    }

    if (!worstCaseSetting || worstCaseSetting.trim() === '') {
      newErrors.worstCaseSetting = PROCESS_VALIDATION_ERROR_MESSAGES.WORST_CASE_SETTING_REQUIRED
      isValid = false
    }

    if (!worstCaseResultExpected || worstCaseResultExpected.trim() === '') {
      newErrors.resultExpected = PROCESS_VALIDATION_ERROR_MESSAGES.RESULT_EXPECTED_REQUIRED
      isValid = false
    }

    if (!worstCaseResultMeasuredLater || worstCaseResultMeasuredLater.trim() === '') {
      newErrors.resultMeasuredLater =
        PROCESS_VALIDATION_ERROR_MESSAGES.RESULT_MEASURED_LATER_REQUIRED
      isValid = false
    }

    if (!worstCaseStatus || worstCaseStatus.trim() === '') {
      newErrors.status = PROCESS_VALIDATION_ERROR_MESSAGES.STATUS_REQUIRED
      isValid = false
    }

    setWorstCaseErrors(newErrors)
    return isValid
  }

  const handleSaveWorstCaseDetail = () => {
    if (!validateWorstCaseForm()) {
      return
    }

    const payload: OperationalQualificationUpsertPayload = {
      ...(editingWorstCaseDetail?.oqc_detail_id && {
        oqc_detail_id: editingWorstCaseDetail.oqc_detail_id,
      }),
      process_checklist_id: processChecklistId,
      oqc_type: OQC_TYPE.WORST,
      critical_parameter: worstCaseCriticalParameter.trim(),
      case_setting: worstCaseSetting.trim(),
      result_expected: worstCaseResultExpected.trim(),
      measured_later:
        worstCaseResultMeasuredLater && worstCaseResultMeasuredLater.trim() !== ''
          ? Number(worstCaseResultMeasuredLater)
          : NUMBERMAP.ZERO,
      status_id: worstCaseStatus ? Number(worstCaseStatus) : NUMBERMAP.ONE,
    }

    upsertOperationalQualification(payload, {
      onSuccess: () => {
        handleCloseWorstCaseModal()
      },
    })
  }

  const handleCloseWorstCaseModal = async () => {
    await checkUnsavedDraftBeforeLeaveWorst()
    setOpenWorstCaseModal(false)
    setEditingWorstCaseDetail(null)
  }

  // Best Case Settings handlers
  const handleDeleteBestCaseDetail = handleDeleteDetail

  const handleEditBestCaseDetail = (row: OperationalQualificationDetail) => {
    setEditingBestCaseDetail(row)
    setBestCaseCriticalParameter(row.critical_parameter)
    setBestCaseSetting(row.best_case_setting ?? '')
    setBestCaseResultExpected(row.result_expected)
    setBestCaseResultMeasuredLater(row.result_measured_later?.toString() ?? '')
    setBestCaseStatus(row.status_id?.toString() ?? row.status?.toString() ?? '')
    setBestCaseErrors({})
    setOpenBestCaseModal(true)
  }

  const handleAddBestCaseDetail = () => {
    fetchDraftBest()
    setEditingBestCaseDetail(null)
    setBestCaseCriticalParameter('')
    setBestCaseSetting('')
    setBestCaseResultExpected('')
    setBestCaseResultMeasuredLater('')
    setBestCaseStatus('')
    setBestCaseErrors({})
    setOpenBestCaseModal(true)
  }

  // Best Case field change handlers with error clearing
  const handleBestCaseCriticalParameterChange = (value: string) => {
    setBestCaseCriticalParameter(value)
    if (bestCaseErrors.criticalParameter) {
      setBestCaseErrors((prev) => ({ ...prev, criticalParameter: '' }))
    }
  }

  const handleBestCaseSettingChange = (value: string) => {
    setBestCaseSetting(value)
    if (bestCaseErrors.bestCaseSetting) {
      setBestCaseErrors((prev) => ({ ...prev, bestCaseSetting: '' }))
    }
  }

  const handleBestCaseResultExpectedChange = (value: string) => {
    setBestCaseResultExpected(value)
    if (bestCaseErrors.resultExpected) {
      setBestCaseErrors((prev) => ({ ...prev, resultExpected: '' }))
    }
  }

  const handleBestCaseResultMeasuredLaterChange = (value: string) => {
    // Only allow numeric input (integers and decimals)
    if (value === '' || /^\d+(\.\d+)?$/.test(value)) {
      setBestCaseResultMeasuredLater(value)
      if (bestCaseErrors.resultMeasuredLater) {
        setBestCaseErrors((prev) => ({ ...prev, resultMeasuredLater: '' }))
      }
    }
  }

  const validateBestCaseForm = (): boolean => {
    const newErrors: BestCaseModalErrors = {}
    let isValid = true

    if (!bestCaseCriticalParameter || bestCaseCriticalParameter.trim() === '') {
      newErrors.criticalParameter = PROCESS_VALIDATION_ERROR_MESSAGES.CRITICAL_PARAMETER_REQUIRED
      isValid = false
    }

    if (!bestCaseSetting || bestCaseSetting.trim() === '') {
      newErrors.bestCaseSetting = PROCESS_VALIDATION_ERROR_MESSAGES.BEST_CASE_SETTING_REQUIRED
      isValid = false
    }

    if (!bestCaseResultExpected || bestCaseResultExpected.trim() === '') {
      newErrors.resultExpected = PROCESS_VALIDATION_ERROR_MESSAGES.RESULT_EXPECTED_REQUIRED
      isValid = false
    }

    if (!bestCaseResultMeasuredLater || bestCaseResultMeasuredLater.trim() === '') {
      newErrors.resultMeasuredLater =
        PROCESS_VALIDATION_ERROR_MESSAGES.RESULT_MEASURED_LATER_REQUIRED
      isValid = false
    }

    if (!bestCaseStatus || bestCaseStatus.trim() === '') {
      newErrors.status = PROCESS_VALIDATION_ERROR_MESSAGES.STATUS_REQUIRED
      isValid = false
    }

    setBestCaseErrors(newErrors)
    return isValid
  }

  const handleSaveBestCaseDetail = () => {
    if (!validateBestCaseForm()) {
      return
    }

    const payload: OperationalQualificationUpsertPayload = {
      ...(editingBestCaseDetail?.oqc_detail_id && {
        oqc_detail_id: editingBestCaseDetail.oqc_detail_id,
      }),
      process_checklist_id: processChecklistId,
      oqc_type: OQC_TYPE.BEST,
      critical_parameter: bestCaseCriticalParameter.trim(),
      case_setting: bestCaseSetting.trim(),
      result_expected: bestCaseResultExpected.trim(),
      measured_later:
        bestCaseResultMeasuredLater && bestCaseResultMeasuredLater.trim() !== ''
          ? Number(bestCaseResultMeasuredLater)
          : NUMBERMAP.ZERO,
      status_id: bestCaseStatus ? Number(bestCaseStatus) : NUMBERMAP.ONE,
    }

    upsertOperationalQualification(payload, {
      onSuccess: () => {
        handleCloseBestCaseModal()
      },
    })
  }

  const handleCloseBestCaseModal = async () => {
    await checkUnsavedDraftBeforeLeaveBest()
    setOpenBestCaseModal(false)
    setEditingBestCaseDetail(null)
  }

  // Helper function to create case settings columns
  const createCaseSettingsColumns = (
    settingField: string,
    settingHeader: string,
    onDelete: (id?: number) => void,
    onEdit: (row: OperationalQualificationDetail) => void
  ) => [
    {
      field: OPERATIONAL_QUALIFICATION_FIELDS.SNO,
      headerName: OPERATIONAL_QUALIFICATION_HEADERS.SNO,
      flex: NUMBERMAP.ONE,
    },
    {
      field: OPERATIONAL_QUALIFICATION_FIELDS.CRITICAL_PARAMETER,
      headerName: OPERATIONAL_QUALIFICATION_HEADERS.CRITICAL_PARAMETER,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: settingField,
      headerName: settingHeader,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: OPERATIONAL_QUALIFICATION_FIELDS.RESULT_EXPECTED,
      headerName: OPERATIONAL_QUALIFICATION_HEADERS.RESULT_EXPECTED,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: OPERATIONAL_QUALIFICATION_FIELDS.RESULT_MEASURED_LATER,
      headerName: OPERATIONAL_QUALIFICATION_HEADERS.RESULT_MEASURED_LATER,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: OPERATIONAL_QUALIFICATION_FIELDS.STATUS,
      headerName: OPERATIONAL_QUALIFICATION_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => <StatusTypography value={params.row.status} />,
    },
    {
      field: OPERATIONAL_QUALIFICATION_FIELDS.ACTION,
      headerName: OPERATIONAL_QUALIFICATION_HEADERS.ACTION,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        const isInactive = params.row.status === NUMBERMAP.TWO || params.row.status_id === NUMBERMAP.TWO
        return (
          <ActionButton
            onDelete={() => onDelete(params.row.oqc_detail_id)}
            onEdit={() => onEdit(params.row)}
            deleteDisabled={isInactive}
          />
        )
      },
    },
  ]

  // Worst Case Settings columns
  const worstCaseSettingsColumns = createCaseSettingsColumns(
    OPERATIONAL_QUALIFICATION_FIELDS.WORST_CASE_SETTING,
    OPERATIONAL_QUALIFICATION_HEADERS.WORST_CASE_SETTING,
    handleDeleteWorstCaseDetail,
    handleEditWorstCaseDetail
  )

  // Best Case Settings columns
  const bestCaseSettingsColumns = createCaseSettingsColumns(
    OPERATIONAL_QUALIFICATION_FIELDS.BEST_CASE_SETTING,
    OPERATIONAL_QUALIFICATION_HEADERS.BEST_CASE_SETTING,
    handleDeleteBestCaseDetail,
    handleEditBestCaseDetail
  )

  return (
    <>
      {(isDraftSavingWorst ?? isDraftSavingBest) && <DraftLoading />}
      <Grid2 container spacing={NUMBERMAP.ONE} sx={P20P40}>
        {/* Section Title */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <SectionTitle>
            <Typography sx={SectionTitleTypography}>Operational Qualification</Typography>
          </SectionTitle>
        </Grid2>

        {/* Worst Case Settings DataTable */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title={OPERATIONAL_QUALIFICATION_HEADERS.WORST_CASE_SETTINGS}
            rows={formData.worstCaseSettings}
            showAddButton
            onAddRow={handleAddWorstCaseDetail}
            columns={worstCaseSettingsColumns}
            idField={OQC_FIELDS.OQC_DETAIL_ID}
            loading={isLoading()}
            hideFooter={true}
          />
        </Grid2>

        {/* Best Case Settings DataTable */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }} sx={MarginTop}>
          <DataGridTable
            title={OPERATIONAL_QUALIFICATION_HEADERS.BEST_CASE_SETTINGS}
            rows={formData.bestCaseSettings}
            showAddButton
            onAddRow={handleAddBestCaseDetail}
            columns={bestCaseSettingsColumns}
            idField={OQC_FIELDS.OQC_DETAIL_ID}
            loading={isLoading()}
            hideFooter={true}
          />
        </Grid2>
      </Grid2>

      {/* CommonModal for Add/Edit Worst Case Setting Detail */}
      <CommonModal
        open={openWorstCaseModal}
        title={editingWorstCaseDetail ? OPERATIONAL_QUALIFICATION_HEADERS.EDIT_WORST_TITLE : OPERATIONAL_QUALIFICATION_HEADERS.ADD_WORST_TITLE}
        onClose={handleCloseWorstCaseModal}
        onSave={handleSaveWorstCaseDetail}
        buttonRequired={true}
        modalMaxWidth="800px"
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={POPUP_STYLE}>
          {/* Critical Parameter */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.CRITICAL_PARAMETER}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_CRITICAL_PARAMETER}
              value={worstCaseCriticalParameter}
              onChange={handleWorstCaseCriticalParameterChange}
              error={worstCaseErrors.criticalParameter}
            />
          </Grid2>

          {/* Worst Case Setting */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={OPERATIONAL_QUALIFICATION_HEADERS.WORST_CASE_SETTING}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_WORST_CASE_SETTING}
              value={worstCaseSetting}
              onChange={handleWorstCaseSettingChange}
              error={worstCaseErrors.worstCaseSetting}
            />
          </Grid2>

          {/* Result Expected */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.RESULT_EXPECTED}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_RESULT_EXPECTED}
              value={worstCaseResultExpected}
              onChange={handleWorstCaseResultExpectedChange}
              error={worstCaseErrors.resultExpected}
            />
          </Grid2>

          {/* Result Measured Later */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={PROCESS_VALIDATION_FORM_LABELS.RESULT_MEASURED_LATER}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_RESULT_MEASURED_LATER}
              value={worstCaseResultMeasuredLater}
              onChange={handleWorstCaseResultMeasuredLaterChange}
              error={worstCaseErrors.resultMeasuredLater}
            />
          </Grid2>

          {/* Status */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={PROCESS_VALIDATION_FORM_LABELS.STATUS}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.SELECT_STATUS}
              isDropdown
              options={statusData?.data ?? []}
              keyField={STATUS_DROPDOWN_CONFIG.KEY_FIELD}
              valueField={STATUS_DROPDOWN_CONFIG.VALUE_FIELD}
              value={worstCaseStatus}
              onChange={(value: string) => {
                setWorstCaseStatus(value)
                if (worstCaseErrors.status) {
                  setWorstCaseErrors((prev) => ({ ...prev, status: '' }))
                }
              }}
              error={worstCaseErrors.status}
            />
          </Grid2>
        </Grid2>
      </CommonModal>

      {/* CommonModal for Add/Edit Best Case Setting Detail */}
      <CommonModal
        open={openBestCaseModal}
        title={editingBestCaseDetail ? OPERATIONAL_QUALIFICATION_HEADERS.EDIT_BEST_TITLE : OPERATIONAL_QUALIFICATION_HEADERS.ADD_BEST_TITLE}
        onClose={handleCloseBestCaseModal}
        onSave={handleSaveBestCaseDetail}
        buttonRequired={true}
        modalMaxWidth="800px"
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={POPUP_STYLE}>
          {/* Critical Parameter */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.CRITICAL_PARAMETER}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_CRITICAL_PARAMETER}
              value={bestCaseCriticalParameter}
              onChange={handleBestCaseCriticalParameterChange}
              error={bestCaseErrors.criticalParameter}
            />
          </Grid2>

          {/* Best Case Setting */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={OPERATIONAL_QUALIFICATION_HEADERS.BEST_CASE_SETTING}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_BEST_CASE_SETTING}
              value={bestCaseSetting}
              onChange={handleBestCaseSettingChange}
              error={bestCaseErrors.bestCaseSetting}
            />
          </Grid2>

          {/* Result Expected */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={PROCESS_VALIDATION_FORM_LABELS.RESULT_EXPECTED}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_RESULT_EXPECTED}
              value={bestCaseResultExpected}
              onChange={handleBestCaseResultExpectedChange}
              error={bestCaseErrors.resultExpected}
            />
          </Grid2>

          {/* Result Measured Later */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={PROCESS_VALIDATION_FORM_LABELS.RESULT_MEASURED_LATER}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.ENTER_RESULT_MEASURED_LATER}
              value={bestCaseResultMeasuredLater}
              onChange={handleBestCaseResultMeasuredLaterChange}
              error={bestCaseErrors.resultMeasuredLater}
            />
          </Grid2>

          {/* Status */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={PROCESS_VALIDATION_FORM_LABELS.STATUS}
              placeholder={PROCESS_VALIDATION_FORM_PLACEHOLDERS.SELECT_STATUS}
              isDropdown
              options={statusData?.data ?? []}
              keyField={STATUS_DROPDOWN_CONFIG.KEY_FIELD}
              valueField={STATUS_DROPDOWN_CONFIG.VALUE_FIELD}
              value={bestCaseStatus}
              onChange={(value: string) => {
                setBestCaseStatus(value)
                if (bestCaseErrors.status) {
                  setBestCaseErrors((prev) => ({ ...prev, status: '' }))
                }
              }}
              error={bestCaseErrors.status}
            />
          </Grid2>
        </Grid2>
      </CommonModal>
    </>
  )
}

export default OperationQualityForm
