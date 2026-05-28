'use client'
import React, { useEffect, useState } from 'react'
import {
  Description,
  InputField,
  MultiSelect,
  showActionAlert,
  DataGridTable,
} from '@/components/ui'
import {
  FormContainer,
  FormSection,
  FormTitle,
  FormContent,
  FormRow,
  LabelContainer,
  LabelText,
  LabelValue,
  ButtonContainer,
} from '@/styles/components/modules/prototypeForm'
import { Grid2 } from '@mui/material'
import { NUMBERMAP, STATUS } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { ReportForm } from '@/types/modules/dnd/verificationReport'
import { stripHtml } from '@/lib/utils/common'
import { API_FIELD_KEYS, INITIAL_FORM, KEY_FIELD, VALUE_FIELD, REPORT_CHANGE, REPORT_LABEL, REPORT_PLACEHOLDER, ROUTER_END, VALIDATION_ERRORS, SAMPLE_DROPDOWN_DATA, DATE_FORMAT, FIELD_ORDER, FIELD_LABEL_MAP, FORM_TITLES, TABLE_TITLES, ITEM_FOR_TEST_COLUMNS, TABLE_FIELDS } from '@/constants/modules/dnd/verificationReport'
import { useFetchEquipment, useFetchJigs, useFetchReport, useSaveReport, useUsers } from '@/hooks/modules/dnd/useVerificationReport'
import { useDesignTools } from '@/hooks/modules/dnd/useProjectPlan'
import { useParams, useRouter  } from 'next/navigation'
import DatePicker from "@/components/ui/data-picker/DataPicker"
import dayjs from "dayjs"
import { selectRoleId } from '@/store/slices/menuSlice'
import { useSelector } from 'react-redux'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import { useFileHandling } from '@/hooks/modules/dnd/useFileHandling'

/**
    Classification : Confidential
**/


import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { CommentsHistoryContainer } from '@/styles/components/modules/taskSchedule'
const VerificationReportForm: React.FC = () => { 

  const params = useParams()
  const router = useRouter()
  const verification_plan_id = params.verification_id as string
  const order_id = params.order_id as string
  const project_id = params.id as string
  const roleId = useSelector(selectRoleId)

  const [formData, setFormData] = useState<ReportForm>({ ...INITIAL_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasEditPermission, setHasEditPermission] = useState(true)
  
  const {
    handleFileUpload,
    handleFileEdit,
    handleFileSubmit,
    appendFileFields: appendFileFieldsToFormData,
    resetFileData,
  } = useFileHandling(formData, setFormData)
  const {data: fetchReport, refetch, isLoading, isFetching} = useFetchReport(Number(verification_plan_id))
  const {data: jigsOptions, isLoading: jigsLoading, isFetching: jigsFetching} = useFetchJigs();
  const {data: equipmentOptions, isLoading: equipmentLoading, isFetching: equipmentFetching} = useFetchEquipment();
  const {data: toolsOptions, isLoading: toolsLoading, isFetching: toolsFetching} = useDesignTools();
  const {data: TESTED_BY, isLoading: usersLoading, isFetching: usersFetching} = useUsers(Number(roleId));
  const {mutate: saveReport, isPending} = useSaveReport();

useEffect(() => {
  if (!fetchReport?.data?.[NUMBERMAP.ZERO]) return;
  const reportData = fetchReport.data[NUMBERMAP.ZERO];
  
  if (!reportData) return;
  
  // Extract IDs from arrays for MultiSelect fields
  const jigsUsedIds = Array.isArray(reportData.jigs_used) 
    ? reportData.jigs_used.map((item: any) => item.id).filter(Boolean)
    : [];
  
  const testEquipmentsIds = Array.isArray(reportData.test_equipment_used) 
    ? reportData.test_equipment_used.map((item: any) => item.id).filter(Boolean)
    : [];
  
  const toolsUsedIds = Array.isArray(reportData.tools_used) 
    ? reportData.tools_used.map((item: any) => item.id).filter(Boolean)
    : [];
  
  setFormData({
    ...reportData,
    jigs_used: jigsUsedIds,
    test_equipments: testEquipmentsIds,
    tools_used: toolsUsedIds,
    tested_by: reportData.tested_by_id ? String(reportData.tested_by_id) : '',
  });
}, [fetchReport]);


const handleChange = (field: string) => (value: string | string[] | number[] | (string | number)[] | dayjs.Dayjs) => {
  if(!hasEditPermission) return;
  const formattedValue = value && dayjs.isDayjs(value) ? value.format(DATE_FORMAT) : value;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [field]: formattedValue,
  }));
  if (errors[field]) {
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  }
};


  const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  if (!formData.aim?.trim()) {
    newErrors.aim = VALIDATION_ERRORS.AIM
  }


  if (!formData.test_value?.trim()) {
    newErrors.test_value = VALIDATION_ERRORS.TEST_VALUE
  }

  if (!formData.test_result?.trim()) {
    newErrors.test_result = VALIDATION_ERRORS.TEST_RESULT
  }

  if (!Array.isArray(formData.test_equipments) || formData.test_equipments.length === NUMBERMAP.ZERO) {
    newErrors.test_equipments = VALIDATION_ERRORS.EQUIPMENTS
  }

  if (!Array.isArray(formData.tools_used) || formData.tools_used.length === NUMBERMAP.ZERO) {
    newErrors.tools_used = VALIDATION_ERRORS.TOOLS
  }

  if(!formData.verification_result) {
    newErrors.verification_result = VALIDATION_ERRORS.VERIFICATION_RESULT
  }

  if(!formData.tested_by) {
    newErrors.tested_by= VALIDATION_ERRORS.TESTED_BY
  }

  if(!formData.tested_on) {
    newErrors.tested_on = VALIDATION_ERRORS.TESTED_ON
  }
  setErrors(newErrors)
  if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
    validateAndFocusFirstEmptyField(formData, Array.from(FIELD_ORDER), FIELD_LABEL_MAP);
  }
  return Object.keys(newErrors).length === NUMBERMAP.ZERO
}

