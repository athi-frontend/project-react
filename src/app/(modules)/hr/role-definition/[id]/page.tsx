'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Button, Grid2 } from '@mui/material'
import {
  InputField,
  ButtonGroup,
  DataGridTable,
  showActionAlert,
  ActionButton,
  Description,
  Label,
} from '@/components/ui'
import {
  SkillSetContainer,
  SkillSetHeader,
  SkillSetTitle,
} from '@/styles/modules/dnd/competencySkill'
import {
  SkillData,
  FormData,
  FormErrors,
  Option,
  EmploymentTypeOption,
} from '@/types/modules/hr/roleDefinition'
import AddIcon from '@mui/icons-material/Add'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import AddSkillPopupForm from '@/components/modules/hr/role-definition/SkillForm'
import { useParams, useRouter } from 'next/navigation'
import {
  useRoles,
  useDepartment,
  useGetCompetencySkillByRoleId
} from '@/hooks/modules/hr/useRoleDefinition'
import { useEmploymentTypes } from '@/hooks/useCommonDropdown'
import { useRecordGenerationHelper } from '@/hooks/modules/hr/useRecordGeneration'
import {
  STATUS_ACTIVE,
  TABLE_COLUMNS,
  DATA_SOURCE_NAMES,
  DATA_FIELD_NAMES,
  NAME,
  ID,
  EMPLOYMENT_ID,
  EMPLOYMENT_TYPE,
  SKILL_NAME,
  SKILL_HEADER_NAME,
  SKILL_HEADER_SNO,
  SKILL_HEADER_LEVEL,
  SKILL_FIELD_NAME,
  SKILL_FIELD_ACTION,
  SKILL_HEADER_ACTION,
  SKILL_TITLE_ADD,
  SKILL_TITLE_EDIT,
  MAIN_RUOTE,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  BUTTON_LABELS,
  BUTTON_VARIANTS,
  CONTAINER_ID,
  EDUCATIONAL_QUALIFICATION_ERROR,
  CONTAINER_ID_SKILL,
  DELETE_DATA_GRID,
  CREATE,
  SKILL_SET_ERR,
  AT_LEAST_ONE_SKILL_REQUIRED,
  ALERT_MESSAGES,
  CUSTOM_ALERT,
  ID_NUMBER,
  S_NO,
  TEXT_DATA,
  TRUE_VALUE,
  NUMBER,
  SKILL_POPUP_TITLES,
  ALERT_TEXT
} from '@/constants/modules/hr/roleDefinition'
import {
  DEFAULT_FORM_DATA,
  validateCompetencyForm,
  validateSkill,
} from '@/lib/modules/hr/roleDefinition'
import { DELETE, SUCCESS } from '@/constants/modules/dnd/pnd'
import { magicFormSave, magicGridRowSave } from '@/lib/utils/magicSave'
import magicSaveConstants from '@/constants/magicSave'
import { NUMBERMAP } from '@/constants/common'
import { CommonInlineStyles, ErrorText, ICON_SIZE } from '@/styles/common'
import { COMMON_CONSTANTS, numberValidation } from '@/lib/utils/common'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
*Classification : Confidential
**/

const { ACTIVE_STATUS,UPDATE,SUCCESS_ALERT,FAILED_ALERT,INSERT } = COMMON_CONSTANTS

