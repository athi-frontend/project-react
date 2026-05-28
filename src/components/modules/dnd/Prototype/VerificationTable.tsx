'use client'
import React from 'react'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import {
  useVerificationPlans,
  useDeleteVerificationPlan,
} from '@/hooks/modules/dnd/useProjectStages'
import {
  TableWrapper,
  TableHeader,
  TableHeaderTitle,
  AddButton,
  AddButtonText,
  HyperlinkCell,
  ActionButtonsContainer,
} from '../../../../styles/components/modules/table'
import {
  ACTIONS,
  ACTIONS_FIELD,
  DELETE,
  DELETE_ERROR_MESSAGE,
  DIR_NO,
  DIR_NUMBER,
  ERROR_TITLE,
  INITIATE,
  INITIATE_VERIFICATION,
  NA,
  S_NO,
  S_NO_FIELD,
  TABLE_CELL,
  TABLE_HEADER,
  UNITS,
  UNITS_TO_VERIFY,
  VERIFICATION,
  PROTOTYPE_FORM_CONSTANTS,
} from '../../../../constants/components/ui/prototypeForm'
import DataGridTable from '@/components/ui/data-grid-table/DataGridTable'
import ProtocolModal from '../project-stages/ProtocolModal'
import {
  VerificationTableProps,
  VerificationPlanItem,
} from '@/types/modules/dnd/stageTypes'
import { NUMBERMAP } from '@/constants/common'
import { ActionButton } from '@/components/ui'

const VerificationTable: React.FC<VerificationTableProps> = ({
  projectStageOrderId,
}) => {
  const [openModal, setOpenModal] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>(
    PROTOTYPE_FORM_CONSTANTS.ADD
  )
  const [selectedVerificationPlanId, setSelectedVerificationPlanId] =
    React.useState<number | null>(null)

  const { data: verificationData } = useVerificationPlans(projectStageOrderId)

  const { mutate: deleteVerificationPlan } =
    useDeleteVerificationPlan()

  const rows =
    verificationData?.data?.map(
      (item: VerificationPlanItem, index: number) => ({
        id: item.verification_plan_id,
        sNo: index + 1,
        dirNumber: item.dir_id ?? NA,
        units: item.units_to_be_verified,
        verification: INITIATE,
      })
    ) ?? []

  const renderHyperlinkCell = (params: GridRenderCellParams) => {
    return <HyperlinkCell>{params.value}</HyperlinkCell>
  }

  const renderActionCell = (params: GridRenderCellParams) => {
    const handleEditClick = () => {
      setModalMode(PROTOTYPE_FORM_CONSTANTS.EDIT)
      setSelectedVerificationPlanId(params.id as number)
      setOpenModal(true)
    }

    const handleDeleteClick = async () => {
      const result = await showActionAlert(DELETE)
      if (result.isConfirmed) {
        const verificationPlanId = params.id as number
        deleteVerificationPlan(verificationPlanId, {
          onSuccess: () => {
            showActionAlert(PROTOTYPE_FORM_CONSTANTS.SUCCESS)
          },
          onError: (error) => {
            showActionAlert(PROTOTYPE_FORM_CONSTANTS.CUSTOM_ALERT, {
              title: ERROR_TITLE,
              text: DELETE_ERROR_MESSAGE,
              icon: PROTOTYPE_FORM_CONSTANTS.ERROR,
              cancelButton: false,
              confirmButton: false,
            })
          },
        })
      }
    }

    return (
      <ActionButtonsContainer>
        <ActionButton onEdit={handleEditClick} onDelete={handleDeleteClick} /> 
      </ActionButtonsContainer>
    )
  }

  const columns = [
    {
      field: S_NO_FIELD,
      headerName: S_NO,
      flex:0.5,
      headerClassName: TABLE_HEADER,
      cellClassName: TABLE_CELL,
    },
    {
      field: DIR_NO,
      headerName: DIR_NUMBER,
      flex:1,
      headerClassName: TABLE_HEADER,
      cellClassName: TABLE_CELL,
    },
    {
      field: UNITS,
      headerName: UNITS_TO_VERIFY,
      flex:2,
      headerClassName: TABLE_HEADER,
      cellClassName: TABLE_CELL,
    },
    {
      field: VERIFICATION,
      headerName: INITIATE_VERIFICATION,
      flex:1,
      headerClassName: TABLE_HEADER,
      cellClassName: TABLE_CELL,
      renderCell: renderHyperlinkCell,
    },
    {
      field: ACTIONS_FIELD,
      headerName: ACTIONS,
      flex:0.5,
      headerClassName: TABLE_HEADER,
      cellClassName: TABLE_CELL,
      renderCell: renderActionCell,
    },
  ]

  const handleOpenAdd = () => {
    setModalMode(PROTOTYPE_FORM_CONSTANTS.ADD)
    setSelectedVerificationPlanId(null)
    setOpenModal(true)
  }

  const handleClose = () => {
    setOpenModal(false)
    setModalMode(PROTOTYPE_FORM_CONSTANTS.ADD)
    setSelectedVerificationPlanId(null)
  }

  return (
    <TableWrapper>
      <TableHeader>
        <TableHeaderTitle sx={{ fontSize: '20px' }}>
          Verification Plan
        </TableHeaderTitle>
        <AddButton onClick={handleOpenAdd}>
          <AddButtonText>Add New</AddButtonText>
        </AddButton>
      </TableHeader>
      <DataGridTable
        columns={columns}
        rows={rows}
        showAddButton={false}
        hideFooter={true}
        autoHeight={true}
        disableColumnMenu={true}
        disableColumnFilter={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        disableSelectionOnClick={true}
        getRowHeight={() => (NUMBERMAP.TEN*NUMBERMAP.SEVEN)}
        hideHeader={true}
      />
      <ProtocolModal
        open={openModal}
        onClose={handleClose}
        onSave={handleClose}
        mode={modalMode}
        projectStageOrderId={projectStageOrderId}
        verificationPlanId={
          modalMode === PROTOTYPE_FORM_CONSTANTS.EDIT
            ? selectedVerificationPlanId
            : null
        }
        initialData={
          modalMode === PROTOTYPE_FORM_CONSTANTS.EDIT &&
          selectedVerificationPlanId !== null
            ? (verificationData?.data?.find(
                (item: VerificationPlanItem) =>
                  item.verification_plan_id === selectedVerificationPlanId
              ) ?? {})
            : {}
        }
      />
    </TableWrapper>
  )
}

export default VerificationTable
