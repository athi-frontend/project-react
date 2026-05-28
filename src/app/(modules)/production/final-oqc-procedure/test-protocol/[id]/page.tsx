'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageContainer } from '@/styles/common'
import { ActionButton, DataTable, Description, InputField, MultiSelect, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { NUMBERMAP } from '@/constants/common'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { useGetProductFeatures, useUpsertProductFeature, useGetProductFeatureById } from '@/hooks/modules/production/useProductFeature'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { useFetchModels } from '@/hooks/modules/dnd/useDirSpecificataion'
import { Grid2, IconButton } from '@mui/material'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import { Setting2 } from 'iconsax-react'
import { useTheme } from '@mui/material/styles'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { VALIDATION_MESSAGES } from '@/constants/modules/production/testProtocol'
import { TestProtocolFormData, TestProtocolFormError } from '@/types/modules/production/finalOQC'
/**
 * Classification: Confidential
 * Bill of Material List Page
 */

const TestProtocolPage: React.FC = () => {
  const theme = useTheme();


  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)
  const router = useRouter()
  const [featureModel, setFeatureModel] = useState<boolean>(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [formData, setFormData] = useState<TestProtocolFormData>({
    feature_name: '',
    description: '',
    model_id: [],
    status_id: '',
  })
  const [formError, setFormError] = useState<TestProtocolFormError>({
    feature_name: '',
    description: '',
    model_id: '',
    status_id: '',
  })
  const formValidation = (formData: TestProtocolFormData) => {
    const newErrors: TestProtocolFormError = {
      feature_name: '',
      description: '',
      model_id: '',
      status_id: '',
    };
    
    if (!formData.feature_name?.trim()) {
      newErrors.feature_name = VALIDATION_MESSAGES.FEATURE_TITLE_REQUIRED;
    }
    if (!formData.description?.trim()) {
      newErrors.description = VALIDATION_MESSAGES.FEATURE_DESCRIPTION_REQUIRED;
    }
    if (!formData.model_id || formData.model_id.length === NUMBERMAP.ZERO) {
      newErrors.model_id = VALIDATION_MESSAGES.MODEL_REQUIRED;
    }
    if (!formData.status_id) {
      newErrors.status_id = VALIDATION_MESSAGES.STATUS_REQUIRED;
    }
    
    setFormError(newErrors);
    return Object.keys(newErrors).some(key => newErrors[key as keyof typeof newErrors] !== '');
  }

  // Draft save hook
  const productFeatureIdForDraft = editId
  const { 
    draftSave, 
    clearDraftSave, 
    isDraftSaving, 
    draftData, 
    fetchDraft, 
    checkUnsavedDraftBeforeLeave 
  } = useDraftSave({
    context_type: "product_features",
    context_instance_id: productFeatureIdForDraft,
    enableFetch: false
  })

  // Draft save handler - must be defined after useDraftSave hook
  const handleDraftSave = useCallback((formDataToSave: TestProtocolFormData) => {
    const payload = {
      id: productFeatureIdForDraft ?? new Date().getTime(),
      ...formDataToSave,
      type: 'draft',
    }

    draftSave({
      form_data: payload
    })
  }, [draftSave, productFeatureIdForDraft])

  const handleSave = () => {
    // Validate; call upsert
    if (formValidation(formData)) { return; }
    
    clearDraftSave()

    upsertMutation.mutate({
      ...(editId ? { product_feature_id: editId } : {}),
      project_id: projectId,
      feature_name: formData.feature_name,
      feature_description: formData.description,
      model: formData.model_id,
      status: Number(formData.status_id),
    }, {
      onSuccess: () => {
        setFeatureModel(false);
        setEditId(null);
        showActionAlert('success')
        setFormData({ feature_name: '', description: '', model_id: [], status_id: '' });
        setFormError({ feature_name: '', description: '', model_id: '', status_id: '' });
      },
      onError: (e: any) => showActionAlert('failed')
    });
  }
  // API: /api/v1/production/product-feature/all?project_id=<id>&status=1
  const { data: productFeatures, isLoading, error } = useGetProductFeatures(projectId, 1)

  // Fetching models and status options for dropdowns
  const { data: statusData } = useOrganizationStatus(1);
  const statusOptions = (statusData as any)?.data ?? statusData ?? [];

  const { data: modelsResponseData } = useFetchModels(String(projectId), 1);
  const modelsOptions = (modelsResponseData as any)?.data ?? modelsResponseData ?? [];

  const upsertMutation = useUpsertProductFeature();
  const { data: editFeature, isFetching: isFetchingEdit } = useGetProductFeatureById(editId ?? undefined);
  useEffect(() => {
    if (error) showActionAlert('failed')
  }, [error])

  const columns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF,
    },
    {
      field: 'feature_name',
      headerName: 'Feature',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'model_name',
      headerName: 'Model',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'feature_model_id',
      headerName: 'Procedure',
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => router.push(`/production/final-oqc-procedure/test-protocol/${id}/${params.row?.feature_model_id}`)}>
          <Setting2 size="20" color={theme.palette.primary.main} />
        </IconButton>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          onEdit={() => {
            setEditId(params.row.product_feature_id);
            setFeatureModel(true);
          }}
        />
      ),
    }
  ]


  // Helper function to normalize editFeature data structure
  // Handles both array [{}] and object {} structures
  const getEditFeatureData = useCallback(() => {
    if (!editFeature?.data) return null
    
    // If data is an array, get first element
    if (Array.isArray(editFeature.data) && editFeature.data.length > NUMBERMAP.ZERO) {
      return editFeature.data[NUMBERMAP.ZERO]
    }
    
    // If data is an object, return it directly
    if (typeof editFeature.data === 'object' && !Array.isArray(editFeature.data)) {
      return editFeature.data
    }
    
    return null
  }, [editFeature])

  // Load draft data
  const loadDraftData = useCallback((data: any) => {
    const resolvedData = Array.isArray(data?.data)
      ? data.data[NUMBERMAP.ZERO]
      : data?.data ?? data ?? {}
    
    setFormData({
      feature_name: resolvedData.feature_name ?? '',
      description: resolvedData.feature_description ?? resolvedData.description ?? '',
      model_id: resolvedData.model_id ?? resolvedData.model?.map((item: any) => item.model_id ?? item) ?? [],
      status_id: resolvedData.status_id ?? '',
    })
  }, [])

  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData, loadDraftData])

  // FormData filling logic - modal edit or clear on open/change
  useEffect(() => {
    const normalizedEditFeature = getEditFeatureData()
    if (normalizedEditFeature) {
      setFormData({
        feature_name: normalizedEditFeature.feature_name ?? '',
        description: normalizedEditFeature.feature_description ?? '',
        model_id: normalizedEditFeature.model?.map((item: any) => item.model_id ?? item) ?? [],
        status_id: normalizedEditFeature.status_id ?? '',
      });
    }
    if (featureModel && !editId) {
      setFormData({ feature_name: '', description: '', model_id: [], status_id: '' });
      // Fetch draft when opening modal in create mode
      if (!editId) {
        fetchDraft()
      }
    }
  }, [editFeature, featureModel, editId, getEditFeatureData, fetchDraft]);

  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <CommonSharedTale
        title={"Test Protocol"}
        hanldeClick={() => setFeatureModel(true)}
        pathName="#"
        Table={
          <DataTable
            rows={productFeatures?.data ?? []}
            columns={columns}
            IdField="product_feature_id"
            loading={isLoading}
          />
        }
      />
      <CommonModal title={editId ? 'Edit Test Feature' : 'Add Test Feature'} buttonRequired onSave={handleSave} open={featureModel} onClose={async () => {
        await checkUnsavedDraftBeforeLeave()
        setFeatureModel(false);
        setEditId(null);
        setFormData({ feature_name: '', description: '', model_id: [], status_id: '' });
        setFormError({ feature_name: '', description: '', model_id: '', status_id: '' });
      }}>
        {isFetchingEdit && <GlobalLoader loading={isFetchingEdit} />}
        <Grid2 container spacing={NUMBERMAP.ONE} sx={POPUP_STYLE}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label="Feature Title*"
              placeholder="Enter the feature title"
              value={formData.feature_name}
              onChange={(value: string) => {
                const updated = { ...formData, feature_name: value }
                setFormData(updated)
                setFormError({ ...formError, feature_name: '' })
                handleDraftSave(updated)
              }}
              error={formError.feature_name}
            />

          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label="Feature Description*"
              value={formData.description}
              onChange={(value: string) => {
                const updated = { ...formData, description: value }
                setFormData(updated)
                setFormError({ ...formError, description: '' })
                handleDraftSave(updated)
              }}
              placeholder="Enter the feature description"
              error={formError.description}
            />

          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <MultiSelect
              label="Model*"
              options={modelsOptions}
              idField="model_id"
              valueField="model_name"
              value={formData.model_id}
              onChange={(value: (string | number)[]) => {
                const updated = { ...formData, model_id: value.map(Number) }
                setFormData(updated)
                setFormError({ ...formError, model_id: '' })
                handleDraftSave(updated)
              }}
              error={formError.model_id}
              placeholder="Select Model(s)"
            />

          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label="Status*"
              isDropdown
              options={statusOptions}
              placeholder="Select Status"
              keyField="status_id"
              valueField="status_name"
              value={formData.status_id ? String(formData.status_id) : ''}
              onChange={(value: string) => {
                const updated = { ...formData, status_id: Number(value) }
                setFormData(updated)
                setFormError({ ...formError, status_id: '' })
                handleDraftSave(updated)
              }}
              error={formError.status_id}
            />

          </Grid2>
        </Grid2>
      </CommonModal>
    </PageContainer>
  )
}

export default TestProtocolPage
