'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Grid2 } from '@mui/material'
import { ButtonGroup, InputField, showActionAlert } from '@/components/ui'
import { ContentWrapper } from '@/styles/modules/dnd/feasibilityStudy'
import {
  AddSkillFormData,
  AddSkillFormErrors,
} from '@/types/modules/hr/roleDefinition'
import {
  useSkillLevels,
  useSkills,
} from '@/hooks/modules/hr/useRoleDefinition'
import { NUMBERMAP } from '@/constants/common'
import {
  INITIAL_SKILL_FORM_DATA,
  INITIAL_SKILL_ERRORS,
  FORM_FIELD_NAMES,
  BUTTON_LABELS,
  SKILL_FORM_REQUIRED_MESSAGES,
  SKILL_FORM_LABELS,
  SKILL_FORM_PLACEHOLDERS,
  SKILL_FORM_KEY_VALUE,
  CONTAINER_ID_SKILL,
  DATA_SOURCE_NAMES,
  DATA_FIELD_NAMES,
  UPDATE,
  TRUE_VALUE,
} from '@/constants/modules/hr/roleDefinition'
import { magicFormSave } from '@/lib/utils/magicSave'
import magicSaveConstants from '@/constants/magicSave'
import { SUCCESS } from '@/constants/modules/dnd/pnd'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
const { SKILL_LABEL, LEVEL_LABLE } = SKILL_FORM_LABELS
const { SKILL_PLACEHOLDER, LEVEL_PLACEHOLDER } = SKILL_FORM_PLACEHOLDERS
const { SKILL_ID, SKILL_NAME, SKILL_LEVEL, SKILL_LEVEL_ID } =
  SKILL_FORM_KEY_VALUE

interface AddSkillPopupFormProps {
  onClose: () => void
  onSave: (data: AddSkillFormData) => void
  initialData?: AddSkillFormData
  existingSkills: number[]
  isEditMode?: boolean
  isEditSkill?: boolean
  role_definition_id?: string
}

const AddSkillPopupForm: React.FC<AddSkillPopupFormProps> = ({
  onClose,
  onSave,
  initialData,
  existingSkills,
  isEditMode,
  isEditSkill,
  role_definition_id
}) => {
  const [formData, setFormData] = useState<AddSkillFormData>(
    INITIAL_SKILL_FORM_DATA
  )
  const [errors, setErrors] = useState<AddSkillFormErrors>(INITIAL_SKILL_ERRORS)
 const formRef = useRef<HTMLElement>(null)
 

  const {
    data: skills,
    isLoading: skillsLoading,
    isError: skillsError,
    refetch
  } = useSkills()
  const {
    data: skillLevels,
    isLoading: levelsLoading,
    isError: levelsError,
  } = useSkillLevels()

  const levelOptions = useMemo(
    () =>
       skillLevels?.map((level: any) => ({
        skill_level_id: level.skill_level_id.toString(),
        skill_level: `Level ${level.skill_level}`,
      })) ?? [],
    [skillLevels]
  )

  // Filter skills for dropdown: exclude already-added skills, except the one being edited
  const filteredSkills = useMemo(() => {
    if (!skills?.data) return []
    // If editing, allow the current skillId
    const currentSkillId = initialData?.skillId
    return skills.data.filter((item: any) => {
      if (currentSkillId && item.skill_id === currentSkillId) return true
      return !existingSkills?.includes(item.skill_id)
    })
  }, [skills, existingSkills, initialData])

  useEffect(() => {
    refetch()
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData(INITIAL_SKILL_FORM_DATA)
      setErrors(INITIAL_SKILL_ERRORS)
    }
  }, [initialData])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (field === FORM_FIELD_NAMES.SKILL_ID) {
      const skillName = skills?.data.find(
         (item: any) => item.skill_id === Number(value)
      )?.skill_name
      setFormData((prev) => ({
        ...prev,
         [FORM_FIELD_NAMES.SKILL_ID]: Number(value),
        [FORM_FIELD_NAMES.SKILL_NAME]: skillName,
      }))
    } else if (field === FORM_FIELD_NAMES.LEVEL_ID) {
      const levelName = skillLevels?.find(
        (item: any) => item.skill_level_id === Number(value)
      )?.skill_level
      setFormData((prev) => ({
        ...prev,
        [FORM_FIELD_NAMES.LEVEL_ID]: Number(value),
        [FORM_FIELD_NAMES.LEVEL_NAME]: `Level ${levelName}`,
      }))
    }
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: AddSkillFormErrors = { ...INITIAL_SKILL_ERRORS }
    let isValid = true
          if (!formData.skillName || formData.skillId === NUMBERMAP.ZERO) {
      newErrors.skillId = SKILL_FORM_REQUIRED_MESSAGES.Skill
      isValid = false
    }

      if (!formData.levelName || formData.levelId === NUMBERMAP.ZERO) {
      newErrors.levelId = SKILL_FORM_REQUIRED_MESSAGES.Level
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }


