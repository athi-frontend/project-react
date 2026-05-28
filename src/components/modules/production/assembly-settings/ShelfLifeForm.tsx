'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Grid2, Box } from '@mui/material'
import { InputField, RichTextEditor, ButtonGroup } from '@/components/ui'
import { P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { useShelfLifeList, useAllNonConformedLocations, useUpsertShelfLife } from '@/hooks/modules/production/useShelfLife'
import { useRouter } from 'next/navigation'
import CalibrationDetails, { CalibrationConfigItem } from '@/components/ui/data-table/SingleRowTable'
import { stripHtml } from '@/lib/utils/common'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
 * Classification: Confidential
 * Shelf Life Form Component
 */

export interface ShelfLifeFormData {
  partNo: string
  partDescription: string
  shelfLife: string
  nonConformedLocationDetails: string
  dispositionMethod: string
  environmentCondition: string
  storageDetails: string
}

interface ShelfLifeFormProps {
  partAssemblyDetailId?: number
  assemblyPartItemDetailId?: number
}

const ShelfLifeForm: React.FC<ShelfLifeFormProps> = ({
  partAssemblyDetailId,
  assemblyPartItemDetailId,
}) => {
  const router = useRouter()
  const isInitialDataLoad = useRef(true)

  // Internal state management
  const [formData, setFormData] = useState<ShelfLifeFormData>({} as ShelfLifeFormData)
  
  // Validation errors state
  const [errors, setErrors] = useState<Partial<Record<keyof ShelfLifeFormData, string>>>({})
  
  // Upsert hook
  const { mutate: upsertShelfLife, isPending: isSaving } = useUpsertShelfLife()

  // Fetch shelf life data if assemblyPartItemDetailId is provided
  const { data: shelfLifeData } = useShelfLifeList(
    assemblyPartItemDetailId ?? NUMBERMAP.ZERO,
    !!assemblyPartItemDetailId
  )

  // Draft save hook (StorageEnvironmentDetailsForm pattern)
  const contextInstanceIdForDraft = assemblyPartItemDetailId ?? null
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'shelf_life',
    context_instance_id: contextInstanceIdForDraft,
    enableFetch: false,
  })

  const handleDraftSave = useCallback((formDataToSave: ShelfLifeFormData) => {
    draftSave({
      form_data: {
        id: contextInstanceIdForDraft ?? Date.now(),
        ...formDataToSave,
        type: 'draft',
      },
    })
  }, [draftSave, contextInstanceIdForDraft])

  // Normalize API response: data may be array [{}] or single object {} (e.g. after draft save)
  const getExistingShelfLifeRecord = () => {
    const raw = shelfLifeData?.data
    if (!raw) return null
    if (Array.isArray(raw)) return raw.length > NUMBERMAP.ZERO ? raw[NUMBERMAP.ZERO] : null
    return typeof raw === 'object' && raw !== null ? raw : null
  }

  // Normalize for table: always pass array to CalibrationDetails
  const shelfLifeTableData = useMemo(() => {
    const raw = shelfLifeData?.data
    if (!raw) return []
    return Array.isArray(raw) ? raw : [raw]
  }, [shelfLifeData?.data])

  // Initialize isInitialDataLoad flag when assemblyPartItemDetailId changes (form-team pattern)
  useEffect(() => {
    setTimeout(() => {
      isInitialDataLoad.current = false
    }, NUMBERMAP.TWOTHOUSAND)
  }, [assemblyPartItemDetailId])

  // Fetch non-conformed locations dropdown
  const { data: nonConformedLocationsData } = useAllNonConformedLocations(NUMBERMAP.ONE, true)

  // Prepare non-conformed location options for dropdown
  const nonConformedLocationOptions = useMemo(() => {
    if (!nonConformedLocationsData?.data) return []
    return nonConformedLocationsData.data.map((location) => ({
      id: location.id,
      name: location.non_conformed_location,
    }))
  }, [nonConformedLocationsData])

  // Configuration for storage/inventory details table
  const storageDetailsConfig: CalibrationConfigItem[] = useMemo(() => [
    {
      field: 'floor',
      label: 'Floor',
      type: 'text',
    },
    {
      field: 'room',
      label: 'Room',
      type: 'text',
    },
    {
      field: 'shelf_details',
      label: 'Shelf Details',
      type: 'text',
    },
    {
      field: 'bin_number',
      label: 'Bin Number',
      type: 'text',
    },
    {
      field: 'address',
      label: 'Address',
      type: 'text',
    },
    {
      field: 'unit',
      label: 'Unit',
      type: 'text',
    },
  ], [])

  // Load existing shelf life data when data is fetched
  useEffect(() => {
    const existingData = getExistingShelfLifeRecord()
    if (existingData && isInitialDataLoad.current && assemblyPartItemDetailId) {
      const apiData = existingData as Record<string, any>
      setFormData({
        partNo: apiData.part_number ?? apiData.partNo ?? '',
        partDescription: apiData.part_description ?? apiData.partDescription ?? '',
        shelfLife: apiData.shelf_life ?? apiData.shelfLife ?? '',
        nonConformedLocationDetails:
          apiData?.non_conformed_location_id == null
            ? (apiData?.nonConformedLocationDetails ?? '')
            : String(apiData.non_conformed_location_id),
        dispositionMethod: apiData.disposition_method ?? apiData.dispositionMethod ?? '',
        environmentCondition: apiData.environment_conditions ?? apiData.environmentCondition ?? '',
        storageDetails: apiData.storage_details ?? apiData.storageDetails ?? '',
      })
      isInitialDataLoad.current = false
    }
  }, [shelfLifeData, assemblyPartItemDetailId])


  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShelfLifeFormData, string>> = {}

    // Validate Shelf Life (required)
    if (!formData.shelfLife?.trim()) {
      newErrors.shelfLife = 'Shelf Life is required'
    }

    // Validate Non-Conformed Location Details (required)
    if (!formData.nonConformedLocationDetails?.trim()) {
      newErrors.nonConformedLocationDetails = 'Non-Conformed Location Details is required'
    }

    // Validate Disposition Method (required - RichTextEditor)
    const dispositionMethodText = stripHtml(formData.dispositionMethod ?? '').trim()
    if (!dispositionMethodText) {
      newErrors.dispositionMethod = 'Disposition Method is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const updateFormData = (updates: Partial<ShelfLifeFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates }
      handleDraftSave(next)
      return next
    })
    // Clear error for the field being updated
    const updatedFields = Object.keys(updates) as Array<keyof ShelfLifeFormData>
    const clearedErrors = { ...errors }
    updatedFields.forEach((field) => {
      if (clearedErrors[field]) {
        delete clearedErrors[field]
      }
    })
    setErrors(clearedErrors)
  }

  const handleSave = () => {
    if (!assemblyPartItemDetailId) return
    
    // Validate form before saving
    if (!validateForm()) {
      return
    }

    clearDraftSave()

    upsertShelfLife(
      {
        applicable_settings_id: assemblyPartItemDetailId,
        shelf_life: formData.shelfLife,
        non_conformed_location_id: Number(formData.nonConformedLocationDetails),
        environment_specs: '', // Not used anymore but required by API
        disposition_method: formData.dispositionMethod, // Note: API has typo "menthod"
      }
    )
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(`/production/part-assembly-settings/${partAssemblyDetailId}`)
  }
  return (
    <>
    {isDraftSaving && <DraftLoading />}
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
      {/* Part No - InfoField */}
      <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
        <InfoField label="Part No" value={formData.partNo ?? 'N/A'} />
      </Grid2>

      {/* Part Description - InfoField */}
      <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
        <InfoField label="Part Description" value={stripHtml(formData.partDescription ?? '')} />
      </Grid2>

      {/* Shelf Life * - InputField */}
      <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
        <InputField
          label={'Shelf Life*'}
          placeholder={'Enter Shelf Life'}
          value={formData.shelfLife ?? ''}
          onChange={(value: string) => updateFormData({ shelfLife: value })}
          error={errors.shelfLife}
        />
      </Grid2>
      <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
      <CalibrationDetails
            title="Storage/Inventory Details"
            data={shelfLifeTableData}
            config={storageDetailsConfig}
          />
      </Grid2>

      {/* Non-Conformed Location Details - dropdown */}
      <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
        <InfoField label="Storage Details" value={stripHtml(formData.storageDetails ?? '')} />
      </Grid2>

      {/* Environment Condition - InfoField (Read-only) */}
      <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
        <InfoField label="Environment Condition" value={stripHtml(formData.environmentCondition ?? '')} />
      </Grid2>

      {/* Storage Details - InfoField (Read-only) */}
    
      <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
        <InputField
          label={'Non-Conformed Location Details*'}
          placeholder={'Select Non-Conformed Location Details'}
          isDropdown
          options={nonConformedLocationOptions}
          keyField="id"
          valueField="name"
          value={formData.nonConformedLocationDetails ?? ''}
          onChange={(value: string) => updateFormData({ nonConformedLocationDetails: value })}
          error={errors.nonConformedLocationDetails}
        />
      </Grid2>

      {/* Disposition Method* - RichTextEditor */}
      <Grid2 size={{ xs: NUMBERMAP.SIX }}>
        <RichTextEditor
          label={'Disposition Method*'}
          placeholder={'Enter Disposition Method'}
          value={formData.dispositionMethod ?? ''}
          onChange={(value: string) => updateFormData({ dispositionMethod: value })}
          error={errors.dispositionMethod}
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

export default ShelfLifeForm

