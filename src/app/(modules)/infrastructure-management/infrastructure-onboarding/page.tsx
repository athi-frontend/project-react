"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import {
  useGetAllInfrastructureOnboarding,
  useDeleteInfrastructureOnboarding,
} from "@/hooks/modules/infrastructure-management/infrastructureOnboardingTabs";
import { InfrastructureOnboardingAPI } from "@/types/modules/infrastructure-management/infrastructureOnboardingTabs";
import {
  INFRASTRUCTURE_ONBOARDING_CONSTANTS,
  INFRASTRUCTURE_ONBOARDING_ROUTES,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";

/**
 * Classification : Confidential
 **/

const InfrastructureOnboardingList: React.FC = () => {
  const router = useRouter();
  const { data: infrastructureOnboardingData, isLoading } =
    useGetAllInfrastructureOnboarding();
  const deleteInfrastructureOnboardingMutation = useDeleteInfrastructureOnboarding();

  const getStatusValue = (statusId: number) => statusId === NUMBERMAP.ONE;

  /**
   * Function Name: handleEdit
   * Params: infrastructureId
   * Description: Navigate to edit page with infrastructure ID
   * Classification: Confidential
   */
  const handleEdit = (infrastructureId: number) => {
    router.push(INFRASTRUCTURE_ONBOARDING_ROUTES.EDIT(infrastructureId));
  };

  /**
   * Function Name: handleDelete
   * Params: infrastructureId
   * Description: Handle delete with confirmation dialog and API call
   * Classification: Confidential
   */
  const handleDelete = (infrastructureId: number) => {
    showActionAlert(STATUS.DELETE).then((result) => {
      if (result.isConfirmed) {
        deleteInfrastructureOnboardingMutation.mutate(infrastructureId);
      }
    });
  };

  // Column definitions for the table
  const columns = [
    {
      field: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.SNO.field,
      headerName: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.SNO.headerName,
      flex: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.SNO.flex,
    },
    {
      field: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_CATEGORY.field,
      headerName:
        INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_CATEGORY.headerName,
      flex: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_CATEGORY.flex,
    },
    {
      field: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_TYPE.field,
      headerName:
        INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_TYPE.headerName,
      flex: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_TYPE.flex,
    },
    {
      field: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_NAME.field,
      headerName:
        INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_NAME.headerName,
      flex: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_NAME.flex,
    },
    {
      field: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_SERIAL_NO.field,
      headerName:
        INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_SERIAL_NO.headerName,
      flex: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.INFRASTRUCTURE_SERIAL_NO.flex,
    },
    {
      field: 'status_slug',
      headerName: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.STATUS.headerName,
      flex: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.STATUS.flex,
      renderCell: (params: GridRenderCellParams<InfrastructureOnboardingAPI>) => (
        <StatusTypography value={params.row.status_id} />
      ),
    },
    {
      field: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.ACTIONS.field,
      headerName: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.ACTIONS.headerName,
      flex: INFRASTRUCTURE_ONBOARDING_CONSTANTS.TABLE_COLUMNS.ACTIONS.flex,
      renderCell: (params: GridRenderCellParams<InfrastructureOnboardingAPI>) => (
        <ActionButton
          onDelete={() => handleDelete(params.row.infrastructure_id)}
          onEdit={() => handleEdit(params.row.infrastructure_id)}
          deleteDisabled={!getStatusValue(params.row.status_id)}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={INFRASTRUCTURE_ONBOARDING_ROUTES.CREATE}
        title={INFRASTRUCTURE_ONBOARDING_CONSTANTS.TITLE}
        Table={
          <DataTable
            rows={infrastructureOnboardingData?.data ?? []}
            columns={columns}
            IdField={INFRASTRUCTURE_ONBOARDING_CONSTANTS.DATATABLE_IDFIELD}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default InfrastructureOnboardingList;
