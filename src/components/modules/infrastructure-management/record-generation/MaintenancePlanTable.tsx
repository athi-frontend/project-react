'use client'
import React, { useEffect, useMemo, useState } from "react";
import { useGetMaintenancePlanList } from "@/hooks/modules/infrastructure-management/infrastructureOnboardingTabs";
import { TABLE_CONSTANTS, RECORD_GENERATION_CONTEXT_TYPES, RECORD_GENERATION_MODULES } from "@/constants/modules/infrastructure-management/recordGeneration";
import { getOrganizationRecords, OrganizationRecord } from "@/services/modules/hr/organizationRecord";
import { useRecordGenerationColumns, formatRecordGenerationRows } from "@/components/shared/RecordGenerationColumns";
import { Grid2 } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentMenuId, selectMenuData } from "@/store/slices/menuSlice";
import { getPageTitle, handleDownloadRecords } from "@/lib/utils/recordGeneration";
import { usePathname } from "next/navigation";
import { DataTable } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { PageContainer } from '@/styles/common';
import { NUMBERMAP } from "@/constants/common";
import { ID } from "@/constants/modules/dnd/recordGeneration";

const MaintenancePlanTable: React.FC<{ title: string, pathName: string }> = ({ title, pathName }) => {
  const { data: maintenancePlanResponse, isLoading: isMaintenancePlanLoading } = useGetMaintenancePlanList();
  const [allRecords, setAllRecords] = useState<OrganizationRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const menuId = useSelector(selectCurrentMenuId);
  const menuData = useSelector(selectMenuData);
  const pathname = usePathname();
  const pageTitle = getPageTitle(menuData, pathname, RECORD_GENERATION_MODULES.INFRASTRUCTURE) ?? title;

  const maintenanceIds = useMemo(() => {
    return maintenancePlanResponse?.data
      ?.map((item: any) => item[TABLE_CONSTANTS.MAINTENANCE_PLAN.ID_FIELD])
      .filter((id: any) => id != null) ?? [];
  }, [maintenancePlanResponse]);

  useEffect(() => {
    const fetchAllRecords = async () => {
      if (maintenanceIds.length === NUMBERMAP.ZERO || !menuId) {
        setAllRecords([]);
        return;
      }
      setIsLoadingRecords(true);
      try {
        const recordPromises = maintenanceIds.map((id: number) =>
          getOrganizationRecords(menuId, RECORD_GENERATION_CONTEXT_TYPES.MAINTENANCE_PLAN, id)
        );
        const results = await Promise.all(recordPromises);
        const combinedRecords = results.flatMap((result) => result.data ?? []);
        setAllRecords(combinedRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
        setAllRecords([]);
      } finally {
        setIsLoadingRecords(false);
      }
    };
    fetchAllRecords();
  }, [maintenanceIds, menuId]);

  const columns = useRecordGenerationColumns({ handleDownload: handleDownloadRecords });
  const tableRows = formatRecordGenerationRows(allRecords);
  const isLoading = isMaintenancePlanLoading ?? isLoadingRecords;

  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <Grid2 container>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <CommonSharedTale
            title={pageTitle}
            Table={
              <DataTable
                IdField={ID}
                rows={tableRows}
                columns={columns}
                loading={isLoading}
              />
            }
          />
        </Grid2>
      </Grid2>
    </PageContainer>
  );
};

export default MaintenancePlanTable;