const handleEditModeSave = async () => {
  const keys =
    initialData?.skill_level_mapper_id
      ? {
          eqms_hr_role_definition_skill_level_mapper: {
            id: initialData.skill_level_mapper_id,
          },
        }
      : {};

  try {
    const response = await magicFormSave({
      currentFormRef: formRef,
      dataframeworkOperatorType: isEditSkill ? UPDATE : COMMON_CONSTANTS.INSERT,
      diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
      dataframeworkOtherParamsBag: {
        "eqms_hr_role_definition_skill_level_mapper": [
          {
            fk_eqms_hr_role_definition_id: Number(role_definition_id),
            status: NUMBERMAP.ONE,
          },
        ],
      },
      keys: keys,
    });
    if ((response as any)?.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE) {
      showActionAlert(SUCCESS);
      onSave({
        skillId: formData.skillId,
        levelId: formData.levelId,
        skillName: formData.skillName,
        levelName: formData.levelName,
      });
      setFormData(INITIAL_SKILL_FORM_DATA);
      onClose();
    }
  } catch {
    showActionAlert(COMMON_CONSTANTS.FAILED_ALERT);
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  if (isEditMode) {
    await handleEditModeSave();
  } else {
    // Regular save for create mode
    onSave({
      skillId: formData.skillId,
      levelId: formData.levelId,
      skillName: formData.skillName,
      levelName: formData.levelName,
    });
    setFormData(INITIAL_SKILL_FORM_DATA);
    onClose();
  }
}

  return (
    <ContentWrapper>
      <Grid2 container spacing={1}  ref={formRef} id={CONTAINER_ID_SKILL}>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={SKILL_LABEL}
            placeholder={SKILL_PLACEHOLDER}
            isDropdown={true}
            value={formData.skillId.toString()}
            keyField={SKILL_ID}
            valueField={SKILL_NAME}
            onChange={(value: string) =>
              handleChange(FORM_FIELD_NAMES.SKILL_ID, value)
            }
            error={errors.skillId}
            options={filteredSkills}
            disabled={skillsLoading ?? skillsError}
            aria-required={TRUE_VALUE}
            dataSourceName={DATA_SOURCE_NAMES.SKILL_LEVEL_MAPPER}
            dataFieldName={DATA_FIELD_NAMES.SKILL_MASTER_ID}
            dataIsAutocomplete={formData.skillId.toString()}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={LEVEL_LABLE}
            placeholder={LEVEL_PLACEHOLDER}
            isDropdown={true}
            value={formData.levelId.toString()}
            keyField={SKILL_LEVEL_ID}
            valueField={SKILL_LEVEL}
            onChange={(value: string) =>
              handleChange(FORM_FIELD_NAMES.LEVEL_ID, value)
            }
            error={errors.levelId}
            options={levelOptions}
            disabled={levelsLoading ?? levelsError}
            aria-required="true"
            dataSourceName={DATA_SOURCE_NAMES.SKILL_LEVEL_MAPPER}
            dataFieldName={DATA_FIELD_NAMES.SKILL_LEVEL_LK_ID}
            dataIsAutocomplete={formData.levelId.toString()}
          />
        </Grid2>
      </Grid2>

      <ButtonGroup
        buttons={[
          { label: BUTTON_LABELS.CANCEL, onClick: onClose },
        { label: BUTTON_LABELS.SAVE, onClick: () => void handleSubmit() },
        ]}
      />
    </ContentWrapper>
  )
}

export default AddSkillPopupForm
