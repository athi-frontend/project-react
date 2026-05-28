"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { useVerificationPlans, useDeleteVerificationPlan } from "@/hooks/modules/dnd/useProjectStages";
import {
  ACTIONS,
  ACTIONS_FIELD,
  DIR_NUMBER,
  S_NO,
  S_NO_FIELD,
  ID,
  FLEX,
  VERIFICATION_PLAN_PAGE,
  DIR_CATEGORY,
  DIR,
  CATEGORY,
  DELETE,
  STATUS_FIELD,
  STATUS_HEADER,
} from "@/constants/components/ui/prototypeForm";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import { Tooltip } from "@mui/material";
import { NUMBERMAP, STATUS } from "@/constants/common";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import GlobalLoader from "@/components/shared/LoadingSpinner";

/**
    Classification : Confidential
**/

export default function VerificationPlansPage() {
  const router = useRouter();
  const params = useParams();
  const { order_id, id } = params;
  const projectStageOrderId = parseInt(order_id as string, NUMBERMAP.TEN);

  const { data: verificationData, isFetching: verificationFetching } = useVerificationPlans(projectStageOrderId);
  const { mutate: deleteVerificationPlan, isPending: isDeleting } = useDeleteVerificationPlan();
  const [isNavigating, setIsNavigating] = useState<boolean>(false);


  const renderActionCell = (params: GridRenderCellParams) => {
    const handleEditClick = () => {
      setIsNavigating(true);
      const verificationPlanId = params.row.verification_plan_id;
      router.push(`/dnd/verification-plan/info/${verificationPlanId}/${order_id}/${id}`);
    };

    const handleDeleteClick = async () => {
      const result = await showActionAlert(DELETE);
      if (result.isConfirmed) {
        const verificationPlanId = params.row.verification_plan_id;
        deleteVerificationPlan(verificationPlanId, {
          onSuccess: () =>{
            showActionAlert(STATUS.SUCCESS);
          },
          onError: () => {
            showActionAlert(STATUS.FAILED);
          },
        });
      }
    };

    return (
      <ActionButton 
        onEdit={handleEditClick} 
        onDelete={handleDeleteClick}
        deleteDisabled={params.row.status !== NUMBERMAP.ONE}
      />
    );
  };

  const renderDirCategoryCell = (params: GridRenderCellParams) => {
    const dirCategoryArray = params.row.dir_category;
    if (!Array.isArray(dirCategoryArray) || dirCategoryArray.length === NUMBERMAP.ZERO) {
      return '-';
    }
    const categories = dirCategoryArray
      .map((item: { dir_category?: string }) => item.dir_category)
      .filter(Boolean)
      .join(', ');
    const displayText = categories || '-';
    
    return (
      <Tooltip title={displayText} arrow placement="top-start">
        <span>{displayText}</span>
      </Tooltip>
    );
  };

  const renderDirCell = (params: GridRenderCellParams) => {
    const dirArray = params.row.dir;
    if (!Array.isArray(dirArray) || dirArray.length === NUMBERMAP.ZERO) {
      return '-';
    }
    const dirNumbers = dirArray
      .map((item: { dir_id?: string }) => item.dir_id)
      .filter(Boolean)
      .join(', ');
    const displayText = dirNumbers || '-';
    
    return (
      <Tooltip title={displayText} arrow placement="top-start">
        <span>{displayText}</span>
      </Tooltip>
    );
  };

  const columns: GridColDef[] = [
    {
      field: S_NO_FIELD,
      headerName: S_NO,
      flex: FLEX.HALF,
    },
    {
      field: CATEGORY,
      headerName: DIR_CATEGORY,
      flex: FLEX.ONE,
      renderCell: renderDirCategoryCell,
    },
    {
      field: DIR,
      headerName: DIR_NUMBER,
      flex: FLEX.ONE,
      renderCell: renderDirCell,
    },
    {
      field: STATUS_FIELD,
      headerName: STATUS_HEADER,
      flex: FLEX.QUARTER,
      renderCell: (params: GridRenderCellParams) => {
    return <StatusTypography value={params.value} />
  }},
    {
      field: ACTIONS_FIELD,
      headerName: ACTIONS,
      flex: FLEX.HALF,
      renderCell: renderActionCell,
    },
  ];

  const handleOpenAdd = () => {
    setIsNavigating(true);
    router.push(`/dnd/verification-plan/info/create/${order_id}/${id}`);
  };

  const anyLoading = () => {
    if (isNavigating) return true;
    if (isDeleting) return true;
    return false;
  }

  return (
    <PageContainer>
      <GlobalLoader loading={anyLoading()} />
      <CommonSharedTale
        title={VERIFICATION_PLAN_PAGE.VERIFICATION_PLAN_TITLE}
        pathName={`/dnd/verification-plan/info/create/${order_id}/${id}`}
        hanldeClick={handleOpenAdd}
        Table={
          <DataTable
            rows={verificationData?.data ?? []}
            columns={columns}
            IdField={ID}
            checkbox={false}
            loading={verificationFetching}
          />
        }
      />
    </PageContainer>
  );
}