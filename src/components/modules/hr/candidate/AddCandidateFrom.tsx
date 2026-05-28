'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Grid2 } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import {
  InputField,
  ButtonGroup,
  DataGridTable,
  Description,
  MultiSelect,
  showActionAlert,
  Label,
} from '@/components/ui'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import { SkillSetContainer } from '@/styles/modules/dnd/competencySkill'
import {
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  BUTTON_LABELS,
  DATA_SOURCE_NAME,
  VALIDATION_MESSAGES,
  COMMENTS,
  STATUS_FIELD_NAME,
  NAME,
  ID,
  USER_ID_FIELD_NAME,
  USER_ID_SOURCE_NAME,
  ACTUAL_EXP,
  ACTUAL_EDU,
  DATE_OF_INTERVIEW,
  TEXT,
  RECRUITMENT_DETAILS,
  CONTAINER_ID,
  FAILED_TO_SAVE_DATA,
  UNEXPECTED_ERROR,
  INSERT,
  UPDATE,
  EDUCATION_QUALIFICATION,
  EXPERIENCE,
  NOT_SPECIFIED,
  ISO_FORMAT,
  HEADER_ID,
  SKILL_NAME,
  HEADER_SKILL_NAME,
  LEVEL_REQUIRED,
  HEADER_LEVEL_POSSESSED,
  ACTIONS,
  HEADER_ACTIONS,
  INTERVIEW_DATE,
  ACTUAL_EDUCATION,
  ACTUAL_EXPERIENCE,
  INTERVIEWED_BY,
  STATUS,
  SKILL_LEVEL_ID,
  SKILL_LEVEL,
  SKILL_SET_DATA_SOURCE_NAME,
  SKILL_SET_DATA_FIELD_NAME,
  RESOURCE_REQUISITION_ID,
  FIRST_NAME,
  LAST_NAME,
  JUSTIFICATION,
  STATUS_ID,
  STATUS_NAME,
  CANDIDATE_FITST_NAME,
  CANDIDATE_LAST_NAME,
  SUPPORTINGFILE_CONSTANTS,
  STATUS_SELECTED_FIELD_VALUE,
  CREATE_PAGE_TITLE,
  EDIT_PAGE_TITLE,
  CREATE,
  CANDIDATE_EVALUATION_CONSTANTS,
} from '@/constants/modules/hr/candidateEvaluation'
import {
  STYLE3,
  STYLE5,
  STYLE7,
  NONE,
} from '@/styles/modules/hr/candidateEvaluation'
import { DEFAULT_FORM_DATA, isAnyLoading } from '@/lib/modules/hr/candidateEvaluation'
import {
  FormData,
  FormErrors,
  SkillData
} from '@/types/modules/hr/candidateEvaluation'
import {
  EmployeeInfoContainer,
  InfoLabel,
  InfoValue,
} from '@/styles/modules/hr/healthDeclaration'
import {
  useCandidateEvaluationById,
  useInterviewStatus,
} from '@/hooks/modules/hr/useCandidateEvaluation'
import { useListWorkflowRecruitments } from '@/hooks/modules/hr/useResourceRequistion'
import { magicFormSave } from '@/lib/utils/magicSave'
import magicSaveConstants from '@/constants/magicSave'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import dayjs from 'dayjs'
import { useSkillLevels } from '@/hooks/modules/hr/useRoleDefinition'
import utc from 'dayjs/plugin/utc'
import { ARRAY_INDEX, FINALFILEINITIALDATA, HTTP_STATUS, NUMBERMAP } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { useCompetencySkillBYId, useListWorkflowEmployes } from '@/hooks/modules/hr/useEmployeeList'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  FinalFileData,
  formatValue,
  mergeFinalFileData,
  numberValidation,
  restructureData,
  convertMuiDayjsToUTC
} from '@/lib/utils/common'
import { FAILED } from '@/constants/modules/dnd/pnd'
import { Input_Field } from '@/styles/modules/hr/inductionTraining'
import { useSaveWorkflowAction } from '@/hooks/modules/hr/useCommonReviewModal'
import { HRReviewerModalManager } from '../reviewer-modal'
import { SUCCESS_ALERT } from '@/constants/modules/dnd/formTeam'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { prepareDraftDocumentsGeneric, DraftDocumentsConfig } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import {
  extractPreservedDocumentIds,
  filterDocumentsToDeleteArray,
  filterUpdateMetaData
} from '@/lib/utils/modules/hr/preservedDocumentsFilter'

dayjs.extend(utc)


/**
    *Classification : Confidential
**/

