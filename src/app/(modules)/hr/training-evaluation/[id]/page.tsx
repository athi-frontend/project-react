'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Grid2 } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import MuiTableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { TableComponentProps } from '@/types/modules/dnd/formTeam'
import { ActionButton, ButtonGroup, Description, InputField, Label, showActionAlert } from '@/components/ui'
import { PageContainer } from '@/styles/common'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import dayjs, { Dayjs } from 'dayjs'
import { useFetchSkill, useFetchTrainingEvaluationById, useFetchTrainingSchedule, useFetchTrainingScheduleById } from '@/hooks/modules/hr/useTrainingEvaluation'
import { useRecordGenerationHelper } from '@/hooks/modules/hr/useRecordGeneration'
import { Skill, TrainingEvaluation, TrainingEvaluationFormErrors } from '@/types/modules/hr/trainingEvaluation'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import { MAGICSAVECONSTANT, HR_TRAINING_EVALUATION, ID, LABEL, TITLE, TITLE_MODE_OF_TRAINING, TITLE_OF_TRAINING, TRAINING_EVALUATION_LIST, VALUE, VALUE_FIELD, FILE_SECTION_TABLES, MODAL_CONTAINER_ID, FK_EQMS_HR_TRAINING_ATTENDEE_ID, FK_EQMS_HR_SKILL_MASTER_ID, FK_EQMS_HR_REQUIRED_SKILL_LEVEL_ID, FK_EQMS_HR_ACQUIRED_SKILL_LEVEL_ID, METHOD_OF_EVALUATION_FIELD, REMARKS_FIELD, SKILL_ROW_ID_PATTERN, HIDDEN_INPUT_KEY_PATTERN, ELEMENT_TYPE_HIDDEN, TABLE_EMPLOYEE_TRAINING_EVALUATION_SUPPORTING_FILES, COLUMN_FK_EQMS_FILE_ID, SKILL_LEVEL, SKILL_LEVEL_ID, getSkillColumns, TABLE_HEADER_SNO, TABLE_HEADER_NAME, TABLE_HEADER_ROLE, TABLE_HEADER_DEPARTMENT, TABLE_HEADER_STATUS, NO_RECORD_FOUND, TABLE_HEADER_EVALUATION_DETAILS, TRAINING_EVALUATION_ERROR_MESSAGES } from '@/constants/modules/hr/trainingEvaluation'
import { trainingEvaluationStyles } from '@/styles/modules/hr/trainingEvaluation'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { magicFormSave } from '@/lib/utils/magicSave'
import { useParams, useRouter } from 'next/navigation'
import magicSaveConstants from '@/constants/magicSave'
import { FileData } from '@/types/components/ui/fileUploadV3'
import { DocumentStructure, UploadedFileData } from '@/types/common'
import { mergeFinalFileData, restructureData, INITIALFILE, formatDateForAPI } from '@/lib/utils/common'
import { TableContainer } from '@/styles/components/ui/datatable'
import { HeaderTitle2 } from '@/styles/components/ui/label'
import TrainingEvaluationRow from '@/components/modules/hr/training-evaluation/TrainingEvaluationRow'
import { ContentWrapper, MODAL_STYLES } from '@/styles/modules/dnd/verification'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { useTheme } from '@mui/material/styles'

/**
*Classification : Confidential
**/

const initialFormData = {
  evaluationDate: null as Dayjs | null,
  selectedTrainingId: "",
  levelRequired: "",
  levelAcquired: "",
  methodOfEvaluation: "",
  remarks: "",
  selectedSkill: "",
  mode_of_training: "",
  finalFileData: FINALFILEINITIALDATA
};

