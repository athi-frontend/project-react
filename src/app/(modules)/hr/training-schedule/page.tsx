"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ActionButton, DataTable, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { PageContainer } from "@/styles/common";
import { NUMBERMAP } from "@/constants/common";
import { fetchAllTraining } from "@/hooks/modules/hr/useTrainingSchedule";
import { magicGridRowSave } from "@/lib/utils/magicSave";
import magicSaveConstants from "@/constants/magicSave";
import { COMMON_CONSTANTS, convertUtcToLocal, withFullName } from "@/lib/utils/common";
import { DATA_GRID_CONSTANTS } from "@/constants/modules/hr/employeeList";
import { CLASS_NAME, CONTAINER_ID, DATA_FIELD_NAME, DATA_SOURCE_NAME, DELETE_CLASS, FIELDS, HEADER_NAME, ID_FIELD, ROUTER_PATH, TITLE } from "@/constants/modules/hr/trainingSchedule";

/**
*Classification : Confidential
**/

const { DELETE_ALERT, SUCCESS_ALERT, FAILED_ALERT, UPDATE } = COMMON_CONSTANTS;

const TrainingSchedule: React.FC = () => {
  const formRef = useRef(null);
  const { data: Rowsdata, refetch } = fetchAllTraining();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, data: { id: number; status: number }) => {
    const currentTarget = e.currentTarget;
    const result = await showActionAlert(DELETE_ALERT);
    if (result.isConfirmed) {
      const newStatus = NUMBERMAP.ZERO;
      currentTarget.setAttribute(magicSaveConstants.DATA_STATUS, newStatus.toString());
      if ('value' in currentTarget) {
        currentTarget.value = newStatus.toString();
      }

      const response = await magicGridRowSave({
        containerID: formRef.current.id,
        scopedEvents: currentTarget,
        eventClass: DELETE_CLASS,
        dataframeworkOperatorType: UPDATE,
        keys: {
          eqms_hr_training_schedule: {
            id: data.id,
          },
        },
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
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
      field: FIELDS.S_NO,
      headerName: HEADER_NAME.SNO,
      flex: NUMBERMAP.HALF ,
      renderCell: (params: any) => params.api.getRowIndexRelativeToVisibleRows(params.id) + NUMBERMAP.ONE,
    },
    {
      field: FIELDS.TITLE,
      headerName: HEADER_NAME.TITLE_TRAINING,
      flex: NUMBERMAP.ONE ,
    },
    {
      field: FIELDS.DATE,
      headerName: HEADER_NAME.DATE_TRAINING,
      flex: NUMBERMAP.ONE ,
      renderCell: (params: any) => convertUtcToLocal(params.row.date_of_training),
    },
    {
      field: FIELDS.FULL_NAME,
      headerName: HEADER_NAME.NAME_OF_TRAINER,
      flex: NUMBERMAP.ONE ,
    },
    {
      field: FIELDS.LOCATION,
      headerName: HEADER_NAME.LOCATION,
      flex: NUMBERMAP.ONE ,
    },
    {
      field: FIELDS.ACTION,
      headerName: HEADER_NAME.ACTION,
      flex: NUMBERMAP.ONE ,
      renderCell: (params: any) => (
        <div className={CLASS_NAME}>
          <ActionButton
            onEdit={() => {
              router.push(`/hr/training-schedule/${params.row.id}`);
            }}
            disabled={!params.row.status}
            onDelete={(e) => handleDelete(e, params.row)}
            dataSourceName={DATA_SOURCE_NAME.TRAINING_SCHEDULE}
            dataFieldName={DATA_FIELD_NAME.STATUS}
            dataStatus={params.row.status}
            value={params.row.status}
            deleteButtonProps={{
              className: {CLASS_NAME},
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    refetch();
  }, []);

  return (
    <PageContainer ref={formRef} id={CONTAINER_ID}>
      <CommonSharedTale
        title={TITLE}
        pathName={ROUTER_PATH.CREATE_PATH}
        Table={
          <DataTable
            rows={withFullName((Rowsdata?.data ?? []),'trainer_first_name','trainer_last_name')}
            columns={columns}
            IdField={ID_FIELD}
            checkbox={false}
            customClassName={DATA_GRID_CONSTANTS.CUSTOM_CLASS_NAME}
          />
        }
      />
    </PageContainer>
  );
};

export default TrainingSchedule;