const CandidateEvaluationForm: React.FC = () => {
  const router = useRouter()
  const { id: rawIdFromParams } = useParams()
  const paramId = Array.isArray(rawIdFromParams) ? rawIdFromParams[NUMBERMAP.ZERO] : rawIdFromParams
  const isAddMode = (paramId === CREATE || paramId == 'draft')
  const candidateId = isAddMode || !paramId || Number.isNaN(Number(paramId)) ? null : Number(paramId)
  const formRef = useRef<HTMLElement | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [finalFileData, setFinalFileData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  type SupportedFieldValue = string | string[] | dayjs.Dayjs;
  const [hasEditPermission, setHasEditPermission] = useState(true);
  const [defaultJdData, setDefaultJdData] = useState({ educationJd: '', experienceJd: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [skillsData, setSkillsData] = useState<SkillData[]>([])
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // Candidate evaluation draft configuration
  const CANDIDATE_DRAFT_CONFIG: DraftDocumentsConfig = {
    fileFieldToSectionMap: {
      'none': 'supporting_files', // Single file section - use 'none' key
      'documents': 'supporting_files', // Alternative key for documents
    },
    sectionTypeToNameMap: {
      'none': 'supporting_files',
      'single': 'supporting_files',
    },
    responseDataKeyMap: {
      'none': 'eqms_hr_candidate_evalution_supporting_files',
      'single': 'eqms_hr_candidate_evalution_supporting_files',
    },
  }

  const { draftSave, clearDraftSave, isDraftSaving, isFetchingDraft, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'candidate_evaluation',
    context_instance_id: isAddMode ? null : candidateId,
    enableFetch: false
  })

  // Fetch candidate evaluation data
  const {
    data: candidateEvaluationResponse,
    refetch: refetchCandidateEvaluation, isFetching: isCandidateEvaluationLoading,
  } = useCandidateEvaluationById(candidateId)

  // Fetch users for the Interviewed By dropdown
  const { data: usersResponse, isLoading: isUsersLoading, refetch: userRefetch } = useListWorkflowEmployes()

  // Fetch Interview status
  const { data: interviewStatusOptions, isLoading: isStatusLoading } =
    useInterviewStatus()

  // Fetch recruitments for the Recruitment ID dropdown
  const { data: recruitmentsResponse, refetch, isFetched: recruitmentList } = useListWorkflowRecruitments(null, 'Approved')

  // Fetch skill levels for the Skill Level dropdown
  const { data: skillLevelsResponse, isLoading: isSkillLevelsLoading } =
    useSkillLevels()

  const { data: competencySkillResponse, refetch: refetchCompetencySkills } =
    useCompetencySkillBYId(selectedRoleId ?? '')
  const { mutate: submitWorkflow } = useSaveWorkflowAction(candidateEvaluationResponse?.action_control?.formName)
  // State for form data, errors, skills, and selected role ID
  const [formData, setFormData] = useState<FormData>({
    ...DEFAULT_FORM_DATA,
    interviewedBy: [],
  })


  // Prepare dropdown options for Recruitment ID
  const recruitmentOptions = [
    { id: '', name: FORM_PLACEHOLDERS.RESOURCE_REQUISITION_ID },
    ...(recruitmentsResponse?.data?.map((recruitment: any) => ({
      id: recruitment.resource_requisition_id,
      name: recruitment.description ?? `-`,
      role_name: recruitment.role ?? `-`,
      ...recruitment,
    })) ?? []),
  ]

  useEffect(() => {
    setTimeout(() => {
      setFormData({
        ...DEFAULT_FORM_DATA,
        interviewedBy: [],
      })
      setFinalFileData(FINALFILEINITIALDATA)
    }, NUMBERMAP.ZERO)
    refetch()
    userRefetch()
    fetchDraft()
    if (candidateId) {
      refetchCandidateEvaluation()
    }
  }, [])

  // Populate form data when API responses are received
  useEffect(() => {
    if (candidateEvaluationResponse?.data?.length && !draftData?.data) {
      const candidateData = candidateEvaluationResponse.data[NUMBERMAP.ZERO]
      const interviewDate = dayjs(candidateData.date_of_interview).isValid()
        ? dayjs(candidateData.date_of_interview).utc().format(ISO_FORMAT) : ''

      // Map interviewedBy to an array of user IDs as strings
      const interviewedBy = candidateData.interviewed_by.map((interviewer) =>
        interviewer.user_id
      )
      // Determine the value for interviewedBy without nested ternary
      let interviewedByValue: string[]
      if (interviewedBy.length) {
        interviewedByValue = interviewedBy
      } else if (usersResponse?.data?.length) {
        interviewedByValue = [usersResponse.data[NUMBERMAP.ZERO].id?.toString()]
      } else {
        interviewedByValue = []
      }

      // Map skill set
      const fetchedSkills = candidateData.candidate_evaluation_skill_set.map(
        (skill, index) => ({
          ...skill,
          id: (index + NUMBERMAP.ONE)?.toString(),
          skillName: skill?.skill_name,
          levelRequired: skill?.skill_level?.toString(),
          levelPossessed: skill?.skill_possess_level_id,
        })
      )

      // Set the recruitment ID to trigger role_id fetching
      const recruitmentId =
        candidateData.candidate_resource_requisition_id?.toString() ?? ''
      // Find decidedly the role_id and role_name from recruitmentsResponse based on recruitmentId
      const selectedRecruitment = recruitmentsResponse?.data?.find(
        (r: any) => r.resource_requisition_id == recruitmentId
      )

      // Update form data
      setFormData({
        resourceRequisitionId: recruitmentId,
        firstName: candidateData.candidate_first_name ?? '',
        lastName: candidateData.candidate_last_name ?? '',
        role: selectedRecruitment?.role_name ?? candidateData.role_name ?? '',
        interviewDate: interviewDate,
        educationJd: '',
        actualEducation: candidateData.actual_educational_qualification ?? '',
        experienceJd: '',
        actualExperience: candidateData.actual_experience ?? '',
        interviewedBy: interviewedByValue,
        status: candidateData.interviewed_status_id?.toString() ?? '',
        comments: candidateData.comments ?? '',
        justification: candidateData.justification ?? '',
        documents: candidateData?.documents ?? [],
        skill_level:
          skillLevelsResponse?.data?.[NUMBERMAP.ZERO]?.skill_level ?? '',
        skill_level_id:
          skillLevelsResponse?.data?.[NUMBERMAP.ZERO]?.skill_level_id ?? '',
      })
      setSelectedRoleId(candidateData.role_id?.toString() ?? null)
      // Update skills data only if API provides it
      setSkillsData(fetchedSkills)
    }
  }, [
    candidateEvaluationResponse
  ])

  useEffect(() => {
    if (draftData?.data) {
      // Get documents from draftDocuments if available, otherwise use documents and draftedDocuments
      setFinalFileData(FINALFILEINITIALDATA)
      const draftDocs = draftData?.data?.draftDocuments ?? []
      const serverDocs = draftData?.data?.documents ?? []
      setFormData({ ...draftData.data, documents: [...serverDocs, ...draftDocs] })
      if (draftData.data?.skillsData) {
        setSkillsData(draftData.data.skillsData)
      }

      // Initialize draftDocuments from draftData
      if (draftData?.data?.draftDocuments && typeof draftData?.data?.draftDocuments === 'object') {
        setDraftDocuments(draftData?.data?.draftDocuments)
      }

      // Initialize draftDelete from draftData
      if (draftData?.data?.draftDelete && Array.isArray(draftData?.data?.draftDelete)) {
        setDraftDelete(draftData?.data?.draftDelete)
      }
    }
  }, [draftData])
  // Fetch competency skills when roleId changes
  useEffect(() => {
    if (recruitmentList) {
      updateRoleDetails(formData?.resourceRequisitionId ?? null)
    }
  }, [recruitmentList && formData?.resourceRequisitionId])
  useEffect(() => {
    if (Number(selectedRoleId)) {
      refetchCompetencySkills()
    }
  }, [selectedRoleId ?? candidateEvaluationResponse?.data])

  // Update educationJd, experienceJd, skillsData, and role when competency skills are fetched
  useEffect(() => {
    if (competencySkillResponse?.data?.length && selectedRoleId !== null) {
      const competencyData = competencySkillResponse.data[NUMBERMAP.ZERO]
      // Update form data for education, experience, and role
      setDefaultJdData((prev) => ({
        ...prev,
        educationJd:
          competencyData.educational_qualification ?? EDUCATION_QUALIFICATION,
        experienceJd: competencyData.experience ?? EXPERIENCE,
        role: competencyData.role_name ?? FORM_LABELS.ROLE,
      }))
      // Map competency_skill_level_mapper to skillsData

      const fetchedSkills =
        competencyData.role_definition_skill_level_mapper?.map(
          (skill: any, index: number) => ({
            ...skill,
            fk_eqms_hr_role_definition_skill_level_mapper_id:
              skill.skill_level_mapper_id,
            id: (index + NUMBERMAP.ONE)?.toString(),
            skillName: skill.skill_name ?? `Skill ${index + NUMBERMAP.ONE}`,
            levelRequired: skill.skill_level?.toString() ?? NOT_SPECIFIED,
            levelPossessed: '', // Default to empty, to be filled by user
          })
        ) ?? []
      if (isAddMode && skillsData.length === NUMBERMAP.ZERO) {
        setSkillsData(fetchedSkills)
      }
    }
  }, [competencySkillResponse])

  const handleInputChange = (
    field: string,
    value: SupportedFieldValue
  ) => {
    if (!hasEditPermission) return;
    let updatedValue: string | string[] = getFormattedValue(field, value)

    setFormData((prev) => {
      const updated = { ...prev, [field]: updatedValue }
      handleDraftSave(updated, skillsData, finalFileData)
      return updated
    })

    if (field == FORM_FIELD_NAMES.STATUS && value !== STATUS_SELECTED_FIELD_VALUE) {
      setFormData(prev => ({ ...prev, justification: '' }));
    }

    handleValidation(field, value, updatedValue)

    if (field === FORM_FIELD_NAMES.INTERVIEW_DATE && dayjs.isDayjs(value)) {
      if (value.isValid()) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
    } else if (typeof updatedValue === 'string' && updatedValue && field !== FORM_FIELD_NAMES.ACTUAL_EDUCATION) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleDraftSave = (formData: FormData, skillsData: SkillData[], documents: FinalFileData) => {
    // Use the generic utility function for single file section
    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      formData,
      { 'none': documents ?? FINALFILEINITIALDATA },
      draftData,
      CANDIDATE_DRAFT_CONFIG
    )

    if (draftPreparation.draftDocuments) {
      setDraftDocuments(draftPreparation.draftDocuments)
    }
    if (draftPreparation.draftDelete) {
      setDraftDelete(draftPreparation.draftDelete)
    }

    // Extract drafted documents from draftDocuments
    const extractedDrafDocuments = draftPreparation.draftDocuments['supporting_files'] ?? []

    const payload = {
      candidate_id: candidateId ?? new Date().getTime(),
      ...formData,
      documents: draftData?.data?.documents ?? [],
      draftUpdateMetaData: draftPreparation.draftUpdateMetaData,
      draftDelete: draftPreparation.draftDelete,
      draftDocuments: extractedDrafDocuments,
      skillsData: skillsData,
      type: 'draft',
    }
    draftSave({
      form_type: 'candidate_evaluation',
      form_data: payload,
      upload_documents: {
        documents_to_create: documents?.documents_to_create ?? [],
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: draftPreparation.updateMetaData,
        deleteDraftDocuments: draftPreparation?.documentsToDelete ?? [],
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }

  const getFormattedValue = (
    field: string,
    value: SupportedFieldValue
  ): string | string[] => {
    if (field === FORM_FIELD_NAMES.INTERVIEW_DATE && dayjs.isDayjs(value)) {
      return value.isValid() ? value.utc().format(ISO_FORMAT) : ''
    }
    return value as string | string[]
  }

  const handleValidation = (
    field: string,
    value: SupportedFieldValue,
    updatedValue: string | string[]
  ) => {

    if (field === FORM_FIELD_NAMES.ACTUAL_EDUCATION) {
      const trimmed = (updatedValue as string).trim()
      const error = numberValidation.test(trimmed)
        ? VALIDATION_MESSAGES.EDUCATIONAL_QUALIFICATION_INVALID
        : ''
      setErrors((prev) => ({ ...prev, [field]: error }))
      return
    }

    if (field === FORM_FIELD_NAMES.INTERVIEW_DATE && dayjs.isDayjs(value)) {
      if (value.isValid()) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
      return
    }

    const isValid =
      typeof updatedValue === 'string'
        ? updatedValue.trim()
        : updatedValue.length > NUMBERMAP.ZERO

    if (isValid) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const updateRoleDetails = (requisitionId: string | string[]) => {
    const selected = recruitmentOptions.find((opt) => opt.id == requisitionId)
    setFormData((prev) => ({
      ...prev,
      role: selected?.role_name,
      educationJd: selected?.education_jd,
      experienceJd: selected?.experience_jd,

    }))
    setSelectedRoleId(selected?.role_id ?? null)

  }

  const handleSkillLevelChange = (skillId: string, value: string) => {
    if (!hasEditPermission) return;
    setSkillsData((prev) => {
      const updated = prev.map((skill) =>
        skill.id === skillId ? { ...skill, levelPossessed: value } : skill
      )
      handleDraftSave(formData, updated, finalFileData)
      return updated
    })
    // Clear skills error if all skills have a levelPossessed value
    const hasEmptySkills = skillsData.some((skill) => !skill.levelPossessed)
    if (!hasEmptySkills && value) {
      setErrors((prev) => ({ ...prev, skills: '' }))
    }
  }

  const renderActions = (params: any) => {
    return (
      <Box sx={Input_Field}>
        <InputField
          label=""
          hasEditable={!hasEditPermission}
          isDropdown
          placeholder="Select Skill Level"
          onChange={(value: string) =>
            handleSkillLevelChange(params.row.id, value)
          }
          value={params.row.levelPossessed}
          options={skillLevelsResponse}
          keyField={SKILL_LEVEL_ID}
          valueField={SKILL_LEVEL}
          disabled={isSkillLevelsLoading}
          dataSourceName={SKILL_SET_DATA_SOURCE_NAME}
          dataFieldName={SKILL_SET_DATA_FIELD_NAME}
          data-is-grid="true"
          dataIsAutocomplete={params.row.levelPossessed}
        />
      </Box>
    )
  }

  const columns = [
    { field: ID, headerName: HEADER_ID, flex: NUMBERMAP.ONE },
    { field: SKILL_NAME, headerName: HEADER_SKILL_NAME, flex: NUMBERMAP.ONE },
    {
      field: LEVEL_REQUIRED,
      headerName: HEADER_LEVEL_POSSESSED,
      flex: NUMBERMAP.ONE,
    },
    {
      field: ACTIONS,
      headerName: HEADER_ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: renderActions,
    },
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const requiredFields: (keyof FormData)[] = [
      RESOURCE_REQUISITION_ID,
      FIRST_NAME,
      LAST_NAME,
      INTERVIEW_DATE,
      ACTUAL_EDUCATION,
      ACTUAL_EXPERIENCE,
      INTERVIEWED_BY,
      STATUS,
    ]

    // Check each required field and assign static error message
    requiredFields.forEach((field) => {
      const value = formData[field]
      // Handle different types: string, array, or null/undefined
      if (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === NUMBERMAP.ZERO)
      ) {
        newErrors[field] =
          VALIDATION_MESSAGES[
          field.toUpperCase() as keyof typeof VALIDATION_MESSAGES
          ]
      }
    })

    // Validate skills data
    const hasEmptySkills = skillsData.some(
      (skill) => !skill.levelPossessed || skill.levelPossessed === ''
    )
    if (hasEmptySkills) {
      newErrors.skills = VALIDATION_MESSAGES.SKILLS
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const pageRoute = () => {
    router.push(CANDIDATE_EVALUATION_CONSTANTS.PATH)
  }

  const createTables = [SUPPORTINGFILE_CONSTANTS]

  const updateTables = [SUPPORTINGFILE_CONSTANTS]
  const getInterviewerPayload = () => {
    if (!isAddMode) {
      // Update mode — return only eval ID and status
      return [
        {
          fk_eqms_hr_candidate_evalution_id: candidateId,
          status: NUMBERMAP.ONE,
        },
      ]
    }

    // Add mode — map each user ID
    return formData?.interviewedBy.map((userId) => ({
      fk_eqms_organization_employee_id: parseInt(userId) || NUMBERMAP.ZERO,
      status: NUMBERMAP.ONE,
    }))
  }

  const getSkillSetPayload = () => {
    return skillsData.map((skill) => ({
      ...(isAddMode ? {} : { fk_eqms_hr_candidate_evalution_id: candidateId }),
      fk_eqms_hr_skill_level_lk_id: parseInt(skill.levelPossessed),
      fk_eqms_hr_role_definition_skill_level_mapper_id: (isAddMode ? skill?.skill_level_mapper_id : skill?.fk_eqms_hr_role_definition_skill_level_mapper_id),
      status: NUMBERMAP.ONE,
    }))
  }
  const hasFilesdata = () => {
    const hasDraftData = draftData?.data?.draftDelete?.['eqms_hr_candidate_evalution_supporting_files']?.length > 0
    const hasDraftUpdateMetaData = draftData?.data?.draftUpdateMetaData &&
      typeof draftData?.data?.draftUpdateMetaData === 'object'
    const hasDataInFinalFileData = finalFileData?.documents_to_create?.length > 0 ||
      finalFileData?.documents_to_delete?.length > 0 ||
      finalFileData?.update_meta_data && Object.keys(finalFileData.update_meta_data).length > 0
    return { hasDataInFinalFileData, hasDraftData, hasDraftUpdateMetaData }
  }
  function getFilteredExistingUpdate(preservedDocumentIds: []) {
    if (!finalFileData.update_meta_data) return null;

    const meta = finalFileData.update_meta_data;

    // Nested
    if (meta.eqms_hr_candidate_evalution_supporting_files) {
      return filterUpdateMetaData(
        preservedDocumentIds,
        meta.eqms_hr_candidate_evalution_supporting_files
      );
    }

    // Flat
    return filterUpdateMetaData(preservedDocumentIds, meta);
  }

  const getMetaData = () => {
    let fileMetadata: any = {}

    if (!Object.keys(finalFileData).length) return fileMetadata

    const deleteTableColumnMap = {
      eqms_hr_candidate_evalution_supporting_files: 'fk_eqms_file_id',
    }

    const { hasDataInFinalFileData, hasDraftData, hasDraftUpdateMetaData } = hasFilesdata()

    if (!(hasDataInFinalFileData || hasDraftData || hasDraftUpdateMetaData)) return fileMetadata

    // Get all file_ids from draftData.data.documents (preserved documents)
    const preservedDocumentIds = extractPreservedDocumentIds(draftData)

    // Prepare finalFileData modifications
    const modifyFinalFileData = { ...finalFileData }
    const supportDingDocs = draftData?.data?.draftDelete?.['eqms_hr_candidate_evalution_supporting_files'] ?? []

    if (hasDraftData) {
      // Filter out preserved documents from deletions
      const filteredSupportDingDocs = filterDocumentsToDeleteArray(preservedDocumentIds, supportDingDocs)
      const filteredFinalFileDelete = filterDocumentsToDeleteArray(preservedDocumentIds, finalFileData.documents_to_delete ?? [])

      modifyFinalFileData.documents_to_delete = [
        ...filteredFinalFileDelete,
        ...filteredSupportDingDocs,
      ]?.map(Number)
    } else {
      // Filter out preserved documents even if no draft data
      modifyFinalFileData.documents_to_delete = filterDocumentsToDeleteArray(
        preservedDocumentIds,
        finalFileData.documents_to_delete ?? []
      ).map(Number)
    }
    // Filter update_meta_data - handle both flat and nested structures
    // Helper: filter existing update_meta_data (nested or flat)


    if (hasDraftUpdateMetaData) {
      const draftUpdateSection =
        draftData.data.draftUpdateMetaData?.eqms_hr_candidate_evalution_supporting_files;

      if (draftUpdateSection && Object.keys(draftUpdateSection).length > 0) {
        const filteredDraftUpdate = filterUpdateMetaData(
          preservedDocumentIds,
          draftUpdateSection
        );

        const filteredExistingUpdate = getFilteredExistingUpdate(preservedDocumentIds ?? []) ?? {};

        modifyFinalFileData.update_meta_data = {
          ...filteredExistingUpdate,
          ...filteredDraftUpdate,
        };
      } else {
        // No draft update section — just filter existing
        const existing = getFilteredExistingUpdate(preservedDocumentIds ?? []);
        if (existing) {
          modifyFinalFileData.update_meta_data = existing;
        }
      }
    } else {
      // No draft update metadata — just filter existing
      const existing = getFilteredExistingUpdate(preservedDocumentIds ?? []);
      if (existing) {
        modifyFinalFileData.update_meta_data = existing;
      }
    }

    const output = restructureData(
      modifyFinalFileData,
      createTables,
      updateTables,
      deleteTableColumnMap,
    )

    fileMetadata = {
      fileOperation: output ?? {},
      documents_to_create: finalFileData.documents_to_create,
    }

    return fileMetadata
  }

  const validateRoute = async () => {
    if (validateForm()) {
      // Clear draft save when submitting final form
      clearDraftSave();

      try {
        const isoInterviewDate = formData?.interviewDate
        if (!isoInterviewDate || !dayjs(isoInterviewDate).isValid()) {
          setErrors((prev) => ({
            ...prev,
            interviewDate: VALIDATION_MESSAGES.INTERVIEWDATE,
          }))
          return
        }
        let fileMetadata = getMetaData()


        // Prepare the base payload for eqms_hr_candidate_evalution
        const candidateEvaluationPayload = {
          //candidate_name: formData?.name,
          fk_eqms_hr_resource_requisition_id:
            parseInt(formData?.resourceRequisitionId) || NUMBERMAP.ZERO,
          date_of_interview: isoInterviewDate,
          actual_educational_qualification: formData?.actualEducation,
          actual_experience:
            Number(formData?.actualExperience) || NUMBERMAP.ZERO,
          fk_eqms_hr_evalution_status_lk_id:
            parseInt(formData?.status) || NUMBERMAP.ZERO,
          comments: formData?.comments,
          status: NUMBERMAP.ONE, // Default status as per your dataframeworkOtherParamsBag
        }

        // Prepare the skill set payload
        const skillSetPayload = getSkillSetPayload()
        // Prepare the interviewer payload
        const interviewerPayload = getInterviewerPayload()
        // Combine all payloads
        const dataframeworkOtherParamsBag = {
          eqms_hr_candidate_evalution: [candidateEvaluationPayload],
          eqms_hr_candidate_evalution_skill_set: skillSetPayload,
          eqms_hr_candidate_interviewer: interviewerPayload,

        }

        // Dynamically set the operator type and keys based on mode
        const operatorType = isAddMode ? INSERT : UPDATE
        const keys = isAddMode
          ? {}
          : {
            eqms_hr_candidate_evalution: {
              id: candidateId,
            },
            eqms_hr_employee_training_needs_mapper: {
              fk_eqms_hr_employee_training_needs_id: candidateId,
            },
            eqms_hr_candidate_interviewer: {
              fk_eqms_hr_candidate_evalution_id: candidateId,
            },
            eqms_hr_candidate_evalution_skill_set: {
              fk_eqms_hr_candidate_evalution_id: candidateId,
            },
          }
        const filteredDocuments = draftData?.data?.documents.filter((doc: any) => !finalFileData?.documents_to_delete?.includes(Number(doc.file_id)))

        const response = await magicFormSave({
          currentFormRef: formRef,
          dataframeworkOperatorType: operatorType,
          dataframeworkOtherParamsBag,
          keys: keys,
          headers: {},
          diagnosticFlag:
            magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
          fileMetadata: fileMetadata ?? {},
          draftDocuments: filteredDocuments ?? [],
        })
        handleResponse(response)
      } catch (error) {
        showActionAlert('customAlert', {
          title: 'Error',
          text: String(error),
          icon: 'error',
          cancelButton: false,
          confirmButton: false,
        })
        setErrors((prev) => ({ ...prev, form: UNEXPECTED_ERROR }))
      }
    }
  }

  const resetForm = () => {
    setSelectedRoleId(null)
    refetchCandidateEvaluation();
    setFormData(DEFAULT_FORM_DATA);
    setSkillsData([]);
    setFinalFileData(FINALFILEINITIALDATA);
  }
  const handleResponse = async (response: any) => {
    const isValidResponse = (resp: any) => 'response' in resp && resp.response;
    const isSuccessCode = (resp: any) => resp.response.code === HTTP_STATUS.OK;

    if (!isValidResponse(response)) {
      setErrors((prev) => ({ ...prev, form: FAILED_TO_SAVE_DATA }));
      return;
    }
    fetchDraft()
    refetchCandidateEvaluation()
    const serverResponse = response.response;

    if (!isSuccessCode(response)) {
      showActionAlert(FAILED);
      return;
    }

    const candidateEvaluationId =
      serverResponse.data?.[ARRAY_INDEX.FIRST]?.eqms_hr_candidate_evalution?.[ARRAY_INDEX.FIRST]?.id;

    const departmentId = competencySkillResponse?.data?.[NUMBERMAP.ZERO]?.department_id;

    const isReadyForSubmission =
      candidateEvaluationId && formData.resourceRequisitionId && departmentId;

    if (!isReadyForSubmission) {
      resetForm()
      showActionAlert(SUCCESS_ALERT);
      return;
    }

    submitWorkflow(
      {
        context_type: CANDIDATE_EVALUATION_CONSTANTS.CONTEXT_TYPE,
        department: [departmentId],
        context_id: candidateEvaluationId,
      },
      {
        onSuccess: () => {
          resetForm()
          router.push(CANDIDATE_EVALUATION_CONSTANTS.PATH);
        },
      }
    );
  };

  const handleSave = () => {
    if (!hasEditPermission) return;
    validateRoute()
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    pageRoute()
  }

  const handleFileUpload = (newFile: File) => {
    if (!hasEditPermission) return;
    const documents = formData?.documents ?? []
    setFormData((prev) => ({
      ...prev,
      documents: [...documents, newFile],
    }))
  }

  const handleFileEdit = useCallback((documents) => {
    if (!hasEditPermission) return;
    setFormData((prev) => {
      const updatedFiles = prev.documents.map((file) => {
        const currentId =
          typeof file === 'object'
            ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
            : undefined
        const updatedId = documents.document_id ?? documents.id

        return currentId === updatedId ? { ...file, ...documents } : file
      })

      return {
        ...prev,
        documents: updatedFiles,
      }
    })
  }, [])

  const parseDate = (date?: string | null) =>
    date && dayjs(date).isValid() ? dayjs(date) : null

  const isLevelPossessedValid = (
    skills: {
      levelRequired: string | number
      levelPossessed: string | number
    }[]
  ) => {
    return skills.some(
      (skill) => Number(skill.levelPossessed) < Number(skill.levelRequired)
    )
  }
  const handleJustificationChange = (value: string) => {
    if (interviewStatusOptions?.data) {
      const jdExperience = Number(formData?.experienceJd)
      const actualExperience = Number(formData?.actualExperience)
      const isExperienceLessThanJD = actualExperience < jdExperience
      const isSkillLevelsValid = isLevelPossessedValid(skillsData)
      // Check if either experience is less than JD OR skill levels are not valid
      if (isExperienceLessThanJD || isSkillLevelsValid) {
        // If either condition is true, check if status is 'Selected'
        const isSelectedStatus = interviewStatusOptions.data.some(
          (status) =>
            status.status_id == value && status.evaluation_status === 'Selected'
        )
        // If status is 'Selected', return false; otherwise return true
        return !isSelectedStatus
      }
      // If both conditions are false (experience is sufficient AND skill levels are valid), return true
      return true
    } else {
      return true
    }
  }
  return (
    <FormContainer id={CONTAINER_ID} ref={formRef}>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <GlobalLoader loading={isAnyLoading(isCandidateEvaluationLoading, isFetchingDraft)} />
        <Label title={isAddMode ? CREATE_PAGE_TITLE : EDIT_PAGE_TITLE} />
        <FormContent>
          <Grid2 >
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  disabled={!isAddMode}
                  label={FORM_LABELS.RESOURCE_REQUISITION_ID}
                  placeholder={FORM_PLACEHOLDERS.RESOURCE_REQUISITION_ID}
                  isDropdown
                  value={formData?.resourceRequisitionId}
                  onChange={(value) => {
                    handleInputChange(
                      FORM_FIELD_NAMES.RESOURCE_REQUISITION_ID,
                      value
                    )
                  }}
                  error={errors.resourceRequisitionId}
                  options={recruitmentOptions}
                  keyField={ID}
                  valueField={ID}
                  dataSourceName={DATA_SOURCE_NAME}
                  dataFieldName={RECRUITMENT_DETAILS}
                  dataIsAutocomplete={formData?.resourceRequisitionId}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  label={FORM_LABELS.FIRST_NAME}
                  placeholder={FORM_PLACEHOLDERS.FIRST_NAME}
                  value={formData?.firstName ?? ''}
                  onChange={(value) =>
                    handleInputChange(FORM_FIELD_NAMES.FIRST_NAME, value)
                  }
                  error={errors.firstName}
                  dataSourceName={DATA_SOURCE_NAME}
                  dataFieldName={CANDIDATE_FITST_NAME}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  label={FORM_LABELS.LAST_NAME}
                  placeholder={FORM_PLACEHOLDERS.LAST_NAME}
                  value={formData?.lastName ?? ''}
                  onChange={(value) =>
                    handleInputChange(FORM_FIELD_NAMES.LAST_NAME, value)
                  }
                  error={errors.lastName}
                  dataSourceName={DATA_SOURCE_NAME}
                  dataFieldName={CANDIDATE_LAST_NAME}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={NUMBERMAP.SIX}>
                <EmployeeInfoContainer>
                  <InfoLabel>Role</InfoLabel>
                  <InfoValue>{formatValue(formData?.role)}</InfoValue>
                </EmployeeInfoContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <DatePicker
                  error={errors.interviewDate ?? ''}
                  value={parseDate(formData?.interviewDate)}
                  onChange={(value) =>
                    handleInputChange(FORM_FIELD_NAMES.INTERVIEW_DATE, value)
                  }
                  label={FORM_LABELS.INTERVIEW_DATE}
                />
                <input
                  type={TEXT}
                  style={NONE}
                  readOnly
                  data-sourcename={DATA_SOURCE_NAME}
                  data-fieldname={DATE_OF_INTERVIEW}
                  value={convertMuiDayjsToUTC(formData?.interviewDate) ?? ''}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={NUMBERMAP.SIX}>
                <EmployeeInfoContainer>
                  <InfoLabel>Educational Qualification - As per JD</InfoLabel>
                  <InfoValue>{formatValue(defaultJdData?.educationJd)}</InfoValue>
                </EmployeeInfoContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  label={FORM_LABELS.ACTUAL}
                  placeholder={FORM_PLACEHOLDERS.ACTUAL}
                  value={formData?.actualEducation ?? ''}
                  onChange={(value) =>
                    handleInputChange(FORM_FIELD_NAMES.ACTUAL_EDUCATION, value)
                  }
                  error={errors.actualEducation ?? ''}
                  dataSourceName={DATA_SOURCE_NAME}
                  dataFieldName={ACTUAL_EDU}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={NUMBERMAP.SIX}>
                <EmployeeInfoContainer>
                  <InfoLabel>Experience - As per JD</InfoLabel>
                  <InfoValue>{defaultJdData?.experienceJd ?? '-'}</InfoValue>
                </EmployeeInfoContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  label={FORM_LABELS.ACTUAL}
                  placeholder={FORM_PLACEHOLDERS.ACTUAL}
                  value={formData?.actualExperience ?? ''}
                  onChange={(value) => {
                    if (numberValidation.test(value) || value == '') {
                      handleInputChange(FORM_FIELD_NAMES.ACTUAL_EXPERIENCE, value)
                    }
                  }}
                  error={errors.actualExperience}
                  dataSourceName={DATA_SOURCE_NAME}
                  dataFieldName={ACTUAL_EXP}
                />
              </Grid2>
            </Grid2>

            <SkillSetContainer data-is-grid="true">
              <DataGridTable
                title="Skill Set"
                rows={skillsData.map((skill) => ({
                  ...skill,
                  fk_eqms_hr_role_definition_skill_level_mapper_id:
                    skill?.skill_level_mapper_id ?? skill?.fk_eqms_hr_role_definition_skill_level_mapper_id,
                }))}
                columns={columns}
                idField={ID}
                hideFooter={true}
              />
              {errors.skills && <Box sx={STYLE3}>{errors.skills}</Box>}
            </SkillSetContainer>

            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE7}>
              <Grid2 size={NUMBERMAP.SIX}>
                <MultiSelect
                  label={FORM_LABELS.INTERVIEWED_BY}
                  placeholder={FORM_PLACEHOLDERS.INTERVIEWED_BY}
                  value={formData?.interviewedBy ?? []}
                  onChange={(value) =>
                    handleInputChange(FORM_FIELD_NAMES.INTERVIEWED_BY, value)
                  }
                  error={errors.interviewedBy ?? ''}
                  options={usersResponse?.data ?? []}
                  idField={ID}
                  valueField={NAME}
                  disabled={isUsersLoading}
                  dataSourceName={USER_ID_SOURCE_NAME}
                  dataFieldName={USER_ID_FIELD_NAME}
                  dataIsAutocomplete={formData?.interviewedBy}
                  dataIsMultiSelect={true}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  label={FORM_LABELS.STATUS}
                  placeholder={FORM_PLACEHOLDERS.STATUS}
                  isDropdown
                  value={formData?.status ?? ''}
                  onChange={(value) =>
                    handleInputChange(FORM_FIELD_NAMES.STATUS, value)
                  }
                  error={errors.status}
                  options={interviewStatusOptions?.data ?? []}
                  disabled={isStatusLoading}
                  hasEditable={!hasEditPermission}
                  keyField={STATUS_ID}
                  valueField={STATUS_NAME}
                  dataSourceName={DATA_SOURCE_NAME}
                  dataFieldName={STATUS_FIELD_NAME}
                  dataIsAutocomplete={formData?.status}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={NUMBERMAP.SIX}>
                <Description
                  disabled={handleJustificationChange(formData?.status)}
                  label={FORM_LABELS.JUSTIFICATION}
                  placeholder={FORM_PLACEHOLDERS.JUSTIFICATION}
                  value={formData?.justification ?? ''}
                  onChange={(value) =>
                    handleInputChange(FORM_FIELD_NAMES.JUSTIFICATION, value)
                  }
                  dataSourceName={DATA_SOURCE_NAME}
                  dataFieldName={JUSTIFICATION}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <Description
                  label={FORM_LABELS.COMMENTS}
                  placeholder={FORM_PLACEHOLDERS.COMMENTS}
                  value={formData?.comments ?? ''}
                  onChange={(value) =>
                    handleInputChange(FORM_FIELD_NAMES.COMMENTS, value)
                  }
                  dataSourceName={DATA_SOURCE_NAME}
                  dataFieldName={COMMENTS}
                />
              </Grid2>
            </Grid2>
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <FileUploadManager
                hasEditable={!hasEditPermission}
                initialFiles={formData?.documents ?? []}
                onSubmit={(data) => {
                  if (!hasEditPermission) return;
                  setFinalFileData((prev) => {
                    const merged = mergeFinalFileData(prev, data)
                    handleDraftSave(formData, skillsData, merged)
                    return merged
                  })
                }}
                onFileEdit={handleFileEdit}
                onFileUpload={handleFileUpload}
                subHeader="Upload"
              />
            </Grid2>
          </Grid2>
          {!isAddMode ? (
            <HRReviewerModalManager
              taskInfo={candidateEvaluationResponse?.meta_info?.task_info}
              isLoading={isCandidateEvaluationLoading}
              permissions={candidateEvaluationResponse?.meta_info?.action_control?.permissions ?? []}
              menuId={candidateEvaluationResponse?.meta_info?.action_control?.menuId}
              menuName={candidateEvaluationResponse?.meta_info?.action_control?.formName}
              onPermissionChange={setHasEditPermission}
              customHandlers={{
                handleCancel,
                handleSave,
                isDisabled: false,
              }}
              contextType={CANDIDATE_EVALUATION_CONSTANTS.CONTEXT_TYPE}
              contextId={Number(candidateId)}
              departmentId={competencySkillResponse?.data?.[NUMBERMAP.ZERO]?.department_id}
            />
          ) : (
            <ButtonGroup
              buttons={[
                { label: BUTTON_LABELS.CANCEL, onClick: handleCancel },
                { label: BUTTON_LABELS.SAVE, onClick: handleSave },
              ]}
            />
          )}
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default CandidateEvaluationForm