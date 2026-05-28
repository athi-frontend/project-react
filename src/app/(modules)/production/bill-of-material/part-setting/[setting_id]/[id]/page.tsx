'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Checkbox, Grid2, Box } from '@mui/material'
import { DataTable, ButtonGroup, Label, showActionAlert } from '@/components/ui'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { PageContainer, P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import {
    PART_SETTING_LABELS,
    BUTTON_LABELS,
    configurationSettingsColumns,
    BOM_CONSTANTS,
} from '@/constants/modules/production/billOfMaterial'
import { GridRenderCellParams } from '@mui/x-data-grid'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import {
    usePartSettingDetail,
    useUpsertPartSetting,
} from '@/hooks/modules/production/useBillOfMaterial'
import {
    ConfigurationSetting,
    PartSettingUpsertRequest,
} from '@/types/modules/production/billOfMaterial'
import { FAILED_ALERT, SUCCESS_ALERT } from '@/constants/modules/dnd/formTeam'

/**
 * Classification: Confidential
 * Part Settings Detail Page
 */

const PartSettingPage: React.FC = () => {
    const router = useRouter()
    const params = useParams()
    const partItemDetailId = params.setting_id ? Number(params.setting_id) : undefined
    const projectId = params.id ? Number(params.id) : undefined
    // Fetch part setting detail data
    const {
        data: partSettingDetailResponse,
        isLoading,
    } = usePartSettingDetail(partItemDetailId)

    // Mutation hook for upsert
    const upsertMutation = useUpsertPartSetting()

    // Local state for configuration settings
    const [configurationSettings, setConfigurationSettings] = useState<
        ConfigurationSetting[]
    >([])

    // Draft save hook
    const partItemDetailIdForDraft = partItemDetailId
    const { 
        draftSave, 
        clearDraftSave, 
        isDraftSaving, 
        checkUnsavedDraftBeforeLeave 
    } = useDraftSave({
        context_type: "part_item_detail",
        context_instance_id: partItemDetailIdForDraft,
        enableFetch: false
    })

    // Helper to get data item (handles both array [{}] and object {} structures)
    const dataItem = useMemo(() => {
        if (!partSettingDetailResponse?.data) return null
        const data = partSettingDetailResponse.data
        // Check if data is an array
        if (Array.isArray(data)) {
            return data[NUMBERMAP.ZERO] ?? null
        }
        // Otherwise, data is an object
        return data
    }, [partSettingDetailResponse?.data])

    useEffect(() => {
        if (dataItem?.configuration_settings) {
            setConfigurationSettings(dataItem.configuration_settings)
        }
    }, [dataItem])


    // Draft save handler
    const handleDraftSave = useCallback((settingsToSave?: ConfigurationSetting[]) => {
        const settings = settingsToSave ?? configurationSettings
        const payload = {
            id: partItemDetailIdForDraft ?? new Date().getTime(),
            configuration_settings: settings,
            type: 'draft',
            product_id: dataItem?.product_id,
            product_name: dataItem?.product_name,
            assembly_part: dataItem?.assembly_part,
            part_code: dataItem?.part_code,
        }

        draftSave({
            form_data: payload,
        })
    }, [draftSave, partItemDetailIdForDraft, configurationSettings, dataItem])

    const handleCheckboxChange = (featureId: number, checked: boolean) => {
        setConfigurationSettings((prev) => {
            const updated = prev.map((setting) =>
                setting.feature_id == featureId
                    ? { ...setting, applicable: checked ? NUMBERMAP.ONE : NUMBERMAP.ZERO }
                    : setting
            )
            handleDraftSave(updated)
            return updated
        })
    }

    const renderCheckboxCell = (params: GridRenderCellParams) => {
        return (
            <Checkbox
                checked={params.value === NUMBERMAP.ONE}
                onChange={(e) => handleCheckboxChange(params.row.feature_id, e.target.checked)}
            />
        )
    }

    const columns = configurationSettingsColumns.map((col) =>
        col.field === 'applicable'
            ? {
                ...col,
                renderCell: renderCheckboxCell,
            }
            : col
    )

    const handleSave = () => {
        if (!partItemDetailId) {
            showActionAlert('failed')
            return
        }

        clearDraftSave()

        // Transform data to API payload format
        const payload: PartSettingUpsertRequest = {
            part_item_detail_id: partItemDetailId,
            configuration_settings: configurationSettings.map(({ feature_id, applicable }) => ({
                feature_id,
                applicable,
            })),
        }

        upsertMutation.mutate(payload, {
            onSuccess: () => {
                if (projectId) {
                    router.push(`${BOM_CONSTANTS.PATH}/${projectId}`)
                }
                showActionAlert(SUCCESS_ALERT);
            },
            onError: () => {
                showActionAlert(FAILED_ALERT)
            },
        })
    }

    const handleCancel = async () => {
        await checkUnsavedDraftBeforeLeave()
        if (projectId) {
            router.push(`${BOM_CONSTANTS.PATH}/${projectId}`)
        }
    }

    return (
        <PageContainer>
            {isDraftSaving && <DraftLoading />}
            <Label title={PART_SETTING_LABELS.TITLE} />

            <Grid2 container spacing={NUMBERMAP.TWO} sx={P20P40}>
                <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                    <InfoField
                        label={PART_SETTING_LABELS.PRODUCT_ID}
                        value={dataItem?.product_id?.toString() ?? '-'}
                    />
                </Grid2>

                <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                    <InfoField
                        label={PART_SETTING_LABELS.PRODUCT_NAME}
                        value={dataItem?.product_name ?? '-'}
                    />
                </Grid2>

                <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                    <InfoField
                        label={PART_SETTING_LABELS.ASSEMBLY_PART_NAME}
                        value={dataItem?.assembly_part ?? '-'}
                    />
                </Grid2>

                <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                    <InfoField
                        label={PART_SETTING_LABELS.PART_CODE}
                        value={dataItem?.part_code ?? '-'}
                    />
                </Grid2>
            </Grid2>

            <Label title={PART_SETTING_LABELS.CONFIGURATION_SETTINGS} />

            <Box sx={P20P40}>
                <DataTable
                    rows={configurationSettings ?? []}
                    columns={columns}
                    IdField={BOM_CONSTANTS.FEATURE_ID}
                    loading={isLoading}
                    pagination={false}
                />
            </Box>

            <Box sx={P20P40}>
                <ButtonGroup
                    buttons={[
                        {
                            label: BUTTON_LABELS.CANCEL,
                            onClick: handleCancel,
                        },
                        {
                            label: BUTTON_LABELS.SAVE,
                            onClick: handleSave,
                            disabled: upsertMutation.isPending ?? isLoading,
                        },
                    ]}
                />
            </Box>
        </PageContainer>
    )
}

export default PartSettingPage