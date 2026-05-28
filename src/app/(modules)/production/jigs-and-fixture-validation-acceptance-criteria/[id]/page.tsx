'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { PageContainer } from '@/styles/common'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { GridRenderCellParams } from '@mui/x-data-grid'
import JigsAndFixtureForm from '@/components/modules/production/jigs-and-fixture-validation-acceptance-criteria/JigsAndFixtureForm'
import { useGetJigFixtureValidationList, useDeleteJigFixtureValidation } from '@/hooks/modules/production/useJigsAndFixtureValidation'
import { 
  TABLE_FIELDS,
  TABLE_HEADERS,
  TABLE_ID_FIELD,
  TABLE_TITLE,
} from '@/constants/modules/production/jigsAndFixtureValidation'
import StatusTypography from '@/components/ui/status/ToggleStatus'

/**
 * Classification: Confidential
 */

const JigsAndFixtureValidationAcceptanceCriteriaList: React.FC = () => {
  const params = useParams()
  const projectId = Number(params.id)
  const [openJigsAndFixtureModalOpen, setOpenJigsAndFixtureModalOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  
  // API integration
  const { data: jigFixtureValidationResponse, isLoading } = useGetJigFixtureValidationList(projectId)
  const deleteJigFixtureValidationMutation = useDeleteJigFixtureValidation(projectId)

  const columns = [
    {
      field: TABLE_FIELDS.SNO,
      headerName: TABLE_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_FIELDS.JIGS_TYPE,
      headerName: TABLE_HEADERS.JIGS_TYPE,
      flex: NUMBERMAP.ONE,
    },
    {
      field: TABLE_FIELDS.STATUS,
      headerName: TABLE_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        return <StatusTypography value={params.row.status_id} />;
      },
    },
    {
      field: TABLE_FIELDS.ACTION,
      headerName: TABLE_HEADERS.ACTION,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          onEdit={() => handleEdit(params.row.jig_fixture_validation_id)}
          onDelete={() => handleDelete(params.row.jig_fixture_validation_id)}
          deleteDisabled={params.row.status_id !== NUMBERMAP.ONE}
        />
      ),
    }
  ]

  const handleOpenJigsAndFixtureModal = () => {
    setEditId(null)
    setOpenJigsAndFixtureModalOpen(true)
  }
  const handleCloseJigsAndFixtureModal = () => {
    setOpenJigsAndFixtureModalOpen(false)
    setEditId(null)
  }
  const handleSaveJigsAndFixtureModal = () => {
    setOpenJigsAndFixtureModalOpen(false)
    setEditId(null)
  }
  const handleEdit = (jig_fixture_validation_id: number) => {
    setEditId(jig_fixture_validation_id)
    setOpenJigsAndFixtureModalOpen(true)
  }

  const handleDelete = (jig_fixture_validation_id: number) => {
    showActionAlert(STATUS.DELETE).then((result) => {
      if (result.isConfirmed) {
        deleteJigFixtureValidationMutation.mutate(jig_fixture_validation_id, {
          onSuccess: () => {
            showActionAlert(STATUS.SUCCESS);
          },
          onError: () => {
            showActionAlert(STATUS.FAILED);
          },
        });
      }
    });
  };
  return (
    <PageContainer>
      <CommonSharedTale
        title={TABLE_TITLE}
        hanldeClick={() => {handleOpenJigsAndFixtureModal()}}
        pathName="#"
        Table={
          <DataTable
            rows={jigFixtureValidationResponse?.data ?? []}
            columns={columns}
            IdField={TABLE_ID_FIELD}
            loading={isLoading}
          />
        }
      />
      <JigsAndFixtureForm
        open={openJigsAndFixtureModalOpen}
        onClose={handleCloseJigsAndFixtureModal}
        onSave={handleSaveJigsAndFixtureModal}
        projectId={projectId}
        editId={editId}
      />
    </PageContainer>
  )
}

export default JigsAndFixtureValidationAcceptanceCriteriaList
