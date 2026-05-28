import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, IconButton, Link } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { DataGridTable, FileUpload, InputField, Label, showActionAlert } from '@/components/ui';
import UploadedFilesList from '@/components/ui/file-upload-section/UploadedFilesList';
import DataTable from '@/components/ui/data-table/DataTable';
import ButtonGroup from '@/components/ui/button-group/ButtonGroup';
import { HeaderContainer, Title, AddButton } from '@/styles/modules/hr/addEmployee';
import { HeaderContainer as FileHeaderContainer, HeaderTitle } from '@/styles/components/ui/fileUploadManagerV3';
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { bomButtonContainerSx, uploadBomLinkSx, uploadBomGridContainerSx } from '@/styles/modules/dnd/billOfMaterial';
import { BUTTON_LABEL, STATUS, NUMBERMAP } from '@/constants/common';
import { 
  PAGE_TITLES,
  UPLOAD_BOM_FIELD_LABEL_MAP,
  UPLOAD_BOM_FIELD_ORDER,
  VALIDATION_MESSAGES,
  UPLOAD_BOM_FORM_LABELS,
  UPLOAD_BOM_TABLE_COLUMNS,
  UPLOAD_BOM_ERROR_TABLE_COLUMNS,
  UPLOAD_BOM_FORM_PLACEHOLDERS,
  UPLOAD_BOM_LABELS,
  UPLOAD_BOM_FORM_FIELDS,
  UPLOAD_BOM_FILE_TYPES,
} from '@/constants/modules/dnd/bom';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';
import { useUploadBomFile, useModelOptions, useBomUploadDetail, useBomUploadList } from '@/hooks/modules/dnd/useBOM';
import { UnderLine } from '@/styles/common';
import { Download } from '@mui/icons-material';
import { getfileURL } from '@/hooks/useCommonDropdown';
import { handleFileDownloadByUrl } from '@/lib/utils/common';
import GlobalLoader from '@/components/shared/LoadingSpinner';

interface UploadBomDetailProps {
  projectId: number;
}

