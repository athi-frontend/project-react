
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Box, Grid2, IconButton, Typography, useTheme } from '@mui/material'
import TagsInput from '@/components/ui/file-upload-v3/TagsInput'
import {
  FileUpload,
  ButtonGroup,
  Description,
  InputField,
  DataGridTable,
  showActionAlert,
} from '@/components/ui'
import { useGetTagsList } from '@/hooks/modules/dnd/useProject'
import {
  FileUploadContainer,
  HeaderContainer,
  HeaderTitle,
  ContentContainer,
  UploadSection,
  UploadContainer,
  FileInfoContainer,
  FileInfoLabel,
  ActionButtonsContainer,
  EditFormContainer,
  EditFormInnerContainer,
  EditFormContent,
  EditFormTitle,
  EditFormFields,
  LabelContainer,
  LabelTitle,
  LabelValue,
  STYLES,
  ALERT_MESSAGES,
  UploadLabel,
  DownloadIconSx
} from '@/styles/components/ui/fileUploadManagerV3'
import {
  FileData,
  FileUploadManagerProps,
  FileFormData,
  TagOption,
} from '@/types/components/ui/fileUploadV3'
import {
  ERROR_MESSAGES,
  LABELS,
  FORM_DATA_VALUES,
  PLACEHOLDERS,
  FILE_UPLOAD_CONSTANTS,
  COLUMN_HEADERS,
  COLUMN_FIELDS,
  FILE_STATUS,
  DATE_FORMATS
} from '@/constants/components/ui/fileUpload'
import { getfileURL, useGetFileCategoryList  } from '@/hooks/useCommonDropdown'
import {
  handleFileDownloadUtil,
  COMMON_CONSTANTS,
  BUTTONLABELS,
  handleFileDownloadByUrl,
  convertUtcToLocal,
} from '@/lib/utils/common'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { Download } from '@mui/icons-material'
import { Edit, Trash } from 'iconsax-react'
import { NUMBERMAP } from '@/constants/common'


