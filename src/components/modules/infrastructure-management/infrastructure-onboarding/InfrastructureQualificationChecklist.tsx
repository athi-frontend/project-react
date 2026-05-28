"use client";
import React, { useState, useEffect } from "react";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert, InputField, ButtonGroup } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import AddInfrastructureQualificationChecklistModal, {
  DEFAULT_QUALIFICATION_FORM_DATA,
} from "./AddInfrastructureQualificationChecklistModal";
import { useQualificationChecklistById, useUpsertQualificationChecklist } from "@/hooks/modules/infrastructure-management/infrastructureOnboardingTabs";
import {
  InfrastructureQualificationChecklistProps,
  QualificationChecklistItem,
  QualificationFormData,
  QualificationFormErrors,
} from "@/types/modules/infrastructure-management/infrastructureOnboardingTabs";
import {
  QUALIFICATION_CHECKLIST_LABELS,
  QUALIFICATION_CHECKLIST_ERROR_MESSAGES,
  QUALIFICATION_CHECKLIST_TABLE_COLUMNS,
  QUALIFICATION_CHECKLIST_FIELD_NAMES,
  QUALIFICATION_CHECKLIST_UI_STRINGS,
  QUALIFICATION_CHECKLIST_PATHS,
  BUTTON_LABELS,
  INSTALLATION_REPORT_ROUTES,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";
import { Grid2 } from "@mui/material";
import { FormContent } from "@/styles/modules/user/userOnboard";
import { useOrganizationStatus } from "@/hooks/useCommonDropdown";
import { COMMON_CONSTANTS } from "@/lib/utils/common";
import { useRouter } from "next/navigation";
import { ErrorText } from "@/styles/common";

/**
 * Classification : Confidential
 **/

const InfrastructureQualificationChecklist: React.FC<
  InfrastructureQualificationChecklistProps
> = ({ infrastructureId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter();
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [modalData, setModalData] = useState<QualificationFormData>(
    DEFAULT_QUALIFICATION_FORM_DATA
  )
  const [formData, setFormData] = useState<{ status_id?: string }>({})
  const [modalErrors, setModalErrors] = useState<QualificationFormErrors>({})
  const [errors, setErrors] = useState<string>('')
  const [checklistItemsError, setChecklistItemsError] = useState<string>('')
  const [checklistItems, setChecklistItems] = useState<
    QualificationChecklistItem[]
  >([])

  // Fetch qualification checklist data
  const {
    data: qualificationData,
    isLoading,
    refetch,
  } = useQualificationChecklistById(
    infrastructureId ?? undefined,
    !!infrastructureId
  )

  // Upsert mutation
  const { mutate: upsertChecklist } = useUpsertQualificationChecklist()
  const { data: statusData } = useOrganizationStatus();

  // Update checklist items when data is fetched
  useEffect(() => {
    
    if (qualificationData?.data && qualificationData.data.length > NUMBERMAP.ZERO) {
      setFormData({ status_id: String(qualificationData.data[NUMBERMAP.ZERO].status) })
      const items = qualificationData.data[NUMBERMAP.ZERO].qualification_checklist ?? []
      setChecklistItems(items)
    } else {
      setChecklistItems([])
    }
  }, [qualificationData])

  // Clear checklist items error when items are added
  useEffect(() => {
    if (checklistItems.length > NUMBERMAP.ZERO && checklistItemsError) {
      setChecklistItemsError('')
    }
  }, [checklistItems.length, checklistItemsError])


  // Column definitions for the table matching the design
  const columns = [
    QUALIFICATION_CHECKLIST_TABLE_COLUMNS.SNO,
    QUALIFICATION_CHECKLIST_TABLE_COLUMNS.TEST_PERFORMED,
    QUALIFICATION_CHECKLIST_TABLE_COLUMNS.ACCEPTANCE_CRITERIA,
    {
      ...QUALIFICATION_CHECKLIST_TABLE_COLUMNS.STATUS,
      renderCell: (params: any) => (
        <StatusTypography value={!isNaN(Number(params.row.status_id)) ? Number(params.row.status_id) : '-'} />
      ),
    },
    {
      ...QUALIFICATION_CHECKLIST_TABLE_COLUMNS.ACTIONS,
      renderCell: (params: any) => (
        <ActionButton
          deleteDisabled={params.row.status_id == NUMBERMAP.TWO}
          onDelete={() => handleDelete(params.row.qualification_checklist_items_id)}
          onEdit={() => handleEdit(params.row.qualification_checklist_items_id)}  
        />
      ),
    },
  ]

  // Action handlers
  const handleEdit = (id: number ) => {
    const item = checklistItems.find((item) => {
      const itemId = item.qualification_checklist_items_id
      return  itemId === id
    })
    
    if (item) {
      setModalData({
        testPerformed: item.test_performed ?? '',
        acceptanceCriteria: item.acceptance_criteria ?? '',
        status_id: String(item.status_id ?? NUMBERMAP.ONE),
      })
      setEditingItemId(item.qualification_checklist_items_id)
      setIsModalOpen(true)
    }
  }

  const handleDelete = (id: number ) => {
    showActionAlert(COMMON_CONSTANTS.DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        // Remove item from local state only (soft delete - mark as inactive)
        const updatedItems = checklistItems.map((item) => {
          const matchedItem = item.qualification_checklist_items_id === id
          return matchedItem
            ? { ...item, status_id: NUMBERMAP.TWO }
            : item
        })
        setChecklistItems(updatedItems)
      }
    })
  }

  const resetFormState = () => {
    setModalData({ ...DEFAULT_QUALIFICATION_FORM_DATA })
    setModalErrors({})
    setEditingItemId(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    resetFormState()
  }

  const handleFieldChange = (
    field: keyof QualificationFormData,
    value: string
  ) => {
    setModalData((prev) => ({ ...prev, [field]: value }))
    setModalErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors: QualificationFormErrors = {}

    if (!modalData.testPerformed?.trim()) {
      newErrors.testPerformed =
        QUALIFICATION_CHECKLIST_ERROR_MESSAGES.TEST_PERFORMED_REQUIRED
    }

    if (!modalData.acceptanceCriteria?.trim()) {
      newErrors.acceptanceCriteria =
        QUALIFICATION_CHECKLIST_ERROR_MESSAGES.ACCEPTANCE_CRITERIA_REQUIRED
    }
    if (!modalData.status_id || !String(modalData.status_id).trim()) {
      newErrors.status_id = QUALIFICATION_CHECKLIST_ERROR_MESSAGES.STATUS_REQUIRED
    }
    setModalErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }


  const handleModalSave = () => {
    if (!validateForm()) {
      return
    }

    let updatedItems: QualificationChecklistItem[]

    if (editingItemId) {
      // Update existing item in local state only
      updatedItems = checklistItems.map((item) => {
        const matchedItem = String(item.qualification_checklist_items_id) === String(editingItemId) 
        return matchedItem
          ? {
              ...item,
              test_performed: modalData.testPerformed ?? '',
              acceptance_criteria: modalData.acceptanceCriteria ?? '',
              status_id: modalData.status_id,
            }
          : item
      })
    } else {
      // Add new item to local state only
      const newItem: QualificationChecklistItem = {
        test_performed: modalData.testPerformed ?? '',
        acceptance_criteria: modalData.acceptanceCriteria ?? '',
        status_id: modalData.status_id,
        qualification_checklist_items_id:  crypto.randomUUID(),
      }
      updatedItems = [...checklistItems, newItem]
    }

    // Only update local state - no API call
    setChecklistItems(updatedItems)
    setIsModalOpen(false)
    resetFormState()
  }


  const validatePage = () => {
    let isValid = true

    // Validate status
    if (!formData.status_id?.trim()) {
      setErrors(QUALIFICATION_CHECKLIST_ERROR_MESSAGES.STATUS_REQUIRED)
      isValid = false
    } else {
      setErrors('')
    }

    // Validate checklist items
    if (checklistItems.length === NUMBERMAP.ZERO) {
      setChecklistItemsError(QUALIFICATION_CHECKLIST_ERROR_MESSAGES.CHECKLIST_ITEMS_REQUIRED)
      isValid = false
    } else {
      setChecklistItemsError('')
    }

    return isValid
  }

  const handleSave = () => {
    if (!infrastructureId) {
      return
    }

    // Validate both status and checklist items
    if (!validatePage()) {
      return
    }

    // Transform checklist items to match API payload structure
    const transformedChecklist = checklistItems.map((item) => {
      const itemId = typeof item.qualification_checklist_items_id === 'string'
        ? ''  // for new items
        : item.qualification_checklist_items_id
      

      return {
        qualification_checklist_item_id: itemId,
        test_performed: item.test_performed ?? '',
        acceptance_criteria: item.acceptance_criteria ?? '',
        status: item.status_id && !isNaN(Number(item.status_id))  ? Number(item.status_id) : NUMBERMAP.ONE, //only number is allowed
      } 
    })

    const payload = {
      infrastructure_id: infrastructureId,
      qualification_checklist: transformedChecklist,
      status: formData.status_id && !isNaN(Number(formData.status_id)) ? Number(formData.status_id) : NUMBERMAP.ONE, //only number is allowed
    } 
    upsertChecklist(payload, {
      onSuccess: () => {
        refetch()
        showActionAlert(STATUS.SUCCESS)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  const handleCancel = () => {
    router.push(INSTALLATION_REPORT_ROUTES.GRID_PAGE);
    setFormData({})
    setErrors('')
    setChecklistItemsError('')
    refetch()
  }

  const handleAdd = () => {
    resetFormState()
    setIsModalOpen(true)
  }
  return (
    <PageContainer>
      <CommonSharedTale
        pathName={QUALIFICATION_CHECKLIST_PATHS.DEFAULT_PATH}
        hanldeClick={handleAdd}
        title={QUALIFICATION_CHECKLIST_LABELS.TITLE}
        Table={
          <DataTable
            rows={checklistItems}
            columns={columns}
            loading={isLoading}
            IdField={QUALIFICATION_CHECKLIST_FIELD_NAMES.QUALIFICATION_CHECKLIST_ITEMS_ID}
          />
        }
      />
      <FormContent>
      {checklistItemsError && (
          <ErrorText>{checklistItemsError}</ErrorText>

      )}
      {/* status dropdown */}

        <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
            <InputField
              label={QUALIFICATION_CHECKLIST_UI_STRINGS.STATUS_LABEL}
              placeholder={QUALIFICATION_CHECKLIST_UI_STRINGS.STATUS_PLACEHOLDER}
              options={statusData?.data ?? []}
              value={formData.status_id ?? null}
              onChange={(value: string) => {
                setFormData({ ...formData, status_id: value })
                // Clear error when status is selected
                if (errors) {
                  setErrors('')
                }
              }}
              isDropdown={true}
              keyField={QUALIFICATION_CHECKLIST_FIELD_NAMES.STATUS_ID}
              valueField={QUALIFICATION_CHECKLIST_FIELD_NAMES.STATUS_NAME}
              error={errors}
            />
          </Grid2>
        </Grid2>
        {/* save cancel button */}
        <ButtonGroup
          buttons={[
            { label: BUTTON_LABELS.CANCEL, onClick: handleCancel },
            { label: BUTTON_LABELS.SAVE, onClick: handleSave },
          ]}
        />
      </FormContent>

      <CommonModal
        buttonRequired
        onClose={handleModalClose}
        onSave={handleModalSave}
        title={
          editingItemId
            ? QUALIFICATION_CHECKLIST_LABELS.EDIT_TITLE
            : QUALIFICATION_CHECKLIST_LABELS.ADD_TITLE
        }
        open={isModalOpen}
      >
        <AddInfrastructureQualificationChecklistModal
          formData={modalData}
          errors={modalErrors}
          onChange={handleFieldChange}
        />
      </CommonModal>
    </PageContainer>
  )
}

export default InfrastructureQualificationChecklist