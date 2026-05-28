/**
 * Other Hazard Page
 * Classification: Confidential
 */

'use client'
import React, { useEffect, useRef, useState } from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { ActionButton, DataTable, showActionAlert, InputField, ButtonGroup } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import {
  useGetAllOtherHazards,
  useGetOtherHazardById,
  useUpsertOtherHazard,
  useDeleteOtherHazard,
} from '@/hooks/modules/risk-management/useOtherHazards'
import {
  OtherHazardUpsertPayload,
  OtherHazardAPI,
} from '@/types/modules/risk-management/otherHazards'
import { OTHER_HAZARD_CONSTANTS } from '@/constants/modules/risk-management/otherHazards'
import { useParams } from 'next/navigation'
import { Grid2 } from '@mui/material'
import { STYLE5 } from '@/styles/modules/dnd/intendedUseForm'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { RT_DROPDOWN_FIELDS } from '@/constants/modules/risk-management/riskTeam'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'
import { RiskNavigationWrapper } from '@/styles/modules/risk-management/riskLevelDefinition'

/**
 * Other Hazard Page
 * Classification: Confidential
 */

const OtherHazardPage = () => {
  const { id } = useParams()
  const projectId = !isNaN(Number(id)) ? Number(id) : null

  const { data: otherHazardsData, isLoading, refetch: refetchOtherHazards } = useGetAllOtherHazards(projectId)
  const upsertOtherHazardMutation = useUpsertOtherHazard()
  const deleteOtherHazardMutation = useDeleteOtherHazard()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState<OtherHazardAPI | null>(
    null
  )

  // Extract permissions from fetch all response for create mode
  const createModePermissions = otherHazardsData?.meta_info?.action_control?.permissions ?? []
  const [question, setQuestion] = useState<string>('')
  const [questionError, setQuestionError] = useState<string>('')
  const [statusError, setStatusError] = useState<string>('')
  const [status, setStatus] = useState<number | null>(null)
  const { data: statusOptions } = useOrganizationStatus()
  const getStatusValue = (status: number) => status === NUMBERMAP.ONE

  // Hook for fetching data by sub_category_id when editing
  const { data: selectedHazardData, isLoading: isFetchingHazard, isFetching: isFetchingHazardData, refetch: refetchSelectedHazard } = useGetOtherHazardById(
    selectedRowData?.sub_category_id ?? NUMBERMAP.ZERO,
    projectId
  )

  // Extract permissions: use fetch by id permissions for edit mode, create mode permissions for create mode
  const editModePermissions = selectedHazardData?.meta_info?.action_control?.permissions ?? []
  const permissions = isEditMode ? editModePermissions : createModePermissions
  
  // In edit mode, wait for data to be loaded before showing buttons
  const isDataLoading = isEditMode && (isFetchingHazard || isFetchingHazardData)
  const isInitialDataLoad = useRef(true)
  const subCategoryId = selectedRowData?.sub_category_id
  const numericSubCategoryId = subCategoryId ? Number(subCategoryId) : NaN
  const isValidSubCategoryId = subCategoryId && 
                               !isNaN(numericSubCategoryId) && 
                               numericSubCategoryId > 0
  const contextType = isValidSubCategoryId ? 'sub_category' : 'project'
  const { draftSave, isDraftSaving ,draftData,clearDraftSave,fetchDraft:refetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_instance_id: isValidSubCategoryId ? subCategoryId : projectId,
    context_type:contextType,
    enableFetch:false
  })

  useEffect(() => {
    if (isModalOpen) {
      refetchDraft()
    }
  }, [isModalOpen])

  useEffect(() => {
    if (isModalOpen && isEditMode && isValidSubCategoryId) {
      refetchSelectedHazard()
    }
  }, [isModalOpen, isEditMode, isValidSubCategoryId, refetchSelectedHazard])

  /**
   * Function Name: handleEdit
   * Params: rowData
   * Description: Handle edit button click to open modal in edit mode
   * Author: Madhumitha G,
   * Created: 29-09-2025,
   * Classification: Confidential
   */
  const handleEdit = (rowData: OtherHazardAPI) => {
    setSelectedRowData(rowData)
    setIsEditMode(true)
    setQuestion(rowData.sub_category)
    setStatus(rowData.status)
    setQuestionError('')
    setStatusError('')
    setIsModalOpen(true)
  }

  // Update form data when selectedHazardData changes (from the new API)
  useEffect(() => {

    if ((selectedHazardData?.data && isEditMode && selectedRowData )|| draftData?.data) {
      // Update form with data from the sub_category_id API
      if (selectedHazardData?.data || draftData?.data) {
        const apiData = Array.isArray(selectedHazardData?.data)
          ? selectedHazardData?.data?.[NUMBERMAP.ZERO]
          : selectedHazardData?.data
        setQuestion(draftData?.data?.sub_category ?? apiData?.sub_category ?? '')
        setStatus(draftData?.data?.status ?? apiData?.status ?? null)
      }
      else{
        setQuestion('')
        setStatus(null)
      }
    } else{
      setQuestion('')
      setStatus(null)
    }
    // after first edit-mode prefill, allow draft saves
    setTimeout(() => {
      isInitialDataLoad.current = false
    }, NUMBERMAP.THOUSAND)
  }, [isModalOpen, draftData, selectedHazardData])

  /**
   * Function Name: handleAdd
   * Params: None
   * Description: Handle add button click to open modal in create mode
   * Author: Madhumitha G,
   * Created: 29-09-2025,
   * Classification: Confidential
   */
  const handleAdd = () => {
    setSelectedRowData(null)
    setIsEditMode(false)
    setQuestion('')
    setStatus(null)
    setQuestionError('')
    setStatusError('')
    setIsModalOpen(true)
    setTimeout(() => {
      isInitialDataLoad.current = false
    }, NUMBERMAP.THOUSAND)
  }

  /**
   * Function Name: handleModalClose
   * Params: None
   * Description: Handle modal close and reset state
   * Author: Madhumitha G,
   * Created: 29-09-2025,
   * Classification: Confidential
   */
  const handleModalClose = async() => {
    await checkUnsavedDraftBeforeLeave()
    setIsModalOpen(false)
    setIsEditMode(false)
    setSelectedRowData(null)
    setQuestion('')
    setStatus(null)
    setQuestionError('')
    setStatusError('')
    refetchOtherHazards()
    isInitialDataLoad.current = true
  }

  /**
   * Function Name: handleSave
   * Params: formData
   * Description: Handle form save and API call for create/update other hazard
   * Author: Madhumitha G,
   * Created: 29-09-2025,
   * Modified By : Savitri K,
   * Classification: Confidential
   */
  const handleSave = () => {
    // Clear previous errors
    setQuestionError('')
    setStatusError('')
    // Validate form fields
    const isQuestionValid = question.trim() !== ''
    const isStatusValid = status !== null && status !== undefined
    
    if (!isQuestionValid) {
      setQuestionError(OTHER_HAZARD_CONSTANTS.ERROR_MESSAGES.QUESTION_REQUIRED)
    }
    
    if (!isStatusValid) {
      setStatusError(OTHER_HAZARD_CONSTANTS.ERROR_MESSAGES.STATUS_REQUIRED)
    }
    
    // Return early if validation fails
    if (!isQuestionValid || !isStatusValid) {
      return
    }
    clearDraftSave()
    const requestData: OtherHazardUpsertPayload = {
      project_id: projectId,
      question: question,
      status: status, 
      ...(isEditMode &&
        selectedRowData && {
          sub_category_id: selectedRowData.sub_category_id,
        }),
    }

    upsertOtherHazardMutation.mutate(requestData, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
        handleModalClose()
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  /**
   * Function Name: handleDelete
   * Params: rowData
   * Description: Handle delete with confirmation dialog and API call
   * Author: Madhumitha G,
   * Created: 29-09-2025,
   * Classification: Confidential
   */
  const handleDelete = (rowData: OtherHazardAPI) => {
    if (!hasEditPermission) {
      return
    }
    showActionAlert(STATUS.DELETE).then((result) => {
      if (result.isConfirmed) {
        deleteOtherHazardMutation.mutate(rowData.sub_category_id, {
          onSuccess: () => {
            showActionAlert(STATUS.SUCCESS)
          },
          onError: () => {
            showActionAlert(STATUS.FAILED)
          },
        })
      }
    })
  }

  // Define columns for other hazard table
  const columns: GridColDef[] = [
    {
      field: OTHER_HAZARD_CONSTANTS.TABLE_COLUMNS.SNO.field,
      headerName: OTHER_HAZARD_CONSTANTS.TABLE_COLUMNS.SNO.headerName,
      flex: NUMBERMAP.ONE,
    },
    {
      field: OTHER_HAZARD_CONSTANTS.TABLE_COLUMNS.SUB_CATEGORY.field,
      headerName: OTHER_HAZARD_CONSTANTS.TABLE_COLUMNS.SUB_CATEGORY.headerName,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: OTHER_HAZARD_CONSTANTS.TABLE_COLUMNS.ACTIONS.field,
      headerName: OTHER_HAZARD_CONSTANTS.TABLE_COLUMNS.ACTIONS.headerName,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          onEdit={() => handleEdit(params.row)}
          onDelete={() => handleDelete(params.row)}
          deleteDisabled={!getStatusValue(params.row.status) || !hasEditPermission}
        />
      ),
    },
  ]

  const handleInputChange = (value: string, type: 'question' | 'status') => {
    if (type === 'question') {
      setQuestion(value)
      if (questionError) setQuestionError('')
    } else {
      setStatus(value === '' || value === null || value === undefined ? null : Number(value))
      if (statusError) setStatusError('')
    }
    const currentStatus = type === 'status' ? Number(value) : (status ?? null)
    handleSaveDraft({question: type === 'question' ? value : question, status: currentStatus ?? null})
  }
  const handleSaveDraft = (formData: {question: string, status: number | null}) => {
    const payload = {
      form_type: 'other_hazards',
      form_data: {...formData,sub_category:formData.question,sub_category_id: (selectedRowData?.sub_category_id??'draft')},
    }
    draftSave(payload)
  }

  // Create action handlers for buttons
  const actionHandlers: Record<string, (id: number) => void> = {
    Save: () => handleSave(),
    Cancel: () => {
      handleModalClose()
    },
  }

  // Process permissions to get dynamic buttons
  // In edit mode, wait for data to load before showing buttons
  const isButtonActionDisabled = () => {
    // Nullish check prevents undefined loading flags from triggering disable state
    if ((upsertOtherHazardMutation.isPending ?? false) === true) return true
    if ((isDataLoading ?? false) === true) return true
    return false
  }

  const { buttons: buttonDetails, hasEditPermission } = processButtonsWithPermissions(
    permissions,
    actionHandlers,
    isButtonActionDisabled()
  )

  // Permission access denied logic - only show after API has responded
  useEffect(() => {
    if (!isLoading && !isFetchingHazard && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON as 'error',
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [isLoading, buttonDetails])

  return (
    <PageContainer>
      <CommonSharedTale
        title={OTHER_HAZARD_CONSTANTS.TITLE}
        hanldeClick={handleAdd}
        pathName="#"
        Table={
          <>
          <DataTable
            rows={otherHazardsData?.data ?? []}
            columns={columns}
            IdField={OTHER_HAZARD_CONSTANTS.DATATABLE_IDFIELD}
            loading={isLoading}
          />
          <RiskNavigationWrapper>
            <RiskNavigationButtonGroup projectId={projectId} />
          </RiskNavigationWrapper>
      </>
        }
      />
      
      <CommonModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        buttonRequired={false}
        title={
          isEditMode
            ? OTHER_HAZARD_CONSTANTS.MODAL_TITLES.EDIT
            : OTHER_HAZARD_CONSTANTS.MODAL_TITLES.ADD
        }
      >
        {isDraftSaving && <DraftLoading />}
        <InputField
          label={OTHER_HAZARD_CONSTANTS.FIELD_LABELS.QUESTION}
          placeholder={OTHER_HAZARD_CONSTANTS.FIELD_PLACEHOLDERS.QUESTION}
          value={question}
          maxLength={NUMBERMAP.THREETHOUSANDFIVEHUNDRED}
          onChange={(val: string) => {
            handleInputChange(val, 'question')
          }}
          error={questionError}
          disabled={!hasEditPermission}
        />

         <Grid2 size={NUMBERMAP.TWELVE} sx={STYLE5}>
          <InputField
            label={OTHER_HAZARD_CONSTANTS.FIELD_LABELS.STATUS}
            placeholder={OTHER_HAZARD_CONSTANTS.FIELD_PLACEHOLDERS.STATUS}
            isDropdown={true}
            value={status?.toString() ?? null}
            onChange={(val: string) => {
              handleInputChange(val, 'status')
            }}
            options={statusOptions?.data ?? []}
            error={statusError}
            keyField={RT_DROPDOWN_FIELDS.STATUS.KEY_FIELD}
            valueField={RT_DROPDOWN_FIELDS.STATUS.VALUE_FIELD}
            disabled={!hasEditPermission}
          />
        </Grid2>
        {buttonDetails && <ButtonGroup buttons={buttonDetails} />}
      </CommonModal>
    </PageContainer>
  )
}

export default OtherHazardPage
