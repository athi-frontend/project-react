'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  InputField,
  RichTextEditor,
  Label,
  showActionAlert,
  DataGridTable,
  ActionButton,
} from '@/components/ui'
import { DesignReviewFormData, BasicFileObject } from '@/types/modules/design-review'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { FileData as FileUploadV3Data } from '@/types/components/ui/fileUploadV3'
import {
  useSaveDesignReview,
  useGetAction,
  useDesignReviewInfo,
} from '@/hooks/modules/dnd/useDesignReviewReport'
import { Content, FormSection } from '@/styles/modules/dnd/designReviewReport'
import {
  FORM_TITLE,
  FORM_FIELDS_CONFIG,
  API_PARAMS,
  GRID_SIZES,
  FILE_PROPERTIES,
  FIELD_ORDER,
  FIELD_LABEL_MAP,
  MEMBERS_ATTENDED_COLUMNS,
} from '@/constants/modules/dnd/designReviewReport'
import { COMMON_CONSTANTS, mergeFinalFileData } from '@/lib/utils/common'
import {
  validateDesignReviewFields,
  createPayload,
  designReviewInitialValue,
} from '@/lib/modules/dnd/designReviewReport'
import { Grid2 } from '@mui/material'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import {
  LabelContainer,
  LabelText,
  LabelValue,
} from '@/styles/components/modules/prototypeForm'
import { DocumentStructure, UploadedFileData } from '@/types/modules/dnd/hld'
import { BUTTONSTYLE, FINALFILEINITIALDATA,NUMBERMAP } from '@/constants/common'
import { API_FIELD_KEYS } from '@/constants/modules/dnd/hld'
import {
  COLUMN_FIELDS,
  getColumns,
} from '@/constants/modules/dnd/prototype'
import { HeaderTitle } from '@/styles/common'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import MembersAttendedModal from './MembersAttendedModal'

const {
  STATUS,
  ORGANIZATION_REVIEW_ID,
  DOCUMENTS_TO_CREATE,
  DOCUMENTS_TO_DELETE,
} = API_PARAMS
const { ACTIVE_STATUS, SUCCESS_ALERT, DENIED_ALERT, EMPTY_ARRAY_LENGTH } =
  COMMON_CONSTANTS

/**
 Classification : Confidential
**/

