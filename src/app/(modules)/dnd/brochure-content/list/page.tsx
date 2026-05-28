'use client'
import React from 'react'
import { DataGridTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { PageContainer } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'

const columns = [
  { field: 'sno', headerName: 'S.No', flex: NUMBERMAP.HALF },
  { field: 'versionNumber', headerName: 'Version Number', flex: NUMBERMAP.ONE },
  { field: 'createdDate', headerName: 'Created Date', flex: NUMBERMAP.ONE },
  { field: 'status', headerName: 'Status', flex: NUMBERMAP.ONE },
  {
    field: 'action',
    headerName: 'Action',
    flex: NUMBERMAP.ONE,
  },
]

const BrochureContent: React.FC = () => {
  return (
    <PageContainer>
      <CommonSharedTale
        title={"View Brochure Content"}
        pathName={"/dnd/brochure-content/brochure/create"}
        Table={
          <DataGridTable
            rows={[]}
            columns={columns}
            idField="id"
          />
        }
      />
    </PageContainer>
  )
}

export default BrochureContent
