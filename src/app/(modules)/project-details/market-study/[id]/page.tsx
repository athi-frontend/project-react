'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Box, Grid2 } from '@mui/material'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import Add from '@mui/icons-material/Add'
import {
  ButtonGroup,
  InputField,
  Description,
  showActionAlert,
  Label,
} from '@/components/ui'
import {
  FORM_CONTENT_STYLES,
  FormSection,
  Content,
  gridStyles,
  styles,
} from '@/styles/modules/dnd/market'
import { FormContent } from '@/styles/components/ui/layout'
import { useParams, useRouter } from 'next/navigation'
import {
  ButtonGroupBox,
  AddButton,
} from '@/styles/modules/dnd/feedback'
import {
  TITLE_TEXT,
  ADD_FEEDBACK_TEXT,
  DESCRIPTION_PLACEHOLDER,
  ERROR_MESSAGES,
  GRID_SIZE,
  INPUT_LABEL_DESCRIPTION_SOURCE,
  INITIAL_FORM_DATA,
  API_FIELD_KEYS,
  SOURCE_PLACEHOLDER,
  FIELD_ORDER,
  DESCRIPTION_LABEL,
} from '@/constants/modules/dnd/marketStudy'
import { Feedback, InitialFormData } from '@/types/modules/dnd/marketStudy'
import {
  getButtonAction,
  ADD_BUTTON_CONFIG,
  DESCRIPTION_TEXTFIELD_CONFIG,
  SAVE_CANCEL_BUTTONS_MAIN,
  handleCancel,
  INITIAL_ERRORS,
} from '@/lib/modules/dnd/marketStudy'
import { ADD_NEW, BUTTON_LABEL, FINALFILEINITIALDATA, getButtonConfig, GLOBAL_STYLES, NUMBERMAP, STATUS } from '@/constants/common'
import MarketResearchTable from '@/components/modules/dnd/market-research/MarketTable'
import { UploadedFileData } from '@/types/modules/dnd/hld'
import {
  useAddMarketResearch,
  useDeleteMarketResearch,
  useMarketResearchList,
  useUpdateMarketResearch,
  useMarketResearchById,
} from '@/hooks/modules/dnd/useMarketStudy'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import {
  handleFileUpload,
  handleFileEdit,
  mergeFinalFileData,
  processButtonsWithPermissions,
  QUERYCONSTANTS,
} from '@/lib/utils/common'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import { ProjectStyles, TableContainer } from '@/styles/components/ui/table'
import ReviewerModal from '@/components/modules/dnd/reviewer-modal/ReviewerModal'
import { useSubmitReview } from '@/hooks/modules/dnd/useCommonReviewModal'
import { PROJECT_INFO_SCREEN_URL } from '@/lib/modules/dnd/projectScreen'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import CommentsHistory from '@/components/ui/comments-history/Comments'

