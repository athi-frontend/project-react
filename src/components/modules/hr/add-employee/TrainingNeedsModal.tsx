'use client'
import React, { useRef } from 'react'
import GenericModal from './GenericModal'
import { useSkillDropDown, useSourceDropDown } from '@/hooks/modules/hr/useEmployeeList'
import { FileData } from '@/types/components/ui/fileUploadV3'
import {
  CREATE_MODE,
  FIELD_ATTRIBUTESTRAININGNEEDS,
  TRAINING_NEEDS_TABLE_COLUMNS,
  EMPLOYEE_TRAINING_NEEDS_CONTAINER,
} from '@/constants/modules/hr/employeeList'

interface TrainingNeed {
  id?: number
  skill: string
  skill_name?: string
  skill_id?: number
  fk_eqms_hr_skill_master_id?: number
  dateOfJoining: string
  target_date?: string
  status: string
  source?: string
  source_id?: number
  fk_eqms_hr_employee_source_lk_id?: number
  training_supporting_files?: any[]
  employee_training_needs_id?: string
}

interface TrainingNeedsProps {
  hasEditPermission?:boolean,
  onClose: () => void
  onSave?: (formData: Record<string, string | string[]>) => void
  initialData?: TrainingNeed | null
  documents?: any
  handleFileUpload?: (file: FileData) => void
  handleFileEdit?: (file: FileData) => void
  handleFileSubmit?: (data: any) => void
  mode: string
  trainingNeedsFinalData: any
}

const TrainingNeeds: React.FC<TrainingNeedsProps> = ({
  hasEditPermission,
  mode,
  onClose,
  onSave,
  initialData,
  documents,
  handleFileUpload,
  handleFileEdit,
  handleFileSubmit,
  trainingNeedsFinalData,
}) => {
  const trainingNeedsRef = useRef(null)
  const { data: skillOptions } = useSkillDropDown()
  const { data: sourceOptions } = useSourceDropDown()
  const fields = [
    {
      label: FIELD_ATTRIBUTESTRAININGNEEDS.SKILL.label,
      placeholder: FIELD_ATTRIBUTESTRAININGNEEDS.SKILL.placeholder,
      type: 'dropdown' as const,
      options: skillOptions?.data ?? [],
      keyField: FIELD_ATTRIBUTESTRAININGNEEDS.SKILL.keyField,
      valueField: FIELD_ATTRIBUTESTRAININGNEEDS.SKILL.valueField,
      fieldKey: 'skill',
      required: true,
      ...(mode !== CREATE_MODE && {
        dataSourceName: TRAINING_NEEDS_TABLE_COLUMNS.ID.dataSourceName,
        dataFieldName: TRAINING_NEEDS_TABLE_COLUMNS.ID.dataFieldName,
      }),
    },
    {
      label: FIELD_ATTRIBUTESTRAININGNEEDS.SOURCE.label,
      placeholder: FIELD_ATTRIBUTESTRAININGNEEDS.SOURCE.placeholder,
      type: 'dropdown' as const,
      options: sourceOptions?.data ?? [],
      keyField: FIELD_ATTRIBUTESTRAININGNEEDS.SOURCE.keyField,
      valueField: FIELD_ATTRIBUTESTRAININGNEEDS.SOURCE.valueField,
      fieldKey: 'source',
      required: false,
      ...(mode !== CREATE_MODE && {
        dataSourceName: TRAINING_NEEDS_TABLE_COLUMNS.SOURCE.dataSourceName,
        dataFieldName: TRAINING_NEEDS_TABLE_COLUMNS.SOURCE.dataFieldName,
      }),
    },
    {
      label: FIELD_ATTRIBUTESTRAININGNEEDS.TARGET_DATE.label,
      placeholder: FIELD_ATTRIBUTESTRAININGNEEDS.TARGET_DATE.placeholder,
      type: 'date' as const,
      fieldKey: 'dateOfJoining',
      required: true,
      ...(mode !== CREATE_MODE && {
        dataSourceName: TRAINING_NEEDS_TABLE_COLUMNS.TARGET_DATE.dataSourceName,
        dataFieldName: TRAINING_NEEDS_TABLE_COLUMNS.TARGET_DATE.dataFieldName,
      }),
    },
  ]

  // Convert TrainingNeed to Record<string, string | string[]>
  const initialFormData: Record<string, string | string[]> = {
    skill:
      initialData?.skill_id?.toString() ??
      initialData?.fk_eqms_hr_skill_master_id?.toString() ??
      initialData?.skill?.toString() ??
      '',
    skill_name: initialData?.skill_name ?? '',
    skill_id:
      initialData?.skill_id?.toString() ??
      initialData?.fk_eqms_hr_skill_master_id?.toString() ??
      initialData?.skill?.toString() ??
      '',
    dateOfJoining: initialData?.dateOfJoining ?? initialData?.target_date ?? '',
    status: initialData?.status ?? '',
    source:
      initialData?.source_id?.toString() ??
      initialData?.fk_eqms_hr_employee_source_lk_id?.toString() ??
      initialData?.source?.toString() ??
      '',
    source_id:
      initialData?.source_id?.toString() ??
      initialData?.fk_eqms_hr_employee_source_lk_id?.toString() ??
      initialData?.source?.toString() ??
      '',
    employee_training_needs_id: initialData?.employee_training_needs_id ?? '',
  }

  const handleSave = (formData: Record<string, string | string[]>) => {
    // Always call onSave with the form data - let the parent component handle the API call
    onSave?.(formData)
  }

  return (
    <GenericModal
      hasEditPermission = {hasEditPermission}
      onClose={onClose}
      onSave={handleSave}
      documents={documents}
      handleFileUpload={handleFileUpload}
      handleFileEdit={handleFileEdit}
      handleFileSubmit={(e) => {
        handleFileSubmit?.(e)
      }}
      fields={fields}
      initialFormData={initialFormData}
      ref={trainingNeedsRef}
      id={EMPLOYEE_TRAINING_NEEDS_CONTAINER}
    />
  )
}

export default TrainingNeeds
