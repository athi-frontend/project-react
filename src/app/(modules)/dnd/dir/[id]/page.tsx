'use client'
import React from 'react'
import { HeaderTitle } from '@/styles/components/ui/label'
import { useDIRList } from '@/hooks/modules/dnd/useDir'
import { DIR_COLUMNS } from '@/lib/modules/dnd/dir'
import { ID_FIELD } from '@/constants/modules/dnd/dirList'
import { 
  ROUTES, 
  PAGE_TITLES, 
  TABLE_FIELDS, 
  TABLE_HEADERS, 
  STATUS_LABELS,
  TABLE_CONFIG
} from '@/constants/modules/dnd/dir'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { ActionButton, DataTable } from '@/components/ui'
import { TableContainer } from '@/styles/common'
import { useParams, useRouter } from 'next/navigation'
import { NUMBERMAP } from '@/constants/common'
import { CommentsHistoryContainer, InlineStyles } from '@/styles/modules/dnd/dir'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { Grid2 } from '@mui/material'
import { BUTTONSTYLE } from '@/constants/modules/dnd/digSpecificaton'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import GlobalLoader from '@/components/shared/LoadingSpinner'

/**
 Classification : Confidential
**/
interface RowData {
  design_input_requirement_id: number
  status: number
}

// Inline styles moved to the top


const CustomDataTableExample: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id

  const { data: physicalData, isLoading: physicalLoading, isFetching } = useDIRList(
    Number(projectId)
  )
  
  const handleEdit = (id: number) => {
    /**
     * Function Name: handleEdit
     * Params: id
     * Description: use to navigate edit page,
     * Author: Prithiviraj,
     * Created: 23-08-2025,
     * Classification : Confidential
    **/
    router.push(`${ROUTES.DIR_INFO}/${id}/${projectId}`)
  }

  const columns = [
    ...DIR_COLUMNS.map((col) =>
      col.field === TABLE_FIELDS.STATUS
        ? {
            ...col,
            renderCell: (params: GridRenderCellParams<RowData>) => (
              <span
                style={
                  params.value === NUMBERMAP.ONE
                    ? InlineStyles.statusActive
                    : InlineStyles.statusInactive
                }
              >
                {params.value === NUMBERMAP.ONE ? STATUS_LABELS.ACTIVE : STATUS_LABELS.INACTIVE}
              </span>
            ),
          }
        : col
    ),
    {
      field: TABLE_FIELDS.ACTIONS,
      headerName: TABLE_HEADERS.ACTIONS,
      width: NUMBERMAP.TWOHUNDRED,
      sortable: false,
      renderCell: (params: GridRenderCellParams<RowData>) => (
        <ActionButton onEdit={() => handleEdit(params.row[ID_FIELD])}/>
      ),
    },
  ]

  return (
    <TableContainer>
      <GlobalLoader loading={isFetching} />
      {physicalData && (
        <>
      <Grid2>
      <HeaderTitle>{PAGE_TITLES.DIR}</HeaderTitle>
      <DataTable
        IdField={ID_FIELD}
        rows={physicalData?.data ?? []}
        columns={columns}
        checkbox={TABLE_CONFIG.CHECKBOX}
        loading={physicalLoading}
      />
      </Grid2>
      <CommentsHistoryContainer>
        <CommentsHistory
          comments={physicalData?.meta_info?.task_info?.task_comments}
        />
      </CommentsHistoryContainer>
      <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
        <ReviewerModalManager
          isLoading={physicalLoading}
          permissions={physicalData?.meta_info?.action_control?.permissions ?? []}
          projectId={projectId}
          menuId={physicalData?.meta_info?.action_control?.menuId}
          menuName={physicalData?.meta_info?.action_control?.formName}
          onPermissionChange={() => {}}
          customHandlers={{
                          handleCancel: () => { router.push(ROUTE_PATHS.DND_PROJECT_LIST)}}
          }
          reviewerList={physicalData?.meta_info?.task_info?.reviewer_list}
          hideSaveButton={true}
        />
        </Grid2>
        </>)}
    </TableContainer>
  )
}

export default CustomDataTableExample
