/**
 * Classification : Confidential
 **/

'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import { InputField, RichTextEditor } from '@/components/ui'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import {
  ContentWrapper,
  MODAL_STYLES,
  GRID_SIZE,
} from '@/styles/modules/dnd/verification'
import { SectionTitle } from '@/styles/components/modules/projectInfo'
import { NUMBERMAP } from '@/constants/common'
import dayjs, { Dayjs } from 'dayjs'
import {
  ComplaintFormData,
  AddComplaintModalProps,
} from '@/types/modules/infrastructure-management/raiseComplaint'
import {
  useGetAllInfrastructureCategories,
  useGetAllInfrastructureTypes,
  useGetAllSerialNumbers,
} from '@/hooks/modules/infrastructure-management/useRaiseComplaint'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { RAISE_COMPLAINT_CONSTANTS } from '@/constants/modules/infrastructure-management/raiseComplaint'
import { RT_DROPDOWN_FIELDS } from '@/constants/modules/risk-management/riskTeam'

const AddComplaintModal: React.FC<AddComplaintModalProps> = ({
  formData,
  errors,
  onChange,
  onFileUpload,
  onFileEdit,
  onFileSubmit,
  documents = [],
  isEditMode = false,
}) => {
  const { data: infrastructureCategories } = useGetAllInfrastructureCategories()
  const { data: infrastructureTypes } = useGetAllInfrastructureTypes(
    formData.infrastructure_category_id
  )
  const { data: serialNumbers } = useGetAllSerialNumbers(
    formData.infrastructure_type_id
  )
  const { data: statusOptions } = useOrganizationStatus()

  const handleFieldChange =
    (field: keyof ComplaintFormData) => (value: string | number | null) => {
      onChange(field, value)
    }

  return (
    <ContentWrapper>
      <Grid2
        container
        spacing={NUMBERMAP.ONE}
        sx={MODAL_STYLES.scrollableContainer}
      >
        {/* Infrastructure Category */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={
              RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.INFRASTRUCTURE_CATEGORY
            }
            placeholder={
              RAISE_COMPLAINT_CONSTANTS.FIELD_PLACEHOLDERS
                .INFRASTRUCTURE_CATEGORY
            }
            isDropdown={true}
            value={formData.infrastructure_category_id?.toString() ?? ''}
            onChange={(value: string | number) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .INFRASTRUCTURE_CATEGORY_ID as keyof ComplaintFormData
              )(value === '' ? null : Number(value))
            }
            options={infrastructureCategories?.data ?? []}
            keyField={
              RAISE_COMPLAINT_CONSTANTS.DROPDOWN_FIELDS.INFRASTRUCTURE_CATEGORY
                .KEY_FIELD
            }
            valueField={
              RAISE_COMPLAINT_CONSTANTS.DROPDOWN_FIELDS.INFRASTRUCTURE_CATEGORY
                .VALUE_FIELD
            }
            error={errors.infrastructure_category_id}
          />
        </Grid2>

        {/* Infrastructure Type */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.INFRASTRUCTURE_TYPE}
            placeholder={
              RAISE_COMPLAINT_CONSTANTS.FIELD_PLACEHOLDERS.INFRASTRUCTURE_TYPE
            }
            isDropdown={true}
            value={formData.infrastructure_type_id?.toString() ?? ''}
            onChange={(value: string | number) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .INFRASTRUCTURE_TYPE_ID as keyof ComplaintFormData
              )(value === '' ? null : Number(value))
            }
            options={infrastructureTypes?.data ?? []}
            keyField={
              RAISE_COMPLAINT_CONSTANTS.DROPDOWN_FIELDS.INFRASTRUCTURE_TYPE
                .KEY_FIELD
            }
            valueField={
              RAISE_COMPLAINT_CONSTANTS.DROPDOWN_FIELDS.INFRASTRUCTURE_TYPE
                .VALUE_FIELD
            }
            error={errors.infrastructure_type_id}
            disabled={!formData.infrastructure_category_id}
          />
        </Grid2>

        {/* Serial No. */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.SERIAL_NUMBER}
            placeholder={
              RAISE_COMPLAINT_CONSTANTS.FIELD_PLACEHOLDERS.SERIAL_NUMBER
            }
            isDropdown={true}
            value={formData.infrastructure_id?.toString() ?? ''}
            onChange={(value: string | number) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .INFRASTRUCTURE_ID as keyof ComplaintFormData
              )(value === '' ? null : Number(value))
            }
            options={serialNumbers?.data ?? []}
            keyField={
              RAISE_COMPLAINT_CONSTANTS.DROPDOWN_FIELDS.SERIAL_NUMBER.KEY_FIELD
            }
            valueField={
              RAISE_COMPLAINT_CONSTANTS.DROPDOWN_FIELDS.SERIAL_NUMBER
                .VALUE_FIELD
            }
            error={errors.infrastructure_id ?? errors.serial_number ?? ''}
            disabled={!formData.infrastructure_type_id}
          />
        </Grid2>

        {/* Complaint Date */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <DatePicker
            label={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.COMPLAINT_DATE}
            value={
              formData.complaint_date ? dayjs(formData.complaint_date) : null
            }
            onChange={(date: Dayjs | null) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .COMPLAINT_DATE as keyof ComplaintFormData
              )(date)
            }
            error={errors.complaint_date ?? ''}
            maxDate={dayjs()}
            readOnly={true}
          />
        </Grid2>

        {/* Complaint Title */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.COMPLAINT_TITLE}
            placeholder={
              RAISE_COMPLAINT_CONSTANTS.FIELD_PLACEHOLDERS.COMPLAINT_TITLE
            }
            value={formData.complaint_title}
            onChange={(value: string) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .COMPLAINT_TITLE as keyof ComplaintFormData
              )(value)
            }
            error={errors.complaint_title ?? ''}
            maxLength={NUMBERMAP.THREETHOUSANDFIVEHUNDRED}
          />
        </Grid2>

        {/* Complaint Description */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <RichTextEditor
            label={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.COMPLAINT_DESCRIPTION}
            value={formData.complaint_description}
            onChange={(value: string) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .COMPLAINT_DESCRIPTION as keyof ComplaintFormData
              )(value)
            }
            placeholder={
              RAISE_COMPLAINT_CONSTANTS.FIELD_PLACEHOLDERS.RICH_TEXT_EDITOR
            }
            error={errors.complaint_description}
          />
        </Grid2>

        {/* Status */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.STATUS}
            placeholder={RAISE_COMPLAINT_CONSTANTS.FIELD_PLACEHOLDERS.STATUS}
            isDropdown={true}
            value={formData.status_id?.toString() ?? ''}
            onChange={(value: string | number) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .STATUS_ID as keyof ComplaintFormData
              )(value === '' ? null : Number(value))
            }
            options={statusOptions?.data ?? []}
            keyField={RT_DROPDOWN_FIELDS.STATUS.KEY_FIELD}
            valueField={RT_DROPDOWN_FIELDS.STATUS.VALUE_FIELD}
            error={errors.status_id}
          />
        </Grid2>

        {/* Service Details Section */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <SectionTitle sx={RAISE_COMPLAINT_CONSTANTS.SECTION_TITLE_STYLES}>
            {RAISE_COMPLAINT_CONSTANTS.SECTION_TITLES.SERVICE_DETAILS}
          </SectionTitle>
        </Grid2>

        {/* Root Cause */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <RichTextEditor
            label={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.ROOT_CAUSE}
            value={formData.root_cause}
            onChange={(value: string) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .ROOT_CAUSE as keyof ComplaintFormData
              )(value)
            }
            placeholder={
              RAISE_COMPLAINT_CONSTANTS.FIELD_PLACEHOLDERS.ROOT_CAUSE
            }
            error={errors.root_cause}
          />
        </Grid2>

        {/* Resolution */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <RichTextEditor
            label={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.RESOLUTION}
            value={formData.resolution}
            onChange={(value: string) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .RESOLUTION as keyof ComplaintFormData
              )(value)
            }
            placeholder={
              RAISE_COMPLAINT_CONSTANTS.FIELD_PLACEHOLDERS.RESOLUTION
            }
            error={errors.resolution}
          />
        </Grid2>

        {/* Acknowledge Date */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <DatePicker
            disabled={!formData.complaint_date}
            label={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.ACKNOWLEDGE_DATE}
            value={
              formData.acknowledge_date
                ? dayjs(formData.acknowledge_date)
                : null
            }
            onChange={(date: Dayjs | null) =>
              handleFieldChange(
                RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES
                  .ACKNOWLEDGE_DATE as keyof ComplaintFormData
              )(date)
            }
            error={errors.acknowledge_date ?? ''}
            minDate={formData.complaint_date ? dayjs(formData.complaint_date) : undefined}
            readOnly={true}
          />
        </Grid2>

        {/* Upload Document */}
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <FileUploadManager
            initialFiles={documents}
            onFileUpload={onFileUpload}
            onFileEdit={onFileEdit}
            onSubmit={onFileSubmit ?? (() => {})}
            subHeader={RAISE_COMPLAINT_CONSTANTS.FIELD_LABELS.DOCUMENTS}
            uploadMandError={errors.documents}
          />
        </Grid2>
      </Grid2>
    </ContentWrapper>
  )
}

export default AddComplaintModal