const formatDate = (value: any) => {
  if (value && dayjs(value).isValid()) {
    const date = dayjs(value).toISOString();
    handleChange(REPORT_CHANGE.TESTED_ON)(date);
  } else {
    handleChange(REPORT_CHANGE.TESTED_ON)('');
  }
};

  const appendStringField = (formData: FormData, key: string, value: string | undefined) => {
    if (value) {
      formData.append(key, value);
    }
  };

  const appendStringFieldWithDefault = (formData: FormData, key: string, value: string | undefined, defaultValue: string) => {
    formData.append(key, value ?? defaultValue);
  };

  const appendNumberField = (formData: FormData, key: string, value: string | number | undefined) => {
    if (value) {
      formData.append(key, String(value));
    }
  };

  const appendArrayField = (formData: FormData, key: string, value: any[] | undefined) => {
    if (Array.isArray(value) && value.length > NUMBERMAP.ZERO) {
      formData.append(key, JSON.stringify(value));
    }
  };


  const appendFormFields = (formDataPayload: FormData, reportForm: ReportForm) => {
    appendStringFieldWithDefault(formDataPayload, API_FIELD_KEYS.VERIFICATION_PLAN_DIR_ID, String(reportForm.verification_plan_dir_id ?? ''), '');
    appendStringField(formDataPayload, API_FIELD_KEYS.SOFTWARE_VERSION, reportForm.software_version);
    appendArrayField(formDataPayload, API_FIELD_KEYS.JIGS_USED, reportForm.jigs_used);
    appendStringField(formDataPayload, API_FIELD_KEYS.AIM, reportForm.aim);
    appendArrayField(formDataPayload, API_FIELD_KEYS.TEST_EQUIPMENTS, reportForm.test_equipments);
    appendStringField(formDataPayload, API_FIELD_KEYS.TEST_VALUE, reportForm.test_value);
    appendStringField(formDataPayload, API_FIELD_KEYS.TEST_RESULT, reportForm.test_result);
    appendNumberField(formDataPayload, API_FIELD_KEYS.TESTED_BY, reportForm.tested_by);
    appendStringField(formDataPayload, API_FIELD_KEYS.TESTED_ON, reportForm.tested_on);
    appendNumberField(formDataPayload, API_FIELD_KEYS.VERIFICATION_RESULT, reportForm.verification_result);
    appendArrayField(formDataPayload, API_FIELD_KEYS.TOOLS_USED, reportForm.tools_used);
  };

  const appendFileFields = (formDataPayload: FormData) => {
    appendFileFieldsToFormData(formDataPayload, {
      DOCUMENTS_TO_CREATE: API_FIELD_KEYS.DOCUMENTS_TO_CREATE,
      DOCUMENTS_TO_DELETE: API_FIELD_KEYS.DOCUMENTS_TO_DELETE,
      CREATE_META_DATA: API_FIELD_KEYS.CREATE_META_DATA,
      UPDATE_META_DATA: API_FIELD_KEYS.UPDATE_META_DATA,
    })
  }

  const buildFormData = (): FormData => {
    const createVerificationReportForm = new FormData();
    appendFormFields(createVerificationReportForm, formData);
    appendFileFields(createVerificationReportForm);
    return createVerificationReportForm;
  };

  // Handle Save
  const handleSave = () => {
    if (!validateForm()) return;
    
    const createVerificationReportForm = buildFormData();

    saveReport({ data: createVerificationReportForm, design_input_requirement_id: 0 }, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS);
        resetFileData();
        refetch();
      },
      onError: () => {
        showActionAlert(STATUS.FAILED);
      },
    });
  };

  const handleCancel = () => {
    setFormData({ ...INITIAL_FORM });
    router.push(ROUTER_END(Number(order_id), Number(project_id)));
  };

  const isAnyLoading = () => {
    if (isLoading) return true
    if (isFetching) return true
    if (jigsLoading) return true
    if (jigsFetching) return true
    if (equipmentLoading) return true
    if (equipmentFetching) return true
    if (toolsLoading) return true
    if (toolsFetching) return true
    if (usersLoading) return true
    if (usersFetching) return true
    if (isPending) return true
    return false
  }

  return (
    <FormContainer>
      <GlobalLoader loading={isAnyLoading()} />
      {fetchReport && (
      <FormSection>
        <FormTitle>{FORM_TITLES.VERIFICATION_REPORT}</FormTitle>
        <FormContent >
          <Grid2>
          <FormRow>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={NUMBERMAP.SIX}>
                <LabelContainer>
                  <LabelText>{REPORT_LABEL.DIR_NAME}</LabelText>
                  <LabelValue>{formData.dir_name}</LabelValue>
                </LabelContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <LabelContainer>
                  <LabelText>{REPORT_LABEL.UNITS}</LabelText>
                  <LabelValue>{formData.units_to_be_verified}</LabelValue>
                </LabelContainer>
              </Grid2>
            </Grid2>
          </FormRow>
          <FormRow>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <DataGridTable
                  title={TABLE_TITLES.ITEM_FOR_TEST}
                  rows={formData.item_for_test ?? []}
                  columns={ITEM_FOR_TEST_COLUMNS}
                  idField={TABLE_FIELDS.ID}
                  hideFooter={true}
                />
              </Grid2>
            </Grid2>
          </FormRow>
          <FormRow>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  label={REPORT_LABEL.SOFTWARE_VERSION}
                  placeholder={REPORT_PLACEHOLDER.SOFTWARE_VERSION}
                  value={formData.software_version ?? ''}
                  onChange={handleChange(REPORT_CHANGE.SOFTWARE)}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <LabelContainer>
                  <LabelText>{REPORT_LABEL.PARAMETERS}</LabelText>
                  <LabelValue>{formData.parameters_checked}</LabelValue>
                </LabelContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <LabelContainer>
                  <LabelText>{REPORT_LABEL.ACCEPTANCE}</LabelText>
                  <LabelValue>{stripHtml(formData.acceptance_criteria ?? '')}</LabelValue>
                </LabelContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <Description
                  label={REPORT_LABEL.AIM}
                  placeholder={REPORT_PLACEHOLDER.AIM}
                  value={formData.aim ?? ''}
                  onChange={handleChange(REPORT_CHANGE.AIM)}
                  error={errors.aim ?? ''}
                />
              </Grid2>
            </Grid2>
          </FormRow>
          <FormRow>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={NUMBERMAP.SIX}>
                <MultiSelect
                  label={REPORT_LABEL.JIGS}
                  placeholder={REPORT_PLACEHOLDER.JIGS}
                  options={jigsOptions?.data ?? []}
                  value={formData.jigs_used ?? []}
                  idField={KEY_FIELD.JIG_ID}
                  valueField={VALUE_FIELD.JIG_NAME}
                  onChange={handleChange(REPORT_CHANGE.JIGS)}
                  error={errors.jigs_used ?? ''}  
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX} id={FIELD_LABEL_MAP.test_equipments}>
                <MultiSelect
                  label={REPORT_LABEL.EQUIPMENTS}
                  placeholder={REPORT_PLACEHOLDER.EQUIPMENTS}
                  options={equipmentOptions?.data ?? []}
                  value={formData.test_equipments ?? []}
                  idField={KEY_FIELD.EQUIPMENT_ID}
                  valueField={VALUE_FIELD.EQUIPMENT_NAME}
                  onChange={handleChange(REPORT_CHANGE.EQUIPMENTS)}
                  error={errors.test_equipments ?? ''}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <MultiSelect
                  label={REPORT_LABEL.TOOLS}
                  placeholder={REPORT_PLACEHOLDER.TOOLS}
                  options={toolsOptions ?? []}
                  value={formData.tools_used ?? []}
                  idField={KEY_FIELD.TOOL_ID}
                  valueField={VALUE_FIELD.TOOL_NAME}
                  onChange={handleChange(REPORT_CHANGE.TOOLS)}
                  error={errors.tools_used ?? ''}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <Description
                  label={REPORT_LABEL.TEST_VALUE}
                  placeholder={REPORT_PLACEHOLDER.TEST_VALUE}
                  value={formData.test_value ?? ''}
                  onChange={handleChange(REPORT_CHANGE.TEST_VALUE)}
                  error={errors.test_value ?? ''}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <Description
                  label={REPORT_LABEL.TEST_RESULT}
                  placeholder={REPORT_PLACEHOLDER.TEST_RESULT}
                  value={formData.test_result ?? ''}
                  onChange={handleChange(REPORT_CHANGE.TEST_RESULT)}
                  error={errors.test_result ?? ''}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX} id={FIELD_LABEL_MAP.verification_result}>
                <InputField
                  label={REPORT_LABEL.VERIFICATION_RESULT}
                  placeholder={REPORT_PLACEHOLDER.VERIFICATION_RESULT}
                  options={SAMPLE_DROPDOWN_DATA.VERIFICATION_RESULT ?? []}
                  keyField={KEY_FIELD.VERIFICATION_RESULT}
                  valueField={VALUE_FIELD.VERIFICATION_RESULT}
                  value={String(formData.verification_result ?? '')}
                  onChange={handleChange(REPORT_CHANGE.VERIFICATION_RESULT)}
                  isDropdown
                  error={errors.verification_result ?? ''}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX} id={FIELD_LABEL_MAP.tested_by}>
                <InputField
                  label={REPORT_LABEL.TESTED_BY}
                  placeholder={REPORT_PLACEHOLDER.TESTED_BY}
                  options={
                    TESTED_BY?.data?.map((reviewer: any) => ({
                      ...reviewer,
                      full_name: `${reviewer.firstName} ${reviewer.lastName}`,
                    })) ?? []
                  }
                  keyField={KEY_FIELD.TESTED_BY}
                  valueField={VALUE_FIELD.TESTED_BY}
                  value={String(formData.tested_by ?? '')}
                  onChange={handleChange(REPORT_CHANGE.TESTED_BY)}
                  isDropdown
                  error={errors.tested_by ?? ''}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX} id={FIELD_LABEL_MAP.tested_on}>
                <DatePicker
                  label={REPORT_LABEL.TESTED_ON}
                  value={
                    formData.tested_on && dayjs(formData.tested_on).isValid()
                      ? dayjs(formData.tested_on)
                      : null
                  }
                  onChange={(value) => {
                    formatDate(value)
                  }}
                  error={errors.tested_on ?? ''}
                />
              </Grid2>
            </Grid2>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <FileUploadManager
                  initialFiles={formData?.documents ?? []}
                  onFileUpload={handleFileUpload}
                  onFileEdit={handleFileEdit}
                  onSubmit={handleFileSubmit}
                  hasEditable={!hasEditPermission}
                />
              </Grid2>
            </Grid2>
          </FormRow>
          </Grid2>
          <CommentsHistoryContainer>
          <CommentsHistory 
              comments={fetchReport?.meta_info?.task_info?.task_comments} 
           />
           </CommentsHistoryContainer>
          <ButtonContainer>
            <ReviewerModalManager
              isLoading={isAnyLoading()}
              permissions={fetchReport?.meta_info?.action_control?.permissions ?? []}
              projectId={Number(project_id)}
              menuId={fetchReport?.meta_info?.action_control?.menuId}
              menuName={fetchReport?.meta_info?.action_control?.formName}
              taskId={fetchReport?.meta_info?.task_info?.task_id}
              customHandlers={{ 
                handleCancel: handleCancel,
                handleSave: handleSave,
                isDisabled: isPending
              }}
              onPermissionChange={setHasEditPermission}
              reviewerList={fetchReport?.meta_info?.task_info?.reviewer_list}
            />
          </ButtonContainer>
        </FormContent>
      </FormSection>
      )}
    </FormContainer>
  )
}

export default VerificationReportForm

