'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import { ButtonGroup, Label } from '@/components/ui'
import { TableContainer, headerContainerSx, headerGridSx, addIconSx } from '@/styles/common'
import Link from 'next/link'
import { NUMBERMAP, ADD_NEW, CURRENT_COLOR } from '@/constants/common'
import { Add } from 'iconsax-react'

interface TableProps {
  Table: React.ReactNode
  pathName?: string
  title: string
  hanldeClick?: () => void
}

const CommonSharedTale: React.FC<TableProps> = ({
  Table,
  pathName,
  title,
  hanldeClick,
}) => {
  return (
    <TableContainer>
      <Grid2 container spacing={2} sx={headerContainerSx}>
        <Grid2 size={NUMBERMAP.SIX}>
          <Label title={title} />
        </Grid2>
        <Grid2
          size={NUMBERMAP.SIX}
          sx={headerGridSx}
        >
          {pathName && (
            <Link href={pathName ?? '#'}>
              <ButtonGroup
                buttons={[
                  {
                     label: ( <> <Add size={NUMBERMAP.TWENTY} color={CURRENT_COLOR} style={addIconSx as React.CSSProperties} /> {ADD_NEW}</> ),
                    onClick: hanldeClick,
                  },
                ]}
              />
            </Link>
          )}
        </Grid2>
      </Grid2>
      {Table}
    </TableContainer>
  )
}

export default CommonSharedTale