const UploadBomDetail: React.FC<UploadBomDetailProps> = ({ projectId }) => {
  const [detail, setDetail] = useState<Record<string, any> | null>(null);
  const [modelId, setModelId] = useState<string>(''); 
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileUploadData, setFileUploadData] = useState<{
    documents_to_create?: File[];
    documents_to_delete?: number[];
    create_meta_data?: Record<string, any>;
    update_meta_data?: Record<string, any>;
  }>({});
  
  const { data: modelsResp, isLoading: isModelsLoading } = useModelOptions(projectId);
  const { data: bomUploadListResp, isLoading: isBomUploadListLoading } = useBomUploadList(projectId);
  
  // Only fetch detail API when we have bom_upload_id (edit mode)
  const bomUploadId = detail?.bom_upload_id;
  const { data: bomUploadDetailResp, isLoading: isBomUploadDetailLoading } = useBomUploadDetail(bomUploadId, !!bomUploadId);

  // Handle file download
  const handleDownloadFile = useCallback(async (fileId: number | string, fileName: string) => {
    const response = await getfileURL(fileId);
    if (response?.data?.[NUMBERMAP.ZERO]?.assetUrl) {
      handleFileDownloadByUrl(response.data[NUMBERMAP.ZERO].assetUrl, fileName);
    } else {
      showActionAlert(STATUS.FAILED);
    }
  }, []);

  const uploadBomColumns = useMemo(() => [
    { field: UPLOAD_BOM_TABLE_COLUMNS.SNO.FIELD, headerName: UPLOAD_BOM_TABLE_COLUMNS.SNO.HEADER, flex: NUMBERMAP.HALF },
    {
      field: UPLOAD_BOM_TABLE_COLUMNS.FILE_NAME.FIELD, headerName: UPLOAD_BOM_TABLE_COLUMNS.FILE_NAME.HEADER, flex: NUMBERMAP.TWO, renderCell: (params: any) => (
        <Link
          style={UnderLine}
          onClick={(e) => {
            setDetail({ bom_upload_id: params.row[UPLOAD_BOM_FORM_FIELDS.BOM_UPLOAD_ID] });
          }}
          sx={uploadBomLinkSx}
        >
          {params.row.upload_files?.[NUMBERMAP.ZERO]?.file_name}
        </Link>
      )
    },
    { field: UPLOAD_BOM_TABLE_COLUMNS.MODEL.FIELD, headerName: UPLOAD_BOM_TABLE_COLUMNS.MODEL.HEADER, flex: NUMBERMAP.ONE },
    { field: UPLOAD_BOM_TABLE_COLUMNS.STATUS.FIELD, headerName: UPLOAD_BOM_TABLE_COLUMNS.STATUS.HEADER, flex: NUMBERMAP.ONE },
    {
      field: UPLOAD_BOM_TABLE_COLUMNS.ACTIONS.FIELD, headerName: UPLOAD_BOM_TABLE_COLUMNS.ACTIONS.HEADER, flex: NUMBERMAP.ONE, renderCell: (params: any) => {
        const fileId = params.row.upload_files?.[NUMBERMAP.ZERO]?.file_id;
        const fileName = params.row.upload_files?.[NUMBERMAP.ZERO]?.file_name ?? UPLOAD_BOM_LABELS.FILE;
        return (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (fileId) {
                handleDownloadFile(fileId, fileName);
              } else {
                showActionAlert(STATUS.FAILED);
              }
            }}
            aria-label={UPLOAD_BOM_LABELS.DOWNLOAD_BOM_UPLOAD}
          >
            <Download />
          </IconButton>
        );
      }, disableColumnMenu: true, sortable: false
    },
  ], [handleDownloadFile]);

  // Update detail when bom_upload_id API response comes in (only for edit mode)
  useEffect(() => {
    if (bomUploadDetailResp?.data?.[NUMBERMAP.ZERO] && bomUploadId) {
      const detailData = bomUploadDetailResp.data[NUMBERMAP.ZERO];
      setDetail({ ...detailData, raw: detailData });
      // Populate form fields from bom_upload_id API
      if (detailData.model_id) {
        setModelId(String(detailData.model_id));
      }
      // Prefill uploaded files from API (only one file)
      if (detailData.upload_files && detailData.upload_files.length > NUMBERMAP.ZERO) {
        setUploadedFiles([detailData.upload_files[NUMBERMAP.ZERO]]);
      } else {
        setUploadedFiles([]);
      }
    }
  }, [bomUploadDetailResp, bomUploadId]);

  // Reset uploaded files when detail is cleared (cancel/add new)
  useEffect(() => {
    if (!detail) {
      setUploadedFiles([]);
      setFileUploadData({});
    }
  }, [detail]);

  const { mutate: uploadBomFile, isPending: isUploadPending } = useUploadBomFile();

  // Determine template file for Download Template section
  const templateFiles = useMemo(() => {
    // If uploadedFiles has data with file_id, use that
    if (uploadedFiles.length > NUMBERMAP.ZERO && uploadedFiles[NUMBERMAP.ZERO]?.file_id) {
      return [{
        file_name: uploadedFiles[NUMBERMAP.ZERO].file_name ?? UPLOAD_BOM_LABELS.BOM_TEMPLATE,
        file_id: uploadedFiles[NUMBERMAP.ZERO].file_id,
      }];
    }
    // Otherwise, get from API response (bomUploadListResp)
    if (bomUploadListResp?.data?.[NUMBERMAP.ZERO]?.template_file_id) {
      return [{
        file_name: UPLOAD_BOM_LABELS.BOM_TEMPLATE,
        file_id: bomUploadListResp.data[NUMBERMAP.ZERO].template_file_id,
      }];
    }
    return [] ;
  }, [uploadedFiles, bomUploadListResp]);

  // Handle file upload from FileUpload component
  const handleFileUpload = (file: File | null) => {
    if (file) {
      // Generate crypto ID for the file (similar to FileUploadManager)
      const cryptoId = crypto.randomUUID();
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const newFileName = `${cryptoId}${fileExtension}`;
      
      // Create a new file object with the crypto ID name
      const fileWithNewName = new File([file], newFileName, { type: file.type });
      
      // Transform File object to match expected structure with file_name property
      const transformedFile = {
        file_name: file.name,
        file: fileWithNewName,
      };
      
      // Replace existing file with new one (only one file allowed)
      setUploadedFiles([transformedFile]);
      
      // Create metadata structure matching FileUploadManager pattern
      // Key should be the crypto-generated filename (newFileName)
      const createMetaData = {
        [newFileName]: {
          fileName: file.name,
          source: '',
          date_of_upload: new Date().toISOString(),
          categoryId: null,
          purpose: '',
          file_status: NUMBERMAP.ONE,
          tags: [],
        },
      };
      
      // Update fileUploadData for form submission following HLD pattern
      // Replace previous files since only one file is allowed
      setFileUploadData({
        documents_to_create: [fileWithNewName],
        create_meta_data: createMetaData,
      });
    }
  };

  // Comprehensive loading state function
  const isLoading = () => {
    if (isModelsLoading) return true;
    if (isBomUploadListLoading) return true;
    if (isBomUploadDetailLoading) return true;
    if (isUploadPending) return true;
    return false;
  };

  // Drilldown mode: if detail is set, show detail form; otherwise show DataTable
  if (!detail) {
    return (
      <Box>
        <HeaderContainer>
          <Title>{PAGE_TITLES.UPLOAD_BOM}</Title>
          <AddButton variant='outlined' onClick={() => setDetail({})}>
            {UPLOAD_BOM_LABELS.ADD_NEW}
          </AddButton>
        </HeaderContainer>
        <DataTable
          columns={uploadBomColumns}
          rows={(bomUploadListResp?.data ?? []).filter((row: any) => row[UPLOAD_BOM_FORM_FIELDS.BOM_UPLOAD_ID])}
          IdField={UPLOAD_BOM_FORM_FIELDS.BOM_UPLOAD_ID}
          pagination={true}
          loading={isBomUploadListLoading}
        />
      </Box>
    );
  }


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate model_id
    if (!modelId?.trim()) {
      newErrors.model_id = VALIDATION_MESSAGES.FIELD_REQUIRED(UPLOAD_BOM_FIELD_LABEL_MAP.model_id);
    }
    
    // Validate file upload - check if there are any files
    const hasFiles = (uploadedFiles && uploadedFiles.length > NUMBERMAP.ZERO) || 
                     (fileUploadData.documents_to_create && fileUploadData.documents_to_create.length > NUMBERMAP.ZERO);
    if (!hasFiles) {
      newErrors.uploadedFiles = VALIDATION_MESSAGES.FIELD_REQUIRED(UPLOAD_BOM_FIELD_LABEL_MAP.uploadedFiles);
    }
    
    setErrors(newErrors);
    
    const hasValidationErrors = Object.keys(newErrors).length > NUMBERMAP.ZERO;
    
    // Create combined data for focus validation
    const combinedData = {
      model_id: modelId ?? '',
      uploadedFiles: hasFiles ? 'filled' : '',
    };
    
    const focusResult = hasValidationErrors
      ? validateAndFocusFirstEmptyField(combinedData, UPLOAD_BOM_FIELD_ORDER, UPLOAD_BOM_FIELD_LABEL_MAP)
      : true;
    
    return !hasValidationErrors && focusResult;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    const formDataToSend = new FormData();
    
    formDataToSend.append('model_id', String(modelId));
    
    // Append files to documents_to_create (files are appended directly, not JSON stringified)
    if (fileUploadData.documents_to_create && fileUploadData.documents_to_create.length > 0) {
      fileUploadData.documents_to_create.forEach((file: File) => {
        formDataToSend.append('documents_to_create', file, file.name);
      });
    }
    
    // Append create_meta_data as JSON stringified object (always append, even if empty)
    // If no file uploaded, pass empty object {}
    const createMetaData = fileUploadData.create_meta_data ?? {};
    formDataToSend.append('create_meta_data', JSON.stringify(createMetaData));
    
    // Append update_meta_data as JSON stringified object (for existing files being updated)
    if (fileUploadData.update_meta_data && Object.keys(fileUploadData.update_meta_data).length > NUMBERMAP.ZERO) {
      formDataToSend.append('update_meta_data', JSON.stringify(fileUploadData.update_meta_data));
    }
    
    uploadBomFile(formDataToSend, { 
      onSuccess: () => {
        setDetail(null);
        setModelId('');
        setUploadedFiles([]);
        setFileUploadData({});
        setErrors({});
      }
    });
  };
  const handleCancel = () => {
    setDetail(null);
    setModelId('');
    setUploadedFiles([]);
    setFileUploadData({});
    setErrors({});
  };
  const buttonConfig = [
    { label: BUTTON_LABEL.CANCEL, onClick: handleCancel },
    { label: BUTTON_LABEL.SAVE, onClick: handleSave }
  ];

  return (
    <FormContainer>
      <GlobalLoader loading={isLoading()} />
      <FormWrapper>
        <Label title={PAGE_TITLES.UPLOAD_BOM}/>
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={uploadBomGridContainerSx}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={UPLOAD_BOM_FORM_LABELS.MODEL_NO}
                placeholder={UPLOAD_BOM_FORM_PLACEHOLDERS.SELECT_MODEL_NO}
                isDropdown
                keyField={UPLOAD_BOM_FORM_FIELDS.PRODUCT_VARIANT_ID}
                valueField={UPLOAD_BOM_FORM_FIELDS.MODEL_NAME}
                value={modelId}
                onChange={(v: string) => {
                  setModelId(v);
                  if (errors.model_id) {
                    setErrors(prev => ({ ...prev, model_id: '' }));
                  }
                }}
                options={modelsResp?.data ?? []}
                error={errors.model_id ?? ''}
              />
            </Grid2>
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
              <UploadedFilesList
                label={UPLOAD_BOM_LABELS.DOWNLOAD_TEMPLATE}
                files={templateFiles}
                onDelete={() => {}}
              />
            </Grid2>
          <FileHeaderContainer>
            <HeaderTitle>{UPLOAD_BOM_LABELS.UPLOAD_FILES}</HeaderTitle>
          </FileHeaderContainer>
          <Grid2 id={UPLOAD_BOM_FORM_LABELS.UPLOAD_FILES}>
          <FileUpload
            onChange={(file: File | null) => {
              handleFileUpload(file);
              if (errors.uploadedFiles) {
                setErrors(prev => ({ ...prev, uploadedFiles: '' }));
              }
            }}
            error={errors.uploadedFiles ?? ''}
            accept={UPLOAD_BOM_FILE_TYPES.ACCEPT}
            supportedFormats={UPLOAD_BOM_FILE_TYPES.SUPPORTED_FORMATS}
          />
          </Grid2>
          {uploadedFiles.length > NUMBERMAP.ZERO && (
            <Grid2 size={NUMBERMAP.SIX}>
            <UploadedFilesList
              label={UPLOAD_BOM_LABELS.UPLOADED_FILES}
              files={uploadedFiles}
              onDelete={() => {}}
            />
            </Grid2>
          )}
            <DataGridTable
              columns={[
                { field: UPLOAD_BOM_ERROR_TABLE_COLUMNS.SNO.FIELD, headerName: UPLOAD_BOM_ERROR_TABLE_COLUMNS.SNO.HEADER, flex: NUMBERMAP.HALF },
                { field: UPLOAD_BOM_ERROR_TABLE_COLUMNS.ROW_NUMBER.FIELD, headerName: UPLOAD_BOM_ERROR_TABLE_COLUMNS.ROW_NUMBER.HEADER, flex: NUMBERMAP.ONE },
                { field: UPLOAD_BOM_ERROR_TABLE_COLUMNS.ERROR_DESCRIPTION.FIELD, headerName: UPLOAD_BOM_ERROR_TABLE_COLUMNS.ERROR_DESCRIPTION.HEADER, flex: NUMBERMAP.TWO },
              ]}
              rows={bomUploadDetailResp?.data?.[NUMBERMAP.ZERO]?.error_logs ?? []}
              idField={UPLOAD_BOM_FORM_FIELDS.ID}
              title={UPLOAD_BOM_LABELS.ERROR_DETAILS}
              hideFooter={true}
            />
          <Box sx={bomButtonContainerSx}>
            <ButtonGroup buttons={buttonConfig} />
          </Box>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default UploadBomDetail;

