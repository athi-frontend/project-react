'use client'
import React, { useEffect, useState } from 'react'
import FileUpload from '@/components/ui/file-upload/FileUpload'
import UploadedFilesList from './UploadedFilesList'
import { Container } from '@/styles/common'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { InputLabel } from '@/styles/components/ui/input'
import { STATUS } from '@/constants/common'
import { FileUploadSectionProps } from '@/types/components/ui/fileUpload'

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  label,
  handleFileUpload,
  files,
  error,
  onDelete,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileChange = (file: File | null) => {
    if (file) {
      let files = [...uploadedFiles, file]
      setUploadedFiles(files)
      handleFileUpload(files)
    }
  }

  const handleFileDelete = async (index: number) => {
    const isDelete = await showActionAlert(STATUS.DELETE)
    if (isDelete.isConfirmed) {
      let files = [...uploadedFiles]
      const deletedFile = files[index]

      let documentIdToDelete: number[] = []

      if (!(deletedFile instanceof File) && deletedFile.document_id) {
        documentIdToDelete.push(deletedFile.document_id)
      }

      files = files.filter((_, i) => i !== index)
      setUploadedFiles(files)
      handleFileUpload(files)
      onDelete(documentIdToDelete)
    }
  }

  useEffect(() => {
    setUploadedFiles(files)
  }, [files])
  return (
    <Container>
      <InputLabel>{label}</InputLabel>
      <FileUpload onChange={handleFileChange} error={error} />
      <UploadedFilesList files={uploadedFiles} onDelete={handleFileDelete} />
    </Container>
  )
}

export default FileUploadSection
