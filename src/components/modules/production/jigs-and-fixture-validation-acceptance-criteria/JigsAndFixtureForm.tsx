'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Grid2 } from '@mui/material'
import { ActionButton, DataGridTable, InputField, RichTextEditor, showActionAlert } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import { ErrorText } from '@/styles/common'
import { useUpsertJigFixtureValidation, useGetJigFixtureValidationById } from '@/hooks/modules/production/useJigsAndFixtureValidation'
import { useJigsType } from '@/hooks/modules/production/useCommonDropdown'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import {
  ERROR_MESSAGES,
  MODAL_TITLES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FIELD_NAMES,
  DATA_GRID_FIELDS,
  DATA_GRID_HEADERS,
  DATA_GRID_CONFIG,
} from '@/constants/modules/production/jigsAndFixtureValidation'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import {
  AcceptanceCriteriaItem,
  MainFormData,
  AcceptanceCriteriaFormData,
  MainFormErrors,
  AcceptanceCriteriaFormErrors,
  JigsAndFixtureFormProps,
  JigFixtureValidationUpsertRequest,
  AcceptanceCriteriaDetail, 
  StatusApiResponse,
} from '@/types/modules/production/jigsAndFixtureValidation'
import {stripHtml } from '@/lib/utils/common'
/**
 * Classification: Confidential
 */

