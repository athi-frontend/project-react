import { GridColDef } from '@mui/x-data-grid'
import { NUMBERMAP } from './common'

export const DESIGN_TEAM_COLUMNS: GridColDef[] = [
  { field: 'role_name', headerName: 'Role',flex : NUMBERMAP.ONE },
  { field: 'user_name', headerName: 'Resource',flex : NUMBERMAP.ONE },
  { field: 'responsibility', headerName: 'Responsibility',flex : NUMBERMAP.ONE },
  { field: 'stage_name', headerName: 'Stage',flex : NUMBERMAP.ONE },
  { field: 'actions', headerName: 'Actions',width: NUMBERMAP.ONEFIFTY  },
]

export const DEFAULT_TITLE = 'Design Team'
export const ERROR_FALLBACK_MESSAGE = 'An error occurred'
export const STAGE_FIELD = 'stage'
export const ERROR_COLOR = 'error'
export const ACTIONS_FIELD = 'actions'
export const KEY_FIELD = 'id'
