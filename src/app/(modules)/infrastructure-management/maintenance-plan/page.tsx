"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { useGetMaintenancePlanList, useDeleteMaintenancePlan } from "@/hooks/modules/infrastructure-management/infrastructureOnboardingTabs";
import { 
  MAINTENANCE_PLAN_ROUTES,
  MAINTENANCE_PLAN_TABLE_FIELDS as TABLE_FIELDS,
  MAINTENANCE_PLAN_TABLE_HEADERS as TABLE_HEADERS,
  MAINTENANCE_PLAN_TABLE_CONFIG,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";

const { EDIT_MAINTENANCE_PLAN_PATH, CREATE_MAINTENANCE_PLAN_PATH, TABLE_TITLE } = {
  EDIT_MAINTENANCE_PLAN_PATH: MAINTENANCE_PLAN_ROUTES.EDIT_MAINTENANCE_PLAN_PATH,
  CREATE_MAINTENANCE_PLAN_PATH: MAINTENANCE_PLAN_ROUTES.CREATE_MAINTENANCE_PLAN_PATH,
  TABLE_TITLE: MAINTENANCE_PLAN_TABLE_CONFIG.TABLE_TITLE,
};
const TABLE_ID_FIELD = MAINTENANCE_PLAN_TABLE_CONFIG.TABLE_ID_FIELD;
import { GridRenderCellParams } from "@mui/x-data-grid";
import { TableFilters } from "@/styles/components/ui/datatable";

/**
 * Classification : Confidential
 **/

const MaintenancePlanList: React.FC = () => {
  const router = useRouter();
  const { data: maintenancePlanResponse, isLoading } = useGetMaintenancePlanList();
  const deleteMaintenancePlanMutation = useDeleteMaintenancePlan();

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(EDIT_MAINTENANCE_PLAN_PATH(id));
  };

   const handleDelete = (maintenance_id: number) => {
    // Ensure backend validates user has delete permissions for this maintenance plan
    // Ensure backend validates that the maintenance plan has no dependencies before deletion to prevent orphaned records
    showActionAlert(STATUS.DELETE).then((result) => {
      if (result.isConfirmed) {
        deleteMaintenancePlanMutation.mutate(maintenance_id, {
          onSuccess: () => {
            showActionAlert(STATUS.SUCCESS);
          },
          onError: () => {
            showActionAlert(STATUS.FAILED);
          },
        });
      }
    });
  };

  // Column definitions for the table matching the design
  const columns = [
    {
      field: TABLE_FIELDS.SNO,
      headerName: TABLE_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_FIELDS.INFRA_CATEGORY,
      headerName: TABLE_HEADERS.INFRA_CATEGORY,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.INFRA_TYPE,
      headerName: TABLE_HEADERS.INFRA_TYPE,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.STATUS,
      headerName: TABLE_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      valueGetter: (value, row) => {
        return row[TableFilters.statusColumn] == NUMBERMAP.ONE ? NUMBERMAP.ONE : NUMBERMAP.ZERO;
      },
      renderCell: (params: GridRenderCellParams) => {
        return <StatusTypography value={params.value} />;
      },
    },
    {
      field: TABLE_FIELDS.ACTION,
      headerName: TABLE_HEADERS.ACTION,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          onDelete={() => handleDelete(params.row.maintenance_id)}
          onEdit={() => handleEdit(params.row.maintenance_id)}
          editDisabled={false}
          deleteDisabled={params.row.status !== NUMBERMAP.ONE}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={CREATE_MAINTENANCE_PLAN_PATH}
        title={TABLE_TITLE}
        hanldeClick={() => router.push(CREATE_MAINTENANCE_PLAN_PATH)}
        Table={
          <DataTable
            rows={maintenancePlanResponse?.data ?? []}
            columns={columns}
            IdField={TABLE_ID_FIELD}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default MaintenancePlanList;

