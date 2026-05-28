"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, Grid2, useTheme } from "@mui/material";
import { ButtonGroup, DataTable, InputField, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import Checkbox from "@mui/material/Checkbox";
import { useInductionTrainingById, useInductionTrainingTopics } from "@/hooks/modules/hr/useInductionTraining";
import { useRecordGenerationHelper } from '@/hooks/modules/hr/useRecordGeneration';
import { InductionTrainingResponse } from "@/types/modules/hr/inductionTraining";
import { INDUCTION_TRAINING_CONSTANTS } from "@/constants/modules/hr/inductionTraining";
import { magicGridSave } from "@/lib/utils/magicSave";
import magicSaveConstants from "@/constants/magicSave";
import { NUMBERMAP } from "@/constants/common";
import DatePicker from "@/components/ui/data-picker/UTCDatePicker";
import { DateTime } from 'luxon';
import { useDownloadFile } from "@/hooks/useCommonDropdown";
import axios from "axios";
import { handleFileDownloadUtil, COMMON_CONSTANTS, convertMuiDayjsToUTC, convertUtcToLocal } from "@/lib/utils/common";
import { STYLE_HEIGHT, HEIGHT, STYLE_NEW, PageContainer, SXSTYLE, Input_Field, TableErrorStyle } from "@/styles/modules/hr/inductionTraining";
import { FAILED } from "@/constants/modules/hr/healthCheckup";
import { useAllEmployees } from "@/hooks/modules/hr/useEmployeeList";
import { CommonInlineStyles, P20P40 } from "@/styles/common";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import { useParams, useRouter } from "next/navigation";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
*Classification : Confidential
**/
const { DAIGNOSTICS } = magicSaveConstants;
const { FAILED_ALERT, INDEX_ZERO } = COMMON_CONSTANTS;

const InductionTrainingPage: React.FC = () => {
  const router = useRouter();
  const [templateID, setTemplateID] = useState<number>(NUMBERMAP.ZERO);
  const [tableData, setTableData] = useState<any[]>([]);
  const id = useParams().id as string;
  const [tableUpdate, setTableUpdate] = useState(false);
  const { data: inductionTrainingResponse, isLoading:inductionListLoading } = useInductionTrainingTopics();
  const { data: inductionTrainingData, refetch: byIdRefetch } = useInductionTrainingById(id);
  const containerRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;
  const { refetch } = useDownloadFile(templateID);
  const [downloadDocName, setDownloadDocName] = useState<string | null>(null);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const { data: employeeList, refetch: employeeListAll } = useAllEmployees(NUMBERMAP.ONE,'Approved');
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState({ role_name: "-", department_name: "-", designation: '-' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [inductionId, setInductionId] = useState<number>(NUMBERMAP.ZERO)
  const [pagination , setPagination] = useState({page:NUMBERMAP.ZERO,pageSize:NUMBERMAP.TEN})
  const theme = useTheme();

  const { draftSave, clearDraftSave, isDraftSaving,draftData, fetchDraft,checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'induction_training',
    context_instance_id:Number(id)?id:null,
    enableFetch:true
  })
  // Record generation hook
  const { generateDocumentFromContextIds } = useRecordGenerationHelper();
  // Log useDownloadFile hook output
  useEffect(() => {
    if (inductionTrainingData?.data && inductionTrainingData?.data?.length>0) {
      const employeeIdFromData = inductionTrainingData.data[NUMBERMAP.ZERO]?.employee_id?.toString() ?? null;
      const induction_id = inductionTrainingData.data[NUMBERMAP.ZERO]?.induction_header_id ?? null;
      setEmployeeId(employeeIdFromData);
      setInductionId(induction_id)
      const selectedEmp = employeeData.find(emp => emp.id == employeeIdFromData);
      if (selectedEmp) {
        setSelectedEmployee({
          role_name: selectedEmp.role_name ?? "",
          department_name: selectedEmp.department_name ?? "",
          designation: selectedEmp.designation ?? '-'
        });
      }
      const TrainingData = inductionTrainingData?.data[NUMBERMAP.ZERO]?.trainings ?? [];
      if (TrainingData.length > NUMBERMAP.ZERO) {
        const responseData = tableData.map((item: any, index: number) => {
             let training = TrainingData.find((t: any) => t.topic_id == item.induction_topic_id);
          if (!training && item.topic) {
            training = TrainingData.find((t: any) => t.topic === item.topic);
          }
          training ??= TrainingData[index];
          
          if (training) {
            return {
              ...item,
              completed: training.is_complete,
              fk_eqms_organization_employee_id: training.conducted_by?.toString() ?? "",
              conductedon: training.conducted_on ?? '',
            };
          } 
           return item;
        });
        setTableData(responseData);
         setTableUpdate(true);
      }
    }
  }, [inductionTrainingData])

  const updateEmployeeData = (id:string|number)=>{
    const selectedEmp = employeeData.find(emp => emp.id == id) ?? null;
    if (selectedEmp) {
      setSelectedEmployee({
        role_name: selectedEmp.role_name ?? "",
        department_name: selectedEmp.department_name ?? "",
        designation: selectedEmp.designation ?? '',
        employee_name:selectedEmp.employee_name ?? ''
      });
    }else{
      setSelectedEmployee({
        role_name:  "-",
        department_name: "-",
        designation: '-'
      })
    }
  }
  useEffect(() => {
      if(draftData?.data){
        if(draftData?.data?.tableData){
          setTableData(draftData.data.tableData)
        }
          setEmployeeId(draftData?.data?.employeeId)
          setInductionId(draftData?.data?.induction_header_id??null)

      }
  }, [draftData]);

  useEffect(() => {
    fetchDraft()
  }, [])

 // Common method to clear table error
  const clearTableError = () => {
    setErrors((prev) => ({ ...prev, table: '' }));
  };
 
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setTableData((prev) => {
      const updated = prev.map((row) =>
        row.id === id ? { ...row, completed: checked } : row
      );
        handleDraftSave(updated,employeeId,inductionId);
      return updated;
    });
    // Clear table error when user checks completed checkbox
    if (checked) {
      clearTableError();
    }
  };

  const handlePaginationUpdate = (data)=>{
    setPagination(data)
  }
  function updateRowWithSelectedEmployee(row: any, id: string, value: string) {
    if (row.id === id) {
      const selectedEmployee = employeeData.find((opt) => opt.id == value);
      return {
        ...row,
        conductedby: selectedEmployee ? selectedEmployee.employee_name : "",
        fk_eqms_organization_employee_id: value,
      };
    }
    return row;
  }

  const handleDropdownChange = (id: string, value: string) => {
    setTableData((prev) => {
      const updated = prev.map((row) => updateRowWithSelectedEmployee(row, id, value));
        handleDraftSave(updated,employeeId,inductionId);
      return updated;
    });
    // Clear table error when user selects conducted by
    if (value) {
      clearTableError();
    }
  };

   const handleDatePickerChange = (id: string, value: Date) => {
    const utcValue = convertMuiDayjsToUTC(value);
    setTableData((prev) => {
      const updated = prev.map((row) =>
        row.id === id ? { 
          ...row, 
          conductedon: utcValue ?? ''
        } : row
      );
        handleDraftSave(updated,employeeId,inductionId);
      return updated;
    });
    // Clear table error when user selects conducted on date
    if (utcValue) {
      clearTableError();
    }
  };

  const handleDraftSave = (tableData: any[],employeeid:string|number,inductionId:number) => {
    const payload = {
      induction_header_id:inductionId??new Date().getTime(),
      employeeId: employeeid,
      tableData: tableData,
      employee_department: selectedEmployee.department_name,
      employee_role: selectedEmployee.role_name,
      employee_name: selectedEmployee.employee_name,
      type: 'draft',
      status: NUMBERMAP.ONE
    }
    draftSave({
      form_type: 'induction_training',
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }

  const handleDownloadSuccess = async (
    assetUrl: string,
    documentName: string
  ) => {
    const fileResponse = await axios.get(assetUrl, {
      responseType: INDUCTION_TRAINING_CONSTANTS.RESPONSE.BLOB,
    });
    const blob = fileResponse.data;
    const name = `Template_${documentName.replace(INDUCTION_TRAINING_CONSTANTS.REGEX.NUMBER, '_')}`;
    handleFileDownloadUtil({ blob, name });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (Number(templateID) && triggerDownload && downloadDocName) {
        const response = await refetch();
        if (response?.data) {
          await handleDownloadSuccess(
            response.data.data[INDEX_ZERO].assetUrl,
            downloadDocName
          );
        } else {
          showActionAlert(FAILED_ALERT);
        }

        setTriggerDownload(false);
      }
    };

    fetchData();
  }, [templateID, triggerDownload, refetch, downloadDocName]);

  const handleTemplateDownload = async (
    templateId: number,
    documentName: string
  ) => {
    setTemplateID(templateId);
    setDownloadDocName(documentName);
    setTriggerDownload(true);
  };

  

  const columns = [
    {
      field: INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.SERIAL_NO,
      headerName: INDUCTION_TRAINING_CONSTANTS.TABLE_HEADERS.SERIAL_NO,
      flex: NUMBERMAP.HALF,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: any) => {
  const visibleIndex = params.api.getRowIndexRelativeToVisibleRows(params.id)
          const index = (pagination.page * pagination.pageSize) + visibleIndex + NUMBERMAP.ONE
        return (
           <div>
            {
            index==NUMBERMAP.ONE?<><input readOnly style={CommonInlineStyles.displayNone} value={employeeId??''} data-sourcename="eqms_hr_induction_training_employee_header" data-fieldname="fk_eqms_organization_employee_id" />
              {index}</>:index
            }
          </div>
        )

      }
    },
    {
      field: INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.TOPIC,
      headerName: INDUCTION_TRAINING_CONSTANTS.TABLE_HEADERS.TOPIC,
      flex: NUMBERMAP.ONE,
    },
    {
      field: INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.DOCUMENT,
      headerName: INDUCTION_TRAINING_CONSTANTS.TABLE_HEADERS.DOCUMENT,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => {
        return (
        <Box>
          {params.row.document_id ? (
            <button
              type={INDUCTION_TRAINING_CONSTANTS.RESPONSE.BUTTON}
              onClick={() => handleTemplateDownload(params.row.document_id, params.row.document_name ?? `Document_${params.row.document_id}`)}
              style={STYLE_NEW}
              tabIndex={NUMBERMAP.ZERO}
              aria-label={`Download document ${params.row.document_id}`}
            >
              Document: {params.row.document_id}
            </button>

          ) : (
            INDUCTION_TRAINING_CONSTANTS.DOCUMENT.NO_DOCUMENT
          )}
        </Box>
        )
      }
    },
    {
      field: INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.CONDUCTED_BY,
      headerName: INDUCTION_TRAINING_CONSTANTS.TABLE_HEADERS.CONDUCTED_BY,
      flex: NUMBERMAP.ONE,
      sortable: false,
      renderCell: (params: any) => (
        <Box sx={Input_Field}>
          <InputField
            label=""
            placeholder={INDUCTION_TRAINING_CONSTANTS.DROPDOWN.SELECT}
            isDropdown
            keyField={INDUCTION_TRAINING_CONSTANTS.CONTAINER.ID}
            valueField={INDUCTION_TRAINING_CONSTANTS.CONTAINER.EMPLOYEE_NAME}
            value={params.row.fk_eqms_organization_employee_id ?? ""}
            onChange={(value) => handleDropdownChange(params.row.id, value)}
            options={employeeData}
            dataSourceName={INDUCTION_TRAINING_CONSTANTS.DATA.DATA_SOURCE_NAME}
            dataFieldName={INDUCTION_TRAINING_CONSTANTS.DATA.USER_ID_FIELD_NAME}
            dataIsAutocomplete={params.row.fk_eqms_organization_employee_id}
          />
          <input readOnly style={INDUCTION_TRAINING_CONSTANTS.STYLES.STYLE} data-sourcename={INDUCTION_TRAINING_CONSTANTS.DATA.DATA_SOURCE_NAME} data-fieldname={INDUCTION_TRAINING_CONSTANTS.DATA.USER_ID_FIELD_NAME} value={params.row.fk_eqms_organization_employee_id ?? ''} />

          <input readOnly style={INDUCTION_TRAINING_CONSTANTS.STYLES.STYLE} data-sourcename={INDUCTION_TRAINING_CONSTANTS.DATA.DATA_SOURCE_NAME} data-fieldname={INDUCTION_TRAINING_CONSTANTS.DATA.DATA_FIELD_NAME} value={params.row.fk_eqms_hr_induction_training_topic_supporting_file_id ?? ''} />

        </Box>
      ),
    },
    {
      field: INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.CONDUCTED_ON,
      headerName: INDUCTION_TRAINING_CONSTANTS.TABLE_HEADERS.CONDUCTED_ON,
      flex: NUMBERMAP.ONE,
      height: HEIGHT,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box className={INDUCTION_TRAINING_CONSTANTS.DROPDOWN.EMPLOYEE_LIST} sx={STYLE_HEIGHT}>
           <input readOnly style={INDUCTION_TRAINING_CONSTANTS.STYLES.STYLE} data-sourcename={INDUCTION_TRAINING_CONSTANTS.DATA.DATA_SOURCE_NAME} data-fieldname={INDUCTION_TRAINING_CONSTANTS.FIELDS.CONDUCTED_ON} value={params.row.conductedon??''} />
            <DatePicker sx={SXSTYLE} label="" value={params.value!=""?DateTime.fromISO(params.value):null} onChange={(data) => { handleDatePickerChange(params.row.id, data) }} />
          </Box>
        );
      },
    },
    {
      field: INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.COMPLETED,
      headerName: INDUCTION_TRAINING_CONSTANTS.TABLE_HEADERS.COMPLETED,
      flex: NUMBERMAP.HALF,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        return (
          <Checkbox
            checked={params.row.completed?? false}
            onChange={(e) =>
              handleCheckboxChange(params.row.id, e.target.checked)
            }
            color={INDUCTION_TRAINING_CONSTANTS.VALUES.PRIMARY}
            sx={INDUCTION_TRAINING_CONSTANTS.STYLES.STYLE2}
            slotProps={{
              input: {
                "data-sourcename": INDUCTION_TRAINING_CONSTANTS.DATA.DATA_SOURCE_NAME,
                "data-fieldname": INDUCTION_TRAINING_CONSTANTS.FIELDS.IS_COMPLETE,
                "value": params.row.completed ? INDUCTION_TRAINING_CONSTANTS.VALUES.ONE : INDUCTION_TRAINING_CONSTANTS.VALUES.ZERO,
              },
            }}
          />
        );
      },
    },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!employeeId?.trim()) {
      newErrors.employee = INDUCTION_TRAINING_CONSTANTS.EMPLOYEE_ERROR;
    }
    
    // Check if at least one complete row has been filled by user (conducted by, conducted on, and completed)
    const hasFilledRow = tableData.some((row: any) => 
      row.fk_eqms_organization_employee_id && row.conductedon && row.completed
    );
    
    if (!hasFilledRow) {
      newErrors.table = INDUCTION_TRAINING_CONSTANTS.TABLE_ERROR;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === NUMBERMAP.ZERO;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    // Clear draft save when submitting final form
    clearDraftSave();
    
    try {
      const KEYS = id=='create'?{}:{eqms_hr_induction_training:{fk_eqms_hr_induction_training_employee_header_id: Number(inductionId)},
        eqms_hr_induction_training_employee_header: {
          id: Number(inductionId),
        }
      }
      const dataframeworkOtherParamsBag = {
        eqms_hr_induction_training: [{
          status: 1,
          fk_eqms_hr_induction_training_employee_header_id: Number(inductionId),
        }],
        eqms_hr_induction_training_employee_header: [{
          status: 1,
        }]
      };
      
      
      const response = await magicGridSave({
        currentFormRef: containerRef,
        scopedClasses: INDUCTION_TRAINING_CONSTANTS.CLASSES.SCOPED_CLASS,
        dataframeworkOperatorType: id=="create"?'insert':"update",
        dataframeworkOtherParamsBag: dataframeworkOtherParamsBag,
        keys:KEYS,
        headers: {},
        diagnosticFlag: DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
      });
    if (response.response.code === NUMBERMAP.TWOHUNDRED) {
        // Generate document after successful save using employee ID
        if (employeeId) {
          const empId = parseInt(employeeId, NUMBERMAP.TEN)
          if (!isNaN(empId)) {
            generateDocumentFromContextIds([empId])
          }
        }
        
        showActionAlert("success")
        router.push("/hr/induction-training")
      } else {
        showActionAlert(FAILED);
      }
    } catch {
      showActionAlert(FAILED);
    }
  };

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push("/hr/induction-training");
  };

  const isSaving = false;

  useEffect(() => {
    if (id != 'create' && !tableUpdate && !inductionListLoading) {
      byIdRefetch();
     
    }
  }, [tableData])
  useEffect(() => {
    if (inductionTrainingResponse?.data && employeeData.length > NUMBERMAP.ZERO && !draftData?.data) {
      const output = inductionTrainingResponse.data.map(
        (item: InductionTrainingResponse, index: number) => {
          const conductedByName = item.conducted_by
            ? employeeData.find((opt) => opt.id == item.conducted_by?.toString())?.employee_name ?? ""
            : "";
          let documentId = null;
        let documentTemplateId = null;

        // Check if supporting_files exists and has at least one element
        if (item.supporting_files && item.supporting_files.length > NUMBERMAP.ZERO) {
          documentId = item.supporting_files[NUMBERMAP.ZERO]?.fk_eqms_supporting_file_id ?? null;
          documentTemplateId = item.supporting_files[NUMBERMAP.ZERO]?.id ?? null;
        }
          return {
            ...item,
            id: item.induction_topic_id.toString(),
            [INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.SERIAL_NO]: index + NUMBERMAP.ONE,
            [INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.TOPIC]: item.topic,
            [INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.DOCUMENT]: documentId ? `Document: ${documentId}` : INDUCTION_TRAINING_CONSTANTS.DOCUMENT.NO_DOCUMENT,
            document_id: documentId ?? null,
            document_name: item.topic,
            [INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.CONDUCTED_BY]: conductedByName,
            fk_eqms_organization_employee_id: item.conducted_by?.toString() ?? "",
            [INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.CONDUCTED_ON]: item.conducted_on ? convertUtcToLocal(item.conducted_on) : '',
            [INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_TABLE_COLUMNS.COMPLETED]: item.is_complete === NUMBERMAP.ONE,
            fk_eqms_hr_induction_training_topic_supporting_file_id: documentTemplateId,
            document_template_id: item.documentId,
          };
        }
      );
      setTableData(output);
    }
  }, [inductionTrainingResponse, employeeData]);
  useEffect(() => {
    employeeListAll()
  }, [])

  // Set employee data in state when available
  useEffect(() => {
    if (employeeList?.data) {
      setEmployeeData(employeeList.data)
    }
  }, [employeeList])
  useEffect(()=>{
    updateEmployeeData(employeeId)
  },[employeeData.length>0 && employeeId])
  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <CommonSharedTale
        title={INDUCTION_TRAINING_CONSTANTS.LABELS.INDUCTION_TRAINING}
        Table={
          <Box ref={containerRef} id={INDUCTION_TRAINING_CONSTANTS.CONTAINER.CONTAINER_ID}>
            <Grid2 container spacing={NUMBERMAP.ONE} sx={P20P40}>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  label={"Employee Name *"}
                  onChange={(e) => {
                    setEmployeeId(e)
                    setErrors((prev) => ({ ...prev, employee: '' })); // Clear error when selection changes
                    updateEmployeeData(e)
                      handleDraftSave(tableData,e,inductionId);
                  }}
                  placeholder={"Select Employee"}
                  isDropdown
                  keyField="id"
                  valueField="employee_name"
                  options={employeeData}
                  value={employeeId ?? ""}
                  error={errors.employee}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <InfoField label={"Role"} value={selectedEmployee.role_name} />
              </Grid2>

              <Grid2 size={NUMBERMAP.SIX}>
                <InfoField label={"Department"} value={selectedEmployee.department_name} />
              </Grid2>

              <Grid2 size={NUMBERMAP.SIX}>
                <InfoField label={"Designation"} value={selectedEmployee.designation ?? '-'} />
              </Grid2>

            </Grid2>
            <DataTable
              rows={tableData}
              columns={columns}
              handlePageUpdate={(data)=>handlePaginationUpdate(data)}
              IdField={INDUCTION_TRAINING_CONSTANTS.CONTAINER.ID}
              checkbox={false}
              loading={inductionListLoading}
            />
            {errors.table && (
              <Box sx={{ color: theme.palette.error.main, ...TableErrorStyle }}>
                {errors.table}
              </Box>
            )}
       <Box sx={P20P40}>
             <ButtonGroup
              buttons={[
                {
                  label: INDUCTION_TRAINING_CONSTANTS.BUTTONS.CANCEL,
                  onClick: handleCancel,
                },
                {
                  label: INDUCTION_TRAINING_CONSTANTS.BUTTONS.SAVE,
                  onClick: handleSave,
                  disabled: isSaving ?? inductionListLoading,
                },
              ]}
            />
       </Box>
          </Box>
        }
      />

    </PageContainer>
  );
};

export default InductionTrainingPage;
