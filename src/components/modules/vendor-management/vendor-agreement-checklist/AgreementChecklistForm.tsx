'use client'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Box, Grid2 } from '@mui/material'
import { ButtonGroup, DataGridTable, InputField, RadioButtonGroup, showActionAlert } from '@/components/ui'
import { DRAFT, NUMBERMAP} from '@/constants/common'
import { PageContainer } from '@/styles/modules/hr/inductionTraining'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import {  BUTTONLABELS } from '@/lib/utils/common'
import { TableContainer } from '@/styles/components/ui/datatable'
import { ErrorText } from '@/styles/common'
import { useAllVendorTypes ,useAllVendors} from '@/hooks/modules/vendor-management/useCommonDropdown'
import { useUpsertVendorAgreementChecklist, useVendorAgreementChecklistById, useVendorAgreementChecklistList } from '@/hooks/modules/vendor-management/useVendorAgreementChecklist'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { radioOptions } from '@/constants/modules/dnd/designInputAdequacyChecklist'
import { ChecklistDetail, SaveType, DraftPayload, FinalPayload, VendorAgreementChecklistRequest } from '@/types/modules/vendor-management/vendorAgreementChecklist'
import { VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS, VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS, VENDOR_AGREEMENT_CHECKLIST_LIST_PATH, VENDOR_AGREEMENT_CHECKLIST_TITLE, INITIAL_ERRORS, vendorAgreementChecklistErrorItems, FIELD_NAMES, ERROR_MESSAGES, STATUS_DROPDOWN_CONFIG } from '@/constants/modules/vendor-management/vendorAgreementChecklist'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { validateFormFields } from '@/lib/utils/validateFormAndMapErrors'

/**
    Classification : Confidential
**/


