/**
 * Hazard Identification Tool Page
 * Classification: Confidential
 */

'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Grid2 } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import {
  Label,
  MultiSelect,
  RichTextEditor,
  showActionAlert,
} from '@/components/ui'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'
import { HAZARD_IDENTIFICATION_TOOL_CONSTANTS } from '@/constants/modules/risk-management/hazardIdentificationTool'
import { BUTTON_LABEL, KEY, NUMBERMAP, STATUS, DRAFT } from '@/constants/common'
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import {
  useHazardIdentificationToolByProject,
  useHazardIdentificationToolDropdown,
  useUpsertHazardIdentificationTool,
} from '@/hooks/modules/risk-management/useHazardIdentificationTool'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

const { TITLE, MULTI_SELECT, DESCRIPTION, ERROR_MESSAGES } =
  HAZARD_IDENTIFICATION_TOOL_CONSTANTS

const HazardIdentificationToolPage: React.FC = () => {

  const router = useRouter()
  const { id } = useParams()
  const projectId = Number(id)
  const [formData, setFormData] = useState({
    selectedTools: [] as number[],
    description: '',
  })
  const [toolsError, setToolsError] = useState<string>('')
  const isInitialDataLoad = useRef(true)
  const { data: toolOptions } = useHazardIdentificationToolDropdown(
    NUMBERMAP.ONE
  )
  const { data: projectData, isLoading, refetch } = useHazardIdentificationToolByProject(projectId)
  const { mutate: upsertHazardIdentificationTool, isPending: isSaving } =
    useUpsertHazardIdentificationTool(projectId)
  const {
    draftSave,
    clearDraftSave,
    isDraftSaving,
    checkUnsavedDraftBeforeLeave,
  } = useDraftSave({
    onSuccess: refetch,
  })

  useEffect(() => {
    if (projectData?.data) {
      const data = projectData.data
      if (data && typeof data === 'object' && (data as any).type === DRAFT) {
        const preselectedIds = data?.tools?.map((tool: any) => tool.id) ?? data?.tool_list ?? []
        setFormData((prev) => ({
          ...prev,
          selectedTools: preselectedIds,
          description: data?.description ?? '',
        }))
      } else if (Array.isArray(data) && data.length > NUMBERMAP.ZERO) {
        const dataItem = data[NUMBERMAP.ZERO]
        const preselectedIds = dataItem?.tools?.map((tool: any) => tool.id) ?? dataItem?.tool_list ?? []
        setFormData((prev) => ({
          ...prev,
          selectedTools: preselectedIds,
          description: dataItem?.description ?? '',
        }))
      }
      setToolsError('') // Clear errors when loading new data

      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false
      }, NUMBERMAP.THOUSAND)
    }
  }, [projectData])

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(APPLICABILITY_ROUTES.RISK_MANAGEMENT)
  }

  const handleSave = () => {
    if (formData.selectedTools.length === NUMBERMAP.ZERO) {
      setToolsError(ERROR_MESSAGES.TOOL_REQUIRED)
      return
    }
    setToolsError('')

    const payload = {
      project_id: projectId,
      tool_list: formData.selectedTools.map((tool) => Number(tool)),
      description: formData.description,
    }
    clearDraftSave()

    upsertHazardIdentificationTool(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  const permissions =
    projectData?.meta_info?.action_control?.permissions ?? []

  const actionHandlers: Record<string, (id: number) => void | Promise<void>> = {
    [BUTTON_LABEL.CANCEL]: () => handleCancel(),
    [BUTTON_LABEL.SAVE]: () => handleSave(),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, actionHandlers, isSaving)

  const handleDraftSave = (formData) => {
    const payload = {
      project_id: projectId,
      tool_list: formData.selectedTools.map((tool: number) => Number(tool)),
      description: formData.description,
      type: DRAFT,
    }
    draftSave({
      project_id: projectId,
      form_type: KEY,
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }

  const isAnyLoading = () => {
    if (isSaving) return true;
    if (isLoading) return true;
    return false;
  };

  useEffect(() => {
    if (!isLoading && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [buttonDetails, isLoading])

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isAnyLoading()} />
      <FormWrapper>
        <Label title={TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <MultiSelect
                label={MULTI_SELECT.LABEL}
                placeholder={MULTI_SELECT.PLACEHOLDER}
                options={toolOptions?.data ?? []}
                idField={MULTI_SELECT.ID_FIELD}
                valueField={MULTI_SELECT.VALUE_FIELD}
                value={formData.selectedTools}
                onChange={(value) => {
                  if (!hasEditPermission) {
                    return
                  }
                  const selected = (value as Array<string | number>).map(
                    (tool) => Number(tool)
                  )
                  setFormData((prev) => {
                    const updated = { ...prev, selectedTools: selected }
                    if (!isInitialDataLoad.current) {
                      handleDraftSave(updated)
                    }
                    return updated
                  })
                  if (selected.length > NUMBERMAP.ZERO) {
                    setToolsError('')
                  }
                }}
                error={toolsError}
                disabled={!hasEditPermission}
              />
            </Grid2>

            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={DESCRIPTION.LABEL}
                placeholder={DESCRIPTION.PLACEHOLDER}
                value={formData.description}
                onChange={(value) => {
                  if (!hasEditPermission) {
                    return
                  }
                  setFormData((prev) => {
                    const updated = { ...prev, description: value }
                    if (!isInitialDataLoad.current) {
                      handleDraftSave(updated)
                    }
                    return updated
                  })
                }}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>
          <RiskNavigationButtonGroup projectId={projectId} buttons={buttonDetails ?? []}/>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default HazardIdentificationToolPage
