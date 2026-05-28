'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Grid2, Checkbox, FormControlLabel, Box } from '@mui/material'
import { RichTextEditor, ButtonGroup } from '@/components/ui'
import { ErrorText, P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { useIQAExclusionList, useUpsertIQAExclusion } from '@/hooks/modules/production/useIQAExclusion'
import { useRouter } from 'next/navigation'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
 * Classification: Confidential
 * Item Excluded from IQA with Justifications Form Component
 */

export interface ItemExcludedIQAFormData {
  isItemExcludedFromIQA: number | null
  justification: string
}

interface ItemExcludedIQAFormProps {
  partAssemblyDetailId?: number
  assemblyPartItemDetailId?: number
}

const ItemExcludedIQAForm: React.FC<ItemExcludedIQAFormProps> = ({
  partAssemblyDetailId,
  assemblyPartItemDetailId,
}) => {
  const router = useRouter()
  const isInitialDataLoad = useRef(true)
  const initialDraftLoading = useRef(true)

  const [isItemExcludedFromIQA, setIsItemExcludedFromIQA] = useState<boolean | null>(null)
  const [justification, setJustification] = useState('')
  // Validation errors state
  const [errors, setErrors] = useState<Partial<Record<keyof ItemExcludedIQAFormData, string>>>({})
  
  // Upsert hook
  const { mutate: upsertIQAExclusion, isPending: isSaving } = useUpsertIQAExclusion()

  // Fetch IQA exclusion data if assemblyPartItemDetailId is provided
  const { data: iqaExclusionData } = useIQAExclusionList(
    assemblyPartItemDetailId ?? NUMBERMAP.ZERO,
    !!assemblyPartItemDetailId
  )

  // Draft save hook (StorageEnvironmentDetailsForm / ShelfLifeForm pattern)
  const contextInstanceIdForDraft = assemblyPartItemDetailId ?? null
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } =
    useDraftSave({
      context_type: 'iqa_exclusion',
      context_instance_id: contextInstanceIdForDraft,
      enableFetch: false,
    })

  const handleDraftSave = useCallback(
    (isExcluded: boolean | null, justificationText: string) => {
      draftSave({
        form_data: {
          id: contextInstanceIdForDraft ?? Date.now(),
          isItemExcludedFromIQA: isExcluded,
          justification: justificationText,
          type: 'draft',
        },
      })
    },
    [draftSave, contextInstanceIdForDraft]
  )

  // Normalize API response: data may be array [{}] or single object {}
  const getExistingIQARecord = useCallback(() => {
    const raw = iqaExclusionData?.data
    if (!raw) return null
    if (Array.isArray(raw)) return raw.length > NUMBERMAP.ZERO ? raw[NUMBERMAP.ZERO] : null
    return typeof raw === 'object' && raw !== null ? raw : null
  }, [iqaExclusionData?.data])

  // Initialize initialDraftLoading flag with setTimeout (form-team pattern)
  useEffect(() => {
    setTimeout(() => {
      initialDraftLoading.current = false
    }, NUMBERMAP.TWOTHOUSAND)
  }, [assemblyPartItemDetailId])

  // Load existing IQA exclusion data from API when data is fetched
  useEffect(() => {
    const existingData = getExistingIQARecord()
    if (existingData && isInitialDataLoad.current && assemblyPartItemDetailId) {
      const apiData = existingData as unknown as Record<string, unknown>
      setIsItemExcludedFromIQA(apiData?.is_excluded_from_iqa === NUMBERMAP.ONE)
      setJustification(
        typeof apiData?.justification === 'string' ? apiData.justification : ''
      )
      isInitialDataLoad.current = false
    }
  }, [iqaExclusionData, assemblyPartItemDetailId, getExistingIQARecord])

  // Helper function to strip HTML tags and check if empty
  const stripHtml = (html: string): string => {
    if (!html) return ''
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent ?? tmp.innerText ?? ''
  }

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ItemExcludedIQAFormData, string>> = {}

    // Validate Justification (required if item is excluded)
    if (isItemExcludedFromIQA) {
      const justificationText = stripHtml(justification ?? '').trim()
      if (!justificationText) {
        newErrors.justification = 'Justification is required when item is excluded from IQA'
      }
    }
    if (isItemExcludedFromIQA === null) {
      newErrors.isItemExcludedFromIQA = 'Item Excluded from IQA is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }



  const handleSave = () => {
    if (!assemblyPartItemDetailId) return

    if (!validateForm()) return

    clearDraftSave()

    upsertIQAExclusion(
      {
        applicable_settings_id: assemblyPartItemDetailId,
        is_excluded_from_iqa: isItemExcludedFromIQA ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
        justification,
      }
    )
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push('/production/part-assembly-settings/' + partAssemblyDetailId)
  }

  return (
    <>
      {isDraftSaving && <DraftLoading />}
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
      {/* Item Excluded from IQA* - Checkbox */}
      <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
        <Box >
          <FormControlLabel
            control={
              <Checkbox
                checked={isItemExcludedFromIQA ?? false}
                onChange={(e) => {
                  const checked = e.target.checked
                  setIsItemExcludedFromIQA(checked)
                  if (!initialDraftLoading.current) {
                    handleDraftSave(checked, justification)
                  }
                }}
                color="primary"
              />
            }
            label="Item Excluded from IQA*"
          />
          {
            errors.isItemExcludedFromIQA && (
              <ErrorText variant="body2" color="error">
                {errors.isItemExcludedFromIQA}
              </ErrorText>
            )
          }
        </Box>
      </Grid2>

      {/* Justification - RichTextEditor */}
      <Grid2 size={{ xs: NUMBERMAP.SIX }}>
        <RichTextEditor
          label={'Justification*'}
          placeholder={'Enter Justification'}
          value={justification}
          onChange={(value: string) => {
            setJustification(value)
            if (!initialDraftLoading.current) {
              handleDraftSave(isItemExcludedFromIQA, value)
            }
          }}
          error={errors.justification}
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

export default ItemExcludedIQAForm

