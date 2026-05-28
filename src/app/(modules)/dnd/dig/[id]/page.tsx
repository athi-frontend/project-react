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
  useSaveTeam,
  useDeleteTeam,
  useUpdateTeam,
} from '@/hooks/modules/dnd/useTeam'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { TableData } from '@/types/modules/dnd/formTeam'
import { getTeamHeaders } from '@/components/modules/dnd/dig/TeamAction'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
const TableComponent = dynamic(
  () => import('@/components/ui/table/TableComponent'),
  { ssr: false }
)
const FormTeam = dynamic(
  () => import('@/components/modules/dnd/form-team/FormTeamModal'),
  { ssr: false }
)

const DesignInputGathering: React.FC = () => {
  const params = useParams()
  const projectId = params.id
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [teamToEdit, setTeamToEdit] = useState<TableData | null>(null)
  const [tableData, setTableData] = useState<TableData[]>([])

  const { data: teamsData, refetch: refetchTeams } = useTeams(projectId)
  const { mutate: saveTeam } = useSaveTeam()
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam()
  const { mutate: updateTeam } = useUpdateTeam()

  useEffect(() => {
    if (teamsData?.data) {
      const formattedData = teamsData.data.map((team: any) => ({
        id: team.design_team_id,
        role: team.role_name ?? 'Unknown Role',
        user: `${team.first_name} ${team.last_name}`,
        responsibility: team.responsibility ?? '',
      }))
      setTableData(formattedData)
    } else {
      setTableData([])
    }
  }, [teamsData])

  const handleDelete = (teamId: number) => {
    showActionAlert('delete').then((result) => {
      if (result.isConfirmed) {
        deleteTeam(teamId, {
          onSuccess: () => {
            refetchTeams()
          },
          onError: () => {
            showActionAlert('denied')
          },
        })
      }
    })
  }

  const handleEdit = (team: TableData) => {
    setTeamToEdit(team)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (updatedData: TableData) => {
    if (!teamToEdit?.id) {
      return
    }

    const payload = {
      design_team_id: teamToEdit.id,
      project_id: projectId,
      role: updatedData.role,
      user: updatedData.user,
      responsibility: updatedData.responsibility,
      status: 1,
      modified_by: 1,
    }
    updateTeam(
      { ...payload, design_team_id: teamToEdit.id },
      {
        onSuccess: () => {
          setIsEditModalOpen(false)
          setTeamToEdit(null)
          refetchTeams()
        },
      }
    )
  }

  const handleSave = (newData: TableData) => {
    const payload = {
      ...newData,
      project_id: projectId,
    }
    saveTeam(payload, {
      onSuccess: () => {
        setIsModalOpen(false)
        refetchTeams()
      },
    })
  }

  const headers = getTeamHeaders({
    teamsData,
    handleEdit,
    handleDelete,
    isDeleting,
  })

  return (
    <FormTeamContainer>
      <HeaderContainer>
        <Title variant="h1">Design Input Gathering</Title>
        <AddRowButton title="Add New" onClick={() => setIsModalOpen(true)} />
      </HeaderContainer>
      <ContentContainer>
        <TableComponent
          data={tableData.map((team) => ({
            id: team.id,
            role: team.role,
            user: team.user,
            responsibility: team.responsibility,
          }))}
          headers={headers}
        />
        <ButtonWrapper>
          <InitiateButton variant="contained">
            Initiate Design Input Gathering
          </InitiateButton>
        </ButtonWrapper>
      </ContentContainer>

      {}
      <FormTeam
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {}
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

export default DesignInputGathering
