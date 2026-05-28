import React from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Typography, IconButton, Box, Theme } from '@mui/material'
import { Download } from '@mui/icons-material'
import { Edit, Trash } from 'iconsax-react'
import { NUMBERMAP } from '@/constants/common'
import {
  COLUMN_HEADERS,
  COLUMN_FIELDS,
  FILE_STATUS,
} from '@/constants/components/ui/fileUpload'
import {
  ActionButtonsContainer,
  STYLES,
  DownloadIconSx,
} from '@/styles/components/ui/fileUploadManagerV3'

interface FileTableColumnsOptions {
  categoryList?: { data?: Array<{ category_id: number; file_category: string }> }
  onDownload: (row: any) => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  showDelete?: boolean
  downloadIconSx?: typeof DownloadIconSx
  useSmallSize?: boolean
  theme: Theme
}

const createNameColumn = (): GridColDef => ({
  field: COLUMN_FIELDS.NAME,
  headerName: COLUMN_HEADERS.FILE_NAME,
  flex: NUMBERMAP.ONE_HALF,
})

const createSourceColumn = (): GridColDef => ({
  field: COLUMN_FIELDS.SOURCE,
  headerName: COLUMN_HEADERS.SOURCE,
  flex: NUMBERMAP.ONE,
})

const createUploadDateColumn = (): GridColDef => ({
  field: COLUMN_FIELDS.UPLOAD_DATE,
  headerName: COLUMN_HEADERS.DATE_OF_UPLOAD,
  flex: NUMBERMAP.ONE_HALF,
  renderCell: (params: GridRenderCellParams) => {
    if (params.row.uploadDate) {
      return params.row.uploadDate
    }
    return '-'
  },
})

const createCategoryColumn = (
  categoryList?: { data?: Array<{ category_id: number; file_category: string }> }
): GridColDef => ({
  field: COLUMN_FIELDS.CATEGORY_ID,
  headerName: COLUMN_HEADERS.FILE_CATEGORY,
  flex: NUMBERMAP.ONE,
  renderCell: (params: GridRenderCellParams) => {
    const category = categoryList?.data?.find(
      (cat: any) => cat.category_id === params.row.categoryId
    )
    return category?.file_category ?? ''
  },
})

const createStatusColumn = (): GridColDef => ({
  field: COLUMN_FIELDS.STATUS,
  headerName: COLUMN_HEADERS.FILE_STATUS,
  flex: NUMBERMAP.ONE,
  renderCell: (params: any) => (
    <ActionButtonsContainer>
      <Typography color="success.main">
        {Number(params.row.status) === NUMBERMAP.ONE
          ? FILE_STATUS.ACTIVE
          : FILE_STATUS.PENDING}
      </Typography>
    </ActionButtonsContainer>
  ),
})

const createActionsColumn = ({
  onDownload,
  onEdit,
  onDelete,
  showDelete,
  useSmallSize,
  theme,
  iconSize,
  downloadStyle,
  iconColor,
}: {
  onDownload: (row: any) => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  showDelete: boolean
  downloadIconSx: typeof DownloadIconSx
  useSmallSize: boolean
  theme: Theme
  iconSize: 'small' | 'medium' | 'large'
  downloadStyle: typeof DownloadIconSx
  iconColor?: 'primary'
}): GridColDef => ({
  field: COLUMN_FIELDS.ACTIONS,
  headerName: COLUMN_HEADERS.ACTIONS,
  flex: NUMBERMAP.ONE_HALF,
  renderCell: (params: any) => (
    <ActionButtonsContainer>
      <Box sx={STYLES.FLEX_GAP_16}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            onDownload(params.row)
          }}
          size={iconSize}
          color={iconColor}
          sx={downloadStyle}
        >
          <Download style={useSmallSize ? undefined : STYLES.FONTSIZE_24} />
        </IconButton>
        {onEdit && (
          <IconButton
            onClick={() => onEdit(params.row)}
            size={iconSize}
          >
            <Edit
              size={NUMBERMAP.EIGHTEEN}
              color={theme.palette.success.main}
            />
          </IconButton>
        )}
        {showDelete && onDelete && (
          <IconButton
            onClick={() => onDelete(params.row)}
            size={iconSize}
          >
            <Trash
              size={NUMBERMAP.EIGHTEEN}
              color={theme.palette.error.main}
            />
          </IconButton>
        )}
      </Box>
    </ActionButtonsContainer>
  ),
})

export const createFileTableColumns = ({
  categoryList,
  onDownload,
  onEdit,
  onDelete,
  showDelete = false,
  downloadIconSx = DownloadIconSx,
  useSmallSize = false,
  theme,
}: FileTableColumnsOptions): GridColDef[] => {
  const iconSize: 'small' | 'medium' | 'large' = useSmallSize ? 'small' : (STYLES.SIZE as 'small')
  const downloadStyle = useSmallSize ? downloadIconSx : { ...downloadIconSx, ...STYLES.FONTSIZE_24 }
  const iconColor = useSmallSize ? undefined : (STYLES.colour as 'primary')

  return [
    createNameColumn(),
    createSourceColumn(),
    createUploadDateColumn(),
    createCategoryColumn(categoryList),
    createStatusColumn(),
    createActionsColumn({
      onDownload,
      onEdit,
      onDelete,
      showDelete,
      downloadIconSx,
      useSmallSize,
      theme,
      iconSize,
      downloadStyle,
      iconColor,
    }),
  ]
}

