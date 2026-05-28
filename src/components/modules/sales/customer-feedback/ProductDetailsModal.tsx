'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import { InputField, ButtonGroup } from '@/components/ui'
import { ContentWrapper } from '@/styles/modules/dnd/feasibilityStudy'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { NUMBERMAP, FINALFILEINITIALDATA } from '@/constants/common'
import { mergeFinalFileData, FinalFileData } from '@/lib/utils/common'
import { MODAL_STYLES } from '@/styles/modules/dnd/verification'
import { FileData, FileDocument } from '@/types/components/ui/fileUploadV3'

interface ProductDetailsModalProps {
  onClose: () => void
  onSave: (data: ProductFormData) => void
  mode?: 'add' | 'edit'
  productId?: string
  initialData?: ProductFormData
}

interface ProductFormData {
  name: string
  role: string
  document: (FileData | FileDocument)[]
  fileData?: FinalFileData
}

interface DocumentStructure {
  create_meta_data: { [key: string]: any }
  update_meta_data: { [key: string]: any }
  documents_to_create: any[]
  documents_to_delete: string[]
  local_files_to_delete: string[]
}

const INITIAL_FORM_DATA: ProductFormData = {
  name: '',
  role: '',
  document: [],
}

const INITIAL_ERRORS = {
  name: '',
  role: '',
  file: '',
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  onClose,
  onSave,
  mode = 'add',
  productId,
  initialData,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData ?? INITIAL_FORM_DATA
  )
  const [errors, setErrors] = useState<typeof INITIAL_ERRORS>(INITIAL_ERRORS)
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [fileManagerKey, setFileManagerKey] = useState(NUMBERMAP.ZERO)

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      // Initialize finalFileData from existing fileData or reset to initial state
      if (initialData.fileData) {
        setFinalFileData(initialData.fileData)
      } else {
        setFinalFileData(FINALFILEINITIALDATA)
      }
      setFileManagerKey(prev => prev + 1) // Force re-render of FileUploadManager
    } else {
      // Reset to initial state when no initialData (add mode)
      setFormData(INITIAL_FORM_DATA)
      setFinalFileData(FINALFILEINITIALDATA)
      setFileManagerKey(prev => prev + 1)
    }
  }, [initialData])

  const validateForm = (): boolean => {
    const newErrors = { ...INITIAL_ERRORS }
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required'
      isValid = false
    }

    if (formData.document.length === 0) {
      newErrors.file = 'File upload is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // File upload handlers based on sample purchase order pattern
  const handleFileUpload = useCallback((newFile: FileData) => {
    setFormData((prev) => ({
      ...prev,
      document: [...(prev.document ?? []), newFile] as FileData[] | FileDocument[],
    }));
    // Clear file upload validation error when file is uploaded
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  }, [errors.file]);

  const handleFileEdit = useCallback((updatedFile: any) => {
    setFormData((prev) => {
      const updatedFiles = prev.document.map((file) => {
        const currentId = typeof file === 'object' && 'id' in file
          ? (file as Record<string, unknown>).id
          : undefined;
        const updatedId = updatedFile.document_id ?? updatedFile.id;
        return currentId === updatedId ? { ...file, ...updatedFile } : file;
      });
      return {
        ...prev,
        document: updatedFiles,
      };
    });
  }, []);

  const handleFileSubmit = useCallback((data: any) => {
    setFinalFileData((prev) => {
      const merged = mergeFinalFileData(prev, data);
      return merged;
    });
    // Clear file upload validation error when files are submitted
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  }, [errors.file]);

  const handleCancel = () => {
    setFormData(INITIAL_FORM_DATA)
    setErrors(INITIAL_ERRORS)
    setFinalFileData(FINALFILEINITIALDATA)
    onClose()
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    // Always pass fileData, even if it's initial state (to preserve existing metadata in edit mode)
    onSave({ ...formData, fileData: finalFileData })
    handleCancel()
  }

  return (
    <ContentWrapper>
      <Grid2
        container spacing={NUMBERMAP.ONE_QUARTER}
        sx={MODAL_STYLES.scrollableContainer}
      >
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="Name*"
            placeholder="Enter Name"
            value={formData.name}
            onChange={(value: string) => handleInputChange('name', value)}
            error={errors.name}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="Role*"
            placeholder="Enter Role"
            value={formData.role}
            onChange={(value: string) => handleInputChange('role', value)}
            error={errors.role}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <FileUploadManager
            key={`file-manager-${fileManagerKey}`}
            subHeader="Upload Supporting Documents*"
            initialFiles={formData.document as any}
            onFileUpload={handleFileUpload}
            onFileEdit={handleFileEdit as any}
            onSubmit={handleFileSubmit}
            uploadMandError={errors.file}
          />
        </Grid2>
      </Grid2>
      <ButtonGroup
        buttons={[
          { label: 'Cancel', onClick: handleCancel },
          { label: 'Save', onClick: handleSubmit },
        ]}
      />
    </ContentWrapper>
  )
}

export default ProductDetailsModal