const VendorAgreementCheckListForm: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const agreementChecklistId = params.id as string
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null)
  const [selectedVendorTypeId, setSelectedVendorTypeId] = useState<number | null>(null)
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [checklistStatuses, setChecklistStatuses] = useState<Record<number, number>>({})
  const isCreate = agreementChecklistId == 'create'
  const { data: vendorTypes } = useAllVendorTypes()
  const { data: vendors ,refetch: refetchVendors} = useAllVendors(NUMBERMAP.ONE, selectedVendorTypeId ?? NUMBERMAP.ZERO)
  const { data: vendorAgreementChecklists, isLoading: isChecklistLoading } = useVendorAgreementChecklistList(1, true)
  const { data: existingChecklist } = useVendorAgreementChecklistById(isCreate?'' : agreementChecklistId, !isCreate)
  const {mutate:upsertMutation , isPending: isUpsertPending} = useUpsertVendorAgreementChecklist()
  const { data: statusData } = useOrganizationStatus()

  // Normalize existing checklist response shape (array vs object)
  const existingChecklistData = useMemo(() => {
    const data = existingChecklist?.data
    if (!data) return null
    return Array.isArray(data) ? data[NUMBERMAP.ZERO] : data
  }, [existingChecklist])
  
  // Draft save configuration
  const contextInstanceId = isCreate ? null : agreementChecklistId
  
  // Initialize refs - refs are stable across renders and don't cause re-renders
  const isInitialDataLoad = useRef(true)
  const [draftLoaded, setDraftLoaded] = useState(false)
  
  // Memoize callback to prevent race conditions and ensure proper dependency tracking
  const handleDraftFetchSuccess = useCallback((data: any) => {
    // Only process if we haven't already loaded this draft
    if (draftLoaded) {
      return
    }
    
    const draftData = data?.data
    
    // Load draft data into form if available (only on initial load)
    if (draftData && isInitialDataLoad.current) {
      setDraftLoaded(true) // Mark as loaded using state
      
      if (draftData.vendor_id) {
        setSelectedVendorId(draftData.vendor_id)
      }
      if (draftData.vendor_type_id) {
        setSelectedVendorTypeId(draftData.vendor_type_id)
      }
      // Handle both 'status' and 'status_id' fields for backward compatibility
      const draftStatusValue = draftData.status
      if (draftStatusValue !== null && draftStatusValue !== undefined) {
        setSelectedStatusId(Number(draftStatusValue))
      }
      if (draftData.checklist_details && Array.isArray(draftData.checklist_details)) {
        const draftStatuses: Record<number, number> = {}
        draftData.checklist_details.forEach((detail: ChecklistDetail) => {
          draftStatuses[detail.checklist_id] = detail.checklist_status
        })
        setChecklistStatuses(draftStatuses)
      }
      isInitialDataLoad.current = false
    }
  }, [draftLoaded])
  
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave, fetchDraft, draftData } = useDraftSave({
    context_type: 'vendor_agreement_checklist_id',
    context_instance_id: contextInstanceId,
    enableFetch: false,
    onFetchSuccess: handleDraftFetchSuccess
  })

  useEffect(() => {
    setDraftLoaded(false)
    isInitialDataLoad.current = true
  }, [agreementChecklistId])

  // Fetch draft on mount and when checklist changes
  useEffect(() => {
    if(isCreate) 
    fetchDraft()
  }, [fetchDraft, agreementChecklistId])

 useEffect(() => {
  refetchVendors()
}, [selectedVendorTypeId, refetchVendors])

  /**
   * Validate that all checklist items have a status selected
   * Similar to checkAllCriteriaValid in sanity check inspection
   */
  const checkAllChecklistStatusValid = (checklistData, statuses: Record<number, number>): boolean => {
    if (!checklistData || checklistData.length === NUMBERMAP.ZERO) {
      return true
    }
    
    // Check if all checklist items have a status selected (not null/undefined)
    return checklistData.every((item) => {
      const status = statuses[item.id]
      return status != null && status !== undefined
    })
  }

  /**
   * Build payload for draft or final save
   * 
   * Draft payload includes:
   * - vendor_agreement_checklist_id (empty string for new, ID for existing)
   * - vendor_id
   * - vendor_type_id (only in draft)
   * - status (only in draft, default: 1)
   * - checklist_details
   * 
   * Final payload includes:
   * - vendor_id
   * - vendor_agreement_checklist_id (empty string for new, ID for existing)
   * - checklist_details
   * 
   */
  const buildPayload = (
    isDraft: boolean = false,
    customData?: { vendorId?: number | null, vendorTypeId?: number | null, checklistStatuses?: Record<number, number>, statusId?: number | null }
  ): DraftPayload | FinalPayload => {
    const vendorId = customData?.vendorId ?? selectedVendorId
    const statuses = customData?.checklistStatuses ?? checklistStatuses
    const statusId = customData?.statusId ?? selectedStatusId
    
    const checklist_details: ChecklistDetail[] = vendorAgreementChecklists?.data?.map((item: any) => {
      // Find existing checklist detail if updating
      const existingDetail = existingChecklistData?.checklist_details?.find(
        (detail: ChecklistDetail) => detail.checklist_id === item.id
      )

      return {
        vendor_agreement_checklist_status_id: existingDetail?.vendor_agreement_checklist_status_id ?? "",
        checklist_id: item.id,
        checklist_status: statuses[item.id] ?? null
      }
    }) ?? []

    // Add draft-specific fields only for draft saves
    if (isDraft) {
      return {
        vendor_agreement_checklist_id: isCreate ? "" : agreementChecklistId,
        vendor_id: customData?.vendorId ?? null,
        vendor_type_id: customData?.vendorTypeId ?? null,
        status:statusId, 
        checklist_details
      }
    }

    // Return final save payload (without vendor_agreement_checklist_id, vendor_type_id and status)
    const finalPayload: FinalPayload = {
      vendor_id: vendorId ?? null,
      vendor_agreement_checklist_id: isCreate ? "" : agreementChecklistId,
      checklist_details
    }
    if (statusId !== null && statusId !== undefined) {
      // Backend expects: 1 = Active, 2 = Inactive (some dropdowns still return 0 for Inactive)
      const statusToSend: number = statusId === NUMBERMAP.ONE ? NUMBERMAP.ONE : NUMBERMAP.TWO;
      (finalPayload).status = statusToSend
    }
    return finalPayload
  }

  function handleSave(type: SaveType, customData?: { vendorId?: number | null, vendorTypeId?: number | null, checklistStatuses?: Record<number, number>, statusId?: number | null }) {
    if (type === 'draft') {
      const draftPayload = buildPayload(true, customData) as DraftPayload
      draftSave({
        project_id: contextInstanceId,
        form_type: 'vendor_agreement_checklist_id',
        form_data: draftPayload,
        timestamp: new Date().toISOString(),
      })
      return
    }
    clearDraftSave()
    // Final save

    const formData = {
      vendorId: selectedVendorId ?? '',
      vendorTypeId: selectedVendorTypeId ?? '',
      status_id: selectedStatusId ?? '',
    }
    const validationResult = validateFormFields(formData, vendorAgreementChecklistErrorItems, INITIAL_ERRORS)
    const newErrors = { ...validationResult.errors }
    
    // Validate checklist statuses: all rows must have a status selected
    if (!checkAllChecklistStatusValid(vendorAgreementChecklists?.data ?? [], checklistStatuses)) {
      newErrors.checklistStatus = ERROR_MESSAGES.CHECKLIST_STATUS_REQUIRED
    }
    
    setErrors(newErrors)
    
    if (!validationResult.isValid || newErrors.checklistStatus) {
      return
    }
    
    const payload = buildPayload(false) as FinalPayload
    // Ensure vendor_id is not null (already validated above)
    const mutationPayload: VendorAgreementChecklistRequest = {
      ...payload,
      vendor_id: payload.vendor_id as number, 
    }
      
    upsertMutation(mutationPayload, {
      onSuccess: (data) => {
        // Clear draft only after successful save to prevent data loss on failure
        showActionAlert('success');
        // Navigate back to list page or handle success
        router.push(VENDOR_AGREEMENT_CHECKLIST_LIST_PATH)
      },
      onError: (error) => {
        showActionAlert('failed');
      }
    })
  }

  // Handle status change for individual checklist items
  const handleStatusChange = useCallback((checklistId: number, status: number) => {
    setChecklistStatuses(prev => {
      const updated = {
        ...prev,
        [checklistId]: status
      }
      
      // Clear checklist status error if all items now have status
      if (errors.checklistStatus && checkAllChecklistStatusValid(vendorAgreementChecklists?.data ?? [], updated)) {
        setErrors(prevErrors => {
          const updatedErrors = { ...prevErrors }
          delete updatedErrors.checklistStatus
          return updatedErrors
        })
      }
      
      // Trigger draft save on change only after initial load
      if (!isInitialDataLoad.current) {
        handleSave('draft', { 
          vendorId: selectedVendorId, 
          vendorTypeId: selectedVendorTypeId, 
          checklistStatuses: updated,
          statusId: selectedStatusId
        })
      }
      return updated
    })
  }, [selectedVendorId, selectedVendorTypeId, checklistStatuses, errors.checklistStatus, vendorAgreementChecklists?.data])

  // Memoized render cell function to prevent excessive re-renders
  const renderStatusCell = useCallback((params: any) => {
    const currentValue = checklistStatuses[params.row.id] ?? null
    return (
      <RadioButtonGroup 
        label=""
        name={`status_${params.row.id}`}
        options={radioOptions}
        value={currentValue}
        onChange={(value: string | number) => handleStatusChange(params.row.id, Number(value))}
      />
    )
  }, [checklistStatuses, handleStatusChange])

  const columns = useMemo(() => [
    {
      field: VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS.SNO.FIELD,
      headerName: VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS.SNO.HEADER,
      flex: VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS.SNO.FLEX,
    },
    {
      field: VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS.CHECKLIST_ITEM.FIELD,
      headerName: VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS.CHECKLIST_ITEM.HEADER,
      flex: VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS.CHECKLIST_ITEM.FLEX,
    },
    {
      field: VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS.STATUS.FIELD,
      headerName: VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS.STATUS.HEADER,
      flex: VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS.STATUS.FLEX,
      renderCell: renderStatusCell
    },
  ], [renderStatusCell])

  // Handle vendor selection
  type VendorChangeType = 'vendorId' | 'vendorTypeId';

  const handleVendorChange = (value: string, type: VendorChangeType) => {
    const parsedValue = value === '' ? null : Number(value)

    if (type === FIELD_NAMES.VENDOR_TYPE_ID) {
      setSelectedVendorTypeId(parsedValue)
      setSelectedVendorId(null)
    } else {
      setSelectedVendorId(parsedValue)
    }

    setErrors(prev => ({ ...prev, [type]: '' }))

    if (!isInitialDataLoad.current) {
      const nextVendorId = type === FIELD_NAMES.VENDOR_ID ? parsedValue : null
      const nextVendorTypeId = type === FIELD_NAMES.VENDOR_TYPE_ID ? parsedValue : selectedVendorTypeId
      handleSave(DRAFT, {
        vendorId: nextVendorId,
        vendorTypeId: nextVendorTypeId,
        checklistStatuses,
        statusId: selectedStatusId
      })
    }
  };

  const handleFormStatusChange = (value: string) => {
    const parsedValue = value === '' ? null : Number(value)
    setSelectedStatusId(parsedValue)
    setErrors(prev => ({ ...prev, [FIELD_NAMES.STATUS]: '' }))

    if (!isInitialDataLoad.current) {
      handleSave(DRAFT, {
        vendorId: selectedVendorId,
        vendorTypeId: selectedVendorTypeId,
        checklistStatuses,
        statusId: parsedValue
      })
    }
  }

  const customCancelledMessage = () => {
    router.push(VENDOR_AGREEMENT_CHECKLIST_LIST_PATH)
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave();
    customCancelledMessage()
  }

  // Initialize checklist statuses when data loads
  useEffect(() => {
   
    if (vendorAgreementChecklists?.data) {
      if (existingChecklistData) {
        // For editing: always use existing data (vendor_id and vendor_type_id already in data)
        setSelectedVendorId(existingChecklistData.vendor_id)
        setSelectedVendorTypeId(existingChecklistData.vendor_type_id)
        // API returns 'status' field, but also check 'status_id' for backward compatibility
        const statusValue = (existingChecklistData).status
        if (statusValue !== null && statusValue !== undefined) {
          setSelectedStatusId(Number(statusValue))
        }
        const initialStatuses: Record<number, number> = {}
        existingChecklistData?.checklist_details?.forEach((detail: ChecklistDetail) => {
          initialStatuses[detail.checklist_id] = detail.checklist_status
        })
        setChecklistStatuses(initialStatuses)
      }
      if (isInitialDataLoad.current) {
        isInitialDataLoad.current = false
      }
    }
  }, [vendorAgreementChecklists?.data, existingChecklistData])

  // Load draft data (for create mode) when available
  useEffect(() => {
    if (draftData?.data && isCreate) {
      const draft = draftData.data
      if (draft.vendor_id) {
        setSelectedVendorId(draft.vendor_id)
      }
      if (draft.vendor_type_id) {
        setSelectedVendorTypeId(draft.vendor_type_id)
      }
      // Handle both 'status' and 'status_id' fields for backward compatibility
      const draftStatusValue = draft.status
      if (draftStatusValue !== null && draftStatusValue !== undefined) {
        setSelectedStatusId(Number(draftStatusValue))
      }
      if (Array.isArray(draft.checklist_details)) {
        const draftStatuses: Record<number, number> = {}
        draft.checklist_details.forEach((detail: ChecklistDetail) => {
          draftStatuses[detail.checklist_id] = detail.checklist_status
        })
        setChecklistStatuses(draftStatuses)
      }
      isInitialDataLoad.current = false
    }
  }, [draftData, isCreate])

  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <Box>

        <CommonSharedTale
          title={VENDOR_AGREEMENT_CHECKLIST_TITLE}
          Table={
            <TableContainer>
              <Grid2 container spacing={2} sx={{ paddingBottom: NUMBERMAP.TWO }}>
                <Grid2 size={NUMBERMAP.SIX}>
                  <InputField
                    label={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.VENDOR_TYPE.LABEL}
                    placeholder={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.VENDOR_TYPE.PLACEHOLDER}
                    value={selectedVendorTypeId ? String(selectedVendorTypeId) : ''}
                    onChange={(value: string) => {
                      handleVendorChange(value, FIELD_NAMES.VENDOR_TYPE_ID)
                    }}
                    options={vendorTypes?.data ?? []}
                    isDropdown={true}
                    error={errors.vendorTypeId}
                    keyField={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.VENDOR_TYPE.keyField}
                    valueField={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.VENDOR_TYPE.valueField}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.SIX}>
                  <InputField
                    label={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.VENDOR_NAME.LABEL}
                    placeholder={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.VENDOR_NAME.PLACEHOLDER}
                    value={selectedVendorId ? String(selectedVendorId) : ''}
                    onChange={(value: string) => handleVendorChange(value, FIELD_NAMES.VENDOR_ID)}
                    options={selectedVendorTypeId ? vendors?.data ?? [] : []}
                    isDropdown={true}
                    error={errors.vendorId}
                    keyField={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.VENDOR_NAME.keyField}
                    valueField={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.VENDOR_NAME.valueField}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.SIX}>
                  <InputField
                    label={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.STATUS.LABEL}
                    placeholder={VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS.STATUS.PLACEHOLDER}
                    value={selectedStatusId ? String(selectedStatusId) : ''}
                    onChange={handleFormStatusChange}
                    options={statusData?.data ?? []}
                    isDropdown={true}
                    error={errors.status_id}
                    keyField={STATUS_DROPDOWN_CONFIG.KEY_FIELD}
                    valueField={STATUS_DROPDOWN_CONFIG.VALUE_FIELD}
                  />
                </Grid2>
              </Grid2>
              <DataGridTable
                rows={vendorAgreementChecklists?.data ?? []}
                columns={columns}
                idField={'id'}
                checkboxSelection={false}
                hideFooter={true}
                loading={isChecklistLoading}
              />
              {errors.checklistStatus && (
                <ErrorText>
                  {errors.checklistStatus ?? ''}
                </ErrorText>
              )}
              <ButtonGroup
                buttons={[
                  {
                    label: BUTTONLABELS.BUTTON_LABEL_CANCEL,
                    onClick: handleCancel,
                  },
                  {
                    label: BUTTONLABELS.BUTTON_LABEL_SAVE,
                    disabled: isUpsertPending,
                    onClick: () => handleSave('final'),
                  },
                ]}
              />
            </TableContainer>
          }
        />
      </Box>
    </PageContainer>
  )
}

export default VendorAgreementCheckListForm;
