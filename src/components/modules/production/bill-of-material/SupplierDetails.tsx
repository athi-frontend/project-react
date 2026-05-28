'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Grid2, Box, Typography } from '@mui/material'
import { InputField, ButtonGroup } from '@/components/ui'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP } from '@/constants/common'
import { BUTTON_LABELS } from '@/constants/modules/vendor-management/vendorSelectionCriteria'
import {
    PART_DETAILS_LABELS,
    PART_DETAILS_PLACEHOLDERS,
    BOM_CONSTANTS,
    DROPDOWN_FIELDS,
} from '@/constants/modules/production/billOfMaterial'
import { SupplierDetail } from '@/types/modules/production/billOfMaterial'
import {
    supplierDropdownWrapperStyles,
    vendorSelectionCriteriaLinkStyles,
    supplierDetailsButtonContainerStyles,
} from '@/styles/modules/production/billOfMaterial'
import { useAllVendors } from '@/hooks/modules/vendor-management/useVendorList'
import { P20P40 } from '@/styles/common'

/**
 * Classification: Confidential
 * Supplier Details Modal Component
 */

interface SupplierDetailsProps {
    open: boolean
    onClose: () => void
    onSave: (supplierData: SupplierDetail) => void
    initialData?: SupplierDetail | null
    projectId?: number
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({
    open,
    onClose,
    onSave,
    initialData,
    projectId,
}) => {
    const router = useRouter()

    // Fetch approved vendors (active vendors with status=1)
    const { data: vendorsResponse, isLoading: isLoadingVendors } = useAllVendors(open)

    const [formData, setFormData] = useState<SupplierDetail>({
        vendor_id: initialData?.vendor_id ?? '',
        vendor_name: initialData?.vendor_name ?? '',
        supplier_part_no: initialData?.supplier_part_no ?? '',
        moq: initialData?.moq ?? '',
        lead_time: initialData?.lead_time ?? '',
    })

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                vendor_id: initialData.vendor_id ?? '',
                vendor_name: initialData.vendor_name ?? '',
                supplier_part_no: initialData.supplier_part_no ?? '',
                moq: initialData.moq ?? '',
                lead_time: initialData.lead_time ?? '',
            })
        } else {
            setFormData({
                vendor_id: '',
                vendor_name: '',
                supplier_part_no: '',
                moq: '',
                lead_time: '',
            })
        }
    }, [initialData, open])

    const handleFieldChange = (field: keyof SupplierDetail, value: any) => {
        setFormData((prev) => {
            const updated = {
                ...prev,
                [field]: value,
            }
            // When vendor_id changes, update vendor_name from vendors list
            if (field === 'vendor_id' && value) {
                const vendorId = typeof value === 'number' ? value : Number(value)
                const selectedVendor = vendorsResponse?.data?.find((vendor) => vendor.id === vendorId)
                updated.vendor_name = selectedVendor?.vendor_name
            }
            return updated
        })
    }

    const handleSave = () => {
        // Preserve supplier_detail_id if it exists in initialData
        const dataToSave = { ...formData }
        if ((initialData)?.supplier_detail_id) {
            (dataToSave).supplier_detail_id = (initialData).supplier_detail_id
        }
        onSave(dataToSave)
        onClose()
    }

    const handleVendorSelectionCriteriaClick = () => {
        router.push(BOM_CONSTANTS.VENDOR_SELECTION_CRITERIA_PATH + projectId)
    }

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={PART_DETAILS_LABELS.ADD_SUPPLIER_DETAILS}
            buttonRequired={false}
            modalMaxWidth={BOM_CONSTANTS.SUPPLIER_MODAL_MAX_WIDTH}
        >
            <Box sx={P20P40}>
                <Grid2 container spacing={NUMBERMAP.TWO}>
                    <Grid2 size={NUMBERMAP.TWELVE}>
                        <Box sx={supplierDropdownWrapperStyles}>
                            <InputField
                                label={PART_DETAILS_LABELS.SUPPLIER_NAME}
                                placeholder={PART_DETAILS_PLACEHOLDERS.SUPPLIER_NAME}
                                value={formData.vendor_id ? String(formData.vendor_id) : ''}
                                isDropdown={true}
                                options={vendorsResponse?.data ?? []}
                                keyField={DROPDOWN_FIELDS.VENDOR.KEY_FIELD}
                                valueField={DROPDOWN_FIELDS.VENDOR.VALUE_FIELD}
                                onChange={(value: string) =>
                                    handleFieldChange('vendor_id', value ? Number(value) : '')
                                }
                                disabled={isLoadingVendors}
                            />
                            <Typography
                                onClick={handleVendorSelectionCriteriaClick}
                                sx={vendorSelectionCriteriaLinkStyles}
                            >
                                {PART_DETAILS_LABELS.VENDOR_SELECTION_CRITERIA}
                            </Typography>
                        </Box>
                    </Grid2>

                    <Grid2 size={NUMBERMAP.TWELVE}>
                        <InfoField
                            label={PART_DETAILS_LABELS.SUPPLIER_PART_NO}
                            value={formData.supplier_part_no ?? '-'}
                        />
                    </Grid2>

                    <Grid2 size={NUMBERMAP.TWELVE}>
                        <InfoField
                            label={PART_DETAILS_LABELS.MOQ}
                            value={formData.moq ?? '-'}
                        />
                    </Grid2>

                    <Grid2 size={NUMBERMAP.TWELVE}>
                        <InfoField
                            label={PART_DETAILS_LABELS.LEAD_TIME}
                            value={formData.lead_time ?? '-'}
                        />
                    </Grid2>
                </Grid2>

                <Box sx={supplierDetailsButtonContainerStyles}>
                    <ButtonGroup
                        buttons={[
                            {
                                label: BUTTON_LABELS.CANCEL,
                                onClick: onClose,
                            },
                            {
                                label: BUTTON_LABELS.SAVE,
                                onClick: handleSave,
                            },
                        ]}
                    />
                </Box>
            </Box>
        </CommonModal>
    )
}

export default SupplierDetails
