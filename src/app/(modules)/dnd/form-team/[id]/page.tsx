/**
 * Classification: Confidential
 */

'use client'
import React, { useState, useEffect } from 'react'
import AddRowButton from '@/components/ui/table/AddRowButton'
import {
  FormTeamContainer,
  HeaderContainer,
  Title,
  ContentContainer,
  ButtonWrapper,
  InitiateButton,
} from '@/styles/modules/dnd/formTeam'
import {
  useTeams,
  useDeleteTeam,
  useUpdateTeam,
} from '@/hooks/modules/dnd/useFormTeam'
import {
  TableData,
  UpdateTeamData,
  TeamResponse,
} from '@/types/modules/dnd/formTeam'
import {
  TITLE,
  ADD_BUTTON_TITLE,
  INITIATE_BUTTON_TEXT,
  NO_RESPONSIBILITY,
  DELETE_ALERT,
  TITLE_VARIANT,
  BUTTON_VARIANT,
  ID_FIELD,
  SUCCESS_ALERT,
  FAILED_ALERT,
  TABLE_COLUMNS,
} from '@/constants/modules/dnd/formTeam'
import { useParams } from 'next/navigation'
import { showActionAlert, DataTable } from '@/components/ui'
import FormTeam from '@/components/modules/dnd/form-team/FormTeamModal'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { IconButton, useTheme } from '@mui/material'
import { Edit, Trash } from 'iconsax-react'
import { NUMBERMAP } from '@/constants/common'

const FormTeamComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [teamToEdit, setTeamToEdit] = useState<TableData | null>(null)
  const [tableData, setTableData] = useState<TableData[]>([])
  const params = useParams<{ id: string }>()
  const projectId: number = Number(params.id)
  const theme = useTheme()
  const { data: teamsData, refetch: refetchTeams } = useTeams(projectId)
  const { mutate: deleteTeam } = useDeleteTeam()
  const { mutate: updateTeam } = useUpdateTeam()

  useEffect(() => {
    if (teamsData?.data && teamsData.data.length > 0) {
      const formattedData: TableData[] = teamsData.data.map(
        (team: TeamResponse) => ({
          id: team.design_team_id,
          role: team.role,
          role_name: team.role_name,
          other_resource: team.other_resource,
          user: team.user,
          user_name: `${team.first_name ?? ''} ${team.last_name ?? ''}`.trim(),
          responsibility: team.responsibility ?? NO_RESPONSIBILITY,
          responsibility_description: team.responsibility_description ?? '',
          stage_name: team.stage ?? '',
          project_stage_order_id: team.project_stage_order_id,
          start_date: team.start_date ?? '',
          end_date: team.end_date ?? '',
          status: team.status,
          project_id: team.project_id,
          design_team_id: team.design_team_id,
        })
      )
      setTableData(formattedData)
    } else {
      setTableData([])
    }
  }, [teamsData])

  const handleDelete = (teamId: number): void => {
    showActionAlert(DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        deleteTeam(teamId, {
          onSuccess: () => {
            showActionAlert(SUCCESS_ALERT)
            refetchTeams()
          },
          onError: () => {
            showActionAlert(FAILED_ALERT)
          },
        })
      }
    })
  }

  const handleEdit = (team: TableData): void => {
    setTeamToEdit(team)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (updatedData: TableData): void => {
    if (!teamToEdit?.id) {
      return
    }
    const payload: UpdateTeamData = {
      design_team_id: teamToEdit.id,
      project_id: projectId,
      other_resource: updatedData.other_resource ?? '',
      role: updatedData.role,
      user: updatedData.user,
      responsibility: updatedData.responsibility ?? '',
      responsibility_description: updatedData.responsibility_description ?? '',
      stage_name: updatedData.stage_name ?? '',
      project_stage_order_id: updatedData.project_stage_order_id ?? '',
      start_date: updatedData.start_date ?? '',
      end_date: updatedData.end_date ?? '',
      status: updatedData.status,
      modified_by: teamToEdit.modified_by,
    }
    updateTeam(payload, {
      onSuccess: () => {
        setIsEditModalOpen(false)
        setTeamToEdit(null)
        refetchTeams()
      },
    })
  }

  const columns = [
    ...TABLE_COLUMNS,
    {
      field: 'id',
      headerName: 'Actions',
      width: NUMBERMAP.HUNDRED,
      renderCell: (params: GridRenderCellParams) => (
        <div key={params.id}>
          <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
            <Edit size={NUMBERMAP.EIGHTEEN} color={theme.palette.primary.main} />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row.id)}
          >
            <Trash size={NUMBERMAP.EIGHTEEN} color={theme.palette.error.main} />
          </IconButton>
        </div>
      ),
      sortable: false,
      filterable: false,
    },
  ]

  return (
    <FormTeamContainer>
      <HeaderContainer>
        <Title variant={TITLE_VARIANT}>{TITLE}</Title>
        <AddRowButton
          title={ADD_BUTTON_TITLE}
          onClick={() => setIsModalOpen(true)}
        />
      </HeaderContainer>
      <ContentContainer>
        <DataTable
          rows={tableData ?? []}
          columns={columns}
          IdField={ID_FIELD}
          pagination
        />
        <ButtonWrapper>
          <InitiateButton variant={BUTTON_VARIANT}>
            {INITIATE_BUTTON_TEXT}
          </InitiateButton>
        </ButtonWrapper>
      </ContentContainer>
      <FormTeam open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {isEditModalOpen && teamToEdit && (
        <FormTeam
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setTeamToEdit(null)
          }}
          teamToEdit={teamToEdit}
          onSave={handleUpdate}
        />
      )}
    </FormTeamContainer>
  )
}

export default FormTeamComponent