const TableComponent: React.FC<TableComponentProps> = () => {
  const { data: trainingScheduleResponse, refetch: refetchTrainingSchedule } = useFetchTrainingSchedule();
  const theme = useTheme();
  const [formData, setFormData] = useState(initialFormData);
  const [finalFileData, setFinalFileData] = useState<DocumentStructure>(FINALFILEINITIALDATA);
  const [errors, setErrors] = useState<TrainingEvaluationFormErrors>({});
  const [rows, setRows] = useState<TrainingEvaluation[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const skillFormRef = useRef<HTMLFormElement>(null);
  const params = useParams();
  const roleId = params.id as string;
  const isEditMode = roleId !== MAGICSAVECONSTANT.CREATE;
  const router = useRouter();
  const [selectedRow, setSelectedRow] = useState<Skill | undefined>();
  const [editRow, setEditRow] = useState<boolean>(false);
  const isAddMode = roleId === MAGICSAVECONSTANT.CREATE || roleId == 'draft';

  // Record generation hook
  const { generateDocumentFromContextIds } = useRecordGenerationHelper();



  /**
   * Handles record generation after successful save
   * @param response - API response from save operation
   */
  const handleRecordGeneration = useCallback(
    (response: any) => {
      if (
        response &&
        'response' in response &&
        response.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      ) {
        // In edit mode, use the ID from URL params
        if (isEditMode && roleId) {
          generateDocumentFromContextIds([Number(roleId)])
        } else if (
          // In create mode, extract ID from response
          response?.response?.data?.length > NUMBERMAP.ZERO &&
          response?.response?.data[NUMBERMAP.ZERO]?.eqms_hr_training_evaluation
            ?.length > NUMBERMAP.ZERO
        ) {
          const trainingEvaluationId =
            response.response.data[NUMBERMAP.ZERO].eqms_hr_training_evaluation[
              NUMBERMAP.ZERO]?.id
          if (trainingEvaluationId) {
            generateDocumentFromContextIds([Number(trainingEvaluationId)])
          }
        }
      }
    },
    [generateDocumentFromContextIds, isEditMode, roleId]
  )

  /**
   * Handles draft save functionality
   * @param formData - Current form data
   * @param rowsData - Current rows data
   * @param fileData - Current file data
   */

  const { data: fetchEvaluation, refetch: refetchTrainingScheduleById, isLoading: trainingEvaluationLoading } = useFetchTrainingScheduleById(formData.selectedTrainingId);
  const { data: fetchEvaluationById, refetch: refetchTrainingEvaluationById, isLoading: idLoading } = useFetchTrainingEvaluationById(
    isEditMode ? roleId : ""
  );
  const { data: fetchSkillLevel, refetch: refetchSkillLevel } = useFetchSkill();

  const updateFormData = useCallback(
    (field: keyof typeof formData, value: string | Dayjs | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setErrors((prev) => {
        if (field === VALUE_FIELD.SELECTED_TRAINING_ID && value) {
          const { titleOfTraining, ...rest } = prev;
          return rest;
        }
        if (field === VALUE_FIELD.EVALUATION_DATE && value) {
          const { evaluationDate, ...rest } = prev;
          return rest;
        }
        return prev;
      });
      if (field === VALUE_FIELD.SELECTED_TRAINING_ID && value && !isEditMode) {
        refetchTrainingScheduleById();
      }
    },
    [isEditMode, refetchTrainingScheduleById, isAddMode, formData, rows, finalFileData]
  );

  useEffect(() => {
    if (isEditMode && fetchEvaluationById?.data?.length > NUMBERMAP.ZERO) {
      const evalData = fetchEvaluationById.data[NUMBERMAP.ZERO];
      setRows(evalData.skills);
      // Set form fields from API response
      setFormData(prev => ({
        ...prev,
        selectedTrainingId: evalData.title_id?.toString() ?? "",
        evaluationDate: evalData.evaluation_date ? dayjs(evalData.evaluation_date) : null,
        mode_of_training: evalData.mode_of_training ?? "",
      }));
    }
  }, [isEditMode, fetchEvaluationById]);

  useEffect(() => {
    const refetchData = () => {
      if (isEditMode) {
        refetchTrainingEvaluationById();
      } else {
        refetchTrainingSchedule();
      }
      refetchSkillLevel();
    };

    refetchData();
  }, [isEditMode, refetchTrainingEvaluationById, refetchTrainingSchedule, refetchSkillLevel]);

  useEffect(() => {
    if (!isEditMode && fetchEvaluation?.data?.length > NUMBERMAP.ZERO) {
      const item = fetchEvaluation.data[NUMBERMAP.ZERO];

      setFormData(prev => ({
        ...prev,
        mode_of_training: item.mode_of_training ?? "",
      }));

      const generatedRows = item.attendees.map((attendee: any) => ({
        ...attendee,
        skills: item.skills.map((skill: any) => ({
          ...skill,
          hr_training_evaluation_skill_attendee_id: attendee.hr_attendee_id,
        }))
      }));
      setRows(generatedRows);
    }
  }, [isEditMode, fetchEvaluation]);

  const renderActionCell = (params: GridRenderCellParams) => {
    const statusValue = params.row.status ?? NUMBERMAP.ONE;
    return (
      <ActionButton
        onEdit={() => {
          setFormData(prev => ({
            ...prev,
            selectedSkill: params.row.skill_name ?? '',
            levelRequired: params.row.required_skill_level_id?.toString() ?? '',
            levelAcquired: params.row.acquired_skill_level_id?.toString() ?? '',
            methodOfEvaluation: params.row.method_of_evaluation ?? '',
            remarks: params.row.remarks ?? '',
          }));
          setSelectedRow({
            ...params.row,
            skill_id: params.row.skill_id,
          });
          setEditRow(true);
        }}
        dataStatus={statusValue}
        value={statusValue}
      />
    )
  }

  const expandedColumns = getSkillColumns(renderActionCell)

  const validateForm = () => {
    let isValid = true;
    const newErrors: { titleOfTraining?: string; evaluationDate?: string; uploadedFile?: string } = {};
    // Validate Title of Training
    if (!formData.selectedTrainingId) {
      newErrors.titleOfTraining = TRAINING_EVALUATION_ERROR_MESSAGES.TITLE_OF_TRAINING;
      isValid = false;
    }
    // Validate Date of Evaluation
    if (!formData.evaluationDate) {
      newErrors.evaluationDate = TRAINING_EVALUATION_ERROR_MESSAGES.DATE_OF_EVALUATION;
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const parsedTrainingId = formData.selectedTrainingId
      ? Number(formData.selectedTrainingId)
      : NUMBERMAP.ZERO

    let keys;
    if (isEditMode) {
      keys = {
        [MAGICSAVECONSTANT.DATA_SOURCE_NAMES.TRAINING_EVALUATION]: {
          id: Number(roleId),
        },
      };
    } else {
      keys = parsedTrainingId ? {
        [MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION]: {
          fk_eqms_hr_training_evaluation_id: parsedTrainingId,
        },
      } : {};
    }

    const otherParamsBag = {
      [MAGICSAVECONSTANT.DATA_SOURCE_NAMES.TRAINING_EVALUATION]: [
        {
          [MAGICSAVECONSTANT.DATA_FIELD_NAMES.STATUS]: MAGICSAVECONSTANT.DATA_FIELD_NAMES.ACTIVE,
        },
      ],
      ...(isEditMode ? {} : {
        [MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION]: rows.flatMap(row =>
          row.skills
            .map(() => ({
              [MAGICSAVECONSTANT.DATA_FIELD_NAMES.STATUS]: MAGICSAVECONSTANT.DATA_FIELD_NAMES.ACTIVE,
            }))
        ),
      }),
    }

    const fileMetadata = getFileMetadata(isEditMode ? INITIALFILE : finalFileData)

    const response = await magicFormSave({
      currentFormRef: formRef,
      dataframeworkOperatorType: isEditMode ? MAGICSAVECONSTANT.UPDATE : MAGICSAVECONSTANT.INSERT,
      diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
      dataframeworkOtherParamsBag: otherParamsBag,
      keys: keys,
      fileMetadata: fileMetadata,
      draftDocuments: [],
    })

    if (
      response &&
      'response' in response &&
      (response.response as any)?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
    ) {
      // Handle record generation
      handleRecordGeneration(response)
      refetchTrainingScheduleById()
      showActionAlert(MAGICSAVECONSTANT.SUCCESS)
      router.push(MAGICSAVECONSTANT.PATH)
    } else {
      showActionAlert(MAGICSAVECONSTANT.FAILED)
    }
  }

  const handleFileUpload = useCallback((newFile: File | FileData) => {
    setSelectedRow((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        supporting_files: [...(prev.supporting_files ?? []), newFile],
      }
    })
    if (errors.uploadedFile) {
      setErrors((prev) => ({ ...prev, uploadedFile: '' }))
    }
  }, [finalFileData])

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData) => {
      setSelectedRow((prev) => {
        if (!prev) return prev;

        const updatedFiles = (prev.supporting_files ?? []).map((file) => {
          let currentId;
          if ('file_id' in file) {
            currentId = file.file_id;
          } else if ('id' in file) {
            currentId = file.id;
          } else {
            currentId = undefined;
          }

          const updatedId = updatedFile.id ?? updatedFile.id;

          return currentId === updatedId ? { ...file, ...updatedFile } : file;
        });

        return {
          ...prev,
          supporting_files: updatedFiles,
        };
      });
    },
    [finalFileData]
  );

  const handleCancel = async () => {
    setRows([]);
    setFormData(initialFormData);
    setSelectedRow(undefined);
    setEditRow(false);
    router.push(MAGICSAVECONSTANT.PATH);
  };


  const handleSkillSave = async () => {
    if (!selectedRow) return;

    if (isEditMode) {
      const skillId = selectedRow.hr_training_evaluation_skill_attendee_id ?? selectedRow.skill_id;

      const keys = {
        [MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION]: {
          id: skillId,
        },
        [FILE_SECTION_TABLES]: {
          fk_eqms_hr_employee_training_evaluation_id: skillId,
        }
      };

      const otherParamsBag = {
        [MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION]: [
          {
            status: MAGICSAVECONSTANT.DATA_FIELD_NAMES.ACTIVE,
          }
        ],
      };

      const fileMetadata = getFileMetadata(finalFileData);

      const response = await magicFormSave({
        currentFormRef: skillFormRef,
        dataframeworkOperatorType: MAGICSAVECONSTANT.UPDATE,
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
        dataframeworkOtherParamsBag: otherParamsBag,
        keys: keys,
        fileMetadata: fileMetadata,
      });

      if (
        response &&
        'response' in response &&
        (response.response as any)?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      ) {
        showActionAlert(MAGICSAVECONSTANT.SUCCESS);
        setFinalFileData(FINALFILEINITIALDATA)
        updateLocalState();
        setEditRow(false);
      } else {
        showActionAlert(MAGICSAVECONSTANT.FAILED);
      }
    } else {
      updateLocalState();
      setEditRow(false);
    }
  };

  const updateLocalState = () => {
    if (!selectedRow) return;
    const updatedRows = rows.map(row => ({
      ...row,
      skills: row.skills.map(skill => {
        // Always ensure the mapping is correct
        const correctAttendeeId = row.hr_attendee_id;
        if (
          skill.skill_id === selectedRow.skill_id &&
          skill.hr_training_evaluation_skill_attendee_id === selectedRow.hr_training_evaluation_skill_attendee_id
        ) {
          return {
            ...skill,
            skill_name: formData.selectedSkill,
            required_skill_level_id: formData.levelRequired ? Number(formData.levelRequired) : skill.required_skill_level_id ?? null,
            acquired_skill_level_id: formData.levelAcquired ? Number(formData.levelAcquired) : skill.acquired_skill_level_id ?? null,
            method_of_evaluation: formData.methodOfEvaluation ?? "",
            remarks: formData.remarks ?? "",
            supporting_files: selectedRow.supporting_files ?? skill.supporting_files ?? [],
            hr_training_evaluation_skill_attendee_id: correctAttendeeId, // always set to parent row's attendee id
          };
        } else {
          // For all other skills, ensure the mapping is correct
          return {
            ...skill,
            hr_training_evaluation_skill_attendee_id: skill.hr_training_evaluation_skill_attendee_id ?? correctAttendeeId,
          };
        }
      })
    }));

    setRows(updatedRows);
  };

  function getSkillWithContext(
    skill: Skill,
    skillIdx: number,
    row: any,
    selectedRow: Skill | undefined,
    isEditMode: boolean
  ) {
    const isSelected =
      selectedRow?.skill_id === skill.skill_id &&
      selectedRow?.hr_training_evaluation_skill_attendee_id === row.hr_training_evaluation_skill_attendee_id;
    return {
      ...skill,
      id: isEditMode
        ? (skill.hr_training_evaluation_skill_attendee_id ?? SKILL_ROW_ID_PATTERN(row.hr_training_evaluation_skill_attendee_id, skillIdx))
        : (skill.skill_id ?? SKILL_ROW_ID_PATTERN(row.hr_training_evaluation_skill_attendee_id, skillIdx)),
      skill_id: skill.skill_id,
      hr_attendee_id: row.hr_training_evaluation_skill_attendee_id,
      levelRequired: isSelected ? row.levelRequired : skill.required_skill_level_id ?? null,
      levelAcquired: isSelected ? row.levelAcquired : skill.acquired_skill_level_id ?? null,
      methodOfEvaluation: isSelected ? row.method_of_evaluation : skill.method_of_evaluation ?? "",
      remarks: isSelected ? row.remarks : skill.remarks ?? "",
    };
  }
  function getFileMetadata(finalFileData: DocumentStructure) {
    if (!finalFileData || Object.keys(finalFileData).length === 0) return undefined;
    const createTables = [
      {
        table: TABLE_EMPLOYEE_TRAINING_EVALUATION_SUPPORTING_FILES,
        idColumn: COLUMN_FK_EQMS_FILE_ID,
      },
    ];
    const updateTables = [
      {
        table: TABLE_EMPLOYEE_TRAINING_EVALUATION_SUPPORTING_FILES,
        idColumn: COLUMN_FK_EQMS_FILE_ID,
      },
    ];
    const deleteTableColumnMap = {
      eqms_dir_supporting_document: COLUMN_FK_EQMS_FILE_ID,
    };
    const hasTrainingNeedFileData = Object.entries(finalFileData).some(
      ([key, val]) => {
        if (Array.isArray(val)) {
          return val.length > NUMBERMAP.ZERO;
        }
        if (val && typeof val === 'object') {
          return Object.values(val).some((nestedVal) => {
            if (nestedVal && typeof nestedVal === 'object') {
              return Object.keys(nestedVal).length > NUMBERMAP.ZERO;
            }
            return !!nestedVal;
          });
        }
        return !!val;
      }
    );
    if (hasTrainingNeedFileData) {
      const output = restructureData(
        finalFileData,
        createTables,
        updateTables,
        deleteTableColumnMap
      );
      return {
        fileOperation: output,
        documents_to_create: finalFileData.documents_to_create,
      };
    }
    return undefined;
  }

  const handleFileDelete = (fileData: FileData) => {
    setFinalFileData((prev) => mergeFinalFileData(prev, fileData))
  };
  // Move hidden input rendering to a separate function
  const renderHiddenInputs = () => (
    isEditMode ? null : (
      rows.map((row) =>
        row.skills
          .map((skill, idx) => (
            <div key={HIDDEN_INPUT_KEY_PATTERN(row.id, skill.skill_id, skill.hr_training_evaluation_skill_attendee_id ?? skill.skill_id)} style={trainingEvaluationStyles.hiddenInputs}>
              <input
                type={ELEMENT_TYPE_HIDDEN}
                name={FK_EQMS_HR_TRAINING_ATTENDEE_ID}
                value={row.hr_attendee_id ?? ""}
                data-is-grid={MAGICSAVECONSTANT.TRUE}
                data-sourcename={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                data-fieldname={MAGICSAVECONSTANT.DATA_FIELD_NAMES.HR_TRAINING_ATTENDEE_ID}
              />
              <input
                type={ELEMENT_TYPE_HIDDEN}
                name={FK_EQMS_HR_SKILL_MASTER_ID}
                value={skill.skill_id ?? ""}
                data-is-grid={MAGICSAVECONSTANT.TRUE}
                data-sourcename={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                data-fieldname={MAGICSAVECONSTANT.DATA_FIELD_NAMES.HR_SKILL_MASTER_ID}
              />
              <input
                type={ELEMENT_TYPE_HIDDEN}
                name={FK_EQMS_HR_REQUIRED_SKILL_LEVEL_ID}
                data-is-grid={MAGICSAVECONSTANT.TRUE}
                value={skill.required_skill_level_id ?? ""}
                data-sourcename={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                data-fieldname={MAGICSAVECONSTANT.DATA_FIELD_NAMES.REQUIRED_SKILL_LEVEL_ID}
              />
              <input
                type={ELEMENT_TYPE_HIDDEN}
                name={FK_EQMS_HR_ACQUIRED_SKILL_LEVEL_ID}
                data-is-grid={MAGICSAVECONSTANT.TRUE}
                value={skill.acquired_skill_level_id ?? ""}
                data-sourcename={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                data-fieldname={MAGICSAVECONSTANT.DATA_FIELD_NAMES.ACQUIRED_SKILL_LEVEL_ID}
              />
              <input
                type={ELEMENT_TYPE_HIDDEN}
                name={METHOD_OF_EVALUATION_FIELD}
                data-is-grid={MAGICSAVECONSTANT.TRUE}
                value={skill.method_of_evaluation ?? ""}
                data-sourcename={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                data-fieldname={MAGICSAVECONSTANT.DATA_FIELD_NAMES.METHOD_OF_EVALUATION}
              />
              <input
                type={ELEMENT_TYPE_HIDDEN}
                name={REMARKS_FIELD}
                data-is-grid={MAGICSAVECONSTANT.TRUE}
                value={skill.remarks ?? ""}
                data-sourcename={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                data-fieldname={MAGICSAVECONSTANT.DATA_FIELD_NAMES.REMARK}
              />
            </div>
          ))
      )
    )
  );




  return (
    <PageContainer>
      <Label title={TRAINING_EVALUATION_LIST.TITLE} />
      <GlobalLoader loading={trainingEvaluationLoading ?? idLoading} />
      <TableContainer id={HR_TRAINING_EVALUATION} ref={formRef}>

        <Grid2 container spacing={NUMBERMAP.ONE}>

          <Grid2 size={NUMBERMAP.SIX} >
            <InputField
              label={TITLE_OF_TRAINING}
              placeholder={TRAINING_EVALUATION_LIST.PLACEHOLDER}
              value={formData.selectedTrainingId ?? ""}
              onChange={(value: string) => updateFormData(VALUE_FIELD.SELECTED_TRAINING_ID, value)}
              isDropdown
              valueField={TITLE}
              keyField={ID}
              dataSourceName={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.TRAINING_EVALUATION}
              dataFieldName={MAGICSAVECONSTANT.DATA_FIELD_NAMES.TRAINING_SCHEDULE_ID}
              dataIsAutocomplete={formData.selectedTrainingId ?? ""}
              options={trainingScheduleResponse?.data ?? []}
              disabled={isEditMode}
              error={errors.titleOfTraining}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX} >
            <DatePicker
              label={TRAINING_EVALUATION_LIST.DATE_OF_EVALUATION}
              error={errors.evaluationDate ?? ""}
              value={formData.evaluationDate ?? null}
              onChange={(value) => updateFormData(VALUE_FIELD.EVALUATION_DATE, value)}
              dataSourceName={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.TRAINING_EVALUATION}
              dataFieldName={MAGICSAVECONSTANT.DATA_FIELD_NAMES.EVALUATION_DATE}
              dataIsAutocomplete={formatDateForAPI(formData.evaluationDate) ?? ""}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <InfoField value={formData.mode_of_training} label={TITLE_MODE_OF_TRAINING} />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <HeaderTitle2>{TRAINING_EVALUATION_LIST.ATTENDEES}</HeaderTitle2>
          </Grid2>
        </Grid2>
        <MuiTableContainer component={Paper} sx={trainingEvaluationStyles.tableContainer}>
          <Table aria-label="collapsible table">
            <TableHead sx={{ ...trainingEvaluationStyles.tableHead, backgroundColor: theme.palette.text.main, borderColor: theme.palette.text.primary }}>
              <TableRow>
                <TableCell sx={{ ...trainingEvaluationStyles.tableHeaderCell, color: theme.palette.text.primary }}>{TABLE_HEADER_SNO}</TableCell>
                <TableCell sx={{ ...trainingEvaluationStyles.tableHeaderCell, color: theme.palette.text.primary }}>{TABLE_HEADER_NAME}</TableCell>
                <TableCell sx={{ ...trainingEvaluationStyles.tableHeaderCell, color: theme.palette.text.primary }}>{TABLE_HEADER_ROLE}</TableCell>
                <TableCell sx={{ ...trainingEvaluationStyles.tableHeaderCell, color: theme.palette.text.primary }}>{TABLE_HEADER_DEPARTMENT}</TableCell>
                <TableCell sx={{ ...trainingEvaluationStyles.tableHeaderCell, color: theme.palette.text.primary }}>{TABLE_HEADER_STATUS}</TableCell>
                <TableCell sx={{ ...trainingEvaluationStyles.tableHeaderCell, color: theme.palette.text.primary }}>{TABLE_HEADER_EVALUATION_DETAILS}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > NUMBERMAP.ZERO ? (
                rows.map((row, idx) => (
                  <TrainingEvaluationRow
                    key={row.hr_attendee_id ?? idx}
                    row={row}
                    rowIndex={idx}
                    selectedRow={selectedRow}
                    formData={{}}
                    isEditMode={isEditMode}
                    expandedColumns={expandedColumns}
                    getSkillWithContext={getSkillWithContext}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={NUMBERMAP.SIX} sx={trainingEvaluationStyles.noRecordFoundCell}>
                    <Typography variant="body1" color="text.secondary">
                      {NO_RECORD_FOUND}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </MuiTableContainer>
        {renderHiddenInputs()}
        <ButtonGroup
          buttons={[
            { label: VALUE.SAVE, onClick: () => { void handleSave(); } },
            { label: VALUE.CANCEL, onClick: () => handleCancel() }
          ]} />

        <CommonModal
          open={editRow}
          onClose={() => {
            setEditRow(false)
            setFinalFileData(FINALFILEINITIALDATA)
          }}
          onSave={() => {
            handleSkillSave();
          }}
          title={TRAINING_EVALUATION_LIST.EVALUATION_DETAILS}
          buttonRequired
        >
          <ContentWrapper ref={skillFormRef} id={MODAL_CONTAINER_ID}>
            <Grid2
              container
              spacing={NUMBERMAP.ONE}
              sx={MODAL_STYLES.scrollableContainer}
            >
              <Grid2 container spacing={NUMBERMAP.TWO}>
                <Grid2 size={NUMBERMAP.TWELVE}>
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InfoField
                    label={TRAINING_EVALUATION_LIST.SKILL_IMPORTED}
                    value={formData.selectedSkill ?? ""}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={LABEL.LEVEL_REQUIRED}
                    placeholder={LABEL.SELECT_LEVEL}
                    dataSourceName={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                    dataFieldName={MAGICSAVECONSTANT.DATA_FIELD_NAMES.REQUIRED_SKILL_LEVEL_ID}
                    dataIsAutocomplete={formData.levelRequired ?? ""}
                    options={fetchSkillLevel?.data ?? []}
                    valueField={SKILL_LEVEL}
                    keyField={SKILL_LEVEL_ID}
                    value={formData.levelRequired ?? ""}
                    onChange={(value: string) => updateFormData(VALUE_FIELD.LEVEL_REQUIRED, value)}
                    isDropdown
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={LABEL.LEVEL_ACQUIRED}
                    placeholder={LABEL.SELECT_LEVEL}
                    dataSourceName={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                    dataFieldName={MAGICSAVECONSTANT.DATA_FIELD_NAMES.ACQUIRED_SKILL_LEVEL_ID}
                    dataIsAutocomplete={formData.levelAcquired ?? ""}
                    options={fetchSkillLevel?.data ?? []}
                    valueField={SKILL_LEVEL}
                    keyField={SKILL_LEVEL_ID}
                    isDropdown
                    value={formData.levelAcquired ?? ""}
                    onChange={(value: string) => updateFormData(VALUE_FIELD.LEVEL_ACQUIRED, value)}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <Description
                    label={LABEL.EVALUATION}
                    placeholder={LABEL.EVALUATION_PLACEHOLDER}
                    dataSourceName={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                    dataFieldName={MAGICSAVECONSTANT.DATA_FIELD_NAMES.METHOD_OF_EVALUATION}
                    value={formData.methodOfEvaluation ?? ""}
                    onChange={(value: string) => updateFormData(VALUE_FIELD.METHOD_OF_EVALUATION, value)}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <Description
                    label={LABEL.REMARKS}
                    placeholder={LABEL.REMARKS_PLACEHOLDER}
                    dataSourceName={MAGICSAVECONSTANT.DATA_SOURCE_NAMES.EMPLOYEE_TRAINING_EVALUATION}
                    dataFieldName={MAGICSAVECONSTANT.DATA_FIELD_NAMES.REMARK}
                    value={formData.remarks ?? ""}
                    onChange={(value: string) => updateFormData(VALUE_FIELD.REMARK, value)}
                  />
                </Grid2>
              </Grid2>
              <FileUploadManager
                initialFiles={selectedRow?.supporting_files}
                onFileUpload={handleFileUpload}
                onFileEdit={handleFileEdit}
                onSubmit={(data) => {
                  handleFileDelete(data)

                }}
              />
            </Grid2>
          </ContentWrapper>
        </CommonModal>
      </TableContainer>
    </PageContainer>

  )
}

export default TableComponent