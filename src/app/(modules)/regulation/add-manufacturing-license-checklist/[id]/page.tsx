"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Box } from "@mui/material";

import { ButtonGroup, DataGridTable, showActionAlert } from "@/components/ui";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager';
import { RegulationReviewerModalManager } from "@/components/modules/regulation/reviewer-modal";
import CommonSharedTale from "@/components/shared/CommonPageTable";

import {
  useFetchAllAddManufacturingLicense,
  useFetchAddManufacturingLicense,
  useSaveAddManufacturingLicense,
  useAddManufacturingLicense,
} from "@/hooks/modules/regulation/useManufacturingLicense";

import { NUMBERMAP, STATUS, WORKFLOW_ACTIONS, REGULATIONPATH } from "@/constants/common";
import {
  MANUFACTURING_LICENSE_ACTION,
  MANUFACTURING_LICENSE_FORM_FIELDS,
  MANUFACTURING_LICENSE_FIELDS,
  MANUFACTURING_LICENSE_COLUMNS,
  INITIAL_FILE_DATA,
} from "@/constants/modules/regulation/manufacturing-license";

import { FileData, FileDocument } from "@/types/components/ui/fileUploadV3";
import { mergeFinalFileData, FinalFileData } from '@/lib/utils/common';
import { PageContainer } from "@/styles/modules/hr/inductionTraining";
import { CommonModalScroll, UnderLine } from "@/styles/common";
import { TableContainer } from '@/styles/components/ui/datatable';

interface ApiFileData {
  file_id: number;
  file_name: string;
}

/**
    Classification : Confidential
**/

const AddManufacturingLicenseChecklistPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  
  const { data: allData, isLoading: isAllLoading } = useFetchAllAddManufacturingLicense(id);
  const { data: workflowData, isLoading: isWorkflowLoading, refetch: refetchWorkflow } = useAddManufacturingLicense(id.toString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[] | FileDocument[]>([]);
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(INITIAL_FILE_DATA);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const hasOnlyCancelButton = workflowData?.meta_info?.action_control?.permissions?.length === NUMBERMAP.ONE && 
    workflowData?.meta_info?.action_control?.permissions?.some((p: { action: string }) => p.action === WORKFLOW_ACTIONS.CANCEL);
  const shouldFetchRowDetail = selectedChecklistId !== null && selectedChecklistId > NUMBERMAP.ZERO;
  const { data: rowDetail, refetch: refetchDetail } = useFetchAddManufacturingLicense(
    selectedChecklistId ?? NUMBERMAP.ZERO, 
    shouldFetchRowDetail
  );

  const { mutate: saveChecklist } = useSaveAddManufacturingLicense();

  useEffect(() => {
    // Only set files if we have data AND selectedChecklistId matches
    // This ensures we only use data that matches the currently selected checklist
    if (selectedChecklistId && Array.isArray(rowDetail?.data)) {
      const mappedFiles = rowDetail.data.map((file: ApiFileData) => ({
        id: file.file_id,
        name: file.file_name,
        ...file,
      }))
      setUploadedDocuments(mappedFiles)
    }
  }, [rowDetail?.data, selectedChecklistId])

  const handleOpenModal = (checklistId: number) => {
    setSelectedChecklistId(checklistId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedChecklistId(null)
    setIsModalOpen(false)
    setFinalFileData(INITIAL_FILE_DATA)
  }

  const columns = [
    {
      field: MANUFACTURING_LICENSE_FIELDS.SERIAL_NO,
      headerName: MANUFACTURING_LICENSE_COLUMNS.SNO,
      flex: NUMBERMAP.HALF,
      renderCell: (params: { api: { getRowIndexRelativeToVisibleRows: (id: string) => number }; row: { checklist_id: string } }) => 
        params.api.getRowIndexRelativeToVisibleRows(params.row.checklist_id) + NUMBERMAP.ONE
    },
    {
      field: MANUFACTURING_LICENSE_FIELDS.SECTION_NO,
      headerName: MANUFACTURING_LICENSE_COLUMNS.SECTION_NO,
      flex: NUMBERMAP.ONE,
      renderCell: (params: { row: { sectionNo: string } }) => params.row.sectionNo,
    },
    {
      field: MANUFACTURING_LICENSE_FIELDS.CHECKLIST_NAME,
      headerName: MANUFACTURING_LICENSE_COLUMNS.CHECKLIST_NAME,
      flex: NUMBERMAP.TWO,
      renderCell: (params: { row: { checklistName: string } }) => params.row.checklistName,
    },
    {
      field: MANUFACTURING_LICENSE_FIELDS.MANDATORY,
      headerName: MANUFACTURING_LICENSE_COLUMNS.MANDATORY,
      flex: NUMBERMAP.ONE,
      renderCell: (params: { row: { checklist_id: number } }) => (
          <Link
          href="#"
          style={UnderLine}
          onClick={e => {
            e.preventDefault();
            handleOpenModal(params.row.checklist_id);
          }}
        >
          {MANUFACTURING_LICENSE_ACTION.LINK_UPLOAD_FILE}
        </Link>
      ),
    },
  ];

  const handleSave = () => {
    if (!selectedChecklistId) return;
    const formData = new FormData();
    
    formData.append(MANUFACTURING_LICENSE_FORM_FIELDS.LICENSE_ID, selectedChecklistId.toString());
    (finalFileData.documents_to_create ?? []).forEach((file: File) => {
      formData.append(MANUFACTURING_LICENSE_FORM_FIELDS.DOCUMENTS_TO_CREATE, file);
    });
    formData.append(MANUFACTURING_LICENSE_FORM_FIELDS.CREATE_META_DATA, JSON.stringify(finalFileData.create_meta_data));
    formData.append(MANUFACTURING_LICENSE_FORM_FIELDS.DOCUMENTS_TO_DELETE, JSON.stringify(finalFileData.documents_to_delete));
    formData.append(MANUFACTURING_LICENSE_FORM_FIELDS.UPDATE_META_DATA, JSON.stringify(finalFileData.update_meta_data));
    
    saveChecklist(formData, {
      onSuccess: () => {
        refetchDetail();
        refetchWorkflow();
        showActionAlert(STATUS.SUCCESS);
        setIsModalOpen(false);
        setSelectedChecklistId(null);
        setFinalFileData(INITIAL_FILE_DATA);
      },
      onError: () => {
        showActionAlert(STATUS.FAILED);
      },
    });
  };

  const handleCancel = () => {
    refetchDetail();
    setIsModalOpen(false);
    setSelectedChecklistId(null);
    setFinalFileData(INITIAL_FILE_DATA);
    router.push(REGULATIONPATH);
  };

  return (
    <PageContainer>
      <Box>
        <CommonSharedTale
          title={MANUFACTURING_LICENSE_ACTION.MODAL_TITLE}
          Table={
            <TableContainer>
              <DataGridTable
                rows={allData?.data ?? []}
                columns={columns}
                idField={MANUFACTURING_LICENSE_FORM_FIELDS.CHECKLIST_ID_FIELD}
                hideFooter={true}
                loading={isAllLoading}
              />
              <RegulationReviewerModalManager
                isLoading={isWorkflowLoading}
                permissions={workflowData?.meta_info?.action_control?.permissions ?? []}
                taskInfo={{
                  task_comments: workflowData?.meta_info?.task_info?.task_comments ?? [],
                  reviewer_list: workflowData?.meta_info?.task_info?.reviewer_list ?? []
                }}
                menuId={workflowData?.meta_info?.action_control?.menuId}
                menuName={workflowData?.meta_info?.action_control?.formName}
                contextType="manufacture_license"
                contextId={id}
                userId={id.toString()}
                organizationSiteId={id.toString()}
                onPermissionChange={(permission) => {
                  // If only Cancel button is available, user should not be allowed to edit
                  setHasEditPermission(permission && !hasOnlyCancelButton);
                }}
                refetch={refetchWorkflow}
                customHandlers={{
                  handleCancel: handleCancel,
                  isDisabled: !hasEditPermission
                }}
                hideSaveButton={true}
              />
              <CommonModal
                open={isModalOpen}
                title={MANUFACTURING_LICENSE_ACTION.MODAL_TITLE}
                onClose={handleCloseModal}
                onSave={handleSave}
              >
                <CommonModalScroll>
                  {rowDetail?.isLoading ? (
                    <div>Loading files...</div>
                  ) : (
                    <FileUploadManager
                      initialFiles={uploadedDocuments}
                      onFileUpload={(file: File | FileData) =>setUploadedDocuments((prev: File[] | FileDocument[]) => [...prev, file] as File[] | FileDocument[])}
                      onFileEdit={(updatedFile: FileData) =>
                        setUploadedDocuments(prev =>
                          prev.map((file: File | FileDocument) => 
                          ('id' in file && file.id === updatedFile.id ? { ...file, ...updatedFile } : file)
                          ) as File[] | FileDocument[]
                          )
                      }
                      onSubmit={(data: FinalFileData) => {
                        setFinalFileData((prev: FinalFileData) => mergeFinalFileData(prev, data));
                      }}
                      subHeader={MANUFACTURING_LICENSE_ACTION.UPLOAD_SUBHEADER}
                      hasEditable={!hasEditPermission}
                    />
                  )}
                  <ButtonGroup
                    buttons={[
                      { label: MANUFACTURING_LICENSE_ACTION.BUTTON_LABEL_CANCEL, onClick: handleCloseModal },
                      // Only show Save button if user has edit permission
                      ...(hasEditPermission ? [{ label: MANUFACTURING_LICENSE_ACTION.BUTTON_LABEL_SAVE, onClick: handleSave }] : []),
                    ]}
                  />
                </CommonModalScroll>
              </CommonModal>
            </TableContainer>
          }
        />
      </Box>
    </PageContainer>
  );
};

export default AddManufacturingLicenseChecklistPage; 