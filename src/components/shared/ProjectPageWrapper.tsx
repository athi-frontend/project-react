'use client'
import Link from 'next/link'
import { ProjectTable } from '@/components/modules/dnd/project-info/ProjectTable'
import { useActionProjectColumns } from '@/components/modules/dnd/project-info/columns/ActionProjectColumns'
import { KEY } from '@/constants/common'
import { handleRemoveSessionData } from '@/lib/utils/common'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { UnderLine } from '@/styles/common'

const HildeFields = ['Status', 'Sub Status', 'Action']

interface ProjectPageWrapperProps {
  readonly basePath: string
}

export default function ProjectPageWrapper({ basePath }: ProjectPageWrapperProps) {
  const columns = useActionProjectColumns()
  handleRemoveSessionData(KEY)

  return (
    <ProjectTable
      columns={columns
        .map((col) =>
          col.field === 'project_id'
            ? {
                ...col,
                renderCell: (params: GridRenderCellParams) => (
                  <Link href={`${basePath}/${params.row.project_id}`} style={UnderLine}>
                    {params.value}
                  </Link>
                ),
              }
            : col
        )
        .filter((cols) => !HildeFields.includes(cols.headerName))}
    />
  )
}
