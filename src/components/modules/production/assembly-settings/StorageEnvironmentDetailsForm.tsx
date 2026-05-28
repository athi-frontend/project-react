'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Grid2, Box } from '@mui/material'
import { RichTextEditor, ButtonGroup } from '@/components/ui'
import { P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { useStorageEnvironmentList, useUpsertStorageEnvironment } from '@/hooks/modules/production/useStorageEnvironment'
import { useRouter } from 'next/navigation'
import { stripHtml } from '@/lib/utils/common'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
 * Classification: Confidential
 * Storage and Environment Details Form Component
 */

export interface StorageEnvironmentDetailsFormData {
  storageDetails: string
  environmentConditions: string
}

interface StorageEnvironmentDetailsFormProps {
  partAssemblyDetailId?: number
  assemblyPartItemDetailId?: number
}

const StorageEnvironmentDetailsForm: React.FC<StorageEnvironmentDetailsFormProps> = ({
  partAssemblyDetailId,
  assemblyPartItemDetailId,
}) => {
  const router = useRouter()
  const isInitialDataLoad = useRef(true)
  
  // Internal state management
  const [formData, setFormData] = useState<StorageEnvironmentDetailsFormData>({
    storageDetails: '',
    environmentConditions: '',
  })
  
  // Validation errors state
  const [errors, setErrors] = useState<Partial<Record<keyof StorageEnvironmentDetailsFormData, string>>>({})
  
  // Upsert hook
  const { mutate: upsertStorageEnvironment, isPending: isSaving } = useUpsertStorageEnvironment()

  // Fetch storage environment data if assemblyPartItemDetailId is provided
  const { data: storageEnvironmentData } = useStorageEnvironmentList(
    assemblyPartItemDetailId ?? NUMBERMAP.ZERO,
    !!assemblyPartItemDetailId
  )

  // Draft save hook (form-team pattern)
  const contextInstanceIdForDraft = assemblyPartItemDetailId ?? null
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'storage_environment',
    context_instance_id: contextInstanceIdForDraft,
    enableFetch: false,
  })

  const handleDraftSave = useCallback((formDataToSave: StorageEnvironmentDetailsFormData) => {
    draftSave({
      form_data: {
        id: contextInstanceIdForDraft ?? Date.now(),
        storageDetails: formDataToSave.storageDetails,
        environmentConditions: formDataToSave.environmentConditions,
        type: 'draft',
      },
    })
  }, [draftSave, contextInstanceIdForDraft])

  // Normalize API response: data may be array [{}] or single object {} (e.g. after draft save)
  const getExistingStorageRecord = () => {
    const raw = storageEnvironmentData?.data
    if (!raw) return null
    if (Array.isArray(raw)) return raw.length > NUMBERMAP.ZERO ? raw[NUMBERMAP.ZERO] : null
    return typeof raw === 'object' && raw !== null ? raw : null
  }

  // Initialize isInitialDataLoad flag when assemblyPartItemDetailId changes (form-team pattern)
  useEffect(() => {
    setTimeout(() => {
      isInitialDataLoad.current = false
    }, NUMBERMAP.THREETHOUSANDFIVEHUNDRED)
  }, [assemblyPartItemDetailId])

  // Load existing storage environment data when data is fetched
  useEffect(() => {
    const existingData = getExistingStorageRecord()
    if (existingData && isInitialDataLoad.current && assemblyPartItemDetailId) {
      const apiData = existingData as Record<string, any>
      setFormData({
        storageDetails: apiData.storageDetails ?? apiData.storage_details ?? '',
        environmentConditions: apiData.environmentConditions ?? apiData.environment_conditions ?? '',
      })
      isInitialDataLoad.current = false
    }
  }, [storageEnvironmentData, assemblyPartItemDetailId])


  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StorageEnvironmentDetailsFormData, string>> = {}

    // Validate Storage Details (required)
    const storageDetailsText = stripHtml(formData.storageDetails ?? '').trim()
    if (!storageDetailsText) {
      newErrors.storageDetails = 'Storage Details is required'
    }

    // Validate Environment Conditions (required)
    const environmentConditionsText = stripHtml(formData.environmentConditions ?? '').trim()
    if (!environmentConditionsText) {
      newErrors.environmentConditions = 'Environment Conditions is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const updateFormData = (updates: Partial<StorageEnvironmentDetailsFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates }
      handleDraftSave(next)
      return next
    })
    // Clear error for the field being updated
    const updatedFields = Object.keys(updates) as Array<keyof StorageEnvironmentDetailsFormData>
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
    if (!validateForm()) {
      return
    }

    clearDraftSave()

    upsertStorageEnvironment(
      {
        applicable_settings_id: assemblyPartItemDetailId,
        storage_details: formData.storageDetails,
        environment_conditions: formData.environmentConditions,
      },
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
        {/* Storage Details* - RichTextEditor */}
        <Grid2 size={{ xs: NUMBERMAP.SIX }}>
          <RichTextEditor
            label={'Storage Details*'}
            placeholder={'Enter Storage Details'}
            value={formData.storageDetails}
            onChange={(value: string) => updateFormData({ storageDetails: value })}
            error={errors.storageDetails}
          />
        </Grid2>

        {/* Environment Conditions* - RichTextEditor */}
        <Grid2 size={{ xs: NUMBERMAP.SIX }}>
          <RichTextEditor
            label={'Environment Conditions*'}
            placeholder={'Enter Environment Conditions'}
            value={formData.environmentConditions}
            onChange={(value: string) => updateFormData({ environmentConditions: value })}
            error={errors.environmentConditions}
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

export default StorageEnvironmentDetailsForm