const { DELETE_ALERT, EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS
const {
  REQUIRED_FILE_NAME,
  REQUIRED_SOURCE,
  REQUIRED_PURPOSE,
  REQUIRED_CATEGORY,
  REQUIRED_STATUS,
  REQUIRED_TAGS,
  FILE_SIZE_EXEEDS,
  FILE_UPLOAD_LIMIT,
  FILE_TYPE_NOT_SUPPORTED,
  REQUIRED_DESCRIPTION
} = ERROR_MESSAGES
const {
  LABEL_SOURCE,
  LABEL_PURPOSE,
  LABEL_CATEGORY,
  LABEL_DESCRIPTION,
  LABEL_TAGS,
} = LABELS
const { SOURCE, PURPOSE, CATEGORY, DESCRIPTION, TAGS } = PLACEHOLDERS
const {
  ID,
  FIELD_PURPOSE,
  FIELD_SOURCE,
  FIELD_CATEGORY,
  FIELD_DESCRIPTON,
  FIELD_TAGS,
  TAGS_KEY_VALUE,
  CATEGORY_ID,
  CATEGORY_NAME,
} = FORM_DATA_VALUES
const {
  MAX_FILE_SIZE,
  FILE_STATUS_ACTIVE,
  FILE_STATUS_PENDING,
  ACTIVE_STATUS,
  ALLOWED_TYPES,
} = FILE_UPLOAD_CONSTANTS

const FileUploadManager: React.FC<FileUploadManagerProps> = ({
  onFileUpload,
  onFileEdit,
  initialFiles = [],
  onSubmit,
  uploadMandError,
  subHeader,
  hasEditable = false,
  allowedFileTypes,
  fileTypeErrorMessage,
  size = NUMBERMAP.TWELVE
}) => {
  const { data: tagsList } = useGetTagsList()
  const [listedTags, setListedTags] = useState<TagOption[]>([])
  const {data: categoryList} = useGetFileCategoryList()
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [files, setFiles] = useState<FileData[]>([])

  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)

  const [formData, setFormData] = useState<FileFormData>({
    date_of_upload: '',
    fileName: '',
    source: '',
    purpose: '',
    categoryId: null,
    file_status: '',
    description: '',
    tags: [],
  })

  const theme = useTheme()
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [showEditForm, setShowEditForm] = useState<boolean>(false)

  const [filesToDelete, setFilesToDelete] = useState<number[]>([])

  const [localFilesToDelete, setLocalFilesToDelete] = useState<string[]>([])

  const [filesToCreate, setFilesToCreate] = useState<File[]>([])

  const [createMetaData, setCreateMetaData] = useState<Record<string, any>>({})

  const [updateMetaData, setUpdateMetaData] = useState<Record<string, any>>({})
  const [shouldSubmit, setShouldSubmit] = useState(false)

  useEffect(() => {
    if (initialFiles.length > EMPTY_ARRAY_LENGTH && files.length == NUMBERMAP.ZERO) {
      const mappedFiles = initialFiles.map((doc: any) => {
        let tags = []
        if (doc.file_object_key) {
          tags = doc.tags ?? doc?.file_tags?.map((tg) => tg.tag_name) ?? []
        } else {
          tags = doc.tags ?? doc.file_tags ?? []
        }
        return {
          id: doc.file_id ?? doc.id ?? doc.document_id,
          name: doc.name ?? doc['file_name'] ?? '',
          source: doc.source,
          uploadDate: convertUtcToLocal(
            doc.created_date ?? doc.uploaded_date,
            DATE_FORMATS.DD_MM_YYYY
          ),
          categoryId: doc.categoryId??doc.file_category_id ?? doc.categoryId,
          description: doc.description ?? doc.file_description,
          status: doc.status ?? NUMBERMAP.ONE,
          purpose: doc.purpose,
          tags: tags,
          file: doc.file ?? null,
        }
      })

      setFiles(mappedFiles)
    }
    if (initialFiles.length === NUMBERMAP.ZERO && files.length > NUMBERMAP.ZERO) {
      setFiles([])
      setFilesToCreate([])
      setCreateMetaData({})
      setUpdateMetaData({})
      setFilesToDelete([])
      setLocalFilesToDelete([])
    }
  }, [initialFiles])


  const handleFileUpload = (file: File | null) => {
    
    if(files.length>NUMBERMAP.TWENTY){
      setUploadError(FILE_UPLOAD_LIMIT)
      return
    }
    // Clear any previous upload errors
    setUploadError(null)

    // If no file is provided, don't do anything
    if (!file || hasEditable) {
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(FILE_SIZE_EXEEDS)
      return
    }

    // Validate file type
    const fileExtension = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase()

    // Determine which file types to validate against
    const allowedTypes = (Array.isArray(allowedFileTypes) && allowedFileTypes.length > NUMBERMAP.ZERO) 
      ? allowedFileTypes 
      : ALLOWED_TYPES

    // Handle image/* MIME type - validate by MIME type instead of extension
    if (allowedFileTypes === "image/*") {
      if (!file.type?.startsWith("image/")) {
        setUploadError(fileTypeErrorMessage ?? FILE_TYPE_NOT_SUPPORTED)
        return
      }
    } else if (!allowedTypes.includes(fileExtension)) {
      setUploadError(fileTypeErrorMessage ?? FILE_TYPE_NOT_SUPPORTED)
      return
    }

    // Generate crypto ID for the file
    const cryptoId = crypto.randomUUID()
    const newFileName = `${cryptoId}${fileExtension}`

    if (file) { 
      // Create a new file object with the crypto ID name
      const file_old_name = file.name
      const fileWithNewName = new File([file], newFileName, { type: file.type })
      setFilesToCreate((prev) => [...prev, fileWithNewName])
      const newFile: FileData = {
        id: Date.now(),
        name: file_old_name,
        source: '',
        file_tags: [],
        purpose: '',
        categoryId: null,
        created_date: new Date().toISOString(),
        date_of_upload: new Date().toISOString(),
        status: NUMBERMAP.ONE,
        file: fileWithNewName,
      }
  
      setFiles((prevFiles) => [...prevFiles, newFile])
      setCreateMetaData((prev) => ({
        ...prev,
        [newFileName]: {
          description: '',
          source: '',
          tags: [],
          purpose: '',
          file_status: NUMBERMAP.ONE,
          categoryId: null,
          created_date: new Date().toISOString(),
          fileName: file_old_name,
          date_of_upload: new Date().toISOString(),
        },
      }))

      if (onFileUpload) {
        onFileUpload(newFile)
        setShouldSubmit(true)
      }
    }
  }


  const handleEditClick = (file: FileData) => {
    setSelectedFile(file)
    setFormData({
      fileName: file.name ?? '',
      source: file.source ?? '',
      purpose: file.purpose ?? '',
      categoryId: Number(file.categoryId),
      file_status: NUMBERMAP.ONE,
      description: file.description ?? '',
      tags: file.tags ?? [],
      date_of_upload: file.created_date ?? new Date().toISOString(),
    })
    setShowEditForm(true)
  }

  const handleFileDownload = async (row: any) => {
    const documentId = row.id
    try {
      if (!row.file) {
        const response = await getfileURL(documentId)
        handleFileDownloadByUrl(response?.data[0].assetUrl, row.name)
      } else {
        handleFileDownloadUtil({ name: row.name, blob: row.file })
      }
    } catch {
      showActionAlert('customAlert', {
        title: ALERT_MESSAGES.DOWNLOAD_ERROR_TITLE,
        text: ALERT_MESSAGES.DOWNLOAD_ERROR_TEXT,
        icon: ALERT_MESSAGES.ALERT_ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }

  const handleDeleteClick = async (file: FileData) => {
    if(hasEditable) return
    const result = await showActionAlert(DELETE_ALERT)
    if (!result.isConfirmed) {
      return
    }
    if (selectedFile && selectedFile.id === file.id) {
      setShowEditForm(false)
      setSelectedFile(null)
      setFormErrors({})
    }

    if (file.id) {
      handleFileDeletionById(file)
      removeFromUpdateMetaData(Number(file.id))
    }

    if (file.file) {
      removeFromFilesToCreate(file.file.name)
    }
    setShowEditForm(false) 
    removeFromUI(Number(file.id))
    setShouldSubmit(true)
    
  }

  const handleFileDeletionById = (file: FileData) => {
    if (file.file?.name) {
      // For local files, extract crypto ID from the actual file's name (remove file extension)
      const lastDotIndex = file.file.name.lastIndexOf('.')
      const cryptoId = lastDotIndex !== -1 ? file.file.name.substring(0, lastDotIndex) : file.file.name
      setLocalFilesToDelete((prev) => [...prev, cryptoId])
    } else {
      // For server files, store the file ID
      const fileId = Number(file.id)
      setFilesToDelete((prev) => [...prev, fileId])
    }
  }

  const removeFromUpdateMetaData = (id: number) => {
    if (updateMetaData[id]) {
      const updatedMetaData = { ...updateMetaData }
      delete updatedMetaData[id]
      setUpdateMetaData(updatedMetaData)
    }
  }

  const removeFromFilesToCreate = (fileName?: string) => {
    if (!fileName) return

    setFilesToCreate((prev) => prev.filter((f) => f.name !== fileName))

    const updatedCreateMetaData = { ...createMetaData }
    delete updatedCreateMetaData[fileName]
    setCreateMetaData(updatedCreateMetaData)
  }

  const removeFromUI = (fileId?: number) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId))
  }

  const handleInputChange = (field: keyof FileFormData, value: any) => {
    if(hasEditable) return
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.fileName.trim()) {
      errors.fileName = REQUIRED_FILE_NAME
    }

    if (!formData.purpose.trim()) {
      errors.purpose = REQUIRED_PURPOSE
    }

    if (!formData.categoryId) {
      errors.categoryId = REQUIRED_CATEGORY
    }

    if (!formData.file_status) {
      errors.file_status = REQUIRED_STATUS
    }

    if(!formData.description){
      errors.description=REQUIRED_DESCRIPTION
    }

    if (!formData.source.trim()) {
      errors.source = REQUIRED_SOURCE
    }

    if (formData.tags.length === EMPTY_ARRAY_LENGTH) {
      errors.tags = REQUIRED_TAGS
    }

    setFormErrors(errors)
    return Object.keys(errors).length === EMPTY_ARRAY_LENGTH
  }

  const handleSaveForm = () => {
    if (!validateForm() || !selectedFile) {
      return
    }

    const updatedFile: FileData = {
      ...selectedFile,
      name: formData.fileName,
      source: formData.source,
      purpose: formData.purpose,
      categoryId: formData.categoryId,
      status: NUMBERMAP.ONE,
      description: formData.description,
      tags: formData.tags,
    }

    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === selectedFile.id ? updatedFile : file
      )
    )
    const metaData = {
      description: formData.description ?? '',
      source: formData.source,
      tags: formData.tags,
      purpose: formData.purpose,
      file_status: NUMBERMAP.ONE,
      categoryId: formData.categoryId,
      fileName: formData.fileName,
      date_of_upload: formData.date_of_upload,
    }

    if (selectedFile.file) {
      setCreateMetaData((prev) => ({
        ...prev,
        [String(selectedFile?.file?.name)]: metaData,
      }))
    } else {
      setUpdateMetaData((prev) => ({
        ...prev,
        [String(selectedFile.id)]: metaData,
      }))
    }
    setShouldSubmit(true)

    if (onFileEdit) {
      onFileEdit(updatedFile)
    }

    setShowEditForm(false)
    setSelectedFile(null)
  }

  const handleCancelForm = () => {
    setShowEditForm(false)
    setSelectedFile(null)
    setFormErrors({})
  }

  const prepareApiRequestData = () => {
    const blobs = filesToCreate.map((file) => file)

    return {
      documents_to_create: blobs,
      documents_to_delete: filesToDelete,
      create_meta_data: createMetaData,
      update_meta_data: updateMetaData,
      local_files_to_delete: localFilesToDelete,
    }
  }

  const handleSubmitAll = () => {
    const requestData = prepareApiRequestData()

    const validUpdateMetaData = { ...updateMetaData }
    filesToDelete.forEach((fileId) => {
      if (validUpdateMetaData[fileId]) {
        delete validUpdateMetaData[fileId]
      }
    })
    localFilesToDelete.forEach((fileId) => {
      if (validUpdateMetaData[fileId]) {
        delete validUpdateMetaData[fileId]
      }
    })

    const validatedRequestData = {
      ...requestData,
      update_meta_data: validUpdateMetaData,
    }
    onSubmit(validatedRequestData)

    setFilesToDelete([])
    setLocalFilesToDelete([])
    setFilesToCreate([])
    setCreateMetaData({})
    setUpdateMetaData({})
  }

  useEffect(() => {
    if (shouldSubmit) {
      handleSubmitAll()
      setShouldSubmit(false)
    }
  }, [createMetaData, updateMetaData, shouldSubmit])
  useEffect(() => {
    setListedTags(tagsList?.data ?? [])
  }, [tagsList])
  const columns = [
    {
      field: COLUMN_FIELDS.NAME,
      headerName: COLUMN_HEADERS.FILE_NAME,
      flex:NUMBERMAP.ONE_HALF,
    },
    {
      field: COLUMN_FIELDS.SOURCE,
      headerName: COLUMN_HEADERS.SOURCE,
      flex:NUMBERMAP.ONE,
    },
    {
      field: COLUMN_FIELDS.UPLOAD_DATE,
      headerName: COLUMN_HEADERS.DATE_OF_UPLOAD,
      flex:NUMBERMAP.ONE_HALF,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.uploadDate) {
          return params.row.uploadDate
        }
        // If no uploadDate, format the current date in DD-MM-YYYY format using UTC
        return convertUtcToLocal(new Date().toISOString(), DATE_FORMATS.DD_MM_YYYY)
      },
    },
    {
      field: COLUMN_FIELDS.CATEGORY_ID,
      headerName: COLUMN_HEADERS.FILE_CATEGORY,
      flex:NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        let category = categoryList?.data.find(
          (cat) => cat.category_id === params.row.categoryId
        )
        return category?.file_category ?? ''
      },
    },
    {
      field: COLUMN_FIELDS.STATUS,
      headerName: COLUMN_HEADERS.FILE_STATUS,
      flex:NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <ActionButtonsContainer>
          <Typography color="success.main">
            {Number(params.row.status) === NUMBERMAP.ONE
              ? FILE_STATUS.ACTIVE
              : FILE_STATUS.PENDING}
          </Typography>
        </ActionButtonsContainer>
      ),
    },
    {
      field: COLUMN_FIELDS.ACTIONS,
      headerName: COLUMN_HEADERS.ACTIONS,
      flex:NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => (
        <ActionButtonsContainer>
          <Box sx={STYLES.FLEX_GAP_16}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                handleFileDownload(params.row)
              }}
              size={STYLES.SIZE}
              color={STYLES.colour}
              sx={DownloadIconSx}
            >
              <Download style={STYLES.FONTSIZE_24} />
            </IconButton>
            <IconButton
              onClick={() => handleEditClick(params.row)}
              size={STYLES.SIZE}
            >
              <Edit
                size={NUMBERMAP.EIGHTEEN}
                color={theme.palette.success.main}
              />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteClick(params.row)}
              size={STYLES.SIZE}
            >
              <Trash
                size={NUMBERMAP.EIGHTEEN}
                color={theme.palette.error.main}
              />
            </IconButton>
          </Box>
        </ActionButtonsContainer>
      ),
    },
  ]
  return (
    <FileUploadContainer ref={ref} >
      {/* Header */}
      {!subHeader && (
        <HeaderContainer>
          <HeaderTitle>Upload Files</HeaderTitle>
        </HeaderContainer>
      )}

      { }
      <ContentContainer>
        <UploadSection>
          <UploadContainer>
            {subHeader && <UploadLabel>{subHeader}</UploadLabel>}
            <Box sx={{...STYLES.MARGIN_TOP_10,pointerEvents:hasEditable?'none':''}}>
              <FileUpload
                onChange={handleFileUpload}
                error={uploadError ?? uploadMandError ?? ''}
                accept={allowedFileTypes??null}
                supportedFormats={allowedFileTypes === "image/*" ? "All Image Formats" : (allowedFileTypes ?? null)}
              />
            </Box>

            { }
            <FileInfoContainer>
              <FileInfoLabel>Files Information</FileInfoLabel>
              <DataGridTable
                rows={files}
                columns={columns}
                idField={ID}
                hideFooter
              />
            </FileInfoContainer>
          </UploadContainer>
        </UploadSection>

        { }
        {showEditForm && (
          <EditFormContainer>
            <EditFormInnerContainer>
              <EditFormContent>
                <EditFormTitle>Edit Files</EditFormTitle>
                <EditFormFields>
                  <Grid2 container spacing={NUMBERMAP.ONE}>
                    { }
                    <Grid2 size={{ md: width == NUMBERMAP.SIXHUNDREDSEVENTYTWO ? NUMBERMAP.TWELVE : NUMBERMAP.SIX }}>
                      <LabelContainer>
                        <LabelTitle>File Name</LabelTitle>
                        <LabelValue>{formData.fileName}</LabelValue>
                      </LabelContainer>
                    </Grid2>
                    <Grid2 size={{ md: width == NUMBERMAP.SIXHUNDREDSEVENTYTWO ? NUMBERMAP.TWELVE : NUMBERMAP.SIX }}>

                      <LabelContainer>
                        <LabelTitle>File Status</LabelTitle>
                        <LabelValue>
                          {Number(formData.file_status) === ACTIVE_STATUS
                            ? FILE_STATUS_ACTIVE
                            : FILE_STATUS_PENDING}
                        </LabelValue>
                      </LabelContainer>
                    </Grid2>
                    <Grid2 size={{ md: width == NUMBERMAP.SIXHUNDREDSEVENTYTWO ? NUMBERMAP.TWELVE : NUMBERMAP.SIX }}>

                      <InputField
                        label={LABEL_PURPOSE}
                        placeholder={PURPOSE}
                        value={formData.purpose}
                        onChange={(value: string) =>
                          handleInputChange(FIELD_PURPOSE, value)
                        }
                        error={formErrors.purpose}
                      />

                    </Grid2>
                    <Grid2 size={{ md: width == NUMBERMAP.SIXHUNDREDSEVENTYTWO ? NUMBERMAP.TWELVE : NUMBERMAP.SIX }}>

                      <InputField
                        label={LABEL_CATEGORY}
                        placeholder={CATEGORY}
                        isDropdown={true}
                        options={categoryList?.data}
                        valueField={CATEGORY_NAME}
                        keyField={CATEGORY_ID}
                        value={String(formData.categoryId)}
                        onChange={(value: number | string) =>
                          handleInputChange(FIELD_CATEGORY, Number(value))
                        }
                        error={formErrors.categoryId}
                      />

                    </Grid2>
                    <Grid2 size={{ md: width == NUMBERMAP.SIXHUNDREDSEVENTYTWO ? NUMBERMAP.TWELVE : NUMBERMAP.SIX }}>

                      <TagsInput
                        label={LABEL_TAGS}
                        placeholder={formData?.tags.length > NUMBERMAP.ZERO ? "" : TAGS}
                        options={listedTags}
                        value={formData.tags ?? []}
                        onChange={(value) =>
                          handleInputChange(FIELD_TAGS, value)
                        }
                        error={formErrors.tags}
                        keyField={TAGS_KEY_VALUE}
                        valueField={TAGS_KEY_VALUE}
                      />
                    </Grid2>

                    { }
                    <Grid2 size={{ md: width == NUMBERMAP.SIXHUNDREDSEVENTYTWO ? NUMBERMAP.TWELVE : NUMBERMAP.SIX }}>
                      <InputField
                        label={LABEL_SOURCE}
                        placeholder={SOURCE}
                        value={formData.source}
                        onChange={(value: string) =>
                          handleInputChange(FIELD_SOURCE, value)
                        }
                        error={formErrors.source}
                      />
                    </Grid2>
                    <Grid2 size={{ md: width == NUMBERMAP.SIXHUNDREDSEVENTYTWO ? NUMBERMAP.TWELVE : NUMBERMAP.SIX }}>
                      <Description
                        label={LABEL_DESCRIPTION}
                        placeholder={DESCRIPTION}
                        value={formData.description ?? ''}
                        onChange={(value) =>
                          handleInputChange(FIELD_DESCRIPTON, value)
                        }
                        error={formErrors.description}
                      />
                      {/* </Box> */}


                    </Grid2>
                    <Grid2 size={NUMBERMAP.TWELVE}>
                      <ButtonGroup
                        buttons={[
                          {
                            label: BUTTONLABELS.BUTTON_LABEL_CANCEL,
                            onClick: handleCancelForm,
                          },
                          {
                            label: BUTTONLABELS.BUTTON_LABEL_SAVE,
                            onClick: () => {
                              handleSaveForm()
                            },
                          },
                        ]}
                      />
                    </Grid2>
                  </Grid2>
                </EditFormFields>
              </EditFormContent>
            </EditFormInnerContainer>
          </EditFormContainer>
        )}
      </ContentContainer>
    </FileUploadContainer>
  )
}

export default FileUploadManager