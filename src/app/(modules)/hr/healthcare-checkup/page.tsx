"use client";
import React, { useEffect, useState } from "react";
import { ActionButton, DataTable } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { useHealthCheckupData } from "@/hooks/modules/hr/useHealthCheckup";
import { HealthCheckupResponse } from "@/types/modules/hr/healthCheckup";
import { COMMON_CONSTANTS, formatDate, withFullName } from "@/lib/utils/common";
import {
  HEALTH_CHECKUP_TABLE_COLUMNS,
  TABLE_HEADERS,
  HEALTH_CHECKUP_DECLARATION,
  PATHNAME,
  ID,
  RESPONSE_KEYS,
  CUSTOM_CLASS_NAME,
  DATA_GRID_DELETE,
  EVENT_CLASS,
  CONTAINER_ID, DATE_FORMATTER,
} from "@/constants/modules/hr/healthCheckup";
import { magicGridRowSave } from "@/lib/utils/magicSave";
import magicSaveConstants from "@/constants/magicSave";
import { showActionAlert } from "@/components/ui/alert-modal/ActionAlert";
import { useRouter } from "next/navigation";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { NUMBERMAP } from "@/constants/common";
import dayjs from "dayjs"

/**
*Classification : Confidential
**/
const { DELETE_ALERT, SUCCESS_ALERT, FAILED_ALERT, IN_ACTIVE_STATUS, UPDATE, ACTIVE_STATUS } =
  COMMON_CONSTANTS;

const HealthCheckupPage: React.FC = () => {
  const [tableData, setTableData] = useState<HealthCheckupResponse[]>([]);
  const { data: healthCheckupResponse, isLoading, refetch } = useHealthCheckupData();
  const router = useRouter()

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    healthCheckupId: number,
    currentStatus: number
  ) => {
    const currentTarget = e.currentTarget;
    const result = await showActionAlert(DELETE_ALERT);
    if (result.isConfirmed) {
      const newStatus = currentStatus == ACTIVE_STATUS ? IN_ACTIVE_STATUS : ACTIVE_STATUS;
      currentTarget.setAttribute(
        magicSaveConstants.DATA_STATUS,
        newStatus.toString()
      )
      if ('value' in currentTarget) {
        currentTarget.value = newStatus.toString()
      }
        const response = await magicGridRowSave({
          containerID: CONTAINER_ID,
          scopedEvents: currentTarget,
          eventClass: EVENT_CLASS,
          dataframeworkOperatorType: UPDATE,
          dataframeworkOtherParamsBag: {},
          keys: {
            [RESPONSE_KEYS.HEALTH_CHECKUP]: {
              id: healthCheckupId,
            },
          },
          diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
        });

        if (response?.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE) {
          showActionAlert(SUCCESS_ALERT);
          refetch();
        } else {
          showActionAlert(FAILED_ALERT);
        }
    }
  };

  const columns = [
    {
      field: HEALTH_CHECKUP_TABLE_COLUMNS.SERIAL_NO,
      headerName: TABLE_HEADERS.SERIAL_NO,
      flex:NUMBERMAP.HALF,
      sortable: false,
      renderCell: (params: any) => params.value ?? "",
    },
       {
      field: HEALTH_CHECKUP_TABLE_COLUMNS.EMPLOYEE_NAME,
      headerName: TABLE_HEADERS.EMPLOYEE_NAME,
      flex:NUMBERMAP.ONE,
      },
        {
      field: HEALTH_CHECKUP_TABLE_COLUMNS.DEPARTMENTS,
      headerName: TABLE_HEADERS.DEPARTMENTS,
      flex:NUMBERMAP.ONE,
      renderCell: (params: any) => params.value ?? "",
    },
    {
      field: HEALTH_CHECKUP_TABLE_COLUMNS.SUBMITTED_DATE,
      headerName: TABLE_HEADERS.SUBMITTED_DATE,
      flex:NUMBERMAP.ONE,
      renderCell: (params: any) => formatDate(params.value) ?? "",
    },

    {
      field: HEALTH_CHECKUP_TABLE_COLUMNS.STATUS,
      headerName: TABLE_HEADERS.STATUS,
      flex:NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <StatusTypography value={params.value}/>
      ),
    },
    {
      field: HEALTH_CHECKUP_TABLE_COLUMNS.ACTIONS,
      headerName: TABLE_HEADERS.ACTIONS,
      flex:NUMBERMAP.HALF,
      sortable: false,
      renderCell: (params: any) => (
        <div className={DATA_GRID_DELETE}>
          <ActionButton
            value={params.row.status}
            onDelete={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleDelete(e, params.row.id, params.row[HEALTH_CHECKUP_TABLE_COLUMNS.STATUS])
            }
            dataSourceName={RESPONSE_KEYS.HEALTH_CHECKUP}
            dataFieldName={HEALTH_CHECKUP_TABLE_COLUMNS.STATUS}
            disabled={!params.row.status}
            onEdit={() => {router.push("/hr/healthcare-checkup/"+params.row.id)}}
            deleteButtonProps={{
              className: DATA_GRID_DELETE,
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (healthCheckupResponse?.data) {
      const output = healthCheckupResponse.data.map((item: HealthCheckupResponse, index: number) => ({
        ...item,
        [HEALTH_CHECKUP_TABLE_COLUMNS.SERIAL_NO]: index + NUMBERMAP.ONE,
        [HEALTH_CHECKUP_TABLE_COLUMNS.SUBMITTED_DATE]: item.last_submitted_date
        ? dayjs(item.last_submitted_date).format(DATE_FORMATTER) : "",
        [HEALTH_CHECKUP_TABLE_COLUMNS.NEXT_VISIT]: item.next_preventive_visit ?? "",
        [HEALTH_CHECKUP_TABLE_COLUMNS.STATUS]: item.status,
      
        [HEALTH_CHECKUP_TABLE_COLUMNS.ACTIONS]: item.health_checkup_id,
        id: item.health_checkup_id,
      }));
      setTableData(output);
    }
  }, [healthCheckupResponse]);

  return (
  
        <CommonSharedTale
          title={HEALTH_CHECKUP_DECLARATION}
          pathName={PATHNAME}
          Table={
            <DataTable
              rows={withFullName((tableData ?? []),'employee_first_name','employee_last_name')}
              columns={columns}
              IdField={ID}
              checkbox={false}
              loading={isLoading}
              customClassName={CUSTOM_CLASS_NAME}
            />
          }
        />
  )
}

export default HealthCheckupPage;