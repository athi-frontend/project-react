import React from 'react'
import { PageContainer, UnderLine } from '@/styles/common'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { DataTable } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import Link from 'next/link'
import { useAllIncomingInspection } from '@/hooks/modules/quality-control-management/useIncomingInspection'
import { TABLE_CONSTANTS } from '@/constants/modules/quality-control-management/recordGeneration'

/**
 * Classification: confidential
 */

const IncomingInspectionTable: React.FC<{
  title: string
  pathName: string
}> = ({ title, pathName }) => {
  const {
    data: incomingInspectionResponse,
    isLoading,
  } = useAllIncomingInspection(NUMBERMAP.ONE, 'approved')

  const incomingInspectionList = incomingInspectionResponse?.data ?? []
  
  const columns = [
    {
      field: TABLE_CONSTANTS.COMMON.SNO_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.SNO_HEADER,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_CONSTANTS.INCOMING_INSPECTION.PO_FIELD,
      headerName: TABLE_CONSTANTS.INCOMING_INSPECTION.PO_HEADER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: TABLE_CONSTANTS.INCOMING_INSPECTION.PART_NUMBER_FIELD,
      headerName: TABLE_CONSTANTS.INCOMING_INSPECTION.PART_NO_HEADER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: TABLE_CONSTANTS.COMMON.ACTION_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.VIEW_HEADER,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link
          href={`${pathName}/${params.row[TABLE_CONSTANTS.INCOMING_INSPECTION.ID_FIELD]}`}
          style={UnderLine}
        >
          {TABLE_CONSTANTS.COMMON.HYPERLINK_TEXT}
        </Link>
      ),
    },
  ]
  
  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <CommonSharedTale
        title={title}
        Table={
          <DataTable
            IdField={TABLE_CONSTANTS.INCOMING_INSPECTION.ID_FIELD}
            rows={incomingInspectionList}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default IncomingInspectionTable


