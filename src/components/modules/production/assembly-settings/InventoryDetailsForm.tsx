'use client'

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Grid2, Box } from '@mui/material'
import { DataGridTable, InputField, Description, ButtonGroup } from '@/components/ui'
import { P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { GridColDef } from '@mui/x-data-grid'
import { useAllUnits } from '@/hooks/modules/production/useCommonProductionDropDownHook'
import { useInventoryDetailList, useUpsertInventoryDetail } from '@/hooks/modules/production/useInventoryDetail'
import { useRouter } from 'next/navigation'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'

/**
 * Classification: Confidential
 * Inventory Details Form Component
 */

export interface LocationDetail {
  id: string
  sno: number
  floor: string
  room: string
  shelfDetails: string
  binNumber: string
  unitName: string
  address: string
}

export interface InventoryDetailsFormData {
  partNumber: string
  partType: string
  partName: string
  batchUnit: string
  unitId: number | string
  locationDetails: LocationDetail[],
  floor: string
  room: string
  shelfDetails: string
  binNumber: string
  unitName: string
  address: string
}

interface InventoryDetailsFormProps {
  partAssemblyDetailId?: number
  assemblyPartItemId?: number
}

const InventoryDetailsForm: React.FC<InventoryDetailsFormProps> = ({
  partAssemblyDetailId,
  assemblyPartItemId,
}) => {
  const router = useRouter()
  const isInitialDataLoad = useRef(true)

  // Internal state management
  const [formData, setFormData] = useState<InventoryDetailsFormData>({
    partNumber: '',
    partType: '',
    partName: '',
    batchUnit: '',
    unitId: '',
    floor: '',
    room: '',
    shelfDetails: '',
    binNumber: '',
    unitName: '',
    address: '',
    locationDetails: [],
  })

  // Validation errors state
  const [errors, setErrors] = useState<Partial<Record<keyof InventoryDetailsFormData, string>>>({})

  // Upsert hook
  const { mutate: upsertInventoryDetail, isPending: isSaving } = useUpsertInventoryDetail()

  // Fetch units dropdown
  const { data: unitsData, isLoading: isLoadingUnits } = useAllUnits(NUMBERMAP.ONE, true)

  // Fetch inventory details if assemblyPartItemId is provided
  const { data: inventoryDetailData, isLoading: isLoadingInventory } = useInventoryDetailList(
    assemblyPartItemId ?? NUMBERMAP.ZERO,
    !!assemblyPartItemId
  )

  const contextInstanceIdForDraft = assemblyPartItemId ?? null
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'inventory_detail',
    context_instance_id: contextInstanceIdForDraft,
    enableFetch: false,
  })

  const handleDraftSave = useCallback((formDataToSave: InventoryDetailsFormData) => {
    draftSave({
      form_data: {
        ...formDataToSave,
        type: 'draft',
      },
    })
  }, [draftSave])

  // Normalize API response: data may be array [{}] or single object {}
  const getExistingInventoryRecord = () => {
    const raw = inventoryDetailData?.data
    if (!raw) return null
    if (Array.isArray(raw)) return raw.length > NUMBERMAP.ZERO ? raw[NUMBERMAP.ZERO] : null
    return typeof raw === 'object' && raw !== null ? raw : null
  }

  // Load existing inventory details when data is fetched
  useEffect(() => {
    const existingData = getExistingInventoryRecord()
    if (existingData && assemblyPartItemId) {
      const apiData = existingData as Record<string, any>
      setFormData((prev) => ({
        ...prev,
        partNumber: apiData?.part_number ?? apiData?.partNumber ?? '',
        partType: apiData?.part_type ?? apiData?.partType ?? '',
        partName: apiData?.part_name ?? apiData?.partName ?? '',
        batchUnit: apiData?.unit_name ?? apiData?.batchUnit ?? '',
        unitId: apiData?.unit_id ?? apiData?.unitId ?? '',
        floor: apiData?.floor ?? '',
        room: apiData?.room ?? '',
        shelfDetails: apiData?.shelf_details ?? apiData?.shelfDetails ?? '',
        binNumber: apiData?.bin_number ?? apiData?.binNumber ?? '',
        unitName: apiData?.unit_name ?? apiData?.unitName ?? '',
        address: apiData?.address ?? '',
      }))
      isInitialDataLoad.current = false
    }
  }, [inventoryDetailData, assemblyPartItemId])

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InventoryDetailsFormData, string>> = {}

    // Validate Part Number (required)
    if (!formData.partNumber?.trim()) {
      newErrors.partNumber = 'Part Number is required'
    }

    // Validate Part Type (required)
    if (!formData.partType?.trim()) {
      newErrors.partType = 'Part Type is required'
    }

    // Validate Part Name (required)
    if (!formData.partName?.trim()) {
      newErrors.partName = 'Part Name is required'
    }

    // Validate Batch/Unit (required)
    if (!formData.unitId) {
      newErrors.unitId = 'Batch/Unit is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateFormData = (updates: Partial<InventoryDetailsFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates }
      handleDraftSave(next)
      return next
    })
    // Clear error for the field being updated
    setErrors((prevErrors) => {
      const clearedErrors = { ...prevErrors }
      const updatedFields = Object.keys(updates) as Array<keyof InventoryDetailsFormData>
      updatedFields.forEach((field) => {
        if (clearedErrors[field]) {
          delete clearedErrors[field]
        }
      })
      return clearedErrors
    })
  }

  const handleLocationDetailChange = useCallback((field: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      handleDraftSave(next)
      return next
    })
  }, [handleDraftSave])

  const getVendorVisitData = useMemo(() => {
    const allObservations = [
      { id: 'floor', area: 'Floor', observation: formData.floor },
      { id: 'room', area: 'Room', observation: formData.room },
      { id: 'shelfDetails', area: 'Shelf Details', observation: formData.shelfDetails },
      { id: 'binNumber', area: 'Bin Number', observation: formData.binNumber },
      { id: 'unitName', area: 'Unit Name', observation: formData.unitName },
      { id: 'address', area: 'Address', observation: formData.address },
    ];
    return allObservations;
  }, [formData.floor, formData.room, formData.shelfDetails, formData.binNumber, formData.unitName, formData.address]);


  const renderObservation = useCallback((params: any) => {
    if (params.row.area === 'Shelf Details') {
      return (
        <Description
          label=""
          placeholder={"Observation"}
          value={params.row.observation ?? ""}
          onChange={(value: string) => {
            handleLocationDetailChange('shelfDetails', value);
          }}
        />
      )
    }
    if (params.row.area === 'Unit Name') {
      return (
        <InputField
          label=""
          placeholder="Select Batch/Unit"
          isDropdown={true}
          value={formData.unitId ?? ''}
          options={unitsData?.data ?? []}
          keyField="unit_id"
          valueField="unit_name"
          onChange={(value: string) => {
            updateFormData({ unitId: value })
          }}
          error={errors.unitId}
        />
      )
    }
    if (params.row.area === 'Address') {
      return (
        <InfoField label={''} value={formData?.address ?? 'N/A'} />
      )
    }
    return (
      <InputField
        label=""
        placeholder={"Observation"}
        value={params.row.observation ?? ""}
        onChange={(value: string) => {
          const type = params.row.id;

          // Map the parsed type to the correct form field name
          let observationType: string;
          switch (type) {
            case 'floor':
              observationType = 'floor';
              break;
            case 'room':
              observationType = 'room';
              break;
            case 'shelfDetails':
              observationType = 'shelfDetails';
              break;
            case 'binNumber':
              observationType = 'binNumber';
              break;
            case 'unitName':
              observationType = 'unitName';
              break;
            default:
              observationType = type;
          }

          handleLocationDetailChange(observationType, value);
        }}
      />
    )
  }, [handleLocationDetailChange, formData, errors, unitsData, updateFormData]);

  const locationDetailColumns: GridColDef[] = useMemo(() => [
    { field: "area", headerName: "Areas", flex: NUMBERMAP.ONE },
    {
      field: "observation",
      headerName: "Observation",
      flex: NUMBERMAP.FOUR,
      renderCell: (params) => (renderObservation(params))
    }
  ], [renderObservation]); 
  const handleSave = () => {
    if (!assemblyPartItemId) return

    // Validate form before saving
    if (!validateForm()) {
      return
    }
    clearDraftSave()

    upsertInventoryDetail({
      applicable_settings_id: assemblyPartItemId,
      floor: formData.floor,
      room: formData.room,
      shelf_details: formData.shelfDetails,
      bin_number: formData.binNumber,
      unit_id: formData.unitId,
      address: formData.address,
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(`/production/part-assembly-settings/${partAssemblyDetailId}`)
  }

  return (
    <>
      {isDraftSaving && <DraftLoading />}
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
        {/* Part Number - InfoField */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField label="Part Number" value={formData.partNumber ?? 'N/A'} />
        </Grid2>

        {/* Part Type - InfoField */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField label="Part Type" value={formData.partType ?? 'N/A'} />
        </Grid2>

        {/* Part Name - InfoField */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField label="Part Name" value={formData.partName ?? 'N/A'} />
        </Grid2>

        {/* Batch/Unit - InfoField (Read-only) */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField label="Batch/Unit" value={formData.batchUnit ?? 'N/A'} />
        </Grid2>

        {/* Location Details - DataGridTable */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title="Location Details"
            rows={getVendorVisitData}
            columns={locationDetailColumns}
            idField="id"
            loading={isLoadingInventory ?? isLoadingUnits}
            hideFooter={true}
          />
        </Grid2>
      </Grid2>

      <Box sx={{ padding: P20P40 }}>
        <ButtonGroup
          buttons={[
            {
              label: 'Cancel',
              onClick: handleCancel,
              disabled: isSaving,
            },
            {
              label: 'Save',
              onClick: handleSave,
              disabled: isSaving,
            },
          ]}
        />
      </Box>
    </>
  )
}

export default InventoryDetailsForm

