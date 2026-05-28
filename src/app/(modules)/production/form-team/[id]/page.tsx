'use client'
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Grid2, Box } from '@mui/material'
import { ButtonGroup, Label, InputField, DataGridTable, ActionButton, RichTextEditor, showActionAlert } from '@/components/ui'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { PageContainer, P20P40, ErrorText } from '@/styles/common'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import {
  FORM_TEAM_COLUMN_FIELDS,
  FORM_TEAM_COLUMN_HEADERS,
  FORM_TEAM_ERROR_MESSAGES,
  FORM_TEAM_PAGE_LABELS,
  FORM_TEAM_PAGE_PLACEHOLDERS,
 FORM_TEAM, BUTTON_LABELS,
  SUCCESS_ALERT,
  FAILED_ALERT,
  MODAL_MODE,
  FORM_TEAM_PAGE_FIELDS
} from '@/constants/modules/production/formTeam'
import FormTeamModal from '@/components/modules/production/form-team/FormTeamModal'
import { FormTeamModalData, FormTeamModalSaveData, FormErrors, TeamDetailPayload, FormTeamPostPayload, DataGridRenderCellParams, FormTeamTableRow, EditingRow, FormTeamResponse, FormTeamTableRowRenderCellParams, FormTeamDataResponse } from '@/types/modules/production/formTeam'
import { usePostFormTeam, useGetFormTeamByProject } from '@/hooks/modules/production/useFormTeam'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import {stripHtml } from '@/lib/utils/common'

/**
 * Classification: Confidential
 */
