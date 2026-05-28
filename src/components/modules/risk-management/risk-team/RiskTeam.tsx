/**
 * Classification: Confidential
 */

'use client'
import React, { useEffect, useState } from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import RiskTeamModal from '@/components/modules/risk-management/risk-team/RiskTeamModal'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { NUMBERMAP, STATUS, STATUS_VALUE } from '@/constants/common'
import {
  useGetAllRiskTeam,
  usePostRiskTeam,
  useDeleteRiskTeam,
} from '@/hooks/modules/risk-management/useRiskTeam'
import {
  RiskTeamData,
  RiskTeamRequest,
} from '@/types/modules/risk-management/riskTeam'
import { RISK_TEAM, RT_PAGE_TITLES } from '@/constants/modules/risk-management/riskTeam'
import { useParams } from 'next/navigation'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'
import { RiskNavigationWrapper } from '@/styles/modules/risk-management/riskLevelDefinition'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'

/**
 * Risk Team Client Component
 * Classification: Confidential
 */
const RiskTeam: React.FC = () => {
  const { id } = useParams()
  const projectId = Number(id)
  const getStatusValue = (statusName: string) => STATUS_VALUE[statusName as keyof typeof STATUS_VALUE] ?? NUMBERMAP.ZERO
  const { data: riskTeamData, isLoading, refetch: refetchRiskTeam } = useGetAllRiskTeam(projectId)
  const postRiskTeamMutation = usePostRiskTeam()
  const deleteRiskTeamMutation = useDeleteRiskTeam()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState<RiskTeamData | null>(
    null
  )

  // Extract permissions from fetch all response for create mode
  const createModePermissions = riskTeamData?.meta_info?.action_control?.permissions ?? []

  const pageActionHandlers: Record<string, (id: number) => void> = {}

  const { buttons: pageButtons, hasEditPermission: pageEditPermission } = processButtonsWithPermissions(
    createModePermissions,
    pageActionHandlers,
    postRiskTeamMutation.isPending,
    true
  )

  useEffect(() => {
    if (!isLoading && !pageButtons) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [isLoading, pageButtons])

  /**
   * Function Name: handleEdit
   * Params: rowData
   * Description: Handle edit button click to open modal in edit mode
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleEdit = (rowData: RiskTeamData) => {
    setSelectedRowData(rowData)
    if(rowData?.risk_team_id == 'draft') {
      setIsEditMode(false)
    } else {
      setIsEditMode(true)
    }
    setIsModalOpen(true)
  }

  /**
   * Function Name: handleAdd
   * Params: None
   * Description: Handle add button click to open modal in create mode
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleAdd = () => {
    setSelectedRowData(null)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  /**
   * Function Name: handleModalClose
   * Params: None
   * Description: Handle modal close and reset state
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleModalClose = () => {
    setIsModalOpen(false)
    refetchRiskTeam()
    setIsEditMode(false)
    setSelectedRowData(null)
  }

  /**
   * Function Name: handleSave
   * Params: formData
   * Description: Handle form save and API call for create/update risk team
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleSave = (formData: any) => {
    const requestData: RiskTeamRequest = {
      project_id: projectId,
      stage_applicable_id: formData.stage,
      responsibility_id: formData.responsibility,
      employee_id: formData.resource,
      status_id: formData.status,
      skill_master_ids: formData.skillRequired ?? [],
      ...(isEditMode && { risk_team_id: selectedRowData?.risk_team_id }),
    }

    postRiskTeamMutation.mutate(requestData, {
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
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleDelete = (rowData: RiskTeamData) => {
    showActionAlert(STATUS.DELETE).then((result) => {
      if (result.isConfirmed) {
        deleteRiskTeamMutation.mutate(rowData.risk_team_id, {
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

  // Define columns for risk team table
  const columns: GridColDef[] = [
    {
      field: RISK_TEAM.FIELD_NAMES.SNO,
      headerName: RISK_TEAM.TABLE_COLUMNS.SNO,
    },
    {
      field: RISK_TEAM.FIELD_NAMES.STAGE_NAME,
      headerName: RISK_TEAM.TABLE_COLUMNS.STAGE,
      flex: NUMBERMAP.ONE,
    },
    {
      field: RISK_TEAM.FIELD_NAMES.RESPONSIBILITY_NAME,
      headerName: RISK_TEAM.TABLE_COLUMNS.RESPONSIBILITY,
      flex: NUMBERMAP.TWO,
    },
    {
      field: RISK_TEAM.FIELD_NAMES.EMPLOYEE_NAME,
      headerName: RISK_TEAM.TABLE_COLUMNS.ASSIGNED_MEMBERS,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: RISK_TEAM.FIELD_NAMES.STATUS_NAME,
      headerName: RISK_TEAM.TABLE_COLUMNS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={getStatusValue(params.value)} />
      ),
    },
    {
      field: RISK_TEAM.FIELD_NAMES.ACTIONS,
      headerName: RISK_TEAM.TABLE_COLUMNS.ACTIONS,
      renderCell: (params: GridRenderCellParams) => {

        return (
          <ActionButton
            onDelete={() => handleDelete(params.row)}
            onEdit={() => handleEdit(params.row)}
            deleteDisabled={!getStatusValue(params.row.status_name) || !pageEditPermission}
          />
        )
      },
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={RT_PAGE_TITLES.MAIN}
        hanldeClick={handleAdd}
        pathName="#"
        Table={
          <>
          <DataTable
            rows={riskTeamData?.data ?? []}
            columns={columns}
            IdField={RISK_TEAM.FIELD_NAMES.RISK_TEAM_ID}
            loading={isLoading}
          />
          <RiskNavigationWrapper>
            <RiskNavigationButtonGroup projectId={projectId} />
          </RiskNavigationWrapper>
          </>
        }
      />
      
      <RiskTeamModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        isEditMode={isEditMode}
        projectId={projectId}
        riskTeamId={selectedRowData?.risk_team_id == 'draft' ? null : selectedRowData?.risk_team_id}
        permissions={isEditMode ? undefined : createModePermissions}
      />
    </PageContainer>
  )
}

export default RiskTeam
