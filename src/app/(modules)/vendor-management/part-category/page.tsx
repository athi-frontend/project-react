"use client";
import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP } from "@/constants/common";
import {
  usePartCategoryList,
  useDeletePartCategory
} from "@/hooks/modules/vendor-management/usePartCategory";
import { 
  PAGE_TITLE,
  partCategoryColumns,
} from "@/constants/modules/vendor-management/partCategory";
import { COMMON_CONSTANTS } from "@/lib/utils/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";

/**
*Classification : Confidential
**/

const PartCategory: React.FC = () => {
  const router = useRouter();
  
  // API Integration - Fetch all part categories
  const { data: partCategoryData, isLoading } = usePartCategoryList();
  const deletePartCategoryMutation = useDeletePartCategory();

  // Action handlers - memoized to prevent unnecessary re-renders
  const handleEdit = useCallback((id: number) => {
    router.push(`/vendor-management/part-category/${id}`);
  }, [router]);

  const handleDelete = useCallback(async (id: number) => {
    const result = await showActionAlert(COMMON_CONSTANTS.DELETE_ALERT);
    if (!result.isConfirmed) return;

    deletePartCategoryMutation.mutate(id);
  }, [deletePartCategoryMutation]);

  // Memoize columns array to prevent recreation on every render
  const columns = useMemo(() => [
    ...partCategoryColumns,
    {
      field: "status",
      headerName: "Status",
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        return (
          <StatusTypography value={params.row.status_id} />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: NUMBERMAP.ONE,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <ActionButton
            onEdit={() => handleEdit(params.row.part_category_id)}
            onDelete={() => handleDelete(params.row.part_category_id)}
            deleteDisabled={params.row.status_id !== NUMBERMAP.ONE} 
          />
        );
      },
    },
  ], [handleEdit, handleDelete]);

  return (
    <PageContainer>
      <CommonSharedTale
        pathName="/vendor-management/part-category/create"
        title={PAGE_TITLE}
        Table={
          <DataTable
            rows={partCategoryData?.data ?? []}
            columns={columns}
            loading={isLoading ?? deletePartCategoryMutation.isPending}
            IdField="part_category_id"
          />
        }
      />
    </PageContainer>
  );
};

export default PartCategory;
