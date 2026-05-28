"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { DataTable } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { useRecordGenerationColumns, formatRecordGenerationRows } from "@/components/shared/RecordGenerationColumns";
import { PageContainer } from '@/styles/common';
import { NUMBERMAP } from "@/constants/common";
import { useOrganizationRecordHelper } from "@/hooks/modules/hr/useOrganizationRecord";
import { downloadDocumentURL } from "@/hooks/useCommonDropdown";
import {  handleArrayBufferDownload } from "@/lib/utils/common";

/**
*Classification : Confidential
**/

const RecordGenerationPage: React.FC = () => {
  const params = useParams();
  const contextId = Number(params.id);
  const formType = String(params.form);

  const { data, isLoading ,refetch} = useOrganizationRecordHelper(formType, contextId);

 
  const handleDownload = async (fileId: string | number, version: string | number, doc_name?: string,version_no:string|number) => {
    try {
      const response = await downloadDocumentURL(fileId, version);
      const assetData = response?.data
      if(assetData.length>0){
        handleArrayBufferDownload({bufferData:assetData[0],fileName:doc_name,version:version_no,type:"pdf"})
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

 useEffect(()=>{
  refetch()
 },[contextId,formType])
  // Use common columns configuration
  const columns = useRecordGenerationColumns({ handleDownload });

  // Format data rows using common utility
  const tableRows = formatRecordGenerationRows(data?.data);

  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>

          <CommonSharedTale
            title={'Record Generation' }
            Table={
              <DataTable
                IdField="id"
                rows={tableRows}
                columns={columns}
                loading={isLoading}
              />
            }
          />

    </PageContainer>
  );
};

export default RecordGenerationPage;