'use client'
import React, { useState, useEffect } from 'react'
import { BUTTONSTYLE, NUMBERMAP, STATUS } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import {
  COMMON_CONSTANTS,
} from '@/lib/utils/common'
import {
  API_FIELD_KEYS,
  ERROR_MESSAGES,
  PROJECT_LIST_SCREEN_URL,
  FIELD_LABEL_MAP,
} from '@/constants/modules/dnd/clinicalEvaluation'
import { useParams, useRouter } from 'next/navigation'
import {
  BoxSection,
  FormContainer,
  FormContent,
  FormSection,
  FormTitle,
} from '@/styles/modules/dnd/clinicalEvaluation'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { Grid2 } from '@mui/material'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import { useFileHandling } from '@/hooks/modules/dnd/useFileHandling'

const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS

interface ClinicalEvaluationPageProps {
  getEvaluationData: any
  isLoadingSpecifications: boolean
  isFetchingSpecifications: boolean
  saveEvaluation: (formData: FormData, options?: any) => void
  isPending: boolean
  documentsKey: 'planDocuments' | 'reportDocuments'
  title: string
  subHeader: string
  errorMessageKey: keyof typeof ERROR_MESSAGES
  fieldLabelKey: keyof typeof FIELD_LABEL_MAP
}

const ClinicalEvaluationPage: React.FC<ClinicalEvaluationPageProps> = ({
  getEvaluationData,
  isLoadingSpecifications,
  isFetchingSpecifications,
  saveEvaluation,
  isPending,
  documentsKey,
  title,
  subHeader,
  errorMessageKey,
  fieldLabelKey,
}) => {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [documents, setDocuments] = useState<any[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    [documentsKey]: '',
  })
  const [hasEditPermission, setHasEditPermission] = useState(true)

  const {
    handleFileUpload,
    handleFileEdit,
    handleFileSubmit,
    appendFileFields: appendFileFieldsToFormData,
    resetFileData,
  } = useFileHandling(
    { documents },
    (updater) => {
      const updated = updater({ documents })
      setDocuments(updated.documents)
    }
  )

  const isAnyLoading = () => {
    if (isLoadingSpecifications) return true
    if (isFetchingSpecifications) return true
    if (isPending) return true
    return false
  }

  useEffect(() => {
    if (
      getEvaluationData?.data &&
      getEvaluationData.data.length > EMPTY_ARRAY_LENGTH
    ) {
      const evaluationData = getEvaluationData.data[EMPTY_ARRAY_LENGTH]
      setDocuments(evaluationData[documentsKey] ?? [])
    }
  }, [getEvaluationData, documentsKey])


  const handleCancel = () => {
    setDocuments([])
    router.push(PROJECT_LIST_SCREEN_URL)
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!documents || documents.length === EMPTY_ARRAY_LENGTH) {
      newErrors[documentsKey] = ERROR_MESSAGES[errorMessageKey]
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      validateAndFocusFirstEmptyField(
        { [documentsKey]: documents },
        [documentsKey],
        FIELD_LABEL_MAP
      )
    }
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const buildFormData = () => {
    const formDataPayload = new FormData()

    formDataPayload.append(API_FIELD_KEYS.PROJECT_ID, id)

    appendFileFieldsToFormData(formDataPayload, {
      DOCUMENTS_TO_CREATE: API_FIELD_KEYS.DOCUMENTS_TO_CREATE,
      DOCUMENTS_TO_DELETE: API_FIELD_KEYS.DOCUMENTS_TO_DELETE,
      CREATE_META_DATA: API_FIELD_KEYS.CREATE_META_DATA,
      UPDATE_META_DATA: API_FIELD_KEYS.UPDATE_META_DATA,
    })

    return formDataPayload
  }

  const handleSave = () => {
    if (!validateForm()) return

    const formDataPayload = buildFormData()

    saveEvaluation(formDataPayload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
        resetFileData()
        setDocuments([])
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }


  const permissions = getEvaluationData?.meta_info?.action_control?.permissions ?? []

  return (
    <FormContainer>
      <GlobalLoader loading={isAnyLoading()} />
      {getEvaluationData && (
        <>
          <FormContent>
            <FormTitle>{title}</FormTitle>
            <FormSection id={FIELD_LABEL_MAP[fieldLabelKey]}>
              <BoxSection>
                <FileUploadManager
                  initialFiles={documents ?? []}
                  onFileUpload={handleFileUpload}
                  onFileEdit={handleFileEdit}
                  onSubmit={handleFileSubmit}
                  hasEditable={!hasEditPermission}
                  uploadMandError={errors[documentsKey]}
                  subHeader={subHeader}
                />
                <Grid2 sx={STYLE5}>
                  <CommentsHistory
                    comments={getEvaluationData?.meta_info?.task_info?.task_comments}
                  />
                </Grid2>
              </BoxSection>
            </FormSection>
          </FormContent>
          <Grid2 sx={BUTTONSTYLE}>
            <ReviewerModalManager
              permissions={permissions}
              projectId={id}
              menuId={getEvaluationData?.meta_info?.action_control?.menuId}
              menuName={getEvaluationData?.meta_info?.action_control?.formName}
              isLoading={isLoadingSpecifications}
              onPermissionChange={setHasEditPermission}
              reviewerList={getEvaluationData?.meta_info?.task_info?.reviewer_list}
              customHandlers={{
                handleCancel: handleCancel,
                handleSave: handleSave,
              }}
            />
          </Grid2>
        </>
      )}
    </FormContainer>
  )
}

export default ClinicalEvaluationPage

