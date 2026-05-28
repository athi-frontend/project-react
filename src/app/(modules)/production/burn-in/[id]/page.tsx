'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Grid2 } from '@mui/material'
import { ButtonGroup, Label, InputField, RichTextEditor, RadioButtonGroup, DataTable } from '@/components/ui'
import { PageContainer, P20P40 } from '@/styles/common'
import { NUMBERMAP ,STATUS} from '@/constants/common'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import { radioOptions } from '@/lib/modules/dnd/dir'
import { useFetchModels } from '@/hooks/modules/dnd/useDirSpecificataion'
import { useBurnInByProjectId, useCreateOrUpdateBurnIn } from '@/hooks/modules/production/useBurnIn'
import { BurnInPayload } from '@/types/modules/production/burnIn'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import ActionButton from '@/components/ui/action-button/ActionButton'
import { PADDING20 } from '@/styles/modules/risk-management/riskAssessmentMatrix'

/**
 * Classification: Confidential
 * Burn In Page
 */

const BurnInPage: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.id as string

  const [formData, setFormData] = useState<{
    product_variants_id: string
    is_burn_in_required: string
    description: string
  }>({
    product_variants_id: '',
    is_burn_in_required: '',
    description: '',
  })

  const [errors, setErrors] = useState<{
    product_variants_id?: string
    is_burn_in_required?: string
    description?: string
  }>({})

  // Fetch models
  const { data: modelsData } = useFetchModels(projectId ?? '', NUMBERMAP.ONE)

  // Fetch burn-in data - fetch when product_variants_id is available
  const { data: burnInData, isLoading: isLoadingBurnIn } = useBurnInByProjectId(
    formData.product_variants_id ? projectId : undefined,
    formData.product_variants_id ? Number(formData.product_variants_id) : undefined
  )

  // Mutation for create/update
  const { mutate: saveBurnIn, isPending: isSaving } = useCreateOrUpdateBurnIn()

  // Feature details come from burn-in API response (feature_details array)
  const featureDetails = burnInData?.data?.[NUMBERMAP.ZERO]?.feature_details ?? []
  const featureRows = featureDetails.map((fd: { model_feature_mapper_id: number; feature_name: string }, idx: number) => ({
    ...fd,
    sno: idx + NUMBERMAP.ONE,
  }))

  // Populate form when data is loaded
  useEffect(() => {
    if (burnInData?.data && burnInData.data.length > NUMBERMAP.ZERO) {
      const burnIn = burnInData.data[NUMBERMAP.ZERO]
      setFormData((prev) => ({
        ...prev,
        product_variants_id: burnIn.product_variants_id?.toString() ?? prev.product_variants_id,
        is_burn_in_required: burnIn.is_burn_in_required?.toString() ?? prev.is_burn_in_required,
        description: burnIn.description ?? prev.description,
      }))
    } else {
      setFormData((prev) => ({
        ...prev, is_burn_in_required: '',
        description: ''
      }))
    }
  }, [burnInData])

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.product_variants_id) {
      newErrors.product_variants_id = 'Model is required'
    }
    if (!formData.is_burn_in_required) {
      newErrors.is_burn_in_required = 'Burn In Required is required'
    }
    if (!formData.description) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const payload: BurnInPayload = {
      project_id: projectId,
      product_variants_id: Number(formData.product_variants_id),
      is_burn_in_required: formData.is_burn_in_required,
      description: formData.description,
    }

    // Include burn_in_id if updating
    if (burnInData?.data && burnInData.data.length > NUMBERMAP.ZERO && burnInData.data[NUMBERMAP.ZERO].burn_in_id) {
      payload.burn_in_id = burnInData.data[NUMBERMAP.ZERO].burn_in_id
    }

    saveBurnIn(payload, {
      onSuccess: () => {
          showActionAlert(STATUS.SUCCESS)
      },
      onError: (error) => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  const handleCancel = () => {
    router.back()
  }

  // Handle action for feature row: ensure burn-in exists, then open protocol page (path-based URL, no query params)
  const handleFeatureEdit = (row: { model_feature_mapper_id: number; burn_in_test_protocol_id?: number | null }) => {
    const payload: BurnInPayload = {
      project_id: Number(projectId),
      product_variants_id: Number(formData.product_variants_id),
      is_burn_in_required: formData.is_burn_in_required,
      description: formData.description,
    }
    const first = burnInData?.data?.[NUMBERMAP.ZERO]
    if (first?.burn_in_id) payload.burn_in_id = first.burn_in_id

    const navigateToProtocol = (burnInId: number) => {
      const protocolOrMapperId = row.burn_in_test_protocol_id ?? row.model_feature_mapper_id
      router.push(`/production/burn-in/protocol/${projectId}/${burnInId}/${protocolOrMapperId}`)
    }

    if (first?.burn_in_id != null) {
      navigateToProtocol(first.burn_in_id)
      return
    }

    saveBurnIn(payload, {
      onSuccess: (response) => {
        const data = response?.data
        const record = Array.isArray(data) ? data[NUMBERMAP.ZERO] : data
        const burnInId = record?.burn_in_id
        if (burnInId != null) {
          navigateToProtocol(burnInId)
        } else {
          showActionAlert(STATUS.FAILED)
        }
      },
      onError: () => showActionAlert(STATUS.FAILED),
    })
  }



  // Define columns for product features table
  const productFeatureColumns: GridColDef[] = [
    {
      field: 'sno',
      headerName: 'S.No',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'feature_name',
      headerName: 'Feature',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: NUMBERMAP.ONE,
      sortable: false,
      headerAlign:"center",
      align:"center",
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          onEdit={() => handleFeatureEdit(params.row)}
        />
      ),
    },
  ]

  return (
    <PageContainer>
      <Label title={'Set Burn In'} />

      <Grid2 container spacing={NUMBERMAP.ZERO} >
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} sx={PADDING20}>
          <InputField
            label={'Model*'}
            isDropdown
            options={modelsData?.data ?? []}
            keyField="model_id"
            valueField="model_name"
            placeholder={'Select Model'}
            value={formData.product_variants_id ?? ''}
            onChange={(value: string) => {
              setErrors((prev)=>({...prev,product_variants_id:''}))
              setFormData((prev) => ({ ...prev, product_variants_id: value ?? '' }))
            }}
            error={errors.product_variants_id}
            disabled={isLoadingBurnIn ?? isSaving}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }} sx={PADDING20}>
          <RadioButtonGroup
            label={'Burn In Required*'}
            name="burnInType"
            options={radioOptions}
            value={formData.is_burn_in_required}
            onChange={(value: string | number) => {
              setErrors((prev)=>({...prev,is_burn_in_required:''}))
              setFormData((prev) => ({ ...prev, is_burn_in_required: String(value) }))
            }}
            error={errors.is_burn_in_required}
          />
        </Grid2>
        {formData.is_burn_in_required == NUMBERMAP.ONE.toString() && formData.product_variants_id && (
          <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
            <DataTable
              rows={featureRows}
              columns={productFeatureColumns}
              IdField="model_feature_mapper_id"
              loading={isLoadingBurnIn}
            />
          </Grid2>
        )}


        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} sx={{ padding: PADDING20 }}>
          <RichTextEditor
            label={'Burn In Description*'}
            placeholder={'Enter Burn In Description'}
            value={formData.description}
            onChange={(value: string) => {
              setErrors((prev)=>({...prev,description:''}))
              setFormData((prev) => ({ ...prev, description: value }))
            }}
            error={errors.description}
          />
        </Grid2>
      </Grid2>

      {/* Product Features Table - Show when Burn In Required is Yes */}
  
      <div style={P20P40}>
        <ButtonGroup
          buttons={[
            {
              label: 'Cancel',
              onClick: handleCancel,
            },
            {
              label: 'Save',
              onClick: handleSave,
              disabled: isSaving ?? isLoadingBurnIn,
            },
          ]}
        />
      </div>

    </PageContainer>
  )
}

export default BurnInPage