const AddCompetencySkill: React.FC = () => {
  const router = useRouter()
  const formRef = useRef<HTMLElement>(null)
  const params = useParams()
  const roleId = params.id as string
  const isEditMode = (roleId !== CREATE && roleId !== 'draft')

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [skillModal, setSkillModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null)
  const [skillData, setSkillData] = useState<SkillData[]>([])
  const [skillSetError, setSkillSetError] = useState<string | null>(null)
  const [roleOptions, setRoleOptions] = useState<Option[]>([])
  const [departmentOptions, setDepartmentOptions] = useState<Option[]>([])
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<
    EmploymentTypeOption[]
  >([])
  const [competencySkillId, setCompetencySkillId] = useState<string | null>(
    null
  )
  const [isSavingSkill, setIsSavingSkill] = useState(false)
  const [deletingSkillId, setDeletingSkillId] = useState<number | null>(null)
  
  // Record generation hook
  const { generateDocumentFromSaveResponse } = useRecordGenerationHelper()

  const { draftSave, clearDraftSave, isDraftSaving ,draftData, fetchDraft,checkUnsavedDraftBeforeLeave} = useDraftSave({
    context_type: 'role_definition',
    context_instance_id: isEditMode?roleId:null,
    enableFetch: false
  })
 
  const {
    data: rolesData,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useRoles()
  const {
    data: departmentData,
    isLoading: departmentLoading,
    isError: departmentError,
  } = useDepartment()
  const {
    data: employmentTypesData,
    isLoading: employmentTypesLoading,
    isError: employmentTypesError,
  } = useEmploymentTypes(STATUS_ACTIVE)
  const {
    data: competencyData,
    isLoading: competencyLoading,
    refetch,
  } = useGetCompetencySkillByRoleId(isEditMode ? roleId : '')

  useEffect(() => {
    if (rolesData?.data) {
      setRoleOptions(
        rolesData.data.map((role: any) => ({
          id: role.role_id?.toString() ?? '',
          name: role.role_name ?? '',
        }))
      )
    }
  }, [rolesData, rolesError])

  useEffect(() => {
    if (Number(roleId)) {
      refetch()
    }
  }, [roleId])
  useEffect(() => {
    if (departmentData?.data) {
      setDepartmentOptions(
        departmentData.data.map((dept: any) => ({
          id: dept.department_id?.toString() ?? '',
          name: dept.department_name ?? '',
        }))
      )
    }
  }, [departmentData])

  useEffect(() => {
    if (employmentTypesData?.data) {
      const options = employmentTypesData?.data.map((type: any) => ({
        type_of_employment_id: type.type_of_employment_id?.toString() ?? '',
        employment_type: type.employment_type ?? '',
      }))
      setEmploymentTypeOptions(options)
    }
  }, [employmentTypesData, employmentTypesLoading, employmentTypesError])

  useEffect(() => {
    fetchDraft()
  }, [])

  const updateFormData = (rolesDefinition: any) => {
    if (!rolesDefinition) return
    const getCompetencySkill = () => rolesDefinition
 
    const getSkillDataFromResponse = (competencySkill: any) =>
      competencySkill?.role_definition_skill_level_mapper ?? competencySkill?.skillData ?? []
 
    const populateFormData = (competencySkill: any): FormData => (isEditMode?{
      role: competencySkill.role_id?.toString() ?? '',
      employmentType: competencySkill.employment_type_id?.toString() ?? '',
      department: competencySkill.department_id?.toString() ?? '',
      reportsTo: competencySkill.report_to_role_id?.toString() ?? '',
      education: competencySkill.educational_qualification ?? '',
      experience: competencySkill.experience ?? '',
      jobResponsibilities: competencySkill.job_responsibilities ?? '',
      expertise: competencySkill.area_of_expertise ?? '',
      training: competencySkill.training_and_certifications_details ?? '',
      additionalResponsibility: competencySkill.additional_responsibility ?? '',
    }:rolesDefinition)
 
    const getUniqueSkillData = (skillData: any[]) => {
      const uniqueSkills = new Map<string, any>()
      skillData.forEach((skill: any) => {
        const key = `${skill.skill_id}-${skill.skill_level}`
        if (!uniqueSkills.has(key)) {
          uniqueSkills.set(key, skill)
        }
      })
 
      return Array.from(uniqueSkills.values()).map(
        (skill: any, index: number) => ({
          id: (index + 1).toString(),
          skill_level_mapper_id: skill.skill_level_mapper_id,
          skillId: skill.skill_id,
          skillName: skill.skill_name,
          levelName: skill.skill_level,
          levelId: skill.skill_level_id,
        })
      )
    }
    const competencySkill = getCompetencySkill()
    if (!competencySkill) return
    setCompetencySkillId(
      competencySkill.id?.toString() ??
        competencySkill.role_definition_id?.toString()
    )
    const skillDataFromResponse = getSkillDataFromResponse(competencySkill)
    setFormData(populateFormData(competencySkill))
    setSkillData(isEditMode?getUniqueSkillData(skillDataFromResponse):skillDataFromResponse)
  }

  useEffect(() => {
    if (draftData?.data) {
      if(draftData.data?.role_definition_id !== 'draft'){
        setFormData(draftData?.data??{})
        setSkillData(draftData?.data?.skillData??[])
        setCompetencySkillId(draftData?.data?.role_definition_id??null)
      }else{
      updateFormData(draftData.data)
      }
    }
  }, [draftData])
  useEffect(() => {
    if (!isEditMode || !competencyData || competencyLoading) return
    
    const competencyDatalist = competencyData.eqms_hr_role_definition?.[NUMBERMAP.ZERO] ??competencyData.data?.[NUMBERMAP.ZERO] ?? {}
    if(Object.keys(competencyDatalist).length > 0 && !draftData?.data){
      updateFormData(competencyDatalist)
    }
  }, [isEditMode, competencyData, competencyLoading])


  useEffect(() => {
    // Clear skill set error when skillData changes and is not empty
    if (skillData.length > NUMBERMAP.ZERO) {
      setSkillSetError(null)
    }
  }, [skillData])
  const handleDraftSave = (formData: FormData, skillData: SkillData[]) => {
    const payload = {
      id: competencySkillId ?? new Date().getTime(),
      ...formData,
      role_definition_id:competencySkillId ?? 'draft',
      skillData: skillData,
      type: 'draft',
      status: NUMBERMAP.ONE
    }
    
    draftSave({
      form_type: 'role_definition',
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === FORM_FIELD_NAMES.EXPERIENCE) {
      if (!numberValidation.test(value) && value !== '') return
      setFormData((prev) => {
        const updated = { ...prev, [field]: value.trim() }
       
        handleDraftSave(updated, skillData)
        
        return updated
      })
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value }
        
        handleDraftSave(updated, skillData)
        
        return updated
      })
    }

    if (field === FORM_FIELD_NAMES.EDUCATION) {
      const error = numberValidation.test(value)
        ? EDUCATIONAL_QUALIFICATION_ERROR
        : ''
      setErrors((prev) => ({ ...prev, [field]: error }))
      return
    }

    if (value) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }
 
  const handleSave = async () => {
    // Clear draft save when submitting final form
    clearDraftSave();
    
    // Trim extra spaces from specific fields before validation and saving
    const trimmedFormData = {
      ...formData,
      education: formData.education.trim(),
      jobResponsibilities: formData.jobResponsibilities.trim(),
      expertise: formData.expertise.trim(),
      training: formData.training.trim(),
      additionalResponsibility: formData.additionalResponsibility.trim(),
    };
 
    const newErrors = validateCompetencyForm(trimmedFormData)
 
    // Validate that at least one skill is present in the skillData array
    if (skillData.length === NUMBERMAP.ZERO) {
      setSkillSetError(SKILL_SET_ERR)
      newErrors.skills = AT_LEAST_ONE_SKILL_REQUIRED
    }
 
    setErrors(newErrors)
 
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      return
    }
 
    const parsedCompetencySkillId = competencySkillId
      ? parseInt(competencySkillId, NUMBERMAP.TEN)
      : NUMBERMAP.ZERO
    const keys =
      isEditMode && parsedCompetencySkillId
        ? {
            [DATA_SOURCE_NAMES.COMPETENCY_SKILL]: {
              id: parsedCompetencySkillId,
            },
            [DATA_SOURCE_NAMES.SKILL_LEVEL_MAPPER]: {
              [DATA_FIELD_NAMES.COMPETENCY_SKILL_ID]: parsedCompetencySkillId,
            },
          }
        : {}
      
    const otherParamsBag =
      isEditMode && parsedCompetencySkillId
        ? {
            [DATA_SOURCE_NAMES.SKILL_LEVEL_MAPPER]: [
              {
                [DATA_FIELD_NAMES.COMPETENCY_SKILL_ID]: parsedCompetencySkillId,
              },
            ],
          }
        : {
            [DATA_SOURCE_NAMES.COMPETENCY_SKILL]: [
              {
                [DATA_FIELD_NAMES.STATUS]: ACTIVE_STATUS,
              },
            ],
            [DATA_SOURCE_NAMES.SKILL_LEVEL_MAPPER]: [
              {
                [DATA_FIELD_NAMES.STATUS]: ACTIVE_STATUS,
              },
            ],
          }
 
    const response = await magicFormSave({
      currentFormRef: formRef,
      dataframeworkOperatorType: isEditMode ? UPDATE : INSERT,
      diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
      dataframeworkOtherParamsBag: otherParamsBag,
      keys: keys,
    })
 
    if (
      response?.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
    ) {
      // Generate document after successful save
      if (response?.response?.data) {
        generateDocumentFromSaveResponse(response.response.data)
      }
      
      setFormData(DEFAULT_FORM_DATA)
      setSkillData([])
      setErrors({})
      setSkillSetError(null)
      showActionAlert(SUCCESS)
      router.push(MAIN_RUOTE)
    } else if (
      response?.response?.code ===
      NUMBERMAP.FIVEHUNDRED + NUMBERMAP.NINE
    ) {
      customErrorMessage()
    } else {
      customErrorMessage()
    }
  }
 
  const customErrorMessage = () => {
     showActionAlert(CUSTOM_ALERT, ALERT_MESSAGES.DUPLICATE_ROLE_DEFINITION);
  }
 
  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(MAIN_RUOTE)
    setFormData(DEFAULT_FORM_DATA)
    setSkillData([])
    setErrors({})
    setSkillSetError(null)
  }
 
  const handleAddSkill = () => {
    setEditingSkill(null)
    setSkillModal(true)
  }
 
  const handleEditSkill = (skill: SkillData) => {
    const originalSkill = skillData.find((s) => s.id === skill.id)
    if (originalSkill) {
      setEditingSkill(originalSkill)
      setSkillModal(true)
    }
  }
 
 
  // Helper to get the next unique temp id for new skills
  const getNextTempSkillId = () => {
    let idx = NUMBERMAP.ONE;
    while (skillData.some(skill => skill.id === `temp-${idx}`)) {
      idx++;
    }
    return `temp-${idx}`;
  }
 
  const handleSaveSkill = (newSkill: { skillId: number; skillName: string; levelId: number; levelName: string; }) => {
    if (isSavingSkill) {
      return
    }
    setIsSavingSkill(true)
 
    const validationError = validateSkill(newSkill, skillData, editingSkill)
    if (validationError) {
      setIsSavingSkill(false)
      return
    }
 
    const skillDataEntry: SkillData = {
      id: editingSkill ? editingSkill.id : getNextTempSkillId(),
      skill_level_mapper_id: editingSkill ? editingSkill.skill_level_mapper_id : NUMBERMAP.ZERO,
      skillId: newSkill.skillId,
      skillName: newSkill.skillName,
      levelId: newSkill.levelId,
      levelName: newSkill.levelName,
      status: ACTIVE_STATUS,
    }
 
    setSkillData((prev) => {
      const updated = editingSkill
        ? prev.map((skill) =>
            skill.id === editingSkill.id ? skillDataEntry : skill
          )
        : [...prev, skillDataEntry]
      

        handleDraftSave(formData, updated)
      return updated
    })
 
    setSkillModal(false)
    setEditingSkill(null)
    setIsSavingSkill(false)
  }
 
