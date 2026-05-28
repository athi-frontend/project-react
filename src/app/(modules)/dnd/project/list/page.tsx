'use client'
import { commonProjectColumns } from '@/components/modules/dnd/project-info/columns/CommonColumns'
import { ProjectTable } from '@/components/modules/dnd/project-info/ProjectTable'
import { KEY, KEY_VALUE } from '@/constants/common'
import { handleStoreSessionData } from '@/lib/utils/common'

export default function SimpleListPage() {
handleStoreSessionData(KEY, KEY_VALUE)
  return <ProjectTable columns={commonProjectColumns()} />
}
