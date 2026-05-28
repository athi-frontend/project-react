'use client'
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Grid2 } from '@mui/material'
import {
  ButtonGroup,
  InputField,
  Description,
  showActionAlert,
} from '@/components/ui'
import {
  mergeFinalFileData,
  numberValidation,
  FinalFileData,
  formatDateForAPI,
  removelocalFileData,
} from '@/lib/utils/common'
import {
  FormContainer,
  FormContent,
  FormTitle,
  SectionTitle,
  FormSection,
  FormRow,
  LabelColumn,
  LabelTitle,
  LabelValue,
  InputColumn,
  TextareaContainer,
  InlineStyles,
  ButtonContainer,
  HeaderContainer,
  Title,
  ButtonsContainer,
  AddButton,
} from '@/styles/modules/hr/addEmployee'
import SkillSetTable from '@/components/modules/hr/add-employee/SkillSetTable'
import TrainingNeedsTable from '@/components/modules/hr/add-employee/TrainingNeedsTable'
import TrainingEffectivenessTable from '@/components/modules/hr/add-employee/TrainingEffectivenessTable'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import TrainingNeeds from '@/components/modules/hr/add-employee/TrainingNeedsModal'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FINALFILEINITIALDATA, NUMBERMAP, STATUS } from '@/constants/common'
import {
  UploadedFileData,
  DocumentStructure,
  AddEmployee,
  TrainingNeed,
} from '@/types/modules/hr/employeeList'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import {
  INITIAL_EMPLOYEE,
  INITIAL_ERRORS,
  FORM_ERRORS,
  FIELD_ATTRIBUTES,
  BUTTON_LABELS,
  EMPLOYEE_UI_CONSTANTS,
  FileSection,
  CREATE_MODE,
  VALIDATION_MESSAGES,
  ALERT_MESSAGES,
  FIELD_NAMES,
  TRAINING_NEED_DEFAULTS,
  API_FORM_FIELDS,
  FILE_SECTION_NAMES,
  DATE_FORMATS,
  NAVIGATION_PATHS,
  MODAL_BUTTON_CONFIG,
  TRANSFORMED_FIELDS,
  RESET_FORM_VALUES,
  EMPLOYEE_CONSTANTS,
  ERROR_DUBLICATE_ENTRY,
} from '@/constants/modules/hr/employeeList'
import { BUTTON_VARIANTS } from '@/constants/modules/hr/resourceRequisition'
import { useDepartment, useDesignation, useRoles } from '@/hooks/modules/user/useUserOnboard'
import {
  useCompetencySkillBYId,
  useEmploymentTypes,
  useFetchEmployeeById,
  useSiteDropdown,
  useSource,
  useUpsertEmployee,
  useSkillDropDown,
  useListWorkflowEmployes,
} from '@/hooks/modules/hr/useEmployeeList'
import { useParams, useRouter } from 'next/navigation'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import dayjs from 'dayjs'
import {
  useListWorkflowRecruitments,
  useRecruitmentById,
} from '@/hooks/modules/hr/useResourceRequistion'
import { useCandidateEvaluationById, useCandidateEvaluationDataByInterview } from '@/hooks/modules/hr/useCandidateEvaluation'
import AdministrativeReportsTable from '@/components/modules/hr/add-employee/AdministrativeReports'
import AdministrativeReportsModal from '@/components/modules/hr/add-employee/AdministrativeReportsModal'
import { HRReviewerModalManager } from '@/components/modules/hr/reviewer-modal'
import { fullWidth } from '@/styles/components/ui/layout'
import { useSaveWorkflowAction } from '@/hooks/modules/hr/useCommonReviewModal'
import { useQueryClient } from '@tanstack/react-query'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { groupByForHR } from '@/lib/utils/modules/hr/common'
import { 
  extractPreservedDocumentIds, 
  filterDocumentsToDelete,
  filterNestedUpdateMetaData
} from '@/lib/utils/modules/hr/preservedDocumentsFilter'
import { prepareDraftDocuments } from '@/lib/utils/modules/hr/draftDocuments'
import { isAnyLoading } from '@/lib/modules/hr/candidateEvaluation'

/**
 * Classification: confidential
 */
