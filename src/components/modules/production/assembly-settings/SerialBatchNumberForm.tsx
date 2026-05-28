'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Grid2, Box } from '@mui/material'
import { RadioButtonGroup, ButtonGroup } from '@/components/ui'
import { P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { useSerialBatchNumberList, useUpsertSerialBatchNumber } from '@/hooks/modules/production/useSerialBatchNumber'
import { useRouter } from 'next/navigation'

/**
 * Classification: Confidential
 * Serial/Batch Number Form Component
 */

export interface SerialBatchNumberFormData {
  serialBatchNumber: string | number
  is_serial_batch_required?: string | number | null
}

interface SerialBatchNumberFormProps {
  partAssemblyDetailId?: number
}

const SerialBatchNumberForm: React.FC<SerialBatchNumberFormProps> = ({
  partAssemblyDetailId,
}) => {
  const router = useRouter()
  const isInitialDataLoad = useRef(true)

  const [isSerialBatchRequired, setIsSerialBatchRequired] = useState<string | number | null>(null)
  // Validation errors state
  const [errors, setErrors] = useState<Partial<Record<keyof SerialBatchNumberFormData, string>>>({})
  
  // Upsert hook
  const { mutate: upsertSerialBatchNumber, isPending: isSaving } = useUpsertSerialBatchNumber()

  // Fetch serial batch number data if partAssemblyDetailId is provided
  const { data: serialBatchData } = useSerialBatchNumberList(
    partAssemblyDetailId ?? NUMBERMAP.ZERO,
    !!partAssemblyDetailId
  )

  // Load existing serial batch number data when data is fetched
  useEffect(() => {
    if (serialBatchData?.data && serialBatchData?.data?.length > NUMBERMAP.ZERO && partAssemblyDetailId) {
      const existingData = serialBatchData.data[NUMBERMAP.ZERO]

      if (existingData) {
        // Handle both camelCase and snake_case from API
        const apiData = existingData
        setIsSerialBatchRequired(apiData?.is_serial_batch_required ?? null)
      }
      isInitialDataLoad.current = false
    }
  }, [serialBatchData, partAssemblyDetailId])

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SerialBatchNumberFormData, string>> = {}

    // Validate Serial/Batch Number (required)
    if (isSerialBatchRequired === null) {
      newErrors.serialBatchNumber = 'Serial/Batch Number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSave = () => {
    if (!partAssemblyDetailId) return
    
    // Validate form before saving
    if (!validateForm()) {
      return
    }
    
    // Validation ensures isSerialBatchRequired is not null at this point
    upsertSerialBatchNumber({
      applicable_settings_id: partAssemblyDetailId,
      is_serial_batch_required: isSerialBatchRequired as string | number,
    } as any)
  }

  const handleCancel = () => {
    router.push('/')
  }

  // Serial/Batch Number options for RadioButtonGroup
  const serialBatchNumberOptions = [
    { value: NUMBERMAP.ONE, label: 'Yes' },
    { value: NUMBERMAP.ZERO, label: 'No' },
  ]

  return (
    <>
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <RadioButtonGroup
            label={'Serial/Batch Number*'}
            name="serialBatchNumber"
            options={serialBatchNumberOptions}
            value={isSerialBatchRequired ?? ''}
            error={errors.serialBatchNumber}
            onChange={(value: string | number) => {
              setIsSerialBatchRequired(value)
              // Clear error when user selects a value
              if (errors.serialBatchNumber) {
                setErrors((prevErrors) => ({ ...prevErrors, serialBatchNumber: undefined }))
              }
            }}
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

export default SerialBatchNumberForm

