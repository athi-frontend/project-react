'use client'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {
  PROJECT_TABLE_COLUMNS,
  TABLE_HEADERS,
  ROUTE_PATHS,
  PROJECT_SUB_STATUS_KEYWORDS,
  PROJECT_SUB_STATUS_DISPLAY,
} from '@/constants/modules/dnd/project'
import Link from 'next/link'
import { UnderLine } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { Tooltip, useTheme } from '@mui/material'

const { PROJECT_INFO } = ROUTE_PATHS

export const commonProjectColumns = (): GridColDef[] => {
  const theme = useTheme()

  const getSubStatusColor = (value?: string) => {
    if (!value) {
      return theme.palette.warning.main
    }

  const normalizedValue = value.toLowerCase()
  if (normalizedValue.includes(PROJECT_SUB_STATUS_KEYWORDS.APPROVED)) {
    return theme.palette.success.main
  }
  if (normalizedValue.includes(PROJECT_SUB_STATUS_KEYWORDS.REJECTED)) {
    return theme.palette.error.main
  }

  return theme.palette.warning.main
}

  return [
    {
      field: PROJECT_TABLE_COLUMNS.SERIAL_NO,
      headerName: TABLE_HEADERS.SERIAL_NO,
      flex: NUMBERMAP.HALF,
      sortable: false,
    },
    {
      field: PROJECT_TABLE_COLUMNS.PROJECT_ID,
      headerName: TABLE_HEADERS.PROJECT_ID,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`${PROJECT_INFO}/${params.row.project_id}`}
          style={UnderLine}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: PROJECT_TABLE_COLUMNS.PRODUCT_NAME,
      headerName: TABLE_HEADERS.PRODUCT_NAME,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PROJECT_TABLE_COLUMNS.PRODUCT_CATEGORY,
      headerName: TABLE_HEADERS.PRODUCT_CATEGORY,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PROJECT_TABLE_COLUMNS.PRODUCT_TYPE,
      headerName: TABLE_HEADERS.PRODUCT_TYPE,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PROJECT_TABLE_COLUMNS.PRODUCT_SUBTYPE,
      headerName: TABLE_HEADERS.PRODUCT_SUBTYPE,
      flex: NUMBERMAP.ONE,
    },
    {
      field: PROJECT_TABLE_COLUMNS.STATUS,
      headerName: TABLE_HEADERS.STATUS,
      flex: NUMBERMAP.HALF,
      sortable: false,
    },
    {
      field: PROJECT_TABLE_COLUMNS.SUB_STATUS,
      headerName: TABLE_HEADERS.SUB_STATUS,
      flex: NUMBERMAP.HALF,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const value = (params.value as string) || ''
        const displayValue = value || PROJECT_SUB_STATUS_DISPLAY.EMPTY
        const color = getSubStatusColor(value)

        return (
          <Tooltip title={displayValue}>
            <span style={{ color }}>{displayValue}</span>
          </Tooltip>
        )
      },
    },
  ]
}
