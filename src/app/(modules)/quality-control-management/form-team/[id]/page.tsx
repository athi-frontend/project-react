'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { useParams, useRouter } from 'next/navigation'
import { Grid2, Box } from '@mui/material'
import {
  InputField,
  ButtonGroup,
  Label,
  showActionAlert,
} from '@/components/ui'
import { BUTTONSTYLE, NUMBERMAP, STATUS } from '@/constants/common'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import { ButtonContainer } from '@/styles/components/ui/button'
import {
  QCFormTeamDisabledInputStyles,
  QCFormTeamErrorStyles,
  QCFormTeamTableWrapperStyles,
} from '@/styles/modules/quality-control-management/formTeam'
import FormTeamMemberModal from '@/components/modules/quality-control-management/form-team/FormTeamMemberModal'
import ExpandableTeamTable from '@/components/modules/quality-control-management/form-team/ExpandableTeamTable'
import {
  FT_FORM_LABELS,
  FT_FORM_PLACEHOLDERS,
  FT_PAGE_TITLES,
  FT_DROPDOWN_FIELDS,
  FT_VALIDATION_MESSAGES,
  INITIAL_FORM_DATA,
  INITIAL_ERRORS,
  FT_ROUTE_PATHS,
  FT_ROUTE_MODE,
  FT_STATUS_LABELS,
  FT_ALERT_TYPES,
  FT_ALERT_MESSAGES,
  FT_BUTTON_LABELS,
  FT_CATEGORY_LABELS,
  FT_TEMP_ID_PREFIX,
  FT_DRAFT_CONTEXT_TYPE,
} from '@/constants/modules/quality-control-management/formTeam'
import {
  useGetFormTeamById,
  usePostFormTeam,
  useGetPartCategories,
} from '@/hooks/modules/quality-control-management/useFormTeam'
import { useAllPurchaseOrders } from '@/hooks/modules/vendor-management/useCommonDropdown'
import { useFetchSkills } from '@/hooks/modules/hr/useTrainingNeeds'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { convertUtcToLocal } from '@/lib/utils/common'
import {
  FormTeamFormData,
  FormTeamFormErrors,
  TeamMemberRow,
  TeamMemberModalData,
  PurchaseOrderData,
  PartCategoryData,
  SkillData,
  StatusData,
  FormTeamRequest,
} from '@/types/modules/quality-control-management/formTeam'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { PURCHASE_ORDER_TYPE } from '@/constants/modules/quality-control-management/sanityCheckInspection'

/**
 * Classification: Confidential
 */

