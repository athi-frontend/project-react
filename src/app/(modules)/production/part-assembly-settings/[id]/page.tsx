'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { PageContainer, UnderLine } from '@/styles/common'
import { DataTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { NUMBERMAP } from '@/constants/common'
import { useBillOfMaterialList } from '@/hooks/modules/production/useCommonProductionDropDownHook';
import { GridRenderCellParams } from '@mui/x-data-grid'
import Link from 'next/link'

/**
 * Classification: Confidential
 * Bill of Material List Page
 */


const BillOfMaterialList: React.FC = () => {
  const PROJECT_ID = useParams().id
  const { data, isLoading } = useBillOfMaterialList(PROJECT_ID, true);
  const rows = data?.data ?? [];

  // Dynamic columns logic: show all keys except id/settings if rows exist, otherwise fallback
  const columns = [
    {
      field: 'sno',
      headerName: 'S.No',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'part_name',
      headerName: 'Part/Assembly',
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={params.row?.applicable_settings_id ? `/production/part-assembly-settings/${PROJECT_ID}/${params.row?.applicable_settings_id}` : '#'} style={UnderLine}>
          {params.value}
        </Link>
      ),
    },
    {
      field: 'part_type',
      headerName: 'Type',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'part_level',
      headerName: 'Level',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => params.row.part_level ?? '-',
    },
  ];


  return (
    <PageContainer>
      <CommonSharedTale
        title={'Assembly Settings'}
        Table={
          <DataTable
            rows={rows}
            columns={columns}
            IdField="part_id"
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default BillOfMaterialList
