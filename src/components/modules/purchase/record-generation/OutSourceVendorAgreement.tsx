'use client'
import React from 'react'
import { useAllVendors } from '@/hooks/modules/vendor-management/useVendorList'
import { DataTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { PageContainer, UnderLine } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { OUTSOURCE_VENDOR_AGREEMENT_TABLE } from '@/constants/modules/purchase/recordGeneration'
import Link from 'next/link'

/**
 *Classification : Confidential
 **/

const OutSourceVendorAgreementTable: React.FC<{ title: string; pathName: string }> = ({
  title,
  pathName,
}) => {
  const { data: vendors } = useAllVendors()


  const columns = [
    {
      field: OUTSOURCE_VENDOR_AGREEMENT_TABLE.TABLE_COLUMNS.SERIAL_NO,
      headerName: OUTSOURCE_VENDOR_AGREEMENT_TABLE.TABLE_HEADERS.SERIAL_NO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: OUTSOURCE_VENDOR_AGREEMENT_TABLE.TABLE_COLUMNS.VENDOR_NAME,
      headerName: OUTSOURCE_VENDOR_AGREEMENT_TABLE.TABLE_HEADERS.VENDOR_NAME,
      flex: NUMBERMAP.ONE,
    },
    {
      field: OUTSOURCE_VENDOR_AGREEMENT_TABLE.TABLE_COLUMNS.ACTION,
      headerName: OUTSOURCE_VENDOR_AGREEMENT_TABLE.TABLE_HEADERS.VIEW,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link href={`${pathName}/${params.row[OUTSOURCE_VENDOR_AGREEMENT_TABLE.ID_FIELD]}`} style={UnderLine}>
          Hyperlink
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
            IdField={OUTSOURCE_VENDOR_AGREEMENT_TABLE.ID_FIELD}
            rows={vendors?.data ?? []}
            columns={columns}
          />
        }
      />
    </PageContainer>
  )
}

export default OutSourceVendorAgreementTable

