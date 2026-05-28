'use client'
import CommonSharedTable from '@/components/shared/CommonPageTable'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import {
  useDeleteInstallation,
  useGetInstallationList,
} from '@/hooks/modules/dnd/useInstallationProcedure'
import { PageContainer } from '@/styles/common'
import { useParams, useRouter } from 'next/navigation'
import { GridRenderCellParams } from '@mui/x-data-grid'
import {
  ACTIONS_VALUE,
  CREATE_PATH,
  EDIT_INSTALLATION_URL,
  FORM_TITLE,
  HEADER_ACTIONS,
  HEADER_SNO,
  HEADER_STATUS,
  HEADER_STEP_NO,
  HEADER_TYPE,
  INSTALLATION_ID,
  SNO_VALUE,
  STATUS_VALUE,
  STEP_NO_VALUE,
  TYPE_VALUE,
} from '@/constants/modules/dnd/installation'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import { BUTTONSTYLE, NUMBERMAP } from '@/constants/common'
import {
  DELETE_ALERT,
  FAILED_ALERT,
  SUCCESS_ALERT,
} from '@/constants/modules/dnd/formTeam'
import { useEffect, useState } from 'react'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { CommentsHistoryContainer } from '@/styles/components/modules/taskSchedule'
import { Grid2 } from '@mui/material'
import GlobalLoader from '@/components/shared/LoadingSpinner'

export default function SimpleListPage() {
  const params = useParams()
  const projectIdNum = params.id
    const router = useRouter()
   const project_id = params.id

  const { data: installationResponse, isLoading, isFetching, refetch: refetchTeams } =
    useGetInstallationList(Number(projectIdNum))
    const { mutate: deleteMutation, isPending: isDeleting } = useDeleteInstallation() 
    const [hasEditPermission, setHasEditPermission] = useState(true)

    // Create loading function
    const isAnyLoading = () => {
      if (isLoading) return true;
      if (isFetching) return true;
      if (isDeleting) return true;
      return false;
    };
    
    useEffect(()=>{
    refetchTeams()
    },[refetchTeams])
  //Handle delete action
  const handleDelete = (installation_procedure_id: number): void => {
    if(!hasEditPermission) return;
    showActionAlert(DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        //   setIsDeleting(true)
        deleteMutation(installation_procedure_id, {
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
  const handleEdit = (row: any) => {
  router.push(EDIT_INSTALLATION_URL(project_id, row.installation_procedure_id));
}
  const pathName = CREATE_PATH(Number(project_id));
  const Columns = [
    {
      headerName: HEADER_SNO,
      field: SNO_VALUE,
      flex: NUMBERMAP.ONE,
    },
    {
      headerName: HEADER_STEP_NO,
      field: STEP_NO_VALUE,
      flex: NUMBERMAP.ONE,
    },
    {
      headerName: HEADER_TYPE,
      field: TYPE_VALUE,
      flex: NUMBERMAP.ONE,
    },
    {
      headerName: HEADER_STATUS,
      field: STATUS_VALUE,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        return (
          <StatusTypography value={params.value} />
        )
      },
    },
    {
      field: ACTIONS_VALUE,
      headerName: HEADER_ACTIONS,
      width: NUMBERMAP.ONEFIFTYFIVE,
      renderCell: (params: GridRenderCellParams) => {
        const isActive = params.row.status === NUMBERMAP.ONE

        return (
          <ActionButton
            onDelete={() => handleDelete(params.row.installation_procedure_id)}
            onEdit={() => handleEdit(params.row)}
            disabled={!isActive}
          />
        )
      },
      sortable: false,
      filterable: false,
    },
  ]

  return (
    <PageContainer>
      <GlobalLoader loading={isAnyLoading()} />
      {installationResponse && (
        <>
      <CommonSharedTable
        pathName={pathName}
        Table={
          <DataTable
            columns={Columns}
            rows={installationResponse?.data ?? []}
            IdField={INSTALLATION_ID}
            loading={isLoading}
          />
        }
        title={FORM_TITLE}
      />
      <CommentsHistoryContainer>
        <CommentsHistory 
          comments={installationResponse?.meta_info?.task_info?.task_comments} 
        />
      </CommentsHistoryContainer>
      <Grid2 sx={BUTTONSTYLE}>
      <ReviewerModalManager
        isLoading={isLoading}
        permissions={installationResponse?.meta_info?.action_control?.permissions ?? []}
        projectId={Number(projectIdNum)}
        menuId={installationResponse?.meta_info?.action_control?.menuId}
        menuName={installationResponse?.meta_info?.action_control?.formName}
        customHandlers={{ 
          handleCancel: () => {
            router.push(ROUTE_PATHS.DND_PROJECT_LIST)
          }
        }}
        hideSaveButton={true}
        onPermissionChange={setHasEditPermission}
        reviewerList={installationResponse?.meta_info?.task_info?.reviewer_list}
      />
      </Grid2>
      </>
      )}
    </PageContainer>
  )
}
