/**
 * Classification : Confidential
 **/
'use client'
import React, { useEffect, useState } from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { DataTable, showActionAlert } from '@/components/ui'
import ActionButton from '@/components/ui/action-button/ActionButton'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { useParams } from 'next/navigation'
import {
  useGetCommitteeList,
  useUpsertCommittee,
  useDeleteCommittee,
} from '@/hooks/modules/risk-management/useCommittee'
import { CommitteeFormData } from '@/types/modules/risk/committee'
import {
  COMMITTEE_TABLE_COLUMNS,
  COMMITTEE_PAGE_CONSTANTS,
  COMMITTEE_TABLE_FIELDS,
  COMMITTEE_INITIAL_DATA,
} from '@/constants/modules/risk-management/committee'
import CommitteeModal from '@/components/modules/risk-management/committee/CommitteeModal'
import { NUMBERMAP, STATUS, STATUS_VALUE } from '@/constants/common'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'
import { RiskNavigationWrapper } from '@/styles/modules/risk-management/riskLevelDefinition'
import { processButtonsWithPermissions, QUERYCONSTANTS, withFullName } from '@/lib/utils/common'

const CommitteePage = () => {
  const params = useParams()
  const projectId = Number(params.id)

  const getStatusValue = (statusName: string) =>
    STATUS_VALUE[statusName as keyof typeof STATUS_VALUE] ?? NUMBERMAP.ZERO

  // API hooks
  const { data: committeeListData, isLoading: isCommitteeListLoading,  refetch : refetchCommittee } =
    useGetCommitteeList(projectId)
  const { mutate: upsertCommittee, isPending: isUpsertLoading } =
    useUpsertCommittee()
  const { mutate: deleteCommittee } = useDeleteCommittee()

  // Extract permissions from fetch all response for create mode
  const createModePermissions = committeeListData?.meta_info?.action_control?.permissions ?? []

  const actionHandlers: Record<string, (id: number) => void> = {}

  const { buttons: pageButtons, hasEditPermission: hasCommitteeEditPermission } =
    processButtonsWithPermissions(
      createModePermissions,
      actionHandlers,
      isUpsertLoading,
      true
    )

  useEffect(() => {
    if (
      !isCommitteeListLoading &&
      !pageButtons
    ) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [isCommitteeListLoading, pageButtons])

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCommittee, setCurrentCommittee] =
    useState<CommitteeFormData | null>(null)

  // Handle add new committee member
  const handleAddNew = () => {
    setCurrentCommittee(null)
    setIsModalOpen(true)
  }

  // Handle edit committee member
  const handleEdit = (id: number) => {
    // Set the committee ID for fetching fresh data
    setCurrentCommittee({
      ...COMMITTEE_INITIAL_DATA,
      project_id: projectId,
      committee_id: id,
      status: NUMBERMAP.ONE,
    })
    setIsModalOpen(true)
  }

  // Determine if in edit mode
  const isEditMode = currentCommittee?.committee_id !== null && 
                     currentCommittee?.committee_id !== undefined &&
                     typeof currentCommittee?.committee_id === 'number'

  // Handle delete committee member
  const handleDelete = async (id: number) => {
    const result = await showActionAlert(STATUS.DELETE)
    if (result.isConfirmed) {
      deleteCommittee(id)
    }
  }

  /**
   * Function Name: handleSaveCommittee
   * Params: data
   * Description: Used to save/update committee member data,
   * Author: Madhumitha,
   * Created: 23-09-2025,
   * Modified:
   * Classification : Confidential
   **/
  const handleSaveCommittee = (data: CommitteeFormData) => {
    // Transform the data to match API expectations
    const apiPayload = {
      project_id: data.project_id,
      role_id: data.role_id,
      employee_id: data.employee_id,
      description: data.description,
      status_id: data.status, // Transform status to status_id
      // Only include committee_id when editing (not null)
      ...(data.committee_id && { committee_id: data.committee_id }),
    }

    upsertCommittee(apiPayload, {
      onSuccess: () => {
        setIsModalOpen(false)
        setCurrentCommittee(null)
      },
    })
  }

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentCommittee(null)
    refetchCommittee()
  }

  // Render status cell with colors (no border)
  const renderStatusCell = (params: GridRenderCellParams) => {
    return <StatusTypography value={getStatusValue(params.value)} />
  }

  // Render actions cell
  const renderActionsCell = (params: GridRenderCellParams) => {
    const rowId = params.row.committee_id
    const hasValidId = rowId && rowId !== 'draft' && typeof rowId === 'number'

    return (
      <Box>
        <ActionButton
          onEdit={() => handleEdit(rowId)}
          onDelete={() => handleDelete(rowId)}
          deleteDisabled={
            !hasValidId ||
            !getStatusValue(params.row.status_name) ||
            !hasCommitteeEditPermission
          }
        />
      </Box>
    )
  }

  // Define columns for committee table
  const columns: GridColDef[] = [
    {
      field: COMMITTEE_TABLE_FIELDS.SNO,
      headerName: COMMITTEE_TABLE_COLUMNS.SNO.headerName,
    },
    {
      field: COMMITTEE_TABLE_FIELDS.ROLE_NAME,
      headerName: COMMITTEE_TABLE_COLUMNS.ROLE.headerName,
      flex: COMMITTEE_TABLE_COLUMNS.ROLE.flex,
    },
    {
      field: COMMITTEE_TABLE_FIELDS.DESCRIPTION,
      headerName: COMMITTEE_TABLE_COLUMNS.DESCRIPTION.headerName,
      flex: COMMITTEE_TABLE_COLUMNS.DESCRIPTION.flex,
    },
    {
      field: COMMITTEE_TABLE_FIELDS.EMPLOYEE_NAME,
      headerName: COMMITTEE_TABLE_COLUMNS.ASSIGNED_EMPLOYEE.headerName,
      flex: COMMITTEE_TABLE_COLUMNS.ASSIGNED_EMPLOYEE.flex,
    },
    {
      field: COMMITTEE_TABLE_FIELDS.STATUS_NAME,
      headerName: COMMITTEE_PAGE_CONSTANTS.STATUS_HEADER,
      flex: COMMITTEE_TABLE_COLUMNS.STATUS.flex,
      renderCell: renderStatusCell,
    },
    {
      field: COMMITTEE_TABLE_FIELDS.ACTIONS,
      headerName: COMMITTEE_TABLE_COLUMNS.ACTIONS.headerName,
      renderCell: renderActionsCell,
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={COMMITTEE_PAGE_CONSTANTS.PAGE_TITLE}
        pathName="#"
        hanldeClick={handleAddNew}
        Table={
          <>
          <DataTable
            rows={withFullName((committeeListData?.data ?? []),'employee_first_name','employee_last_name')}
            columns={columns}
            IdField={COMMITTEE_PAGE_CONSTANTS.ID_FIELD}
            loading={isCommitteeListLoading}
          />
           <RiskNavigationWrapper>
             <RiskNavigationButtonGroup projectId={projectId} />
           </RiskNavigationWrapper>
          </>
        }
      />

      <CommitteeModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCommittee}
        projectId={projectId}
        committeeData={currentCommittee}
        isLoading={isUpsertLoading}
        isEditMode={isEditMode}
        permissions={isEditMode ? undefined : createModePermissions}
      />
    </PageContainer>
  )
}

export default CommitteePage
