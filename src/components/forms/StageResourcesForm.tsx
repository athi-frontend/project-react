/**
Classification : Confidential
**/
'use client'
import React, { useEffect, useState } from 'react'
import { Grid2 } from '@mui/material'
import {
  PROJECT_BUTTONS,
  STAGE_FORM,
  STAGE_RESOURCE_COLUMN_HEADERS,
  STAGE_RESOURCE_ERROR_MESSAGE,
  STAGE_RESOURCE_TITLE,
  DESIGN_REVIEW_MODES,
} from '@/constants/modules/dnd/projectPlan'
import {
  TypeOfStageContainer,
  StageTypeLabel,
  StageTypePlaceholder,
  GridStyle,
} from '@/styles/components/modalStyles'
import DataGridTable, {
  renderEditDeleteCell,
} from '@/components/ui/data-grid-table/DataGridTable'
import {
  InputField,
  RichTextEditor,
  ButtonGroup,
  showActionAlert,
} from '@/components/ui'
import { useRoles, useUsers } from '@/hooks/modules/dnd/useFormTeam'
import { useListWorkflowEmployes } from '@/hooks/modules/hr/useEmployeeList'
import {
  useStageWiseListById,
  useStageWiseSubmit,
} from '@/hooks/modules/dnd/useProjectPlan'
import CommonModal from '../ui/common-modal/CommonModal'
import DesignReviewFormModal from '@/components/modules/dnd/project-plan/DesignReviewFormModal'
import { NUMBERMAP } from '@/constants/common'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { DesignReviewData } from '@/types/modules/dnd/projectPlan'
import ProjectDetailsLoader from '../modules/dnd/project-details/ProjectDetailsLoader'
const { DELETE_ALERT, SUCCESS_ALERT } = COMMON_CONSTANTS

interface StageResourcesFormProps {
  open: boolean
  onClose: () => void
  initialData?: any
  project_build_stage_order_id: number
  stagename:string
  hasEditPermission?: boolean
}

interface InputRow {
  id: string
  user: string
  role: string
  responsibility: string
}

