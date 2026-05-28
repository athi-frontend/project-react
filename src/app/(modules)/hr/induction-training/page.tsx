"use client";
import React, { useEffect, useRef } from "react";
import { ActionButton, DataTable } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { COMMON_CONSTANTS, withFullName } from "@/lib/utils/common";
import {
  HEALTH_CHECKUP_TABLE_COLUMNS,
  TABLE_HEADERS,
  CUSTOM_CLASS_NAME,
  DATA_GRID_DELETE,
} from "@/constants/modules/hr/healthCheckup";
import { magicGridRowSave } from "@/lib/utils/magicSave";
import magicSaveConstants from "@/constants/magicSave";
import { showActionAlert } from "@/components/ui/alert-modal/ActionAlert";
import { useRouter } from "next/navigation";
import { NUMBERMAP } from "@/constants/common";
import { useInductionTrainingData } from "@/hooks/modules/hr/useInductionTraining";
import { INDUCTION_TRAINING_CONSTANTS } from "@/constants/modules/hr/inductionTraining";
import { InlineStyles } from "@/styles/modules/dnd/dir";
import { DATA_GRID_DELETE_CLASS } from "@/constants/modules/hr/employeeList";
import { PageContainer } from "@/styles/common";

/**
*Classification : Confidential
**/
const { DELETE_ALERT, SUCCESS_ALERT, FAILED_ALERT, UPDATE } =
  COMMON_CONSTANTS;

const HealthCheckupPage: React.FC = () => {
  const formRef=useRef(null);
  const router = useRouter()
  const { data: inductionListResponse,refetch } = useInductionTrainingData();
  
 const handleDelete = async (e: React.MouseEvent, data: {}) => {
    const currentTarget = e.currentTarget;
    const result = await showActionAlert(DELETE_ALERT);
    if (result.isConfirmed) {
      const target = currentTarget;

      // Read current status
      const currentStatus = target.getAttribute(magicSaveConstants.DATA_STATUS);

      // Define new status
      
      const newStatus = currentStatus?.toString() === COMMON_CONSTANTS.ACTIVE_STATUS ? COMMON_CONSTANTS.IN_ACTIVE_STATUS : COMMON_CONSTANTS.ACTIVE_STATUS;
            currentTarget.setAttribute(
              magicSaveConstants.DATA_STATUS,
              newStatus.toString()
            )

      // Update the data-status attribute
      target.setAttribute(magicSaveConstants.DATA_STATUS, newStatus);

      // Also update the value property if it exists
      if ("value" in target) {
        target.value = NUMBERMAP.ZERO;
      }

      magicSaveDelete(target, data.induction_header_id);
    }
  };

  const magicSaveDelete = async (currentTarget, hrId) => {
      const formId = formRef.current.id;
      const response = await magicGridRowSave({
        containerID: formId,
        scopedEvents: currentTarget,
        eventClass: DATA_GRID_DELETE_CLASS,
        dataframeworkOperatorType: COMMON_CONSTANTS.UPDATE,
        keys: {
           eqms_hr_induction_training_employee_header: {
            id: hrId,
          },
        },
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
      });
      if (response?.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE) {
        showActionAlert(SUCCESS_ALERT);
      } else {
        showActionAlert(FAILED_ALERT);
      }
      refetch();
    };
  const columns = [
    {
      field: "sno",
      headerName: TABLE_HEADERS.SERIAL_NO,
      flex: NUMBERMAP.HALF,
      sortable: false,
      renderCell: (params) => {
        const index = params.api.getAllRowIds().indexOf(params.id)
        return index + NUMBERMAP.ONE;
      }
    },
    {
      field: 'fullName',
      headerName: TABLE_HEADERS.EMPLOYEE_NAME,
      flex: NUMBERMAP.ONE,
    },
    {
      field: "employee_role",
       headerName: "Role",
      flex: NUMBERMAP.ONE,
      sortable: true,
    },
    {
      field: "employee_department",
      headerName: TABLE_HEADERS.DEPARTMENTS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => params.value ?? "",
    },
    {
      field: "employee_designation",
      headerName: TABLE_HEADERS.DESIGNATION,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => params.value ?? "-",
    },
    {
      field: "status",
      headerName: TABLE_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        return (
          <span
                          style={
                            params.value === COMMON_CONSTANTS.ACTIVE_STATUS
                              ? InlineStyles.statusActive
                              : InlineStyles.statusInactive
                          }
                        >
                          {params.value === COMMON_CONSTANTS.ACTIVE_STATUS ? COMMON_CONSTANTS.ACTIVE_STATUS_TEXT : COMMON_CONSTANTS.IN_ACTIVE_STATUS_TEXT}
                        </span>
        )
      }
    },
    {
      field: HEALTH_CHECKUP_TABLE_COLUMNS.ACTIONS,
      headerName: TABLE_HEADERS.ACTIONS,
      flex: NUMBERMAP.HALF,
      sortable: false,
      renderCell: (params: any) => (
        <div className={DATA_GRID_DELETE}>
          <ActionButton
            value={params.row.status??NUMBERMAP.ONE}
            onDelete= {(e) => handleDelete(e, params.row)}
            disabled= {params.row.status === NUMBERMAP.ZERO}
            dataSourceName={"eqms_hr_induction_training_employee_header"}
            data-status={params.row.status}
            dataFieldName={HEALTH_CHECKUP_TABLE_COLUMNS.STATUS}
            onEdit={() => { router.push("/hr/induction-training/" + params.row.induction_header_id) }}
          deleteButtonProps={{
            className: DATA_GRID_DELETE,
          }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    refetch()
  }, []);
  return (
<PageContainer  ref={formRef}
    id='HR_INDUCTION' >
    <CommonSharedTale
      title={INDUCTION_TRAINING_CONSTANTS.LABELS.INDUCTION_TRAINING}
      pathName={"/hr/induction-training/create"}
      Table={
        <DataTable
          rows={withFullName((inductionListResponse?.data ?? []),'employee_first_name','employee_last_name')}
          columns={columns}
          IdField={"induction_header_id"}
          checkbox={false}
          customClassName={CUSTOM_CLASS_NAME}
        />
      }
    />
    </PageContainer>
  )
}

export default HealthCheckupPage;