const handleDeleteSkill = async (e: React.MouseEvent, row: any) => {
  const skillId =  row.skill_level_mapper_id!=NUMBERMAP.ZERO ?row.skill_level_mapper_id: row.id;
  const currentTarget = e.currentTarget as HTMLElement;
  if (!skillId) {
    showActionAlert(FAILED_ALERT);
    return;
  }

  setDeletingSkillId(skillId);
  const result = await showActionAlert(DELETE);

  if (!result.isConfirmed) {
    resetDeletingSkillId();
    return;
  }

  if (!isEditMode || row.skill_level_mapper_id==NUMBERMAP.ZERO) {
    deleteLocalSkill(skillId);
    return;
  }

  if (row.skill_level_mapper_id === null) {
    showActionAlert(FAILED_ALERT);
    resetDeletingSkillId();
    return;
  }

  await deleteSkillFromServer(row, currentTarget);
};

const resetDeletingSkillId = () => setDeletingSkillId(null);

const deleteLocalSkill = (skillId: number | string) => {
  setSkillData((prev) => {
    const updated = prev.filter((skill) => skill.id !== skillId.toString());
      handleDraftSave(formData, updated);
    return updated;
  });
  showActionAlert(SUCCESS_ALERT);
  resetDeletingSkillId();
};

