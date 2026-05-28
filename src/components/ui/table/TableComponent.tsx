'use client'
import React from 'react'
import { Box } from '@mui/material'
import TableRowComponent from './TableRowComponent'
import { TableComponentProps } from '@/types/modules/dnd/formTeam'
import {
  TableContainer,
  TableHeader,
  HeaderCell,
} from '@/styles/components/ui/table'

const TableComponent: React.FC<TableComponentProps> = ({ data, headers }) => {
  return (
    <TableContainer>
      <TableHeader>
        {headers.map((item, index) => (
          <HeaderCell
            key={item.headerName}
            sx={{ width: index === headers.length - 1 ? '130px' : '150px' }}
          >
            {item.headerName}
          </HeaderCell>
        ))}
      </TableHeader>
      <Box display="flex" flexDirection="column" width="100%">
        {data.map((rowData, index) => (
          <TableRowComponent
            key={rowData.id ?? index}
            data={rowData}
            headers={headers}
          />
        ))}
      </Box>
    </TableContainer>
  )
}

export default TableComponent
