'use client'
import { BUTTON_LABELS, ROUTE_PATHS } from '@/constants/modules/dnd/project'
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add'
import { ProjectTable } from '@/components/modules/dnd/project-info/ProjectTable'
import { useActionProjectColumns } from '@/components/modules/dnd/project-info/columns/ActionProjectColumns'
import { KEY } from '@/constants/common'
import { handleRemoveSessionData } from '@/lib/utils/common'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { UnderLine } from '@/styles/common'
import { useRouter } from 'next/navigation'
 
const { CREATE_PROJECT } = ROUTE_PATHS
 
export default function EditableListPage() {
  const columns = useActionProjectColumns()
  const router = useRouter()
  handleRemoveSessionData(KEY)
  return (
    <ProjectTable
      columns={columns.map((col)=>{
        if(col.field === "project_id"){
          return {
            ...col,
            renderCell: (params: GridRenderCellParams) => (
              <Link href={`/project-details/info/${params.row.project_id}`} style={UnderLine}>
                {params.value}
              </Link>
            ),
          }
        }
        return col
      })}
      actionButtons={[
        {
          label: BUTTON_LABELS.CREATE_PROJECT,
          icon: <AddIcon />,
          onClick: () => {router.push(CREATE_PROJECT)},
        },
      ]}
    />
  )
}