const DesignReviewForm: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const executionStageId = params.order_id
  const projectId = params.id
  const Review_Id = params.review_id
  const { data: prototypeActionData, refetch, isLoading: actionLoading, isFetching: actionFetching } = useGetAction(
    Number(executionStageId)
  )
  const [isUpdate, setIsUpdate] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [documentIdToDelete] = useState<number[]>([])
  const [formData, setFormData] = useState<DesignReviewFormData>(
    designReviewInitialValue
  )
  const [hasEditPermission, setHasEditPermission] = useState(true)

  const { refetch: refetchReviewData, isLoading: reviewLoading, isFetching: reviewFetching } = useDesignReviewInfo(Number(Review_Id))
  const [finalFileData, setFinalFileData] =
    useState<DocumentStructure>(FINALFILEINITIALDATA)
  const { mutate: saveDesignReview, isPending: isSaving } = useSaveDesignReview()
  const stage_name = prototypeActionData?.data[NUMBERMAP.ZERO]?.stage_name ?? '-'
  const stage_number = prototypeActionData?.data[NUMBERMAP.ZERO]?.stageNumber

  const formDataKeys = Object.keys(
    designReviewInitialValue
  )
  type FormErrors = Partial<Record<keyof DesignReviewFormData, string>>
  const [errors, setErrors] = useState<FormErrors>({})
  
  // Members Attended state
  const [membersAttended, setMembersAttended] = useState<any[]>([])
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState<string | number | null>(null)

  // Refetch data when component mounts or Review_Id changes
  useEffect(() => {
    if (Review_Id) {
      refetchReviewData()
    }
    refetch()
  }, [Review_Id])


  useEffect(() => {
    setIsUpdate(true)
    if (prototypeActionData?.data[NUMBERMAP.ZERO]) {
      const data = prototypeActionData.data[NUMBERMAP.ZERO]
      setFormData({
        ...data,
        execution_stage_id: data.project_stage_order_id ?? '',
        members: Array.isArray(data.members) ? data.members.join(', ') : data.members ?? '',
        minutes: data.minutes_of_meeting ?? '',
      })
      // Initialize members attended from API data - use members array directly
      if (data.members && Array.isArray(data.attended_members)) {
        setMembersAttended(data.attended_members)
      } else {
        setMembersAttended([])
      }
    }
  }, [prototypeActionData])


  const handleInputChange = (
    name: keyof DesignReviewFormData,
    value:
      | string
      | string[]
      | File
      | File[]
      | null
      | number
      | Array<number | string>
  ) => {
    if(!hasEditPermission) return;
    setFormData((prevData) => ({ ...prevData, [name]: value }))
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = validateDesignReviewFields(formData, formDataKeys)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > EMPTY_ARRAY_LENGTH) {
      validateAndFocusFirstEmptyField(formData, Array.from(FIELD_ORDER), FIELD_LABEL_MAP);
    }
    return Object.keys(newErrors).length === EMPTY_ARRAY_LENGTH
  }
  const handleCancel = () => {
    router.push(ROUTE_PATHS.DND_PROJECT_LIST)
    setErrors({})
  }
  const handleFileUpload = (newFile: File | FileData2) => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newFile],
    }))

    if (errors.documents) {
      setErrors((prev) => ({
        ...prev,
        documents: '',
      }))
    }
  }

  // Helper function to extract file ID from different file types
  const getFileId = (fileObj: File | FileData2 | FileUploadV3Data | UploadedFileData | BasicFileObject): string | number | undefined => {
    if (FILE_PROPERTIES.FILE_ID in fileObj) {
      return fileObj.file_id
    }
    if (FILE_PROPERTIES.ID in fileObj) {
      return fileObj.id
    }
    return undefined
  }

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      setFormData((prev) => {
        const updatedFiles = prev.documents.map((file) => {
          const currentId = getFileId(file)
          const updatedId = updatedFile.document_id ?? updatedFile.id

          return currentId === updatedId ? { ...file, ...updatedFile } : file
        })

        return {
          ...prev,
          documents: updatedFiles,
        }
      })
    },
    []
  )

  const handleSave = async () => {
    if (validateForm()) {
      setIsDisabled(true)
      const createReviewForm = new FormData()
      // Format members array for payload
      const membersPayload = membersAttended.map((member) => {
        const statusId = member.status_id ?? member.status
        return {
          employee_id: member.employee_id ?? Number(member.member_id),
          description: member.description ?? '',
          status_id: statusId ? Number(statusId) : null,
        }
      })

      const fieldsToAppend = {
        project_stage_order_id: Number(executionStageId),
        place: formData.place,
        topic: formData.topic,
        minutes_of_meeting: formData.minutes,
        members: JSON.stringify(membersPayload),
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
          createReviewForm.append(
            API_FIELD_KEYS.DOCUMENTS_TO_CREATE,
            fileData,
            fileData.name
          )
        }
      })

      Object.entries(fieldsToAppend).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          createReviewForm.append(key, value)
        }
      })

      formData.documents.forEach((file) => {
        if (file instanceof File) {
          createReviewForm.append(DOCUMENTS_TO_CREATE, file, file.name)
        }
      })

      const payload = createPayload({
        isUpdate,
        formData,
        createReviewForm,
        documentIdToDelete,
        activeStatus: ACTIVE_STATUS,
        reviewStatus: STATUS,
        organizationReviewId: ORGANIZATION_REVIEW_ID,
        documentsToDelete: DOCUMENTS_TO_DELETE,
      })


      saveDesignReview(payload, {
        onSuccess: () => {
          setIsDisabled(false)
          showActionAlert(SUCCESS_ALERT)
          setFinalFileData(FINALFILEINITIALDATA)
          // Refetch data after successful save
          refetch() 
        },
        onError: () => {
          setIsDisabled(false)
          showActionAlert(DENIED_ALERT)
        },
      })
    }
  }

  const getMembersAttendedColumns = (
    onEdit: (id: string | number) => void,
    onDelete: (id: string | number) => void,
    hasEditPermission: boolean
  ) => {
    const renderActionsCell = (params: any) => {
      const rowId = params.row.id
      const handleEdit = () => onEdit(rowId)
      const handleDelete = () => onDelete(rowId)
      return (
        <ActionButton
          onEdit={handleEdit}
          onDelete={handleDelete}
          editDisabled={!hasEditPermission}
          deleteDisabled={!hasEditPermission}
        />
      )
    }

    return MEMBERS_ATTENDED_COLUMNS.map((col) => {
      if (col.field === 'actions') {
        return {
          ...col,
          renderCell: renderActionsCell,
        }
      }
      return col
    })
  }

  const mapMembersToTableRows = (members: any[]) => {
    return members.map((member: any, index: number) => ({
      id: member.id ?? `row-${index}`,
      member_name: member.member_name ?? (member.firstName && member.lastName ? `${member.firstName} ${member.lastName}`.trim() : '-'),
      role: member.role_name ?? member.role ?? '-',
      ...member,
    }))
  }

  const isAnyLoading = () => {
    if (actionLoading) return true
    if (actionFetching) return true
    if (reviewLoading) return true
    if (reviewFetching) return true
    if (isSaving) return true
    return false
  }

  const handleMemberModalClose = () => {
    setIsMemberModalOpen(false)
    setEditingMemberId(null)
  }

  const handleMemberSave = (memberData: any) => {
    if (editingMemberId) {
      const updatedMembers = membersAttended.map((m: any) => 
        m.id === editingMemberId ? memberData : m
      )
      setMembersAttended(updatedMembers)
    } else {
      setMembersAttended([...membersAttended, memberData])
    }
    setIsMemberModalOpen(false)
    setEditingMemberId(null)
  }

  const handleAddMember = () => {
    setEditingMemberId(null)
    setIsMemberModalOpen(true)
  }

  const handleEditMember = (id: string | number) => {
    setEditingMemberId(id)
    setIsMemberModalOpen(true)
  }

  const handleDeleteMember = (id: string | number) => {
    const newMembers = membersAttended.filter((m: any) => 
      m.id  !== id
    )
    setMembersAttended(newMembers)
  }
  
  return (
    <>
    <GlobalLoader loading={isAnyLoading()} />
    {prototypeActionData && (
    <Content>
      <Label title={FORM_TITLE} />
      <FormSection>
        <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={GRID_SIZES.HALF_WIDTH}>
            <LabelContainer>
              <LabelText>Design Stage</LabelText>
              <LabelValue>{stage_number ? `${stage_name} ${stage_number}` : stage_name}</LabelValue>
            </LabelContainer>
          </Grid2>
          <Grid2 size={GRID_SIZES.HALF_WIDTH}>
            <InputField
              {...FORM_FIELDS_CONFIG.PLACE}
              value={formData?.place ?? ''}
              onChange={(value) =>
                handleInputChange(FORM_FIELDS_CONFIG.PLACE.onChange, value)
              }
            />
          </Grid2>
          <Grid2 size={GRID_SIZES.HALF_WIDTH}>
            <InputField
              {...FORM_FIELDS_CONFIG.TOPIC}
              value={formData?.topic ?? ''}
              onChange={(value) =>
                handleInputChange(FORM_FIELDS_CONFIG.TOPIC.onChange, value)
              }
              error={errors.topic}
            />
          </Grid2>
          <Grid2 size={GRID_SIZES.FULL_WIDTH}>
            <DataGridTable
              title="Members Attended"
              columns={getMembersAttendedColumns(
                handleEditMember,
                handleDeleteMember,
                hasEditPermission
              )}
              rows={mapMembersToTableRows(membersAttended)}
              idField="id"
              hideFooter
              showAddButton
              onAddRow={handleAddMember}
            />
          </Grid2>
          <Grid2 size={GRID_SIZES.HALF_WIDTH}>
            <LabelContainer>
              <LabelText>Type of Report</LabelText>
              <LabelValue>{'-'}</LabelValue>
            </LabelContainer>
          </Grid2>
          <Grid2 size={GRID_SIZES.HALF_WIDTH}>
            <RichTextEditor
              label={FORM_FIELDS_CONFIG.MINUTES.label}
              value={formData?.minutes ?? ''}
              onChange={(value) =>
                handleInputChange(FORM_FIELDS_CONFIG.MINUTES.onChange, value)
              }
              error={errors.minutes}
              placeholder={FORM_FIELDS_CONFIG.MINUTES.placeholder}
              id={FIELD_LABEL_MAP.minutes}
              disabled={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={GRID_SIZES.FULL_WIDTH}>
            <FileUploadManager
              initialFiles={formData.documents ?? []}
              onFileUpload={handleFileUpload}
              onFileEdit={handleFileEdit}
              hasEditable={!hasEditPermission}
              onSubmit={(data) => {
                setFinalFileData((prev) => mergeFinalFileData(prev, data))
              }}
            />
          </Grid2>
          <HeaderTitle>Design Review Member Approval Status</HeaderTitle>
            <DataGridTable
            rows={prototypeActionData?.data[NUMBERMAP.ZERO]?.members ?? []}
            columns={getColumns()}
            idField={COLUMN_FIELDS.ID}
            hideFooter
            />
        </Grid2>
      </FormSection>
      <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
        <CommentsHistory comments={prototypeActionData?.meta_info?.task_info?.task_comments} />
      <ReviewerModalManager
        isLoading={actionLoading}
        permissions={prototypeActionData?.meta_info?.action_control?.permissions ?? []}
        projectId={Number(projectId)}
        menuId={prototypeActionData?.meta_info?.action_control?.menuId}
        menuName={prototypeActionData?.meta_info?.action_control?.formName}
        taskId={prototypeActionData?.meta_info?.task_info?.task_id}
        customHandlers={{ 
          handleCancel: handleCancel,
          handleSave: handleSave,
          isDisabled: isDisabled
        }}
        onPermissionChange={setHasEditPermission}
        reviewerList={prototypeActionData?.meta_info?.task_info?.reviewer_list}
      />
      </Grid2>
    </Content>
    )}
    
    {/* Members Attended Modal */}
    <MembersAttendedModal
      open={isMemberModalOpen}
      onClose={handleMemberModalClose}
      onSave={handleMemberSave}
      editingData={
        editingMemberId
          ?? undefined
      }
      hasEditPermission={hasEditPermission}
    />
    </>
  )
}

export default DesignReviewForm