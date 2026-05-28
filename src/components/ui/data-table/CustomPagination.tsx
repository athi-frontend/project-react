import React from 'react'
import { Typography, Select, MenuItem, useTheme } from '@mui/material'
import { GridPaginationModel } from '@mui/x-data-grid'
import Pagination from '@mui/material/Pagination'
import {
  FooterContainer,
  PageSizeSelector,
  pageSizeSelectorStyles,
  selectStyles,
  paginationStyles,
} from '@/styles/components/ui/table'
import { NUMBERMAP } from '@/constants/common'

interface TableFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  paginationModel: GridPaginationModel
  onPaginationModelChange: (model: GridPaginationModel) => void
  totalRows: number
  serverPagination: boolean
}

const TableFooter: React.FC<TableFooterProps> = ({
  paginationModel,
  onPaginationModelChange,
  totalRows,
  serverPagination = true,
}) => {
  const theme = useTheme()
  const { page, pageSize } = paginationModel

  const totalPages = serverPagination
    ? totalRows
    : Math.ceil(totalRows / pageSize)

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    onPaginationModelChange({ ...paginationModel, page: newPage - 1 })
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    onPaginationModelChange({
      page: 0,
      pageSize: event.target.value as number,
    })
  }

  return (
    <FooterContainer>
      <PageSizeSelector
        sx={{
          ...pageSizeSelectorStyles,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography color={theme.palette.text.primary}>Show</Typography>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          sx={selectStyles}
          size="small"
          aria-label="Select page size"
        >
          {[NUMBERMAP.TEN, NUMBERMAP.TWENTY, NUMBERMAP.FIFTY].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </PageSizeSelector>

      <Pagination
        count={totalPages}
        shape="rounded"
        color="primary"
        page={page + 1}
        onChange={handlePageChange}
        sx={paginationStyles}
        aria-label="Table pagination"
      />
    </FooterContainer>
  )
}

export default TableFooter
