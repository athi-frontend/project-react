'use client'
import React, { useState, useEffect } from 'react'
import { Box, Checkbox, Grid2, TextField } from '@mui/material'
import PndReviewTable from './PndReviewTable'
import PndReviewStatusTable from './PndReviewStatusTable'
import {
  ReviewItem,
  PndReviewData,
  PndReviewStatusRow,
} from '@/types/modules/dnd/pndReview'
import { processApiData } from '@/lib/modules/dnd/pndReview'
import { ButtonGroup, Label, showActionAlert } from '../../../ui'
import {
  FIELD_NAMES,
  FLEX,
  HEADER_NAMES,
  PARAMETERTABLE,
  PLACEHOLDERS,
  TITLE,
  TYPES,
  COLUMN_WIDTH,
  MODEL_TABLE,
  ALERT_MESSAGES,
} from '@/constants/modules/dnd/pnd-review'
import {
  usePndReviewFetch,
  usePNDReviewUpsert,
} from '@/hooks/modules/dnd/usePNDReview'
import { useParams, useRouter } from 'next/navigation'
import { COMMON_CONSTANTS, processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import { TableContainer } from '@/styles/components/ui/table'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {
  INPUTCONST,
  SpecificationsTitle,
  STYLES,
} from '@/styles/modules/dnd/pnd'
import { PND_FORM, DELETE, PND_TEMP_ID_PREFIX } from '@/constants/modules/dnd/pnd'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import ReviewerModal from '../reviewer-modal/ReviewerModal'
import { BUTTON_LABEL, getButtonConfig, NUMBERMAP, STATUS } from '@/constants/common'
import { useSubmitReview } from '@/hooks/modules/dnd/useCommonReviewModal'
import { PROJECT_INFO_SCREEN_URL } from '@/lib/modules/dnd/projectScreen'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { pndReviewBoxStyles } from '@/styles/modules/dnd/projectPlan'
import PndReviewStatusModal from './PndReviewStatusModal'

/**
 Classification : Confidential
**/
const { ACTIVE_STATUS, IN_ACTIVE_STATUS } = COMMON_CONSTANTS
const { INDEX_ZERO, EMPTY_ARRAY_LENGTH, SUCCESS_ALERT, FAILED_ALERT } =
  COMMON_CONSTANTS

const PndReview: React.FC = () => {
  const params = useParams()
  const projectId = params.id
  const router = useRouter()
  const { data: pndReviewInfo, refetch, isLoading, isFetching } = usePndReviewFetch(Number(projectId))
  const { mutate: submitPNDReview, isPending: isSubmitPending } = usePNDReviewUpsert()
  const [isDisabled, setIsDisabled] = useState(false)
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([])
  const [specificationItem, setSpecificationItem] = useState<any[]>([])
  const [modelDetails, setModelDetails] = useState<any[]>([])
  const [pndReviewStatus, setPndReviewStatus] = useState<PndReviewStatusRow[]>([])
  const [isReviewerModal, setIsReviewerModal] = useState(false)
  const [buttonId, setButtonId] = useState<number | null>(null)
  const [buttonName, setButtonName] = useState<string | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [editingStatusRow, setEditingStatusRow] = useState<PndReviewStatusRow | null>(null)
  const permissions = pndReviewInfo?.meta_info?.action_control?.permissions ?? []

  const [pndId, setPNDId] = useState<string | number>()
  const [pndReviewReportId, setPNDReviewReportId] = useState<
    string | number | null
  >()
  useEffect(() => {
    if (
      projectId &&
      pndReviewInfo &&
      Object.keys(pndReviewInfo.data).length > EMPTY_ARRAY_LENGTH
    ) {
      const processedItems = processApiData(
        pndReviewInfo.data[INDEX_ZERO].review_records
      )
      setPNDId(pndReviewInfo.data[INDEX_ZERO].pnd_id)
      setPNDReviewReportId(pndReviewInfo.data[INDEX_ZERO].review_report_id)
      setReviewItems(processedItems)
      setSpecificationItem(pndReviewInfo.data[INDEX_ZERO].specifications)
      setModelDetails(pndReviewInfo.data[INDEX_ZERO].models)
      const approvalStatus =
        pndReviewInfo.data[NUMBERMAP.ZERO]?.approval_status ?? []

      // Assign a stable local `id` for each status row (similar to model_id → id in PNDForm)
      const mappedStatus: PndReviewStatusRow[] = approvalStatus.map(
        (item: any, index: number) => ({
          ...item,
          // if backend ever sends an id, keep it; otherwise use index-based synthetic id
          id: item.id ?? `pnd-review-status-${index}`,
        })
      )

      setPndReviewStatus(mappedStatus)
    } else {
      setReviewItems([])
      setPndReviewStatus([])
    }
  }, [pndReviewInfo])

  const handleAddStatusRow = () => {
    if (!hasEditPermission) return
    setEditingStatusRow(null)
    setIsStatusModalOpen(true)
  }

  const handleEditStatusRow = (row: any) => {
    if (!hasEditPermission) return
    setEditingStatusRow(row)
    setIsStatusModalOpen(true)
  }

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false)
    setEditingStatusRow(null)
  }

  const handleSaveStatusRow = (data: any) => {
    if (!hasEditPermission) return

    setPndReviewStatus((prev: PndReviewStatusRow[]) => {
      const incomingId = data?.id

      // If we have an id, update the matching row (like modelSpecifications does with id/model_id)
      if (incomingId != null) {
        return prev.map((row) =>
          row.id != null && String(row.id) === String(incomingId)
            ? { ...row, ...data }
            : row
        )
      }

      // Otherwise create a new temp row (same pattern as PND model)
      const tempId = `${PND_TEMP_ID_PREFIX}${Date.now()}`

      return [
        ...prev,
        {
          ...data,
          id: tempId,
        },
      ]
    })

    setEditingStatusRow(null)
    handleCloseStatusModal()
  }

  const handleDeleteStatusRow = async (row: any) => {
    if (!hasEditPermission) return

    const result = await showActionAlert(DELETE)
    if (!result.isConfirmed) return

    setPndReviewStatus((prev: PndReviewStatusRow[]) =>
      prev.map((item) => {
        const existingId = item.id
        const targetId = row.id

        if (existingId != null && targetId != null && String(existingId) === String(targetId)) {
          return {
            ...item,
            status_id: NUMBERMAP.TWO,
          }
        }
        return item
      })
    )
  }

  const handleItemChange = (updatedItem: any, type?: string) => {
    if(!hasEditPermission) return
    if (type == TYPES.REVIEW) {
      setSpecificationItem((prevItems: any) =>
        prevItems.map((item: any) =>
          item.specification_id === updatedItem.specification_id
            ? updatedItem
            : item
        )
      )
    } else {
      setReviewItems((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      )
    }
  }

  const handleSave = () => {
    const filtered = reviewItems
      .filter((item) => item.reviewed)
      .map((item) => ({
        item_id: parseInt(item.id),
        comments: item.comment.trim(),
        reviewed: item.reviewed,
      }))

    const Specfiltered = specificationItem
      .filter((item) => item.reviewed)
      .map((item) => ({
        specification_id: parseInt(item.specification_id),
        comments: item.comments?.trim(),
        reviewed: item.reviewed ?? false,
      }))

    const approvalStatusPayload = pndReviewStatus.map((item) => ({
      role_id: Number(item.role_id),
      status_id: Number(item.status_id),
    }))

    const finalObject = {
      pnd_id: pndId,
      pnd_review_report_id: pndReviewReportId,
      review_records: filtered,
      specification_records: Specfiltered,
      approval_status: approvalStatusPayload,
    }
    submitPNDReview(finalObject as PndReviewData, {
      onSuccess: () => {
        setIsDisabled(false)
        showActionAlert(SUCCESS_ALERT)
        refetch();
      },
      onError: () => {
        setIsDisabled(false)
        showActionAlert(FAILED_ALERT)
      },
    })
  }


  const renderCommentField = (params: GridRenderCellParams) => {
    return (
      <TextField
        variant={INPUTCONST.VARIANT}
        sx={INPUTCONST.TEXTSTYLE}
        fullWidth
        value={params.value ?? params.comments ?? ''}
        onKeyDown={(e) => {
          if (e.key === ' ') {
            e.stopPropagation()
          }
        }}
        onChange={(e) => {
          if (e.target.value.length > NUMBERMAP.FIVEHUNDRED) {
            showActionAlert(QUERYCONSTANTS.ALERT_TYPES.CUSTOM_ALERT, {
              title: ALERT_MESSAGES.TITLE,
              text: ALERT_MESSAGES.TEXT,
              icon: ALERT_MESSAGES.ICON,
              cancelButton: false,
              confirmButton: true,
            })
            return
          }
          
          if (params.row.specification_id) {
            const newRow = { ...params.row, comments: e.target.value }

            handleItemChange(newRow as ReviewItem, TYPES.REVIEW)
          } else {
            const newRow = { ...params.row, comment: e.target.value }

            handleItemChange(newRow as ReviewItem, TYPES.PND)
          }
        }}
        placeholder={PLACEHOLDERS.COMMENT}
        size={INPUTCONST.SIZE}
      />
    )
  }

  const renderReviewedCheckbox = (params: GridRenderCellParams) => {
    return (
      <Checkbox
        checked={
          params.value != null
            ? Boolean(params.value)
            : Boolean(params.reviewed)
        }
        onChange={(e) => {
          const newRow = {
            ...params.row,
            reviewed: e.target.checked ? ACTIVE_STATUS : IN_ACTIVE_STATUS,
          }

          if (params.row.specification_id) {
            handleItemChange(newRow as ReviewItem, TYPES.REVIEW)
          } else {
            handleItemChange(newRow as ReviewItem, TYPES.PND)
          }
        }}
      />
    )
  }

  const columns: GridColDef[] = [
    {
      field: FIELD_NAMES.ITEM,
      headerName: HEADER_NAMES.ITEMS,
      flex: FLEX.SMALL,
      minWidth: COLUMN_WIDTH.SERIAL_NUMBER,
    },
    {
      field: FIELD_NAMES.REQUIREMENT,
      headerName: HEADER_NAMES.REQUIREMENTS,
      flex: FLEX.SMALL,
      minWidth: COLUMN_WIDTH.TEXT_FIELD,
    },
    {
      field: FIELD_NAMES.COMMENT,
      headerName: HEADER_NAMES.COMMENTS,
      flex: FLEX.MEDIUM,
      minWidth: COLUMN_WIDTH.COMMENT_FIELD,
      renderCell: renderCommentField,
    },
    {
      field: FIELD_NAMES.REVIEWED,
      headerName: HEADER_NAMES.REVIEWED,
      width: COLUMN_WIDTH.REVIEW_CHECKBOX,
      renderCell: renderReviewedCheckbox,
      editable: true,
    },
  ]

  const TechColumns: GridColDef[] = [
    {
      field: PARAMETERTABLE.FIELDNAME.SNO,
      headerName: PARAMETERTABLE.HEADERNAME.SNO,
      flex: FLEX.SMALL,
      minWidth: COLUMN_WIDTH.SERIAL_NUMBER,
      renderCell: (params: GridRenderCellParams) => {
        const index = params.api.getAllRowIds().indexOf(params.id)
        return index + 1
      },
    },
    {
      field: PARAMETERTABLE.FIELDNAME.PARAMETER,
      headerName: PARAMETERTABLE.HEADERNAME.PARAMETER,
      flex: FLEX.SMALL,
      minWidth: COLUMN_WIDTH.TEXT_FIELD,
    },
    {
      field: PARAMETERTABLE.FIELDNAME.SPECIFICATION,
      headerName: PARAMETERTABLE.HEADERNAME.SPECIFICATION,
      flex: FLEX.MEDIUM,
      minWidth: COLUMN_WIDTH.TEXT_FIELD,
    },
    {
      field: PARAMETERTABLE.FIELDNAME.COMMENTS,
      headerName: HEADER_NAMES.COMMENTS,
      flex: FLEX.MEDIUM,
      minWidth: COLUMN_WIDTH.COMMENT_FIELD,
      renderCell: renderCommentField,
    },
    {
      field: PARAMETERTABLE.FIELDNAME.REVIEWED,
      headerName: HEADER_NAMES.REVIEWED,
      width: COLUMN_WIDTH.REVIEW_CHECKBOX,
      renderCell: renderReviewedCheckbox,
      editable: true,
    },
  ]
   const { mutate: saveReview, isPending: isReviewPending } = useSubmitReview(pndReviewInfo?.meta_info?.action_control?.formName)
  const handleCancel=()=>{
    router.push(PROJECT_INFO_SCREEN_URL)
  }

 // Comprehensive loading state
    const isAnyLoading = () => {
      if (isLoading) return true
      if (isFetching) return true
      if (isSubmitPending) return true
      if (isReviewPending) return true
      return false
  }
  
  const modelColumns: GridColDef[] = [
    {
      field: MODEL_TABLE.FIELDNAME.MODEL_NAME,
      headerName: MODEL_TABLE.HEADERNAME.MODEL_NAME,
      flex: NUMBERMAP.THREE,
      minWidth: COLUMN_WIDTH.TEXT_FIELD,
    },
    {
      field: MODEL_TABLE.FIELDNAME.MODEL_NUMBER,
      headerName: MODEL_TABLE.HEADERNAME.MODEL_NUMBER,
      flex: NUMBERMAP.THREE,
      minWidth: COLUMN_WIDTH.TEXT_FIELD,
    },
    {
      field: MODEL_TABLE.FIELDNAME.MODEL_DESCRIPTION,
      headerName: MODEL_TABLE.HEADERNAME.MODEL_DESCRIPTION,
      flex: NUMBERMAP.HALF,
      minWidth: COLUMN_WIDTH.COMMENT_FIELD,
    },
  ]

  const handleCloseReviewerModalPndReview = () => {
    setIsReviewerModal(false)
    setButtonId(null) 
  }
  
  const handleButtonChangePndReview = (button_label: string, trigger_status_id?: number) => {
  setButtonId(trigger_status_id ?? null);
  setButtonName(button_label);
  setIsReviewerModal(true);
}
 
// Update these handler functions to accept trigger_status_id parameter
const handleSubmitForReviewPndReview = (trigger_status_id?: number) => {
  handleButtonChangePndReview(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id);
}
 
const handleApprovePndReview = (trigger_status_id?: number) => {
  handleButtonChangePndReview(BUTTON_LABEL.APPROVE, trigger_status_id);
}
 
const handleRejectPndReview = (trigger_status_id?: number) => {
  handleButtonChangePndReview(BUTTON_LABEL.REJECT, trigger_status_id);
}
const handleInitiatePndReview = (trigger_status_id?: number) => {
  handleButtonChangePndReview(BUTTON_LABEL.INITIATE, trigger_status_id);
}
 const handleSubmitApprovalPndReview = (trigger_status_id?: number) => {
    const payload = {
      project_id: projectId,
      new_status_id: trigger_status_id,
    }
    saveReview(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  const getButtons = getButtonConfig({
    handleSubmitForReview: handleSubmitForReviewPndReview,
    handleApprove: handleApprovePndReview,
    handleReject: handleRejectPndReview,
    handleCancel: handleCancel,
    handleSave: handleSave,
    handleInitiate: handleInitiatePndReview,
    handleSubmitApproval: handleSubmitApprovalPndReview,
    isDisabled: isDisabled,
  })

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, getButtons)

    useEffect(() => {
    if (pndReviewInfo && !buttonDetails) {
      showActionAlert(QUERYCONSTANTS.ALERT_TYPES.CUSTOM_ALERT, {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [buttonDetails, pndReviewInfo])
  
  return (
    <TableContainer>
       <GlobalLoader loading = {isAnyLoading()} />
      {buttonDetails && (
        <>
      <Label title={TITLE}></Label>
      <Box sx={STYLES.BOX}>
           <Grid2 >
        <PndReviewTable
          columns={columns}
          reviewItems={reviewItems}
          onItemChange={handleItemChange}
        />
       

        <Grid2 container spacing={STYLES.GRID.SPACING} sx={STYLES.CONTAINER}>
          <Grid2 size={{ md: STYLES.GRID.SIZE }}>
            <SpecificationsTitle>
              {PND_FORM.PND_SPECIFICATIONS_TITLE}
            </SpecificationsTitle>
          </Grid2>
        </Grid2>
        <PndReviewTable
          id={PARAMETERTABLE.FIELDNAME.SNO}
          columns={TechColumns}
          reviewItems={specificationItem}
          onItemChange={handleItemChange}
        />
        <Grid2 sx={STYLE5}>
          <SpecificationsTitle>
            {PND_FORM.PND_MODEL_DETAILS_TITLE}
          </SpecificationsTitle>          
        </Grid2>
        <Grid2 sx={STYLE5}>
          <PndReviewTable
            id={MODEL_TABLE.FIELDNAME.MODEL_ID}
            columns={modelColumns}
            reviewItems={modelDetails}
            onItemChange={handleItemChange}
          />
        </Grid2>
        <Grid2 sx={STYLE5}>
          <PndReviewStatusTable
              rows={pndReviewStatus}
              onEdit={handleEditStatusRow}
              onDelete={handleDeleteStatusRow}
              onAdd={handleAddStatusRow}
              hasEditPermission={hasEditPermission}
          />
        </Grid2>
         </Grid2>
        {/* <ButtonGroup buttons={actionButtons} /> */}
        <Box size={NUMBERMAP.TWELVE} sx={pndReviewBoxStyles}>
        <CommentsHistory 
          comments={pndReviewInfo?.meta_info?.task_info?.task_comments}
        />
        </Box>
        <ButtonGroup buttons={buttonDetails} />
           <ReviewerModal
              open={isReviewerModal}
              onClose={handleCloseReviewerModalPndReview}
              project_id={projectId}
              button_id={buttonId}
              mode={buttonName}
              task_id={pndReviewInfo?.meta_info?.task_info?.task_id}
              menu_id={pndReviewInfo?.meta_info?.action_control?.menuId}
              menu_name={pndReviewInfo?.meta_info?.action_control?.formName}
              reviewerList={pndReviewInfo?.meta_info?.task_info?.reviewer_list}
            />
            <PndReviewStatusModal
              open={isStatusModalOpen}
              onClose={handleCloseStatusModal}
              onSave={handleSaveStatusRow}
              currentStatus={editingStatusRow}
              hasEditable={!hasEditPermission}
            />
      </Box>
      </>
      )}
    </TableContainer>
  )
}

export default PndReview
