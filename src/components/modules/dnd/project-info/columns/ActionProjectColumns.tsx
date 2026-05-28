'use client'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { IconButton, useTheme } from '@mui/material'
import { Edit, Trash } from 'iconsax-react'
import { useRouter } from 'next/navigation'
import {
  PROJECT_TABLE_COLUMNS,
  TABLE_HEADERS,
  ALERT_MESSAGES,
} from '@/constants/modules/dnd/project'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { showActionAlert } from '@/components/ui'
import { useDeleteProject } from '@/hooks/modules/dnd/useProject'
import { commonProjectColumns } from './CommonColumns'
import { ProjectRow } from '@/types/modules/dnd/project'
import { NUMBERMAP } from '@/constants/common'

const { IN_ACTIVE_STATUS } = COMMON_CONSTANTS

export const useActionProjectColumns = (): GridColDef[] => {
  const theme = useTheme()
  const { mutate: deleteProject } = useDeleteProject()
  const router = useRouter()

  const handleDelete = async (row: ProjectRow) => {
    const isDelete = await showActionAlert(ALERT_MESSAGES.DELETE)
    if (isDelete.isConfirmed) {
      try {
        deleteProject(row.project_id)
      } catch (e) {
        console.error(e)
        showActionAlert(ALERT_MESSAGES.DENIED)
      }
    }
  }

  return [
    ...commonProjectColumns(),
    {
      field: PROJECT_TABLE_COLUMNS.ACTION,
      headerName: TABLE_HEADERS.ACTION,
      flex:NUMBERMAP.HALF,
      disableColumnMenu:false,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div key={params.id}>
           <IconButton
            aria-label="edit"
            onClick={() =>
              router.push(
                `${params.row.project_id}`
              )
            }
            disabled={params.row.status === IN_ACTIVE_STATUS}
          >
            <Edit
              size={NUMBERMAP.EIGHTEEN}
              color={
                params.row.status === IN_ACTIVE_STATUS
                  ? theme.palette.text.secondary
                  : theme.palette.primary.main
              }
            />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row)}
            disabled={params.row.status === IN_ACTIVE_STATUS}
          >
            <Trash
              size={NUMBERMAP.EIGHTEEN}
              color={
                params.row.status === IN_ACTIVE_STATUS
                  ? theme.palette.text.secondary
                  : theme.palette.error.main
              }
            />
          </IconButton>
        </div>
      ),
    },
  ]
}