/**
 Classification : Confidential
**/
export const MarketResearchComponent: React.FC = () => {
  const params = useParams<{ id: string }>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<InitialFormData>({
    ...INITIAL_FORM_DATA,
  })
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [isReviewerModal, setIsReviewerModal] = useState(false)
  const [buttonId, setButtonId] = useState<number | null>(null)
  const [buttonName, setButtonName] = useState<string | null>(null)
  const [finalFileData, setFinalFileData] =
    useState<any>(FINALFILEINITIALDATA)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const maxSourceLength = NUMBERMAP.HUNDRED
  const { data: getList, refetch, isLoading, isFetching } = useMarketResearchList(Number(params.id))
  
  const addMutation = useAddMarketResearch()
  const updateMutation = useUpdateMarketResearch()
  const deleteMutation = useDeleteMarketResearch()
  const {
    data: editData,
    isLoading: isEditDataLoading,
    isFetching: isEditDataFetching,
    refetch: marketStudy,
  } = useMarketResearchById(Number(editId))

  const marketList = (getList?.data ?? []).filter(
    (item: Feedback) => item.status !== NUMBERMAP.ZERO
  )
  const { mutate: saveReview, isPending: isReviewPending} = useSubmitReview(getList?.meta_info?.action_control?.formName ?? '')
  const router = useRouter();

  const isAnyLoading = () => {
    if (isLoading) return true
    if (isFetching) return true
    if (isEditDataLoading) return true
    if (isEditDataFetching) return true
    if (addMutation.isPending) return true
    if (updateMutation.isPending) return true
    if (deleteMutation.isPending) return true
    if (isReviewPending) return true
    return false
  }

  const handleFileRemove = (data) => {
    if (data?.local_files_to_delete.length > NUMBERMAP.ZERO) {
      if (formData?.uploadedFile.length > NUMBERMAP.ZERO) {
        const uploadFiles = formData.uploadedFile.filter((files) => data?.local_files_to_delete?.some((del) =>del != files?.file?.name?.split(".")[NUMBERMAP.ZERO]))
        setFormData({
          ...formData, uploadedFile: uploadFiles
        })
        setUploadedFiles(uploadFiles)
      }
    }
  }

  useEffect(() => {
    if (editData && isEdit && !isEditDataLoading && getList) {
      const marketStudyData =
        editData.data && editData.data.length > NUMBERMAP.ZERO
          ? editData.data[NUMBERMAP.ZERO]
          : null

      if (marketStudyData) {
        const sources = marketStudyData.source ?? ''
        const description = marketStudyData.description ?? ''
        const uploadedFile = marketStudyData.documents ?? []

        const formData: InitialFormData = {
          sources,
          description,
          uploadedFile,
          documentIdToDelete: [],
        }

        setFormData(formData)

        setUploadedFiles(uploadedFile)
      }
    }
  }, [editData, isEdit, isEditDataLoading, params.id])

  const permissions = getList?.meta_info?.action_control?.permissions ?? []
  const hasAddNewPermission = permissions.some((permission: any) => permission.action === ADD_NEW)

  const handleOpenModal = () => setIsModalOpen(true)
  const onFileUpload = (newFile: File | FileData2) => {
    handleFileUpload(newFile, setFormData, setErrors, errors)

    setFormData((prev: any) => {
      const updatedFiles = [...prev.uploadedFile, newFile]
      setUploadedFiles(updatedFiles)
      return prev
    })
  }
  const onFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      handleFileEdit(updatedFile, setFormData)
    },
    [setFormData]
  )

  // Field label mapping for validation focus
  const FIELD_LABEL_MAP = {
    sources: `${INPUT_LABEL_DESCRIPTION_SOURCE}*`,
    description: `${DESCRIPTION_PLACEHOLDER}*`,
  }

  const validateForm = () => {
    const newErrors = {
      SOURCE: formData.sources === '',
      DESCRIPTION: formData.description.trim() === '',
    }

    setErrors({
      SOURCES: newErrors.SOURCE ? ERROR_MESSAGES.SOURCES : '',
      DESCRIPTION: newErrors.DESCRIPTION ? ERROR_MESSAGES.DESCRIPTION : '',
    })

    const hasValidationErrors = Object.values(newErrors).some(Boolean)

    // Only check for empty fields if there are no validation errors
    const isValid = !hasValidationErrors
      ? true
        : validateAndFocusFirstEmptyField(
            formData,
            FIELD_ORDER,
            FIELD_LABEL_MAP
          )

    return !hasValidationErrors && isValid
  }
  const handleSave = () => {
    if(!hasAddNewPermission) return;
    if (!validateForm()) return

    const createMarketResearchForm = new FormData()

    const fieldsToAppend = {
      [API_FIELD_KEYS.PROJECT_ID]: params.id,
      [API_FIELD_KEYS.SOURCE]: formData.sources?.trim(),
      [API_FIELD_KEYS.DESCRIPTION]: formData.description?.trim(),
      [API_FIELD_KEYS.DOCUMENTS_TO_DELETE]: JSON.stringify(
        finalFileData.documents_to_delete ?? []
      ),
      [API_FIELD_KEYS.CREATE_META_DATA]: JSON.stringify(
        finalFileData.create_meta_data ?? []
      ),
      [API_FIELD_KEYS.UPDATE_META_DATA]: JSON.stringify(
        finalFileData.update_meta_data ?? []
      ),
    }

    finalFileData?.documents_to_create?.forEach((fileData) => {
      if (fileData instanceof File) {
        createMarketResearchForm.append(
          API_FIELD_KEYS.DOCUMENTS_TO_CREATE,
          fileData,
          fileData.name
        )
      }
    })

    Object.entries(fieldsToAppend).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        createMarketResearchForm.append(key, value)
      }
    })

    const onSuccess = () => {
      showActionAlert(STATUS.SUCCESS)
      setFinalFileData(FINALFILEINITIALDATA)
      setFormData(INITIAL_FORM_DATA)
      setIsEdit(false)
      setEditId(null)
      setIsModalOpen(false)

      if (editId) {
        marketStudy()

      }
      else {
        refetch()
      }
    }

    const onError = () => {
      showActionAlert(STATUS.FAILED)
    }

    if (isEdit && editId) {
      updateMutation.mutate(
        { id: editId, data: createMarketResearchForm },
        {
          onSuccess,
          onError,
        }
      )
    } else {
      addMutation.mutate(createMarketResearchForm, { onSuccess })
    }
  }

  const handleDeleteFromTable = async (id: number) => {
    if(!hasAddNewPermission) return;
    const result = await showActionAlert(STATUS.DELETE)

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutate(id)
        showActionAlert(STATUS.SUCCESS)
        await refetch()
      } catch (error) {
        console.error('Failed to fetch data:', error)
        showActionAlert(STATUS.FAILED)
      }
    }
  }

  const handleEditFromTable = (data: any) => {
    setIsModalOpen(true)
    setIsEdit(true)
    
    const uploadedFile = data.documents ?? []
    
    setFormData((prev) => ({
      ...prev,
      description: data.description ?? '',
      sources: data.sourceList?.join('\n') ?? '',
      uploadedFile: uploadedFile,
    }))
    
    setUploadedFiles(uploadedFile)
    
    setFinalFileData(FINALFILEINITIALDATA)
    
    setEditId(data.id)
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [isModalOpen])
  useEffect(() => {
    if(Number(editId)){
    marketStudy()

    }
  }, [editId])
  const handleSourceChange = (event: string) => {
    if(!hasAddNewPermission) return;
    setFormData((prev) => ({
      ...prev,
      sources: event,
    }))
    setErrors((prev) => ({ ...prev, SOURCES: '' }))
  }

  const handleDescriptionChange = (event: string) => {
    if(!hasAddNewPermission) return;
    setFormData((prev) => ({
      ...prev,
      description: event,
    }))
    setErrors((prev) => ({ ...prev, DESCRIPTION: '' }))
  }

  const handleCancelRoute = () => {
    router.push(PROJECT_INFO_SCREEN_URL)
}

  const handleCloseReviewerModalMarket = () => {
    setIsReviewerModal(false)
    setButtonId(null) // Reset button_id when modal closes
  }
 
  // Update getButtonConfig to pass trigger_status_id to handleSubmitReviewModal
  const handleButtonChangeMarket = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setButtonId(trigger_status_id || null)
    setButtonName(button_label)
    setIsReviewerModal(true)
  }
 
  // Update these handler functions to accept trigger_status_id parameter
  const handleSubmitForReviewMarket = (trigger_status_id?: number) => {
    handleButtonChangeMarket(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }
 
  const handleApproveMarket = (trigger_status_id?: number) => {
    handleButtonChangeMarket(BUTTON_LABEL.APPROVE, trigger_status_id)
  }
 
  const handleRejectMarket = (trigger_status_id?: number) => {
    handleButtonChangeMarket(BUTTON_LABEL.REJECT, trigger_status_id)
  }
  
  const handleSubmitApprovalMarket = (trigger_status_id?: number) => {
    const payload = {
      project_id: Number(params.id),
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
    handleSubmitForReview: handleSubmitForReviewMarket,
    handleApprove: handleApproveMarket,
    handleReject: handleRejectMarket,
    handleCancel: handleCancelRoute,
    handleSave: handleSave,
    handleSubmitApproval: handleSubmitApprovalMarket,
    isDisabled: isAnyLoading(),
  })
 
 const {buttons: buttonDetails, hasEditPermission} = processButtonsWithPermissions(permissions, getButtons)
 
 useEffect(() => {
  if(!buttonDetails && editData) {
     showActionAlert(QUERYCONSTANTS.ALERT_TYPES.CUSTOM_ALERT, {
              title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
              text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
              icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
              cancelButton: false,
              confirmButton: false,
            });
  }
 },[editData, buttonDetails])


  return (
      <TableContainer>
        <GlobalLoader loading={isAnyLoading()} />
        {getList && (
          <>
            <Grid2 container spacing={NUMBERMAP.TWO} sx={ProjectStyles.text}>
            <Grid2 size={NUMBERMAP.SIX}>
              <Label title={TITLE_TEXT}></Label>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX} sx={ProjectStyles.table}>
              {!isModalOpen && hasAddNewPermission && (
                <AddButton
                  {...ADD_BUTTON_CONFIG}
                  color="primary"
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleOpenModal}
                >
                  {ADD_FEEDBACK_TEXT}
                </AddButton>
              )}
            </Grid2>
          </Grid2>

          {isModalOpen ? (
        <Content>
          <FormSection>
            <FormContent sx={FORM_CONTENT_STYLES}>
              <Grid2 container spacing={1} sx={gridStyles}>
                 <Grid2 size={GRID_SIZE.HALF_WIDTH}>
                   <InputField
                     label={`${INPUT_LABEL_DESCRIPTION_SOURCE}*`}
                     placeholder={SOURCE_PLACEHOLDER}
                     value={formData.sources}
                     onChange={(value: string) => handleSourceChange(value)}
                     error={errors.SOURCES ?? ''}
                     maxLength={maxSourceLength}
                     hasEditable={!hasAddNewPermission}
                   />
                 </Grid2>
                 <Grid2 size={GRID_SIZE.HALF_WIDTH}>
                   <Description
                     label={`${DESCRIPTION_LABEL}*`}
                     {...DESCRIPTION_TEXTFIELD_CONFIG}
                     value={formData.description}
                     onChange={(value: string) => handleDescriptionChange(value)}
                     error={errors.DESCRIPTION ?? ''}
                   />
                 </Grid2>
                <Grid2 size={GRID_SIZE.FULL_WIDTH}>
                  <FileUploadManager
                    initialFiles={uploadedFiles}
                    onFileUpload={onFileUpload}
                    onFileEdit={onFileEdit}
                    hasEditable={!hasAddNewPermission}
                    onSubmit={(data) => {
                      setFinalFileData((prev) => mergeFinalFileData(prev, data))
                      handleFileRemove(data)
                    }}
                  />
                </Grid2>
              </Grid2>
            </FormContent>
          </FormSection>

          <ButtonGroupBox>
            <ButtonGroup
              buttons={SAVE_CANCEL_BUTTONS_MAIN.map((btn) => ({
                ...btn,
                onClick: getButtonAction(
                  btn.label,
                  () => {
                    handleCancel(setFormData, setErrors)
                    setIsEdit(false)
                    setEditId(null)
                    setIsModalOpen(false)
                  },
                  handleSave
                ),
                disabled: btn.label === BUTTON_LABEL.SAVE ? !hasAddNewPermission : false,
              }))}
            />
          </ButtonGroupBox>
        </Content>
      ) : (
        <>
          <MarketResearchTable
            onEditRow={handleEditFromTable}
            onDelete={handleDeleteFromTable}
            data={marketList}
            sx={{
              pointerEvents: !hasEditPermission
                ? GLOBAL_STYLES.NONE
                : GLOBAL_STYLES.AUTO,
            }}
          />
          <Box sx={styles.commentsContainer}>
          <CommentsHistory
            comments={getList?.meta_info?.task_info?.task_comments}
          />
          </Box>
          <Box sx={styles.buttonContainer}>
            <ButtonGroup buttons={buttonDetails ?? []} />
          </Box>
          <ReviewerModal
            open={isReviewerModal}
            onClose={handleCloseReviewerModalMarket}
            project_id={Number(params.id)}
            button_id={buttonId ?? 0}
            mode={buttonName ?? ''}
            menu_id={getList?.meta_info?.action_control?.menuId ?? 0}
            menu_name={getList?.meta_info?.action_control?.formName ?? ''}
            reviewerList={getList?.meta_info?.task_info?.reviewer_list}
          />
        </>
      )}
          </>
        )}
      </TableContainer>
  )
}

export default MarketResearchComponent
