'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Typography, Box } from '@mui/material'
import { PageContainer } from '@/styles/common'
import { DataTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import {
    billOfMaterialColumns,
    BOM_CONSTANTS,
    FIELD_NAMES,
    PART_ID_FIELD,
} from '@/constants/modules/production/billOfMaterial'
import { useAllBillOfMaterials } from '@/hooks/modules/production/useBillOfMaterial'
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid'
import { 
    getStatusCellStyles,
    partCellContainer,
    settingsCellContainer,
} from '@/styles/modules/production/billOfMaterial'

/**
 * Classification: Confidential
 * Bill of Material List Page
 */

const BillOfMaterialList: React.FC = () => {
    const router = useRouter()
    const params = useParams()
    const projectId = params?.id ? Number(params.id) : undefined

    // Fetch bill of materials data
    const {
        data: billOfMaterialsResponse,
        isLoading,
    } = useAllBillOfMaterials(projectId)

    const renderPartCell = (params: GridRenderCellParams) => {
        return (
            <Box sx={partCellContainer}>
                <Typography
                    onClick={() => handlePartClick(params.row.assembly_parts_item_id)}
                    sx={getStatusCellStyles(params.row.status)}
                >
                    {params.value}
                </Typography>
            </Box>
        )
    }

    const renderSettingsCell = (params: GridRenderCellParams) => {
        return (
            <Box sx={settingsCellContainer}>
                <Typography
                    onClick={() => handleSettingsClick(params.row.part_item_detail_id)}
                    sx={getStatusCellStyles(params.row.status)}
                >
                    Settings
                </Typography>
            </Box>
        )
    }

    const handlePartClick = (assemblyPartsItemId: string | number) => {
        // Convert to number if it's a string (assembly_parts_item_id is string in type)
        const id = typeof assemblyPartsItemId === 'string'
            ? Number(assemblyPartsItemId)
            : assemblyPartsItemId
        router.push(`${BOM_CONSTANTS.PART_DETAILS_PATH}/${id}/${projectId}`)
    }

    const handleSettingsClick = (partItemDetailId: number) => {
        router.push(`${BOM_CONSTANTS.PART_SETTING_PATH}/${partItemDetailId}/${projectId}`)
    }

    const columns: GridColDef[] = [
        ...billOfMaterialColumns.map((col) =>
            col.field === FIELD_NAMES.PART_NAME
                ? {
                    ...col,
                    renderCell: renderPartCell,
                }
                : col
        ),
        {
            field: 'settings',
            headerName: FIELD_NAMES.SETTINGS,
            renderCell: renderSettingsCell,
            sortable: false,
        } as GridColDef,
    ]

    return (
        <PageContainer>
            <CommonSharedTale
                title={BOM_CONSTANTS.TITLE}
                Table={
                    <DataTable
                        rows={billOfMaterialsResponse?.data ?? []}
                        columns={columns}
                        IdField={PART_ID_FIELD.PART_ID}
                        loading={isLoading}
                    />
                }
            />
        </PageContainer>
    )
}

export default BillOfMaterialList