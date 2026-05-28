'use client'
import React, { useState, useEffect } from 'react'
import { Box, Checkbox, Typography, IconButton, Grid2 } from '@mui/material'
import { DataGridTable, Label, showActionAlert } from '@/components/ui'
import { TableContainer } from '@/styles/components/ui/table'
import { GridRenderCellParams } from '@mui/x-data-grid'
import DownloadIcon from '@mui/icons-material/Download'

import {
  STYLES,
} from '@/styles/modules/dnd/pnd'
import {NUMBERMAP, STATUS } from '@/constants/common'
import { useGetAcknowlegment, useSaveAcknowledgement, useGetDocuments } from '@/hooks/modules/dnd/useAcknowledgementDesignTranfer'
import { useParams, useRouter } from 'next/navigation'
import { downloadStyles, SectionTitle } from '@/styles/modules/dnd/acknowledgmentTransfer'
import { AcknowledgementFormData } from '@/types/modules/dnd/acknowledgementTransfer'
import { getColumns, INITIAL_ACKNOWLEDGEMENT_FORMDATA, INITIAL_ERRORS, ERROR_MESSAGES, ACKNOWLEDGEMENT_FORM, getPopupColumns } from '@/constants/modules/dnd/acknowledgmentTransfer'
import { ErrorText } from '@/styles/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {getfileURL} from '@/hooks/useCommonDropdown'
import { handleFileDownloadByUrl, handleFileDownloadUtil } from '@/lib/utils/common'
import { ALERT_MESSAGES } from '@/styles/components/ui/fileUploadManagerV3'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import GlobalLoader from '@/components/shared/LoadingSpinner'

