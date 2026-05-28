'use client'
import React from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { ProjectStyles, TableContainer } from '@/styles/components/ui/table'
import { DataTable } from '@/components/ui'
import { Grid2 } from '@mui/material'
import { API_PARAMS, LABELS, PROJECT_SEARCH_PLACEHOLDER } from '@/constants/modules/dnd/project'

import { useProjectListData } from '@/hooks/modules/dnd/useProject'
import { NUMBERMAP } from '@/constants/common'
import PageHeader from '@/components/ui/page-header/PageHeader'
import { ButtonProps } from '@/types/components/ui/button'

const { PROJECT_ID_DB } = API_PARAMS

interface ProjectTableProps {
  title?: string
  columns: GridColDef[]
  headerAction?: React.ReactNode
  actionButtons?: ButtonProps[]
}

export const ProjectTable = ({
  title = LABELS.LIST_PROJECT,
  columns,
  headerAction,
  actionButtons, 
}: ProjectTableProps) => {
  const { data: projects, isFetched } = useProjectListData(NUMBERMAP.ONE, NUMBERMAP.THOUSAND)
  const [searchValue, setSearchValue] = React.useState('')

  return (
    <TableContainer>
      <PageHeader
        title={title}
        showSearch={true}
        searchPlaceholder={PROJECT_SEARCH_PLACEHOLDER}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        actionButtons={actionButtons} 
      />
      <Grid2 container spacing={NUMBERMAP.TWO} sx={ProjectStyles.text}>
        <Grid2 size={NUMBERMAP.SIX}>
        </Grid2>
        <Grid2
          size={NUMBERMAP.SIX}
          sx={ProjectStyles.table}
        >
          {headerAction}
        </Grid2>
      </Grid2>
      <DataTable
        rows={projects.data}
        columns={columns}
        loading={!isFetched}
        IdField={PROJECT_ID_DB}
        checkbox={false}
        searchValue={searchValue}
      />
    </TableContainer>
  )
}