const AddEmployeeForm: React.FC = () => {
  const formRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const { data: skillOptionsList } = useSkillDropDown()
  const [skillOptions, setSkillOptions] = useState([])
  const [skillSets, setSkillSets] = useState<any[]>([])
  const [trainingNeedsList, setTrainingNeedsList] = useState<TrainingNeed[]>([])
  const [formData, setFormData] = useState<AddEmployee>(INITIAL_EMPLOYEE)
  const [trainingEvaluations, setTrainingEvaluations] = useState<any[]>([])
  const [candidateId, setCandidateId] = useState(NUMBERMAP.ZERO)
  const [roleId, setroleId] = useState(NUMBERMAP.ZERO)
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])
  const { data: roleOptions } = useRoles()
  const { data: departmentOptions } = useDepartment()
  const { data: employmentTypeOptions } = useEmploymentTypes()
  const params = useParams()
  const employeeId = params.id
  const router = useRouter()
  const [recruitmentId, setRecruitmentId] = useState<string | null>(null)
  const [editingAdministrativeReport, setEditingAdministrativeReport] =
    useState<any>(null)
  const { data: allEmployees, refetch: refetchAllEmployees } = useListWorkflowEmployes(NUMBERMAP.ONE, 'Approved')
  const { data: fetchJdDetails, refetch: fetchJD } = useCompetencySkillBYId(roleId)
  const { data: employeeData, refetch: employeeFetchById, isLoading: isLoadingEmployee ,isFetching:isFetchingEmployee} =
    useFetchEmployeeById(Number(employeeId) ? Number(employeeId) : NUMBERMAP.ZERO)
  const { data: candidateEvaluationResponse, refetch: fetchRecritmentByid } =
    useCandidateEvaluationDataByInterview(recruitmentId ?? '', (employeeId !== 'create'))
  const { data: cadidatebyskillData, refetch: candidateRefetch } = useCandidateEvaluationById(candidateId)
  const { data: recruitmentByIdData, refetch: recruitmentById } =
    useRecruitmentById(recruitmentId ?? '')
  const { data: recruitmentData, refetch } = useListWorkflowRecruitments(NUMBERMAP.ONE, 'Approved')
  const { data: fetchSites } = useSiteDropdown()
  const { data: sourceOptions } = useSource()
  const { mutate: upsertEmployee, isPending: isUpserting } = useUpsertEmployee()
    const { data: designationData } = useDesignation()
  
  const [adminReportsModal, setAdminReportsModal] = useState(false)
  const queryClient = useQueryClient()

  // Error state
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [hasEditPermission, setHasEditPermission] = useState(true);
  const { mutate: submitWorkflow } = useSaveWorkflowAction(employeeData?.action_control?.formName)

  // File state for each section with proper initial data
  const [eduQualFiles, setEduQualFiles] = useState<DocumentStructure[]>([])
  const [finalEquality, setFinalEquality] =
    useState<FinalFileData>(FINALFILEINITIALDATA)

  const [experienceFiles, setExperienceFiles] = useState<DocumentStructure[]>(
    []
  )
  const [finalExperience, setFinalExperience] =
    useState<FinalFileData>(FINALFILEINITIALDATA)

  const [expertiseFiles, setExpertiseFiles] = useState<DocumentStructure[]>([])
  const [finalExpertiesFile, setFinalExpertiesFile] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  const [skillSetFiles, setSkillSetFiles] = useState<DocumentStructure[]>([])
  const [finalSkillSetFiles, setFinalSkillSetFiles] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  const [trainingFiles, setTrainingFiles] = useState<DocumentStructure[]>([])
  const [finalTrainingFiles, setFinalTrainingFiles] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  // Simplified training needs files state - using local array instead of keyed object
  const [trainingNeedsFiles, setTrainingNeedsFiles] = useState<DocumentStructure[]>([])
  const [trainingNeedsFinalData, setTrainingNeedsFinalData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)

  const isAddMode = employeeId === CREATE_MODE
  const employeeIdForDraft = isAddMode ? null : Number(employeeId)

  const { draftSave, clearDraftSave,isFetchingDraft, isDraftSaving, draftData, fetchDraft ,checkUnsavedDraftBeforeLeave} = useDraftSave({
    context_type: 'employee_list',
    context_instance_id: employeeIdForDraft,
    enableFetch: false
  })
  const [trainingModal, setTrainingModal] = useState(false)
  const [additionalModal, setAdditionalModal] = useState(false)
  const [editingTrainingNeed, setEditingTrainingNeed] = useState(null)
  // Define options for dropdowns

  const handleDraftSave = (formData: AddEmployee, skillSets: any[], administrativeReports: any[], finalDocuments: { educationalQualification: FinalFileData, experience: FinalFileData, areaOfExpertise: FinalFileData, skillSet: FinalFileData, trainingEffectiveness: FinalFileData, trainingNeeds: FinalFileData }) => {
    // Use the comprehensive utility function to prepare draft documents
    const draftPreparation = prepareDraftDocuments(
      draftDocuments,
      draftDelete,
      formData,
      finalDocuments || {
        educationalQualification: FINALFILEINITIALDATA,
        experience: FINALFILEINITIALDATA,
        areaOfExpertise: FINALFILEINITIALDATA,
        skillSet: FINALFILEINITIALDATA,
        trainingEffectiveness: FINALFILEINITIALDATA,
        trainingNeeds: FINALFILEINITIALDATA,
      },
      draftData
    )
    if (draftPreparation.draftDocuments) {
      setDraftDocuments(draftPreparation.draftDocuments)
    }
    if (draftPreparation.draftDelete) {
      setDraftDelete(draftPreparation.draftDelete)
    }
    const fieldsToRemove = ['qualification_files', 'experience_files', 'expertise_files', 'skill_supporting_document', 'employee_supporting_files']
    const Obj = { ...formData }
    const cleaned = Object.fromEntries(
      Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key))
    );
    const payload = {
      id: employeeIdForDraft ?? new Date().getTime(),
      ...cleaned,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      skillSets: skillSets,
      administrativeReports: administrativeReports,
      type: 'draft',
    }

    // Collect all documents_to_create from all sections
    const allDocumentsToCreate = [
      ...(finalDocuments?.educationalQualification?.documents_to_create ?? []),
      ...(finalDocuments?.experience?.documents_to_create ?? []),
      ...(finalDocuments?.areaOfExpertise?.documents_to_create ?? []),
      ...(finalDocuments?.skillSet?.documents_to_create ?? []),
      ...(finalDocuments?.trainingEffectiveness?.documents_to_create ?? []),
    ]
    draftSave({
      form_type: 'employee',
      form_data: payload,
      upload_documents: {
        documents_to_create: allDocumentsToCreate,
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: draftPreparation.updateMetaData,
        documents_to_delete: [],
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }

  useEffect(() => {
    if (recruitmentByIdData?.data) {
      if (recruitmentByIdData.data.length > NUMBERMAP.ZERO) {
        const data = recruitmentByIdData.data[NUMBERMAP.ZERO]
        if (employeeId == CREATE_MODE) {
          setFormData((prev) => ({
            ...prev,
            role: data.role_id ?? null,
            trainingNeeds: [],
          }))
          setroleId(data.role_id)
        }
      }
    }
  }, [recruitmentByIdData])
  useEffect(() => {
    if (skillOptionsList?.data && skillOptionsList.data?.length > NUMBERMAP.ZERO) {
      setSkillOptions(skillOptionsList.data)
    }
  }, [skillOptionsList])
  useEffect(() => {
    resetFormToInitial()
    if (params.id != CREATE_MODE) { 
      employeeFetchById()
      queryClient.invalidateQueries(['employee_by_id', params.id])
    }
    refetch()
    fetchDraft()
    refetchAllEmployees()
  }, [params.id])

  // Manual reset function that can be called when needed
  const resetFormToInitial = () => {
    setFormData(INITIAL_EMPLOYEE)
    setRecruitmentId(null)
    setEduQualFiles([])
    setExperienceFiles([])
    setExpertiseFiles([])
    setSkillSetFiles([])
    setTrainingFiles([])
    setTrainingNeedsFiles([])
    setSkillSets([])
    setTrainingNeedsList([])
    setTrainingEvaluations([])
    setErrors(INITIAL_ERRORS)
  }
  const handleEditAdministrativeReport = (report: any) => {
    setEditingAdministrativeReport({
      ...report,
      id: report.id,
    })
    setAdminReportsModal(true)
  }

  const handleDeleteAdministrativeReport = async (report: any) => {
    if (!hasEditPermission) return;
    try {
      const result = await showActionAlert('delete')
      if (result.isConfirmed) {
        setFormData((prev) => ({
          ...prev,
          administrativeReports: prev.administrativeReports.filter(
            (_: any, index: number) => index !== report.id
          ),
        }))
        showActionAlert(ALERT_MESSAGES.SUCCESS)
      }
    } catch (error) {
      console.error(error)
      showActionAlert(ALERT_MESSAGES.FAILED)
    }
  }

  const handleAddAdministrativeReport = (
    data: { site: string; administrativeReportsTo: string }
  ) => {
    if (editingAdministrativeReport) {
      // Check for duplicates when editing (excluding the current item)
      const isDuplicateEdit = (formData.administrativeReports ?? []).some(
        (item: { site: string; administrativeReportsTo: string }, index: number) =>
          index !== editingAdministrativeReport.id &&
          item.site === data.site &&
          item.administrativeReportsTo === data.administrativeReportsTo
      )

      if (isDuplicateEdit) {
        showActionAlert(ALERT_MESSAGES.CUSTOM_ALERT, {
          title: ALERT_MESSAGES.DUPLICATE_ENTRY_TITLE,
          text: ALERT_MESSAGES.DUPLICATE_ENTRY_TEXT,
          icon: ALERT_MESSAGES.ICON_ERROR,
          cancelButton: MODAL_BUTTON_CONFIG.CANCEL_BUTTON,
          confirmButton: MODAL_BUTTON_CONFIG.CONFIRM_BUTTON,
        });
        return
      }

      setFormData((prev) => {
        const updated = {
          ...prev,
          administrativeReports: (prev.administrativeReports ?? []).map(
            (item: { site: string; administrativeReportsTo: string }, index: number) =>
              index === editingAdministrativeReport.id
                ? { ...item, ...data }
                : item
          ),
        };
          handleDraftSave(updated, skillSets, updated.administrativeReports, { 'educationalQualification': finalEquality, 'experience': finalExperience, 'areaOfExpertise': finalExpertiesFile, 'skillSet': finalSkillSetFiles, 'trainingEffectiveness': finalTrainingFiles, 'trainingNeeds': FINALFILEINITIALDATA });
        return updated;
      })
      setEditingAdministrativeReport(null)
    } else {
      // Check for duplicates when adding new entry
      const isDuplicate = (formData.administrativeReports ?? []).some(
        (item: { site: string; administrativeReportsTo: string }) =>
          item.site === data.site &&
          item.administrativeReportsTo === data.administrativeReportsTo
      )

      if (isDuplicate) {
        showActionAlert(ALERT_MESSAGES.CUSTOM_ALERT, {
          title: ALERT_MESSAGES.DUPLICATE_ENTRY_TITLE,
          text: ALERT_MESSAGES.DUPLICATE_ENTRY_TEXT,
          icon: ALERT_MESSAGES.ICON_ERROR,
          cancelButton: MODAL_BUTTON_CONFIG.CANCEL_BUTTON,
          confirmButton: MODAL_BUTTON_CONFIG.CONFIRM_BUTTON,
        });
        return
      }

      setFormData((prev) => {
        const updated = {
          ...prev,
          administrativeReports: [...(prev.administrativeReports ?? []), data],
        };

          handleDraftSave(updated, skillSets, updated.administrativeReports, { 'educationalQualification': finalEquality, 'experience': finalExperience, 'areaOfExpertise': finalExpertiesFile, 'skillSet': finalSkillSetFiles, 'trainingEffectiveness': finalTrainingFiles, 'trainingNeeds': FINALFILEINITIALDATA});
        
        return updated;
      })
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      administrativeReports: '',
    }))
    setAdminReportsModal(false)
  }
  useEffect(() => {
    if (cadidatebyskillData?.data && cadidatebyskillData?.data?.length > NUMBERMAP.ZERO) {
      const skilsListed = cadidatebyskillData.data?.[NUMBERMAP.ZERO]['candidate_evaluation_skill_set']
      const candidateDatas = cadidatebyskillData.data?.[NUMBERMAP.ZERO]
      setFormData((prev) => ({ ...prev, educationalQualification: candidateDatas?.actual_educational_qualification, experience: candidateDatas?.actual_experience }))
      const combinedSkills = [
        ...skilsListed.map((skill) => ({
          id: skill.id,
          skill_level_mapper_id: skill.id,
          skill_id: skill?.skill_id,
          skill_level_id: skill?.skill_level_id,
          skill_name: skill?.skill_name,
          skill_level: skill?.skill_level,
          level_possess_id: skill?.skill_possess_level_id,
          level_possess: skill?.skill_possess_level,
          hr_role_definition_skill_level_mapper_id:
            skill?.fk_eqms_hr_role_definition_skill_level_mapper_id,
        })),
      ].reduce((unique, skill) => {
        const isDuplicate = unique.some(
          (existing) =>
            existing.skill_id === skill.skill_id ||
            existing.skill_name === skill.skill_name
        )
        return isDuplicate ? unique : [...unique, skill]
      }, [])

      updateTrainingNeedsList(skilsListed, true)
      setSkillSets(combinedSkills)

    }
  }, [cadidatebyskillData])
  useEffect(() => {
    if (candidateId && params.id != 'create') {
      candidateRefetch()
      queryClient.invalidateQueries(['candidate_evaluation', candidateId])
    }
  }, [candidateId])

  useEffect(() => {
    if (employeeData?.data) {
      if (employeeData?.data.length > NUMBERMAP.ZERO) {
        setRecruitmentId(employeeData.data[NUMBERMAP.ZERO].recruitment_id ?? null)
        setFormData(employeeData.data[NUMBERMAP.ZERO])
      }
    }
  }, [employeeData])
  useEffect(() => {
    if (roleId) {
      fetchJD()
    }
  }, [roleId])
  useEffect(() => {
    if (recruitmentId) {
      fetchRecritmentByid()
      recruitmentById()
    }
  }, [recruitmentId])

  const extractedDraftedDocuments = (type: string, documents: []) => {
    return documents.filter((document: any) => document.document_type == type)
  }
  const handleDocumentsUpdates = () =>{
      const EdqDocuments = draftData?.data?.draftDocuments?.[FILE_SECTION_NAMES.EDUCATIONAL_QUALIFICATION] ?? []
      const ExperienceDocuments = draftData?.data?.draftDocuments?.[FILE_SECTION_NAMES.EXPERIENCE] ?? []
      const ExpertiseDocuments = draftData?.data?.draftDocuments?.[FILE_SECTION_NAMES.EXPERTISE] ?? []
      const SkillSetDocuments = draftData?.data?.draftDocuments?.[FILE_SECTION_NAMES.SKILL_SET] ?? []
      const TrainingEffectivenessDocuments = draftData?.data?.draftDocuments?.[FILE_SECTION_NAMES.EMPLOYEE_SUPPORTING_DOCUMENT] ?? []
      setEduQualFiles([...extractedDraftedDocuments(FILE_SECTION_NAMES.EDUCATIONAL_QUALIFICATION, draftData?.data?.documents), ...EdqDocuments])
      setExperienceFiles([...extractedDraftedDocuments(FILE_SECTION_NAMES.EXPERIENCE, draftData.data.documents), ...ExperienceDocuments])
      setExpertiseFiles([...extractedDraftedDocuments(FILE_SECTION_NAMES.EXPERTISE, draftData.data.documents), ...ExpertiseDocuments])
      setSkillSetFiles([...extractedDraftedDocuments(FILE_SECTION_NAMES.SKILL_SET, draftData.data.documents), ...SkillSetDocuments])
      setTrainingFiles([...extractedDraftedDocuments(FILE_SECTION_NAMES.EMPLOYEE_SUPPORTING_DOCUMENT, draftData.data.documents), ...TrainingEffectivenessDocuments])

  }
  useEffect(() => {
    if (draftData?.data) {
      setFormData(draftData.data)
      setRecruitmentId(draftData?.data?.recruitmentId??null)
      setroleId(draftData?.data?.role??null)
      handleDocumentsUpdates()
      setDraftDocuments(draftData?.data?.draftDocuments??{})
      setDraftDelete(draftData?.data?.draftDelete ?? [])      
      if (draftData.data?.skillSets) {
        setSkillSets(draftData.data.skillSets)
      }
      if (draftData.data?.trainingNeedsList) {
        setTrainingNeedsList(draftData.data.trainingNeedsList)
      }
      if (draftData.data?.administrativeReports) {
        setFormData(prev => ({ ...prev, administrativeReports: draftData.data.administrativeReports }))
      }
    }
  }, [draftData])

  const handleChange =
    (field: string) => (value: string | string[] | number) => {
      if (!hasEditPermission) return;
      if (field === FIELD_NAMES.RECRUITMENT_ID) {
        resetFormToInitial()
        setRecruitmentId(value as string)
        setroleId(null)
        if (!value) {
          resetFormToInitial()
        }
      }
      setFormData((prev) => {
        const updated = {
          ...prev,
          [field]:
            field === FIELD_NAMES.EMPLOYEE_ID || field === FIELD_NAMES.AGE ? String(value) : value,
        };
          handleDraftSave(updated, skillSets, formData.administrativeReports, { 'educationalQualification': finalEquality, 'experience': finalExperience, 'areaOfExpertise': finalExpertiesFile, 'skillSet': finalSkillSetFiles, 'trainingEffectiveness': finalTrainingFiles, 'trainingNeeds': FINALFILEINITIALDATA});
        return updated;
      })
      if (field == FIELD_NAMES.CANDIDATE_EVALUATION_ID) {
        setCandidateId(value)
        updateFormData(String(value))
        if (!value) {
          setTrainingNeedsList([])
          setTrainingFiles([])
          setCandidateId(null)
        }
          setErrors((prev) => ({
            ...prev,
            educationalQualification: '',
            experience:'',
            areaOfExpertise:''
          }))
      }
      if (field === FIELD_NAMES.EMPLOYEE_ID) {
        const trimmedValue = String(value).trim()

        if (numberValidation.test(trimmedValue)) {
          setErrors((prev) => ({
            ...prev,
            [field]: VALIDATION_MESSAGES.PROVIDE_VALID_EMPLOYEE_NUMBER,
          }))
          return
        }
      }

      if (field === FIELD_NAMES.AGE) {
        const trimmedValue = String(value).trim()
        if (!numberValidation.test(trimmedValue)) {
          setErrors((prev) => ({
            ...prev,
            [field]: VALIDATION_MESSAGES.PROVIDE_VALID_AGE,
          }))
          return
        }
      }

      if (errors[field as keyof typeof errors]) {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }))
      }
    }
  const updateFormData = (value: string) => {
    candidateEvaluationResponse?.data.find((item: any) => {
      if (item.candidate_id == value) {
        setFormData((prev) => ({
          ...prev,
          first_name: item.candidate_first_name,
          last_name: item.candidate_last_name,
        }))
        setErrors((prev) => ({ ...prev, first_name: '', last_name: '' }))
      }
    })
  }
  // Helper function to extract file ID from different file object types
  const getFileId = (file: any): string | number | undefined => {
    if ('file_id' in file) return file.file_id
    if ('document_id' in file) return file.document_id
    if ('id' in file) return file.id
    return undefined
  }

  // Get file state setter based on section
  const getFileSetter = (section: FileSection) => {
    const setters = {
      educationalQualification: setEduQualFiles,
      experience: setExperienceFiles,
      areaOfExpertise: setExpertiseFiles,
      skillSet: setSkillSetFiles,
      trainingEffectiveness: setTrainingFiles,
      trainingNeeds: setTrainingNeedsFiles,
    }
    return setters[section]
  }

  // Handle file upload for a specific section
  const handleFileUpload = useCallback(
    (newFile: File | FileData2, section: FileSection) => {
      if (!hasEditPermission) return;
      // Update the specific section's file state
      const setter = getFileSetter(section)
      if (setter) {
        setter((prev: DocumentStructure[]) => {
          // Check if file already exists
          const existingFileIndex = prev.findIndex((file: DocumentStructure) => {
            const currentId = getFileId(file)
            const updatedId = getFileId(newFile)
            return currentId === updatedId
          })

          if (existingFileIndex !== -1) {
            // Update existing file
            const updated = prev.map((file: DocumentStructure, index: number) => {
              const currentId = getFileId(file)
              const updatedId = getFileId(newFile)
              return currentId === updatedId ? { ...file, ...newFile } : file
            })
            return updated
          } else {
            // Add new file
            const newArray = [...prev, newFile as any]
            return newArray
          }
        })
      } else {
        console.error(`No setter found for section: ${section}`)
      }
    },
    []
  )

  // Handle file edit for a specific section
  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2, section: FileSection) => {
      if (!hasEditPermission) return;
      const setter = getFileSetter(section)
      if (setter) {
        setter((prev: DocumentStructure[]) =>
          prev.map((file: DocumentStructure) => {
            const currentId = getFileId(file)
            const updatedId = getFileId(updatedFile)
            return currentId === updatedId ? { ...file, ...updatedFile } : file
          })
        )
      }
    },
    []
  )

  // Handle file submission for a specific section
  const handleFileSubmit = (data: DocumentStructure, section: FileSection) => {
      if (!hasEditPermission) return;
      // Convert DocumentStructure to FinalFileData format - KEEP the actual files!
      if (section === 'educationalQualification') {
        setFinalEquality((prev) => {
          const merged = mergeFinalFileData(prev, data)
          return merged
        })
        // Call handleDraftSave after state update with latest values
        setTimeout(() => {
          setFinalEquality((current) => {
            handleDraftSave(formData, skillSets, formData.administrativeReports, { 'educationalQualification': current, 'experience': finalExperience, 'areaOfExpertise': finalExpertiesFile, 'skillSet': finalSkillSetFiles, 'trainingEffectiveness': finalTrainingFiles, 'trainingNeeds': trainingNeedsFinalData});
            return current
          })
        }, NUMBERMAP.ZERO)
      } else if (section === 'experience') {
        setFinalExperience((prev) => {
          const merged = mergeFinalFileData(prev, data)
          return merged
        })
        setTimeout(() => {
          setFinalExperience((current) => {
            handleDraftSave(formData, skillSets, formData.administrativeReports, { 'experience': current, 'educationalQualification': finalEquality, 'areaOfExpertise': finalExpertiesFile, 'skillSet': finalSkillSetFiles, 'trainingEffectiveness': finalTrainingFiles, 'trainingNeeds': trainingNeedsFinalData});
            return current
          })
        }, NUMBERMAP.ZERO)
      } else if (section === 'areaOfExpertise') {
        setFinalExpertiesFile((prev) => {
          const merged = mergeFinalFileData(prev, data)
          return merged
        })
        setTimeout(() => {
          setFinalExpertiesFile((current) => {
            handleDraftSave(formData, skillSets, formData.administrativeReports, { 'areaOfExpertise': current, 'educationalQualification': finalEquality, 'experience': finalExperience, 'skillSet': finalSkillSetFiles, 'trainingEffectiveness': finalTrainingFiles, 'trainingNeeds': trainingNeedsFinalData});
            return current
          })
        }, NUMBERMAP.ZERO)
      } else if (section === 'skillSet') {
        setFinalSkillSetFiles((prev) => {
          const merged = mergeFinalFileData(prev, data)
          return merged
        })
        setTimeout(() => {
          setFinalSkillSetFiles((current) => {
            handleDraftSave(formData, skillSets, formData.administrativeReports, { 'skillSet': current, 'educationalQualification': finalEquality, 'experience': finalExperience, 'areaOfExpertise': finalExpertiesFile, 'trainingEffectiveness': finalTrainingFiles, 'trainingNeeds': trainingNeedsFinalData});
            return current
          })
        }, NUMBERMAP.ZERO)
      } else if (section === 'trainingEffectiveness') {
        setFinalTrainingFiles((prev) => {
          const merged = mergeFinalFileData(prev, data)
          return merged
        })
        setTimeout(() => {
          setFinalTrainingFiles((current) => {
            handleDraftSave(formData, skillSets, formData.administrativeReports, { 'trainingEffectiveness': current, 'educationalQualification': finalEquality, 'experience': finalExperience, 'areaOfExpertise': finalExpertiesFile, 'skillSet': finalSkillSetFiles, 'trainingNeeds': trainingNeedsFinalData});
            return current
          })
        }, NUMBERMAP.ZERO)
      } else if (section === 'trainingNeeds') {
        // For training needs, we handle the local array structure
        setTrainingNeedsFinalData((prev) => {
          const merged = mergeFinalFileData(prev, data)
          return merged
        })
        setTimeout(() => {
          setTrainingNeedsFinalData((current) => {
            handleDraftSave(formData, skillSets, formData.administrativeReports, { 'trainingNeeds': current, 'educationalQualification': finalEquality, 'experience': finalExperience, 'areaOfExpertise': finalExpertiesFile, 'skillSet': finalSkillSetFiles, 'trainingEffectiveness': finalTrainingFiles });
            return current
          })
        }, NUMBERMAP.ZERO)
      }
    }
   

  // Effect to update file states when files are deleted

  // Handle adding a new skill set
  const updateTrainingNeedsList = (
    skill: any,
    isEdit: boolean,
  ) => {
    /**
     * Function Name: updateTrainingNeedsList
     * Params: skill,isEdit
     * Description: This function helps to Update and add training needs data based on skill data
     * Author: Velmurugan
     * Created: 13-08-2025
      *Classification : Confidential
    **/

    if (employeeId !== CREATE_MODE) {
      return
    }
    if (skill?.length > NUMBERMAP.ZERO) {
      const TraniningNeedsForEmp = skill?.filter((item) => Number(item.skill_possess_level) < Number(item.skill_level))?.map((skildata) => {
        const needsTraining = Number(skildata.skill_possess_level) < Number(skildata.skill_level)

        const skillExistsInTrainingNeeds = trainingNeedsList.some(
          (tn) => tn.skill_id === skildata.skill_id
        )
        if (needsTraining && !skillExistsInTrainingNeeds) {
          const skillMatch = Array.isArray(skillOptions)
            ? skillOptions.find((s) => s.skill_id === Number(skildata.skill_id))
            : null;
          const skillName = skillMatch ? skillMatch.skill_name : skildata.skill_name
          return {
            employee_training_needs_id: crypto.randomUUID(),
            skill_id: skildata.skill_id,
            skill_name: skillName,
            level_required: skildata.skill_level,
            level_possess: skildata.skill_possess_level,
            dateOfJoining: TRAINING_NEED_DEFAULTS.DATE_OF_JOINING ?? dayjs().toISOString(),
            status: TRAINING_NEED_DEFAULTS.STATUS_PENDING,
            source_id: NUMBERMAP.THREE,
            source: TRAINING_NEED_DEFAULTS.SOURCE_EMPTY,
            skill: skillName ?? TRAINING_NEED_DEFAULTS.SKILL_EMPTY, // Add required skill property
          }
        }
      })
      if (TraniningNeedsForEmp.length > NUMBERMAP.ZERO) {
        setTrainingNeedsList((prev) => [...prev, ...TraniningNeedsForEmp])
      }

    }
  }

  // Validation function
  const getFieldError = (field: string, value: any, errorMsg: string) =>
    !value ? errorMsg : ''
  const validateForm = () => {
    const newErrors = {
      first_name: getFieldError(
        'first_name',
        formData.first_name,
        FORM_ERRORS.first_name
      ),
      last_name: getFieldError(
        'last_name',
        formData.last_name,
        FORM_ERRORS.last_name
      ),
      employeeNumber: getFieldError(
        'employee_id',
        formData.employee_id,
        FORM_ERRORS.employeeNumber
      ),
      age: getFieldError('age', formData.age, FORM_ERRORS.age),
      role: getFieldError('role', formData.role, FORM_ERRORS.role),
      dateOfJoining: getFieldError(
        'dateOfJoining',
        formData.dateOfJoining,
        FORM_ERRORS.dateOfJoining
      ),
      department: getFieldError(
        'department',
        formData.department,
        FORM_ERRORS.department
      ),
      employmentType: getFieldError(
        'employmentType',
        formData.employmentType,
        FORM_ERRORS.employmentType
      ),
      educationalQualification: getFieldError(
        'educationalQualification',
        formData.educationalQualification,
        FORM_ERRORS.educationalQualification
      ),
      experience: getFieldError(
        'experience',
        formData.experience,
        FORM_ERRORS.experience
      ),
      employee_id: getFieldError(
        'employee_id',
        formData.employee_id,
        FORM_ERRORS.employee_id
      ),
      areaOfExpertise: getFieldError(
        'areaOfExpertise',
        formData.areaOfExpertise,
        FORM_ERRORS.areaOfExpertise
      ),
      recruitmentId: getFieldError(
        'recruitmentId',
        formData.recruitmentId,
        FORM_ERRORS.recruitmentId
      ),
      candidate_evaluation_id: getFieldError(
        'candidate_evaluation_id',
        formData.candidate_evaluation_id,
        FORM_ERRORS.candidate_evaluation_id
      ),
      trainingEffectiveness: getFieldError(
        'trainingEffectiveness',
        formData.trainingEffectiveness,
        FORM_ERRORS.trainingEffectiveness
      ),
      administrativeReports:
        formData.administrativeReports.length === NUMBERMAP.ZERO
          ? FORM_ERRORS.administrative_reports
          : '',
      functional_reports_to_user_id: getFieldError(
        'functional_reports_to_user_id',
        formData.functional_reports_to_user_id,
        FORM_ERRORS.functional_reports_to_user_id
      ),
      designation_id:getFieldError(
        'designation_id',
        formData.designation_id,
        FORM_ERRORS.designation_id
      )
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  const applyTrainingNeedsCreateMetaForFile = (
    file: any,
    trainingNeedIndex: number,
    trainingNeedsFinalDataParam: any,
    createMetadataRef: any
  ) => {
    const fileBlob = file?.file
    if (!fileBlob) return
    createMetadataRef['training_needs'] = createMetadataRef['training_needs'] ?? {}
    Object.entries(trainingNeedsFinalDataParam.create_meta_data).forEach(([fileName, fileData]: [string, any]) => {
      if (fileName !== fileBlob.name) return
      const indexKey = trainingNeedIndex.toString()
      createMetadataRef['training_needs'][indexKey] = createMetadataRef['training_needs'][indexKey] ?? {}
      createMetadataRef['training_needs'][indexKey][fileName] = {
        ...fileData,
      }
    })
  }

  const applyTrainingNeedsUpdateMetaForFile = (
    file: any,
    trainingNeedIndex: number,
    trainingNeedsFinalDataParam: any,
    updateMetadataRef: any
  ) => {
    const existingId = file?.fk_eqms_file_id ?? file?.file_id
    if (!existingId) return
    updateMetadataRef['training_needs'] = updateMetadataRef['training_needs'] ?? {}
    Object.entries(trainingNeedsFinalDataParam.update_meta_data).forEach(([fileName, fileData]: [string, any]) => {
      if (fileName != existingId) return
      const indexKey = trainingNeedIndex.toString()
      updateMetadataRef['training_needs'][indexKey] = updateMetadataRef['training_needs'][indexKey] ?? {}
      updateMetadataRef['training_needs'][indexKey][fileName] = {
        ...fileData,
      }
    })
  }

  const processTrainingNeedsMetadata = (
    trainingNeedsListParam: any[],
    trainingNeedsFinalDataParam: any,
    createMetadataRef: any,
    updateMetadataRef: any
  ) => {
    trainingNeedsListParam.forEach((trainingNeed, trainingNeedIndex) => {
      const supportingFiles = trainingNeed?.training_supporting_files
      if (!supportingFiles || supportingFiles.length === NUMBERMAP.ZERO) return

      const hasCreateMeta = Object.keys(trainingNeedsFinalDataParam?.create_meta_data ?? {}).length > NUMBERMAP.ZERO
      const hasUpdateMeta = Object.keys(trainingNeedsFinalDataParam?.update_meta_data ?? {}).length > NUMBERMAP.ZERO
      supportingFiles.forEach((file: any) => {
        if (hasCreateMeta) {
          applyTrainingNeedsCreateMetaForFile(
            file,
            trainingNeedIndex,
            trainingNeedsFinalDataParam,
            createMetadataRef
          )
        }

        if (hasUpdateMeta) {
          applyTrainingNeedsUpdateMetaForFile(
            file,
            trainingNeedIndex,
            trainingNeedsFinalDataParam,
            updateMetadataRef
          )
        }
      })
    })
  }

  const prepareFileMetadatas = () => {
    // Get all file_ids from draftData.data.documents (preserved documents)
   
    const preservedDocumentIds = extractPreservedDocumentIds(draftData)
    const createMetadata: any = {}
    const updateMetadata: any = {}
    // Helper function to add files to metadata
    const addFileMetadata = (sectionKey: string, files: FinalFileData) => {
      if (Object.keys(files?.create_meta_data ?? {}).length > NUMBERMAP.ZERO) {
        createMetadata[sectionKey] = Object.entries(
          files.create_meta_data
        ).reduce((acc, [fileName, fileData]) => {
          acc[fileName] = {
            ...fileData,
            fk_eqms_file_id: '{fileId}',
          }
          return acc
        }, {} as any)
      }
      // Collect update metadata by section
      if (Object.keys(files?.update_meta_data ?? {}).length > NUMBERMAP.ZERO) {
        updateMetadata[sectionKey] = Object.entries(
          files.update_meta_data
        ).reduce((acc, [fileName, fileData]) => {
          acc[fileName] = {
            ...fileData,
          }
          return acc
        }, {} as any)
      }
      // Collect draft update metadata
      if(formData?.draftDocuments?.[sectionKey]?.length > NUMBERMAP.ZERO){
        formData?.draftDocuments?.[sectionKey].forEach((document: any) => {
          if(document.source != ''){
            updateMetadata[sectionKey] = {
              ...updateMetadata[sectionKey],
              [document.file_id]: document
            }
          }
        })
      }
    }

    // Add files from each section using the correct API section names
    addFileMetadata(FILE_SECTION_NAMES.EDUCATIONAL_QUALIFICATION, finalEquality)
    addFileMetadata(FILE_SECTION_NAMES.EXPERIENCE, finalExperience)
    addFileMetadata(FILE_SECTION_NAMES.EXPERTISE, finalExpertiesFile)
    addFileMetadata(FILE_SECTION_NAMES.SKILL_SET, finalSkillSetFiles)
    addFileMetadata(FILE_SECTION_NAMES.EMPLOYEE_SUPPORTING_DOCUMENT, finalTrainingFiles)

   processTrainingNeedsMetadata(
      trainingNeedsList,
      trainingNeedsFinalData,
      createMetadata,
      updateMetadata
    )
    

    
    // Prepare documents_to_delete by section
    const documentsToDeleteBySection: Record<string, string[]> = {}
    documentsToDeleteBySection[FILE_SECTION_NAMES.EDUCATIONAL_QUALIFICATION] = finalEquality.documents_to_delete
    documentsToDeleteBySection[FILE_SECTION_NAMES.EXPERIENCE] = finalExperience.documents_to_delete
    documentsToDeleteBySection[FILE_SECTION_NAMES.EXPERTISE] = finalExpertiesFile.documents_to_delete
    documentsToDeleteBySection[FILE_SECTION_NAMES.SKILL_SET] = finalSkillSetFiles.documents_to_delete
    documentsToDeleteBySection[FILE_SECTION_NAMES.EMPLOYEE_SUPPORTING_DOCUMENT] = finalTrainingFiles.documents_to_delete
    documentsToDeleteBySection[FILE_SECTION_NAMES.TRAINING_NEEDS] = trainingNeedsFinalData.documents_to_delete

    
    // Add draftDelete by section
    Object.values(FILE_SECTION_NAMES).forEach((section) => {
      const draftDeleteIds = draftData?.data?.draftDelete?.[section]?.map(String)
      if (draftDeleteIds?.length > NUMBERMAP.ZERO) {
        documentsToDeleteBySection[section] = [
          ...(documentsToDeleteBySection[section] ?? []),
          ...draftDeleteIds
        ]
      }
    })
    
    // Filter documents_to_delete to exclude preserved documents
    const filteredDeleteBySection = filterDocumentsToDelete(
      preservedDocumentIds,
      documentsToDeleteBySection
    )
    // Build deleteMetadata from filtered results (convert to number array format)
    return {
      fileOperation: {
        create: createMetadata,
        update: updateMetadata,
        delete: [filteredDeleteBySection],
      },
      documents_to_create:[
        ...finalEquality.documents_to_create,
        ...finalExperience.documents_to_create,
        ...finalExpertiesFile.documents_to_create,
        ...finalSkillSetFiles.documents_to_create,
        ...finalTrainingFiles.documents_to_create,
        ...trainingNeedsFinalData.documents_to_create
      ],
    }


  }

  // Handle save
  const handleSave = async () => {
    if (!validateForm() || !hasEditPermission) return
    // Clear draft save when submitting final form
    clearDraftSave();
    const result = prepareFileMetadatas()
    setIsLoading(true)
    // Prepare FormData for API request
    const formDataForAPI = new FormData();
    // Include employee_id for updates (when not in CREATE_MODE)
    if (employeeId !== CREATE_MODE) {
      formDataForAPI.append(API_FORM_FIELDS.EMPLOYEE_ID, String(employeeId));
    }

    formDataForAPI.append(API_FORM_FIELDS.RESOURCE_REQUISITION_ID, String(formData.recruitmentId));
    formDataForAPI.append(API_FORM_FIELDS.EMPLOYEE_ROLE_ID, String(formData.role));
    formDataForAPI.append(API_FORM_FIELDS.TYPE_OF_EMPLOYMENT_ID, String(formData.employmentType));
    formDataForAPI.append(API_FORM_FIELDS.DEPARTMENT_ID, String(formData.department));
    formDataForAPI.append(API_FORM_FIELDS.EMPLOYEE_FIRST_NAME, formData.first_name);
    formDataForAPI.append(API_FORM_FIELDS.EMPLOYEE_LAST_NAME, formData.last_name);
    formDataForAPI.append(API_FORM_FIELDS.EMPLOYEE_NUMBER, formData.employee_id);
    formDataForAPI.append(API_FORM_FIELDS.CANDIDATE_EVALUATION_ID, formData.candidate_evaluation_id);
    formDataForAPI.append(API_FORM_FIELDS.DESIGNATION_ID, formData.designation_id);
    formDataForAPI.append(API_FORM_FIELDS.AGE, formData.age);
    // Format the date_of_joining to YYYY-MM-DD
    const formattedDateOfJoining = formData?.dateOfJoining ? dayjs(formData?.dateOfJoining).format(DATE_FORMATS.YYYY_MM_DD) : '';
    formDataForAPI.append(API_FORM_FIELDS.DATE_OF_JOINING, formattedDateOfJoining);
    formDataForAPI.append(API_FORM_FIELDS.FUNCTIONAL_REPORT_ID, formData.functional_reports_to_user_id);
    // Transform administrative reports to match API structure
    const transformedAdminReports = formData.administrativeReports.map((report: any) => ({
      [TRANSFORMED_FIELDS.SITE_ID]: Number(report.site),
      [TRANSFORMED_FIELDS.ADMINISTRATIVE_REPORT_ID]: Number(report.administrativeReportsTo)
    }));
    formDataForAPI.append(API_FORM_FIELDS.ADMINISTRATIVE_REPORT_TO, JSON.stringify(transformedAdminReports));

    formDataForAPI.append(API_FORM_FIELDS.ACTUAL_EDUCATIONAL_QUALIFICATION, formData.educationalQualification);
    formDataForAPI.append(API_FORM_FIELDS.ACTUAL_EXPERIENCE, formData.experience);
    formDataForAPI.append(API_FORM_FIELDS.ACTUAL_AREA_OF_EXPERTISE, formData.areaOfExpertise);

    // Transform skill set to match API structure
    const transformedSkillSet = skillSets.map((skill: any) => {
      return {
        [TRANSFORMED_FIELDS.ROLE_DEFINITION_SKILL_LEVEL_MAPPER_ID]: Number(skill.hr_role_definition_skill_level_mapper_id ?? skill.skill_id ?? skill.id),
        [TRANSFORMED_FIELDS.SKILL_LEVEL_ID]: Number(skill.level_possess_id)
      }
    });
    formDataForAPI.append(API_FORM_FIELDS.SKILL_SET, JSON.stringify(transformedSkillSet));
    formDataForAPI.append(API_FORM_FIELDS.TRAINING_AND_CERTIFICATIONS, formData.trainingEffectiveness);
    // Helper function to format date properly

    // Transform trainingNeeds to the expected format
    const transformedTrainingNeeds = trainingNeedsList.map((need) => {
      const dateValue = need.dateOfJoining ?? need.target_date;
      const formattedDate = formatDateForAPI(dateValue);
      const isNewRecord = typeof need?.employee_training_needs_id === 'string' && need?.employee_training_needs_id?.startsWith('new_')      
      if (need?.employee_training_needs_id && !isNewRecord) {
        const parsedStatus = Number(need.status);
        const trainingStatus = Number.isNaN(parsedStatus) ? NUMBERMAP.ONE : parsedStatus;
        return {
          training_needs_id: Number(need?.employee_training_needs_id),
          [TRANSFORMED_FIELDS.SKILL_ID]: Number(need.skill_id), // Ensure skill_id is a number
          [TRANSFORMED_FIELDS.SOURCE_ID]: Number(need.source_id), // Ensure source_id is a number
          [TRANSFORMED_FIELDS.TARGET_DATE]: formattedDate, // Use the formatted date,
          status:trainingStatus
        }
      }
      return {
        [TRANSFORMED_FIELDS.SKILL_ID]: Number(need.skill_id), // Ensure skill_id is a number
        [TRANSFORMED_FIELDS.SOURCE_ID]: Number(need.source_id), // Ensure source_id is a number
        [TRANSFORMED_FIELDS.TARGET_DATE]: formattedDate, // Use the formatted date
      };
    });

    // Use transformedTrainingNeeds in the API request
    formDataForAPI.append(API_FORM_FIELDS.TRAINING_NEEDS, JSON.stringify(transformedTrainingNeeds));

    // Append files
    result.documents_to_create.forEach((file) => {
      formDataForAPI.append(API_FORM_FIELDS.DOCUMENTS_TO_CREATE, file);
    });

    // Extract all delete IDs from the delete object
    const allDeleteIds: number[] = []
    Object.values(result.fileOperation.delete).forEach((deleteSection: any) => {
      if (deleteSection?.fk_eqms_file_id && Array.isArray(deleteSection?.fk_eqms_file_id)) {
        if (deleteSection?.fk_eqms_file_id) {
            allDeleteIds.push(...(deleteSection?.fk_eqms_file_id ?? []));
        }
      }
    })
    
    // Filter out deleted documents from draftDocuments before using groupByForHR
    const filteredDraftDocuments = draftData?.data?.documents?.filter((doc: any) => 
      !allDeleteIds.includes(Number(doc.file_id))
    ) ?? []
    
    const allDocumentsToDelete = [
      ...finalEquality.documents_to_delete,
      ...finalExperience.documents_to_delete,
      ...finalExpertiesFile.documents_to_delete,
      ...finalSkillSetFiles.documents_to_delete,
      ...finalTrainingFiles.documents_to_delete,
      ...trainingNeedsFinalData.documents_to_delete,
    ]
    let createMetaData = result.fileOperation.create
    if (filteredDraftDocuments.length > 0) {
      const groupedDocuments = groupByForHR(filteredDraftDocuments?.filter((document: any) => !allDocumentsToDelete?.includes(document.file_id)))
      createMetaData = { ...createMetaData, ...groupedDocuments }
    }   
    // Flatten delete documents from all sections
    let updateMetaData = result.fileOperation.update
    updateMetaData = filterNestedUpdateMetaData(
      [...allDocumentsToDelete],
      updateMetaData
    )
    // Append metadata
    formDataForAPI.append(API_FORM_FIELDS.CREATE_META_DATA, JSON.stringify(createMetaData));
    formDataForAPI.append(API_FORM_FIELDS.UPDATE_META_DATA, JSON.stringify(updateMetaData));
    formDataForAPI.append(API_FORM_FIELDS.DOCUMENTS_TO_DELETE, JSON.stringify(result.fileOperation.delete));
    upsertEmployee(formDataForAPI, {
      onSuccess: (response: any) => {
        const employeeIdFromResponse = response?.data?.[NUMBERMAP.ZERO]?.employeeId
        if (employeeIdFromResponse && formData.department && employeeId === CREATE_MODE) {
          submitWorkflow({
            context_type: EMPLOYEE_CONSTANTS.CONTEXT_TYPE,
            department: [Number(formData.department)],
            context_id: employeeIdFromResponse
          }, {
            onSuccess: () => {
              router.push(NAVIGATION_PATHS.HR_EMPLOYEE)
              showActionAlert(STATUS.SUCCESS)
              resetForm()
              resetFormToInitial()
              setIsLoading(false)
              employeeFetchById()
            },
            onError: () => {
              showActionAlert(STATUS.FAILED)
              setIsLoading(false)
            }
          })
        } else {
          router.push(NAVIGATION_PATHS.HR_EMPLOYEE)
          showActionAlert(STATUS.SUCCESS)
          resetForm()
          setIsLoading(false)
          employeeFetchById()
        }
      },
      onError: (err) => {

        if (err.response) {
          const errorMessage = err.response?.data?.description
          if (errorMessage == ERROR_DUBLICATE_ENTRY.ERROR_CHECK) {
            showActionAlert('customAlert', {
              'title': "Something Went Wrong",
              icon: 'error',
              "text": ERROR_DUBLICATE_ENTRY.ERROR_MESSAGE,
              cancelButton: false,
              confirmButton: false
            })
          } else {
            showActionAlert(STATUS.FAILED)
          }
        }
        setIsLoading(false)
      }
    })
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      first_name: RESET_FORM_VALUES.EMPTY_STRING,
      last_name: RESET_FORM_VALUES.EMPTY_STRING,
      employee_id: RESET_FORM_VALUES.EMPTY_STRING,
      age: RESET_FORM_VALUES.EMPTY_STRING,
      role: RESET_FORM_VALUES.NULL_VALUE,
      dateOfJoining: RESET_FORM_VALUES.EMPTY_STRING,
      department: RESET_FORM_VALUES.NULL_VALUE,
      recruitmentId: RESET_FORM_VALUES.NULL_VALUE,
      employmentType: RESET_FORM_VALUES.EMPTY_STRING,
      educationalQualification: RESET_FORM_VALUES.EMPTY_STRING,
      experience: RESET_FORM_VALUES.EMPTY_STRING,
      areaOfExpertise: RESET_FORM_VALUES.EMPTY_STRING,
      skillSet: RESET_FORM_VALUES.EMPTY_STRING,
      trainingEffectiveness: RESET_FORM_VALUES.EMPTY_STRING,
      functional_reports_to_user_id: RESET_FORM_VALUES.EMPTY_STRING,
      administrativeReports: RESET_FORM_VALUES.EMPTY_ARRAY,
      trainingNeeds: RESET_FORM_VALUES.EMPTY_ARRAY,
    })

    setSkillSets(RESET_FORM_VALUES.EMPTY_ARRAY)
    setTrainingNeedsList(RESET_FORM_VALUES.EMPTY_ARRAY)
    setTrainingEvaluations(RESET_FORM_VALUES.EMPTY_ARRAY)

    // Reset all file states
    setEduQualFiles(RESET_FORM_VALUES.EMPTY_ARRAY)
    setExperienceFiles(RESET_FORM_VALUES.EMPTY_ARRAY)
    setExpertiseFiles(RESET_FORM_VALUES.EMPTY_ARRAY)
    setSkillSetFiles(RESET_FORM_VALUES.EMPTY_ARRAY)
    setTrainingFiles(RESET_FORM_VALUES.EMPTY_ARRAY)
    setTrainingNeedsFiles(RESET_FORM_VALUES.EMPTY_ARRAY) // Reset training needs files

    setErrors({
      first_name: '',
      last_name: '',
      employee_id: '',
      age: '',
      role: '',
      dateOfJoining: '',
      department: '',
      employmentType: '',
      educationalQualification: '',
      experience: '',
      areaOfExpertise: '',
      trainingEffectiveness: '',
    })
  }

  // Set up the button handlers for create mode
  const buttons = [
    {
      label: BUTTON_LABELS.cancel,
      onClick: async () => {
        await checkUnsavedDraftBeforeLeave()
        router.push(NAVIGATION_PATHS.HR_EMPLOYEE)
      },
      variant: BUTTON_VARIANTS.OUTLINED,
    },
    {
      label: BUTTON_LABELS.save,
      onClick: handleSave,
      variant: BUTTON_VARIANTS.CONTAINED,
      disabled: isLoading ?? isUpserting,
    },
  ]

  // Date picker icon

  // Helper function to extract trainingDocumentDetails from nested structure
  const extractTrainingDocumentDetails = (files: any[]) => {
    if (!files || !Array.isArray(files)) return []

    return files.map((file) => {
      // If the file has trainingDocumentDetails, extract it
      if (file.trainingDocumentDetails) {
        return file.trainingDocumentDetails
      }
      // If it's already flattened, return as is
      return file
    })
  }

  const handleEditTrainingNeed = (trainingNeed: any) => {
    setEditingTrainingNeed(trainingNeed)
    const extractedFiles = extractTrainingDocumentDetails(
      trainingNeed.training_supporting_files ?? []
    )
    setTrainingNeedsFiles(extractedFiles)
    setTrainingModal(true)
  }

  const handleAddTrainingNeedClick = () => {
    if (!hasEditPermission) return
    setEditingTrainingNeed(null)
    setTrainingNeedsFiles([]) // Clear files for new training need
    setTrainingModal(true)
  }

  // Add this function to handle deleting a training need
  const handleDeleteTrainingNeed = async (trainingNeed: any) => {
    if (!hasEditPermission) return;
    try {
      const result = await showActionAlert('delete')
      if (result.isConfirmed) {
        // Update both trainingNeedsList and formData.trainingNeeds
        setTrainingNeedsList((prev) => {
          // Find the index of the item to delete
          const indexToDelete = prev.findIndex((item) => {
            // Check if this is the item we want to delete
            const itemId = item.employee_training_needs_id ?? item.id
            const trainingNeedId =
              trainingNeed.employee_training_needs_id ?? trainingNeed.id

            // If IDs match, this is the item to delete
            if (itemId === trainingNeedId) {
              return true
            }

            // If no ID match, try matching by skill and source combination
            const itemSkill = item.skill_id ?? item.skill
            const trainingNeedSkill =
              trainingNeed.skill_id ?? trainingNeed.skill
            const itemSource = item.source_id ?? item.source
            const trainingNeedSource =
              trainingNeed.source_id ?? trainingNeed.source

            return (
              itemSkill === trainingNeedSkill &&
              itemSource === trainingNeedSource
            )
          })
          if (indexToDelete !== -1) {
            // Remove the item at the found index
            const newList = [...prev]
            const TrainingNeeds = newList[indexToDelete]
            const Id = TrainingNeeds?.employee_training_needs_id?.toString()?.split("_")?.[NUMBERMAP.ZERO]
            if(Id&&Id=='new'){
               newList.splice(indexToDelete, 1);
            }else{
              newList[indexToDelete] = {
              ...newList[indexToDelete],
              status: NUMBERMAP.ZERO
            };
            }
            setFormData((prevFormData) => ({
              ...prevFormData,
              trainingNeeds: newList,
            }))

            return newList
          } else {
            return prev
          }
        })

        showActionAlert(ALERT_MESSAGES.SUCCESS)
      }
    } catch (error) {
      console.error(error)
      showActionAlert(ALERT_MESSAGES.FAILED)
    }
  }

  useEffect(() => {
    if (employeeData?.data || fetchJdDetails?.data) {
      if (roleId) {
        const employee = employeeData?.data?.[NUMBERMAP.ZERO] ?? {}
        const jdDetails = fetchJdDetails?.data?.[NUMBERMAP.ZERO] ?? {}
        // Combine skill sets from both APIs
        const employeeSkills = employee.skill_set ?? []
        // Normalize and merge skill sets, ensuring unique entries
        const combinedSkills = [
          ...employeeSkills.map((skill) => ({
            id: skill.id,
            employee_training_needs_id: skill.employee_training_needs_id ?? null,
            skill_level_mapper_id: skill.id,
            skill_id: skill.skill_id ?? skill.skill_name,
            skill_name: skill.skill_name,
            skill_level: skill.skill_level,
            level_possess_id: skill.level_possess_id,
            level_possess: skill.level_possess,
            hr_role_definition_skill_level_mapper_id:
              skill.hr_role_definition_skill_level_mapper_id,
          })),
        ]

        setSkillSets(combinedSkills)

        // Update formData for other JD fields in create mode
        let resObj = {}
        if (employeeId === CREATE_MODE) {
          resObj = {
            employmentType: jdDetails.employment_type_id ?? '',
            department: jdDetails.department_id ?? '',
          }
          setErrors(((prev) => ({ ...prev, department: "", employmentType: '', role: '' })))
        }
        setFormData((prev) => ({
          ...prev,
          ...resObj,
          educationalQualificationAsPerJd:
            jdDetails.educational_qualification ?? '',
          experienceAsPerJd: jdDetails.experience ?? '',
          areaOfExpertiseAsPerJd: jdDetails.area_of_expertise ?? '',
          responsibilityAsPerJd: jdDetails.job_responsibilities ?? '',
        }))

        // Clear errors for these fields if they exist
        setErrors((prevErrors) => ({
          ...prevErrors,
          educationalQualification: '',
          experience: '',
          areaOfExpertise: '',
        }))
      }
    } else {
      resetFormToInitial()
    }
  }, [employeeData, fetchJdDetails, employeeId])

  useEffect(() => {
    if (employeeData?.data) {
      if (employeeData?.data.length > NUMBERMAP.ZERO) {
        const employee = employeeData.data[NUMBERMAP.ZERO]
        setRecruitmentId(employee.resource_requisition_id ?? null)
        // Transform training needs from API response format to form format
        const initialTrainingNeeds = (employee.employee_training_needs ?? []).map((tn: any) => ({
          ...tn,
          employee_training_needs_id: tn.employee_training_needs_id,
          skill_id: tn.skill_id,
          source_id: tn.source_id,
          dateOfJoining: tn.target_date ?? '',
          status:NUMBERMAP.ONE,
          target_date: tn.target_date ?? '',
          training_supporting_files: tn.training_supporting_files ?? []
        }))
        setroleId(employee.role_id)
        setFormData((prev) => ({
          ...prev,
          id: employee.id, // Store the database ID for updates
          first_name: employee.employee_first_name ?? '',
          designation_id:employee.designation_id??'',
          last_name: employee.employee_last_name ?? '',
          employee_id: employee.employee_id ?? '',
          age: employee.age ? String(employee.age) : '',
          role: employee.role_id ?? null,
          dateOfJoining: employee.joining_date ?? null,
          department: employee.department_id ?? null,
          recruitmentId: employee.resource_requisition_id ?? null,
          employmentType: employee.employment_type_id ?? '',
          educationalQualification: employee.educational_qualification ?? '',
          experience: employee.experience ?? '',
          areaOfExpertise: employee.area_of_expertise ?? '',
          skillSet: employee.skill_set ?? '',
          candidate_evaluation_id: employee.candidate_evaluation_id ?? '',
          trainingEffectiveness:
            employee.training_and_certifications_details ?? '',
          functional_reports_to_user_id:
            employee.functional_reports_to_user_id ?? '',
          administrativeReports:
            employee.administrative_reports?.map((report: any) => ({
              site: String(report.organization_site_id ?? ''),
              administrativeReportsTo: String(report.administrative_report_to_id ?? ''),
            })) ?? [],
          trainingNeeds: initialTrainingNeeds,
          educationalQualificationAsPerJd: '',
          experienceAsPerJd: '',
          areaOfExpertiseAsPerJd: '',
          responsibilityAsPerJd: '',
        }))

        // Sync trainingNeedsList with formData.trainingNeeds
        setTrainingNeedsList(initialTrainingNeeds)

        // File data - mapping from API response structure
        setExperienceFiles(employee.experience_files ?? [])
        setEduQualFiles(employee.qualification_files ?? [])
        setExpertiseFiles(employee.expertise_files ?? [])
        setSkillSetFiles(employee.skill_supporting_document ?? [])
        setTrainingFiles(employee.employee_supporting_files ?? [])

        // Extract training needs files from the nested structure
        const trainingNeedsFilesFlattened = initialTrainingNeeds.flatMap((tn: any) =>
          (tn.training_supporting_files ?? []).map((file: any) => ({
            ...file,
            trainingDocumentDetails: file.trainingDocumentDetails,
            file_id: file.trainingDocumentDetails?.file_id ?? file.fk_eqms_file_id,
            document_id: file.trainingDocumentDetails?.file_id ?? file.fk_eqms_file_id
          }))
        )
        setTrainingNeedsFiles(trainingNeedsFilesFlattened)
        // Table data
        setTrainingEvaluations(employee.employee_training_evaluation ?? [])
      }
    }
  }, [employeeData])

  // Transform candidate evaluation data to include full name
  const transformedCandidateData =
    candidateEvaluationResponse?.data?.map((candidate) => ({
      ...candidate,
      fullName:
        `${candidate.candidate_first_name} ${candidate.candidate_last_name}`.trim(),
    })) ?? []

  const administrativeReportsTo = allEmployees?.data?.map((candidate) => ({
    id: String(candidate.id),
    name: `${candidate.employee_name}`,
  }))

  const transformedAdministrativeReports = useMemo(() => {
    const sites = fetchSites?.data ?? []
    return formData.administrativeReports.map((report, index) => {
      const site = sites.find((s) => String(s.id) === String(report.site))
      const adminReportTo = administrativeReportsTo?.find(
        (ar) => ar.id === report.administrativeReportsTo
      )
      return {
        ...report,
        id: index, // <-- this is important for editing
        siteName: site ? site.site : EMPLOYEE_UI_CONSTANTS.UNKNOWN,
        adminReportToName: adminReportTo
          ? adminReportTo.name
          : EMPLOYEE_UI_CONSTANTS.UNKNOWN,
      }
    })
  }, [
    formData.administrativeReports,
    fetchSites?.data,
    administrativeReportsTo,
  ])

  const handleTrainingNeedsUA = (trainingData: any) => {
    const sourceMatch = sourceOptions?.find(
      (s) => s.source_id === Number(trainingData.source)
    )
    const sourceName = sourceMatch
      ? sourceMatch.source
      : EMPLOYEE_UI_CONSTANTS.UNKNOWN_SOURCE

    // Map skill ID to name
    const skillMatch = skillOptions?.find(
      (s) => s.skill_id === Number(trainingData.skill)
    )
    const skillName = skillMatch
      ? skillMatch.skill_name
      : EMPLOYEE_UI_CONSTANTS.UNKNOWN_SKILL

    if (editingTrainingNeed) {
      const trainingNeedId = editingTrainingNeed.employee_training_needs_id
      const currentFiles = trainingNeedsFiles
      const TrainingNeedsDublicate = trainingNeedsList?.filter((trainfil) => trainfil.employee_training_needs_id != editingTrainingNeed.employee_training_needs_id)
      if (trainingNeedsList?.filter((trainfil) => trainfil.employee_training_needs_id != editingTrainingNeed.employee_training_needs_id)?.some((tnl) => tnl.skill_id != trainingData.skill) || TrainingNeedsDublicate.length == NUMBERMAP.ZERO) {
        const newTrainingNeeds = [...trainingNeedsList]
        const updatedTrainingNeeds = newTrainingNeeds.map((item) => {
          if (item.employee_training_needs_id === trainingNeedId) {
            return {
              ...item,
              ...trainingData,
              source_id: trainingData.source,
              source: sourceName,
              skill_id: trainingData.skill,
              skill_name: skillName,
              training_supporting_files: currentFiles,
            };
          }
          return item;
        });
        setTrainingNeedsList(updatedTrainingNeeds)
        setFormData((prev) => ({
          ...prev,
          trainingNeeds: newTrainingNeeds,
        }))
      } else {
        showActionAlert('customAlert', {
          title: "Something Went Wrong",
          text: "This skill is already part of this training.",
          icon: "error",
          cancelButton: false,
          confirmButton: false
        });

      }

    } else {
      const newTrainingNeedId = 'new_'+crypto.randomUUID()
      const currentFiles = trainingNeedsFiles
      if (!trainingNeedsList.some((skils) => skils.skill_id == trainingData.skill && skils.status !== NUMBERMAP.ZERO)) {
        const newNeed = {
          ...trainingData,
          employee_training_needs_id: newTrainingNeedId,
          training_supporting_files: currentFiles,
          source_id: trainingData.source,
          source: sourceName,
          skill_id: trainingData.skill,
          skill_name: skillName,
        }
        setTrainingNeedsList((prev) => [...prev, newNeed])
        setFormData((prev) => ({
          ...prev,
          trainingNeeds: [...(prev.trainingNeeds ?? []), newNeed],
        }))
      } else {
        showActionAlert('customAlert', {
          title: "Something Went Wrong",
          text: "This skill is already part of this training.",
          icon: "error",
          cancelButton: false,
          confirmButton: false
        });

      }

    }
    setEditingTrainingNeed(null)
    setTrainingModal(false)
  }
  const parseDate = (date?: string | null) =>
    date && dayjs(date).isValid() ? dayjs(date) : null;

  return (
    <FormContainer ref={formRef} id="HR_EMPLOYEE">
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isAnyLoading(isFetchingEmployee,isFetchingDraft)} />
      <FormContent sx={InlineStyles.formContent}>
        <FormTitle>
          {employeeId == CREATE_MODE
            ? EMPLOYEE_UI_CONSTANTS.ADD_EMPLOYEE_TITLE
            : EMPLOYEE_UI_CONSTANTS.EDIT_EMPLOYEE_TITLE}
        </FormTitle>
        <Grid2 >
          <FormSection>
            <SectionTitle>Information</SectionTitle>
            <FormRow>
              <Grid2 container spacing={NUMBERMAP.ONE} sx={InlineStyles.gridContainer}>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    disabled={employeeId !== CREATE_MODE}
                    label={FIELD_ATTRIBUTES.recruitmentId.label}
                    placeholder={FIELD_ATTRIBUTES.recruitmentId.placeholder}
                    isDropdown={true}
                    value={formData.recruitmentId ?? ''}
                    onChange={handleChange('recruitmentId')}
                    options={recruitmentData?.data ?? []}
                    keyField="resource_requisition_id"
                    valueField="resource_requisition_id"
                    error={errors.recruitmentId ?? ''}
                    dataSourceName={FIELD_ATTRIBUTES.recruitmentId.dataSourceName}
                    dataFieldName={FIELD_ATTRIBUTES.recruitmentId.dataFieldName}
                    dataIsAutocomplete={formData.recruitmentId}
                  />
                </Grid2>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={FIELD_ATTRIBUTES.role.label}
                    placeholder={FIELD_ATTRIBUTES.role.placeholder}
                    isDropdown={true}
                    value={formData.role ?? ''}
                    onChange={handleChange('role')}
                    options={roleOptions?.data ?? []}
                    keyField="role_id"
                    valueField="role_name"
                    disabled
                    error={errors.role ?? ''}
                    dataSourceName={FIELD_ATTRIBUTES.role.dataSourceName}
                    dataFieldName={FIELD_ATTRIBUTES.role.dataFieldName}
                    dataIsAutocomplete={formData.role}
                  />
                </Grid2>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={FIELD_ATTRIBUTES.department.label}
                    placeholder={FIELD_ATTRIBUTES.department.placeholder}
                    isDropdown={true}
                    value={formData.department ?? ''}
                    onChange={handleChange('department')}
                    options={departmentOptions?.data ?? []}
                    keyField="department_id"
                    valueField="department_name"
                    disabled
                    error={errors.department ?? ''}
                    helperText={errors.department}
                    dataSourceName={FIELD_ATTRIBUTES.department.dataSourceName}
                    dataFieldName={FIELD_ATTRIBUTES.department.dataFieldName}
                    dataIsAutocomplete={formData.department}
                  />
                </Grid2>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={FIELD_ATTRIBUTES.employmentType.label}
                    placeholder={FIELD_ATTRIBUTES.employmentType.placeholder}
                    isDropdown={true}
                    value={formData.employmentType ?? ''}
                    onChange={handleChange('employmentType')}
                    options={employmentTypeOptions?.data ?? []}
                    keyField="type_of_employment_id"
                    valueField="employment_type"
                    disabled
                    error={errors.employmentType ?? ''}
                    helperText={errors.employmentType}
                    dataSourceName={
                      FIELD_ATTRIBUTES.employmentType.dataSourceName
                    }
                    dataFieldName={FIELD_ATTRIBUTES.employmentType.dataFieldName}
                    dataIsAutocomplete={formData.employmentType}
                  />
                </Grid2>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={FIELD_ATTRIBUTES.employeeName.label}
                    placeholder={FIELD_ATTRIBUTES.employeeName.placeholder}
                    isDropdown={true}
                    value={formData.candidate_evaluation_id ?? ''}
                    onChange={handleChange('candidate_evaluation_id')}
                    options={transformedCandidateData}
                    valueField="fullName"
                    hasEditable={!hasEditPermission}
                    keyField="candidate_id"
                    error={errors.candidate_evaluation_id ?? ''}
                    dataSourceName={FIELD_ATTRIBUTES.employeeName.dataSourceName}
                    dataFieldName={FIELD_ATTRIBUTES.employeeName.dataFieldName}
                    dataIsAutocomplete={formData.candidate_evaluation_id}
                  />
                </Grid2>
              </Grid2>
            </FormRow>
            <FormRow>
              <Grid2 container spacing={2} sx={InlineStyles.gridContainer}>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={FIELD_ATTRIBUTES.firstName.label}
                    placeholder={FIELD_ATTRIBUTES.firstName.placeholder}
                    value={formData.first_name ?? ''}
                    onChange={handleChange('first_name')}
                    error={errors.first_name ?? ''}
                    helperText={errors.first_name}
                    dataSourceName={FIELD_ATTRIBUTES.firstName.dataSourceName}
                    dataFieldName={FIELD_ATTRIBUTES.firstName.dataFieldName}
                  />
                </Grid2>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={FIELD_ATTRIBUTES.lastName.label}
                    placeholder={FIELD_ATTRIBUTES.lastName.placeholder}
                    value={formData.last_name ?? ''}
                    onChange={handleChange('last_name')}
                    error={errors.last_name ?? ''}
                    helperText={errors.last_name}
                    dataSourceName={FIELD_ATTRIBUTES.lastName.dataSourceName}
                    dataFieldName={FIELD_ATTRIBUTES.lastName.dataFieldName}
                  />
                </Grid2>
              </Grid2>
            </FormRow>

            <FormRow>
              <Grid2 container spacing={NUMBERMAP.TWO} sx={InlineStyles.gridContainer}>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={FIELD_ATTRIBUTES.employeeNumber.label}
                    placeholder={FIELD_ATTRIBUTES.employeeNumber.placeholder}
                    value={formData.employee_id.toString() ?? ''}
                    onChange={handleChange('employee_id')}
                    error={errors.employee_id ?? ''}
                    dataSourceName={
                      FIELD_ATTRIBUTES.employeeNumber.dataSourceName
                    }
                    dataFieldName={FIELD_ATTRIBUTES.employeeNumber.dataFieldName}
                  />
                </Grid2>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={FIELD_ATTRIBUTES.age.label}
                    placeholder={FIELD_ATTRIBUTES.age.placeholder}
                    value={formData.age ?? ''}
                    onChange={handleChange('age')}
                    type="text"
                    error={errors.age ?? ''}
                    helperText={errors.age}
                    dataSourceName={FIELD_ATTRIBUTES.age.dataSourceName}
                    dataFieldName={FIELD_ATTRIBUTES.age.dataFieldName}
                  />
                </Grid2>
              </Grid2>
            </FormRow>

            <FormRow>
              <Grid2 container spacing={NUMBERMAP.TWO} sx={InlineStyles.gridContainer}>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <DatePicker
                    error={errors.dateOfJoining ?? ''}
                    value={parseDate(formData.dateOfJoining)}
                    onChange={handleChange('dateOfJoining')}
                    label={FIELD_ATTRIBUTES.dateOfJoining.label}
                  />
                  <input
                    type="text"
                    style={InlineStyles.hiddenInput}
                    readOnly
                    data-sourcename={
                      FIELD_ATTRIBUTES.dateOfJoining.dataSourceName
                    }
                    data-fieldname={FIELD_ATTRIBUTES.dateOfJoining.dataFieldName}
                    value={
                      formData.dateOfJoining
                        ? new Date(formData.dateOfJoining).toISOString()
                        : ''
                    }
                  />
                </Grid2>
                <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={FIELD_ATTRIBUTES.functional_reports_to_user_id.label}
                    placeholder={
                      FIELD_ATTRIBUTES.functional_reports_to_user_id.placeholder
                    }
                    isDropdown={true}
                    hasEditable={!hasEditPermission}
                    value={formData.functional_reports_to_user_id ?? ''}
                    onChange={handleChange('functional_reports_to_user_id')}
                    options={allEmployees?.data ?? []}
                    valueField="employee_name"
                    keyField="id"
                    error={errors.functional_reports_to_user_id ?? ''}
                    dataSourceName={
                      FIELD_ATTRIBUTES.functional_reports_to_user_id
                        .dataSourceName
                    }
                    dataFieldName={
                      FIELD_ATTRIBUTES.functional_reports_to_user_id.dataFieldName
                    }
                    dataIsAutocomplete={formData.functional_reports_to_user_id}
                  />
                </Grid2>
                     <Grid2 size={{ md: NUMBERMAP.SIX }}>
                  <InputField
                    label={'Designation*'}
                    placeholder={'Select Designation'}
                    isDropdown={true}
                    hasEditable={!hasEditPermission}
                    value={formData?.designation_id ?? ''}
                    onChange={handleChange('designation_id')}
                    options={designationData?.data ?? []}
                    valueField="designation"
                    keyField="designation_id"
                    error={errors.designation_id ?? ''}
                  />
                </Grid2>
              </Grid2>
            </FormRow>
          </FormSection>

          <FormSection>
            <HeaderContainer>
              <Title>{EMPLOYEE_UI_CONSTANTS.ADMIN_REPORTS_TO_TITLE}*</Title>

              <AddButton variant='outlined' onClick={() => {
                if (!hasEditPermission) return
                setAdminReportsModal(true)
              }}>
                + Add New
              </AddButton>
            </HeaderContainer>
            <AdministrativeReportsTable
              data={transformedAdministrativeReports}
              onEdit={handleEditAdministrativeReport}
              onDelete={handleDeleteAdministrativeReport}
              error={errors.administrativeReports ?? ''}
            />
          </FormSection>

          <FormSection>
            <SectionTitle>Educational Qualification</SectionTitle>

            <FormRow>
              <LabelColumn>
                <LabelTitle>As per JD</LabelTitle>
                <LabelValue>
                  {formData.educationalQualificationAsPerJd ?? '-'}
                </LabelValue>
              </LabelColumn>
              <InputColumn>
                <InputField
                  label={FIELD_ATTRIBUTES.educationalQualification.label}
                  placeholder={
                    FIELD_ATTRIBUTES.educationalQualification.placeholder
                  }
                  value={formData.educationalQualification ?? ''}
                  onChange={handleChange('educationalQualification')}
                  error={errors.educationalQualification ?? ''}
                  helperText={errors.educationalQualification}
                  dataSourceName={
                    FIELD_ATTRIBUTES.educationalQualification.dataSourceName
                  }
                  dataFieldName={
                    FIELD_ATTRIBUTES.educationalQualification.dataFieldName
                  }
                />
              </InputColumn>
            </FormRow>

            <FormRow>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <FileUploadManager
                  hasEditable={!hasEditPermission}
                  subHeader='Upload'
                  initialFiles={eduQualFiles}
                  onFileUpload={(file) =>
                    handleFileUpload(file, 'educationalQualification')
                  }
                  onFileEdit={(file) =>
                    handleFileEdit(file, 'educationalQualification')
                  }
                  onSubmit={(data) =>
                    handleFileSubmit(data, 'educationalQualification')
                  }
                />
              </Grid2>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>Experience</SectionTitle>

            <FormRow>
              <LabelColumn>
                <LabelTitle>As per JD</LabelTitle>
                <LabelValue>{formData.experienceAsPerJd ?? '-'}</LabelValue>
              </LabelColumn>
              <InputColumn>
                <InputField
                  label={FIELD_ATTRIBUTES.experience.label}
                  placeholder={FIELD_ATTRIBUTES.experience.placeholder}
                  value={formData.experience ?? ''}
                  onChange={handleChange('experience')}
                  error={errors.experience ?? ''}
                  helperText={errors.experience}
                  dataSourceName={FIELD_ATTRIBUTES.experience.dataSourceName}
                  dataFieldName={FIELD_ATTRIBUTES.experience.dataFieldName}
                />
              </InputColumn>
            </FormRow>

            <FormRow>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <FileUploadManager
                  hasEditable={!hasEditPermission}
                  subHeader='Upload'
                  initialFiles={experienceFiles}
                  onFileUpload={(file) => handleFileUpload(file, 'experience')}
                  onFileEdit={(file) => handleFileEdit(file, 'experience')}
                  onSubmit={(data) => handleFileSubmit(data, 'experience')}
                />
              </Grid2>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>Area of Expertise</SectionTitle>

            <FormRow>
              <LabelColumn>
                <LabelTitle>As per JD</LabelTitle>
                <LabelValue>{formData.areaOfExpertiseAsPerJd ?? '-'}</LabelValue>
              </LabelColumn>
              <LabelColumn>
                <LabelTitle>Responsibility</LabelTitle>
                <LabelValue>{formData.responsibilityAsPerJd ?? '-'}</LabelValue>
              </LabelColumn>
            </FormRow>

            <FormRow>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  label={FIELD_ATTRIBUTES.areaOfExpertise.label}
                  placeholder={FIELD_ATTRIBUTES.areaOfExpertise.placeholder}
                  value={formData.areaOfExpertise ?? ''}
                  onChange={handleChange('areaOfExpertise')}
                  error={errors.areaOfExpertise ?? ''}
                  helperText={errors.areaOfExpertise}
                  dataSourceName={FIELD_ATTRIBUTES.areaOfExpertise.dataSourceName}
                  dataFieldName={FIELD_ATTRIBUTES.areaOfExpertise.dataFieldName}
                />
              </Grid2>
            </FormRow>

            <FormRow>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <FileUploadManager
                  hasEditable={!hasEditPermission}
                  subHeader='Upload'
                  initialFiles={expertiseFiles}
                  onFileUpload={(file) =>
                    handleFileUpload(file, 'areaOfExpertise')
                  }
                  onFileEdit={(file) => handleFileEdit(file, 'areaOfExpertise')}
                  onSubmit={(data) => handleFileSubmit(data, 'areaOfExpertise')}
                />
              </Grid2>
            </FormRow>
          </FormSection>

          <FormSection>
            <HeaderContainer>
              <Title>Skill Set</Title>
            </HeaderContainer>

            <SkillSetTable
              data={skillSets}
            />
            <FormRow>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <FileUploadManager
                  hasEditable={!hasEditPermission}
                  subHeader='Upload'
                  initialFiles={skillSetFiles}
                  onFileUpload={(file) => handleFileUpload(file, 'skillSet')}
                  onFileEdit={(file) => handleFileEdit(file, 'skillSet')}
                  onSubmit={(data) => handleFileSubmit(data, 'skillSet')}
                />
              </Grid2>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>Training and Certifications</SectionTitle>

            <FormRow>
              <TextareaContainer>
                <Description
                  label={FIELD_ATTRIBUTES.trainingEffectiveness.label}
                  placeholder={FIELD_ATTRIBUTES.trainingEffectiveness.placeholder}
                  value={formData.trainingEffectiveness ?? ''}
                  onChange={handleChange('trainingEffectiveness')}
                  error={errors.trainingEffectiveness ?? ''}
                  dataSourceName={
                    FIELD_ATTRIBUTES.trainingEffectiveness.dataSourceName
                  }
                  dataFieldName={
                    FIELD_ATTRIBUTES.trainingEffectiveness.dataFieldName
                  }
                />
              </TextareaContainer>
            </FormRow>
          </FormSection>

          <FormSection>
            <HeaderContainer>
              <Title>Training Needs</Title>
              <ButtonsContainer>
                <AddButton variant='outlined' onClick={handleAddTrainingNeedClick}>
                  + Add New
                </AddButton>
              </ButtonsContainer>
            </HeaderContainer>

            <TrainingNeedsTable
              data={trainingNeedsList?.filter((item) => item?.status !== NUMBERMAP.ZERO)}
              onEdit={handleEditTrainingNeed}
              onDelete={handleDeleteTrainingNeed}
              mode={employeeId}
            />
          </FormSection>

          <FormSection>
            <HeaderContainer>
              <Title>Training Effectiveness Evaluation</Title>
            </HeaderContainer>

            <TrainingEffectivenessTable
              onEdit={() => {
                setAdditionalModal(!additionalModal)
              }}
              data={trainingEvaluations}
              showActions={false}
            />
            <FormRow>
              <Grid2 size={NUMBERMAP.TWELVE} sx={fullWidth}>
                <FileUploadManager
                  hasEditable={!hasEditPermission}
                  subHeader='Upload'
                  initialFiles={trainingFiles}
                  onFileUpload={(file) =>
                    handleFileUpload(file, 'trainingEffectiveness')
                  }
                  onFileEdit={(file) =>
                    handleFileEdit(file, 'trainingEffectiveness')
                  }
                  onSubmit={(data) =>
                    handleFileSubmit(data, 'trainingEffectiveness')
                  }
                />
              </Grid2>
            </FormRow>
          </FormSection>
        </Grid2>

        <ButtonContainer>
          {employeeId === CREATE_MODE ? (
            <ButtonGroup buttons={buttons} />
          ) : (
            <HRReviewerModalManager
              isLoading={isLoadingEmployee}
              taskInfo={employeeData?.meta_info?.task_info}
              permissions={employeeData?.meta_info?.action_control?.permissions ?? []}
              menuId={employeeData?.meta_info?.action_control?.menuId}
              menuName={employeeData?.meta_info?.action_control?.formName}
              onPermissionChange={setHasEditPermission}
              customHandlers={{
                handleCancel: () => {
                  router.push(NAVIGATION_PATHS.HR_EMPLOYEE)
                },
                handleSave,
                isDisabled: isLoading ?? isUpserting,
              }}
              contextType={EMPLOYEE_CONSTANTS.CONTEXT_TYPE}
              contextId={Number(employeeId)}
              departmentId={Number(formData.department)}
            />
          )}
        </ButtonContainer>
      </FormContent>

      {/* Modals */}
      <CommonModal
        onClose={() => {
          setTrainingModal(false)
          setEditingTrainingNeed(null)
          setTrainingNeedsFiles([]) // Clear files for new training need
        }}
        open={trainingModal}
        title={EMPLOYEE_UI_CONSTANTS.TRAINING_NEEDS_TITLE}
      >
        <TrainingNeeds
          hasEditPermission={hasEditPermission}
          mode={employeeId}
          trainingNeedsFinalData={trainingNeedsFinalData}
          documents={trainingNeedsFiles}
          handleFileUpload={(file) => {
            const newFile = {
              ...file,
              trainingDocumentDetails: file.trainingDocumentDetails,
            }
            setTrainingNeedsFiles((prev) => [...prev, newFile])
          }}
          handleFileEdit={(updatedFile) => {
            setTrainingNeedsFiles((prev) =>
              prev.map((file) => {
                const currentId = getFileId(file)
                const updatedId = getFileId(updatedFile)
                return currentId === updatedId ? { ...file, ...updatedFile } : file
              })
            )
          }}
          handleFileSubmit={(data) => {
            setTrainingNeedsFinalData((prev) => mergeFinalFileData(prev, data))
            if (data.local_files_to_delete.length > NUMBERMAP.ZERO) {
              const trainingNeedsfileslist = removelocalFileData(data.local_files_to_delete, trainingNeedsFiles)
              setTrainingNeedsFiles(trainingNeedsfileslist ?? [])
            }

            if (data.documents_to_delete.length > NUMBERMAP.ZERO) {
              setTrainingNeedsFiles((prev) =>
                prev.filter(
                  (file) =>
                    ![...data.documents_to_delete].includes(
                      getFileId(file)
                    )
                )
              )
            }
          }}
          initialData={editingTrainingNeed}
          onClose={() => {
            setTrainingModal(false)
            setEditingTrainingNeed(null)
          }}
          onSave={(formData) => handleTrainingNeedsUA(formData)}
        />
      </CommonModal>

      <CommonModal
        onClose={() => {
          setAdminReportsModal(false)
          setEditingAdministrativeReport(null)
        }}
        open={adminReportsModal}
        title={EMPLOYEE_UI_CONSTANTS.ADMIN_REPORTS_TO_TITLE}
      >
        <AdministrativeReportsModal
          hasEditPermission={hasEditPermission}
          isOpen={adminReportsModal}
          onClose={() => {
            setAdminReportsModal(false)
            setEditingAdministrativeReport(null)
          }}
          onSave={handleAddAdministrativeReport}
          sites={fetchSites?.data ?? []}
          administrativeReportsTo={administrativeReportsTo}
          initialData={editingAdministrativeReport}
        />
      </CommonModal>
    </FormContainer>
  )
}

export default AddEmployeeForm
