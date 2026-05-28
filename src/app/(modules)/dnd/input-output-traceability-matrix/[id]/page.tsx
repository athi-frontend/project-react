'use client'
import { useState, useEffect } from 'react'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { DataTable, showActionAlert, ButtonGroup } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { BUTTONSTYLE, NUMBERMAP } from '@/constants/common'
import { ButtonLink, PageContainer } from '@/styles/common'
import { IconButton, Checkbox, Typography, Box, Grid2 } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { STYLES } from '@/styles/components/ui/fileUploadManagerV3'
import { useDownloadFile } from '@/hooks/useCommonDropdown'
import { getColumns, getPopupColumns, PAGE_TITLE } from '@/constants/modules/dnd/inputOutputTraceabilityMatrix'
import { useFetchTraceabilityList, useFetchDocumentsRow, useSaveMatrix } from '@/hooks/modules/dnd/useInputOutputTraceabilityMatrix'
import { useParams, useRouter } from 'next/navigation'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { TraceabilityMatrixForm } from '@/types/modules/dnd/inputOutputTraceabilityMatrix'
import { COMMON_CONSTANTS, handleDownloadSuccess } from '@/lib/utils/common'
import { DownloadCellContainer, MarginTopBottomAuto } from '@/styles/modules/dnd/inputOutputTraceabilityMatrix'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { CommentsHistoryContainer } from '@/styles/components/modules/taskSchedule'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import GlobalLoader from '@/components/shared/LoadingSpinner'

const { SUCCESS_ALERT, FAILED_ALERT, INDEX_ZERO } = COMMON_CONSTANTS