const QCFormTeamDetail: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const purchaseOrderIdParam = params?.id as string
  const isCreateMode = purchaseOrderIdParam === FT_ROUTE_MODE.CREATE
  
  const [purchaseOrderId, setPurchaseOrderId] = useState<number | null>(
    isCreateMode ? null : Number(purchaseOrderIdParam)
  )
  const [formData, setFormData] = useState<FormTeamFormData>(INITIAL_FORM_DATA)
  
  const purchaseOrderDraftId = formData.purchase_order_number_id && formData.purchase_order_number_id !== null && !isNaN(Number(formData.purchase_order_number_id))
    ? Number(formData.purchase_order_number_id)
    : null
  const { draftSave, clearDraftSave, isFetchingDraft, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: FT_DRAFT_CONTEXT_TYPE,
    context_instance_id: purchaseOrderDraftId,
    enableFetch: false
  });
  const [errors, setErrors] = useState<FormTeamFormErrors>(INITIAL_ERRORS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMemberRow | null>(
    null
  )

  // API hooks
  const { data: formTeamDetail, isLoading: isLoadingDetail, refetch: refetchFormTeamDetail } =
    useGetFormTeamById(purchaseOrderId)
  const { data: purchaseOrdersData, isLoading: isLoadingPO } =
    useAllPurchaseOrders(NUMBERMAP.ONE, undefined, PURCHASE_ORDER_TYPE.PART)
  const { data: partCategoriesData } = useGetPartCategories(
    formData.purchase_order_number_id
  )
  const { data: skillsData } = useFetchSkills(NUMBERMAP.ONE)
  const { data: statusOptionsData } = useOrganizationStatus()
  const { mutate: saveFormTeam, isPending: isSaving } = usePostFormTeam()

  // Get selected purchase order data
  const selectedPurchaseOrder = useMemo(() => {
    if (!formData.purchase_order_number_id || !purchaseOrdersData?.data)
      return null
    return purchaseOrdersData.data.find(
      (po: PurchaseOrderData) =>
        po.purchase_order_id === formData.purchase_order_number_id
    )
  }, [formData.purchase_order_number_id, purchaseOrdersData])

  // Auto-fill purchase order date when PO is selected
  useEffect(() => {
    if (selectedPurchaseOrder?.purchase_order_date) {
      setFormData((prev) => ({
        ...prev,
        ...selectedPurchaseOrder,
      }))
    }
  }, [selectedPurchaseOrder])

useEffect(() => {
  if (purchaseOrderId) {
    refetchFormTeamDetail()
  }
}, [purchaseOrderId])

    // Helper function to transform team detail data
  const transformTeamDetail = (teamDetail: any) => {
    // Use employee_name if available, otherwise combine first and last name
    let employeeName = teamDetail.employee_name
    
    if (!employeeName && teamDetail.employee_first_name && teamDetail.employee_last_name) {
      employeeName = `${teamDetail.employee_first_name} ${teamDetail.employee_last_name}`
    }
    
    employeeName ??= teamDetail.employee_first_name ?? teamDetail.employee_last_name ?? ''

    const {
      purchase_part_category_name,
      part_category_name,
      employee_first_name,
      employee_last_name,
      ...restDetail
    } = teamDetail

    return {
      ...restDetail,
      part_category_name: part_category_name ?? purchase_part_category_name,
      employee_name: employeeName,
      responsibility_description: restDetail.responsibility_description ?? '',
    }
  }

// Load data for edit mode
  useEffect(() => {
    if (
      formTeamDetail?.data
    ) {
      // Handle both array and object response structures
      const detail = Array.isArray(formTeamDetail.data) 
        ? formTeamDetail.data[NUMBERMAP.ZERO] 
        : formTeamDetail.data
      
      if (!detail) return

      const {  
        purchase_team_details, 
        purchase_order_number_id,
        purchase_order_date,
        status_id,
      } = detail as any
      
      setFormData({
        purchase_order_number_id: purchase_order_number_id ?? null,
        purchase_order_date: purchase_order_date ?? '',
        status_id: status_id ?? null,
        purchase_team_details: (purchase_team_details ?? []).map(transformTeamDetail),
      })
    }
  }, [formTeamDetail])


  // Group team details by part category for expandable table
  const teamGroups = useMemo(() => {
    if (!formData.purchase_team_details.length) return []

    // Group by part_category_id
    const grouped = formData.purchase_team_details.reduce(
      (acc, member) => {
        const partCategoryId = member.part_category_id
        const partCategoryName =
          member.part_category_name ?? FT_CATEGORY_LABELS.UNKNOWN_CATEGORY

        acc[partCategoryId] ??= {
          id: partCategoryId,
          category: `${FT_CATEGORY_LABELS.PART_CATEGORY_PREFIX}${partCategoryName}`,
          members: [],
        }

        acc[partCategoryId].members.push({
          id:
            member.purchase_team_detail_id ??
            member.temp_id ??
            `${FT_TEMP_ID_PREFIX}${Date.now()}_${crypto.randomUUID()}`,
          skillRequired: member.skill_name ?? '',
          resource: member.employee_name ?? '',
          responsibility: member.responsibility,
          status:
            member.status_name ??
            (member.status === NUMBERMAP.ONE
              ? FT_STATUS_LABELS.ACTIVE
              : FT_STATUS_LABELS.INACTIVE),
          statusValue: member.status, // Store status value for delete disable check
          memberData: member, // Store full member data for edit/delete
        })

        return acc
      },
      {} as Record<number, { id: number; category: string; members: any[] }>
    )

    return Object.values(grouped)
  }, [formData.purchase_team_details])

  // Handle purchase order change
  const handlePurchaseOrderChange = (value: string | number) => {
    const poId = value === '' ? null : Number(value)
    setPurchaseOrderId(poId)
    setFormData((prev) => {
      const updated = {
        ...prev,
        purchase_order_number_id: poId,
        purchase_order_date: '', // Clear date when PO is cleared
        purchase_team_details: [], // Clear team details when PO changes
        status_id: null, // Clear status when PO is cleared
      }
      return updated;
    })
    if (errors.purchase_order_number_id) {
      setErrors((prev) => ({ ...prev, purchase_order_number_id: '' }))
    }
  }

  // Handle status change
  const handleStatusChange = (value: string | number) => {
    const statusId = value === '' ? null : Number(value)
    setFormData((prev) => {
      const updated = {
        ...prev,
        purchase_order_date: prev.purchase_order_date,
        status_id: statusId,
      }
      handleDraftSave(updated)
      return updated;
    })
    if (errors.status_id) {
      setErrors((prev) => ({ ...prev, status_id: '' }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormTeamFormErrors = { ...INITIAL_ERRORS }

    if (!formData.purchase_order_number_id) {
      newErrors.purchase_order_number_id =
        FT_VALIDATION_MESSAGES.PURCHASE_ORDER_NUMBER_REQUIRED
    }

    if (!formData.status_id) {
      newErrors.status_id =
        FT_VALIDATION_MESSAGES.STATUS_REQUIRED
    }

    if (formData.purchase_team_details.length === NUMBERMAP.ZERO) {
      newErrors.purchase_team_details =
        FT_VALIDATION_MESSAGES.TEAM_MEMBER_REQUIRED
    }

    setErrors(newErrors)
    return Object.keys(newErrors).every(
      (key) => !newErrors[key as keyof FormTeamFormErrors]
    )
  }

  // Handle save
  const handleSave = async (): Promise<void> => {
    if (!validateForm()) return
    clearDraftSave();
    const payload: FormTeamRequest = {
      purchase_order_number_id: formData.purchase_order_number_id!,
      status_id: formData.status_id!,
      purchase_team_details: formData.purchase_team_details.map((member) => {
        const {
          part_category_name,
          skill_name,
          employee_name,
          status_name,
          serialNo,
          temp_id,
          ...rest
        } = member
        return rest
      }),
    }

    saveFormTeam(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
        router.push(FT_ROUTE_PATHS.LIST)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  // Handle cancel
const handleCancel = async (): Promise<void> => {
  await checkUnsavedDraftBeforeLeave();
  router.push(FT_ROUTE_PATHS.LIST);
}

  // Handle add new member
  const handleAddNew = (): void => {
    if (!formData.purchase_order_number_id) {
      showActionAlert(FT_ALERT_TYPES.CUSTOM_ALERT, {
        title: FT_ALERT_MESSAGES.ERROR_TITLE,
        text: FT_ALERT_MESSAGES.SELECT_PURCHASE_ORDER_FIRST,
        icon: FT_ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
      return
    }
    setSelectedMember(null)
    setIsModalOpen(true)
  }

  // Handle edit member
  const handleEditMember = (member: any): void => {
    // member is the TeamMember from ExpandableTeamTable, extract memberData
    const memberData = member.memberData ?? member
    setSelectedMember(memberData)
    setIsModalOpen(true)
  }

  // Helper function to check if member matches the target ID
  const isTargetMember = (
    member: TeamMemberRow,
    memberId: string | number
  ): boolean => {
    const matchesDetailId =
      member.purchase_team_detail_id?.toString() === memberId.toString()
    const matchesTempId = member.temp_id === memberId
    return matchesDetailId || matchesTempId
  }

  // Helper function to update member status to inactive
  const updateMemberToInactive = (member: TeamMemberRow): TeamMemberRow => {
    const statusOption = statusOptionsData?.data?.find(
      (s: StatusData) => s.status_id === NUMBERMAP.TWO
    )
    return {
      ...member,
      status: NUMBERMAP.TWO,
      status_name: statusOption?.status_name ?? FT_STATUS_LABELS.INACTIVE,
    }
  }

  // Handle delete member - set status to 2 (inactive) instead of deleting
  const handleDeleteMember = async (
    memberId: string | number
  ): Promise<void> => {
    const result = await showActionAlert(STATUS.DELETE)
    if (!result.isConfirmed) return

    setFormData((prev) => {
      const updated = {
        ...prev,
        purchase_team_details: prev.purchase_team_details.map((member) =>
          isTargetMember(member, memberId)
            ? updateMemberToInactive(member)
            : member
        ),
      }
      handleDraftSave(updated)
      return updated
    })
  }

  // Process member save with employee data
  const processMemberSave = (
    memberData: TeamMemberModalData,
    selectedMember: TeamMemberRow | null
  ): void => {
    // Clear purchase_team_details error when adding/editing a member
    if (errors.purchase_team_details) {
      setErrors((prev) => ({ ...prev, purchase_team_details: '' }))
    }
    // Get part category, skill, and employee names for display
    const partCategory = partCategoriesData?.data?.find(
      (pc: PartCategoryData) =>
        pc.part_category_id === memberData.part_category_id
    )
    const skill = skillsData?.data?.find(
      (s: SkillData) => s.skill_id === memberData.skill_id
    )
    // Use employee_name from modal (passed from FormTeamMemberModal)
    const employeeName = memberData.employee_name

    // Get status name
    const statusOption = statusOptionsData?.data?.find(
      (s: StatusData) => s.status_id === memberData.status
    )

    if (selectedMember) {
      // Edit mode
      const {
        part_category_id,
        skill_id,
        employee_id,
        status,
        ...restMemberData
      } = memberData
      setFormData((prev) => {
        const updated = {
          ...prev,
          purchase_team_details: prev.purchase_team_details.map((member) =>
            (member.purchase_team_detail_id &&
              member.purchase_team_detail_id ===
                selectedMember.purchase_team_detail_id) ||
            (member.temp_id && member.temp_id === selectedMember.temp_id)
              ? {
                  ...member,
                  ...restMemberData,
                  part_category_id: part_category_id!,
                  skill_id: skill_id!,
                  employee_id: employee_id!,
                  status: status!,
                  part_category_name: partCategory?.part_category_name,
                  skill_name: skill?.skill_name,
                  employee_name: employeeName ?? '',
                  status_name: statusOption?.status_name,
                }
              : member
          ),
        }
        handleDraftSave(updated)
        return updated
      })
    } else {
      // Add mode
      const {
        part_category_id,
        skill_id,
        employee_id,
        status,
        ...restMemberData
      } = memberData
      const newMember: TeamMemberRow = {
        ...restMemberData,
        part_category_id: part_category_id!,
        skill_id: skill_id!,
        employee_id: employee_id!,
        status: status!,
        part_category_name: partCategory?.part_category_name,
        skill_name: skill?.skill_name,
        employee_name: employeeName ?? '',
        status_name: statusOption?.status_name,
        temp_id: `${FT_TEMP_ID_PREFIX}${Date.now()}_${crypto.randomUUID()}`,
      }
      setFormData((prev) => {
        const updated = {
          ...prev,
          purchase_team_details: [...prev.purchase_team_details, newMember],
        };
        handleDraftSave(updated);
        return updated;
      })
    }
    setIsModalOpen(false)
    setSelectedMember(null)
  }

  // Minimal handleDraftSave function for draft-save logic
  const handleDraftSave = (dataToSave: any) => {
    draftSave({
      form_data: dataToSave,
      upload_documents: {},
      timestamp: new Date().toISOString(),
    });
  };

  // Handle save member from modal
  const handleSaveMember = (memberData: TeamMemberModalData): void => {
    // Check for duplicate Part Category + Resource combination
    const duplicateExists = formData.purchase_team_details.some((member) => {
      // Skip the current member being edited
      if (selectedMember) {
        const isCurrentMember =
          (member.purchase_team_detail_id &&
            member.purchase_team_detail_id ===
              selectedMember.purchase_team_detail_id) ||
          (member.temp_id && member.temp_id === selectedMember.temp_id)
        if (isCurrentMember) return false
      }

      // Check if Part Category and Employee combination already exists
      return (
        member.part_category_id === memberData.part_category_id &&
        member.employee_id === memberData.employee_id
      )
    })

    if (duplicateExists) {
      showActionAlert(FT_ALERT_TYPES.CUSTOM_ALERT, {
        title: FT_ALERT_MESSAGES.ERROR_TITLE,
        text: FT_VALIDATION_MESSAGES.DUPLICATE_PART_CATEGORY_RESOURCE,
        icon: FT_ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
      return
    }

    // Process member save (employee_name is now included from modal)
    processMemberSave(memberData, selectedMember)
    setIsModalOpen(false)
    setSelectedMember(null)
  }

  const buttonConfig = [
    {
      label: FT_BUTTON_LABELS.CANCEL,
      onClick: handleCancel,
      variant: 'outlined' as const,
    },
    {
      label: FT_BUTTON_LABELS.SAVE,
      onClick: handleSave,
      variant: 'contained' as const,
    },
  ]

  const isAnyLoading = (): boolean => {
    if (isLoadingDetail) return true
    if (isLoadingPO) return true
    if (isSaving) return true
    if (isDraftSaving || isFetchingDraft) return isDraftSaving ?? isFetchingDraft
    return false
  }

  // Format purchase order date for display
  const formattedPurchaseOrderDate = formData.purchase_order_date
    ? convertUtcToLocal(formData.purchase_order_date)
    : ''

  return (
    <FormContainer>
      <GlobalLoader loading={isAnyLoading()} />
      <FormWrapper>
        <Box>
          <Label title={FT_PAGE_TITLES.MAIN} />
        </Box>

        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={`${FT_FORM_LABELS.PURCHASE_ORDER_NUMBER}*`}
                placeholder={FT_FORM_PLACEHOLDERS.PURCHASE_ORDER_NUMBER}
                isDropdown
                value={formData.purchase_order_number_id?.toString() ?? ''}
                onChange={handlePurchaseOrderChange}
                options={purchaseOrdersData?.data ?? []}
                error={errors.purchase_order_number_id ?? ''}
                keyField={FT_DROPDOWN_FIELDS.PURCHASE_ORDER.KEY_FIELD}
                valueField={FT_DROPDOWN_FIELDS.PURCHASE_ORDER.VALUE_FIELD}
                disabled={!isCreateMode}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Box sx={QCFormTeamDisabledInputStyles}>
                <InputField
                  label={FT_FORM_LABELS.PURCHASE_ORDER_DATE}
                  placeholder=""
                  value={formattedPurchaseOrderDate}
                  onChange={() => {}}
                  error={errors.purchase_order_date ?? ''}
                  disabled={true}
                />
              </Box>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={`${FT_FORM_LABELS.STATUS}*`}
                placeholder={FT_FORM_PLACEHOLDERS.STATUS}
                isDropdown
                value={formData.status_id?.toString() ?? ''}
                onChange={handleStatusChange}
                options={statusOptionsData?.data ?? []}
                error={errors.status_id ?? ''}
                keyField={FT_DROPDOWN_FIELDS.STATUS.KEY_FIELD}
                valueField={FT_DROPDOWN_FIELDS.STATUS.VALUE_FIELD}
              />
            </Grid2>
          </Grid2>

          <Box sx={QCFormTeamTableWrapperStyles}>
            <ExpandableTeamTable
              groups={teamGroups}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
              onAddNew={handleAddNew}
            />
            {errors.purchase_team_details && (
              <Box sx={QCFormTeamErrorStyles}>
                {errors.purchase_team_details}
              </Box>
            )}
          </Box>
        </FormContent>

        <ButtonContainer sx={BUTTONSTYLE}>
          <ButtonGroup buttons={buttonConfig} />
        </ButtonContainer>
      </FormWrapper>

      {isModalOpen && (
        <FormTeamMemberModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedMember(null)
          }}
          onSave={handleSaveMember}
          initialData={selectedMember ?? undefined}
          purchaseOrderId={formData.purchase_order_number_id}
          partCategories={partCategoriesData?.data}
          skills={skillsData?.data}
          statusOptions={statusOptionsData?.data}
        />
      )}
    </FormContainer>
  )
}

export default QCFormTeamDetail