const JigsAndFixtureForm: React.FC<JigsAndFixtureFormProps> = ({
  open,
  onClose,
  onSave,
  projectId,
  editId,
}) => {
  const [isAcceptanceCriteriaModalOpen, setIsAcceptanceCriteriaModalOpen] = useState(false)
  const [acceptanceCriteriaList, setAcceptanceCriteriaList] = useState<AcceptanceCriteriaItem[]>([])
  const [editingCriteriaId, setEditingCriteriaId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<MainFormData>({
    jigsType: '',
    status: '',
  })

  const [acceptanceCriteriaFormData, setAcceptanceCriteriaFormData] = useState<AcceptanceCriteriaFormData>({
    acceptanceCriteria: '',
    expectedResult: '',
    status: '',
  })

  const [errors, setErrors] = useState<MainFormErrors>({})
  const [acceptanceCriteriaErrors, setAcceptanceCriteriaErrors] = useState<AcceptanceCriteriaFormErrors>({})
    const draftFetchedRef = useRef(false)

  const { data: jigsTypeData } = useJigsType()
  const { data: statusData } = useOrganizationStatus()
  const { mutate: upsertJigFixtureValidation } = useUpsertJigFixtureValidation()
  const { data: editData, isLoading: isLoadingEditData } = useGetJigFixtureValidationById(editId)

  // Draft save hook
  const jigFixtureValidationIdForDraft = editId
  const { 
    draftSave, 
    clearDraftSave, 
    isDraftSaving, 
    draftData, 
    fetchDraft, 
    checkUnsavedDraftBeforeLeave 
  } = useDraftSave({
    context_type: "jigs_and_fixture_validation_acceptance_criteria",
    context_instance_id: jigFixtureValidationIdForDraft,
    enableFetch: false
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      // Reset main form data
      setFormData({
        jigsType: '',
        status: '',
      })
      // Reset acceptance criteria list
      setAcceptanceCriteriaList([])
      // Reset all errors
      setErrors({})
      setAcceptanceCriteriaErrors({})
      // Reset acceptance criteria modal state
      setIsAcceptanceCriteriaModalOpen(false)
      setEditingCriteriaId(null)
      setAcceptanceCriteriaFormData({
        acceptanceCriteria: '',
        expectedResult: '',
        status: '',
      })
      draftFetchedRef.current = false
    }
  }, [open])

  // Load draft data
  const loadDraftData = useCallback((data: any) => {
    const resolvedData = Array.isArray(data?.data)
      ? data.data[NUMBERMAP.ZERO]
      : data?.data ?? data ?? {}
    
    setFormData({
      jigsType: String(resolvedData.jig_type_id ?? resolvedData.jigsType ?? ''),
      status: String(resolvedData.status_id ?? resolvedData.status ?? ''),
    })
    
    if (resolvedData.acceptance_criteria_detail && Array.isArray(resolvedData.acceptance_criteria_detail)) {
      setAcceptanceCriteriaList(resolvedData.acceptance_criteria_detail)
    } else {
      setAcceptanceCriteriaList([])
    }
  }, [])

  useEffect(() => {
    if (open && draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData, loadDraftData, open])

  // Helper function to extract item from editData
  const extractEditItem = (data: any): any => {
    if (Array.isArray(data) && data.length > NUMBERMAP.ZERO) {
      return data[NUMBERMAP.ZERO]
    }
    if (data && typeof data === 'object') {
      return data
    }
    return null
  }

  // Helper function to load edit data into form
  const loadEditDataIntoForm = useCallback((item: any) => {
    setFormData({
      jigsType: String(item.jig_type_id ?? ''),
      status: String(item.status_id ?? item.status ?? ''),
    })
    
    const criteriaDetail = item.acceptance_criteria_detail
    if (Array.isArray(criteriaDetail) && criteriaDetail.length > NUMBERMAP.ZERO) {
      setAcceptanceCriteriaList(criteriaDetail)
    } else {
      setAcceptanceCriteriaList([])
    }
    
    draftFetchedRef.current = true
  }, [])

  // Helper function to reset form to empty state
  const resetFormToEmpty = useCallback(() => {
    setFormData({
      jigsType: '',
      status: '',
    })
    setAcceptanceCriteriaList([])
    setErrors({})
    setAcceptanceCriteriaErrors({})
  }, [])

  // Helper function to handle new form (no editId)
  const handleNewForm = useCallback(() => {
    if (!draftFetchedRef.current) {
      fetchDraft()
      draftFetchedRef.current = true
    }
    if (!draftData?.data) {
      resetFormToEmpty()
    }
  }, [fetchDraft, draftData, resetFormToEmpty])

  // Helper function to handle edit mode with data
  const handleEditModeWithData = useCallback(() => {
    if (!editData?.data) return
    
    const item = extractEditItem(editData.data)
    if (item) {
      loadEditDataIntoForm(item)
    }
  }, [editData, loadEditDataIntoForm])

  // Helper function to handle edit mode without data
  const handleEditModeWithoutData = useCallback(() => {
    setFormData({
      jigsType: '',
      status: '',
    })
    setAcceptanceCriteriaList([])
  }, [])

  // Load edit data when editId is provided
  useEffect(() => {
    if (!open) return

    if (editId && editData?.data) {
      handleEditModeWithData()
    } else if (!editId) {
      handleNewForm()
    } else if (editId && !isLoadingEditData && !editData?.data) {
      handleEditModeWithoutData()
    }
  }, [open, editId, editData, isLoadingEditData, handleEditModeWithData, handleNewForm, handleEditModeWithoutData])

  const validateMainForm = (): boolean => {
    const newErrors: MainFormErrors = {}

    if (!formData.jigsType) {
      newErrors.jigsType = ERROR_MESSAGES.JIGS_TYPE_REQUIRED
    }

    if (!formData.status) {
      newErrors.status = ERROR_MESSAGES.STATUS_REQUIRED
    }

    // Check if there's at least one active acceptance criteria
    const activeCriteriaCount = acceptanceCriteriaList.filter(
      item => Number(item.status_id) === NUMBERMAP.ONE
    ).length

    if (activeCriteriaCount === NUMBERMAP.ZERO) {
      newErrors.acceptanceCriteriaList = ERROR_MESSAGES.ACCEPTANCE_CRITERIA_LIST_REQUIRED
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const validateAcceptanceCriteriaForm = (): boolean => {
    const newErrors: AcceptanceCriteriaFormErrors = {}

    if (!acceptanceCriteriaFormData.acceptanceCriteria || acceptanceCriteriaFormData.acceptanceCriteria.trim() === '') {
      newErrors.acceptanceCriteria = ERROR_MESSAGES.ACCEPTANCE_CRITERIA_REQUIRED
    }

    if (!acceptanceCriteriaFormData.expectedResult || acceptanceCriteriaFormData.expectedResult.trim() === '') {
      newErrors.expectedResult = ERROR_MESSAGES.EXPECTED_RESULT_REQUIRED
    }

    if (!acceptanceCriteriaFormData.status) {
      newErrors.status = ERROR_MESSAGES.STATUS_REQUIRED
    }

    setAcceptanceCriteriaErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  // Draft save handler
  const handleDraftSave = useCallback((formDataToSave?: MainFormData, acceptanceCriteriaToSave?: AcceptanceCriteriaItem[]) => {
    const dataToSave = formDataToSave ?? formData
    
    const payload = {
      id: jigFixtureValidationIdForDraft ?? new Date().getTime(),
      jig_type_id: dataToSave.jigsType && dataToSave.jigsType !== '' ? Number(dataToSave.jigsType) : null,
      status: dataToSave.status && dataToSave.status !== '' ? Number(dataToSave.status) : null,
      acceptance_criteria_detail: acceptanceCriteriaToSave ?? acceptanceCriteriaList,
      type: 'draft',
    }

    draftSave({
      form_data: payload
    })
  }, [draftSave, jigFixtureValidationIdForDraft, formData, acceptanceCriteriaList])

  const handleFieldChange = (field: keyof MainFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      handleDraftSave(updated)
      return updated
    })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleAcceptanceCriteriaFieldChange = (field: keyof AcceptanceCriteriaFormData, value: string) => {
    setAcceptanceCriteriaFormData(prev => ({ ...prev, [field]: value }))
    if (acceptanceCriteriaErrors[field]) {
      setAcceptanceCriteriaErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleOpenAcceptanceCriteriaModal = (editId?: string | number) => {
    if (editId) {
      const editIdStr = String(editId)
      const item = acceptanceCriteriaList.find(criteria => 
        String(criteria.acceptance_criteria_id) === editIdStr || criteria.id === editIdStr
      )
      if (item) {
        // Use acceptance_criteria_id if available, otherwise use id
        setEditingCriteriaId(item.acceptance_criteria_id?.toString() ?? item.id)
        setAcceptanceCriteriaFormData({
          acceptanceCriteria: item.acceptance_criteria,
          expectedResult: item.expected_result,
          status: item.status_id ?? item.status ?? '',
        })
      }
    } else {
      setEditingCriteriaId(null)
      setAcceptanceCriteriaFormData({
        acceptanceCriteria: '',
        expectedResult: '',
        status: '',
      })
    }
    setAcceptanceCriteriaErrors({})
    setIsAcceptanceCriteriaModalOpen(true)
  }

  const handleCloseAcceptanceCriteriaModal = () => {
    setIsAcceptanceCriteriaModalOpen(false)
    setEditingCriteriaId(null)
    setAcceptanceCriteriaFormData({
      acceptanceCriteria: '',
      expectedResult: '',
      status: '',
    })
    setAcceptanceCriteriaErrors({})
  }

  const getStatusName = (statusId: string | number): string => {
    const statusItem = statusData?.data?.find((item: StatusApiResponse) => item.status_id === statusId)
    return statusItem?.status_name ?? String(statusId)
  }

  const updateAcceptanceCriteriaItem = (
    item: AcceptanceCriteriaItem,
    criteriaId: string,
    formData: AcceptanceCriteriaFormData,
    statusName: string
  ): AcceptanceCriteriaItem => {
    // Match by acceptance_criteria_id (for existing items) or id (for temporary items)
    const itemCriteriaId = item.acceptance_criteria_id?.toString() ?? item.id
    if (itemCriteriaId !== criteriaId) {
      return item
    }
    return {
      ...item,
      acceptance_criteria: formData.acceptanceCriteria,
      expected_result: formData.expectedResult,
      status: statusName,
      status_id: formData.status,
    }
  }

  const handleSaveAcceptanceCriteria = () => {
    if (!validateAcceptanceCriteriaForm()) {
      return
    }

    const statusName = getStatusName(acceptanceCriteriaFormData.status)

    if (editingCriteriaId) {
      // Update existing item
      setAcceptanceCriteriaList(prev => {
        const updated = prev.map(item => updateAcceptanceCriteriaItem(item, editingCriteriaId, acceptanceCriteriaFormData, statusName))
        handleDraftSave(undefined, updated)
        return updated
      })
    } else {
      // Add new item
      const newItem: AcceptanceCriteriaItem = {
        id: `criteria-${Date.now()}`,
        acceptance_criteria_id: `criteria-${Date.now()}`,
        acceptance_criteria: acceptanceCriteriaFormData.acceptanceCriteria,
        expected_result: acceptanceCriteriaFormData.expectedResult,
        status: statusName,
        status_id: acceptanceCriteriaFormData.status,
      }
      setAcceptanceCriteriaList(prev => {
        const updated = [...prev, newItem]
        handleDraftSave(undefined, updated)
        return updated
      })
    }

    handleCloseAcceptanceCriteriaModal()
    // Clear acceptance criteria list error if it exists
    if (errors.acceptanceCriteriaList) {
      setErrors(prev => ({ ...prev, acceptanceCriteriaList: undefined }))
    }
  }

  const markItemAsInactive = (item: AcceptanceCriteriaItem, targetId: string): AcceptanceCriteriaItem => {
    // Match by id or acceptance_criteria_id
    const itemId = item.id
    const itemCriteriaId = item.acceptance_criteria_id?.toString()
    if (itemId !== targetId && itemCriteriaId !== targetId) {
      return item
    }
    const statusName = getStatusName(NUMBERMAP.TWO) ?? 'Inactive'
    return {
      ...item,
      status_id: String(NUMBERMAP.TWO),
      status: statusName,
    }
  }

  const markItemInListAsInactive = (list: AcceptanceCriteriaItem[], targetId: string): AcceptanceCriteriaItem[] => {
    return list.map(item => markItemAsInactive(item, targetId))
  }

  const handleDeleteAcceptanceCriteria = (id: string | number) => {
    showActionAlert(STATUS.DELETE).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      setAcceptanceCriteriaList(prev => {
        const updated = markItemInListAsInactive(prev, String(id))
        handleDraftSave(undefined, updated)
        return updated
      })
      
      // Clear acceptance criteria list error if it exists
      if (errors.acceptanceCriteriaList) {
        setErrors(prev => ({ ...prev, acceptanceCriteriaList: undefined }))
      }
    })
  }

  const resetForm = () => {
    setFormData({
      jigsType: '',
      status: '',
    })
    setAcceptanceCriteriaList([])
    setErrors({})
    setAcceptanceCriteriaErrors({})
    setIsAcceptanceCriteriaModalOpen(false)
    setEditingCriteriaId(null)
    setAcceptanceCriteriaFormData({
      acceptanceCriteria: '',
      expectedResult: '',
      status: '',
    })
  }

  const handleMainFormSave = () => {
    if (validateMainForm()) {
      clearDraftSave()
      
      // Map form data to API payload
      const payload: JigFixtureValidationUpsertRequest = {
        project_id: projectId,
        jig_type_id: Number(formData.jigsType),
        status: Number(formData.status),
        acceptance_criteria_detail: acceptanceCriteriaList.map((item) => {
          const criteriaDetail: AcceptanceCriteriaDetail = {
            acceptance_criteria: item.acceptance_criteria,
            expected_result: item.expected_result,
            status: Number(item.status_id),
          }
          
          // Include acceptance_criteria_id if it's a valid numeric ID (not a temporary string ID)
          // Check if acceptance_criteria_id exists and is not a temporary ID
          if (item.acceptance_criteria_id !== undefined && item.acceptance_criteria_id !== null && item.acceptance_criteria_id !== '') {
            const criteriaIdValue = item.acceptance_criteria_id
            const criteriaIdStr = String(criteriaIdValue)
            
            // Temporary IDs start with 'criteria-', real IDs are numbers
            // If it's a string that starts with 'criteria-', it's a temporary ID (new item)
            if (typeof criteriaIdValue === 'string' && criteriaIdStr.startsWith('criteria-')) {
              // This is a new item, don't include acceptance_criteria_id
            } else {
              // Try to convert to number - if it's already a number or a numeric string
              const criteriaIdNum = typeof criteriaIdValue === 'number' ? criteriaIdValue : Number(criteriaIdValue)
              // Only include if it's a valid positive number
              if (!isNaN(criteriaIdNum) && criteriaIdNum > 0) {
                criteriaDetail.acceptance_criteria_id = criteriaIdNum
              }
            }
          }
          
          return criteriaDetail
        }),
      }
      // Include jig_fixture_validation_id if editing
      if (editId) {
        payload.jig_fixture_validation_id = editId
      }

      upsertJigFixtureValidation(payload, {
        onSuccess: () => {
          onSave()
          // Reset form after successful save
          resetForm()
        },
      })
    }
  }

  const handleMainFormClose = async () => {
    await checkUnsavedDraftBeforeLeave()
    resetForm()
    onClose()
  }

  // Column definitions for the table matching the design
  const columns = [
    {
      field: DATA_GRID_FIELDS.SNO,
      headerName: DATA_GRID_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: DATA_GRID_FIELDS.ACCEPTANCE_CRITERIA,
      headerName: DATA_GRID_HEADERS.ACCEPTANCE_CRITERIA,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        if (!params.value) return '-'
        return stripHtml(params.value)
      }
    },
    {
      field: DATA_GRID_FIELDS.EXPECTED_RESULT,
      headerName: DATA_GRID_HEADERS.EXPECTED_RESULT,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        if (!params.value) return '-'
        return stripHtml(params.value)
      }
    },
    {
      field: DATA_GRID_FIELDS.STATUS,
      headerName: DATA_GRID_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        const statusId = Number(params.row.status_id) || NUMBERMAP.ZERO
        return <StatusTypography value={statusId} />
      }
    },
    {
      field: DATA_GRID_FIELDS.ACTION,
      headerName: DATA_GRID_HEADERS.ACTION,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        const statusId = Number(params.row.status_id) || NUMBERMAP.ZERO
        const criteriaId = params.row.acceptance_criteria_id ?? params.row.id
        return (
          <ActionButton
            onEdit={() => handleOpenAcceptanceCriteriaModal(criteriaId)}
            onDelete={() => handleDeleteAcceptanceCriteria(params.row.id ?? String(criteriaId))}
            deleteDisabled={statusId !== NUMBERMAP.ONE}
          />
        )
      },
    }
  ]

  return (
    <>
      {isDraftSaving && <DraftLoading />}
      <CommonModal
        open={open}
        title={editId ? MODAL_TITLES.EDIT_MAIN : MODAL_TITLES.ADD_MAIN}
        buttonRequired={true}
        onClose={handleMainFormClose}
        onSave={handleMainFormSave}
        modalMaxWidth="900px"
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={POPUP_STYLE}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={FORM_LABELS.JIGS_TYPE}
              placeholder={FORM_PLACEHOLDERS.SELECT_JIGS_TYPE}
              value={formData.jigsType}
              onChange={(value: string) => handleFieldChange('jigsType', value)}
              isDropdown
              options={jigsTypeData?.data ?? []}
              keyField={FIELD_NAMES.JIGS_TYPE_ID}
              valueField={FIELD_NAMES.JIGS_TYPE_NAME}
              error={errors.jigsType}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <DataGridTable 
                hideFooter={true}
                showAddButton={true}
                title={DATA_GRID_CONFIG.TITLE}
                onAddRow={() => {handleOpenAcceptanceCriteriaModal()}}
                columns={columns}
                rows={acceptanceCriteriaList}
                idField="acceptance_criteria_id"
                loading={false}
            />
            {errors.acceptanceCriteriaList && (
              <ErrorText> {errors.acceptanceCriteriaList} </ErrorText>
            )}
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField 
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                value={formData.status}
                onChange={(value: string) => handleFieldChange('status', value)}
                isDropdown
                options={statusData?.data ?? []}
                keyField={FIELD_NAMES.STATUS_ID}
                valueField={FIELD_NAMES.STATUS_NAME}
                error={errors.status}
            />
          </Grid2>

        </Grid2>
        <CommonModal
          open={isAcceptanceCriteriaModalOpen}
          title={editingCriteriaId ? MODAL_TITLES.EDIT_ACCEPTANCE_CRITERIA : MODAL_TITLES.ADD_ACCEPTANCE_CRITERIA}
          buttonRequired={true}
          onClose={() => {handleCloseAcceptanceCriteriaModal()}}
          onSave={() => {handleSaveAcceptanceCriteria()}}
          modalMaxWidth="900px"
        >
          <Grid2 container spacing={NUMBERMAP.ONE} sx={{...POPUP_STYLE}}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <RichTextEditor
                label={FORM_LABELS.ACCEPTANCE_CRITERIA}
                placeholder={FORM_PLACEHOLDERS.ENTER_ACCEPTANCE_CRITERIA}
                value={acceptanceCriteriaFormData.acceptanceCriteria}
                onChange={(value: string) => handleAcceptanceCriteriaFieldChange('acceptanceCriteria', value)}
                error={acceptanceCriteriaErrors.acceptanceCriteria}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <RichTextEditor
                label={FORM_LABELS.EXPECTED_RESULT}
                placeholder={FORM_PLACEHOLDERS.ENTER_EXPECTED_RESULT}
                value={acceptanceCriteriaFormData.expectedResult}
                onChange={(value: string) => handleAcceptanceCriteriaFieldChange('expectedResult', value)}
                error={acceptanceCriteriaErrors.expectedResult}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField 
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                value={acceptanceCriteriaFormData.status}
                onChange={(value: string) => handleAcceptanceCriteriaFieldChange('status', value)}
                isDropdown
                options={statusData?.data ?? []}
                keyField={FIELD_NAMES.STATUS_ID}
                valueField={FIELD_NAMES.STATUS_NAME}
                error={acceptanceCriteriaErrors.status}
            />
          </Grid2>
          </Grid2>
        </CommonModal>
      </CommonModal>
    </>
  )
}

export default JigsAndFixtureForm

