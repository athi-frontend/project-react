'use client'
import React, { useState, useEffect } from 'react'
import {
  Description,
} from '@/components/ui'
import DeliverableTable from './DeliverableTable'
import UnitsVerificationTable from './UnitsVerificationTable'
import {
  FormContainer,
  FormSection,
  FormTitle,
  FormContent,
  FormRow,
  LabelContainer,
  LabelText,
  LabelValue,
} from '@/styles/components/modules/prototypeForm'
import {
  FormState,
} from '@/types/components/modules/prototypeForm'
import { PROTOTYPE_FORM_CONSTANTS, FIELD_ORDER, FIELD_LABEL_MAP } from '@/constants/components/ui/prototypeForm'
import { Grid2 } from '@mui/material'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import {
  usePrototypeData,
} from '@/hooks/modules/dnd/useProjectStages'
import { usePostPrototype } from '@/hooks/modules/dnd/usePrototype'
import { SUCCESS_ALERT } from '@/constants/modules/dnd/feasibilityStudy'
import { FAILED_ALERT } from '@/constants/modules/dnd/formTeam'
import { PLACEHOLDER } from '@/constants/modules/dnd/prototype'
import { useParams, useRouter } from 'next/navigation'
import { BUTTONSTYLE, NUMBERMAP } from '@/constants/common'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import { initialFormState } from '@/lib/modules/dnd/prototypeForm'
import { stripHtml } from '@/lib/utils/common'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'

/**
    Classification : Confidential
**/
const {
  DESCRIPTION_REQUIRED,
  DESCRIPTION_LABEL,
  OTHER_DETAILS_LABEL,
  ADDITIONAL_REQUIREMENTS_LABEL,
  SAVE,
  CANCEL,
  ADDITIONAL_REQUIREMENTS_FIELD,
  CONCLUSION_FIELD,
  REMARKS_FIELD,
  DESCRIPTION_FIELD,
  OTHER_DETAILS_FIELD,
} = PROTOTYPE_FORM_CONSTANTS

