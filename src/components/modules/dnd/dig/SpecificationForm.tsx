'use client'
import React, { useEffect, useState } from 'react'
import {
  FormTeamContainer,
  HeaderContainer,
  Title,
  ContentContainer,
  CHECKBOX_SX,
  CommentsHistoryContainer
} from '@/styles/modules/dnd/specificationList'
import {  Checkbox, Grid2 } from '@mui/material'
import {
  useSpecifications,
  useSaveTeam,
} from '@/hooks/modules/dnd/useDigSpecification'
import { DataGridTable } from '@/components/ui'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import {
  TITLE_VARIANT,
  FIELD_NAMES,
  SPECID,
  TITLE,
  BUTTONSTYLE,
  UNCHECK,
  SAVE,
  CHECK,
} from '@/constants/modules/dnd/digSpecificaton'
import { specificationListColumns } from '@/lib/modules/dnd/digSpecification'
import {
  SpecificationResponse,
  SpecificationPayloadItem,
} from '@/types/modules/dnd/digSpecification'
import { NUMBERMAP} from '@/constants/common'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { useParams, useRouter } from 'next/navigation'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
/**
 Classification : Confidential
**/

interface RowData {
  id: string | number
}
const SpecificationListComponent: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = Number(params.id)
  const [specifications, setSpecifications] = useState<
    SpecificationResponse[] | []
  >([])
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string | number]: boolean
  }>({})
  const [hasEditPermission, setHasEditPermission] = useState(true)
  const { data: rawSpecifications, isLoading: isLoadingSpecifications, isFetching: isFetchingSpecifications } = useSpecifications(projectId)
  const {
    mutate: saveTeam,
    isPending: isSaving,
  } = useSaveTeam(projectId)

  // Comprehensive loading state function
  const isAnyLoading = () => {
    if (isLoadingSpecifications) return true
    if (isFetchingSpecifications) return true
    if (isSaving) return true
    return false
  }

  const isUnChecked = rawSpecifications?.meta_info?.action_control?.permissions?.some(
    (perm: { action: string; trigger_status_id?: number }) => perm.action === UNCHECK
  ) ?? false

  const isSave = rawSpecifications?.meta_info?.action_control?.permissions?.some(
    (perm: { action: string; trigger_status_id?: number }) => perm.action === SAVE
  ) ?? false

  const getInitialCheckboxState = (spec: SpecificationResponse): boolean => {
    if (spec.applicable_status === null) {
      return Boolean(spec.default_applicability)
    }
    return Boolean(spec.applicable_status)
  }
  const isCheckboxDisabled = (
    hasSavePermission: boolean,
    hasUncheckPermission: boolean,
    defaultApplicability: number
  ): boolean => {
    // If user doesn't have save permission, disable checkbox
    if (!hasSavePermission) {
      return true
    }
    
    // If user doesn't have uncheck permission and specification is default applicable, disable checkbox
    if (!hasUncheckPermission && defaultApplicability) {
      return true
    }
    
    // Otherwise, enable checkbox
    return false
  }

useEffect(() => {
    if (rawSpecifications?.data) {
      setSpecifications(rawSpecifications.data)
      setCheckboxStates(
        rawSpecifications.data.reduce(
          (acc, spec) => {
              const  checkstatus = getInitialCheckboxState(spec)
            return {
              ...acc,
              [spec.design_specification_type_id]: checkstatus,
            };
          },
          {}
        )
      )
    }
  }, [rawSpecifications])

  const handleCheckboxChange =
    (id: string | number,event: React.ChangeEvent<HTMLInputElement>)=> {
      setCheckboxStates((prev) => ({
        ...prev,
        [id]: event.target.checked,
      }))
    }

  const handleSave = () => {
    if (!specifications) return
    let specificationPayload: SpecificationPayloadItem[] = []
    if (Object.keys(checkboxStates).length > NUMBERMAP.ZERO) {
      specificationPayload = Object.keys(checkboxStates).map((id) => ({
        specification_id: id.toString(),
        is_applicable: checkboxStates[Number(id)] ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
      }))
    }
    const payload = {
      project_id: projectId,
      specification: specificationPayload,
    }
    saveTeam(payload)
  }

  const columns = specificationListColumns.map((col) =>
    col.field === FIELD_NAMES.ACTIONS
      ? {
          ...col,
              renderCell: (params: GridRenderCellParams<RowData>) => {
                          
             return (
             <Checkbox
               disabled={isCheckboxDisabled(isSave, isUnChecked, params.row.default_applicability)}
               checked={checkboxStates[params.row.design_specification_type_id] ?? false}
               onChange={(e)=>handleCheckboxChange(
                 params.row.design_specification_type_id,e
               )}
               sx={CHECKBOX_SX}
             />
           )},
        }
      : col
  )

  const buttonPermissions = rawSpecifications?.meta_info?.action_control.permissions.filter(
    (perm : { action: string; trigger_status_id?: number }) => perm.action !== CHECK && perm.action !== UNCHECK
  )
  

  return (
  <>
  <GlobalLoader loading={isAnyLoading()} />
  {rawSpecifications && (
    <FormTeamContainer>
      <HeaderContainer>
        <Title variant={TITLE_VARIANT}>{TITLE}</Title>
      </HeaderContainer>
      <ContentContainer sx={{pointerEvents: !hasEditPermission ? 'none' : 'auto'}}>
        <DataGridTable
          idField={SPECID}
          columns={columns}
          rows={specifications}
          hideFooter
        />
      </ContentContainer>
      <CommentsHistoryContainer>
       <CommentsHistory
            comments={rawSpecifications?.meta_info?.task_info?.task_comments}
          />
        </CommentsHistoryContainer>
      <Grid2 container>
          <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
            <ReviewerModalManager
              isLoading={isLoadingSpecifications}
              permissions={buttonPermissions ?? []}
              projectId={projectId}
              menuId={rawSpecifications?.meta_info?.action_control?.menuId}
              menuName={rawSpecifications?.meta_info?.action_control?.formName}
              onPermissionChange={setHasEditPermission}
              customHandlers={{
                handleCancel: () => {router.push(ROUTE_PATHS.DND_PROJECT_LIST)},
                handleSave,
                isDisabled: isSaving
              }}
              reviewerList={rawSpecifications?.meta_info?.task_info?.reviewer_list}
            />
          </Grid2>
        </Grid2>
    </FormTeamContainer>
    )}
    </>
  )
}

export default SpecificationListComponent