const FormTeamPage: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = Number(params.id)

  const { mutate: postFormTeam, isPending: isSaving } = usePostFormTeam()
  const { data: formTeamData } = useGetFormTeamByProject(projectId)
  const { data: statusData } = useOrganizationStatus()

  const initialDraftLoading = useRef(true)

  // Draft save hook
  const projectIdForDraft = projectId
  const { 
    draftSave, 
    clearDraftSave, 
    isDraftSaving, 
    draftData, 
    checkUnsavedDraftBeforeLeave 
  } = useDraftSave({
    context_type: "project",
    context_instance_id: projectIdForDraft,
    enableFetch: false
  })

  const [teamName, setTeamName] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rows, setRows] = useState<FormTeamTableRow[]>([])
  const [editingRow, setEditingRow] = useState<EditingRow>(null)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>(MODAL_MODE.ADD)

   // Helper function to extract data from API response
  const extractFormTeamData = (
    formTeamData: FormTeamDataResponse | { data: FormTeamDataResponse } | undefined
  ): FormTeamResponse | null => {
    const responseData = formTeamData && typeof formTeamData === 'object' && 'data' in formTeamData
      ? formTeamData.data
      : formTeamData;
    // Handles array or single object data
    if (Array.isArray(responseData) && responseData.length > NUMBERMAP.ZERO) {
      return responseData[NUMBERMAP.ZERO];
    }
    if (responseData && !Array.isArray(responseData)) {
      return responseData
    }
    
    if (!responseData && formTeamData) {
      const directData = typeof formTeamData === 'object' && 'data' in formTeamData ? formTeamData.data : formTeamData;
      return Array.isArray(directData) ? directData[NUMBERMAP.ZERO] : directData
    }
    
    return null
  }

  // Helper function to update form fields from data
  const updateFormFields = (data: Partial<FormTeamResponse>) => {
    if (data?.team_name) {
      setTeamName(data.team_name)
    }
    if (data?.remarks) {
      setRemark(data.remarks)
    }
  }

  // Helper function to update rows from team details
  const updateRowsFromTeamDetails = (teamDetails: any) => {
    const isValidArray = Array.isArray(teamDetails) && teamDetails.length > NUMBERMAP.ZERO;
    if (!isValidArray) {
      return
    }
    
    setRows(teamDetails ?? [])
  }


  // Load draft data
  const loadDraftData = useCallback((data: any) => {
    const resolvedData = Array.isArray(data?.data)
      ? data.data[NUMBERMAP.ZERO]
      : data?.data ?? data ?? {}
    
    if (resolvedData.team_name) {
      setTeamName(resolvedData.team_name)
    }
    if (resolvedData.remarks) {
      setRemark(resolvedData.remarks)
    }
    if (resolvedData.team_details && Array.isArray(resolvedData.team_details)) {
      setRows(resolvedData.team_details)
    }
  }, [])

  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData, loadDraftData])

  // Initialize draft loading flag
  useEffect(() => {
    setTeamName('')
    setRemark('')
    setRows([])
    setTimeout(() => {
      initialDraftLoading.current = false
    }, NUMBERMAP.TWOTHOUSAND)
  }, [projectId])

  // Populate form data from API response
  useEffect(() => {
    if (!formTeamData || !statusData?.data) {
      return
    }

    const data = extractFormTeamData(formTeamData)
    if (!data) {
      return
    }

    updateFormFields(data)
    updateRowsFromTeamDetails(data.team_details)
  }, [formTeamData, statusData, projectId])

  const handleAdd = () => {
    setModalMode(MODAL_MODE.ADD)
    setEditingRow(null)
    setIsModalOpen(true)
  }

  const handleEdit = (row: FormTeamTableRow) => {
    setModalMode(MODAL_MODE.EDIT)
    // Ensure we get the latest row data from the current rows state
    const currentRow = rows.find((r) => r.team_details_id === row.team_details_id) ?? row
    // Convert to modal format
    const rowForModal: FormTeamModalData = {
      role: currentRow.role_id?.toString() ?? '',
      resource: currentRow.employee_id?.toString() ?? '',
      responsibility: currentRow.responsibility_description ?? '',
      status: currentRow.status_id?.toString() ?? '',
    }
    setEditingRow({ ...currentRow, ...rowForModal })
    setIsModalOpen(true)
  }


  // Helper function to create a new row
  const createNewRow = (data: FormTeamModalSaveData): FormTeamTableRow => {
    const tempId = `row-${crypto.randomUUID()}`
    return {
      team_details_id: tempId,
      role_id: Number(data.role),
      role_name: data.role_name,
      employee_id: Number(data.resource),
      employee_name: data.employee_name,
      responsibility_description: data.responsibility,
      status_id: Number(data.status),
    }
  }

  // Helper function to update existing row
  const updateExistingRow = (data: FormTeamModalSaveData): void => {
    if (!editingRow) return

    setRows((prev) =>
      prev.map((row) => 
        row.team_details_id === editingRow.team_details_id 
          ? { 
              ...row, 
              role_id: Number(data.role),
              role_name: data.role_name,
              employee_id: Number(data.resource),
              employee_name: data.employee_name,
              responsibility_description: data.responsibility,
              status_id: Number(data.status),
            } 
          : row
      )
    )
  }

  // Helper function to clear form team error
  const clearFormTeamError = (): void => {
    setErrors((prev) => {
      if (prev.formTeam) {
        const updated = { ...prev }
        delete updated.formTeam
        return updated
      }
      return prev
    })
  }

  const handleDelete = async (id: number | string) => {
    // Show confirmation alert
    const result = await showActionAlert(STATUS.DELETE)
    if (!result.isConfirmed) {
      return
    }

    // Update row status to inactive instead of deleting
    setRows((prev) => {
      const updatedRows = prev.map((row) => {
        if (row.team_details_id === id) {
          const updatedRow = {
            ...row,
            status_id: NUMBERMAP.TWO, // Set status to inactive (2)
          }
          // If this row is currently being edited, update editingRow as well
          if (editingRow && editingRow.team_details_id === id) {
            setEditingRow(updatedRow)
          }
          return updatedRow
        }
        return row
      })
      if (!initialDraftLoading.current) {
        handleDraftSave(undefined, undefined, updatedRows)
      }
      return updatedRows
    })
  }


  const columns = useMemo(
    () => [
      {
        field: FORM_TEAM_COLUMN_FIELDS.SNO,
        headerName: FORM_TEAM_COLUMN_HEADERS.SNO,
        flex: NUMBERMAP.HALF,
      },
      {
        field: FORM_TEAM_COLUMN_FIELDS.ROLE,
        headerName: FORM_TEAM_COLUMN_HEADERS.ROLE,
        flex: NUMBERMAP.ONE,
      },
      {
        field: FORM_TEAM_COLUMN_FIELDS.RESOURCE,
        headerName: FORM_TEAM_COLUMN_HEADERS.RESOURCE,
        flex: NUMBERMAP.ONE,
      },
      {
        field: FORM_TEAM_COLUMN_FIELDS.RESPONSIBILITY,
        headerName: FORM_TEAM_COLUMN_HEADERS.RESPONSIBILITY,
        flex: NUMBERMAP.ONE,
        renderCell: (params: DataGridRenderCellParams) => {
          if (!params.value) return '-'
          return stripHtml(params.value)
        }
      },
      {
        field: FORM_TEAM_COLUMN_FIELDS.STATUS,
        headerName: FORM_TEAM_COLUMN_HEADERS.STATUS,
        flex: NUMBERMAP.ONE,
        renderCell: (params: DataGridRenderCellParams) => (
          <StatusTypography value={params.value as number} />
        ),
      },
      {
        field: FORM_TEAM_COLUMN_FIELDS.ACTION,
        headerName: FORM_TEAM_COLUMN_HEADERS.ACTION,
        flex: NUMBERMAP.ONE,
        renderCell: (params: FormTeamTableRowRenderCellParams) => {
          // Disable delete icon when status is inactive (2)
          const isDeleteDisabled = params.row.status_id === NUMBERMAP.TWO
          return (
            <ActionButton
              onDelete={() => handleDelete(params.row.team_details_id)}
              onEdit={() => handleEdit(params.row)}
              deleteDisabled={isDeleteDisabled}
            />
          )
        },
      },
    ],
    []
  )

  const handleModalSave = (data: FormTeamModalSaveData) => {
    if (modalMode === MODAL_MODE.ADD) {
      const newRow = createNewRow(data)
      setRows((prev) => {
        const updated = [...prev, newRow]
        if (!initialDraftLoading.current) {
          handleDraftSave(undefined, undefined, updated)
        }
        return updated
      })
    } else if (editingRow) {
      updateExistingRow(data)
      if (!initialDraftLoading.current) {
        handleDraftSave()
      }
    }
    
    clearFormTeamError()
    setIsModalOpen(false)
    setEditingRow(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingRow(null)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!teamName?.trim()) {
      newErrors.teamName = FORM_TEAM_ERROR_MESSAGES.TEAM_NAME_REQUIRED
    }
    if (rows.length === NUMBERMAP.ZERO) {
      newErrors.formTeam = FORM_TEAM_ERROR_MESSAGES.FORM_TEAM_REQUIRED
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  // Draft save handler
  const handleDraftSave = useCallback((teamNameToSave?: string, remarkToSave?: string, rowsToSave?: FormTeamTableRow[]) => {
    const payload = {
      id: projectIdForDraft ?? new Date().getTime(),
      team_name: teamNameToSave ?? teamName,
      remarks: remarkToSave ?? remark,
      team_details: rowsToSave ?? rows,
      type: 'draft',
    }

    draftSave({
      form_data: payload,
    })
  }, [draftSave, projectIdForDraft, teamName, remark, rows])

  const handleTeamNameChange = (value: string) => {
    setTeamName(value)
    if (!initialDraftLoading.current) {
      handleDraftSave(value)
    }
    if (errors.teamName) {
      setErrors((prev) => {
        const { teamName, ...updated } = prev;
        return updated;
      })
    }
  }

  const handleRemarkChange = (value: string) => {
    setRemark(value)
    if (!initialDraftLoading.current) {
      handleDraftSave(undefined, value)
    }
    if (errors.remark) {
      setErrors((prev) => {
        const { remark, ...updated } = prev;
        return updated;
      })
    }
  }

  const handleSave = () => {
    const isValid = validateForm()
    if (!isValid) {
      // Validation failed - errors are already set, just return
      return
    }

    clearDraftSave()

    // Map rows to API payload format (rows already in API format)
    const teamDetails: TeamDetailPayload[] = rows.map((row) => {
      const teamDetail: TeamDetailPayload = {
        role_id: row.role_id,
        employee_id: row.employee_id,
        responsibility_description: row.responsibility_description ?? '',
        status_id: row.status_id,
      }
      
      // Include team_details_id only for updates (when it exists, is a valid number, and is positive)
      // Negative IDs are temporary IDs for new rows and should not be sent
      if (row.team_details_id && typeof row.team_details_id === 'number' && row.team_details_id > 0) {
        teamDetail.team_details_id = row.team_details_id
      }
      
      return teamDetail
    })

    // Prepare API payload
    const payload: FormTeamPostPayload = {
      project_id: projectId,
      team_name: teamName.trim(),
      remarks: remark.trim(),
      team_details: teamDetails,
    }

    // Call API
    postFormTeam(payload, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT)
      },
      onError: () => {
        showActionAlert(FAILED_ALERT)
      },
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(FORM_TEAM.PATH)
  }

  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isSaving} />
      <Label title={FORM_TEAM_PAGE_LABELS.FORM_TEAM} />

      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InputField
            label={FORM_TEAM_PAGE_LABELS.TEAM_NAME}
            placeholder={FORM_TEAM_PAGE_PLACEHOLDERS.TEAM_NAME}
            value={teamName}
            onChange={handleTeamNameChange}
            error={errors.teamName}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title={FORM_TEAM_PAGE_LABELS.FORM_TEAM}
            rows={rows}
            showAddButton
            onAddRow={handleAdd}
            columns={columns}
            idField={FORM_TEAM_PAGE_FIELDS.ID_FIELD}
            hideFooter={true}
          />
          {errors.formTeam && <ErrorText>{errors.formTeam}</ErrorText>}
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <RichTextEditor
            label={FORM_TEAM_PAGE_LABELS.REMARK}
            placeholder={FORM_TEAM_PAGE_PLACEHOLDERS.REMARK}
            value={remark}
            onChange={handleRemarkChange}
            error={errors.remark}
          />
        </Grid2>
      </Grid2>

      <Box sx={P20P40}>
        <ButtonGroup
          buttons={[
            {
              label: BUTTON_LABELS.CANCEL,
              onClick: handleCancel,
            },
            {
              label: BUTTON_LABELS.SAVE,
              onClick: handleSave,
              disabled: isSaving,
            },
          ]}
        />
      </Box>
      <FormTeamModal
        key={editingRow?.team_details_id ?? MODAL_MODE.ADD}
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        mode={modalMode}
        initialData={editingRow ? {
          role: editingRow.role_id?.toString() ?? editingRow.role ?? '',
          resource: editingRow.employee_id?.toString() ?? editingRow.resource ?? '',
          responsibility: editingRow.responsibility_description ?? editingRow.responsibility ?? '',
          status: editingRow.status_id?.toString() ?? editingRow.status ?? '',
        } : undefined}
        existingRows={rows}
        editingRowId={editingRow?.team_details_id}
      />
    </PageContainer>
  )
}

export default FormTeamPage
