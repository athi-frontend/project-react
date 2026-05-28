"use client";
import React, { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { useRecordGenerationColumns, formatRecordGenerationRows } from "@/components/shared/RecordGenerationColumns";
import { PageContainer } from '@/styles/common';
import { NUMBERMAP } from "@/constants/common";
import { Grid2 } from "@mui/material";
import { useOrganizationRecord } from "@/hooks/common/useRecordGeneration";
import { ID } from "@/constants/modules/dnd/recordGeneration";
import { useSelector } from "react-redux";
import { selectMenuData } from "@/store/slices/menuSlice";
import { getPageTitle, handleDownloadRecords } from "@/lib/utils/recordGeneration";

/**
*Classification : Confidential
**/

const RecordGeneration: React.FC<{moduleName: string, fixedContextType?: string}> = ({moduleName, fixedContextType}) => {
  const params = useParams();
  const pathname = usePathname();
  const projectId = Number(params.id);
  const formId = String(params.form);
    
  const { data, isLoading, refetch } = useOrganizationRecord( projectId, fixedContextType);
  
  useEffect(() => {
    refetch()
  }, [formId])

  const menuData = useSelector(selectMenuData)

  const pageTitle = getPageTitle(menuData, pathname, moduleName)

  // Use common columns configuration
  const columns = useRecordGenerationColumns({ handleDownload: handleDownloadRecords });

  // Format data rows using common utility
  const tableRows = formatRecordGenerationRows(data?.data);

  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <Grid2 container>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <CommonSharedTale
            title={pageTitle}
            Table={
              <DataTable
                IdField= {ID}
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

export default RecordGeneration;