export default function SimpleListPage() {
  const params = useParams();
  const router = useRouter();
  const project_id = params.id;
  
  const [hasEditPermission, setHasEditPermission] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<number | null>(null);
  const [rows, setRows] = useState<TraceabilityMatrixForm[]>([]);
  const [fileId, setFileId] = useState(NUMBERMAP.ZERO);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState<string | null>(null);
  const { data: traceabilityData , isLoading, isFetching} = useFetchTraceabilityList(Number(project_id));
  const { mutate: saveMutate, isPending } = useSaveMatrix();
  const { refetch } = useDownloadFile(fileId);


  const { data: rowData, refetch: fetchRowData,isLoading:popupLoading} = useFetchDocumentsRow(
    Number(project_id),
    selectedRowData?.dir_id
  );

  // Initialize rows state when rowData changes
  useEffect(() => {
    if (rowData?.data) {
      setRows(rowData.data);
    }
  }, [rowData]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (selectedRowData?.dir_id) {
        await fetchRowData();
      }
    };
    fetchDocuments();
  }, [selectedRowData, fetchRowData]);

  // Handle file download effect
  useEffect(() => {
    const fetchData = async () => {
      if (Number(fileId) && triggerDownload && downloadFileName) {
        const response = await refetch()
        if (response?.data) {
          await handleDownloadSuccess(
            response.data.data[INDEX_ZERO].assetUrl,
            downloadFileName
          )
        } else {
          showActionAlert(FAILED_ALERT)
        }
        // Reset trigger
        setTriggerDownload(false)
      }
    }
    fetchData()
  }, [fileId, triggerDownload, downloadFileName, refetch])

  const handleDownload = async (downloadFileId: number) => {
    setFileId(downloadFileId)
    setDownloadFileName(`verification_report_${downloadFileId}`)
    setTriggerDownload(true)
  }

  const handleCheckBoxChange = (rowId: number, is_checked: boolean) => {
    if (!hasEditPermission) return;
    setRows((prev) =>
      prev.map((row) =>
        row.design_transfer_documents_id === rowId
          ? { ...row, is_checked: is_checked ? NUMBERMAP.ONE : NUMBERMAP.ZERO }
          : row
      )
    );
  };

  const handleViewDocuments = (row: any) => {
    setSelectedRowData(row);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!project_id || !selectedRowData || !rows.length) {
      return;
    }

    const checkedDocumentIds = rows
      .filter((row) => row.is_checked === NUMBERMAP.ONE)
      .map((row) => row.design_transfer_documents_id);

    const payload = {
      project_id: Number(project_id),
      dir_id: selectedRowData.dir_id,
      design_transfer_documents_id: checkedDocumentIds
    };

    saveMutate(payload, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT);
        handleCancel();
        fetchRowData();
      },
      onError: () => {
        showActionAlert(FAILED_ALERT);
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRowData(null);
    setRows([]);
  };

  const renderDownloadCell = (params: any) => {
    const { design_stage, batch_no } = params.row;
    const batchDisplay = batch_no ? `/${batch_no}` : '';
    if(params.row?.verificationReportFileId.length>NUMBERMAP.ZERO){
      return (
          <DownloadCellContainer>
            {params.row.verificationReportFileId.map((fileId: number) => (
              <Grid2 container key={fileId}>
                <Grid2 size={NUMBERMAP.SIX} sx={MarginTopBottomAuto}>
                  <Typography>
                    {design_stage} {batchDisplay}
                  </Typography>
                </Grid2>
                <Grid2 size={NUMBERMAP.SIX}>
                  <IconButton
                    onClick={() => handleDownload(fileId)}
                    aria-label={`Download file ${fileId}`}
                    sx={STYLES.FONTSIZE_24}
                    color={STYLES.colour}
                  >
                    <DownloadIcon color='primary' style={STYLES.FONTSIZE_24} />
                  </IconButton>
                </Grid2>
              </Grid2>
            ))}
          </DownloadCellContainer>
        )
    }else{
        return <>{design_stage} {batchDisplay}</>
    }
  
  }

  const renderButtonCell = (params: any) => (
    <ButtonLink onClick={() => handleViewDocuments(params.row)}>
      View Documents
    </ButtonLink>
  );

  const renderReviewedCheckbox = (params: GridRenderCellParams) => {
    const documentId = params.row.design_transfer_documents_id;
    // Find the current row state to get the updated is_checked value
    const currentRow = rows.find(row => row.design_transfer_documents_id === documentId);
    const isVerified = currentRow ? currentRow.is_checked === NUMBERMAP.ONE : params.row.is_checked === NUMBERMAP.ONE;

    return (
      <Checkbox
        checked={isVerified}

        onChange={(e) => handleCheckBoxChange(documentId, e.target.checked)}
      />
    );
  };

  const renderFileCategory = (params: GridRenderCellParams) => {
    // Add safety checks for documents array
    if (!params.row.documents || params.row.documents.length === NUMBERMAP.ZERO) {
      return <span>-</span>;
    }

    return (
      <span>{params.row.documents[NUMBERMAP.ZERO].file_name ?? '-'}</span>
    )
  }

  const Columns = getColumns(renderButtonCell, renderDownloadCell);
  const PopupColumns = getPopupColumns(renderReviewedCheckbox, renderFileCategory);

  return (
    <>
    <GlobalLoader loading={isFetching} />
    {traceabilityData && (
      <PageContainer>
        <CommonSharedTale
          Table={<DataTable columns={Columns} loading={isLoading} rows={traceabilityData?.data ?? []} IdField={PAGE_TITLE.ID} />}
          title={PAGE_TITLE.LIST_TITLE}
        />
      <CommentsHistoryContainer>
        <CommentsHistory 
          comments={traceabilityData?.meta_info?.task_info?.task_comments} 
        />
      </CommentsHistoryContainer>

      <CommonModal
        title={PAGE_TITLE.MODAL_TITLE}
        open={isModalOpen}
        onClose={handleCancel}
      >
        <Box sx={{ ...POPUP_STYLE, padding: NUMBERMAP.ZERO }}>
          <DataTable columns={PopupColumns} rows={rows} loading={popupLoading} IdField={PAGE_TITLE.POPUP_ID} />
        </Box>
        <ButtonGroup
          buttons={[
            { label: PAGE_TITLE.CANCEL, onClick: handleCancel },
            { label: PAGE_TITLE.SAVE, onClick: handleSave, disabled: !hasEditPermission || isPending },
          ]}
        />
      </CommonModal>
      <Grid2 sx={BUTTONSTYLE}>
      <ReviewerModalManager
          isLoading={isLoading}
          permissions={traceabilityData?.meta_info?.action_control?.permissions ?? []}
          projectId={Number(project_id)}
          menuId={traceabilityData?.meta_info?.action_control?.menuId}
          menuName={traceabilityData?.meta_info?.action_control?.formName}
          hideSaveButton={true}
          customHandlers={{ 
            handleCancel: () => {
              router.push(ROUTE_PATHS.DND_PROJECT_LIST)
            }
          }}
          onPermissionChange={setHasEditPermission}
          reviewerList={traceabilityData?.meta_info?.task_info?.reviewer_list}
        />
        </Grid2>
    </PageContainer>
  )}
  </>
  );
}