const PrototypeForm: React.FC<{ type?: string }> = ({ type }) => {
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const router = useRouter()
  const params = useParams();
  const project_stage_order_id = params.order_id
  const projectId = params.id
  const { data: prototypeData, isLoading: protoLoading, isFetching: protoFetching } = usePrototypeData(Number(project_stage_order_id))
  const { mutate: prototypeFormData, isPending: isSaving } = usePostPrototype(project_stage_order_id)
  const [ownerName, setOwnerName] = useState()
  const [membersList, setMembersList] = useState()
  const [qualityObjective, setQualityObjective] = useState<string>('')
  const [prototypeName, setPrototypeName] = useState()
  const [stageNumber, setstageNumber] = useState()
  const [deliverables, setDeliverables] = useState<any[]>([])
  const [unitsToBeVerified, setUnitsToBeVerified] = useState<number>()
  const [itemForTest, setItemForTest] = useState<any[]>([])
  const [hasEditPermission, setHasEditPermission] = useState(true)

  const [formState, setFormState] = useState<FormState>(initialFormState)
  useEffect(() => {
    if (prototypeData?.data[NUMBERMAP.ZERO]) {
      const data = prototypeData.data[NUMBERMAP.ZERO]
      setFormState({
        description: data.description,
        otherDetails: data.other_details,
        additionalRequirements: data.additional_design_quality_requirement,
        conclusion: data.conclusion,
        comments: data.comments,
        remarks: data.remarks,
      })
    }
  }, [prototypeData])

  useEffect(() => {
    const data = prototypeData?.data?.[NUMBERMAP.ZERO]
    if (data) {
      const owner = (data.owner_first_name && data.owner_last_name) 
    /**
     * Function Name: owner
     * Params: firstName, lastName
     * Description: to get the owner name
     * Author: Mayuri,
     * modified: 09-09-2025,
     * Classification : Confidential
    **/
        ? `${data.owner_first_name} ${data.owner_last_name}` 
        : '-'
      const members = data.members?.map((m) => `${m.firstName} ${m.lastName}`).join(', ') ?? '-'

      setOwnerName(owner)
      setMembersList(members)
      setQualityObjective(data.quality_objective)
      setPrototypeName(data.design_stage)
      setstageNumber(data.stage_number)    
      setDeliverables(data.deliverables)     
      // Handle units and item_for_test
      setUnitsToBeVerified(data.units_to_be_verified)
      setItemForTest(data.item_for_test ?? [])
    }
  }, [prototypeData])

  const handleChange = (field: keyof FormState, value: string | number) => {
    if(!hasEditPermission) return;
    setFormState((prev) => ({
      ...prev,
      [field]: String(value),
    }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors: Partial<FormState> = {}
    if (!formState.description?.trim()) newErrors.description = DESCRIPTION_REQUIRED
    setErrors(newErrors)
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      validateAndFocusFirstEmptyField(formState, Array.from(FIELD_ORDER), FIELD_LABEL_MAP);
    }
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }
  const handleCancel = () => {
    router.push(ROUTE_PATHS.DND_PROJECT_LIST)
  }
  const handleSubmit = () => {
    if (!validateForm()) return

    // Convert itemForTest to the format expected by API
    const itemForTestPayload = itemForTest.map((item) => ({
      batch_number: item.batch_number,
      batch_name: item.batch_name ?? '',
    }))

    // Convert deliverables to execution_dir format
    const executionDirPayload = deliverables.map((item) => ({
      execution_stage_deliverables_id: item.execution_stage_deliverables_id ?? item.id,
      comments: item.comments ?? '',
    }))

    const payload = {
      description: formState.description,
      other_details: formState.otherDetails,
      additional_design_quality_requirement: formState.additionalRequirements,
      conclusion: formState.conclusion,
      remarks: formState.remarks,
      units_to_be_verified: unitsToBeVerified,
      item_for_test: itemForTestPayload,
      execution_dir: executionDirPayload,
    }

    prototypeFormData(payload, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT)
      },
      onError: () => showActionAlert(FAILED_ALERT),
    })
  }

  const isAnyLoading = () => {
    if (protoLoading) return true
    if (protoFetching) return true
    if (isSaving) return true
    return false
  }


  return (
    <FormContainer>
      <GlobalLoader loading={isAnyLoading()} />
      {prototypeData && (
      <FormSection>
        <FormTitle>{type ?? "Prototype"}</FormTitle>
        <FormContent>
          <FormRow>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={NUMBERMAP.SIX}>
                <LabelContainer>
                  <LabelText>{type ?? "Prototype"}</LabelText>
                  <LabelValue>{`${prototypeName} ${stageNumber}`}</LabelValue>

                </LabelContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <LabelContainer>
                  <LabelText>Owner</LabelText>
                  <LabelValue>{ownerName}</LabelValue>
                </LabelContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <LabelContainer>
                  <LabelText>Members</LabelText>
                  <LabelValue>{membersList}</LabelValue>
                </LabelContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <LabelContainer>
                  <LabelText>Quality Objective</LabelText>
                  <LabelValue>{stripHtml(qualityObjective)}</LabelValue>
                </LabelContainer>
              </Grid2>
            </Grid2>
          </FormRow>
          <FormRow>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={NUMBERMAP.SIX}>
                <Description
                  label={DESCRIPTION_LABEL}
                  placeholder={PLACEHOLDER.DESCRIPTION}
                  value={formState.description ?? ''}
                  onChange={(value) => handleChange(DESCRIPTION_FIELD, value)}
                  error={errors.description}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <Description
                  label={OTHER_DETAILS_LABEL}
                  placeholder={PLACEHOLDER.OTHER_DETAILS}
                  value={formState.otherDetails ?? ''}
                  onChange={(value) => handleChange(OTHER_DETAILS_FIELD, value)}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <Description
                  label={ADDITIONAL_REQUIREMENTS_LABEL}
                  placeholder={PLACEHOLDER.ADDITIONAL_REQUIREMENTS}
                  value={formState.additionalRequirements ?? ''}
                  onChange={(value) =>
                    handleChange(ADDITIONAL_REQUIREMENTS_FIELD, value)
                  }
                />
              </Grid2>
               <Grid2 size={NUMBERMAP.SIX}>
                <Description
                  label={PROTOTYPE_FORM_CONSTANTS.CONCLUSION_LABEL}
                  placeholder={PLACEHOLDER.CONCLUSION}
                  value={formState.conclusion ?? ''}
                  onChange={(value) => handleChange(CONCLUSION_FIELD, value)}
                />
              </Grid2>
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <UnitsVerificationTable
                disabled={!hasEditPermission}
                initialRows={itemForTest.map((item) => ({
                  ...item,
                  batch_no: item.batch_number?.toString(),
                  unit_name: item.batch_name,
                }))}
                onUnitsChange={(units) => setUnitsToBeVerified(units)}
                onRowChange={(rows) => {
                  setItemForTest(rows.map((row) => ({
                    ...row,
                    batch_number: row.batch_no,
                    batch_name: row.unit_name,
                  })))
                }}
              />
            </Grid2>
            <DeliverableTable 
              deliverables={deliverables}
              onRowChange={(rows) => setDeliverables(rows)}
              disabled={!hasEditPermission}
            />
            <Grid2 size={NUMBERMAP.SIX} sx={STYLE5}>
                <Description
                  label={PROTOTYPE_FORM_CONSTANTS.REMARKS_LABEL}
                  placeholder={PLACEHOLDER.REMARKS}
                  value={formState.remarks ?? ''}
                  onChange={(value) => handleChange(REMARKS_FIELD, value)}
                />
            </Grid2> 
            <Grid2 sx={STYLE5}>
              <CommentsHistory
                comments={prototypeData?.meta_info?.task_info?.task_comments}
              />
            </Grid2>
          </FormRow>
        </FormContent>
        <Grid2 sx={BUTTONSTYLE}>
        <ReviewerModalManager
          isLoading={protoLoading}
          permissions={prototypeData?.meta_info?.action_control?.permissions ?? []}
          projectId={Number(projectId)}
          menuId={prototypeData?.meta_info?.action_control?.menuId}
          menuName={prototypeData?.meta_info?.action_control?.formName}
          customHandlers={{ 
            handleCancel: handleCancel,
            handleSave: handleSubmit,
            isDisabled: false
          }}
          taskId={prototypeData?.meta_info?.task_info?.task_id}
          onPermissionChange={setHasEditPermission}
          reviewerList={prototypeData?.meta_info?.task_info?.reviewer_list}
        />
        </Grid2>
      </FormSection>
      )}
    </FormContainer>
  )
}

export default PrototypeForm