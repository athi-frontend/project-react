import React from 'react'
import {
  RowContainer,
  ActionCell,
  Cell,
} from '@/styles/components/ui/commonTable'
import { TableRowComponentProps } from '@/types/modules/dnd/formTeam'
import { Tooltip, Typography } from '@mui/material'
import { NUMBERMAP } from '@/constants/common'
const TableRowComponent: React.FC<TableRowComponentProps> = ({
  data,
  headers,
}) => {
  return (
    <RowContainer>
      {headers.map((header, index) => (
        <Cell as={'div'} key={data[header.field]}>
          {header.field === 'action' ? (
            <ActionCell>{header.action ?? null}</ActionCell>
          ) : (
            <Tooltip
              title={data[header.field].length > NUMBERMAP.TWENTY ? data[header.field] : ''}
              arrow
            >
              <Typography noWrap>
                {data[header.field].length > NUMBERMAP.TWENTY
                  ? `${data[header.field].substring(0, NUMBERMAP.TWENTY)}...`
                  : data[header.field]}
              </Typography>
            </Tooltip>
          )}
        </Cell>
      ))}
    </RowContainer>
  )
}

export default TableRowComponent