const deleteSkillFromServer = async (row: any, currentTarget: HTMLElement) => {
  currentTarget.setAttribute(magicSaveConstants.DATA_STATUS, NUMBERMAP.ZERO.toString());

  try {
    const response = await magicGridRowSave({
      containerID: CONTAINER_ID_SKILL,
      scopedEvents: currentTarget,
      eventClass: DELETE_DATA_GRID,
      dataframeworkOperatorType: UPDATE,
      dataframeworkOtherParamsBag: {},
      keys: {
        eqms_hr_role_definition_skill_level_mapper: {
          id: row.skill_level_mapper_id,
        },
      },
      diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
    });
    if (response?.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE) {
      setSkillData((prev) => {
        const updated = prev.filter((skill) => skill.skill_level_mapper_id !== row.skill_level_mapper_id);
        handleDraftSave(formData, updated);
        return updated;
      });
      showActionAlert(SUCCESS_ALERT);
    } else {
      showActionAlert(FAILED_ALERT);
    }
  } catch(error) {
    showActionAlert(CUSTOM_ALERT, {
        title: ALERT_TEXT.ALERT_TITLE,
        text: error instanceof Error ? error.message : ALERT_TEXT.TEXT_CONSTANT,
        icon: ALERT_TEXT.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
  } finally {
    resetDeletingSkillId();
  }
};

 
  const columns = TABLE_COLUMNS.map((field) => {
    if (field === ID_NUMBER) {
      return {
        field: S_NO,
        headerName: SKILL_HEADER_SNO,
        width: NUMBERMAP.TWOHUNDRED,
        flex: NUMBERMAP.ONE
      }
    } else if (field === SKILL_NAME) {
      return {
        field: SKILL_NAME,
        headerName: SKILL_HEADER_NAME,
        width: NUMBERMAP.TWOFIFTY,
       flex: NUMBERMAP.ONE,
        renderCell: (params: any) => (
          <div>
            <input
              type={TEXT_DATA}
              value={params.row.skillId}
              readOnly
              style={CommonInlineStyles.displayNone}
              {
  ...(!isEditMode
    ? {
        'data-sourcename': DATA_SOURCE_NAMES.SKILL_LEVEL_MAPPER,
        'data-fieldname': DATA_FIELD_NAMES.SKILL_MASTER_ID,
        'data-is-grid': TRUE_VALUE,
      }
    : {})
}
 
            />
            {params.value}
          </div>
        ),
      }
    } else if (field === SKILL_HEADER_LEVEL.toLowerCase()) {
      return {
        field: SKILL_FIELD_NAME,
        headerName: SKILL_HEADER_LEVEL,
        width: NUMBERMAP.FOURHUNDRED,
        flex: NUMBERMAP.ONE,
        renderCell: (params: any) => (
          <div>
            <input
              type={TEXT_DATA}
              value={params.row.levelId}
              readOnly
              style={CommonInlineStyles.displayNone}
              {
    ...(!isEditMode
      ? {
          'data-sourcename': DATA_SOURCE_NAMES.SKILL_LEVEL_MAPPER,
          'data-fieldname': DATA_FIELD_NAMES.SKILL_LEVEL_LK_ID,
          'data-is-grid': TRUE_VALUE,
        }
      : {})
  }
 
            />
            {params.row.levelName}
          </div>
        ),
      }
    } else if (field === SKILL_HEADER_ACTION) {
      return {
        field,
        headerName: SKILL_FIELD_ACTION,
        width: NUMBERMAP.TWOHUNDRED,
        flex: NUMBERMAP.HALF,
        renderCell: (params: any) => (
         
          <div className='data-grid-delete'>
            <ActionButton
            onEdit={() => handleEditSkill(params.row)}
            onDelete={(e) => handleDeleteSkill(e, params.row)}
             value={params.row.status?.toString() ?? NUMBERMAP.ZERO.toString()}
            deleteButtonProps={{className: 'data-grid-delete'}}
           {...((!isEditMode) || (isEditMode && deletingSkillId === params.row.skill_level_mapper_id) ? {
            dataSourceName: DATA_SOURCE_NAMES.SKILL_LEVEL_MAPPER,
            dataFieldName: DATA_FIELD_NAMES.STATUS,
            dataStatus: params.row.status?.toString() ?? NUMBERMAP.ZERO.toString(),
          } : {})}
          />
          </div>
        ),
      }
    }
    return { field, headerName: field, width: NUMBERMAP.TWOHUNDRED }
  })
 
  const initialData = useMemo(
    () =>
      editingSkill
        ? {
            skill_level_mapper_id: editingSkill.skill_level_mapper_id,
            skillId: editingSkill.skillId,
            skillName: editingSkill.skillName,
            levelId: editingSkill.levelId,
            levelName: editingSkill.levelName,
          }
        : undefined,
    [editingSkill]
  )
 
  // Compute skill IDs to exclude from dropdown
  const excludeSkillIds = useMemo(() => {
    if (editingSkill) {
      // Exclude all except the one being edited
      return skillData.filter(s => s.id !== editingSkill.id).map(s => Number(s.skillId))
    }
    return skillData.map(s => Number(s.skillId))
  }, [skillData, editingSkill])
 
  return (
    <FormContainer ref={formRef} id={CONTAINER_ID}>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <GlobalLoader loading={competencyLoading} />
        <Label title={isEditMode ? SKILL_TITLE_EDIT : SKILL_TITLE_ADD} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.ROLE}
                placeholder={FORM_PLACEHOLDERS.ROLE}
                isDropdown={true}
                value={formData.role}
                keyField={ID}
                valueField={NAME}
                onChange={(value: string) =>
                  handleInputChange(FORM_FIELD_NAMES.ROLE, value)
                }
                error={errors.role}
                options={roleOptions}
                disabled={rolesLoading ?? rolesError}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.ROLES_LK_ID}
                dataIsAutocomplete={formData.role}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.EMPLOYMENT_TYPE}
                placeholder={FORM_PLACEHOLDERS.EMPLOYMENT_TYPE}
                isDropdown={true}
                value={formData.employmentType}
                keyField={EMPLOYMENT_ID}
                valueField={EMPLOYMENT_TYPE}
                onChange={(value: string) =>
                  handleInputChange(FORM_FIELD_NAMES.EMPLOYMENT_TYPE, value)
                }
                error={errors.employmentType}
                options={employmentTypeOptions}
                disabled={employmentTypesLoading ?? employmentTypesError}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.EMPLOYMENT_TYPE_LK_ID}
                dataIsAutocomplete={formData.employmentType}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.DEPARTMENT}
                placeholder={FORM_PLACEHOLDERS.DEPARTMENT}
                isDropdown={true}
                value={formData.department}
                keyField={ID}
                valueField={NAME}
                onChange={(value: string) =>
                  handleInputChange(FORM_FIELD_NAMES.DEPARTMENT, value)
                }
                error={errors.department}
                options={departmentOptions}
                disabled={departmentLoading ?? departmentError}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.ORGANIZATION_DEPARTMENT_ID}
                dataIsAutocomplete={formData.department}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.REPORTS_TO}
                placeholder={FORM_PLACEHOLDERS.REPORTS_TO}
                isDropdown={true}
                value={formData.reportsTo}
                keyField={ID}
                valueField={NAME}
                onChange={(value: string) =>
                  handleInputChange(FORM_FIELD_NAMES.REPORTS_TO, value)
                }
                error={errors.reportsTo}
                options={roleOptions}
                disabled={rolesLoading ?? rolesError}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.REPORTS_TO_ROLE_ID}
                dataIsAutocomplete={formData.reportsTo}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.EDUCATION}
                placeholder={FORM_PLACEHOLDERS.EDUCATION}
                value={formData.education}
                onChange={(value: string) =>
                  handleInputChange(FORM_FIELD_NAMES.EDUCATION, value)
                }
                error={errors.education}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.EDUCATIONAL_QUALIFICATION}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.EXPERIENCE}
                placeholder={FORM_PLACEHOLDERS.EXPERIENCE}
                value={formData.experience}
                onChange={(value: string) =>
                  handleInputChange(FORM_FIELD_NAMES.EXPERIENCE, value)
                }
                error={errors.experience}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.EXPERIENCE}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={FORM_LABELS.JOB_RESPONSIBILITIES}
                value={formData.jobResponsibilities}
                onChange={(value) =>
                  handleInputChange(
                    FORM_FIELD_NAMES.JOB_RESPONSIBILITIES,
                    value
                  )
                }
                error={errors.jobResponsibilities}
                placeholder={FORM_PLACEHOLDERS.JOB_RESPONSIBILITIES}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.JOB_RESPONSIBILITIES}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={FORM_LABELS.EXPERTISE}
                value={formData.expertise}
                onChange={(value) =>
                  handleInputChange(FORM_FIELD_NAMES.EXPERTISE, value)
                }
                error={errors.expertise}
                placeholder={FORM_PLACEHOLDERS.EXPERTISE}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.AREA_OF_EXPERTISE}
              />
            </Grid2>
 
            <input
              type= {NUMBER}
              value={STATUS_ACTIVE}
              style={CommonInlineStyles.displayNone}
              readOnly
            />
          </Grid2>
 
          <SkillSetContainer>
            <SkillSetHeader>
              <SkillSetTitle>Skill Set*</SkillSetTitle>
              <Button variant="outlined" onClick={handleAddSkill}>
                <AddIcon sx={ICON_SIZE} />
                Add New
              </Button>
            </SkillSetHeader>
            <DataGridTable
              rows={skillData}
              columns={columns}
              idField={ID}
              hideFooter={true}
            />
            {skillSetError && <ErrorText>{skillSetError}</ErrorText>}
          </SkillSetContainer>
 
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={FORM_LABELS.TRAINING}
                value={formData.training}
                onChange={(value) =>
                  handleInputChange(FORM_FIELD_NAMES.TRAINING, value)
                }
                error={errors.training}
                placeholder={FORM_PLACEHOLDERS.TRAINING}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.TRAINING_AND_CERTIFICATIONS}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={FORM_LABELS.ADDITIONAL_RESPONSIBILITY}
                value={formData.additionalResponsibility}
                onChange={(value) =>
                  handleInputChange(
                    FORM_FIELD_NAMES.ADDITIONAL_RESPONSIBILITY,
                    value
                  )
                }
                error={errors.additionalResponsibility}
                placeholder={FORM_PLACEHOLDERS.ADDITIONAL_RESPONSIBILITY}
                dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
                dataFieldName={DATA_FIELD_NAMES.ADDITIONAL_RESPONSIBILITY}
              />
            </Grid2>
          </Grid2>
 
          <ButtonGroup
            buttons={[
              {
                label: BUTTON_LABELS.CANCEL,
                onClick: handleCancel,
                variant: BUTTON_VARIANTS.OUTLINED,
              },
              {
                label: BUTTON_LABELS.SAVE,
                onClick: handleSave,
                variant: BUTTON_VARIANTS.CONTAINED,
              },
            ]}
          />
        </FormContent>
      </FormWrapper>
      <CommonModal
        open={skillModal}
        onClose={() => {
          setSkillModal(false)
          setEditingSkill(null)
          setIsSavingSkill(false)
        }}
        title={editingSkill ? SKILL_POPUP_TITLES.EDIT : SKILL_POPUP_TITLES.ADD}
      >
        <AddSkillPopupForm
          onClose={() => {
            setSkillModal(false)
            setEditingSkill(null)
            setIsSavingSkill(false)
          }}
          isEditSkill={editingSkill}
          isEditMode={isEditMode}
          onSave={handleSaveSkill}
          initialData={initialData}
          existingSkills={excludeSkillIds}
          role_definition_id={competencySkillId!= 'draft'?competencySkillId:null}
        />
      </CommonModal>
    </FormContainer>
  )
}
 
export default AddCompetencySkill