const AcknowledgementTransfer: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  
  const [hasEditPermission, setHasEditPermission] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0)
  const [formData, setFormData] = useState<AcknowledgementFormData>({ ...INITIAL_ACKNOWLEDGEMENT_FORMDATA });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    ...INITIAL_ERRORS,
  })

  const { data: acknowledgementData ,isLoading, isFetching} = useGetAcknowlegment(Number(projectId));
  const { mutate: saveAcknowledgement, isPending } = useSaveAcknowledgement()
  const { data: getDocuments ,isFetching:popupLoading} = useGetDocuments(selectedId)


  const isAnyLoading = () => {
    if (isFetching) return true
    if (isPending) return true
    return false
  }

  useEffect(() => {
    if (acknowledgementData?.data) {
      const projectData = acknowledgementData.data;

      setFormData((prev) => ({
        ...prev,
        acknowledgement_statement: projectData.acknowledgement_statement ?? '',
        documents: projectData.documents ?? [],
      }));
    }
  }, [acknowledgementData]);


  const handleCheckBoxChange = (documentId: number, checked: boolean) => {
    if (!hasEditPermission) return;
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) =>
        doc.document_id === documentId ? { ...doc, is_verified: checked ? NUMBERMAP.ONE : NUMBERMAP.ZERO } : doc
      )
    }))
  };

  const handleViewDocuments = (row: any) => {
    const documentId = row.design_transfer_plan_id;
    setSelectedId(documentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleFileDownload = async (row: any) => {
    const documentId = row.file_id
    const name = row.file_name
    try {
      if (!row.file) {
        const response = await getfileURL(documentId)

        handleFileDownloadByUrl(response?.data[NUMBERMAP.ZERO].assetUrl, name)
      } else {
        handleFileDownloadUtil(row.file)
      }
    } catch (error) {
      const message =
    error instanceof Error ? error.message : String(error);
      showActionAlert('customAlert', {
        title: ALERT_MESSAGES.DOWNLOAD_ERROR_TITLE,
        text: message,
        icon: ALERT_MESSAGES.ALERT_ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }


  const renderButtonCell = (params: GridRenderCellParams) => (
    <Typography
      sx={downloadStyles.title}
      onClick={() => handleViewDocuments(params.row)}
    >
      {ACKNOWLEDGEMENT_FORM.VIEW_FILES}
    </Typography>
  );


  const renderReviewedCheckbox = (params: GridRenderCellParams) => {
    const documentId = params.row.document_id; // Use document_id instead of id
    const isVerified = params.row.is_verified === NUMBERMAP.ONE;

    return (
      <Checkbox
        checked={isVerified}
        onChange={(e) => {
          handleCheckBoxChange(documentId, e.target.checked); // Pass the new checked value
        }}
      />
    );
  };

  const renderDownloadCell = (params: GridRenderCellParams) => {
    return (
      <IconButton
        onClick={() => handleFileDownload(params.row)}
        aria-label={`${ACKNOWLEDGEMENT_FORM.DOWNLOAD_FILE}`}
      >
        <DownloadIcon />
      </IconButton>
    )
  }

  const handleAcknowledgeStatement = (ackVerified: boolean) => {
    if (!hasEditPermission) return;
    setFormData((prev) => ({
      ...prev,
      acknowledgement_statement: ackVerified ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // Validate acknowledgement statement
    if (formData.acknowledgement_statement !== NUMBERMAP.ONE) {
      newErrors.acknowledgement_statement = ERROR_MESSAGES.ACKNOWLEDGEMENT_STATEMENT;
      isValid = false;
    }

    // Other existing validations...

    setErrors(newErrors);
    return isValid;
  };


  const handleSave = () => {
    // Prepare the data to send
    if (!validateForm()) return;
    const payload: AcknowledgementFormData = {
      acknowledgement_statement: formData.acknowledgement_statement,
      documents: formData.documents.map((doc) => ({
        design_transfer_plan_id: doc.design_transfer_plan_id,
        is_verified: doc.is_verified,
      })),
    };

    // Trigger the save mutation
    saveAcknowledgement(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    });
  };

  const renderStatusCell = (params)=>{
    return <StatusTypography value={params.value} />
  }

  const columns = getColumns(renderReviewedCheckbox, renderButtonCell);
  const PopupColumns = getPopupColumns(renderDownloadCell,renderStatusCell)
  return (
    <TableContainer>
      <GlobalLoader loading={isAnyLoading()} />
      {acknowledgementData && (
        <>
      <Label title={ACKNOWLEDGEMENT_FORM.TITLE} />
      <Box sx={STYLES.BOX}>
        <DataGridTable
          hideFooter={true}
          loading={isLoading}
          columns={columns}
          idField={ACKNOWLEDGEMENT_FORM.ID_FIELD}
          rows={formData.documents}
        />
        <SectionTitle>{ACKNOWLEDGEMENT_FORM.ACKNOWLEDGEMENT_STATEMENT}</SectionTitle>
        <Box>
          <Checkbox
            checked={formData.acknowledgement_statement === NUMBERMAP.ONE}
            onChange={(e) => handleAcknowledgeStatement(e.target.checked)}
          />
          <span>{ACKNOWLEDGEMENT_FORM.TERMS_CONDITIONS}</span>
        </Box>
        {errors.acknowledgement_statement && (
          <ErrorText>{errors.acknowledgement_statement}</ErrorText>
        )}
      </Box>
       <Grid2 sx={STYLES.BOX}>
      <CommentsHistory 
          comments={acknowledgementData?.meta_info?.task_info?.task_comments} 
        />
        <ReviewerModalManager
          isLoading={isLoading}
          permissions={acknowledgementData?.meta_info?.action_control?.permissions ?? [] }
          projectId={Number(projectId)}
          menuId={acknowledgementData?.meta_info?.action_control?.menuId}
          menuName={acknowledgementData?.meta_info?.action_control?.formName}
          customHandlers={{ 
            handleCancel: () => {
              router.push(ROUTE_PATHS.DND_PROJECT_LIST)
            },
            handleSave: handleSave,
            isDisabled: isPending
          }}
          onPermissionChange={setHasEditPermission}
          reviewerList={acknowledgementData?.meta_info?.task_info?.reviewer_list}
        />
        </Grid2>
      <CommonModal open={isModalOpen} buttonRequired title={ACKNOWLEDGEMENT_FORM.POPUP_TITLE}  onClose={handleCloseModal}>
        <DataGridTable idField={ACKNOWLEDGEMENT_FORM.POPUP_ID} loading={popupLoading} hideFooter columns={PopupColumns} rows={getDocuments?.data?.documents} />
      </CommonModal>
      </>
      )}
    </TableContainer>
  );
};

export default AcknowledgementTransfer
