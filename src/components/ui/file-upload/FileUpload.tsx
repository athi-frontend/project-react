'use client'
import React, { useRef } from 'react'
import {
  UploadIcon,
  UploadContainer,
  UploadText,
  SupportedFormats,
  HiddenInput,
} from '@/styles/components/ui/fileupload'
import { FileUploadProps } from '@/types/common'
import { ErrorText } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'

const FileUpload: React.FC<FileUploadProps> = ({ onChange, error, accept = ".pdf,.docx,.xlsx", supportedFormats = "PDF, DOCX, XLSX" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

   const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    onChange(file)
    clearFileInput()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    onChange(file)
    clearFileInput()
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <UploadContainer
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      <UploadIcon />
      <UploadText>Drop your file here or Browse</UploadText>
      <SupportedFormats>
        Supports {supportedFormats??'PDF, DOCX, XLSX'} (up to {NUMBERMAP.FIVE} MB).
      </SupportedFormats>
      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept??".pdf,.docx,.xlsx"}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </UploadContainer>
  )
}

export default FileUpload
