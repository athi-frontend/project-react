'use client'
import React from 'react'
import { useAllVendorAgreementChecklists } from '@/hooks/modules/vendor-management/useVendorAgreementChecklist'
import { DataTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { PageContainer, UnderLine } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { VENDOR_AGREEMENT_CHECKLIST_ID_FIELD, VENDOR_AGREEMENT_CHECKLIST_TABLE } from '@/constants/modules/purchase/recordGeneration'
import Link from 'next/link'

/**
 *Classification : Confidential
 **/

const VendorAgreementChecklistTable: React.FC<{ title: string; pathName: string }> = ({
  title,
  pathName,
}) => {
  const { data: vendorAgreementChecklists, isLoading } = useAllVendorAgreementChecklists(NUMBERMAP.ONE, true)


  const columns = [
    {
      field: VENDOR_AGREEMENT_CHECKLIST_TABLE.TABLE_COLUMNS.SERIAL_NO,
      headerName: VENDOR_AGREEMENT_CHECKLIST_TABLE.TABLE_HEADERS.SERIAL_NO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: VENDOR_AGREEMENT_CHECKLIST_TABLE.TABLE_COLUMNS.VENDOR_NAME,
      headerName: VENDOR_AGREEMENT_CHECKLIST_TABLE.TABLE_HEADERS.VENDOR_NAME,
      flex: NUMBERMAP.ONE,
    },
    {
      field: VENDOR_AGREEMENT_CHECKLIST_TABLE.TABLE_COLUMNS.ACTION,
      headerName: VENDOR_AGREEMENT_CHECKLIST_TABLE.TABLE_HEADERS.VIEW,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link href={`${pathName}/${params.row.vendor_agreement_checklist_id}`} style={UnderLine}>
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
            IdField={VENDOR_AGREEMENT_CHECKLIST_ID_FIELD}
            rows={vendorAgreementChecklists?.data ?? []}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default VendorAgreementChecklistTable

