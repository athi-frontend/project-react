"use client";
import React, { useEffect, useRef } from "react";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { useAllEmployees } from "@/hooks/modules/hr/useEmployeeList";
import { showActionAlert } from "@/components/ui/alert-modal/ActionAlert";
import magicSaveConstants from "@/constants/magicSave";
import { COMMON_CONSTANTS } from "@/lib/utils/common";
import { magicGridRowSave } from "@/lib/utils/magicSave";
import { DATA_GRID_DELETE_CLASS, getEmployeeListColumns ,EMPLOYEE_LIST_CONSTANTS, MAGIC_SAVE_CONSTANTS, DATA_GRID_CONSTANTS} from "@/constants/modules/hr/employeeList";
import { EmployeeList } from "@/types/modules/hr/employeeList";
import { useRouter } from "next/navigation";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { useSelector } from "react-redux";
import { selectUserId } from '@/store/slices/menuSlice'

/**
*Classification : Confidential
**/
const { DELETE_ALERT, SUCCESS_ALERT, FAILED_ALERT } = COMMON_CONSTANTS;

const EmployeeListsPage: React.FC = () => {
  const formRef = useRef(null);
  const route = useRouter();
    const userId = useSelector(selectUserId)

  const { data: employeeResponse, isLoading, refetch } = useAllEmployees();

  // Map the response data to match our interface with proper null checking
  const employeeList: EmployeeList[] = React.useMemo(() => {
    if (!employeeResponse?.data) {
      return [];
    }

    return employeeResponse.data.map((employee: any) => ({
      id: employee.id,
      employee_name: employee.employee_name ?? "",
      department: employee.department_name ?? "",
      role: employee.role_name ?? "",
      status: employee.status,
    }));
  }, [employeeResponse]);

  const magicSaveDelete = async (currentTarget, hrId) => {
    const formId = formRef.current.id;
    const response = await magicGridRowSave({
      containerID: formId,
      scopedEvents: currentTarget,
      eventClass: DATA_GRID_DELETE_CLASS,
      dataframeworkOperatorType: COMMON_CONSTANTS.UPDATE,
      dataframeworkOtherParamsBag: {
        modified_date: MAGIC_SAVE_CONSTANTS.MODIFIED_DATE(),
        modified_by: userId,
        status: MAGIC_SAVE_CONSTANTS.STATUS_INACTIVE,
      },
      keys: {
        eqms_organization_employee: {
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

  const handleDelete = async (e: React.MouseEvent, data: {}) => {
    const currentTarget = e.currentTarget;
    const result = await showActionAlert(DELETE_ALERT);
    if (result.isConfirmed) {
      const target = currentTarget;

      // Read current status
      const currentStatus = target.getAttribute(magicSaveConstants.DATA_STATUS);

      // Define new status
      const newStatus =
        Number(currentStatus) === MAGIC_SAVE_CONSTANTS.STATUS_ACTIVE
          ? MAGIC_SAVE_CONSTANTS.STATUS_INACTIVE
          : MAGIC_SAVE_CONSTANTS.STATUS_ACTIVE;

      // Update the data-status attribute
      target.setAttribute(magicSaveConstants.DATA_STATUS, newStatus);

      // Also update the value property if it exists
      if ("value" in target) {
        target.value = newStatus;
      }

      magicSaveDelete(target, data.id);
    }
  };

  const renderStatusCell = (params: any) => (
      <StatusTypography value={params.value}/>
  );

  const renderActionCell = (params: any) => (
    <ActionButton
      onDelete={(e) => handleDelete(e, params.row)}
      onEdit={() => {
        route.push(EMPLOYEE_LIST_CONSTANTS.PATH_NAME+`/${params.row.id}`);
      }}
      disabled={!params.row.status}
      dataSourceName="eqms_organization_employee"
      dataFieldName="status"
      dataStatus={params.row.status}
      value={params.row.status}
    />
  );

  useEffect(() => {
    refetch();
  }, []);
  const columns = getEmployeeListColumns(renderStatusCell, renderActionCell);

  return (
    <PageContainer ref={formRef} id="HR_EMPLOYEE">
      <CommonSharedTale
        title={EMPLOYEE_LIST_CONSTANTS.TITLE}
        pathName={EMPLOYEE_LIST_CONSTANTS.PATH_NAME+"/create"}
        Table={
          <DataTable
            rows={employeeList}
            columns={columns}
            IdField={DATA_GRID_CONSTANTS.ID_FIELD}
            checkbox={DATA_GRID_CONSTANTS.CHECKBOX}
            loading={isLoading}
            customClassName={DATA_GRID_CONSTANTS.CUSTOM_CLASS_NAME}
          />
        }
      />
    </PageContainer>
  );
};

export default EmployeeListsPage;