const StageResourcesForm: React.FC<StageResourcesFormProps> = ({
  open,
  onClose,
  initialData,
  project_build_stage_order_id,
  stagename,
  hasEditPermission = true,
}) => {
  const { data: stageWiseList, refetch, isLoading: isStageWiseLoading, isFetching: isStageWiseFetching } = useStageWiseListById(
    project_build_stage_order_id
  )
  const { mutate: stageWiseSubmit } = useStageWiseSubmit()
  const [owner, setOwner] = useState(initialData?.owner ?? 0)
  const [input, setInput] = useState(initialData?.input ?? '')
  const [deliverables, setDeliverables] = useState(
    initialData?.deliverables ?? ''
  )
  const [description, setDescription] = useState(initialData?.description ?? '')
  const { data: roles, isLoading: isRolesLoading, isFetching: isRolesFetching } = useRoles()
  const { data: users, isLoading: isUsersLoading, isFetching: isUsersFetching } = useUsers()
  const { data: employees, refetch: refetchEmployees, isLoading: isEmployeesLoading, isFetching: isEmployeesFetching } = useListWorkflowEmployes(1, 'Approved')
  const [inputs, setInputs] = useState<InputRow[]>([])
  const INITIAL_ERRORS = {
    description: '',
    inputs: '',
    owner: '',
  }
  const [stageName, setStageName] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState(INITIAL_ERRORS)
  const [isDesignReviewFormModalOpen, setIsDesignReviewFormModalOpen] = useState(false)
  const [designReviewFormMode, setDesignReviewFormMode] = useState<typeof DESIGN_REVIEW_MODES.ADD | typeof DESIGN_REVIEW_MODES.EDIT>(DESIGN_REVIEW_MODES.ADD)
  const [editingDesignReviewData, setEditingDesignReviewData] = useState<DesignReviewData | null>(null)

  // Comprehensive loading state function
  const isLoading = () => {
    if (isStageWiseLoading) return true
    if (isStageWiseFetching) return true
    if (isRolesLoading) return true
    if (isRolesFetching) return true
    if (isUsersLoading) return true
    if (isUsersFetching) return true
    if (isEmployeesLoading) return true
    if (isEmployeesFetching) return true
    return false
  }

  useEffect(() => {
    setStageName('')
    setOwner(0)
    setInput('')
    setDescription('')
    setDeliverables('')
    if (Number(project_build_stage_order_id)) {
      refetch()
    }
    refetchEmployees()
  }, [project_build_stage_order_id, refetchEmployees])

  const loadStageData = () => {
    if (stageWiseList?.data) {
      const stageData = stageWiseList.data.result?.[NUMBERMAP.ZERO]
      if (stageData) {
        setInput(stageData.inputs ?? '')
        setDescription(stageData.description ?? '')
        setDeliverables(stageData.deliverables ?? '')
        setOwner(stageData.owner_id ?? 0)
        setStageName(`${stageData.stage_name ?? ''} ${stageData.stage_number ?? ''}`)
      }

      const formattedInputs =
        stageWiseList.data.design_review_team?.map((item: any) => ({
          id: item.id,
          user: item.user_id?.toString() ?? '',
          role: item.role_id?.toString() ?? '',
          responsibility: item.responsibility ?? '',
        })) ?? []
      setInputs(formattedInputs)
    }
  }

  useEffect(() => {
    loadStageData()
  }, [stageWiseList])

  const handleEditRow = (row: InputRow) => {
    setEditingDesignReviewData(row)
    setDesignReviewFormMode(DESIGN_REVIEW_MODES.EDIT)
    setIsDesignReviewFormModalOpen(true)
  }

  const handleDeleteRow = (id: string) => {
    if(!hasEditPermission) return
    showActionAlert(DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        setInputs(
          inputs.filter((row) => {
            if (String(row.id) !== id) {
              return true
            }
            return false
          })
        )
      }
    })
  }

  const handleAddDesignReview = () => {
    setEditingDesignReviewData(null)
    setDesignReviewFormMode(DESIGN_REVIEW_MODES.ADD)
    setIsDesignReviewFormModalOpen(true)
  }

  const handleSaveDesignReview = (data: DesignReviewData) => {
    if (designReviewFormMode === DESIGN_REVIEW_MODES.EDIT && editingDesignReviewData) {
      setInputs(
        inputs.map((row) =>
          row.id === editingDesignReviewData.id
            ? {
                ...row,
                ...data,
              }
            : row
        )
      )
    } else {
      const newRow = {
        id: `input-${Date.now()}`,
        ...data,
      }
      setInputs([...inputs, newRow])
    }
  }


  const columns = [
    {
      field: STAGE_RESOURCE_COLUMN_HEADERS.USER_FIELD,
      headerName: STAGE_RESOURCE_COLUMN_HEADERS.USER_HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        return params.value
          ? (users.data.find((user: any) => user.id == params.value)
              ?.firstName ?? params.value)
          : ''
      },
    },
    {
      field: STAGE_FORM.ROLE,
      headerName: STAGE_RESOURCE_COLUMN_HEADERS.ROLE_HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        return params.value
          ? (roles.data.find((role: any) => role.role_id == params.value)
              ?.role_name ?? params.value)
          : ''
      },
    },
    {
      field: STAGE_RESOURCE_COLUMN_HEADERS.RESPONSIBILITY_FIELD,
      headerName: STAGE_FORM.RESPONSIBILITY,
      flex: NUMBERMAP.TWO,
      renderCell: (params: any) => params.value,
    },
    {
      field: STAGE_RESOURCE_COLUMN_HEADERS.ACTIONS_FIELD,
      headerName: STAGE_RESOURCE_COLUMN_HEADERS.ACTIONS_HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) =>
        renderEditDeleteCell(params, handleEditRow, handleDeleteRow),
    },
  ]

  const handleCloseStageResource = () => {
    // Restore original data from API
    loadStageData()
    
    setErrorMessage(INITIAL_ERRORS)
    setIsDesignReviewFormModalOpen(false)
    setEditingDesignReviewData(null)
    onClose()
  }
  const handleSubmit = () => {
    let hasError = false

    if (!owner) {
      setErrorMessage((prev) => ({
        ...prev,
        owner: STAGE_RESOURCE_ERROR_MESSAGE.OWNER,
      }))
      hasError = true
    }

    if (!description) {
      setErrorMessage((prev) => ({
        ...prev,
        description: STAGE_RESOURCE_ERROR_MESSAGE.DESCRIPTION,
      }))
      hasError = true
    }

    if (!input) {
      setErrorMessage((prev) => ({
        ...prev,
        inputs: STAGE_RESOURCE_ERROR_MESSAGE.INPUT,
      }))
      hasError = true
    }

    if (hasError) {
      return
    }

    const design_review_team = inputs.map((input) => ({
      user_id: parseInt(input.user),
      role_id: parseInt(input.role),
      responsibility: input.responsibility,
    }))

    const payload = {
      stageName,
      project_build_stage_order_id,
      input,
      owner_id: Number(owner),
      description,
      deliverables,
      design_review_team,
    }

    stageWiseSubmit(payload, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT)
        refetch()
      },
    })
    handleCloseStageResource()
  }

  return (
    <CommonModal
      title={STAGE_RESOURCE_TITLE}
      open={open}
      onClose={handleCloseStageResource}
    >
      <ProjectDetailsLoader loading={isLoading()} />
          <Grid2 container spacing={NUMBERMAP.ONE} sx={GridStyle}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <TypeOfStageContainer>
                <StageTypeLabel>Name of the Stage</StageTypeLabel>
                <StageTypePlaceholder>{stagename??stageName}</StageTypePlaceholder>
              </TypeOfStageContainer>
              <Grid2 size={NUMBERMAP.TWELVE}></Grid2>
              <InputField
                label={STAGE_FORM.OWNER}
                placeholder={STAGE_FORM.OWNER_PLACEHOLDER}
                isDropdown={true}
                value={owner}
                hasEditable={!hasEditPermission}
                onChange={(value: string) => {
                  setOwner(value)
                  setErrorMessage({
                    ...errorMessage,
                    owner: '',
                  })
                }}
                error={errorMessage?.owner ?? ''}
                options={employees?.data ?? []}
                keyField={STAGE_FORM.USER_KEY}
                valueField={STAGE_FORM.EMPLOYEE_NAME}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <RichTextEditor
                label={STAGE_FORM.DELIVERABLES}
                value={deliverables}
                onChange={setDeliverables}
                placeholder={STAGE_FORM.DESCRIPTION_PLACEHOLDER}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <RichTextEditor
                label={STAGE_FORM.DESCRIPTION}
                value={description}
                onChange={(value: string) => {
                  setDescription(value)
                  setErrorMessage({
                    ...errorMessage,
                    description: '',
                  })
                }}
                error={errorMessage?.description ?? ''}
                placeholder={STAGE_FORM.DESCRIPTION_PLACEHOLDER}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <RichTextEditor
                label={STAGE_FORM.INPUTS}
                value={input}
                onChange={(value: string) => {
                  setInput(value)
                  setErrorMessage({
                    ...errorMessage,
                    inputs: '',
                  })
                }}
                placeholder={STAGE_FORM.INPUT_DESCRIPTION}
                error={errorMessage?.inputs ?? ''}
                disabled={!hasEditPermission}
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.TWELVE}>
              <DataGridTable
                title={STAGE_FORM.DATA_TABLE_TITLE}
                columns={columns}
                rows={inputs}
                onAddRow={handleAddDesignReview}
                onEditRow={handleEditRow}
                onDeleteRow={handleDeleteRow}
                onRowChange={(newRow) =>
                  setInputs(
                    inputs.map((row) => (row.id === newRow.id ? newRow : row))
                  )
                }
                showAddButton={true}
                autoHeight={true}
                hideFooter={true}
                idField={STAGE_FORM.KEY_FIELD}
              />
            </Grid2>
          </Grid2>
      <Grid2 container spacing={NUMBERMAP.ONE}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <ButtonGroup
            buttons={[
              { label: PROJECT_BUTTONS.CANCEL, onClick: handleCloseStageResource },
              { label: PROJECT_BUTTONS.SAVE, onClick: handleSubmit, disabled: !hasEditPermission},
            ]}
          />
        </Grid2>
      </Grid2>
      
      <DesignReviewFormModal
        open={isDesignReviewFormModalOpen}
        onClose={() => setIsDesignReviewFormModalOpen(false)}
        onSave={handleSaveDesignReview}
        editingData={editingDesignReviewData}
        mode={designReviewFormMode as 'add' | 'edit'}
        hasEditPermission={hasEditPermission}
      />
    </CommonModal>
  )
}
export default StageResourcesForm